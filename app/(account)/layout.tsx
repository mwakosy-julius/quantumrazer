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
    <div className="mx-auto flex max-w-content flex-col gap-10 bg-white px-6 py-12 md:flex-row md:px-[var(--content-padding)]">
      <aside className="w-full shrink-0 border-grey-200 md:w-56 md:border-r md:pr-6">
        <nav className="space-y-0 text-[15px] font-medium uppercase tracking-[0.04em] text-grey-500">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block border-b border-grey-200 py-3 text-black ${
                pathname === l.href ? "font-bold" : "font-medium"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            type="button"
            className="block w-full border-b border-grey-200 py-3 text-left font-medium text-black hover:text-grey-500"
            onClick={() => void signOutClient()}
          >
            Sign Out
          </button>
        </nav>
      </aside>
      <div className="min-w-0 flex-1 text-black">{children}</div>
    </div>
  );
}
