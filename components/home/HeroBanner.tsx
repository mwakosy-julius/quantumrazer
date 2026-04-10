import Image from "next/image";
import Link from "next/link";

import { BRAND } from "@/lib/constants";
import { IMAGES, imgHero1920 } from "@/lib/images";

export function HeroBanner() {
  const heroSrc = imgHero1920(IMAGES.lifestyle.dualMonitor);

  return (
    <section className="relative w-full bg-black">
      <div className="relative min-h-[400px] w-full md:min-h-[520px]" style={{ height: "min(70vh, 820px)" }}>
        <Image
          src={heroSrc}
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: "center 30%" }}
          priority
          sizes="100vw"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
          }}
        />
      </div>
      <div className="absolute inset-0 flex items-end pb-12 pl-6 pr-6 pt-24 md:px-12 md:pb-12">
        <div className="mx-auto w-full max-w-content">
          <h1 className="max-w-[600px] text-[clamp(40px,6vw,80px)] font-black uppercase leading-none tracking-[-0.02em] text-white">
            BUILT FOR CREATORS
          </h1>
          <p className="mt-4 max-w-[500px] text-[18px] font-normal leading-normal text-white">{BRAND.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-pill bg-white px-8 py-4 text-[16px] font-medium tracking-[0.02em] text-black transition-colors duration-200 hover:bg-[rgba(255,255,255,0.85)]"
            >
              Shop Now
            </Link>
            <Link
              href="/products?category=laptops"
              className="inline-flex items-center justify-center rounded-pill bg-[rgba(0,0,0,0.5)] px-8 py-4 text-[16px] font-medium tracking-[0.02em] text-white transition-colors duration-200 hover:bg-[rgba(0,0,0,0.7)]"
            >
              View Laptops
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
