import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { getProductBySlug } from "@/lib/data/products";
import { mapPrismaProductToDetail } from "@/lib/mappers/product";
import { prisma } from "@/lib/prisma";

export const revalidate = 900;
export const dynamicParams = true;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true },
      take: 100,
      orderBy: { updatedAt: "desc" },
    });
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const row = await getProductBySlug(params.slug);
  if (!row) return { title: "Product" };
  const { product, related, reviewAvg, reviewCount } = row;
  const detail = mapPrismaProductToDetail(product, related, reviewAvg, reviewCount);
  return {
    title: detail.name,
    description: detail.description ?? undefined,
    openGraph: {
      title: detail.name,
      description: detail.description ?? undefined,
      images: detail.images[0]?.url ? [{ url: detail.images[0].url }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const row = await getProductBySlug(params.slug);
  if (!row) notFound();

  const { product, related, reviewAvg, reviewCount } = row;
  const detail = mapPrismaProductToDetail(product, related, reviewAvg, reviewCount);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: detail.name,
    image: detail.images.map((i) => i.url),
    brand: { "@type": "Brand", name: detail.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: detail.variants[0]?.price,
      availability: "https://schema.org/InStock",
    },
    ...(detail.avg_rating && detail.review_count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: detail.avg_rating,
            reviewCount: detail.review_count,
          },
        }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetailClient product={detail} />
    </>
  );
}
