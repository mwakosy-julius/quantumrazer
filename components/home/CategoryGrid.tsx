"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { IMAGES, imgHero1920 } from "@/lib/images";
import {
  CATEGORY_ORDER_BY_NARRATIVE,
  type CategoryCardKey,
  type NarrativeId,
} from "@/lib/narratives";

type CardDef = {
  key: CategoryCardKey;
  title: string;
  shopHref: string;
  image: string;
};

const CARD_DEFS: Record<CategoryCardKey, Omit<CardDef, "key">> = {
  creator: {
    title: "CREATIVE LAPTOPS",
    shopHref: "/products?category=laptops&sport=content-creation",
    image: imgHero1920(IMAGES.lifestyle.creativeWoman),
  },
  gaming: {
    title: "GAMING LAPTOPS",
    shopHref: "/products?category=laptops&sport=Gaming",
    image: imgHero1920(IMAGES.laptops.gaming),
  },
  bags: {
    title: "LAPTOP BAGS",
    shopHref: "/products?category=laptop-bags",
    image: imgHero1920(IMAGES.bags.leatherBag),
  },
  peripherals: {
    title: "HEADPHONES & GEAR",
    shopHref: "/products?category=accessories",
    image: imgHero1920(IMAGES.accessories.headphones),
  },
  gadgets: {
    title: "TABLETS & GADGETS",
    shopHref: "/products?category=gadgets",
    image: imgHero1920(IMAGES.gadgets.tablet),
  },
};

type Props = {
  narrativeId: NarrativeId;
};

export function CategoryGrid({ narrativeId }: Props) {
  const { ref, isVisible } = useScrollReveal(0.12);

  const cards: CardDef[] = useMemo(() => {
    return CATEGORY_ORDER_BY_NARRATIVE[narrativeId].map((key) => ({
      key,
      ...CARD_DEFS[key],
    }));
  }, [narrativeId]);

  const delays = [0, 80, 160, 240, 320];

  return (
    <section className="bg-white">
      <div className="flex flex-col justify-between gap-4 px-6 pb-6 pt-10 sm:flex-row sm:items-end sm:px-[clamp(24px,5vw,80px)]">
        <h2
          className="text-[28px] font-bold text-[#111]"
          style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
        >
          Shop by Category
        </h2>
        <Link
          href="/products"
          className="text-[15px] font-normal text-[#111] underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-[#757575]"
          style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
        >
          View All Products →
        </Link>
      </div>

      <div ref={ref} className="grid grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-12">
        {cards.map((card, index) => {
          const delay = delays[index] ?? 0;
          const visible = isVisible;
          const baseAnim = visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0";
          const mdSpan = index < 2 || index === 4 ? "md:col-span-2" : "md:col-span-1";
          const gridClass =
            index === 0
              ? `${mdSpan} lg:col-span-7 lg:row-span-1 min-h-[320px] h-[min(560px,70vw)] lg:h-[560px]`
              : index === 1
                ? `${mdSpan} lg:col-span-5 min-h-[320px] h-[min(560px,70vw)] lg:h-[560px]`
                : `${mdSpan} lg:col-span-4 min-h-[260px] h-[min(340px,50vw)] lg:h-[340px]`;

          return (
            <Link
              key={card.key}
              href={card.shopHref}
              className={`group relative block cursor-pointer overflow-hidden ${gridClass} ${baseAnim}`}
              style={{
                transitionProperty: "transform, opacity",
                transitionDuration: "0.6s",
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                transitionDelay: `${delay}ms`,
              }}
            >
              <Image
                src={card.image}
                alt=""
                fill
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-black/60 via-black/30 to-transparent transition-all duration-[400ms] ease-out group-hover:from-black/75 group-hover:via-black/40" />
              <div className="absolute bottom-0 left-0 right-0 z-[1] p-6 text-white">
                <p
                  className="text-[clamp(20px,2.5vw,28px)] font-bold uppercase leading-tight text-white"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  {card.title}
                </p>
                <div className="mt-4 flex flex-row flex-wrap gap-2 transition-transform duration-300 ease-out group-hover:-translate-y-1">
                  <span
                    className="inline-block rounded-full bg-white px-6 py-3 text-[14px] font-medium text-[#111]"
                    style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                  >
                    Shop {card.title}
                  </span>
                  <span
                    className="inline-block rounded-full bg-black/45 px-6 py-3 text-[14px] font-medium text-white backdrop-blur-sm"
                    style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                  >
                    View All
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
