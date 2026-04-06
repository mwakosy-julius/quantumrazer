"use server";

import { OrderStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { getStripe } from "@/lib/stripe";
import { CheckoutSchema } from "@/lib/validations";

const CART_COOKIE = "cart_session";

const PaymentIntentSchema = z.object({
  amountCents: z.number().int().positive(),
  currency: z.string().default("usd"),
});

export const createPaymentIntentAction = actionClient(PaymentIntentSchema, async (parsedInput) => {
  const stripe = getStripe();
  if (!stripe) {
    return {
      clientSecret: "pi_dev_placeholder_secret",
      paymentIntentId: "pi_dev_placeholder",
    };
  }
  const intent = await stripe.paymentIntents.create({
    amount: parsedInput.amountCents,
    currency: parsedInput.currency,
    automatic_payment_methods: { enabled: true },
  });
  return {
    clientSecret: intent.client_secret!,
    paymentIntentId: intent.id,
  };
});

export const createOrderAction = actionClient(CheckoutSchema, async (parsedInput) => {
  const session = await auth();
  const userId = session?.user?.id;
  const sessionId = userId ? undefined : cookies().get(CART_COOKIE)?.value;

  if (!userId && !sessionId) {
    throw new Error("Cart session missing");
  }

  const cartItems = await prisma.cartItem.findMany({
    where: userId ? { userId } : { sessionId },
    include: {
      variant: { include: { product: true } },
    },
  });

  if (cartItems.length === 0) throw new Error("Cart is empty");

  for (const item of cartItems) {
    if (item.variant.inventoryCount < item.quantity) {
      throw new Error(`${item.variant.product.name} is out of stock`);
    }
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.variant.price) * item.quantity,
    0,
  );

  const shippingCost =
    parsedInput.shippingMethod === "standard" ? 0 : parsedInput.shippingMethod === "express" ? 9.99 : 14.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;

  const stripe = getStripe();
  if (stripe) {
    const intent = await stripe.paymentIntents.retrieve(parsedInput.paymentIntentId);
    if (intent.status !== "succeeded" && intent.status !== "processing") {
      throw new Error("Payment not completed");
    }
  }

  const orderNumber = `NK-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  const shippingJson = parsedInput.shippingAddress as object;
  const billingJson = parsedInput.sameAsBilling
    ? shippingJson
    : (parsedInput.billingAddress as object) ?? shippingJson;

  const guestEmail = !userId ? parsedInput.shippingAddress.email : undefined;
  if (!userId && !guestEmail) {
    throw new Error("Email required for guest checkout");
  }

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        userId: userId ?? undefined,
        guestEmail: guestEmail ?? undefined,
        status: OrderStatus.CONFIRMED,
        subtotal: new Prisma.Decimal(subtotal),
        shippingCost: new Prisma.Decimal(shippingCost),
        tax: new Prisma.Decimal(tax),
        total: new Prisma.Decimal(total),
        stripePaymentIntentId: parsedInput.paymentIntentId,
        shippingAddress: shippingJson,
        billingAddress: billingJson,
        items: {
          create: cartItems.map((item) => ({
            variantId: item.variantId,
            productName: item.variant.product.name,
            variantSku: item.variant.sku,
            colorName: item.variant.colorName,
            size: item.variant.size,
            quantity: item.quantity,
            unitPrice: item.variant.price,
            totalPrice: new Prisma.Decimal(Number(item.variant.price) * item.quantity),
          })),
        },
      },
    });

    for (const item of cartItems) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { inventoryCount: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({
      where: userId ? { userId } : { sessionId },
    });

    return created;
  });

  cookies().delete(CART_COOKIE);

  await inngest.send({ name: "order/created", data: { orderId: order.id, orderNumber: order.orderNumber } });

  revalidatePath("/account");
  revalidatePath("/cart");
  revalidatePath("/", "layout");
  return { success: true as const, orderNumber: order.orderNumber };
});
