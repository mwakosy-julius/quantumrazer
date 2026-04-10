import type { ProductListRow } from "@/lib/mappers/product";
import { mapProductListRowToSummary } from "@/lib/mappers/product";

import { FeaturedDropClient } from "./FeaturedDropClient";

export function FeaturedDrop({ row }: { row: ProductListRow | undefined }) {
  if (!row) return null;
  const summary = mapProductListRowToSummary(row);
  return <FeaturedDropClient summary={summary} description={row.description ?? ""} />;
}
