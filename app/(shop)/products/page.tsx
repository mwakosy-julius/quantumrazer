import Link from "next/link";
import { Suspense } from "react";

import { LaptopBagsFilterUI } from "@/components/plp/LaptopBagsFilterUI";
import { PLPActiveChips } from "@/components/plp/PLPActiveChips";
import { PLPSidebar } from "@/components/plp/PLPSidebar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductSortSelect } from "@/components/plp/ProductSortSelect";
import { getProducts } from "@/lib/data/products";
import { mapProductListRowToSummary } from "@/lib/mappers/product";
import { parseProductFilters } from "@/lib/parse-product-filters";

export const revalidate = 120;

type Props = { searchParams: Record<string, string | string[] | undefined> };

function plpHeading(filters: ReturnType<typeof parseProductFilters>) {
  if (filters.category === "laptop-bags") return "Laptop Bags";
  if (filters.category) return filters.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  if (filters.sport) return filters.sport;
  if (filters.isFeatured) return "Creator Picks";
  if (filters.isNew) return "New Arrivals";
  if (filters.q) return "Search";
  return "All Gear";
}

export async function generateMetadata({ searchParams }: Props) {
  const filters = parseProductFilters(searchParams);
  return { title: plpHeading(filters) };
}

export default async function ProductsPage({ searchParams }: Props) {
  const filters = parseProductFilters(searchParams);
  const { products, total, pages } = await getProducts(filters);
  const summaries = products.map(mapProductListRowToSummary);

  const qs = new URLSearchParams();
  const keys = ["category", "collection", "gender", "sport", "sort", "is_new", "is_featured", "page", "q", "minPrice", "maxPrice"];
  for (const k of keys) {
    const v = Array.isArray(searchParams[k]) ? searchParams[k]?.[0] : searchParams[k];
    if (v) qs.set(k, v);
  }
  if (!qs.has("page")) qs.set("page", "1");
  if (!qs.has("limit")) qs.set("limit", String(filters.limit));

  const page = filters.page;
  const heading = plpHeading(filters);
  const isBags = filters.category === "laptop-bags";

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-content px-6 pb-6 pt-6 md:px-[var(--content-padding)]">
        <h1 className="text-[28px] font-bold capitalize text-black">{heading}</h1>
        <p className="mt-1 text-[13px] text-grey-500">
          {total} {total === 1 ? "Product" : "Products"}
        </p>
      </div>

      <div className="mx-auto flex max-w-content flex-col gap-8 px-6 pb-12 md:px-[var(--content-padding)] lg:flex-row">
        <div className="hidden lg:block">
          <PLPSidebar filters={filters} />
        </div>
        <div className="min-w-0 flex-1">
          {isBags && <LaptopBagsFilterUI />}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <PLPActiveChips filters={filters} />
            <Suspense fallback={<div className="h-10 w-[160px] rounded-sm bg-grey-100" aria-hidden />}>
              <ProductSortSelect currentSort={filters.sort} />
            </Suspense>
          </div>
          <ProductGrid products={summaries} />
          <nav className="mt-12 flex flex-wrap items-center justify-center gap-6 text-[15px] text-black">
            {page > 1 && (
              <Link className="underline hover:text-grey-500" href={`/products?${(() => {
                const p = new URLSearchParams(qs);
                p.set("page", String(page - 1));
                return p.toString();
              })()}`}>
                Previous
              </Link>
            )}
            <span className="font-bold underline">{page}</span>
            {page < pages && (
              <Link className="underline hover:text-grey-500" href={`/products?${(() => {
                const p = new URLSearchParams(qs);
                p.set("page", String(page + 1));
                return p.toString();
              })()}`}>
                Next
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
