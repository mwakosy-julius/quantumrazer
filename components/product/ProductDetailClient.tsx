"use client";

import * as Accordion from "@radix-ui/react-accordion";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { useMemo, useState } from "react";

import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductGrid } from "@/components/product/ProductGrid";
import { StarRating } from "@/components/ui/StarRating";
import { formatMoney, formatPrice, FREE_SHIPPING_MIN_SUBTOTAL } from "@/lib/currency";
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
  const [imgIdx, setImgIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const selectedVariant = sizesForColor.find((v) => v.size === size) ?? null;
  const images = product.images.filter((img) => !img.variant_id || sizesForColor.some((v) => v.id === img.variant_id));
  const main = images[imgIdx] ?? images[0];

  const sale =
    selectedVariant?.compare_at_price &&
    parseFloat(selectedVariant.compare_at_price) > parseFloat(selectedVariant.price);

  const specRows: [string, string][] = [
    ["Processor / series", product.sport ?? "—"],
    ["Build / config", sizesForColor[0]?.size ?? product.variants[0]?.size ?? "—"],
    ["Colorway", color || "—"],
    ["SKU", selectedVariant?.sku ?? product.variants[0]?.sku ?? "—"],
    ["In stock", selectedVariant ? `${selectedVariant.inventory_count} units` : "Select options"],
    ["Weight", "Varies by configuration"],
  ];

  return (
    <div>
      <div className="mx-auto grid max-w-content gap-10 px-6 py-10 md:px-[var(--content-padding)] lg:grid-cols-[55%_45%]">
        <div>
          <div className="flex gap-4">
            <div className="hidden w-[72px] shrink-0 flex-col gap-2 lg:flex">
              {images.slice(0, 8).map((im, i) => (
                <button
                  key={im.id}
                  type="button"
                  onClick={() => setImgIdx(i)}
                  className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden bg-grey-100 ${
                    i === imgIdx ? "outline outline-2 outline-offset-[-2px] outline-black" : ""
                  }`}
                  aria-label={`Image ${i + 1}`}
                >
                  <Image src={im.url} alt="" fill className="object-contain p-2" sizes="72px" />
                </button>
              ))}
            </div>
            <div className="relative min-h-[320px] flex-1 bg-grey-100 lg:aspect-[4/5]">
              {main && (
                <button
                  type="button"
                  className="relative block h-full min-h-[320px] w-full cursor-zoom-in lg:min-h-0"
                  onClick={() => setLightboxOpen(true)}
                  aria-label="Enlarge image"
                >
                  <Image
                    src={main.url}
                    alt={main.alt_text ?? product.name}
                    fill
                    className="object-contain p-[4%]"
                    sizes="(max-width:1024px) 100vw, 50vw"
                    priority
                  />
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {images.slice(0, 8).map((im, i) => (
              <button
                key={im.id}
                type="button"
                onClick={() => setImgIdx(i)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden bg-grey-100 ${
                  i === imgIdx ? "outline outline-2 outline-offset-[-2px] outline-black" : ""
                }`}
                aria-label={`Image ${i + 1}`}
              >
                <Image src={im.url} alt="" fill className="object-contain p-1" sizes="64px" />
              </button>
            ))}
          </div>

          <Dialog.Root open={lightboxOpen} onOpenChange={setLightboxOpen}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-[20000] bg-white/95" />
              <Dialog.Content className="fixed left-1/2 top-1/2 z-[20001] max-h-[90vh] w-[min(96vw,1200px)] -translate-x-1/2 -translate-y-1/2 bg-transparent p-4 outline-none">
                <Dialog.Title className="sr-only">Product image</Dialog.Title>
                <Dialog.Close className="absolute right-2 top-2 z-10 text-[24px] text-black" aria-label="Close">
                  ✕
                </Dialog.Close>
                {main && (
                  <div className="relative mx-auto aspect-square max-h-[85vh] w-full">
                    <Image src={main.url} alt="" fill className="object-contain" sizes="100vw" />
                  </div>
                )}
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start lg:pl-0 xl:pl-12">
          <p className="text-[15px] font-medium text-black">{product.brand}</p>
          <h1 className="mt-1 text-[28px] font-bold leading-tight text-black">{product.name}</h1>
          <p className="mt-1 text-[15px] text-grey-500">{product.sport ?? "Gaming Laptop"}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[14px] text-black">★ {product.avg_rating?.toFixed(1) ?? "—"}</span>
            {product.review_count > 0 && (
              <button type="button" className="text-[14px] text-grey-500 underline">
                ({product.review_count} reviews)
              </button>
            )}
            <StarRating product={product} />
          </div>

          <div className="mt-5 text-[24px] font-normal text-black">
            {sale && selectedVariant ? (
              <>
                <span className="text-grey-500 line-through">
                  {formatPrice(Number(selectedVariant.compare_at_price), product.currency)}
                </span>
                <span className="ml-2">{formatPrice(Number(selectedVariant.price), product.currency)}</span>
              </>
            ) : (
              <span>
                {selectedVariant
                  ? formatPrice(Number(selectedVariant.price), product.currency)
                  : product.variants[0]?.price != null
                    ? `From ${formatPrice(Number(product.variants[0].price), product.currency)}`
                    : "—"}
              </span>
            )}
          </div>

          <div className="mt-8 border-t border-grey-200 pt-6">
            <p className="mb-3 text-[15px] font-medium text-black">Product details</p>
            <table className="w-full text-left">
              <tbody>
                {specRows.map(([k, v]) => (
                  <tr key={k} className="border-b border-grey-200">
                    <th className="py-3 pr-4 text-[11px] font-medium uppercase tracking-[0.06em] text-grey-500">{k}</th>
                    <td className="py-3 text-[14px] font-semibold text-black">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-8 text-[15px] font-medium text-black">Colour Shown: {color || "—"}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {colorKeys.map(([name, hex]) => (
              <button
                key={name}
                type="button"
                title={name}
                className={`h-10 w-10 rounded-full border-2 ${
                  color === name
                    ? "border-black"
                    : "border-transparent ring-1 ring-grey-300 hover:ring-black"
                }`}
                style={{ background: hex }}
                onClick={() => {
                  setColor(name);
                  setSize(null);
                  setImgIdx(0);
                }}
                aria-label={name}
              />
            ))}
          </div>

          <p className="mt-8 text-[15px] font-medium text-black">Select Storage</p>
          {sizeError && (
            <p className="mt-2 flex items-center gap-2 text-[13px] text-black">
              <span aria-hidden>⚠</span> Please select storage
            </p>
          )}
          <div className="mt-3 grid grid-cols-3 gap-2">
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
                    className={`flex h-12 items-center justify-center rounded-brand border text-[15px] ${
                      size === sz ? "border-black font-bold" : "border-grey-200 font-normal text-black"
                    } ${oos ? "cursor-not-allowed bg-grey-100 text-grey-300 line-through" : "bg-white"}`}
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
              className="h-[52px] w-full rounded-pill text-[16px] font-medium normal-case"
            />
          </div>

          <button
            type="button"
            className="mt-3 flex h-[52px] w-full items-center justify-center gap-2 rounded-pill border border-grey-200 bg-white text-[16px] font-medium text-black transition-colors hover:border-black"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
              />
            </svg>
            Favourites
          </button>

          <p className="mt-4 flex items-center justify-center gap-2 text-[13px] text-grey-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-black" aria-hidden>
              <path d="M3 7h13l-1 9H5L3 7Zm0 0L2 4H1" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="7.5" cy="18" r="1" fill="currentColor" />
              <circle cx="16.5" cy="18" r="1" fill="currentColor" />
            </svg>
            Free delivery on orders over {formatMoney(FREE_SHIPPING_MIN_SUBTOTAL)}
          </p>

          <Accordion.Root type="multiple" className="mt-8 border-t border-grey-200">
            {[
              { id: "about", title: "Product Details", body: product.description ?? "Engineered for long sessions and heavy workflows." },
              { id: "box", title: "What's In The Box", body: "Device, power adapter, quick-start guide, compliance docs." },
              { id: "specs", title: "Full Specifications", body: "Full technical sheet available after purchase and in packaging QR." },
              {
                id: "ship",
                title: "Delivery and Returns",
                body: `Free standard shipping on orders over ${formatMoney(FREE_SHIPPING_MIN_SUBTOTAL)} across Tanzania. Returns within 30 days in original condition.`,
              },
            ].map((item) => (
              <Accordion.Item key={item.id} value={item.id} className="border-b border-grey-200">
                <Accordion.Header>
                  <Accordion.Trigger className="flex w-full items-center justify-between py-4 text-left text-[15px] font-medium text-black">
                    <span>{item.title}</span>
                    <span className="text-grey-500">+</span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="pb-4 text-[15px] leading-[1.75] text-grey-500">{item.body}</Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </div>

      {product.related.length > 0 && (
        <section className="border-t border-grey-200 bg-grey-100 px-6 py-12 md:px-[var(--content-padding)]">
          <h2 className="mx-auto mb-8 max-w-content text-[22px] font-bold text-black">Complete Your Setup</h2>
          <div className="mx-auto max-w-content">
            <ProductGrid products={product.related} />
          </div>
        </section>
      )}

      <section className="mx-auto max-w-content border-t border-grey-200 px-6 py-16 md:px-[var(--content-padding)]">
        <div className="grid gap-12 lg:grid-cols-[2fr_3fr]">
          <div>
            <p className="text-[64px] font-bold leading-none text-black">{product.avg_rating?.toFixed(1) ?? "—"}</p>
            <div className="mt-2 flex text-[20px] text-black">★★★★★</div>
            <p className="mt-2 text-[15px] text-grey-500">{product.review_count} Reviews</p>
            <button
              type="button"
              className="mt-6 flex h-[52px] w-full max-w-xs items-center justify-center rounded-pill border border-grey-200 bg-white text-[16px] font-medium text-black hover:border-black lg:w-auto lg:px-10"
            >
              Write a Review
            </button>
          </div>
          <div className="text-[15px] text-grey-500">
            <p>Reviews will appear here as customers share feedback.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
