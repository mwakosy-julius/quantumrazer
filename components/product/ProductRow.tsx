"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ProductSummary } from "@/types";

import { ProductCard } from "./ProductCard";

/** One row of products that swipes sideways, with arrow buttons. */
export function ProductRow({ products, label }: { products: ProductSummary[]; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update, products.length]);

  const move = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: reduce ? "auto" : "smooth" });
  };

  const arrow =
    "flex h-11 w-11 items-center justify-center rounded-full bg-grey-100 text-black transition-opacity hover:bg-grey-200 disabled:cursor-default disabled:opacity-30";

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={update}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-2 [scrollbar-width:none] md:mx-0 md:gap-6 md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="w-[62vw] max-w-[300px] shrink-0 snap-start scroll-ml-6 sm:w-[40vw] md:w-[calc((100%-3rem)/3)] md:max-w-none md:scroll-ml-0 lg:w-[calc((100%-4.5rem)/4)]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" aria-label="Previous products" disabled={!canPrev} onClick={() => move(-1)} className={arrow}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" aria-label="Next products" disabled={!canNext} onClick={() => move(1)} className={arrow}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
