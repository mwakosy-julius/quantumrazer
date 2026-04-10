"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { toggleUserAdminAction } from "@/actions/admin.actions";

export function ToggleAdminButton({ userId, isAdmin }: { userId: string; isAdmin: boolean }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-[13px] text-[#6B7280] underline"
      onClick={async () => {
        const r = await toggleUserAdminAction({ userId });
        if (r?.serverError) toast.error(r.serverError);
        else {
          toast.success(isAdmin ? "Admin removed" : "Granted admin");
          router.refresh();
        }
      }}
    >
      Toggle Admin
    </button>
  );
}
