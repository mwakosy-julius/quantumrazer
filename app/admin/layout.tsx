import { Toaster } from "react-hot-toast";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const email = session?.user?.email ?? "";

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <AdminSidebar email={email} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: { borderLeft: "4px solid #059669", background: "#fff" },
          error: { style: { borderLeft: "4px solid #DC2626", background: "#fff" } },
        }}
      />
    </div>
  );
}
