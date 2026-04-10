"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { IMAGES, imgHero1920 } from "@/lib/images";

/** Matches `app/globals.css` body stack so the block feels native to the page. */
const fontBody = '"Helvetica Neue", Helvetica, Arial, sans-serif';

export function MemberCTA() {
  const { ref, isVisible } = useScrollReveal(0.15);
  const bg = imgHero1920(IMAGES.lifestyle.galleryHall);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-6 py-[100px] text-center sm:px-[clamp(24px,5vw,80px)]"
      style={{
        backgroundColor: "#f7f6f3",
        fontFamily: fontBody,
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={bg}
          alt=""
          fill
          className="object-cover object-[center_45%] sm:object-[center_40%]"
          sizes="100vw"
          priority={false}
        />
        {/* Light wash so the photo reads softly; keeps copy legible */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#faf9f7]/92 via-[#f7f6f4]/85 to-[#faf9f7]/93"
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 100% 80% at 50% 45%, rgba(255,255,255,0.35) 0%, rgba(247,246,243,0.65) 55%, rgba(245,244,240,0.92) 100%)",
          }}
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[900px]">
        <motion.span
          initial={false}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-block rounded-full border border-[#111]/[0.08] bg-white/55 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#5c5c5c] shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-[6px]"
        >
          Quantum Razer Membership
        </motion.span>

        <div className="overflow-hidden">
          <motion.h2
            initial={false}
            animate={isVisible ? { y: 0 } : { y: "100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2rem,5.5vw,4.25rem)] font-bold uppercase leading-[1.02] tracking-[-0.015em] text-[#1a1a1a]"
          >
            The best of
          </motion.h2>
        </div>
        <div className="overflow-hidden">
          <motion.h2
            initial={false}
            animate={isVisible ? { y: 0 } : { y: "100%" }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2rem,5.5vw,4.25rem)] font-bold uppercase leading-[1.02] tracking-[-0.015em] text-[#1a1a1a]"
          >
            Quantum Razer.
          </motion.h2>
        </div>

        <motion.p
          initial={false}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mx-auto mb-10 mt-5 max-w-[28rem] text-[15px] font-normal leading-[1.65] text-[#757575] sm:text-[16px] sm:leading-[1.7]"
        >
          Free shipping. Early access to drops. Members-only pricing. No annual fee.
        </motion.p>

        <motion.div
          initial={false}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mb-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
        >
          {["Free Delivery", "Early Access", "Member Pricing"].map((label) => (
            <div
              key={label}
              className="flex items-center gap-2 text-[13px] font-medium tracking-[0.02em] text-[#4a4a4a] sm:text-[14px]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="shrink-0 text-[#4a7c7c]"
              >
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={false}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: 0.6, duration: 0.45 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <Link
            href="/register"
            className="inline-block rounded-full bg-[#111] px-9 py-3.5 text-[15px] font-semibold tracking-[0.02em] text-white transition-colors duration-200 hover:bg-[#2a2a2a] sm:px-10 sm:py-4 sm:text-[15px]"
          >
            Join Free
          </Link>
          <Link
            href="/login"
            className="inline-block rounded-full border border-[#111]/18 bg-white/70 px-9 py-3.5 text-[15px] font-semibold tracking-[0.02em] text-[#1a1a1a] backdrop-blur-sm transition-colors duration-200 hover:border-[#111]/28 hover:bg-white/95 sm:px-10 sm:py-4"
          >
            Sign In
          </Link>
        </motion.div>

        <p className="mt-5 text-[12px] font-normal leading-normal tracking-[0.02em] text-[#9a9a9a] sm:text-[13px]">
          No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
