import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import type { ProductSummary } from "@/types";

export function TrendingProducts({ products }: { products: ProductSummary[] }) {
  return (
    <div className="bg-grey-100">
      <FeaturedCollection title="Trending Now" products={products} />
    </div>
  );
}
