import { cookies } from "next/headers";

import { auth } from "@/lib/auth";
import { STORE_TAX_RATE } from "@/lib/currency";
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
  currency: string;
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
      lineTotal: Math.round(unit * qty),
      imageUrl: row.variant.product.images[0]?.url ?? null,
      currency: row.variant.product.currency ?? "TZS",
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

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const tax = Math.round(subtotal * STORE_TAX_RATE);
  const total = subtotal + tax;

  return { lines, subtotal, tax, total, isEmpty: false };
}
