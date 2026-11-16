import Link from "next/link";

import { ProductGrid } from "@/components/product/ProductGrid";
import { whatsappLink } from "@/lib/constants";
import { getProducts } from "@/lib/data/products";
import { mapProductListRowToSummary } from "@/lib/mappers/product";
import { ProductFilterSchema } from "@/lib/validations";

type Props = { searchParams: Record<string, string | string[] | undefined> };

function qp(params: Props["searchParams"], key: string): string | undefined {
  const v = params[key];
  return Array.isArray(v) ? v[0] : v;
}

export default async function SearchPage({ searchParams }: Props) {
  const q = qp(searchParams, "q") ?? "";
  const base = ProductFilterSchema.parse({ page: 1, limit: 24, sort: "newest" });
  const { products, total } = q.trim()
    ? await getProducts({ ...base, q: q.trim() })
    : { products: [], total: 0 };
  const summaries = products.map(mapProductListRowToSummary);

  return (
    <div className="mx-auto max-w-content px-[var(--content-padding)] py-10">
      <h1 className="text-3xl font-black">Search</h1>
      <form action="/search" role="search" className="mt-6 flex max-w-xl gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search laptops, brands, accessories"
          aria-label="Search products"
          className="h-12 min-w-0 flex-1 rounded-pill border border-grey-200 px-5 text-[16px] text-black outline-none focus:border-black"
        />
        <button type="submit" className="h-12 rounded-pill bg-black px-6 text-[15px] font-medium text-white">
          Search
        </button>
      </form>
      <p className="mt-4 text-grey-500">
        {q ? (
          <>
            {total} results for “{q}”
          </>
        ) : (
          "Enter a search term"
        )}
      </p>
      <div className="mt-10">
        <ProductGrid products={summaries} />
      </div>
      {q && total === 0 && (
        <p className="text-[15px] text-black">
          Can&apos;t find it? {" "}
          <a
            href={whatsappLink(`Hello Quantum Razer, I'm looking for: ${q}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Ask us on WhatsApp
          </a>{" "}
          and we&apos;ll check for you.
        </p>
      )}
      <p className="mt-8 text-center text-[14px]">
        <Link href="/products" className="underline">
          Browse all products
        </Link>
      </p>
    </div>
  );
}
