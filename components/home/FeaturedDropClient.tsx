"use client";

import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/components/product/AddToCartButton";
import type { ProductSummary } from "@/types";

export function FeaturedDropClient({
  summary,
  description,
}: {
  summary: ProductSummary;
  description: string;
}) {
  const sale =
    summary.min_price &&
    summary.max_price &&
    parseFloat(summary.max_price) > parseFloat(summary.min_price);

  const blurb =
    description?.trim() ||
    "Flagship performance tuned for renders, sessions, and late-night ships — without the corporate gloss.";

  const cat = summary.category_slug?.replace(/-/g, " ").toUpperCase() ?? "TECH";

  return (
    <section className="bg-white px-6 py-12 md:px-[var(--content-padding)] md:py-12">
      <div className="mx-auto max-w-content">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="text-[28px] font-bold text-black">Featured</h2>
          <Link href="/products?is_featured=true" className="text-[15px] text-black underline hover:text-grey-500">
            Shop All
          </Link>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div className="relative aspect-square overflow-hidden bg-grey-100">
            {summary.primary_image_url && (
              <Image
                src={summary.primary_image_url}
                alt={summary.name}
                fill
                className="object-contain transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.03]"
                sizes="(max-width:1024px) 100vw, 55vw"
                priority
              />
            )}
          </div>

          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.02em] text-grey-500">
              {summary.brand.toUpperCase()} · {cat}
            </p>
            <h3 className="my-3 text-[28px] font-bold leading-tight text-black">{summary.name}</h3>
            <p className="max-w-[340px] text-[15px] leading-[1.75] text-grey-500">{blurb}</p>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                ["Processor", summary.sport ?? "Latest Gen"],
                ["Memory", summary.spec_preview?.split("·")[0]?.trim() ?? "16GB+"],
                ["Display", "High-res"],
                ["Battery", "All-day"],
                ["Graphics", "Pro GPU"],
                ["Storage", "Fast SSD"],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-grey-200 pb-3">
                  <dt className="text-[13px] font-medium uppercase tracking-[0.02em] text-grey-500">{k}</dt>
                  <dd className="mt-1 text-[14px] font-semibold text-black">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 text-[24px] font-normal text-black">
              {sale && summary.max_price ? (
                <>
                  <span className="text-grey-500 line-through">${summary.max_price}</span>{" "}
                  <span className="text-black">${summary.min_price}</span>
                </>
              ) : (
                `$${summary.min_price ?? "—"}`
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <AddToCartButton
                variantId={summary.default_variant_id}
                label="Add to Bag"
                variant="black"
                className="h-[52px] min-w-[160px] rounded-pill px-8 normal-case"
              />
              <Link
                href={`/products/${summary.slug}`}
                className="inline-flex items-center justify-center rounded-pill border border-black bg-transparent px-8 py-3.5 text-[16px] font-medium text-black transition-colors duration-200 hover:bg-grey-100"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
