import type { MetadataRoute } from "next";

/** Avoid build-time Prisma init when DATABASE_URL is not available (e.g. Vercel build env). */
export const dynamic = "force-dynamic";

function staticEntries(base: string): MetadataRoute.Sitemap {
  return ["", "/products", "/sale", "/login", "/register", "/cart", "/checkout"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000";

  const staticRoutes = staticEntries(base);

  if (!process.env.DATABASE_URL?.trim()) {
    return staticRoutes;
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      take: 500,
    });
    const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: p.updatedAt,
    }));
    return [...staticRoutes, ...productUrls];
  } catch {
    return staticRoutes;
  }
}
