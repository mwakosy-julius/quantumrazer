import Link from "next/link";

import { ToggleAdminButton } from "@/components/admin/ToggleAdminButton";
import { formatMoney } from "@/lib/currency";
import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      _count: { select: { orders: true } },
    },
  });

  const userIds = users.map((u) => u.id);
  const sums =
    userIds.length === 0
      ? []
      : await prisma.order.groupBy({
          by: ["userId"],
          where: { userId: { in: userIds } },
          _sum: { total: true },
        });
  const spentMap = Object.fromEntries(
    sums.filter((s) => s.userId).map((s) => [s.userId as string, Number(s._sum.total ?? 0)]),
  );

  const rows = users.map((u) => ({
    ...u,
    spent: spentMap[u.id] ?? 0,
  }));

  return (
    <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <h1 className="mb-6 text-[24px] font-bold text-[#111111]">Customers</h1>
      <div className="overflow-x-auto rounded-lg border border-[#E5E7EB] bg-white">
        <table className="w-full min-w-[800px] border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b-2 border-[#E5E7EB] text-[13px] font-medium uppercase tracking-wide text-[#6B7280]">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Total Spent</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => {
              const initials = `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`.toUpperCase() || "?";
              return (
                <tr key={u.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-[12px] font-semibold text-[#111111]">
                        {initials}
                      </span>
                      <span>
                        {u.firstName} {u.lastName}
                        {u.isAdmin ? (
                          <span className="ml-2 rounded bg-[#111111] px-1.5 py-0.5 text-[10px] text-white">
                            Admin
                          </span>
                        ) : null}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u._count.orders}</td>
                  <td className="px-4 py-3">{formatMoney(u.spent)}</td>
                  <td className="px-4 py-3">{u.createdAt.toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders?q=${encodeURIComponent(u.email)}`}
                      className="mr-3 text-[#111111] underline"
                    >
                      View Orders
                    </Link>
                    <ToggleAdminButton userId={u.id} isAdmin={u.isAdmin} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
