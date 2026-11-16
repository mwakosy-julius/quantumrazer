"use server";

import { getProducts } from "@/lib/data/products";
import { mapProductListRowToSummary } from "@/lib/mappers/product";
import { prisma } from "@/lib/prisma";
import { ProductFilterSchema } from "@/lib/validations";

export async function getSearchSuggestionsQuery(q: string): Promise<string[]> {
  const term = q.trim();
  if (term.length < 2) return [];
  const rows = await prisma.product.findMany({
    where: { isActive: true, name: { contains: term, mode: "insensitive" } },
    take: 6,
    select: { name: true },
  });
  return rows.map((r) => r.name);
}

export type QuickSearchItem = {
  slug: string;
  name: string;
  brand: string;
  price: string | null;
  comparePrice: string | null;
  imageUrl: string | null;
  spec: string | null;
};

/** Live results for the homepage product finder. */
export async function searchProductsQuick(q: string): Promise<{ items: QuickSearchItem[]; total: number }> {
  const term = q.trim().slice(0, 80);
  if (term.length < 2) return { items: [], total: 0 };
  const filters = ProductFilterSchema.parse({ page: 1, limit: 8, sort: "newest" });
  const { products, total } = await getProducts({ ...filters, q: term });
  const items = products.map(mapProductListRowToSummary).map((p) => ({
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    price: p.min_price,
    comparePrice: p.is_on_sale ? p.max_price : null,
    imageUrl: p.primary_image_url,
    spec: p.spec_preview ?? null,
  }));
  return { items, total };
}
