"use client";

import Image from "next/image";
import Link from "next/link";

import { MEGA_BY_KEY, type MegaMenuKey } from "@/lib/constants";

export function MegaMenu({
  menuKey,
  onClose,
}: {
  menuKey: MegaMenuKey | null;
  onClose: () => void;
}) {
  const data = menuKey ? MEGA_BY_KEY[menuKey] : null;

  if (!menuKey || !data) return null;

  return (
    <div
      className="absolute left-0 right-0 top-full z-[9998] border-b border-t border-grey-200 bg-white shadow-mega"
      onMouseLeave={onClose}
    >
      <div className="mx-auto flex max-w-content flex-col gap-10 px-6 py-8 lg:flex-row lg:gap-12">
        <div className="grid flex-1 grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
          {data.columns.map((col) => (
            <div key={col.title}>
              <p className="mb-5 border-b border-grey-200 pb-2 text-[13px] font-medium uppercase tracking-[0.06em] text-grey-500">
                {col.title}
              </p>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="group block py-1.5 text-[15px] text-black hover:font-medium">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {data.featuredImage && (
          <Link href={data.featuredHref ?? "/products"} className="group mx-auto block w-full max-w-[280px] shrink-0 lg:mx-0 lg:w-[280px]">
            <div className="relative aspect-[3/4] overflow-hidden rounded-brand bg-grey-100">
              <Image
                src={data.featuredImage}
                alt=""
                fill
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
                sizes="280px"
              />
            </div>
            {data.featuredEyebrow && (
              <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.08em] text-grey-500">{data.featuredEyebrow}</p>
            )}
            {data.featuredTitle && <p className="mt-1 text-[15px] font-medium text-black">{data.featuredTitle}</p>}
            <span className="mt-2 inline-block text-[15px] text-black underline">Shop Now</span>
          </Link>
        )}
      </div>
    </div>
  );
}
