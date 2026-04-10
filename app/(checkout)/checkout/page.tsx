import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { getCheckoutCartSummary } from "@/lib/data/cart";

export default async function CheckoutPage() {
  const { lines, subtotal, tax, isEmpty } = await getCheckoutCartSummary();

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-content px-6 py-12 md:px-[var(--content-padding)]">
        <h1 className="text-[22px] font-bold text-black">Checkout</h1>
        <p className="mt-4 text-[15px] text-grey-500">Your bag is empty.</p>
      </div>
    );
  }

  return <CheckoutClient lines={lines} subtotal={subtotal} tax={tax} />;
}
