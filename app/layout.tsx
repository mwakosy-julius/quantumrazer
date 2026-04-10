import type { Metadata, Viewport } from "next";
import { Suspense } from "react";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getCartItemCount } from "@/lib/data/cart";

import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Quantum Razer | Precision Tech for Creators", template: "%s | Quantum Razer" },
  description:
    "Premium laptops, accessories, laptop bags, and gadgets for gamers, designers, producers and creators. Free shipping over $75.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/favicon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Quantum Razer",
    siteName: "Quantum Razer",
    description:
      "Premium laptops, accessories, laptop bags, and gadgets for creatives. Free shipping over $75.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Quantum Razer" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cartCount = await getCartItemCount();

  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">
        <Providers>
          <AnnouncementBar />
          <Suspense fallback={<div className="h-[60px] border-b border-grey-200 bg-white" aria-hidden />}>
            <Navbar initialCartCount={cartCount} />
          </Suspense>
          <main className="min-h-[50vh]">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
