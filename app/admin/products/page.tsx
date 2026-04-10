import type { Prisma } from "@prisma/client";

import { ProductsAdminClient, type AdminProductRow } from "@/components/admin/ProductsAdminClient";
import { prisma } from "@/lib/prisma";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; filter?: string };
}) {
  const q = searchParams.q?.trim() ?? "";
  const filter = searchParams.filter ?? "all";

  const where: Prisma.ProductWhereInput = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
    ];
  }

  if (filter === "featured") where.isFeatured = true;
  if (filter === "laptops") where.category = { slug: "laptops" };
  if (filter === "accessories") where.category = { slug: "accessories" };
  if (filter === "bags") where.category = { slug: "laptop-bags" };
  if (filter === "gadgets") where.category = { slug: "gadgets" };
  if (filter === "low") {
    where.variants = { some: { inventoryCount: { lte: 10, gte: 1 } } };
  }

  const raw = await prisma.product.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      category: { select: { name: true } },
      images: { orderBy: { displayOrder: "asc" }, take: 1 },
      variants: { select: { price: true, inventoryCount: true } },
    },
  });

  const products: AdminProductRow[] = raw.map((p) => {
    const prices = p.variants.map((v) => Number(v.price));
    const minP = prices.length ? Math.min(...prices) : 0;
    const stock = p.variants.reduce((s, v) => s + v.inventoryCount, 0);
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      categoryLabel: p.category?.name ?? "—",
      primaryImage: p.images[0]?.url ?? null,
      priceLabel: minP.toLocaleString("en-US", { style: "currency", currency: "USD" }),
      stock,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
    };
  });

  return <ProductsAdminClient products={products} q={q} activeFilter={filter} />;
}
