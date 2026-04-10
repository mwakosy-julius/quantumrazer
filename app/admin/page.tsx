import { OrderStatus } from "@prisma/client";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function statusBadge(status: OrderStatus) {
  const map: Record<OrderStatus, { bg: string; text: string }> = {
    PENDING: { bg: "#FEF3C7", text: "#92400E" },
    CONFIRMED: { bg: "#DBEAFE", text: "#1E40AF" },
    PROCESSING: { bg: "#E0E7FF", text: "#3730A3" },
    SHIPPED: { bg: "#E0E7FF", text: "#3730A3" },
    DELIVERED: { bg: "#D1FAE5", text: "#065F46" },
    CANCELLED: { bg: "#FEE2E2", text: "#991B1B" },
    REFUNDED: { bg: "#FEE2E2", text: "#991B1B" },
  };
  const s = map[status];
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase"
      style={{ background: s.bg, color: s.text }}
    >
      {status}
    </span>
  );
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const dateLabel = now.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [
    revenueAgg,
    orderCount,
    productCount,
    ordersWithUser,
    recentOrders,
    lowStockVariants,
  ] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.findMany({
      where: { userId: { not: null } },
      select: { userId: true },
      distinct: ["userId"],
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
        items: true,
      },
    }),
    prisma.productVariant.findMany({
      where: { inventoryCount: { lt: 5, gt: 0 } },
      include: { product: { select: { name: true } } },
      take: 12,
    }),
  ]);

  const activeCustomers = ordersWithUser.length;
  const totalRevenue = Number(revenueAgg._sum.total ?? 0);

  return (
    <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#111111]">Dashboard</h1>
          <p className="mt-1 text-[14px] text-[#6B7280]">{dateLabel}</p>
        </div>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Revenue",
            value: money(totalRevenue),
            change: "↑ 12% from last month",
            positive: true,
            icon: IconDollar,
          },
          {
            label: "Total Orders",
            value: String(orderCount),
            change: "↑ 4% from last month",
            positive: true,
            icon: IconCart,
          },
          {
            label: "Total Products",
            value: String(productCount),
            change: "—",
            positive: true,
            icon: IconBox,
          },
          {
            label: "Active Customers",
            value: String(activeCustomers),
            change: "↓ 3% from last month",
            positive: false,
            icon: IconUsers,
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-[#E5E7EB] bg-white p-6"
          >
            <div className="flex items-start justify-between">
              <span className="text-[13px] font-medium uppercase tracking-[0.04em] text-[#6B7280]">
                {card.label}
              </span>
              <card.icon className="text-[#9CA3AF]" />
            </div>
            <p className="my-3 text-[32px] font-bold text-[#111111]">{card.value}</p>
            <p
              className="flex items-center gap-1 text-[13px]"
              style={{ color: card.change === "—" ? "#6B7280" : card.positive ? "#059669" : "#DC2626" }}
            >
              {card.change}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-[18px] font-semibold text-[#111111]">Recent Orders</h2>
        <Link href="/admin/orders" className="text-[14px] font-medium text-[#111111] underline">
          View All →
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#E5E7EB] bg-white">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-[#E5E7EB]">
              {["Order #", "Customer", "Date", "Items", "Total", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-[13px] font-medium uppercase tracking-[0.04em] text-[#6B7280]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => {
              const cust =
                o.user?.email ??
                o.guestEmail ??
                `${o.user?.firstName ?? ""} ${o.user?.lastName ?? ""}`.trim() ??
                "—";
              return (
                <tr key={o.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                  <td className="px-4 py-3.5 text-[14px] text-[#111111]">
                    <Link href={`/admin/orders/${o.orderNumber}`} className="underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-[14px] text-[#111111]">{cust}</td>
                  <td className="px-4 py-3.5 text-[14px] text-[#111111]">
                    {o.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3.5 text-[14px] text-[#111111]">{o.items.length}</td>
                  <td className="px-4 py-3.5 text-[14px] text-[#111111]">
                    {money(Number(o.total))}
                  </td>
                  <td className="px-4 py-3.5">{statusBadge(o.status)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-[18px] font-semibold text-[#111111]">Stock Alerts</h2>
        <ul className="space-y-2 rounded-lg border border-[#E5E7EB] bg-white p-4">
          {lowStockVariants.length === 0 ? (
            <li className="text-[14px] text-[#6B7280]">No low-stock variants.</li>
          ) : (
            lowStockVariants.map((v) => (
              <li
                key={v.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F3F4F6] py-2 last:border-0"
              >
                <span className="text-[14px] text-[#111111]">{v.product.name}</span>
                <span className="rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[11px] font-semibold uppercase text-[#92400E]">
                  Low Stock · {v.inventoryCount}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

function IconDollar({ className }: { className?: string }) {
  return (
    <svg className={className} width={24} height={24} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

function IconCart({ className }: { className?: string }) {
  return (
    <svg className={className} width={24} height={24} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.15.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  );
}

function IconBox({ className }: { className?: string }) {
  return (
    <svg className={className} width={24} height={24} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20 8h-3V4H7v4H4v11h16V8zM9 6h6v2H9V6zM6 17V10h12v7H6z" />
    </svg>
  );
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg className={className} width={24} height={24} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
}
