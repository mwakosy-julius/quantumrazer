"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getCartForDrawer, updateCartItemAction } from "@/actions/cart.actions";
import { Button } from "@/components/ui/Button";
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
      lineTotal: Math.round(unit * qty * 100) / 100,
      imageUrl: row.variant.product.images[0]?.url ?? null,
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
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
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
            className="fixed inset-0 z-[10000] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="fixed bottom-0 right-0 top-0 z-[10001] flex w-full max-w-[400px] flex-col bg-white shadow-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex items-center justify-between border-b border-grey-200 px-6 py-4">
              <h2 id="cart-title" className="text-lg font-semibold">
                Your Bag ({itemCount})
              </h2>
              <button type="button" className="text-xl" aria-label="Close cart" onClick={closeCart}>
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <p className="text-grey-500">Your bag is empty.</p>
              ) : (
                <ul className="space-y-6">
                  {lines.map((item) => (
                    <li key={item.itemId} className="flex gap-4">
                      <Link href={`/products/${item.productSlug}`} className="relative h-[100px] w-[100px] shrink-0 bg-grey-100">
                        {item.imageUrl && (
                          <Image src={item.imageUrl} alt="" fill className="object-contain p-2" sizes="100px" />
                        )}
                      </Link>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-medium">{item.productName}</p>
                        <p className="text-[13px] text-grey-500">
                          {item.colorName} / {item.size}
                        </p>
                        <p className="mt-1 text-right text-[14px]">${item.unitPrice.toFixed(2)}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <button
                            type="button"
                            className="rounded border border-grey-200 px-2"
                            aria-label="Decrease quantity"
                            onClick={() => void updateQty(item.itemId, item.quantity <= 1 ? 0 : item.quantity - 1)}
                          >
                            −
                          </button>
                          <span className="text-[14px]">{item.quantity}</span>
                          <button
                            type="button"
                            className="rounded border border-grey-200 px-2"
                            aria-label="Increase quantity"
                            onClick={() => void updateQty(item.itemId, Math.min(10, item.quantity + 1))}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t border-grey-200 px-6 py-6">
              <div className="mb-4 space-y-2 text-[14px]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-grey-500">
                  <span>Estimated Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Link href="/checkout" onClick={closeCart}>
                <Button className="w-full">Checkout</Button>
              </Link>
              <Link href="/cart" className="mt-3 block text-center text-[14px] underline" onClick={closeCart}>
                View Bag
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
