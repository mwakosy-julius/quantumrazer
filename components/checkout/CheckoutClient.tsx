"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { createOrderAction, createPaymentIntentAction } from "@/actions/order.actions";
import { QuantumRazerLogo } from "@/components/brand/QuantumRazerLogo";
import type { CheckoutCartLine } from "@/lib/data/cart";

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
      <div className="mx-auto max-w-content px-6 py-12 md:px-[var(--content-padding)]">
        <p className="text-grey-500">Your bag is empty.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto grid max-w-content gap-0 lg:grid-cols-[55%_45%]">
        <div className="px-6 py-12 md:pl-[var(--content-padding)] md:pr-12 lg:py-12">
          <div className="mb-10">
            <QuantumRazerLogo size="nav" theme="light" href="/" />
          </div>
          <p className="text-[13px] text-grey-500">
            <span className="font-medium text-black">Contact</span>
            <span className="mx-2 text-grey-300">›</span>
            <span>Delivery</span>
            <span className="mx-2 text-grey-300">›</span>
            <span>Payment</span>
          </p>

          <h1 className="mt-8 text-[22px] font-bold text-black">Checkout</h1>
          <p className="mt-2 text-[15px] leading-[1.75] text-grey-500">
            Secure checkout. Add Stripe keys for live card payments; without them a test placeholder payment is used.
          </p>

          {status !== "authenticated" && (
            <div className="mt-8">
              <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-[0.02em] text-black">Email</label>
              <input
                className="h-12 w-full max-w-md rounded-brand border border-grey-300 bg-white px-4 text-[15px] text-black outline-none focus:border-black"
                placeholder="Email (guest)"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
              />
            </div>
          )}

          <div className="mt-10">
            <h2 className="text-[22px] font-bold text-black">Delivery</h2>
            <div className="mt-4 space-y-3">
              {(
                [
                  ["standard", "Standard — Free"],
                  ["express", "Express — $9.99"],
                  ["next_day", "Next day — $14.99"],
                ] as const
              ).map(([id, label]) => (
                <label
                  key={id}
                  className="flex cursor-pointer gap-3 rounded-brand border border-grey-300 p-4 hover:border-black"
                >
                  <input
                    type="radio"
                    name="ship"
                    checked={shippingMethod === id}
                    onChange={() => setShippingMethod(id)}
                  />
                  <span className="text-[15px] text-black">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="mt-6 text-[13px] text-black">{error}</p>}

          <button
            type="button"
            className="mt-10 flex h-[52px] w-full max-w-md items-center justify-center rounded-pill bg-black text-[16px] font-medium text-white transition-colors hover:bg-grey-700 disabled:opacity-50"
            disabled={loading}
            onClick={() => void placeOrder()}
          >
            {loading ? "Placing…" : "Place Order"}
          </button>
        </div>

        <aside className="bg-grey-100 px-6 py-12 md:px-12 lg:sticky lg:top-0 lg:self-start lg:min-h-screen">
          <p className="text-[15px] font-bold text-black">Order summary</p>
          <ul className="mt-6 space-y-3 text-[15px] text-black">
            {lines.map((l) => (
              <li key={l.itemId} className="flex justify-between gap-2">
                <span className="truncate text-grey-500">
                  {l.productName} × {l.quantity}
                </span>
                <span>${l.lineTotal.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2 border-t border-grey-200 pt-6 text-[15px]">
            <div className="flex justify-between text-black">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-black">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-grey-500">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-grey-200 pt-4 font-bold text-black">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
