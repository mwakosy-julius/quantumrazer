import Link from "next/link";

import { ProductGrid } from "@/components/product/ProductGrid";
import { getProducts } from "@/lib/data/products";
import { mapProductListRowToSummary } from "@/lib/mappers/product";
import { parseProductFilters } from "@/lib/parse-product-filters";

export const revalidate = 120;

type Props = { searchParams: Record<string, string | string[] | undefined> };

const genderTitle: Record<string, string> = {
  MENS: "Men's",
  WOMENS: "Women's",
  KIDS: "Kids'",
  UNISEX: "Unisex",
};

export async function generateMetadata({ searchParams }: Props) {
  const filters = parseProductFilters(searchParams);
  const g = filters.gender;
  const title = g ? `${genderTitle[g] ?? "All"} Products` : "All Products";
  return { title };
}

export default async function ProductsPage({ searchParams }: Props) {
  const filters = parseProductFilters(searchParams);
  const { products, total, pages } = await getProducts(filters);
  const summaries = products.map(mapProductListRowToSummary);

  const qs = new URLSearchParams();
  const keys = ["category", "collection", "gender", "sport", "sort", "is_new", "is_featured", "page", "q"];
  for (const k of keys) {
    const v = Array.isArray(searchParams[k]) ? searchParams[k]?.[0] : searchParams[k];
    if (v) qs.set(k, v);
  }
  if (!qs.has("page")) qs.set("page", "1");
  if (!qs.has("limit")) qs.set("limit", String(filters.limit));

  const page = filters.page;

  return (
    <div className="mx-auto max-w-content px-[var(--content-padding)] py-10">
      <nav className="mb-6 text-[13px] text-grey-500">
        <Link href="/">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-black">Products</span>
      </nav>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Products</h1>
          <p className="mt-1 text-[14px] text-grey-500">{total} Results</p>
        </div>
        <div className="flex flex-wrap gap-2 text-[13px]">
          <Link className="rounded-full border border-grey-200 px-3 py-1 hover:border-black" href="/products?gender=MENS">
            Men
          </Link>
          <Link className="rounded-full border border-grey-200 px-3 py-1 hover:border-black" href="/products?gender=WOMENS">
            Women
          </Link>
          <Link className="rounded-full border border-grey-200 px-3 py-1 hover:border-black" href="/products?sort=price_asc">
            Price: Low-High
          </Link>
          <Link className="rounded-full border border-grey-200 px-3 py-1 hover:border-black" href="/products?sort=newest">
            Newest
          </Link>
        </div>
      </div>
      <ProductGrid products={summaries} />
      <div className="mt-12 flex justify-center gap-4 text-[14px]">
        {page > 1 && (
          <Link
            href={`/products?${(() => {
              const p = new URLSearchParams(qs);
              p.set("page", String(page - 1));
              return p.toString();
            })()}`}
          >
            Previous
          </Link>
        )}
        {page < pages && (
          <Link
            href={`/products?${(() => {
              const p = new URLSearchParams(qs);
              p.set("page", String(page + 1));
              return p.toString();
            })()}`}
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
