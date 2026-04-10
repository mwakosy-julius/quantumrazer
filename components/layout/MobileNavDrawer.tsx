"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { QuantumRazerLogo } from "@/components/brand/QuantumRazerLogo";
import { MEGA_BY_KEY, NAV_MAIN, type MegaMenuKey } from "@/lib/constants";

export function MobileNavDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [panel, setPanel] = useState<MegaMenuKey | "root">("root");

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-[10000] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[10001] flex flex-col bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-nav shrink-0 items-center justify-between border-b border-grey-200 px-6">
              <QuantumRazerLogo size="nav" theme="light" href="/" onNavigate={onClose} />
              <button type="button" className="p-2 text-black" aria-label="Close" onClick={onClose}>
                ✕
              </button>
            </div>

            {panel === "root" ? (
              <nav className="flex-1 overflow-y-auto">
                {NAV_MAIN.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="flex w-full items-center justify-between border-b border-grey-200 px-6 py-4 text-left"
                    onClick={() => setPanel(item.id)}
                  >
                    <span className="text-[18px] font-medium text-black">{item.label}</span>
                    <span className="text-[18px] text-grey-300">›</span>
                  </button>
                ))}
                <div className="border-t border-grey-200 px-6 py-4">
                  <Link href="/login" className="block py-2 text-[16px] text-black" onClick={onClose}>
                    Sign In
                  </Link>
                  <Link href="/register" className="block py-2 text-[16px] text-black" onClick={onClose}>
                    Join Us
                  </Link>
                </div>
              </nav>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <button
                  type="button"
                  className="flex items-center gap-2 border-b border-grey-200 px-6 py-4 text-left text-[15px] font-medium text-black"
                  onClick={() => setPanel("root")}
                >
                  <span aria-hidden>←</span> {NAV_MAIN.find((n) => n.id === panel)?.label}
                </button>
                <div className="flex-1 overflow-y-auto">
                  {MEGA_BY_KEY[panel].columns.map((col) => (
                    <div key={col.title} className="border-b border-grey-200 px-6 py-3">
                      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-grey-500">{col.title}</p>
                      <ul>
                        {col.links.map((l) => (
                          <li key={l.label}>
                            <Link
                              href={l.href}
                              className="block py-3 text-[16px] text-black"
                              onClick={() => {
                                setPanel("root");
                                onClose();
                              }}
                            >
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="p-6">
                    <Link
                      href={NAV_MAIN.find((n) => n.id === panel)?.href ?? "/products"}
                      className="text-[15px] text-black underline"
                      onClick={() => {
                        setPanel("root");
                        onClose();
                      }}
                    >
                      View category →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
