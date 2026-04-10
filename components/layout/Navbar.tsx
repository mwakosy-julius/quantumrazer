"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { logoutAction } from "@/actions/auth.actions";
import { getSearchSuggestionsQuery } from "@/actions/search.actions";
import { QuantumRazerLogo } from "@/components/brand/QuantumRazerLogo";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";
import { NAV_MAIN, type MegaMenuKey } from "@/lib/constants";
import { useCartStore } from "@/store/cartStore";

function linkIsActive(pathname: string, searchParams: URLSearchParams, href: string): boolean {
  const u = new URL(href, "https://quantumrazer.local");
  if (u.pathname !== pathname) return false;
  for (const [k, v] of Array.from(u.searchParams.entries())) {
    if (searchParams.get(k) !== v) return false;
  }
  return true;
}

export function Navbar({ initialCartCount }: { initialCartCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  const [megaKey, setMegaKey] = useState<MegaMenuKey | null>(null);
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [badgeCount, setBadgeCount] = useState(initialCartCount);
  const [scrolled, setScrolled] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const prevBadge = useRef(initialCartCount);

  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => {
    setBadgeCount(initialCartCount);
    prevBadge.current = initialCartCount;
  }, [initialCartCount]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const openMega = useCallback((key: MegaMenuKey) => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    megaTimer.current = setTimeout(() => setMegaKey(key), 300);
  }, []);

  const closeMega = useCallback(() => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    megaTimer.current = setTimeout(() => setMegaKey(null), 200);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
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

  const signOutClient = async () => {
    await logoutAction({});
    router.refresh();
    router.push("/");
  };

  const sp = new URLSearchParams(searchParams.toString());
  const firstName = user?.firstName?.trim();

  return (
    <header
      className={`relative sticky top-0 z-[9999] w-full bg-white transition-shadow duration-200 ease-out ${
        scrolled ? "shadow-[0_1px_0_var(--grey-200)]" : ""
      }`}
      onMouseLeave={closeMega}
    >
      <div className="relative mx-auto grid h-nav max-w-content grid-cols-[1fr_auto_1fr] items-center pl-6 pr-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative flex h-10 w-10 flex-col items-center justify-center md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span
              className="block h-0.5 w-[22px] bg-black transition-transform duration-200"
              style={{ transform: menuOpen ? "translateY(6px) rotate(45deg)" : undefined }}
            />
            <span
              className="my-1 block h-0.5 w-[22px] bg-black transition-opacity duration-200"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block h-0.5 w-[22px] bg-black transition-transform duration-200"
              style={{ transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : undefined }}
            />
          </button>
          <QuantumRazerLogo size="nav" theme="light" />
        </div>

        <nav className="hidden items-center justify-center md:flex">
          {NAV_MAIN.map((item) => {
            const active = linkIsActive(pathname, sp, item.href);
            return (
              <div key={item.id} className="relative px-3 py-2" onMouseEnter={() => openMega(item.id)}>
                <Link
                  href={item.href}
                  className={`text-[15px] text-black ${active ? "font-medium" : "font-normal"}`}
                >
                  {item.label}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="text-black transition-colors duration-fast hover:text-grey-700"
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
          <Link
            href="/account/wishlist"
            className="hidden text-black transition-colors duration-fast hover:text-grey-700 sm:block"
            aria-label="Wishlist"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
              />
            </svg>
          </Link>
          <button
            type="button"
            className="relative text-black transition-colors hover:text-grey-700"
            aria-label="Open cart"
            onClick={openCart}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 7h15l-1.5 9H7.5L6 7Zm0 0L5 3H2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {badgeCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-0.5 text-[10px] font-bold text-white">
                {badgeCount > 9 ? "9+" : badgeCount}
              </span>
            )}
          </button>

          <div className="ml-1 hidden items-center gap-2 md:flex">
            <Link href="#" className="text-[13px] text-black hover:underline">
              Find a Store
            </Link>
            <Link href="#" className="text-[13px] text-black hover:underline">
              Help
            </Link>
          </div>

          {!isAuthenticated ? (
            <div className="ml-2 hidden items-center gap-3 md:flex">
              <Link href="/register" className="text-[13px] text-black hover:underline">
                Join Us
              </Link>
              <Link href="/login" className="text-[13px] text-black hover:underline">
                Sign In
              </Link>
            </div>
          ) : (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="ml-2 hidden cursor-pointer text-[13px] text-black hover:underline md:inline">
                {firstName || "Account"}
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                className="z-[10000] min-w-[180px] rounded-brand border border-grey-200 bg-white p-2 shadow-dropdown"
                sideOffset={6}
              >
                <DropdownMenu.Item asChild>
                  <Link href="/account" className="block px-3 py-2 text-[13px] text-black hover:bg-grey-100">
                    My Orders
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/account/profile" className="block px-3 py-2 text-[13px] text-black hover:bg-grey-100">
                    Profile
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="/account/wishlist" className="block px-3 py-2 text-[13px] text-black hover:bg-grey-100">
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

      <MegaMenu menuKey={megaKey} onClose={closeMega} />

      <div
        className={`overflow-hidden border-b border-grey-200 bg-white transition-[max-height] duration-200 ease-out ${
          searchOpen ? "max-h-[min(360px,70vh)]" : "max-h-0 border-b-0"
        }`}
      >
        <div className="mx-auto flex max-w-content items-center gap-4 px-6 py-3">
          <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0 text-grey-500" fill="none" aria-hidden>
            <path
              d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm0-2a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"
              fill="currentColor"
            />
            <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={searchInputRef}
            className="min-w-0 flex-1 border-0 bg-transparent text-[16px] text-black outline-none placeholder:text-grey-300"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
          {query ? (
            <button
              type="button"
              className="shrink-0 text-grey-500 hover:text-black"
              aria-label="Clear search"
              onClick={() => setQuery("")}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              className="shrink-0 text-grey-500 hover:text-black"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        {suggestions.length > 0 && searchOpen && (
          <ul className="mx-auto max-w-content border-t border-grey-200 bg-white px-6">
            {suggestions.slice(0, 6).map((s) => (
              <li key={s}>
                <button
                  type="button"
                  className="block w-full px-0 py-3 text-left text-[15px] text-black hover:bg-grey-100"
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
      </div>

      <MobileNavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
