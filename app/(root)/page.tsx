import { BrandStrip } from "@/components/home/BrandStrip";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { CreatorPersonasSection } from "@/components/home/CreatorPersonasSection";
import { FeaturedCollectionStrip } from "@/components/home/FeaturedCollectionStrip";
import { FeaturedDrop } from "@/components/home/FeaturedDrop";
import { FullWidthPromo } from "@/components/home/FullWidthPromo";
import { HeroBanner } from "@/components/home/HeroBanner";
import { LaptopBagsSpotlight } from "@/components/home/LaptopBagsSpotlight";
import { MemberBanner } from "@/components/home/MemberBanner";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { TrendingSection } from "@/components/home/TrendingSection";
import { getHomepageData } from "@/lib/data/products";
import { IMAGES, imgHero1600 } from "@/lib/images";
import type { ProductListRow } from "@/lib/mappers/product";
import { mapProductListRowToSummary } from "@/lib/mappers/product";
import type { ProductSummary } from "@/types";

export const revalidate = 3600;

export default async function HomePage() {
  let featuredRow: ProductListRow | undefined;
  let newest: ProductSummary[] = [];
  let trending: ProductSummary[] = [];
  try {
    const data = await getHomepageData();
    featuredRow = data.featured[0] as ProductListRow;
    newest = data.newArrivals.map(mapProductListRowToSummary);
    trending = data.trending.map(mapProductListRowToSummary);
  } catch {
    /* DB unavailable */
  }

  return (
    <>
      <HeroBanner />
      <FeaturedCollectionStrip />
      <BrandStrip />
      <FeaturedDrop row={featuredRow} />
      <CategoryGrid />
      <TrendingSection products={trending} />
      <FullWidthPromo
        imageSrc={imgHero1600(IMAGES.lifestyle.developer)}
        headline="Engineered for the work you actually do"
        sub="Laptops and gear tuned for gaming, design, and production."
        primaryHref="/products?category=laptops"
        primaryLabel="Shop Laptops"
        secondaryHref="/products"
        secondaryLabel="Explore All"
        variant="center"
      />
      <LaptopBagsSpotlight />
      <FullWidthPromo
        imageSrc={imgHero1600(IMAGES.bags.lifestyle)}
        headline="Protection that moves with you"
        sub="Backpacks, sleeves, and cases from brands you trust."
        primaryHref="/products?category=laptop-bags"
        primaryLabel="Shop Bags"
        variant="center"
      />
      <NewArrivalsSection products={newest} />
      <CreatorPersonasSection />
      <MemberBanner />
    </>
  );
}
