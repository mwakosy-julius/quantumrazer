import { cookies } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CART_COOKIE = "cart_session";

export async function getCartSessionIdFromCookie(): Promise<string | undefined> {
  return cookies().get(CART_COOKIE)?.value;
}

export async function getCartItemCount(): Promise<number> {
  try {
    if (!process.env.DATABASE_URL?.trim()) return 0;

    const session = await auth();
    const userId = session?.user?.id;
    const sessionId = userId ? undefined : await getCartSessionIdFromCookie();

    if (!userId && !sessionId) return 0;

    const agg = await prisma.cartItem.aggregate({
      where: userId ? { userId } : { sessionId },
      _sum: { quantity: true },
    });
    return agg._sum.quantity ?? 0;
  } catch {
    return 0;
  }
}

export async function getCartItemsDetailed() {
  try {
    if (!process.env.DATABASE_URL?.trim()) return [];

    const session = await auth();
    const userId = session?.user?.id;
    let sessionId: string | undefined;
    if (!userId) {
      sessionId = await getCartSessionIdFromCookie();
      if (!sessionId) return [];
    }

    return await prisma.cartItem.findMany({
      where: userId ? { userId } : { sessionId },
      include: {
        variant: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
      },
      orderBy: { addedAt: "asc" },
    });
  } catch {
    return [];
  }
}

export type CheckoutCartLine = {
  itemId: string;
  variantId: string;
  quantity: number;
  productName: string;
  productSlug: string;
  colorName: string;
  size: string;
  unitPrice: number;
  lineTotal: number;
  imageUrl: string | null;
};

export type CartItemDetailed = Awaited<ReturnType<typeof getCartItemsDetailed>>[number];

export function mapCartRowsToLines(rows: CartItemDetailed[]): CheckoutCartLine[] {
  return rows.map((row) => {
    const unit = Number(row.variant.price);
    const qty = row.quantity;
    return {
      itemId: row.id,
      variantId: row.variantId,
      quantity: qty,
      productName: row.variant.product.name,
      productSlug: row.variant.product.slug,
      colorName: row.variant.colorName,
      size: row.variant.size,
      unitPrice: unit,
      lineTotal: Math.round(unit * qty * 100) / 100,
      imageUrl: row.variant.product.images[0]?.url ?? null,
    };
  });
}

export async function getCheckoutCartSummary(): Promise<{
  lines: CheckoutCartLine[];
  subtotal: number;
  tax: number;
  total: number;
  isEmpty: boolean;
}> {
  const items = await getCartItemsDetailed();
  if (items.length === 0) {
    return { lines: [], subtotal: 0, tax: 0, total: 0, isEmpty: true };
  }

  const lines = mapCartRowsToLines(items);

  const subtotal = Math.round(lines.reduce((s, l) => s + l.lineTotal, 0) * 100) / 100;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  return { lines, subtotal, tax, total, isEmpty: false };
}
