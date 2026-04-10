"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { addToCartAction } from "@/actions/cart.actions";
import { Badge } from "@/components/ui/Badge";
import { imgProductCardHover, imgProductCardPrimary } from "@/lib/images";
import { useCartStore } from "@/store/cartStore";
import type { ProductSummary } from "@/types";

const STORAGE_CHIPS = ["256GB", "512GB", "1TB", "2TB"] as const;

function formatCategory(p: ProductSummary) {
  const cat = p.category_slug?.replace(/-/g, " ") ?? p.sport ?? "Tech";
  return `${p.brand} · ${cat}`;
}

export function ProductCard({ product }: { product: ProductSummary }) {
  const router = useRouter();
  const openCart = useCartStore((s) => s.openCart);
  const [hover, setHover] = useState(false);
  const [wish, setWish] = useState(false);
  const [quick, setQuick] = useState<"idle" | "busy" | "done">("idle");

  const isBag = product.category_slug === "laptop-bags";

  const sale =
    product.min_price &&
    product.max_price &&
    parseFloat(product.max_price) > parseFloat(product.min_price);

  const onQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.default_variant_id || quick === "busy" || isBag) return;
    setQuick("busy");
    const res = await addToCartAction({ variantId: product.default_variant_id, quantity: 1 });
    if (res?.serverError) {
      setQuick("idle");
      return;
    }
    setQuick("done");
    router.refresh();
    openCart();
    setTimeout(() => setQuick("idle"), 1500);
  };

  const specLine =
    product.spec_preview ??
    (isBag ? 'Fits 15" · Water resistant · 2 compartments' : "16GB · 1TB SSD · RTX 4070");

  const href = `/products/${product.slug}`;

  const primarySrc = product.primary_image_url
    ? imgProductCardPrimary(product.primary_image_url)
    : null;
  const hoverSrc = product.secondary_image_url
    ? imgProductCardHover(product.secondary_image_url)
    : null;
  const hasHoverImage = Boolean(hoverSrc);

  return (
    <article className="group/card" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="relative aspect-square w-full overflow-hidden bg-grey-100">
        <Link href={href} className="absolute inset-0 z-0 block">
          {primarySrc && (
            <Image
              src={primarySrc}
              alt={product.name}
              fill
              className={`object-contain transition-all duration-300 ease-out ${
                !hasHoverImage && hover ? "scale-[1.03]" : "scale-100"
              }`}
              sizes="(max-width:768px) 50vw, 25vw"
            />
          )}
          {hoverSrc && (
            <Image
              src={hoverSrc}
              alt=""
              fill
              className={`absolute inset-0 object-contain transition-opacity duration-300 ease-out ${hover ? "opacity-100" : "opacity-0"}`}
              sizes="(max-width:768px) 50vw, 25vw"
            />
          )}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 z-[1] flex flex-col gap-1">
          {product.is_new && <Badge>Just In</Badge>}
          {sale && <Badge variant="sale">Sale</Badge>}
          {product.is_featured && <Badge>Featured</Badge>}
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 z-[2] transition-transform duration-300 ease-out ${
            hover ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {isBag ? (
            <div className="pointer-events-auto flex justify-center bg-white px-3 py-2">
              <Link
                href={href}
                className="rounded-pill border border-grey-200 bg-white px-5 py-2 text-[14px] font-medium text-black transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                View Bag
              </Link>
            </div>
          ) : (
            <div className="pointer-events-auto bg-white px-3 py-2">
              <div className="flex flex-wrap justify-center gap-1.5">
                {quick === "done" ? (
                  <span className="py-1 text-center text-[13px] font-medium text-black">Added ✓</span>
                ) : (
                  STORAGE_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      className="rounded-brand border border-grey-200 bg-white px-2.5 py-1 text-[13px] text-black hover:border-black"
                      disabled={!product.default_variant_id || quick === "busy"}
                      onClick={onQuickAdd}
                    >
                      {chip}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-3">
        <Link href={href} className="block">
          <p className="mb-1 text-[13px] font-medium uppercase tracking-[0.02em] text-grey-500">{formatCategory(product)}</p>
          <h3 className="mb-1 line-clamp-1 text-[15px] font-medium leading-snug text-black">{product.name}</h3>
          <p className="mb-1 text-[15px] text-grey-500">{specLine}</p>
          <p className="mb-2 text-[13px] text-grey-500">Multiple variants</p>
          <div className="flex flex-wrap items-center gap-2">
            {sale && product.max_price ? (
              <>
                <span className="text-[15px] text-grey-500 line-through">${product.max_price}</span>
                <span className="text-[15px] text-black">${product.min_price}</span>
              </>
            ) : (
              <span className="text-[15px] text-black">${product.min_price ?? "—"}</span>
            )}
          </div>
        </Link>
        <div className="mt-1 flex items-center justify-between">
          {product.avg_rating != null && product.review_count > 0 && (
            <p className="text-[13px] text-black">
              ★ {product.avg_rating.toFixed(1)} <span className="text-grey-500">({product.review_count})</span>
            </p>
          )}
          <button
            type="button"
            className="p-1 text-grey-300 hover:text-black"
            aria-label="Wishlist"
            onClick={() => setWish((w) => !w)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={wish ? "currentColor" : "none"} aria-hidden>
              <path d="M6 4h12v16l-6-4-6 4V4z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
