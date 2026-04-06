import type { ProductSummary } from "@/types";

export function StarRating({ product }: { product: Pick<ProductSummary, "avg_rating" | "review_count"> }) {
  if (!product.avg_rating || product.review_count === 0) return null;
  const full = Math.round(product.avg_rating);
  return (
    <div className="mt-1 flex items-center gap-1 text-[12px] text-grey-500">
      <span className="flex text-gold" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>{i < full ? "★" : "☆"}</span>
        ))}
      </span>
      <span>({product.review_count})</span>
    </div>
  );
}
