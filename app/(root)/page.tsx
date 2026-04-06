import Link from "next/link";

import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { HeroBanner } from "@/components/home/HeroBanner";
import { TrendingProducts } from "@/components/home/TrendingProducts";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getHomepageData } from "@/lib/data/products";
import { mapProductListRowToSummary } from "@/lib/mappers/product";
import type { ProductSummary } from "@/types";

export const revalidate = 3600;

export default async function HomePage() {
  let featured: ProductSummary[] = [];
  let newest: ProductSummary[] = [];
  let trending: ProductSummary[] = [];
  try {
    const data = await getHomepageData();
    featured = data.featured.map(mapProductListRowToSummary);
    newest = data.newArrivals.map(mapProductListRowToSummary);
    trending = data.trending.map(mapProductListRowToSummary);
  } catch {
    /* DB unavailable at build or runtime — show shell UI */
  }

  return (
    <>
      <HeroBanner />
      <FeaturedCollection title="Featured" products={featured} />
      <CategoryGrid />
      <TrendingProducts products={trending} />
      <section className="relative h-[50vh] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://picsum.photos/seed/promo/1920/900"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-center text-white">
          <h2 className="text-4xl font-black uppercase">Move Forward</h2>
          <Link href="/products" className="mt-6">
            <Button className="bg-white text-black hover:bg-grey-100">Shop Latest</Button>
          </Link>
        </div>
      </section>
      <section className="px-[var(--content-padding)] py-16">
        <div className="mx-auto mb-10 flex max-w-content items-center justify-between">
          <h2 className="text-[28px] font-black">New Arrivals</h2>
          <Link href="/products?sort=newest" className="text-[14px] underline">
            View All
          </Link>
        </div>
        <div className="mx-auto max-w-content">
          <ProductGrid products={newest} />
        </div>
      </section>
      <section className="bg-black px-[var(--content-padding)] py-20 text-white">
        <div className="mx-auto flex max-w-content flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-[40px] font-black leading-tight">Join Membership</h2>
            <p className="mt-2 max-w-md text-grey-300">Early access, rewards, and free delivery on qualifying orders.</p>
          </div>
          <Link href="/register">
            <Button className="bg-white text-black hover:bg-grey-100">Join Quantum</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
