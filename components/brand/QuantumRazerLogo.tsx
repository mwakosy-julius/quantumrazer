"use client";

import Image from "next/image";
import Link from "next/link";

const WORDMARK = "QUANTUM RAZER";

type LogoSize = "nav" | "footer" | "compact";

const sizes: Record<LogoSize, { icon: number; wordmark: number; gap: number }> = {
  nav: { icon: 28, wordmark: 18, gap: 10 },
  footer: { icon: 36, wordmark: 24, gap: 10 },
  compact: { icon: 28, wordmark: 20, gap: 10 },
};

export function QuantumRazerLogo({
  size = "nav",
  theme = "light",
  href = "/",
  className = "",
  onNavigate,
}: {
  size?: LogoSize;
  theme?: "light" | "dark";
  href?: string;
  className?: string;
  onNavigate?: () => void;
}) {
  const s = sizes[size];
  const wordmarkColor = theme === "dark" ? "#FFFFFF" : "#111111";

  const inner = (
    <>
      <div className="relative shrink-0" style={{ width: s.icon, height: s.icon }}>
        <Image
          src="/images/quantum-razer-mark.png"
          alt=""
          fill
          className="object-contain"
          sizes={`${s.icon}px`}
          priority={size === "nav"}
        />
      </div>
      <span
        className="font-black uppercase leading-none"
        style={{
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: s.wordmark,
          letterSpacing: "0.04em",
          color: wordmarkColor,
        }}
      >
        {WORDMARK}
      </span>
    </>
  );

  const wrapClass = `inline-flex cursor-pointer items-center no-underline ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={wrapClass}
        style={{ gap: s.gap }}
        onClick={() => onNavigate?.()}
        aria-label={`${WORDMARK} home`}
      >
        {inner}
      </Link>
    );
  }

  return (
    <span className={wrapClass} style={{ gap: s.gap }}>
      {inner}
    </span>
  );
}
