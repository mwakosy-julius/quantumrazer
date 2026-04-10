import { OrderStatus } from "@prisma/client";
import Link from "next/link";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; range?: string };
}) {
  const q = searchParams.q?.trim() ?? "";
  const status = searchParams.status?.trim();
  const range = searchParams.range ?? "30d";

  const where: Prisma.OrderWhereInput = {};

  if (q) {
    where.OR = [
      { orderNumber: { contains: q, mode: "insensitive" } },
      { guestEmail: { contains: q, mode: "insensitive" } },
      { user: { email: { contains: q, mode: "insensitive" } } },
    ];
  }

  if (status && status !== "all" && (Object.values(OrderStatus) as string[]).includes(status)) {
    where.status = status as OrderStatus;
  }

  const now = new Date();
  if (range === "7d") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    where.createdAt = { gte: d };
  } else if (range === "30d") {
    const d = new Date(now);
    d.setDate(d.getDate() - 30);
    where.createdAt = { gte: d };
  } else if (range === "90d") {
    const d = new Date(now);
    d.setDate(d.getDate() - 90);
    where.createdAt = { gte: d };
  }
  /* range === "all" → no date filter */

  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);

  const [orders, todayCount, todayRev, pendingCount] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: { select: { email: true } },
        items: true,
      },
    }),
    prisma.order.count({ where: { createdAt: { gte: startToday } } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startToday } },
      _sum: { total: true },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  const todayRevenue = Number(todayRev._sum.total ?? 0);

  return (
    <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <h1 className="mb-6 text-[24px] font-bold text-[#111111]">Orders</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: "Orders Today", value: String(todayCount) },
          { label: "Revenue Today", value: money(todayRevenue) },
          { label: "Pending Orders", value: String(pendingCount) },
        ].map((c) => (
          <div key={c.label} className="rounded-lg border border-[#E5E7EB] bg-white p-5">
            <p className="text-[13px] font-medium uppercase tracking-wide text-[#6B7280]">{c.label}</p>
            <p className="mt-2 text-[24px] font-bold text-[#111111]">{c.value}</p>
          </div>
        ))}
      </div>

      <form method="get" className="mb-4 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Order # or email"
          className="h-10 min-w-[200px] flex-1 rounded-md border border-[#E5E7EB] px-3 text-[14px]"
        />
        <select
          name="status"
          defaultValue={status ?? "all"}
          className="h-10 rounded-md border border-[#E5E7EB] px-3 text-[14px]"
        >
          {["all", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select name="range" defaultValue={range} className="h-10 rounded-md border border-[#E5E7EB] px-3 text-[14px]">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>
        <button
          type="submit"
          className="h-10 rounded-md bg-[#111111] px-4 text-[14px] font-medium text-white"
        >
          Apply
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-[#E5E7EB] bg-white">
        <table className="w-full min-w-[800px] border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b-2 border-[#E5E7EB] text-[13px] font-medium uppercase tracking-wide text-[#6B7280]">
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                <td className="px-4 py-3 text-[#111111]">{o.orderNumber}</td>
                <td className="px-4 py-3">{o.createdAt.toLocaleString()}</td>
                <td className="px-4 py-3">{o.user?.email ?? o.guestEmail ?? "—"}</td>
                <td className="px-4 py-3">{o.items.length}</td>
                <td className="px-4 py-3">{money(Number(o.total))}</td>
                <td className="px-4 py-3">{o.stripePaymentIntentId ? "Stripe" : "Test / pending"}</td>
                <td className="px-4 py-3">{o.status}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.orderNumber}`} className="text-[#111111] underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
