import { HomePageClient } from "@/components/home/HomePageClient";
import { getProducts } from "@/lib/data/products";
import { mapProductListRowToSummary } from "@/lib/mappers/product";
import type { ReviewSummary } from "@/lib/narratives";
import { prisma } from "@/lib/prisma";
import { ProductFilterSchema } from "@/lib/validations";
import type { ProductSummary } from "@/types";

export const revalidate = 3600;

export default async function HomePage() {
  let latest: ProductSummary[] = [];
  try {
    const filters = ProductFilterSchema.parse({ page: 1, limit: 12, sort: "newest" });
    const { products } = await getProducts(filters);
    latest = products.map(mapProductListRowToSummary);
  } catch {
    latest = [];
  }

  let reviewSummary: ReviewSummary | null = null;
  try {
    const agg = await prisma.review.aggregate({ _avg: { rating: true }, _count: { _all: true } });
    if (agg._count._all > 0 && agg._avg.rating != null) {
      reviewSummary = { average: agg._avg.rating, count: agg._count._all };
    }
  } catch {
    reviewSummary = null;
  }

  return <HomePageClient latestProducts={latest} reviewSummary={reviewSummary} />;
}
