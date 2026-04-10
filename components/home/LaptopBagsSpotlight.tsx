import Image from "next/image";
import Link from "next/link";

import { IMAGES, imgProductCardPrimary } from "@/lib/images";

export function LaptopBagsSpotlight() {
  return (
    <section className="bg-white px-6 py-12 md:px-[var(--content-padding)]">
      <div className="mx-auto flex max-w-content flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative h-[280px] w-full max-w-[400px] shrink-0 md:h-[320px]">
          <div
            className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-[85%] -translate-y-1/2 md:h-[220px] md:w-[220px]"
            style={{ transform: "translate(-85%, -50%) rotate(-4deg)" }}
          >
            <Image
              src={imgProductCardPrimary(IMAGES.bags.messenger)}
              alt=""
              fill
              className="object-contain drop-shadow-lg"
              sizes="220px"
            />
          </div>
          <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 md:h-[240px] md:w-[240px]">
            <Image
              src={imgProductCardPrimary(IMAGES.bags.leatherBag)}
              alt=""
              fill
              className="object-contain drop-shadow-lg"
              sizes="240px"
            />
          </div>
          <div
            className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-y-1/2 md:h-[220px] md:w-[220px]"
            style={{ transform: "translate(15%, -50%) rotate(4deg)" }}
          >
            <Image
              src={imgProductCardPrimary(IMAGES.bags.backpackBlack)}
              alt=""
              fill
              className="object-contain drop-shadow-lg"
              sizes="220px"
            />
          </div>
        </div>
        <div className="max-w-[480px] text-center lg:text-left">
          <p className="text-[13px] font-medium uppercase tracking-[0.02em] text-grey-500">Laptop bags</p>
          <h2 className="mt-2 text-[28px] font-bold text-black">Carry the studio with you</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-grey-500">
            Backpacks, briefcases, and sleeves built for 16&quot; machines and cross-city commutes.
          </p>
          <Link
            href="/products?category=laptop-bags"
            className="mt-6 inline-flex items-center justify-center rounded-pill border border-black bg-black px-8 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-grey-900"
          >
            Shop bags
          </Link>
        </div>
      </div>
    </section>
  );
}
