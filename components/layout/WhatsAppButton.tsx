"use client";

import { usePathname } from "next/navigation";

import { CONTACT } from "@/lib/constants";

/** Floating "chat with us" button, shown on every customer-facing page. */
export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/checkout")) return null;

  return (
    <a
      href={CONTACT.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with us on WhatsApp, ${CONTACT.whatsappDisplay}`}
      className="fixed bottom-5 right-5 z-[9000] flex h-14 items-center gap-2 rounded-full bg-[#25D366] px-4 text-[15px] font-medium text-black shadow-lg transition-transform duration-150 hover:scale-105"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 20l1.3-4.2A8 8 0 1 1 8.4 19L4 20Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M9 10h6M9 13.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
}
