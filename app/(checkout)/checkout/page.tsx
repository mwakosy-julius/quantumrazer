import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { getCheckoutCartSummary } from "@/lib/data/cart";

export default async function CheckoutPage() {
  const { lines, subtotal, tax, isEmpty } = await getCheckoutCartSummary();

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-content px-[var(--content-padding)] py-12">
        <h1 className="text-2xl font-black">Checkout</h1>
        <p className="mt-4 text-grey-500">Your bag is empty.</p>
      </div>
    );
  }

  return <CheckoutClient lines={lines} subtotal={subtotal} tax={tax} />;
}
