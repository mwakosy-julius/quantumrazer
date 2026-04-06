"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

import { getCartItemsDetailed } from "@/lib/data/cart";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { AddToCartSchema } from "@/lib/validations";

export async function getCartForDrawer() {
  return getCartItemsDetailed();
}

const CART_COOKIE = "cart_session";

function getOrSetSessionId(): string {
  const jar = cookies();
  let sid = jar.get(CART_COOKIE)?.value;
  if (!sid) {
    sid = crypto.randomUUID();
    jar.set(CART_COOKIE, sid, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }
  return sid;
}

export const addToCartAction = actionClient(AddToCartSchema, async (parsedInput) => {
  const session = await auth();
  const variant = await prisma.productVariant.findUniqueOrThrow({
    where: { id: parsedInput.variantId },
  });
  if (variant.inventoryCount < parsedInput.quantity) {
    throw new Error("Insufficient stock");
  }

  const userId = session?.user?.id;

  if (userId) {
    await prisma.cartItem.upsert({
      where: {
        userId_variantId: { userId, variantId: parsedInput.variantId },
      },
      update: { quantity: { increment: parsedInput.quantity } },
      create: {
        userId,
        variantId: parsedInput.variantId,
        quantity: parsedInput.quantity,
      },
    });
  } else {
    const sessionId = getOrSetSessionId();
    await prisma.cartItem.upsert({
      where: {
        sessionId_variantId: { sessionId, variantId: parsedInput.variantId },
      },
      update: { quantity: { increment: parsedInput.quantity } },
      create: {
        sessionId,
        variantId: parsedInput.variantId,
        quantity: parsedInput.quantity,
      },
    });
  }

  revalidatePath("/", "layout");
  revalidatePath("/cart");
  return { success: true as const };
});

const UpdateCartSchema = z.object({
  itemId: z.string().cuid(),
  quantity: z.number().int().min(0).max(10),
});

export const updateCartItemAction = actionClient(UpdateCartSchema, async (parsedInput) => {
  if (parsedInput.quantity === 0) {
    await prisma.cartItem.delete({ where: { id: parsedInput.itemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: parsedInput.itemId },
      data: { quantity: parsedInput.quantity },
    });
  }
  revalidatePath("/", "layout");
  revalidatePath("/cart");
  return { success: true as const };
});

export const mergeGuestCartAction = actionClient(z.object({}), async () => {
  const session = await auth();
  if (!session?.user?.id) return { success: false as const };

  const sessionId = cookies().get(CART_COOKIE)?.value;
  if (!sessionId) return { success: true as const };

  const guestItems = await prisma.cartItem.findMany({
    where: { sessionId },
  });

  for (const item of guestItems) {
    await prisma.cartItem.upsert({
      where: {
        userId_variantId: {
          userId: session.user.id,
          variantId: item.variantId,
        },
      },
      update: { quantity: { increment: item.quantity } },
      create: {
        userId: session.user.id,
        variantId: item.variantId,
        quantity: item.quantity,
      },
    });
  }

  await prisma.cartItem.deleteMany({ where: { sessionId } });
  cookies().delete(CART_COOKIE);
  revalidatePath("/", "layout");
  revalidatePath("/cart");
  return { success: true as const };
});
