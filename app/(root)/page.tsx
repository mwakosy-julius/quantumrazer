import type { Category, Product, ProductImage, ProductVariant } from "@prisma/client";

import { HomePageClient } from "@/components/home/HomePageClient";
import type { SerializedFeaturedProduct } from "@/components/home/home-types";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

const SLUGS = [
  "asus-rog-zephyrus-g16",
  "macbook-pro-14-m3",
  "lenovo-thinkpad-x1-carbon-gen12",
  "asus-proart-studiobook-16",
  "samsung-galaxy-book4-ultra",
] as const;

type ProductWithRelations = Product & {
  images: ProductImage[];
  variants: ProductVariant[];
  category: Category | null;
};

function serializeProduct(p: ProductWithRelations): SerializedFeaturedProduct | null {
  if (!p.variants.length) return null;
  const prices = p.variants.map((v) => Number(v.price));
  const minP = Math.min(...prices);
  const compares = p.variants
    .map((v) => (v.compareAtPrice != null ? Number(v.compareAtPrice) : null))
    .filter((x): x is number => x != null);
  const maxCompare = compares.length ? Math.max(...compares) : null;
  const sortedImages = [...p.images].sort((a, b) => a.displayOrder - b.displayOrder);
  const primary = sortedImages.find((i) => i.isPrimary) ?? sortedImages[0];
  return {
    slug: p.slug,
    name: p.name,
    description: p.description,
    categoryName: p.category?.name ?? null,
    imageUrl: primary?.url ?? null,
    minPrice: minP.toFixed(2),
    compareAtPrice: maxCompare != null ? maxCompare.toFixed(2) : null,
  };
}

export default async function HomePage() {
  const featuredBySlug: Record<string, SerializedFeaturedProduct | null> = {};

  try {
    const products = await Promise.all(
      SLUGS.map((slug) =>
        prisma.product.findUnique({
          where: { slug },
          include: {
            images: { orderBy: { displayOrder: "asc" } },
            variants: { orderBy: { price: "asc" } },
            category: true,
          },
        }),
      ),
    );
    for (const p of products) {
      if (p) featuredBySlug[p.slug] = serializeProduct(p);
    }
  } catch {
    for (const s of SLUGS) featuredBySlug[s] = null;
  }

  return <HomePageClient featuredBySlug={featuredBySlug} />;
}
