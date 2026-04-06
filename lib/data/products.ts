import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { ProductFilters } from "@/lib/validations";

export const getHomepageData = unstable_cache(
  async () => {
    const listInclude = {
      images: { orderBy: { displayOrder: "asc" as const }, take: 2 },
      variants: { take: 8, orderBy: { price: "asc" as const } },
      reviews: { select: { rating: true } },
      category: { select: { slug: true } },
    };

    const [featured, newArrivals, trending, collections] = await Promise.all([
      prisma.product.findMany({
        where: { isFeatured: true, isActive: true },
        include: listInclude,
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        where: { isNew: true, isActive: true },
        include: listInclude,
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        include: listInclude,
        take: 8,
        orderBy: { reviews: { _count: "desc" } },
      }),
      prisma.collection.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);
    return { featured, newArrivals, trending, collections };
  },
  ["homepage-data-v2"],
  { revalidate: 3600, tags: ["products", "collections"] },
);

export async function getProducts(filters: ProductFilters) {
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(filters.category && { category: { slug: filters.category } }),
    ...(filters.collection && { collection: { handle: filters.collection } }),
    ...(filters.gender && { gender: filters.gender }),
    ...(filters.sport && { sport: { contains: filters.sport, mode: "insensitive" } }),
    ...(filters.isNew === true && { isNew: true }),
    ...(filters.isFeatured === true && { isFeatured: true }),
    ...(filters.q && {
      OR: [
        { name: { contains: filters.q, mode: "insensitive" } },
        { description: { contains: filters.q, mode: "insensitive" } },
        { sport: { contains: filters.q, mode: "insensitive" } },
      ],
    }),
  };

  const sizes = filters.sizes?.split(",").filter(Boolean) ?? [];
  const colors = filters.colors?.split(",").filter(Boolean) ?? [];

  const priceWhere: Prisma.DecimalFilter = {};
  if (filters.minPrice !== undefined) priceWhere.gte = filters.minPrice;
  if (filters.maxPrice !== undefined) priceWhere.lte = filters.maxPrice;

  if (sizes.length || colors.length || Object.keys(priceWhere).length > 0) {
    where.variants = {
      some: {
        inventoryCount: { gt: 0 },
        ...(sizes.length ? { size: { in: sizes } } : {}),
        ...(colors.length
          ? {
              OR: colors.map((c) => ({ colorName: { contains: c, mode: "insensitive" as const } })),
            }
          : {}),
        ...(Object.keys(priceWhere).length ? { price: priceWhere } : {}),
      },
    };
  } else {
    where.variants = { some: { inventoryCount: { gt: 0 } } };
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (filters.sort === "popular") {
    orderBy = { reviews: { _count: "desc" } };
  }

  const skip = (filters.page - 1) * filters.limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: filters.limit,
      include: {
        images: { orderBy: { displayOrder: "asc" }, take: 2 },
        variants: true,
        reviews: { select: { rating: true } },
        category: { select: { slug: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  let sorted = products;
  if (filters.sort === "price_asc" || filters.sort === "price_desc") {
    sorted = [...products].sort((a, b) => {
      const minA = Math.min(...a.variants.map((v) => Number(v.price)));
      const minB = Math.min(...b.variants.map((v) => Number(v.price)));
      return filters.sort === "price_asc" ? minA - minB : minB - minA;
    });
  }

  return {
    products: sorted,
    total,
    pages: Math.max(1, Math.ceil(total / filters.limit)),
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { displayOrder: "asc" } },
      variants: { orderBy: [{ colorName: "asc" }, { size: "asc" }] },
      reviews: {
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 12,
      },
      category: true,
    },
  });

  if (!product) return null;

  const [related, reviewAgg] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        id: { not: product.id },
        ...(product.categoryId ? { categoryId: product.categoryId } : { isFeatured: true }),
      },
      include: {
        images: { orderBy: { displayOrder: "asc" }, take: 2 },
        variants: { take: 8, orderBy: { price: "asc" } },
        reviews: { select: { rating: true } },
        category: { select: { slug: true } },
      },
      take: 4,
    }),
    prisma.review.aggregate({
      where: { productId: product.id },
      _avg: { rating: true },
      _count: { _all: true },
    }),
  ]);

  return {
    product,
    related,
    reviewAvg: reviewAgg._avg.rating,
    reviewCount: reviewAgg._count._all,
  };
}

export async function getCollectionByHandle(handle: string) {
  return prisma.collection.findFirst({
    where: { handle, isActive: true },
  });
}

/** Products with at least one variant where compare-at price is greater than current price. */
export async function getSaleProducts(page: number, limit: number) {
  const rows = await prisma.product.findMany({
    where: {
      isActive: true,
      variants: { some: { compareAtPrice: { not: null } } },
    },
    include: {
      images: { orderBy: { displayOrder: "asc" }, take: 2 },
      variants: true,
      reviews: { select: { rating: true } },
      category: { select: { slug: true } },
    },
  });

  const filtered = rows.filter((p) =>
    p.variants.some((v) => v.compareAtPrice != null && Number(v.compareAtPrice) > Number(v.price)),
  );
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const slice = filtered.slice((page - 1) * limit, page * limit);
  return { products: slice, total, pages };
}
