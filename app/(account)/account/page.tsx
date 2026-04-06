import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const statusColor: Record<string, string> = {
  pending: "bg-grey-200 text-black",
  confirmed: "bg-blue-100 text-blue-900",
  processing: "bg-orange-100 text-orange-900",
  shipped: "bg-purple-100 text-purple-900",
  delivered: "bg-green-100 text-green-900",
  cancelled: "bg-red-100 text-red-900",
  refunded: "bg-grey-100 text-grey-700",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <h1 className="text-2xl font-black">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="mt-6 text-grey-500">You have no orders yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-[14px]">
            <thead>
              <tr className="border-b border-grey-200 text-grey-500">
                <th className="py-3">Order</th>
                <th className="py-3">Date</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const key = o.status.toLowerCase();
                return (
                  <tr key={o.id} className="border-b border-grey-100">
                    <td className="py-3">
                      <Link href={`/account/orders/${o.orderNumber}`} className="underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 text-grey-500">{o.createdAt.toLocaleDateString()}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-1 text-[12px] font-medium ${statusColor[key] ?? "bg-grey-100"}`}>
                        {key}
                      </span>
                    </td>
                    <td className="py-3 text-right">${Number(o.total).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
