"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  searchProductsQuick,
  type QuickSearchItem,
} from "@/actions/search.actions";
import { whatsappLink } from "@/lib/constants";
import { imgProductCardPrimary } from "@/lib/images";

const HEADING_WORDS = ["What", "are", "you", "looking", "for?"] as const;
const QUICK_TERMS = [
  "Gaming",
  "Lenovo",
  "HP",
  "Apple",
  "Backpack",
  "Headphones",
] as const;

type Status = "idle" | "loading" | "done" | "error";

/**
 * Search-first entry point: type what you want and matching products
 * animate in underneath, without leaving the page.
 */
export function ProductFinder() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<QuickSearchItem[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const requestId = useRef(0);

  const term = query.trim();

  useEffect(() => {
    if (term.length < 2) {
      requestId.current += 1;
      setItems([]);
      setTotal(0);
      setStatus("idle");
      return;
    }
    setStatus("loading");
    const id = ++requestId.current;
    const timer = setTimeout(() => {
      searchProductsQuick(term)
        .then((res) => {
          if (id !== requestId.current) return;
          setItems(res.items);
          setTotal(res.total);
          setStatus("done");
        })
        .catch(() => {
          if (id !== requestId.current) return;
          setItems([]);
          setTotal(0);
          setStatus("error");
        });
    }, 250);
    return () => clearTimeout(timer);
  }, [term]);

  const hasResults = status !== "idle";
  const seeAllHref = `/search?q=${encodeURIComponent(term)}`;

  const ease = [0.16, 1, 0.3, 1] as const;
  const rise = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 36 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  };

  return (
    <div id="find" className="scroll-mt-[var(--nav-height)] bg-black">
      <section
        className={`rounded-t-[28px] bg-white px-6 pb-12 md:px-[var(--content-padding)] md:pb-16 ${
          hasResults
            ? "pt-12 md:pt-16"
            : "flex min-h-[calc(100dvh-var(--nav-height))] flex-col justify-center pt-12 md:pt-16"
        }`}
      >
        <motion.div
          className="mx-auto w-full max-w-3xl text-center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.12,
                delayChildren: 0.05,
              },
            },
          }}
        >
          <h2 className="text-[34px] font-black leading-[1.05] text-black md:text-[56px]">
            {HEADING_WORDS.map((word, i) => (
              <span
                key={i}
                className="inline-block overflow-hidden pb-[0.12em] align-bottom"
              >
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden: reduceMotion ? { opacity: 0 } : { y: "110%" },
                    show: {
                      y: 0,
                      opacity: 1,
                      transition: { duration: 0.75, ease },
                    },
                  }}
                >
                  {word}
                  {i < HEADING_WORDS.length - 1 ? "\u00A0" : ""}
                </motion.span>
              </span>
            ))}
          </h2>
          <motion.p
            variants={rise}
            className="mt-3 text-[15px] text-grey-500 md:text-[17px]"
          >
            Type a brand, a model or what you need it for.
          </motion.p>

          <motion.form
            role="search"
            variants={{
              hidden: reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 36, scaleX: 0.55 },
              show: {
                opacity: 1,
                y: 0,
                scaleX: 1,
                transition: { duration: 0.8, ease },
              },
            }}
            className="mt-7 flex items-center gap-3 rounded-pill border border-grey-200 bg-white py-2 pl-5 pr-2 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-colors focus-within:border-black"
            onSubmit={(e) => {
              e.preventDefault();
              if (term) router.push(seeAllHref);
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0 text-grey-500"
              aria-hidden
            >
              <circle
                cx="10.5"
                cy="10.5"
                r="6.5"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="m16 16 4.5 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              enterKeyHint="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Lenovo, gaming laptop, backpack…"
              aria-label="Search products"
              className="[&::-webkit-search-cancel-button]:hidden h-12 min-w-0 flex-1 border-0 bg-transparent text-[16px] text-black outline-none placeholder:text-grey-300"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                className="flex h-11 w-11 shrink-0 items-center justify-center text-grey-500 hover:text-black"
                onClick={() => setQuery("")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
            <button
              type="submit"
              className="h-12 shrink-0 rounded-pill bg-black px-5 text-[15px] font-medium text-white transition-opacity hover:opacity-80"
            >
              Search
            </button>
          </motion.form>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {QUICK_TERMS.map((t) => (
              <motion.button
                key={t}
                type="button"
                variants={{
                  hidden: reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 18, scale: 0.9 },
                  show: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.5, ease },
                  },
                }}
                onClick={() => setQuery(t)}
                className={`min-h-[40px] rounded-pill border px-4 text-[14px] transition-colors ${
                  term.toLowerCase() === t.toLowerCase()
                    ? "border-black bg-black text-white"
                    : "border-grey-200 bg-white text-black hover:border-black"
                }`}
              >
                {t}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="mx-auto w-full max-w-content" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {status === "loading" && items.length === 0 && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4"
              >
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] animate-pulse rounded-brand bg-grey-100"
                  />
                ))}
              </motion.div>
            )}

            {items.length > 0 && (
              <motion.div
                key={`results-${term}`}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: reduceMotion ? 0 : 0.06 },
                  },
                }}
                className={`mt-10 transition-opacity ${status === "loading" ? "opacity-60" : "opacity-100"}`}
              >
                <div className="mb-5 flex items-end justify-between gap-4">
                  <p className="text-[15px] text-grey-500">
                    {total} {total === 1 ? "match" : "matches"} for “{term}”
                  </p>
                  {total > items.length && (
                    <Link
                      href={seeAllHref}
                      className="shrink-0 text-[15px] text-black underline"
                    >
                      See all {total}
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
                  {items.map((p) => (
                    <motion.div
                      key={p.slug}
                      variants={{
                        hidden: reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: 28, scale: 0.96 },
                        show: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: {
                            duration: 0.45,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        },
                      }}
                    >
                      <Link
                        href={`/products/${p.slug}`}
                        className="group block text-left"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-brand bg-grey-100">
                          {p.imageUrl && (
                            <Image
                              src={imgProductCardPrimary(p.imageUrl)}
                              alt={p.name}
                              fill
                              sizes="(max-width:768px) 50vw, 25vw"
                              className="object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                            />
                          )}
                        </div>
                        <p className="mt-3 text-[12px] font-medium uppercase tracking-[0.04em] text-grey-500">
                          {p.brand}
                        </p>
                        <h3 className="line-clamp-2 text-[15px] font-medium leading-snug text-black">
                          {p.name}
                        </h3>
                        {p.spec && (
                          <p className="line-clamp-1 text-[13px] text-grey-500">
                            {p.spec}
                          </p>
                        )}
                        <p className="mt-1 text-[15px] text-black">
                          {p.comparePrice && (
                            <span className="mr-2 text-grey-500 line-through">
                              {p.comparePrice}
                            </span>
                          )}
                          {p.price ?? "Ask for price"}
                        </p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {(status === "done" || status === "error") &&
              items.length === 0 && (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-10 text-center text-[15px] text-black"
                >
                  {status === "error"
                    ? "Search isn't working right now. "
                    : `Nothing matches “${term}” yet. `}
                  <a
                    href={whatsappLink(
                      `Hello Quantum Razer, I'm looking for: ${term}`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Ask us on WhatsApp
                  </a>{" "}
                  and we&apos;ll check for you.
                </motion.p>
              )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
