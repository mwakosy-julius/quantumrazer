"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  archiveProductAction,
  deleteProductAction,
  duplicateProductAction,
} from "@/actions/admin.actions";

export function DangerZone({
  productId,
  productName,
  hasOrders,
}: {
  productId: string;
  productName: string;
  hasOrders: boolean;
}) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <section className="mt-10 rounded-lg border border-[#FECACA] bg-[#FFF5F5] p-5">
      <h2 className="text-[14px] font-semibold text-[#DC2626]">Danger Zone</h2>
      <div className="mt-4 space-y-4">
        <div className="flex flex-col gap-3 border-b border-[#FECACA] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[14px] font-medium text-[#111111]">Archive Product</p>
            <p className="text-[13px] text-[#6B7280]">This product will no longer appear in the store.</p>
          </div>
          <button
            type="button"
            disabled={busy}
            className="shrink-0 rounded-md border border-[#DC2626] bg-white px-4 py-2 text-[13px] font-semibold text-[#DC2626] hover:bg-[#FEF2F2]"
            onClick={async () => {
              if (!confirm("Archive this product?")) return;
              setBusy(true);
              const r = await archiveProductAction({ id: productId });
              setBusy(false);
              if (r?.serverError) toast.error(r.serverError);
              else {
                toast.success("Archived");
                router.refresh();
              }
            }}
          >
            Archive
          </button>
        </div>
        <div className="flex flex-col gap-3 border-b border-[#FECACA] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[14px] font-medium text-[#111111]">Duplicate Product</p>
            <p className="text-[13px] text-[#6B7280]">Creates a copy as inactive draft.</p>
          </div>
          <button
            type="button"
            disabled={busy}
            className="shrink-0 rounded-md border border-[#E5E7EB] bg-white px-4 py-2 text-[13px] font-semibold text-[#111111] hover:bg-[#F3F4F6]"
            onClick={async () => {
              setBusy(true);
              const r = await duplicateProductAction({ id: productId });
              setBusy(false);
              if (r?.serverError) toast.error(r.serverError);
              else {
                const copyId = (r?.data as { id?: string } | undefined)?.id;
                if (copyId) {
                  toast.success("Duplicated");
                  router.push(`/admin/products/${copyId}/edit`);
                }
              }
            }}
          >
            Duplicate
          </button>
        </div>
        <div>
          <p className="text-[14px] font-medium text-[#111111]">Delete Product</p>
          <p className="text-[13px] text-[#6B7280]">
            {hasOrders
              ? "Cannot delete products with existing orders. Archive instead."
              : "Permanently removes the product from the database."}
          </p>
          <button
            type="button"
            disabled={hasOrders || busy}
            title={hasOrders ? "Cannot delete products with existing orders" : undefined}
            className="mt-2 rounded-md bg-[#DC2626] px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setDeleteOpen(true)}
          >
            Delete Product
          </button>
        </div>
      </div>

      {deleteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-md rounded-lg bg-white p-6 shadow-xl">
            <p className="text-[16px] font-semibold text-[#111111]">
              Delete &quot;{productName}&quot;?
            </p>
            <p className="mt-2 text-[14px] text-[#6B7280]">Type DELETE to confirm.</p>
            <input
              className="mt-3 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[14px]"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-md border border-[#E5E7EB] px-4 py-2 text-[14px]"
                onClick={() => {
                  setDeleteOpen(false);
                  setDeleteConfirm("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirm !== "DELETE" || busy}
                className="rounded-md bg-[#DC2626] px-4 py-2 text-[14px] font-semibold text-white disabled:opacity-40"
                onClick={async () => {
                  setBusy(true);
                  const r = await deleteProductAction({ id: productId });
                  setBusy(false);
                  if (r?.serverError) toast.error(r.serverError);
                  else {
                    toast.success("Deleted");
                    router.push("/admin/products");
                  }
                }}
              >
                Confirm delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
