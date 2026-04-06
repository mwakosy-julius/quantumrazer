"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";

const WishlistSchema = z.object({
  productId: z.string().cuid(),
  variantId: z.string().cuid().optional(),
});

export const addWishlistAction = actionClient(WishlistSchema, async (parsedInput) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorised");

  await prisma.wishlistItem.upsert({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId: parsedInput.productId,
      },
    },
    update: { variantId: parsedInput.variantId ?? null },
    create: {
      userId: session.user.id,
      productId: parsedInput.productId,
      variantId: parsedInput.variantId,
    },
  });
  revalidatePath("/account/wishlist");
  return { success: true as const };
});

const RemoveWishlistSchema = z.object({ productId: z.string().cuid() });

export const removeWishlistAction = actionClient(RemoveWishlistSchema, async (parsedInput) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorised");

  await prisma.wishlistItem.deleteMany({
    where: { userId: session.user.id, productId: parsedInput.productId },
  });
  revalidatePath("/account/wishlist");
  return { success: true as const };
});
