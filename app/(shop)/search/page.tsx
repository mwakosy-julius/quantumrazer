import Link from "next/link";

import { ProductGrid } from "@/components/product/ProductGrid";
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
      <p className="mt-2 text-grey-500">
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
      <p className="mt-8 text-center text-[14px]">
        <Link href="/products" className="underline">
          Browse all products
        </Link>
      </p>
    </div>
  );
}
