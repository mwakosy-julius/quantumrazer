"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ProductSummary } from "@/types";

import { ProductCard } from "./ProductCard";

const AUTO_ADVANCE_MS = 3200;

/**
 * One row of products that glides sideways by itself. The product in the
 * middle is in focus (full size); the ones beside it are smaller.
 * It pauses while the customer hovers, touches or tabs into it.
 */
export function ProductRow({ products, label }: { products: ProductSummary[]; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  const goTo = useCallback(
    (index: number, instant = false) => {
      const track = trackRef.current;
      const count = products.length;
      if (!track || count === 0) return;
      const next = ((index % count) + count) % count;
      const item = itemRefs.current[next];
      if (!item) return;
      const left = item.offsetLeft - (track.clientWidth - item.offsetWidth) / 2;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollTo({ left, behavior: instant || reduce ? "auto" : "smooth" });
    },
    [products.length],
  );

  /** Whichever card sits closest to the middle of the row is the focused one. */
  const syncActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const middle = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDistance = Infinity;
    itemRefs.current.forEach((item, i) => {
      if (!item) return;
      const distance = Math.abs(item.offsetLeft + item.offsetWidth / 2 - middle);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });
    if (best !== activeRef.current) {
      activeRef.current = best;
      setActive(best);
    }
  }, []);

  // Start with a product in the middle so there is something on both sides.
  useEffect(() => {
    const start = Math.min(1, products.length - 1);
    activeRef.current = start;
    setActive(start);
    goTo(start, true);
  }, [goTo, products.length]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    setAutoPlay(!reduce.matches);
    const onChange = () => setAutoPlay(!reduce.matches);
    reduce.addEventListener("change", onChange);
    return () => reduce.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoPlay || paused || !inView || products.length < 2) return;
    const timer = setInterval(() => goTo(activeRef.current + 1), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [autoPlay, paused, inView, products.length, goTo]);

  const arrow =
    "flex h-11 w-11 items-center justify-center rounded-full bg-grey-100 text-black transition-colors hover:bg-grey-200";

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        onScroll={syncActive}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        className="relative -mx-6 flex snap-x snap-mandatory items-center overflow-x-auto py-6 [scrollbar-width:none] md:mx-0 [&::-webkit-scrollbar]:hidden"
      >
        {/* Spacers let the first and last product reach the middle. */}
        <div aria-hidden className="w-[calc(50%-31vw)] shrink-0 sm:w-[calc(50%-130px)] md:w-[calc(50%-150px)]" />
        {products.map((p, i) => {
          const isActive = i === active;
          return (
            <div
              key={p.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              aria-current={isActive ? "true" : undefined}
              className="w-[62vw] shrink-0 snap-center px-2 sm:w-[260px] md:w-[300px] md:px-3"
            >
              <div
                className={`origin-center transition-transform duration-500 ease-out motion-reduce:transition-none ${
                  isActive ? "scale-100" : "scale-[0.82]"
                }`}
              >
                <ProductCard product={p} />
              </div>
            </div>
          );
        })}
        <div aria-hidden className="w-[calc(50%-31vw)] shrink-0 sm:w-[calc(50%-130px)] md:w-[calc(50%-150px)]" />
      </div>

      <div className="mt-2 flex items-center justify-between gap-4">
        <p className="text-[13px] tabular-nums text-grey-500" aria-live="off">
          {active + 1} / {products.length}
        </p>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous product" onClick={() => goTo(active - 1)} className={arrow}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" aria-label="Next product" onClick={() => goTo(active + 1)} className={arrow}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
