import Link from "next/link";

import { BRAND } from "@/lib/constants";

const personas = [
  {
    id: "gamer",
    title: "Gamer",
    copy: "High refresh, low latency — gear that keeps up when the lobby pops off.",
    href: "/products?sport=Gaming",
  },
  {
    id: "designer",
    title: "Designer",
    copy: "Color-accurate panels, precise input, zero compromise on the pixel grind.",
    href: "/products?is_featured=true",
  },
  {
    id: "producer",
    title: "Producer",
    copy: "Interfaces, headphones, storage — wired for the bounce and the bounce-back.",
    href: "/products?category=gadgets",
  },
  {
    id: "skater",
    title: "Skater / Street",
    copy: "Compact rigs, durable shells, capture-ready when you’re on the move.",
    href: "/products?category=gadgets",
  },
];

export default function CreatorsPage() {
  return (
    <div className="min-h-[70vh] bg-white px-6 py-20 md:px-[var(--content-padding)]">
      <div className="mx-auto max-w-content">
        <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.02em] text-grey-500">Creators</p>
        <h1 className="max-w-[18ch] text-[clamp(40px,8vw,72px)] font-black uppercase leading-tight tracking-[-0.02em] text-black">
          Four vibes. One desk.
        </h1>
        <p className="mt-6 max-w-xl text-[15px] leading-[1.75] text-grey-500">
          {BRAND.tagline} {BRAND.subTagline}
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {personas.map((p) => (
            <Link
              key={p.id}
              id={p.id}
              href={p.href}
              className="block border-l-4 border-black bg-grey-100 px-8 py-8 transition-colors hover:bg-grey-200"
            >
              <h2 className="text-[32px] font-bold text-black">{p.title}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-grey-500">{p.copy}</p>
              <span className="mt-4 inline-block text-[15px] font-medium text-black underline">Shop picks</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
