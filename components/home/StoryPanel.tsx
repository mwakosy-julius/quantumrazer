"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { VIDEOS } from "@/lib/videos";

import type { SerializedFeaturedProduct } from "./home-types";

const STORY_POSTER =
  "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=960&q=80&fit=crop";

type Props = {
  featuredProduct: SerializedFeaturedProduct | null;
};

function useSaveData(): boolean {
  const [saveData, setSaveData] = useState(false);
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    setSaveData(Boolean(nav.connection?.saveData));
  }, []);
  return saveData;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

function useCountUp(target: number, enabled: boolean, durationMs = 1000) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!enabled || started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) ** 2;
      setValue(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [enabled, target, durationMs]);

  return value;
}

export function StoryPanel({ featuredProduct }: Props) {
  const saveData = useSaveData();
  const reducedMotion = usePrefersReducedMotion();
  const loadVideo = !saveData && !reducedMotion;
  const leftReveal = useScrollReveal(0.2);
  const rightReveal = useScrollReveal(0.2);
  const statsReveal = useScrollReveal(0.2);
  const cardReveal = useScrollReveal(0.25);

  const brands = useCountUp(30, statsReveal.isVisible);
  const rating = statsReveal.isVisible ? 4.9 : 0;
  const hours = useCountUp(48, statsReveal.isVisible);

  return (
    <section className="min-h-[80vh] bg-white">
      <div className="grid min-h-[80vh] grid-cols-1 md:grid-cols-2">
        <div
          ref={leftReveal.ref}
          className={`reveal-left relative min-h-[500px] overflow-hidden md:min-h-0 ${leftReveal.isVisible ? "visible" : ""}`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center md:hidden"
            style={{ backgroundImage: `url(${STORY_POSTER})` }}
            aria-hidden
          />
          {loadVideo && (
            <video
              className="qr-story-video absolute inset-0 z-0 h-full w-full object-cover"
              src={VIDEOS.storyPanel}
              poster={STORY_POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
              onError={(e) => {
                const el = e.currentTarget;
                if (!el.src.includes("2278095")) el.src = VIDEOS.fallback;
              }}
            />
          )}
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              background: "linear-gradient(135deg, rgba(0,0,0,0.2) 0%, transparent 60%)",
            }}
            aria-hidden
          />

          {featuredProduct && (
            <div
              ref={cardReveal.ref}
              className={`absolute bottom-8 right-0 z-[2] max-w-[calc(100%-24px)] md:bottom-8 ${
                cardReveal.isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
              }`}
              style={{
                transitionProperty: "transform, opacity",
                transitionDuration: "0.6s",
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <Link
                href={`/products/${featuredProduct.slug}`}
                className="flex items-center gap-3 bg-white py-4 pl-5 pr-6 shadow-[-8px_8px_32px_rgba(0,0,0,0.2)] transition-transform duration-200 ease-out hover:-translate-x-1"
              >
                <div className="relative h-[60px] w-[60px] shrink-0 bg-[#f5f5f5]">
                  {featuredProduct.imageUrl ? (
                    <Image
                      src={featuredProduct.imageUrl}
                      alt=""
                      fill
                      className="object-contain p-1"
                      sizes="60px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-[14px] font-semibold text-[#111]"
                    style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                  >
                    {featuredProduct.name}
                  </p>
                  <p
                    className="text-[14px] font-normal text-[#111]"
                    style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                  >
                    From ${featuredProduct.minPrice}
                  </p>
                </div>
                <span className="text-[#111]" aria-hidden>
                  →
                </span>
              </Link>
            </div>
          )}
        </div>

        <div
          ref={rightReveal.ref}
          className={`reveal-right flex flex-col justify-center px-6 py-12 md:px-[clamp(48px,8vw,80px)] md:py-[clamp(48px,8vw,80px)] ${
            rightReveal.isVisible ? "visible" : ""
          }`}
        >
          <div className="mb-4 inline-flex items-center gap-2">
            <span className="h-px w-8 bg-[#111]" aria-hidden />
            <span
              className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#111]"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              Laptops, color & craft
            </span>
          </div>

          <h2
            className="text-[clamp(36px,5vw,64px)] font-black uppercase leading-[0.95] tracking-[-0.02em] text-[#111]"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            Quantum Razer.
            <br />
            For your photos,
            <br />
            shows & studies.
          </h2>

          <p
            className="mb-9 mt-6 max-w-[400px] text-[17px] font-normal leading-[1.75] text-[#757575]"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            We help families, students, and anyone who loves art, games, or a great movie night find laptops and gear
            that feel easy to use and nice to look at — without the jargon.
          </p>

          <Link
            href="/products"
            className="w-fit text-[15px] font-medium text-[#111] underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-[#757575]"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            Discover Our Story →
          </Link>

          <div
            ref={statsReveal.ref}
            className="mt-12 flex flex-wrap gap-8 border-t border-[#e5e5e5] pt-8 md:gap-8"
          >
            <div>
              <p
                className="text-[28px] font-bold text-[#111]"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                {brands}+
              </p>
              <p
                className="mt-1 text-[13px] font-normal uppercase tracking-[0.04em] text-[#757575]"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                Brands carried
              </p>
            </div>
            <div>
              <p
                className="text-[28px] font-bold text-[#111]"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                {rating.toFixed(1)}★
              </p>
              <p
                className="mt-1 text-[13px] font-normal uppercase tracking-[0.04em] text-[#757575]"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                Average rating
              </p>
            </div>
            <div>
              <p
                className="text-[28px] font-bold text-[#111]"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                {hours}hr
              </p>
              <p
                className="mt-1 text-[13px] font-normal uppercase tracking-[0.04em] text-[#757575]"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                Express delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
