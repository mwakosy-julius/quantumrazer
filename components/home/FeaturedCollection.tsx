import Link from "next/link";

import { ProductCard } from "@/components/product/ProductCard";
import type { ProductSummary } from "@/types";

export function FeaturedCollection({ title, products }: { title: string; products: ProductSummary[] }) {
  return (
    <section className="bg-white px-[var(--content-padding)] py-16">
      <div className="mx-auto flex max-w-content items-center justify-between">
        <h2 className="text-[28px] font-black">{title}</h2>
        <Link href="/products?is_featured=true" className="text-[14px] underline">
          Shop All
        </Link>
      </div>
      <div className="mx-auto mt-8 flex max-w-content gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <div key={p.id} className="w-[45vw] shrink-0 sm:w-[280px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
