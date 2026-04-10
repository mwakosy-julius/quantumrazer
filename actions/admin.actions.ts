"use server";

import { Gender, OrderStatus } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || !session.user.isAdmin) {
    throw new Error("Unauthorised");
  }
  return session;
}

const categorySlugEnum = z.enum(["laptops", "accessories", "laptop-bags", "gadgets"]);

const imageInput = z.object({
  url: z.string().min(1),
  isPrimary: z.boolean().optional(),
});

const variantInput = z.object({
  colorName: z.string().min(1),
  colorHex: z.string().optional().nullable(),
  size: z.string().min(1),
});

const createProductBase = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  brand: z.string().min(1),
  description: z.string().min(1).max(5000),
  gender: z.nativeEnum(Gender),
  sport: z.string().optional().nullable(),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().optional().nullable(),
  skuPrefix: z.string().min(1),
  inventoryCount: z.coerce.number().int().min(0),
  weightGrams: z.coerce.number().int().optional().nullable(),
  categorySlug: categorySlugEnum,
  collectionHandle: z.string().optional().nullable(),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  isActive: z.boolean(),
  variants: z.array(variantInput).min(1).max(6),
  images: z.array(imageInput).min(1).max(8),
});

export const createProductAction = actionClient(createProductBase, async (input) => {
  await requireAdmin();

  const category = await prisma.category.findUnique({ where: { slug: input.categorySlug } });
  if (!category) throw new Error("Category not found");

  let collectionId: string | null = null;
  if (input.collectionHandle?.trim()) {
    const col = await prisma.collection.findUnique({ where: { handle: input.collectionHandle.trim() } });
    collectionId = col?.id ?? null;
  }

  const slugTaken = await prisma.product.findUnique({ where: { slug: input.slug } });
  if (slugTaken) throw new Error("Slug already in use");

  const product = await prisma.$transaction(async (tx) => {
    const p = await tx.product.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        brand: input.brand,
        gender: input.gender,
        sport: input.sport?.trim() || null,
        isFeatured: input.isFeatured,
        isNew: input.isNew,
        isActive: input.isActive,
        categoryId: category.id,
        collectionId,
      },
    });

    for (let i = 0; i < input.variants.length; i++) {
      const v = input.variants[i];
      const sku = `${input.skuPrefix}-${i + 1}`.replace(/\s+/g, "");
      await tx.productVariant.create({
        data: {
          productId: p.id,
          sku,
          colorName: v.colorName,
          colorHex: v.colorHex?.trim() || null,
          size: v.size,
          price: input.price,
          compareAtPrice: input.compareAtPrice ?? null,
          inventoryCount: input.inventoryCount,
          weightGrams: input.weightGrams ?? null,
        },
      });
    }

    for (let i = 0; i < input.images.length; i++) {
      const im = input.images[i];
      await tx.productImage.create({
        data: {
          productId: p.id,
          url: im.url,
          displayOrder: i,
          isPrimary: im.isPrimary ?? i === 0,
        },
      });
    }

    return p;
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
  revalidateTag("products");
  revalidateTag("collections");

  return { success: true as const, slug: product.slug };
});

const updateProductBase = createProductBase.extend({
  id: z.string().min(1),
});

export const updateProductAction = actionClient(updateProductBase, async (input) => {
  await requireAdmin();

  const existing = await prisma.product.findUnique({
    where: { id: input.id },
    include: { variants: true },
  });
  if (!existing) throw new Error("Product not found");

  const category = await prisma.category.findUnique({ where: { slug: input.categorySlug } });
  if (!category) throw new Error("Category not found");

  let collectionId: string | null = null;
  if (input.collectionHandle?.trim()) {
    const col = await prisma.collection.findUnique({ where: { handle: input.collectionHandle.trim() } });
    collectionId = col?.id ?? null;
  }

  const slugConflict = await prisma.product.findFirst({
    where: { slug: input.slug, NOT: { id: input.id } },
  });
  if (slugConflict) throw new Error("Slug already in use");

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: input.id },
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        brand: input.brand,
        gender: input.gender,
        sport: input.sport?.trim() || null,
        isFeatured: input.isFeatured,
        isNew: input.isNew,
        isActive: input.isActive,
        categoryId: category.id,
        collectionId,
      },
    });

    await tx.productVariant.deleteMany({ where: { productId: input.id } });
    await tx.productImage.deleteMany({ where: { productId: input.id } });

    for (let i = 0; i < input.variants.length; i++) {
      const v = input.variants[i];
      const sku = `${input.skuPrefix}-${i + 1}`.replace(/\s+/g, "");
      await tx.productVariant.create({
        data: {
          productId: input.id,
          sku,
          colorName: v.colorName,
          colorHex: v.colorHex?.trim() || null,
          size: v.size,
          price: input.price,
          compareAtPrice: input.compareAtPrice ?? null,
          inventoryCount: input.inventoryCount,
          weightGrams: input.weightGrams ?? null,
        },
      });
    }

    for (let i = 0; i < input.images.length; i++) {
      const im = input.images[i];
      await tx.productImage.create({
        data: {
          productId: input.id,
          url: im.url,
          displayOrder: i,
          isPrimary: im.isPrimary ?? i === 0,
        },
      });
    }
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${input.slug}`);
  revalidateTag("products");

  return { success: true as const, slug: input.slug };
});

const deleteProductSchema = z.object({ id: z.string() });

export const deleteProductAction = actionClient(deleteProductSchema, async ({ id }) => {
  await requireAdmin();

  const orderCount = await prisma.orderItem.count({
    where: { variant: { productId: id } },
  });
  if (orderCount > 0) {
    throw new Error("Has existing orders");
  }

  const p = await prisma.product.findUnique({ where: { id }, select: { slug: true } });
  if (!p) throw new Error("Product not found");

  await prisma.$transaction([
    prisma.productImage.deleteMany({ where: { productId: id } }),
    prisma.productVariant.deleteMany({ where: { productId: id } }),
    prisma.product.delete({ where: { id } }),
  ]);

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  revalidateTag("products");

  return { success: true as const };
});

const archiveProductSchema = z.object({ id: z.string() });

export const archiveProductAction = actionClient(archiveProductSchema, async ({ id }) => {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { isActive: false } });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  revalidateTag("products");
  return { success: true as const };
});

const duplicateProductSchema = z.object({ id: z.string() });

export const duplicateProductAction = actionClient(duplicateProductSchema, async ({ id }) => {
  await requireAdmin();

  const original = await prisma.product.findUnique({
    where: { id },
    include: { variants: true, images: { orderBy: { displayOrder: "asc" } } },
  });
  if (!original) throw new Error("Product not found");

  const newSlug = `${original.slug}-copy-${Date.now()}`;
  const copy = await prisma.$transaction(async (tx) => {
    const p = await tx.product.create({
      data: {
        name: `${original.name} (Copy)`,
        slug: newSlug,
        description: original.description,
        brand: original.brand,
        gender: original.gender,
        sport: original.sport,
        isFeatured: false,
        isNew: false,
        isActive: false,
        categoryId: original.categoryId,
        collectionId: original.collectionId,
      },
    });

    const suffix = crypto.randomUUID().slice(0, 8);
    for (const v of original.variants) {
      await tx.productVariant.create({
        data: {
          productId: p.id,
          sku: `${v.sku}-c${suffix}`.slice(0, 80),
          colorName: v.colorName,
          colorHex: v.colorHex,
          size: v.size,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          inventoryCount: 0,
          weightGrams: v.weightGrams,
        },
      });
    }

    for (const im of original.images) {
      await tx.productImage.create({
        data: {
          productId: p.id,
          url: im.url,
          altText: im.altText,
          displayOrder: im.displayOrder,
          isPrimary: im.isPrimary,
        },
      });
    }

    return p;
  });

  revalidatePath("/admin/products");
  revalidateTag("products");

  return { success: true as const, id: copy.id, slug: copy.slug };
});

const orderStatusSchema = z.object({
  orderId: z.string(),
  status: z.nativeEnum(OrderStatus),
  trackingNumber: z.string().optional().nullable(),
});

export const updateOrderStatusAction = actionClient(orderStatusSchema, async (input) => {
  await requireAdmin();

  if (input.status === OrderStatus.SHIPPED && !input.trackingNumber?.trim()) {
    throw new Error("Tracking number required for shipped orders");
  }

  await prisma.order.update({
    where: { id: input.orderId },
    data: {
      status: input.status,
      ...(input.trackingNumber?.trim()
        ? { trackingNumber: input.trackingNumber.trim() }
        : {}),
    },
  });

  await inngest.send({
    name: "order/status-updated",
    data: { orderId: input.orderId, status: input.status },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidateTag("products");

  return { success: true as const };
});

const trackingOnlySchema = z.object({
  orderId: z.string(),
  trackingNumber: z.string().min(1),
});

export const updateOrderTrackingAction = actionClient(trackingOnlySchema, async (input) => {
  await requireAdmin();
  await prisma.order.update({
    where: { id: input.orderId },
    data: { trackingNumber: input.trackingNumber.trim() },
  });
  revalidatePath("/admin/orders");
  return { success: true as const };
});

const bulkIdsSchema = z.object({ ids: z.array(z.string()).min(1) });

export const bulkDeleteProductsAction = actionClient(bulkIdsSchema, async ({ ids }) => {
  await requireAdmin();
  for (const id of ids) {
    const orderCount = await prisma.orderItem.count({
      where: { variant: { productId: id } },
    });
    if (orderCount > 0) continue;
    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId: id } }),
      prisma.productVariant.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);
  }
  revalidatePath("/admin/products");
  revalidateTag("products");
  return { success: true as const };
});

export const bulkSetFeaturedAction = actionClient(
  z.object({ ids: z.array(z.string()).min(1), featured: z.boolean() }),
  async ({ ids, featured }) => {
    await requireAdmin();
    await prisma.product.updateMany({ where: { id: { in: ids } }, data: { isFeatured: featured } });
    revalidatePath("/admin/products");
    revalidateTag("products");
    return { success: true as const };
  },
);

export const bulkSetInactiveAction = actionClient(bulkIdsSchema, async ({ ids }) => {
  await requireAdmin();
  await prisma.product.updateMany({ where: { id: { in: ids } }, data: { isActive: false } });
  revalidatePath("/admin/products");
  revalidateTag("products");
  return { success: true as const };
});

export const sendOrderCustomerEmailAction = actionClient(
  z.object({ orderId: z.string() }),
  async ({ orderId }) => {
    await requireAdmin();
    await inngest.send({ name: "order/created", data: { orderId, orderNumber: "", resend: true } });
    return { success: true as const, message: "Notification queued" };
  },
);

export const issueRefundStubAction = actionClient(z.object({ orderId: z.string() }), async () => {
  await requireAdmin();
  return { success: false as const, message: "Connect Stripe for live refunds" };
});

export const toggleUserAdminAction = actionClient(z.object({ userId: z.string() }), async ({ userId }) => {
  const session = await requireAdmin();
  if (userId === session.user!.id) throw new Error("Cannot change your own admin flag here");

  const u = await prisma.user.findUnique({ where: { id: userId } });
  if (!u) throw new Error("User not found");

  await prisma.user.update({ where: { id: userId }, data: { isAdmin: !u.isAdmin } });
  revalidatePath("/admin/customers");
  return { success: true as const, isAdmin: !u.isAdmin };
});

export const saveSiteSettingsAction = actionClient(
  z.object({
    storeName: z.string().optional(),
    contactEmail: z.union([z.string().email(), z.literal("")]).optional(),
    currency: z.string().optional(),
    freeShippingThreshold: z.coerce.number().optional(),
    notifyNewOrder: z.boolean().optional(),
    notifyLowStock: z.boolean().optional(),
    lowStockThreshold: z.coerce.number().optional(),
  }),
  async () => {
    await requireAdmin();
    return { success: true as const };
  },
);
