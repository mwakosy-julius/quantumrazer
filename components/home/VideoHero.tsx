"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { getNextNarrative, NARRATIVES, NARRATIVE_ORDER, type NarrativeId } from "@/lib/narratives";
import { VIDEOS } from "@/lib/videos";

const heroSans =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif';

type Props = {
  narrativeId: NarrativeId;
  onNarrativeChange: (id: NarrativeId) => void;
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

export function VideoHero({ narrativeId, onNarrativeChange }: Props) {
  const saveData = useSaveData();
  const reducedMotion = usePrefersReducedMotion();
  const loadVideos = !saveData && !reducedMotion;
  const [hoverPause, setHoverPause] = useState(false);
  const videoRefs = useRef<Partial<Record<NarrativeId, HTMLVideoElement | null>>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAdvance = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const scheduleAdvance = useCallback(() => {
    clearAdvance();
    if (hoverPause) return;
    intervalRef.current = setInterval(() => {
      onNarrativeChange(getNextNarrative(narrativeId));
    }, 8000);
  }, [clearAdvance, hoverPause, narrativeId, onNarrativeChange]);

  useEffect(() => {
    scheduleAdvance();
    return clearAdvance;
  }, [scheduleAdvance, clearAdvance]);

  useEffect(() => {
    NARRATIVE_ORDER.forEach((nid) => {
      const el = videoRefs.current[nid];
      if (!el || !loadVideos) return;
      if (nid === narrativeId) {
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    });
  }, [narrativeId, loadVideos]);

  const activeIndex = NARRATIVE_ORDER.indexOf(narrativeId);
  const narrative = NARRATIVES[narrativeId];

  return (
    <section
      className="relative flex w-full flex-col overflow-hidden bg-black"
      style={{
        height: "calc(100dvh - var(--layout-header-offset))",
        maxHeight: "calc(100dvh - var(--layout-header-offset))",
      }}
      onMouseEnter={() => setHoverPause(true)}
      onMouseLeave={() => setHoverPause(false)}
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${narrative.heroPoster})` }}
        aria-hidden
      />

      {loadVideos &&
        NARRATIVE_ORDER.map((nid) => {
          const n = NARRATIVES[nid];
          const isActive = nid === narrativeId;
          return (
            <video
              key={nid}
              ref={(el) => {
                videoRefs.current[nid] = el;
              }}
              className={`qr-hero-video absolute inset-0 z-0 h-full w-full object-cover object-center transition-opacity duration-[800ms] ease-in-out ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
              src={n.heroVideo}
              poster={n.heroPoster}
              autoPlay={isActive}
              muted
              loop
              playsInline
              preload={isActive ? "auto" : "none"}
              aria-hidden
              onError={(e) => {
                const el = e.currentTarget;
                if (el.src && !el.src.includes("2278095")) {
                  el.src = VIDEOS.fallback;
                }
              }}
            />
          );
        })}

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-[65%]"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.15) 70%, transparent 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 top-0 z-[1] hidden w-[55%] md:block"
        style={{
          background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-[1] h-[160px]"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)",
        }}
        aria-hidden
      />

      <div
        className="relative z-10 mt-auto px-6 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-4 md:pr-[clamp(24px,42vw,48%)]"
        style={{ paddingLeft: "clamp(20px, 5vw, 72px)", paddingRight: "clamp(20px, 5vw, 72px)" }}
      >
        <motion.div
          className="mb-3 inline-flex items-center gap-2"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="h-px w-6 bg-white/90" aria-hidden />
          <span
            className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/75 sm:text-[11px]"
            style={{ fontFamily: heroSans }}
          >
            {narrative.eyebrow}
          </span>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={narrativeId}
            initial="hidden"
            animate="show"
            exit="exit"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15, delayChildren: 0.05 } },
              exit: { transition: { staggerChildren: 0.08, staggerDirection: -1 } },
            }}
            className="max-w-full"
          >
            <div className="overflow-hidden">
              <motion.h1
                className="text-[clamp(1.5rem,3.8vw+0.6rem,2.75rem)] font-bold uppercase leading-[1.06] tracking-tight text-white sm:text-[clamp(1.625rem,3.2vw+0.5rem,3rem)]"
                style={{ fontFamily: heroSans }}
                variants={{
                  hidden: { y: "110%" },
                  show: {
                    y: 0,
                    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
                  },
                  exit: {
                    y: "-110%",
                    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                {narrative.headline[0]}
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                className="text-[clamp(1.5rem,3.8vw+0.6rem,2.75rem)] font-bold uppercase leading-[1.06] tracking-tight text-white sm:text-[clamp(1.625rem,3.2vw+0.5rem,3rem)]"
                style={{ fontFamily: heroSans }}
                variants={{
                  hidden: { y: "110%" },
                  show: {
                    y: 0,
                    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
                  },
                  exit: {
                    y: "-110%",
                    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                {narrative.headline[1]}
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                className="text-[clamp(1.5rem,3.8vw+0.6rem,2.75rem)] font-bold uppercase leading-[1.06] tracking-tight text-white sm:text-[clamp(1.625rem,3.2vw+0.5rem,3rem)]"
                style={{ fontFamily: heroSans }}
                variants={{
                  hidden: { y: "110%" },
                  show: {
                    y: 0,
                    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
                  },
                  exit: {
                    y: "-110%",
                    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                {narrative.headline[2]}
              </motion.h1>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.p
          key={`sub-${narrativeId}`}
          className="mt-3 max-w-[28rem] text-[13px] font-normal leading-[1.55] text-white/72 sm:text-[14px] sm:leading-relaxed"
          style={{ fontFamily: heroSans }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
        >
          {narrative.subheadline}
        </motion.p>

        <div className="mt-5 flex flex-row flex-wrap gap-2 sm:gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.5, ease: "easeOut" }}
          >
            <Link
              href={narrative.ctaPrimaryHref}
              className="inline-block whitespace-nowrap rounded-full bg-white px-6 py-2.5 text-[13px] font-semibold tracking-wide text-[#111] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-white/90 sm:px-7 sm:py-3 sm:text-sm"
              style={{ fontFamily: heroSans }}
            >
              {narrative.ctaPrimary}
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.5, ease: "easeOut" }}
          >
            <Link
              href={narrative.ctaSecondaryHref}
              className="inline-block whitespace-nowrap rounded-full border border-white/35 bg-white/[0.08] px-6 py-2.5 text-[13px] font-medium text-white transition-all duration-200 ease-out hover:border-white/60 hover:bg-white/[0.15] sm:px-7 sm:py-3 sm:text-sm"
              style={{ fontFamily: heroSans }}
            >
              {narrative.ctaSecondary}
            </Link>
          </motion.div>
        </div>
      </div>

      <div
        className="absolute bottom-[max(5.5rem,env(safe-area-inset-bottom,0px))] right-[clamp(16px,4vw,48px)] z-10 flex items-center gap-2 sm:bottom-[max(4.5rem,env(safe-area-inset-bottom,0px))]"
        role="tablist"
        aria-label="Home themes"
      >
        <div className="flex gap-2">
          {NARRATIVE_ORDER.map((id) => {
            const active = id === narrativeId;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`cursor-pointer rounded-full transition-all duration-300 ease-out ${
                  active ? "h-2 w-7 rounded bg-white" : "h-2 w-2 bg-white/30 hover:bg-white/60"
                }`}
                onClick={() => onNarrativeChange(id)}
              />
            );
          })}
        </div>
        <span
          className="ml-1 text-[10px] font-normal uppercase tracking-[0.1em] text-white/45"
          style={{ fontFamily: heroSans }}
        >
          {String(activeIndex + 1).padStart(2, "0")}/{String(NARRATIVE_ORDER.length).padStart(2, "0")}
        </span>
      </div>

      <div className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 sm:bottom-3">
        <div
          className="animate-scroll-line h-10 w-px overflow-hidden bg-white/30"
          style={{ animation: reducedMotion ? "none" : undefined }}
          aria-hidden
        >
          <div className="h-full w-full bg-white/80" />
        </div>
        <span
          className="text-[9px] font-normal uppercase tracking-[0.14em] text-white/38 sm:text-[10px]"
          style={{ fontFamily: heroSans }}
        >
          Scroll
        </span>
      </div>
    </section>
  );
}
