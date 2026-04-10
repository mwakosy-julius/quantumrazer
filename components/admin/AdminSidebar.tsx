"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logoutAction } from "@/actions/auth.actions";

const nav = [
  { href: "/admin", label: "Dashboard", icon: IconGrid },
  { href: "/admin/products", label: "Products", icon: IconBox },
  { href: "/admin/orders", label: "Orders", icon: IconReceipt },
  { href: "/admin/customers", label: "Customers", icon: IconUsers },
  { href: "/admin/settings", label: "Settings", icon: IconGear },
] as const;

function IconGrid({ className }: { className?: string }) {
  return (
    <svg className={className} width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconBox({ className }: { className?: string }) {
  return (
    <svg className={className} width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7l8-4 8 4v10l-8 4-8-4V7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M4 7l8 4 8-4M12 11v10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconReceipt({ className }: { className?: string }) {
  return (
    <svg className={className} width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3h10v18l-2-1.5L13 21l-2-1.5L9 21l-2 1.5V3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 8h6M9 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg className={className} width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconGear({ className }: { className?: string }) {
  return (
    <svg className={className} width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside
      className="flex h-screen w-[240px] shrink-0 flex-col border-r border-[#E5E7EB] bg-white"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <div className="border-b border-[#E5E7EB] p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[14px] font-bold tracking-wide text-[#111111]">QUANTUM RAZER</span>
          <span className="rounded bg-[#111111] px-2 py-0.5 text-[10px] font-medium text-white">Admin</span>
        </div>
        <Link
          href="/"
          className="mt-3 inline-block text-[14px] text-[#6B7280] transition-colors hover:text-[#111111]"
        >
          Back to Store →
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-4 py-2.5 text-[14px] font-medium transition-colors ${
                active
                  ? "bg-[#F3F4F6] text-[#111111]"
                  : "text-[#6B7280] hover:bg-[#F3F4F6]"
              }`}
            >
              <Icon className={active ? "text-[#111111]" : "text-[#6B7280]"} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[#E5E7EB] p-4">
        <p className="text-[12px] text-[#9CA3AF]">Logged in as</p>
        <p className="truncate text-[13px] text-[#111111]">{email}</p>
        <button
          type="button"
          className="mt-2 text-[13px] text-[#6B7280] transition-colors hover:text-[#111111]"
          onClick={async () => {
            await logoutAction({});
            window.location.href = "/";
          }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
