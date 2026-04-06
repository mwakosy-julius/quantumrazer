import Link from "next/link";

import { Button } from "@/components/ui/Button";

type Props = { searchParams: Record<string, string | string[] | undefined> };

export default function OrderConfirmedPage({ searchParams }: Props) {
  const raw = searchParams.order;
  const order = Array.isArray(raw) ? raw[0] : raw;

  return (
    <div className="mx-auto max-w-[520px] px-[var(--content-padding)] py-20 text-center">
      <h1 className="text-3xl font-black">Thank you</h1>
      <p className="mt-4 text-grey-500">Your order is confirmed. You will receive an email shortly.</p>
      {order && (
        <p className="mt-2 text-[15px] font-medium text-black">
          Order <span className="font-mono">{order}</span>
        </p>
      )}
      <Link href="/products" className="mt-10 inline-block">
        <Button>Continue Shopping</Button>
      </Link>
    </div>
  );
}
