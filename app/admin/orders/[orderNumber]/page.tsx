import { notFound } from "next/navigation";

import { OrderDetailActions } from "@/components/admin/OrderDetailActions";
import { prisma } from "@/lib/prisma";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function AdminOrderDetailPage({ params }: { params: { orderNumber: string } }) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: {
      user: { select: { email: true, firstName: true, lastName: true } },
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } },
              },
            },
          },
        },
      },
    },
  });

  if (!order) notFound();

  const ship = order.shippingAddress as Record<string, unknown>;

  return (
    <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <h1 className="mb-2 text-[24px] font-bold text-[#111111]">Order {order.orderNumber}</h1>
      <p className="mb-6 text-[14px] text-[#6B7280]">
        Placed {order.createdAt.toLocaleString()} · Status {order.status}
      </p>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-5">
          <h2 className="text-[16px] font-semibold text-[#111111]">Customer</h2>
          <p className="mt-2 text-[14px] text-[#111111]">
            {order.user?.email ?? order.guestEmail ?? "—"}
          </p>
          <h3 className="mt-4 text-[14px] font-semibold text-[#111111]">Shipping</h3>
          <p className="mt-1 text-[14px] text-[#6B7280]">
            {String(ship.firstName ?? "")} {String(ship.lastName ?? "")}
            <br />
            {String(ship.addressLine1 ?? "")}
            <br />
            {String(ship.city ?? "")}, {String(ship.state ?? "")} {String(ship.postalCode ?? "")}
          </p>
        </div>

        <div className="rounded-lg border border-[#E5E7EB] bg-white p-5">
          <h2 className="text-[16px] font-semibold text-[#111111]">Totals</h2>
          <dl className="mt-3 space-y-1 text-[14px]">
            <div className="flex justify-between">
              <dt className="text-[#6B7280]">Subtotal</dt>
              <dd>{money(Number(order.subtotal))}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#6B7280]">Tax</dt>
              <dd>{money(Number(order.tax))}</dd>
            </div>
            <div className="flex justify-between font-semibold">
              <dt>Total</dt>
              <dd>{money(Number(order.total))}</dd>
            </div>
          </dl>
          <h3 className="mt-4 text-[14px] font-semibold">Timeline</h3>
          <ul className="mt-2 text-[13px] text-[#6B7280]">
            <li>Created: {order.createdAt.toISOString()}</li>
            <li>Updated: {order.updatedAt.toISOString()}</li>
            {order.trackingNumber ? <li>Tracking: {order.trackingNumber}</li> : null}
          </ul>
        </div>
      </div>

      <OrderDetailActions
        orderId={order.id}
        orderNumber={order.orderNumber}
        currentStatus={order.status}
        trackingNumber={order.trackingNumber}
        items={order.items}
      />
    </div>
  );
}
