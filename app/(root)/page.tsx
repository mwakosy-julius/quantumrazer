import { HomePageClient } from "@/components/home/HomePageClient";
import { getProducts } from "@/lib/data/products";
import { mapProductListRowToSummary } from "@/lib/mappers/product";
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

  return <HomePageClient latestProducts={latest} />;
}
