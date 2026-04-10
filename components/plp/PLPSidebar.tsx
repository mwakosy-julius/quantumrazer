"use client";

import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";

import { PLPPriceFilter } from "@/components/plp/PLPPriceFilter";
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

function Chip({
  filters,
  active,
  children,
  patch,
}: {
  filters: ProductFilters;
  active: boolean;
  children: React.ReactNode;
  patch: Partial<ProductFilters>;
}) {
  return (
    <Link
      href={buildHref(filters, patch)}
      className={`inline-block rounded-brand border px-3 py-1.5 text-[14px] ${
        active ? "border-black bg-black text-white" : "border-grey-200 bg-white text-black hover:border-black"
      }`}
    >
      {children}
    </Link>
  );
}

export function PLPSidebar({ filters }: { filters: ProductFilters }) {
  const q = filters.q ?? "";

  return (
    <aside className="w-full shrink-0 lg:w-[260px] lg:pr-6">
      <Accordion.Root type="multiple" defaultValue={["category", "price", "storage"]} className="space-y-0">
        <Accordion.Item value="category" className="border-b border-grey-200">
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full items-center justify-between py-3 text-left text-[15px] font-medium text-black">
              Category
              <span className="text-grey-500">+</span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pb-4">
            <ul className="space-y-3">
              {(
                [
                  ["All", null],
                  ["Laptops", { category: "laptops" as const }],
                  ["Accessories", { category: "accessories" as const }],
                  ["Laptop Bags", { category: "laptop-bags" as const }],
                  ["Gadgets", { category: "gadgets" as const }],
                ] as const
              ).map(([label, patch]) => {
                const active = label === "All" ? !filters.category : filters.category === patch?.category;
                const href =
                  label === "All"
                    ? `/products?sort=${filters.sort}&limit=${filters.limit}`
                    : buildHref(filters, patch!);
                return (
                  <li key={label} className="flex items-center gap-2">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-brand border ${
                        active ? "border-black bg-black" : "border-grey-300 bg-white"
                      }`}
                    >
                      {active && (
                        <svg width="12" height="10" viewBox="0 0 12 10" aria-hidden>
                          <path d="M1 5l3 3 7-7" stroke="white" strokeWidth="1.5" fill="none" />
                        </svg>
                      )}
                    </span>
                    <Link href={href} className={`text-[14px] ${active ? "font-medium text-black" : "text-black"}`}>
                      {label} <span className="text-grey-500"> </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="gender" className="border-b border-grey-200">
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full items-center justify-between py-3 text-left text-[15px] font-medium text-black">
              Gender
              <span className="text-grey-500">+</span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pb-4">
            <ul className="space-y-3">
              {(["MENS", "WOMENS", "KIDS", "UNISEX"] as const).map((g) => {
                const active = filters.gender === g;
                return (
                  <li key={g} className="flex items-center gap-2">
                    <Link href={buildHref(filters, { gender: active ? undefined : g })} className="text-[14px] capitalize text-black">
                      {g.toLowerCase()}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="price" className="border-b border-grey-200">
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full items-center justify-between py-3 text-left text-[15px] font-medium text-black">
              Price Range
              <span className="text-grey-500">+</span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pb-4">
            <PLPPriceFilter filters={filters} />
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="storage" className="border-b border-grey-200">
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full items-center justify-between py-3 text-left text-[15px] font-medium text-black">
              Storage
              <span className="text-grey-500">+</span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pb-4">
            <div className="flex flex-wrap gap-2">
              {(["256GB", "512GB", "1TB", "2TB"] as const).map((s) => (
                <Chip key={s} filters={filters} active={q === s} patch={{ q: s }}>
                  {s}
                </Chip>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="ram" className="border-b border-grey-200">
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full items-center justify-between py-3 text-left text-[15px] font-medium text-black">
              RAM
              <span className="text-grey-500">+</span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pb-4">
            <div className="flex flex-wrap gap-2">
              {(["8GB", "16GB", "32GB", "64GB"] as const).map((s) => (
                <Chip key={s} filters={filters} active={q === s} patch={{ q: s }}>
                  {s}
                </Chip>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="gpu" className="border-b border-grey-200">
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full items-center justify-between py-3 text-left text-[15px] font-medium text-black">
              GPU
              <span className="text-grey-500">+</span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pb-4">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["Integrated", "Integrated"],
                  ["Mid-Range", "RTX 4060"],
                  ["High-End", "RTX 4090"],
                ] as const
              ).map(([label, term]) => (
                <Chip key={label} filters={filters} active={q === term} patch={{ q: term }}>
                  {label}
                </Chip>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>

      <Link href="/products" className="mt-6 inline-block text-[13px] font-medium text-black underline hover:text-grey-500">
        Clear All
      </Link>
    </aside>
  );
}
