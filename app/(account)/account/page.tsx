import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { formatMoney } from "@/lib/currency";
import { prisma } from "@/lib/prisma";

const statusBadge = "rounded-brand bg-black px-2.5 py-1 text-[13px] font-medium uppercase text-white";

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
      <h1 className="text-[22px] font-bold text-black">Your Orders</h1>
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
                      <Link href={`/account/orders/${o.orderNumber}`} className="text-black underline hover:text-grey-500">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 text-grey-500">{o.createdAt.toLocaleDateString()}</td>
                    <td className="py-3">
                      <span className={statusBadge}>{key}</span>
                    </td>
                    <td className="py-3 text-right">{formatMoney(Number(o.total))}</td>
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
