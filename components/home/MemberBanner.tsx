import Image from "next/image";
import Link from "next/link";

import { IMAGES, imgHero1600 } from "@/lib/images";

export function MemberBanner() {
  const src = imgHero1600(IMAGES.lifestyle.africanDev);

  return (
    <section className="relative min-h-[420px] overflow-hidden bg-black py-20 text-center text-white md:min-h-[480px] md:py-24">
      <Image src={src} alt="" fill className="object-cover object-center" sizes="100vw" />
      <div className="absolute inset-0 bg-[rgba(17,17,17,0.8)]" />
      <div className="relative z-[1] px-6 md:px-[var(--content-padding)]">
        <h2 className="text-[clamp(36px,5vw,64px)] font-black uppercase leading-tight text-white">
          Join the Collective
        </h2>
        <p className="mx-auto mt-4 max-w-[540px] text-[18px] text-grey-300">
          Early access to drops, free delivery on qualifying orders, and member-only gear.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-pill bg-white px-8 py-4 text-[16px] font-medium text-black transition-colors hover:bg-grey-100"
          >
            Create Account
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-pill border border-[rgba(255,255,255,0.4)] bg-transparent px-8 py-4 text-[16px] font-medium text-white transition-colors hover:bg-[rgba(255,255,255,0.08)]"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
