import { notFound } from "next/navigation";

import { DangerZone } from "@/components/admin/DangerZone";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export default async function AdminEditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: { select: { slug: true } },
      collection: { select: { handle: true } },
      variants: { orderBy: { sku: "asc" } },
      images: { orderBy: { displayOrder: "asc" } },
    },
  });

  if (!product) notFound();

  const v0 = product.variants[0];
  const skuPrefix = v0 ? v0.sku.replace(/-\d+$/, "") || v0.sku : `QR-${Date.now()}`;

  const orderCount = await prisma.orderItem.count({
    where: { variant: { productId: product.id } },
  });

  const initial = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    brand: product.brand,
    gender: product.gender,
    sport: product.sport,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    isActive: product.isActive,
    categorySlug: product.category?.slug ?? "laptops",
    collectionHandle: product.collection?.handle ?? null,
    price: v0 ? Number(v0.price) : 0,
    compareAtPrice: v0?.compareAtPrice != null ? Number(v0.compareAtPrice) : null,
    skuPrefix,
    inventoryCount: v0?.inventoryCount ?? 0,
    weightGrams: v0?.weightGrams ?? null,
    variants: product.variants.map((v) => ({
      colorName: v.colorName,
      colorHex: v.colorHex,
      size: v.size,
    })),
    images: product.images.map((im) => ({ url: im.url, isPrimary: im.isPrimary })),
  };

  const collections = await prisma.collection.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { handle: true, name: true },
  });

  return (
    <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <nav className="mb-4 text-[13px] text-[#6B7280]">
        <a href="/admin/products" className="hover:text-[#111111]">
          Products
        </a>
        <span className="mx-2">/</span>
        <span className="text-[#111111]">{product.name}</span>
        <span className="mx-2">/</span>
        <span>Edit</span>
      </nav>
      <h1 className="mb-6 text-[24px] font-bold text-[#111111]">Edit Product</h1>
      <ProductForm mode="edit" initial={initial} collections={collections} />
      <DangerZone productId={product.id} productName={product.name} hasOrders={orderCount > 0} />
    </div>
  );
}
