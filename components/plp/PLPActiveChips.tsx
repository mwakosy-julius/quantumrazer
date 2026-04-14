"use client";

import Link from "next/link";

import { formatMoney, PLP_PRICE_SLIDER_MAX } from "@/lib/currency";
import type { ProductFilters } from "@/lib/validations";

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

export function PLPActiveChips({ filters }: { filters: ProductFilters }) {
  const items: { label: string; href: string }[] = [];
  if (filters.category) items.push({ label: filters.category, href: buildHref(filters, { category: undefined }) });
  if (filters.gender) items.push({ label: filters.gender, href: buildHref(filters, { gender: undefined }) });
  if (filters.q) items.push({ label: filters.q, href: buildHref(filters, { q: undefined }) });
  if (filters.minPrice != null || filters.maxPrice != null) {
    const lo = filters.minPrice ?? 0;
    const hi = filters.maxPrice ?? PLP_PRICE_SLIDER_MAX;
    const label =
      filters.minPrice != null && filters.maxPrice != null
        ? `${formatMoney(lo)} – ${formatMoney(hi)}`
        : filters.minPrice != null
          ? `From ${formatMoney(lo)}`
          : `Up to ${formatMoney(hi)}`;
    items.push({
      label,
      href: buildHref(filters, { minPrice: undefined, maxPrice: undefined }),
    });
  }

  if (items.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {items.map((c) => (
        <Link
          key={c.label + c.href}
          href={c.href}
          className="inline-flex items-center gap-2 rounded-pill bg-black px-4 py-2 text-[14px] font-medium text-white"
        >
          {c.label}
          <span className="text-white/80" aria-hidden>
            ×
          </span>
        </Link>
      ))}
      <Link
        href="/products"
        className="inline-flex items-center rounded-pill border border-black bg-white px-4 py-2 text-[14px] font-medium text-black"
      >
        Clear All
      </Link>
    </div>
  );
}
