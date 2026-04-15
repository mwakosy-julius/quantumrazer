"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getCartForDrawer, updateCartItemAction } from "@/actions/cart.actions";
import { estimatedStandardShipping, formatMoney, formatPrice, STORE_TAX_RATE } from "@/lib/currency";
import { useCartStore } from "@/store/cartStore";

type DrawerLine = {
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

function mapRows(rows: Awaited<ReturnType<typeof getCartForDrawer>>): DrawerLine[] {
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

export function CartDrawer() {
  const router = useRouter();
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const [lines, setLines] = useState<DrawerLine[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    void getCartForDrawer()
      .then((rows) => setLines(mapRows(rows)))
      .catch(() => setLines([]));
  }, [isOpen]);

  const refresh = () => {
    void getCartForDrawer()
      .then((rows) => setLines(mapRows(rows)))
      .then(() => router.refresh());
  };

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const shipping = subtotal > 0 ? estimatedStandardShipping(subtotal) : 0;
  const tax = Math.round(subtotal * STORE_TAX_RATE);
  const total = Math.round(subtotal + shipping + tax);
  const itemCount = lines.reduce((s, l) => s + l.quantity, 0);

  const updateQty = async (itemId: string, quantity: number) => {
    const res = await updateCartItemAction({ itemId, quantity });
    if (!res?.serverError) refresh();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close overlay"
            className="fixed inset-0 z-[10000] bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="fixed bottom-0 right-0 top-0 z-[10001] flex w-full max-w-[400px] flex-col border-l border-grey-200 bg-white"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex items-center justify-between border-b border-grey-200 px-6 py-5">
              <h2 id="cart-title" className="text-[18px] font-bold text-black">
                Your Bag ({itemCount})
              </h2>
              <button type="button" className="text-[20px] text-black hover:text-grey-500" aria-label="Close cart" onClick={closeCart}>
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6">
              {lines.length === 0 ? (
                <p className="py-8 text-[14px] text-grey-500">Your bag is empty.</p>
              ) : (
                <ul>
                  {lines.map((item) => (
                    <li key={item.itemId} className="flex gap-4 border-b border-grey-200 py-5">
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="relative h-[100px] w-[100px] shrink-0 overflow-hidden bg-grey-100"
                        onClick={closeCart}
                      >
                        {item.imageUrl && (
                          <Image src={item.imageUrl} alt="" fill className="object-contain p-2" sizes="100px" />
                        )}
                      </Link>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-medium text-black">{item.productName}</p>
                        <p className="mt-0.5 text-[15px] text-grey-500">
                          {item.colorName} · {item.size}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-grey-200 text-[16px] text-black hover:border-black"
                              aria-label="Decrease quantity"
                              onClick={() => void updateQty(item.itemId, item.quantity <= 1 ? 0 : item.quantity - 1)}
                            >
                              −
                            </button>
                            <span className="flex h-8 min-w-[32px] items-center justify-center text-[14px]">{item.quantity}</span>
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-grey-200 text-[16px] text-black hover:border-black"
                              aria-label="Increase quantity"
                              onClick={() => void updateQty(item.itemId, Math.min(10, item.quantity + 1))}
                            >
                              +
                            </button>
                          </div>
                          <span className="text-[15px] text-black">{formatPrice(item.lineTotal, item.currency)}</span>
                        </div>
                        <button
                          type="button"
                          className="mt-2 text-[13px] text-grey-500 underline hover:text-black"
                          onClick={() => void updateQty(item.itemId, 0)}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t border-grey-200 px-6 py-6">
              <div className="space-y-2 text-[15px]">
                <div className="flex justify-between text-black">
                  <span>Subtotal</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between text-black">
                  <span>Delivery</span>
                  <span>{shipping === 0 ? "Free" : formatMoney(shipping)}</span>
                </div>
                <div className="flex justify-between text-black">
                  <span>Tax (VAT)</span>
                  <span>{formatMoney(tax)}</span>
                </div>
                <div className="mt-4 flex justify-between border-t border-grey-200 pt-4">
                  <span className="text-[18px] font-bold text-black">Total</span>
                  <span className="text-[18px] font-bold text-black">{formatMoney(total)}</span>
                </div>
              </div>
              <p className="mt-3 text-center text-[13px] text-grey-500">Member: Free Delivery on qualifying orders</p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-4 flex h-[52px] w-full items-center justify-center rounded-pill bg-black text-[16px] font-medium text-white transition-colors hover:bg-grey-700"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                className="mt-4 block text-center text-[15px] text-black underline hover:text-grey-500"
                onClick={closeCart}
              >
                View Bag
              </Link>
              <p className="mt-3 text-center text-[13px] text-black">
                <Link href="/login" className="underline hover:text-grey-500">
                  Sign in for member pricing →
                </Link>
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
