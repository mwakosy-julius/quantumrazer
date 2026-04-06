"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductGrid } from "@/components/product/ProductGrid";
import { StarRating } from "@/components/ui/StarRating";
import * as Accordion from "@radix-ui/react-accordion";
import type { ProductDetail } from "@/types";

export function ProductDetailClient({ product }: { product: ProductDetail }) {
  const colorKeys = useMemo(() => {
    const m = new Map<string, string>();
    for (const v of product.variants) {
      if (!m.has(v.color_name)) m.set(v.color_name, v.color_hex ?? "#ccc");
    }
    return Array.from(m.entries());
  }, [product.variants]);

  const [color, setColor] = useState(colorKeys[0]?.[0] ?? "");
  const sizesForColor = product.variants.filter((v) => v.color_name === color);
  const [size, setSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);

  const selectedVariant = sizesForColor.find((v) => v.size === size) ?? null;
  const images = product.images.filter((img) => !img.variant_id || sizesForColor.some((v) => v.id === img.variant_id));
  const main = images[0];

  const sale = selectedVariant?.compare_at_price && parseFloat(selectedVariant.compare_at_price) > parseFloat(selectedVariant.price);

  return (
    <div>
      <div className="mx-auto grid max-w-content gap-10 px-[var(--content-padding)] py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="relative aspect-square bg-grey-100">
            {main && (
              <Image src={main.url} alt={main.alt_text ?? product.name} fill className="object-contain p-[10%]" sizes="(max-width:1024px) 100vw, 55vw" />
            )}
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {images.slice(0, 5).map((im) => (
              <div key={im.id} className="relative h-[72px] w-[72px] shrink-0 bg-grey-100">
                <Image src={im.url} alt="" fill className="object-contain p-2" sizes="72px" />
              </div>
            ))}
          </div>
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-[12px] uppercase text-grey-500">{product.brand}</p>
          <h1 className="mt-1 font-black leading-tight" style={{ fontSize: "clamp(24px,3vw,36px)" }}>
            {product.name}
          </h1>
          <button type="button" className="mt-3 text-left text-[14px] text-grey-500 hover:underline">
            <StarRating product={product} />
            {product.review_count > 0 && (
              <span className="ml-1">
                {product.avg_rating?.toFixed(1)} ({product.review_count} reviews)
              </span>
            )}
          </button>
          <div className="mt-4 flex items-baseline gap-3 text-[22px] font-medium">
            {sale && selectedVariant ? (
              <>
                <span className="text-red-brand">${selectedVariant.price}</span>
                <span className="text-[16px] text-grey-500 line-through">${selectedVariant.compare_at_price}</span>
              </>
            ) : (
              <span>{selectedVariant ? `$${selectedVariant.price}` : `From $${product.variants[0]?.price ?? "—"}`}</span>
            )}
          </div>

          <p className="mt-6 text-[14px]">Colour Shown: {color}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {colorKeys.map(([name, hex]) => (
              <button
                key={name}
                type="button"
                title={name}
                className={`h-9 w-9 rounded-full border-2 ${color === name ? "border-black" : "border-transparent"}`}
                style={{ background: hex }}
                onClick={() => {
                  setColor(name);
                  setSize(null);
                }}
                aria-label={name}
              />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <span className="text-[14px] font-medium">Select Size</span>
            <span className="text-[13px] underline">Size Guide</span>
          </div>
          {sizeError && <p className="mt-2 text-[13px] text-red-brand">Please select a size</p>}
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {Array.from(new Set(sizesForColor.map((v) => v.size)))
              .sort()
              .map((sz) => {
                const v = sizesForColor.find((x) => x.size === sz);
                const oos = v ? v.inventory_count <= 0 : true;
                return (
                  <button
                    key={sz}
                    type="button"
                    disabled={oos}
                    onClick={() => {
                      setSize(sz);
                      setSizeError(false);
                    }}
                    className={`h-12 rounded border text-[14px] ${
                      size === sz ? "border-[1.5px] border-black font-bold" : "border-grey-200"
                    } ${oos ? "cursor-not-allowed bg-grey-100 text-grey-300 line-through" : ""}`}
                  >
                    {sz}
                  </button>
                );
              })}
          </div>

          <div className="mt-8">
            <AddToCartButton
              variantId={selectedVariant?.id ?? null}
              disabled={!selectedVariant || selectedVariant.inventory_count <= 0}
              label={selectedVariant && selectedVariant.inventory_count <= 0 ? "Out of Stock" : "Add to Bag"}
            />
          </div>
          <button type="button" className="mt-4 w-full text-center text-[14px] underline">
            Favourite ♡
          </button>
          <p className="mt-6 text-[13px] text-grey-500">Free Delivery on orders over $50</p>

          <Accordion.Root type="multiple" className="mt-8 divide-y divide-grey-200 border-t border-grey-200">
            <Accordion.Item value="desc">
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full justify-between py-4 text-left text-[14px] font-medium">
                  Description
                  <span>+</span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="pb-4 text-[14px] leading-relaxed text-grey-500">
                {product.description}
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="ship">
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full justify-between py-4 text-left text-[14px] font-medium">
                  Shipping &amp; Returns
                  <span>+</span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="pb-4 text-[14px] text-grey-500">
                Free standard shipping on qualifying orders. Easy returns within 30 days.
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      </div>

      <section className="border-t border-grey-200 px-[var(--content-padding)] py-16">
        <h2 className="mx-auto mb-8 max-w-content text-2xl font-black">Complete the Look</h2>
        <div className="mx-auto max-w-content">
          <ProductGrid products={product.related} />
        </div>
      </section>
    </div>
  );
}
