import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { formatMoney, formatPrice } from "@/lib/currency";
import { prisma } from "@/lib/prisma";

type Props = { params: { orderNumber: string } };

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect(`/login?callbackUrl=/account/orders/${params.orderNumber}`);

  const order = await prisma.order.findFirst({
    where: { orderNumber: params.orderNumber, userId: session.user.id },
    include: {
      items: {
        include: {
          variant: { include: { product: { select: { currency: true } } } },
        },
      },
    },
  });

  if (!order) notFound();

  return (
    <div>
      <Link href="/account" className="text-[14px] text-grey-500 underline">
        ← Back to orders
      </Link>
      <h1 className="mt-4 text-2xl font-black">Order {order.orderNumber}</h1>
      <p className="mt-2 text-grey-500">{order.createdAt.toLocaleString()}</p>
      <p className="mt-2 text-[14px]">
        Status: <span className="font-semibold">{order.status.toLowerCase()}</span>
      </p>
      <ul className="mt-8 space-y-4 border-t border-grey-200 pt-6">
        {order.items.map((i) => (
          <li key={i.id} className="flex justify-between text-[14px]">
            <span>
              {i.productName} × {i.quantity}
            </span>
            <span>
              {formatPrice(Number(i.totalPrice), i.variant.product.currency ?? "TZS")}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-6 space-y-2 border-t border-grey-200 pt-6 text-[14px]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatMoney(Number(order.subtotal))}</span>
        </div>
        <div className="flex justify-between">
          <span>VAT</span>
          <span>{formatMoney(Number(order.tax))}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatMoney(Number(order.total))}</span>
        </div>
      </div>
    </div>
  );
}
