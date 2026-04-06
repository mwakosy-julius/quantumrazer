"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";

const slides = [
  {
    image: "https://picsum.photos/seed/hero1/1920/1080",
    eyebrow: "New Season",
    title: "Run The City",
    copy: "Responsive cushioning meets bold design for your daily miles.",
    primary: { label: "Shop", href: "/products" },
    secondary: { label: "Learn More", href: "/collections/pegasus" },
  },
  {
    image: "https://picsum.photos/seed/hero2/1920/1080",
    eyebrow: "Members",
    title: "Early Access",
    copy: "Unlock drops, free delivery, and member-only styles.",
    primary: { label: "Join Us", href: "/register" },
    secondary: { label: "Sign In", href: "/login" },
  },
];

export function HeroBanner() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);
  const s = slides[idx];
  return (
    <section className="relative h-[85vh] w-full overflow-hidden">
      <Image src={s.image} alt="" fill priority className="object-cover object-center" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-0 left-0 max-w-[480px] p-12 text-white">
        <p className="text-[13px] uppercase tracking-[0.08em]">{s.eyebrow}</p>
        <h1 className="mt-2 font-black uppercase leading-none tracking-tight" style={{ fontSize: "clamp(40px,5vw,72px)" }}>
          {s.title}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed">{s.copy}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={s.primary.href}>
            <Button className="bg-white text-black hover:bg-grey-100">{s.primary.label}</Button>
          </Link>
          <Link href={s.secondary.href}>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              {s.secondary.label}
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 w-2 rounded-full ${i === idx ? "bg-white" : "bg-white/40"}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </section>
  );
}
