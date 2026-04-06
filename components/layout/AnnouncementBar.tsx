"use client";

import { useEffect, useState } from "react";

const KEY = "qr-announce-dismissed";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(KEY)) {
      setVisible(false);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className="relative flex h-[36px] items-center justify-center bg-black text-[13px] tracking-[0.04em] text-white"
      role="region"
      aria-label="Announcement"
    >
      <span>Free Delivery &amp; Returns</span>
      <button
        type="button"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:opacity-80"
        aria-label="Dismiss announcement"
        onClick={() => {
          localStorage.setItem(KEY, "1");
          setVisible(false);
        }}
      >
        ✕
      </button>
    </div>
  );
}
