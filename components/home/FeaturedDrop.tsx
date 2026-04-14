"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { Narrative } from "@/lib/narratives";

import type { SerializedFeaturedProduct } from "./home-types";

const STORAGE_KEY = "qr_featured_drop_end_v1";

type Props = {
  narrative: Narrative;
  product: SerializedFeaturedProduct | null;
};

function formatCountdown(ms: number) {
  if (ms <= 0) return "0d 0h 0m";
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

export function FeaturedDrop({ narrative, product }: Props) {
  const { ref, isVisible } = useScrollReveal(0.15);
  const [remaining, setRemaining] = useState(72 * 3600 * 1000);

  useEffect(() => {
    let end: number;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        end = parseInt(raw, 10);
        if (Number.isNaN(end) || end < Date.now()) {
          end = Date.now() + 72 * 3600 * 1000;
          localStorage.setItem(STORAGE_KEY, String(end));
        }
      } else {
        end = Date.now() + 72 * 3600 * 1000;
        localStorage.setItem(STORAGE_KEY, String(end));
      }
    } catch {
      end = Date.now() + 72 * 3600 * 1000;
    }

    const tick = () => setRemaining(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const categoryLabel = (product?.categoryName ?? "Laptops").toUpperCase();
  const img = product?.imageUrl;

  return (
    <section ref={ref} className="relative flex min-h-[70vh] items-center overflow-hidden bg-[#111]">
      {img && (
        <div
          className={`absolute bottom-0 right-0 top-0 w-full md:w-[65%] ${
            isVisible ? "scale-100" : "scale-105"
          }`}
          style={{
            transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Image
            src={img}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 65vw"
            priority={false}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, #111111 0%, #111111 25%, rgba(17,17,17,0.85) 45%, rgba(17,17,17,0.2) 65%, transparent 80%)",
            }}
            aria-hidden
          />
        </div>
      )}

      <div
        className={`relative z-10 max-w-[520px] px-6 py-[clamp(48px,8vw,80px)] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] md:px-[clamp(48px,8vw,80px)] ${
          isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            className="rounded border border-white/20 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-white/60"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            Featured drop
          </span>
          <span
            className="rounded border border-white/20 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-white"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            Ends in: {formatCountdown(remaining)}
          </span>
        </div>

        <p
          className="mb-2 mt-5 text-[14px] font-normal uppercase tracking-[0.06em] text-white/55"
          style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
        >
          {categoryLabel}
        </p>

        <h2
          className="mb-4 text-[clamp(32px,5vw,60px)] font-black uppercase leading-[0.95] tracking-[-0.02em] text-white"
          style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
        >
          {product?.name ?? "Featured gear"}
        </h2>

        <p
          className="mb-8 max-w-[360px] text-[16px] font-light leading-[1.7] text-white/65"
          style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
        >
          {product?.description?.slice(0, 220) ?? narrative.subheadline}
        </p>

        <div className="mb-8 flex flex-wrap items-baseline gap-3">
          {product?.compareAtPrice && (
            <span
              className="text-[24px] font-bold line-through text-white/40"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              {product.compareAtPrice}
            </span>
          )}
          <span
            className="text-[24px] font-bold text-white"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            {product ? `From ${product.minPrice}` : "See collection"}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {product ? (
            <>
              <Link
                href={`/products/${product.slug}`}
                className="inline-block rounded-[30px] bg-white px-9 py-4 text-[16px] font-semibold text-[#111] transition-colors duration-200 hover:bg-white/90"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                Shop now
              </Link>
              <Link
                href={`/products/${product.slug}`}
                className="inline-block rounded-[30px] border border-white/40 px-9 py-4 text-[16px] font-semibold text-white transition-colors duration-200 hover:bg-white/10"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                View details
              </Link>
            </>
          ) : (
            <Link
              href="/products"
              className="inline-block rounded-[30px] bg-white px-9 py-4 text-[16px] font-semibold text-[#111] transition-colors duration-200 hover:bg-white/90"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              Browse products
            </Link>
          )}
        </div>

        <p
          className="mt-6 flex items-center gap-2 text-[13px] font-normal text-white/50"
          style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-white/50">
            <path
              d="M3 7h18v10H3V7zm2 0V5a2 2 0 012-2h10a2 2 0 012 2v2M7 12h2m4 0h2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Free delivery on this item
        </p>
      </div>
    </section>
  );
}
