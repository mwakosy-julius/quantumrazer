"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "Shoes",
    links: ["All Shoes", "Running", "Basketball", "Jordan", "Training", "Casual"],
  },
  {
    title: "Clothing",
    links: ["All Clothing", "Tops", "Shorts", "Tracksuits", "Hoodies", "Socks"],
  },
  {
    title: "Shop By Sport",
    links: ["Running", "Basketball", "Football", "Training", "Yoga", "Golf"],
  },
];

export function MegaMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 right-0 top-full z-[9998] border-b border-grey-200 bg-white shadow-mega"
          onMouseLeave={onClose}
        >
          <div className="mx-auto flex max-w-content gap-12 px-[48px] py-8">
            {columns.map((col) => (
              <div key={col.title} className="min-w-[160px]">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-grey-500">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link
                        href={`/products?sport=${encodeURIComponent(l)}`}
                        className="text-[14px] text-black hover:underline"
                      >
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="ml-auto hidden w-[320px] shrink-0 md:block">
              <Link href="/collections/air-max" className="group block overflow-hidden">
                <div className="relative aspect-video overflow-hidden bg-grey-100">
                  <Image
                    src="https://picsum.photos/seed/mega/640/360"
                    alt="Featured"
                    fill
                    className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent p-4 text-white">
                    <p className="text-lg font-black uppercase">Air Max</p>
                    <span className="text-sm underline">Shop Now</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
