import Link from "next/link";

import { ProductGrid } from "@/components/product/ProductGrid";
import { getSaleProducts } from "@/lib/data/products";
import { mapProductListRowToSummary } from "@/lib/mappers/product";

type Props = { searchParams: Record<string, string | string[] | undefined> };

function pageFromParams(sp: Props["searchParams"]): number {
  const v = sp.page;
  const raw = Array.isArray(v) ? v[0] : v;
  const n = raw ? parseInt(raw, 10) : 1;
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export default async function SalePage({ searchParams }: Props) {
  const page = pageFromParams(searchParams);
  const limit = 24;
  const { products, total, pages } = await getSaleProducts(page, limit);
  const summaries = products.map(mapProductListRowToSummary);

  return (
    <div className="mx-auto max-w-content px-[var(--content-padding)] py-10">
      <nav className="mb-6 text-[13px] text-grey-500">
        <Link href="/">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-black">Sale</span>
      </nav>
      <h1 className="text-[28px] font-bold text-black">Sale</h1>
      <p className="mt-2 text-[14px] text-grey-500">{total} marked-down styles</p>
      <div className="mt-10">
        <ProductGrid products={summaries} />
      </div>
      <div className="mt-12 flex justify-center gap-4 text-[14px]">
        {page > 1 && (
          <Link href={`/sale?page=${page - 1}`}>Previous</Link>
        )}
        {page < pages && (
          <Link href={`/sale?page=${page + 1}`}>Next</Link>
        )}
      </div>
    </div>
  );
}
