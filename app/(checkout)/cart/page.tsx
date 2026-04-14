import { CartPageClient } from "@/components/cart/CartPageClient";
import { STORE_TAX_RATE } from "@/lib/currency";
import { getCartItemsDetailed, mapCartRowsToLines } from "@/lib/data/cart";

export default async function CartPage() {
  const items = await getCartItemsDetailed();
  const lines = mapCartRowsToLines(items);
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const tax = Math.round(subtotal * STORE_TAX_RATE);

  return (
    <div className="mx-auto max-w-content px-[var(--content-padding)] py-12">
      <h1 className="text-3xl font-black">Your Bag</h1>
      <CartPageClient initialLines={lines} subtotal={subtotal} tax={tax} />
    </div>
  );
}
