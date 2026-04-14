"use client";

import * as Slider from "@radix-ui/react-slider";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { formatMoney, PLP_PRICE_SLIDER_MAX } from "@/lib/currency";
import type { ProductFilters } from "@/lib/validations";

const SLIDER_MAX = PLP_PRICE_SLIDER_MAX;

function buildHref(filters: ProductFilters, patch: Partial<ProductFilters>): string {
  const next: ProductFilters = { ...filters, ...patch, page: 1 };
  const p = new URLSearchParams();
  if (next.category) p.set("category", next.category);
  if (next.collection) p.set("collection", next.collection);
  if (next.gender) p.set("gender", next.gender);
  if (next.sport) p.set("sport", next.sport);
  if (next.sort) p.set("sort", next.sort);
  if (next.q) p.set("q", next.q);
  if (next.isNew === true) p.set("is_new", "true");
  if (next.isFeatured === true) p.set("is_featured", "true");
  if (next.minPrice != null) p.set("minPrice", String(next.minPrice));
  if (next.maxPrice != null) p.set("maxPrice", String(next.maxPrice));
  if (next.sizes) p.set("sizes", next.sizes);
  if (next.colors) p.set("colors", next.colors);
  p.set("limit", String(next.limit));
  p.set("page", String(next.page));
  return `/products?${p.toString()}`;
}

export function PLPPriceFilter({ filters }: { filters: ProductFilters }) {
  const router = useRouter();
  const lo = filters.minPrice ?? 0;
  const hi = filters.maxPrice ?? SLIDER_MAX;
  const [value, setValue] = useState([lo, hi]);

  useEffect(() => {
    setValue([filters.minPrice ?? 0, filters.maxPrice ?? SLIDER_MAX]);
  }, [filters.minPrice, filters.maxPrice]);

  const hrefForRange = useMemo(
    () => (a: number, b: number) => {
      const patch: Partial<ProductFilters> = {};
      if (a > 0) patch.minPrice = a;
      if (b < SLIDER_MAX) patch.maxPrice = b;
      if (a <= 0) patch.minPrice = undefined;
      if (b >= SLIDER_MAX) patch.maxPrice = undefined;
      return buildHref(filters, patch);
    },
    [filters],
  );

  const apply = useCallback(
    (a: number, b: number) => {
      router.push(hrefForRange(a, b));
    },
    [hrefForRange, router],
  );

  return (
    <div className="pt-2">
      <Slider.Root
        className="relative flex h-5 w-full touch-none select-none items-center"
        value={value}
        onValueChange={setValue}
        onValueCommit={(v) => apply(v[0] ?? 0, v[1] ?? SLIDER_MAX)}
        max={SLIDER_MAX}
        min={0}
        step={100_000}
        minStepsBetweenThumbs={1}
      >
        <Slider.Track className="relative h-0.5 grow rounded-full bg-grey-200">
          <Slider.Range className="absolute h-full rounded-full bg-black" />
        </Slider.Track>
        <Slider.Thumb className="block h-4 w-4 cursor-grab rounded-full bg-black focus:outline-none" aria-label="Min price" />
        <Slider.Thumb className="block h-4 w-4 cursor-grab rounded-full bg-black focus:outline-none" aria-label="Max price" />
      </Slider.Root>
      <p className="mt-2 text-[13px] text-grey-500">
        {formatMoney(value[0] ?? 0)} – {formatMoney(value[1] ?? SLIDER_MAX)}
      </p>
    </div>
  );
}
