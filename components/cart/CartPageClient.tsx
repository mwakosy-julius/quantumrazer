"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { updateCartItemAction } from "@/actions/cart.actions";
import { Button } from "@/components/ui/Button";
import type { CheckoutCartLine } from "@/lib/data/cart";

export function CartPageClient({
  initialLines,
  subtotal,
  tax,
}: {
  initialLines: CheckoutCartLine[];
  subtotal: number;
  tax: number;
}) {
  const router = useRouter();
  const [lines, setLines] = useState(initialLines);

  const total = Math.round((subtotal + tax) * 100) / 100;

  const refresh = () => router.refresh();

  const updateQty = async (itemId: string, quantity: number) => {
    const res = await updateCartItemAction({ itemId, quantity });
    if (res?.serverError) return;
    setLines((prev) =>
      quantity === 0
        ? prev.filter((l) => l.itemId !== itemId)
        : prev.map((l) =>
            l.itemId === itemId
              ? {
                  ...l,
                  quantity,
                  lineTotal: Math.round(l.unitPrice * quantity * 100) / 100,
                }
              : l,
          ),
    );
    refresh();
  };

  if (lines.length === 0) {
    return <p className="mt-8 text-grey-500">Your bag is empty.</p>;
  }

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
      <ul className="space-y-6">
        {lines.map((item) => (
          <li key={item.itemId} className="flex gap-4 border-b border-grey-100 pb-6">
            <Link href={`/products/${item.productSlug}`} className="relative block h-24 w-24 shrink-0 bg-grey-100">
              {item.imageUrl && (
                <Image src={item.imageUrl} alt="" fill className="object-contain p-2" sizes="96px" />
              )}
            </Link>
            <div className="flex-1">
              <p className="font-medium">{item.productName}</p>
              <p className="text-[13px] text-grey-500">
                {item.colorName} / {item.size}
              </p>
              <div className="mt-2 flex items-center gap-3 text-[14px]">
                <button
                  type="button"
                  className="rounded border px-2"
                  onClick={() => void updateQty(item.itemId, item.quantity <= 1 ? 0 : item.quantity - 1)}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  className="rounded border px-2"
                  onClick={() => void updateQty(item.itemId, Math.min(10, item.quantity + 1))}
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-[15px]">${item.lineTotal.toFixed(2)}</p>
          </li>
        ))}
      </ul>
      <aside className="h-fit rounded border border-grey-200 p-6">
        <div className="space-y-2 text-[14px]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-grey-500">
            <span>Est. Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-grey-200 pt-4 font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <Link href="/checkout" className="mt-6 block">
          <Button className="w-full">Checkout</Button>
        </Link>
      </aside>
    </div>
  );
}
