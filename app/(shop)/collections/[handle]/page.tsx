import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/product/ProductGrid";
import { getCollectionByHandle, getProducts } from "@/lib/data/products";
import { mapProductListRowToSummary } from "@/lib/mappers/product";
import { ProductFilterSchema } from "@/lib/validations";

type Props = { params: { handle: string } };

export async function generateMetadata({ params }: Props) {
  const col = await getCollectionByHandle(params.handle);
  return { title: col?.name ?? params.handle.replace(/-/g, " ") };
}

export default async function CollectionPage({ params }: Props) {
  const collection = await getCollectionByHandle(params.handle);
  if (!collection) notFound();

  const base = ProductFilterSchema.parse({ page: 1, limit: 48, sort: "newest" });
  const { products, total } = await getProducts({
    ...base,
    collection: params.handle,
  });
  const summaries = products.map(mapProductListRowToSummary);

  return (
    <div className="mx-auto max-w-content px-[var(--content-padding)] py-10">
      <nav className="mb-6 text-[13px] text-grey-500">
        <Link href="/">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-black">{collection.name}</span>
      </nav>
      <h1 className="text-3xl font-black">{collection.name}</h1>
      <p className="mt-2 text-grey-500">{total} products</p>
      <div className="mt-10">
        <ProductGrid products={summaries} />
      </div>
    </div>
  );
}
