"use client";

import { motion } from "framer-motion";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { logoutAction } from "@/actions/auth.actions";
import { getSearchSuggestionsQuery } from "@/actions/search.actions";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { useCartStore } from "@/store/cartStore";

const navLinks = [
  { label: "New & Featured", href: "/products?is_featured=true" },
  { label: "Men", href: "/products?gender=MENS" },
  { label: "Women", href: "/products?gender=WOMENS" },
  { label: "Kids", href: "/products?gender=KIDS" },
  { label: "Sale", href: "/sale" },
  { label: "SNKRS", href: "/collections/jordan" },
];

export function Navbar({ initialCartCount }: { initialCartCount: number }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [badgeCount, setBadgeCount] = useState(initialCartCount);
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => {
    setBadgeCount(initialCartCount);
  }, [initialCartCount]);

  const openMega = useCallback(() => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    megaTimer.current = setTimeout(() => setMegaOpen(true), 300);
  }, []);

  const closeMega = useCallback(() => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    megaTimer.current = setTimeout(() => setMegaOpen(false), 150);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      void getSearchSuggestionsQuery(query).then(setSuggestions).catch(() => setSuggestions([]));
    }, 300);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [query]);

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user?.email?.[0]?.toUpperCase() ?? "U";

  const signOutClient = async () => {
    await logoutAction({});
    router.refresh();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-[9999] h-nav border-b border-grey-200 bg-white">
      <div className="relative mx-auto flex h-full max-w-content items-center justify-between px-[var(--content-padding)]">
        <Link href="/" className="text-[20px] font-black uppercase tracking-tight text-black">
          Quantum
        </Link>

        <nav className="hidden items-center gap-8 md:flex" onMouseLeave={closeMega}>
          {navLinks.map((l) => (
            <div key={l.label} onMouseEnter={openMega} className="relative">
              <Link
                href={l.href}
                className={`text-[13px] font-medium hover:underline ${l.label === "Sale" ? "text-red-brand" : "text-black"}`}
              >
                {l.label}
              </Link>
            </div>
          ))}
          <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} />
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-1"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm0-2a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"
                fill="currentColor"
              />
              <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <Link href="/account/wishlist" className="hidden p-1 sm:block" aria-label="Wishlist">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 21s-7-4.35-7-10a5 5 0 0 1 9.09-2.91A5 5 0 0 1 19 11c0 5.65-7 10-7 10Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </Link>
          <button type="button" className="relative p-1" aria-label="Open cart" onClick={openCart}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 7h15l-1.5 9H7.5L6 7Zm0 0L5 3H2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {badgeCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-black px-1 text-[11px] text-white">
                {badgeCount > 9 ? "9+" : badgeCount}
              </span>
            )}
          </button>

          {!isAuthenticated ? (
            <div className="hidden items-center gap-4 text-[13px] sm:flex">
              <Link href="/register" className="hover:underline">
                Join Us
              </Link>
              <Link href="/login" className="hover:underline">
                Sign In
              </Link>
            </div>
          ) : (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="hidden h-8 w-8 items-center justify-center rounded-full bg-black text-[12px] font-bold text-white sm:flex">
                {initials}
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="z-[10000] min-w-[180px] rounded-md border border-grey-200 bg-white p-2 shadow-card">
                <DropdownMenu.Item asChild>
                  <Link href="/account" className="block px-3 py-2 text-[13px] hover:bg-grey-100">
                    My Orders
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/account/profile" className="block px-3 py-2 text-[13px] hover:bg-grey-100">
                    Profile
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/account/wishlist" className="block px-3 py-2 text-[13px] hover:bg-grey-100">
                    Wishlist
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="cursor-pointer px-3 py-2 text-[13px] hover:bg-grey-100"
                  onSelect={() => void signOutClient()}
                >
                  Sign Out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: searchOpen ? 56 : 0, opacity: searchOpen ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="overflow-hidden border-b border-grey-200 bg-white"
      >
        <div className="mx-auto flex max-w-content items-center gap-3 px-[var(--content-padding)] py-2">
          <input
            className="flex-1 border-0 bg-transparent text-[15px] outline-none placeholder:text-grey-500"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
          <button type="button" className="text-grey-500" aria-label="Close search" onClick={() => setSearchOpen(false)}>
            ✕
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="mx-auto max-w-content border-t border-grey-200 px-[var(--content-padding)] py-2">
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  className="block w-full py-1 text-left text-[14px] hover:underline"
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(s)}`);
                    setSearchOpen(false);
                  }}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </header>
  );
}
