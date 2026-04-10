"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const messages = [
  "Free Delivery & Returns on Orders Over $75",
  "New Drop: Creator Series Laptops — Shop Now",
  "Next Day Delivery Available on Gaming Rigs",
  "Members Get Early Access to Every Drop",
  "Free Laptop Bag With Every Laptop Purchase",
];

const STORAGE_KEY = "qr_announce_dismissed";

const ease = "cubic-bezier(0.4, 0, 0.2, 1)";

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [slideActive, setSlideActive] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [intervalKey, setIntervalKey] = useState(0);

  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const raf1Ref = useRef<number | null>(null);
  const raf2Ref = useRef<number | null>(null);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setDismissed(true);
    } catch {
      /* ignore */
    }
  }, []);

  const clearAnimationTimers = useCallback(() => {
    if (animTimeoutRef.current != null) {
      clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = null;
    }
    if (raf1Ref.current != null) {
      cancelAnimationFrame(raf1Ref.current);
      raf1Ref.current = null;
    }
    if (raf2Ref.current != null) {
      cancelAnimationFrame(raf2Ref.current);
      raf2Ref.current = null;
    }
  }, []);

  const finishTransition = useCallback((target: number) => {
    setCurrentIndex(target);
    currentIndexRef.current = target;
    setNextIndex(null);
    setSlideActive(false);
    isAnimatingRef.current = false;
  }, []);

  const goTo = useCallback(
    (rawTarget: number, resetTimer: boolean) => {
      if (isAnimatingRef.current || dismissed) return;
      const len = messages.length;
      const target = ((rawTarget % len) + len) % len;
      if (target === currentIndexRef.current) return;

      clearAnimationTimers();
      isAnimatingRef.current = true;
      setSlideActive(false);
      setNextIndex(target);

      raf1Ref.current = requestAnimationFrame(() => {
        raf2Ref.current = requestAnimationFrame(() => {
          setSlideActive(true);
          raf1Ref.current = null;
          raf2Ref.current = null;
          animTimeoutRef.current = setTimeout(() => {
            finishTransition(target);
            animTimeoutRef.current = null;
          }, 400);
        });
      });

      if (resetTimer) setIntervalKey((k) => k + 1);
    },
    [clearAnimationTimers, dismissed, finishTransition],
  );

  useEffect(() => () => clearAnimationTimers(), [clearAnimationTimers]);

  useEffect(() => {
    if (dismissed || isPaused) return;
    const id = setInterval(() => {
      const next = (currentIndexRef.current + 1) % messages.length;
      goTo(next, false);
    }, 3000);
    return () => clearInterval(id);
  }, [dismissed, isPaused, intervalKey, goTo]);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    clearAnimationTimers();
    setDismissed(true);
  };

  if (dismissed) return null;

  const transitionStyle = `transform 400ms ${ease}`;

  return (
    <div
      role="region"
      aria-label="Announcements"
      className="relative flex w-full items-center justify-center overflow-hidden bg-[#111111] text-white"
      style={{ height: 36 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <button
        type="button"
        className="absolute left-4 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-base leading-none text-[rgba(255,255,255,0.6)] transition-colors duration-150 ease-out hover:text-white"
        aria-label="Previous announcement"
        onClick={() => goTo(currentIndexRef.current - 1, true)}
      >
        ‹
      </button>

      <div className="relative mx-14 flex h-full min-h-0 flex-1 items-center justify-center overflow-hidden">
        {nextIndex === null ? (
          <div
            className="absolute inset-0 flex items-center justify-center px-2"
            aria-live="polite"
          >
            <span
              className="text-center text-[13px] font-medium tracking-[0.02em] text-white"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              {messages[currentIndex]}
            </span>
          </div>
        ) : (
          <div className="absolute inset-0 overflow-hidden" aria-live="polite">
            <span
              className="absolute inset-x-0 top-0 flex h-full items-center justify-center px-2 text-center text-[13px] font-medium tracking-[0.02em] text-white"
              style={{
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                transform: slideActive ? "translateY(-100%)" : "translateY(0)",
                transition: transitionStyle,
              }}
            >
              {messages[currentIndex]}
            </span>
            <span
              className="absolute inset-x-0 top-0 flex h-full items-center justify-center px-2 text-center text-[13px] font-medium tracking-[0.02em] text-white"
              style={{
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                transform: slideActive ? "translateY(0)" : "translateY(100%)",
                transition: transitionStyle,
              }}
            >
              {messages[nextIndex]}
            </span>
          </div>
        )}
      </div>

      <button
        type="button"
        className="absolute right-10 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-base leading-none text-[rgba(255,255,255,0.6)] transition-colors duration-150 ease-out hover:text-white"
        aria-label="Next announcement"
        onClick={() => goTo(currentIndexRef.current + 1, true)}
      >
        ›
      </button>

      <button
        type="button"
        className="absolute right-4 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-sm leading-none text-[rgba(255,255,255,0.6)] transition-colors duration-150 ease-out hover:text-white"
        aria-label="Dismiss announcement"
        onClick={handleDismiss}
      >
        ×
      </button>
    </div>
  );
}
