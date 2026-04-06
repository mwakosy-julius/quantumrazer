import { CartPageClient } from "@/components/cart/CartPageClient";
import { getCartItemsDetailed, mapCartRowsToLines } from "@/lib/data/cart";

export default async function CartPage() {
  const items = await getCartItemsDetailed();
  const lines = mapCartRowsToLines(items);
  const subtotal = Math.round(lines.reduce((s, l) => s + l.lineTotal, 0) * 100) / 100;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;

  return (
    <div className="mx-auto max-w-content px-[var(--content-padding)] py-12">
      <h1 className="text-3xl font-black">Your Bag</h1>
      <CartPageClient initialLines={lines} subtotal={subtotal} tax={tax} />
    </div>
  );
}
