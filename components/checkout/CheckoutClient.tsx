"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { createOrderAction, createPaymentIntentAction } from "@/actions/order.actions";
import type { CheckoutCartLine } from "@/lib/data/cart";
import { Button } from "@/components/ui/Button";

type ShipMethod = "standard" | "express" | "next_day";

export function CheckoutClient({
  lines,
  subtotal,
  tax,
}: {
  lines: CheckoutCartLine[];
  subtotal: number;
  tax: number;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [guestEmail, setGuestEmail] = useState("");
  const [shippingMethod, setShippingMethod] = useState<ShipMethod>("standard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingCost =
    shippingMethod === "standard" ? 0 : shippingMethod === "express" ? 9.99 : 14.99;
  const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;

  const email = session?.user?.email ?? guestEmail;

  const placeOrder = async () => {
    setError(null);
    if (!email?.trim()) {
      setError("Email is required");
      return;
    }
    setLoading(true);
    try {
      const amountCents = Math.round(total * 100);
      const pi = await createPaymentIntentAction({ amountCents, currency: "usd" });
      if (pi?.serverError) {
        setError(pi.serverError);
        setLoading(false);
        return;
      }
      const paymentIntentId = pi?.data?.paymentIntentId;
      if (!paymentIntentId) {
        setError("Payment could not be started");
        setLoading(false);
        return;
      }

      const shippingAddress = {
        email: email.trim(),
        firstName: session?.user?.firstName ?? "Guest",
        lastName: "Customer",
        addressLine1: "1 Demo Street",
        addressLine2: undefined as string | undefined,
        city: "Portland",
        state: "OR",
        postalCode: "97201",
        country: "US",
        phone: undefined as string | undefined,
      };

      const orderRes = await createOrderAction({
        shippingAddress,
        sameAsBilling: true,
        shippingMethod,
        paymentIntentId,
      });

      if (orderRes?.serverError) {
        setError(orderRes.serverError);
        setLoading(false);
        return;
      }
      const num = orderRes?.data?.orderNumber;
      router.push(num ? `/order-confirmed?order=${encodeURIComponent(num)}` : "/order-confirmed");
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  };

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-content px-[var(--content-padding)] py-12">
        <p className="text-grey-500">Your bag is empty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-content gap-10 px-[var(--content-padding)] py-12 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="text-2xl font-black">Checkout</h1>
        <p className="mt-2 text-[14px] text-grey-500">
          Secure checkout. Add Stripe keys for live card payments; without them a test placeholder payment is used.
        </p>
        {status !== "authenticated" && (
          <input
            className="mt-6 w-full max-w-md rounded border border-grey-200 px-4 py-3 text-[15px]"
            placeholder="Email (guest)"
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
          />
        )}
        <div className="mt-8 space-y-4 rounded border border-grey-200 p-6">
          <p className="text-[14px] font-medium">Delivery</p>
          <label className="flex cursor-pointer gap-3 rounded border border-grey-200 p-4">
            <input
              type="radio"
              name="ship"
              checked={shippingMethod === "standard"}
              onChange={() => setShippingMethod("standard")}
            />
            <span className="text-[14px]">Standard — Free</span>
          </label>
          <label className="flex cursor-pointer gap-3 rounded border border-grey-200 p-4">
            <input
              type="radio"
              name="ship"
              checked={shippingMethod === "express"}
              onChange={() => setShippingMethod("express")}
            />
            <span className="text-[14px]">Express — $9.99</span>
          </label>
          <label className="flex cursor-pointer gap-3 rounded border border-grey-200 p-4">
            <input
              type="radio"
              name="ship"
              checked={shippingMethod === "next_day"}
              onChange={() => setShippingMethod("next_day")}
            />
            <span className="text-[14px]">Next day — $14.99</span>
          </label>
        </div>
        {error && <p className="mt-4 text-[13px] text-red-brand">{error}</p>}
        <Button type="button" className="mt-8 w-full max-w-md" disabled={loading} onClick={() => void placeOrder()}>
          {loading ? "Placing…" : "Place Order"}
        </Button>
      </div>
      <aside className="h-fit rounded border border-grey-200 p-6 text-[14px]">
        <p className="font-semibold">Order summary</p>
        <ul className="mt-4 space-y-2 text-[13px] text-grey-700">
          {lines.map((l) => (
            <li key={l.itemId} className="flex justify-between gap-2">
              <span className="truncate">
                {l.productName} × {l.quantity}
              </span>
              <span>${l.lineTotal.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-2 border-t border-grey-200 pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-grey-500">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <p className="mt-6 flex items-center gap-2 text-[13px] text-grey-500">
          <span aria-hidden>🔒</span> Secure Checkout
        </p>
      </aside>
    </div>
  );
}
