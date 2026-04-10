"use client";

import { useRouter, useSearchParams } from "next/navigation";

import type { ProductFilters } from "@/lib/validations";

const LABELS: Record<ProductFilters["sort"], string> = {
  newest: "Newest",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  popular: "Popular",
};

export function ProductSortSelect({ currentSort }: { currentSort: ProductFilters["sort"] }) {
  const router = useRouter();
  const sp = useSearchParams();

  return (
    <label className="flex cursor-pointer items-center gap-2 text-[15px] text-black">
      <span className="text-grey-500">Sort By</span>
      <select
        className="appearance-none border-0 bg-transparent pr-6 text-[15px] text-black outline-none hover:text-grey-500 focus:ring-0"
        value={currentSort}
        onChange={(e) => {
          const next = new URLSearchParams(sp.toString());
          next.set("sort", e.target.value);
          next.set("page", "1");
          router.push(`/products?${next.toString()}`);
        }}
      >
        {(Object.keys(LABELS) as ProductFilters["sort"][]).map((k) => (
          <option key={k} value={k}>
            {LABELS[k]}
          </option>
        ))}
      </select>
      <span className="pointer-events-none -ml-4 text-grey-500" aria-hidden>
        ▾
      </span>
    </label>
  );
}
