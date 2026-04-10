import Link from "next/link";

import { ProductGrid } from "@/components/product/ProductGrid";
import type { ProductSummary } from "@/types";

export function NewArrivalsSection({ products }: { products: ProductSummary[] }) {
  return (
    <section className="bg-white px-6 py-12 md:px-[var(--content-padding)]">
      <div className="mx-auto max-w-content">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[28px] font-bold text-black">New Arrivals</h2>
          <Link href="/products?sort=newest" className="text-[15px] text-black underline hover:text-grey-500">
            View All
          </Link>
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
