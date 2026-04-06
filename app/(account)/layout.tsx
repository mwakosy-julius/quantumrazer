"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { logoutAction } from "@/actions/auth.actions";

const links = [
  { href: "/account", label: "Orders" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/addresses", label: "Addresses" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/login" || pathname === "/register") {
    return <>{children}</>;
  }

  const signOutClient = async () => {
    await logoutAction({});
    router.refresh();
    router.push("/");
  };

  return (
    <div className="mx-auto flex max-w-content flex-col gap-10 px-[var(--content-padding)] py-12 md:flex-row">
      <aside className="w-full shrink-0 md:w-56">
        <nav className="space-y-2 text-[14px]">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block rounded px-3 py-2 hover:bg-grey-100 ${pathname === l.href ? "font-semibold" : ""}`}
            >
              {l.label}
            </Link>
          ))}
          <button type="button" className="block w-full px-3 py-2 text-left hover:bg-grey-100" onClick={() => void signOutClient()}>
            Sign Out
          </button>
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
