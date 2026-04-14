"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { OrderStatus } from "@prisma/client";

import {
  issueRefundStubAction,
  sendOrderCustomerEmailAction,
  updateOrderStatusAction,
  updateOrderTrackingAction,
} from "@/actions/admin.actions";
import { formatMoney } from "@/lib/currency";

const STATUSES = Object.values(OrderStatus);

export function OrderDetailActions({
  orderId,
  orderNumber,
  currentStatus,
  trackingNumber,
  items,
}: {
  orderId: string;
  orderNumber: string;
  currentStatus: string;
  trackingNumber: string | null;
  items: {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: unknown;
    variant: { product: { images: { url: string }[] } };
  }[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [tracking, setTracking] = useState(trackingNumber ?? "");
  const [busy, setBusy] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-5">
        <h2 className="text-[16px] font-semibold text-[#111111]">Update status</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <select
            className="h-10 rounded-md border border-[#E5E7EB] px-3 text-[14px]"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={busy}
            className="h-10 rounded-md bg-[#111111] px-4 text-[14px] font-medium text-white"
            onClick={async () => {
              setBusy(true);
              const r = await updateOrderStatusAction({
                orderId,
                status: status as OrderStatus,
                trackingNumber: tracking.trim() || null,
              });
              setBusy(false);
              if (r?.serverError) toast.error(r.serverError);
              else {
                toast.success("Status updated");
                router.refresh();
              }
            }}
          >
            Save status
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-[#E5E7EB] bg-white p-5">
        <h2 className="text-[16px] font-semibold text-[#111111]">Tracking number</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            className="h-10 flex-1 min-w-[200px] rounded-md border border-[#E5E7EB] px-3 text-[14px]"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="Carrier tracking ID"
          />
          <button
            type="button"
            disabled={busy}
            className="h-10 rounded-md border border-[#E5E7EB] px-4 text-[14px]"
            onClick={async () => {
              if (!tracking.trim()) return;
              setBusy(true);
              const r = await updateOrderTrackingAction({ orderId, trackingNumber: tracking });
              setBusy(false);
              if (r?.serverError) toast.error(r.serverError);
              else toast.success("Tracking saved");
            }}
          >
            Save tracking
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-md border border-[#E5E7EB] px-4 py-2 text-[14px]"
          onClick={async () => {
            const r = await sendOrderCustomerEmailAction({ orderId });
            if (r?.serverError) toast.error(r.serverError);
            else toast.success(r?.data?.message ?? "Queued");
          }}
        >
          Send Customer Email
        </button>
        <button
          type="button"
          className="rounded-md border border-[#FECACA] px-4 py-2 text-[14px] text-[#DC2626]"
          onClick={async () => {
            const r = await issueRefundStubAction({ orderId });
            toast(
              (r?.data as { message?: string } | undefined)?.message ?? "Connect Stripe for live refunds",
            );
          }}
        >
          Issue Refund
        </button>
      </div>

      <div>
        <h2 className="mb-3 text-[16px] font-semibold text-[#111111]">Line items</h2>
        <ul className="space-y-3">
          {items.map((it) => {
            const img = it.variant.product.images[0]?.url;
            return (
              <li key={it.id} className="flex gap-3 rounded border border-[#F3F4F6] p-3">
                <div className="relative h-16 w-16 shrink-0 bg-[#F5F5F5]">
                  {img ? <Image src={img} alt="" fill className="object-contain" sizes="64px" /> : null}
                </div>
                <div>
                  <p className="font-medium text-[#111111]">{it.productName}</p>
                  <p className="text-[13px] text-[#6B7280]">
                    Qty {it.quantity} · {formatMoney(Number(it.unitPrice))} each
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="text-[13px] text-[#6B7280]">Order {orderNumber}</p>
    </div>
  );
}
