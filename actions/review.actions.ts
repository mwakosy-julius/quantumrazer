"use server";

import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { ReviewSchema } from "@/lib/validations";

export const createReviewAction = actionClient(ReviewSchema, async (parsedInput) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorised");

  const purchase = await prisma.orderItem.findFirst({
    where: {
      order: {
        userId: session.user.id,
        status: { in: [OrderStatus.DELIVERED, OrderStatus.SHIPPED, OrderStatus.CONFIRMED] },
      },
      variant: { productId: parsedInput.productId },
    },
  });

  const product = await prisma.product.findUniqueOrThrow({
    where: { id: parsedInput.productId },
    select: { slug: true },
  });

  await prisma.review.upsert({
    where: {
      productId_userId: {
        productId: parsedInput.productId,
        userId: session.user.id,
      },
    },
    update: {
      rating: parsedInput.rating,
      title: parsedInput.title,
      body: parsedInput.body,
    },
    create: {
      productId: parsedInput.productId,
      userId: session.user.id,
      rating: parsedInput.rating,
      title: parsedInput.title,
      body: parsedInput.body,
      isVerifiedPurchase: Boolean(purchase),
    },
  });

  revalidatePath(`/products/${product.slug}`);
  return { success: true as const };
});
