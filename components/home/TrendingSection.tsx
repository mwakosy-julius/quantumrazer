"use client";

import Link from "next/link";
import { useRef } from "react";

import { ProductCard } from "@/components/product/ProductCard";
import type { ProductSummary } from "@/types";

export function TrendingSection({ products }: { products: ProductSummary[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => scroller.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

  return (
    <section className="bg-white px-6 py-12 md:px-[var(--content-padding)]">
      <div className="relative mx-auto max-w-content">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[28px] font-bold text-black">Trending</h2>
          <div className="flex items-center gap-4">
            <Link href="/products?sort=popular" className="text-[15px] text-black underline hover:text-grey-500">
              View All
            </Link>
            <div className="hidden gap-2 md:flex">
              <button
                type="button"
                aria-label="Scroll left"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-grey-300 bg-white text-black shadow-arrow transition-all duration-200 hover:border-black hover:bg-black hover:text-white"
                onClick={() => scrollBy(-1)}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Scroll right"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-grey-300 bg-white text-black shadow-arrow transition-all duration-200 hover:border-black hover:bg-black hover:text-white"
                onClick={() => scrollBy(1)}
              >
                →
              </button>
            </div>
          </div>
        </div>
        <div
          ref={scroller}
          className="flex gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((p) => (
            <div key={p.id} className="w-[min(280px,70vw)] shrink-0 md:w-[280px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
