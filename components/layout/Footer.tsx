import Link from "next/link";

import { QuantumRazerLogo } from "@/components/brand/QuantumRazerLogo";
import { BRAND } from "@/lib/constants";

const cols = [
  {
    title: "Shop",
    links: [
      { label: "Laptops", href: "/products?category=laptops" },
      { label: "Accessories", href: "/products?category=accessories" },
      { label: "Laptop Bags", href: "/products?category=laptop-bags" },
      { label: "Gadgets", href: "/products?category=gadgets" },
      { label: "Sale", href: "/sale" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Track Order", href: "/account" },
      { label: "Returns", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Warranty", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Press", href: "#" },
      { label: "Creators", href: "/creators" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-black px-6 pb-8 pt-16 text-white md:px-[var(--content-padding)]">
      <div className="mx-auto max-w-content">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {cols.map((c) => (
            <div key={c.title}>
              <p className="mb-5 text-[15px] font-bold text-white">{c.title}</p>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="block py-1.5 text-[13px] text-[rgba(255,255,255,0.7)] transition-colors duration-150 hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[rgba(255,255,255,0.15)] pt-6">
          <div className="flex flex-col flex-wrap items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-col items-center gap-2 md:items-start">
              <QuantumRazerLogo size="footer" theme="dark" href="/" />
              <p className="max-w-xs text-center text-[13px] text-[rgba(255,255,255,0.7)] md:text-left">{BRAND.tagline}</p>
            </div>
            <p className="flex items-center gap-2 text-[13px] text-[rgba(255,255,255,0.7)]">
              <span aria-hidden>🌐</span> United States
            </p>
            <div className="flex gap-6 text-[13px] text-[rgba(255,255,255,0.7)]">
              <Link href="#" className="transition-colors hover:text-white" aria-label="Instagram">
                Instagram
              </Link>
              <Link href="#" className="transition-colors hover:text-white" aria-label="X">
                X
              </Link>
              <Link href="#" className="transition-colors hover:text-white" aria-label="YouTube">
                YouTube
              </Link>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center gap-3 border-t border-[rgba(255,255,255,0.15)] pt-6 text-center md:flex-row md:justify-between">
            <p className="text-[11px] tracking-[0.02em] text-[rgba(255,255,255,0.45)]">
              © 2025 Quantum Razer, Inc. All Rights Reserved
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-[11px] text-[rgba(255,255,255,0.45)]">
              <Link href="#" className="hover:text-white">
                Privacy
              </Link>
              <span aria-hidden>·</span>
              <Link href="#" className="hover:text-white">
                Terms
              </Link>
              <span aria-hidden>·</span>
              <Link href="#" className="hover:text-white">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
