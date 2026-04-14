import type { Gender as PrismaGender } from "@prisma/client";

import { formatMoney } from "@/lib/currency";
import type { ProductDetail, ProductImage, ProductSummary, ProductVariant } from "@/types";

const genderToUi: Record<PrismaGender, ProductSummary["gender"]> = {
  MENS: "mens",
  WOMENS: "womens",
  KIDS: "kids",
  UNISEX: "unisex",
};

export type ProductListRow = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  brand: string;
  gender: PrismaGender;
  sport: string | null;
  isFeatured: boolean;
  isNew: boolean;
  category: { slug: string } | null;
  images: { url: string }[];
  variants: { id: string; price: unknown; compareAtPrice: unknown | null; size: string }[];
  reviews: { rating: number }[];
};

export function mapProductListRowToSummary(p: ProductListRow): ProductSummary {
  const prices = p.variants.map((v) => Number(v.price));
  const minPriceNum = prices.length ? Math.min(...prices) : null;
  const min_price = minPriceNum != null ? formatMoney(minPriceNum) : null;

  const validCompares = p.variants
    .map((v) => (v.compareAtPrice != null ? Number(v.compareAtPrice) : null))
    .filter((c): c is number => c != null && !Number.isNaN(c) && minPriceNum != null && c > minPriceNum);
  const max_price = validCompares.length ? formatMoney(Math.max(...validCompares)) : null;

  const ratings = p.reviews.map((r) => r.rating);
  const avg_rating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;

  let cheapestId: string | null = null;
  if (p.variants.length && minPriceNum != null) {
    const sorted = [...p.variants].sort((a, b) => Number(a.price) - Number(b.price));
    cheapestId = sorted[0]?.id ?? null;
  }
  const v0 = p.variants[0];
  const spec_preview = v0
    ? `${v0.size} · ${p.variants.length} config${p.variants.length === 1 ? "" : "s"}`
    : null;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    gender: genderToUi[p.gender],
    sport: p.sport,
    is_featured: p.isFeatured,
    is_new: p.isNew,
    category_slug: p.category?.slug ?? null,
    min_price,
    max_price,
    primary_image_url: p.images[0]?.url ?? null,
    secondary_image_url: p.images[1]?.url ?? null,
    avg_rating,
    review_count: p.reviews.length,
    default_variant_id: cheapestId,
    spec_preview,
  };
}

type DetailProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  brand: string;
  gender: PrismaGender;
  sport: string | null;
  isFeatured: boolean;
  isNew: boolean;
  category: { slug: string } | null;
  images: Array<{
    id: string;
    url: string;
    altText: string | null;
    displayOrder: number;
    isPrimary: boolean;
    variantId: string | null;
  }>;
  variants: Array<{
    id: string;
    sku: string;
    colorName: string;
    colorHex: string | null;
    size: string;
    price: unknown;
    compareAtPrice: unknown | null;
    inventoryCount: number;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    title: string | null;
    body: string | null;
    createdAt: Date;
    user: { firstName: string | null; lastName: string | null };
  }>;
};

export function mapPrismaProductToDetail(
  p: DetailProduct,
  relatedRows: ProductListRow[],
  reviewAvg: number | null,
  reviewCount: number,
): ProductDetail {
  const variants: ProductVariant[] = p.variants.map((v) => ({
    id: v.id,
    sku: v.sku,
    color_name: v.colorName,
    color_hex: v.colorHex,
    size: v.size,
    price: String(v.price),
    compare_at_price: v.compareAtPrice != null ? String(v.compareAtPrice) : null,
    inventory_count: v.inventoryCount,
  }));

  const images: ProductImage[] = p.images.map((im) => ({
    id: im.id,
    url: im.url,
    alt_text: im.altText,
    display_order: im.displayOrder,
    is_primary: im.isPrimary,
    variant_id: im.variantId,
  }));

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    brand: p.brand,
    gender: genderToUi[p.gender],
    sport: p.sport,
    is_featured: p.isFeatured,
    is_new: p.isNew,
    category_slug: p.category?.slug ?? null,
    variants,
    images,
    avg_rating: reviewAvg,
    review_count: reviewCount,
    related: relatedRows.map(mapProductListRowToSummary),
  };
}
