import { ProductCard } from "@/components/product/ProductCard";
import type { ProductSummary } from "@/types";

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <div key={p.id}>
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
