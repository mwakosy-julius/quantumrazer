import type { Metadata } from "next";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getCartItemCount } from "@/lib/data/cart";

import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Quantum — Performance Footwear & Apparel", template: "%s | Quantum" },
  description: "Shop performance footwear and apparel inspired by the best in sport.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cartCount = await getCartItemCount();

  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Providers>
          <AnnouncementBar />
          <Navbar initialCartCount={cartCount} />
          <main className="min-h-[50vh]">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
