import Link from "next/link";

import { QuantumRazerLogo } from "@/components/brand/QuantumRazerLogo";
import { BRAND, CONTACT } from "@/lib/constants";

type FooterLink = { label: string; href: string; external?: boolean };

const cols: { title: string; links: FooterLink[] }[] = [
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
      { label: "Help Centre", href: "/help" },
      { label: "Track Order", href: "/account" },
      { label: "Delivery", href: "/help#delivery" },
      { label: "Returns & Warranty", href: "/help#returns" },
      { label: "FAQ", href: "/help#faq" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: `WhatsApp ${CONTACT.whatsappDisplay}`, href: CONTACT.whatsappUrl, external: true },
      { label: `Instagram ${CONTACT.instagramHandle}`, href: CONTACT.instagramUrl, external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Creators", href: "/creators" },
      { label: "Join Us", href: "/register" },
      { label: "Sign In", href: "/login" },
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
                    {l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block py-1.5 text-[13px] text-[rgba(255,255,255,0.7)] transition-colors duration-150 hover:text-white"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="block py-1.5 text-[13px] text-[rgba(255,255,255,0.7)] transition-colors duration-150 hover:text-white"
                      >
                        {l.label}
                      </Link>
                    )}
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
              <span aria-hidden>🌐</span> Tanzania
            </p>
            <div className="flex gap-6 text-[13px] text-[rgba(255,255,255,0.7)]">
              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                Instagram
              </a>
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                WhatsApp
              </a>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center gap-3 border-t border-[rgba(255,255,255,0.15)] pt-6 text-center md:flex-row md:justify-between">
            <p className="text-[11px] tracking-[0.02em] text-[rgba(255,255,255,0.45)]">
              © {new Date().getFullYear()} Quantum Razer. All Rights Reserved
            </p>
            <Link href="/help" className="text-[11px] text-[rgba(255,255,255,0.45)] hover:text-white">
              Help Centre
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
