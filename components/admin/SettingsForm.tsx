"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { saveSiteSettingsAction } from "@/actions/admin.actions";
import { FREE_SHIPPING_MIN_SUBTOTAL, STORE_CURRENCY } from "@/lib/currency";

const inputClass =
  "mt-1 h-10 w-full max-w-md rounded-md border border-[#E5E7EB] px-3 text-[14px] outline-none focus:border-[#111111]";

export function SettingsForm() {
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="space-y-8"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setBusy(true);
        const r = await saveSiteSettingsAction({
          storeName: String(fd.get("storeName") ?? ""),
          contactEmail: String(fd.get("contactEmail") ?? ""),
          currency: String(fd.get("currency") ?? STORE_CURRENCY),
          freeShippingThreshold: Number(fd.get("freeShippingThreshold") ?? FREE_SHIPPING_MIN_SUBTOTAL),
          notifyNewOrder: fd.get("notifyNewOrder") === "on",
          notifyLowStock: fd.get("notifyLowStock") === "on",
          lowStockThreshold: Number(fd.get("lowStockThreshold") ?? 5),
        });
        setBusy(false);
        if (r?.serverError) toast.error(r.serverError);
        else toast.success("Settings saved (demo — wire to DB or env as needed)");
      }}
    >
      <section className="rounded-lg border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-[16px] font-semibold text-[#111111]">Store Settings</h2>
        <div className="mt-4 space-y-4">
          <label className="block text-[13px] font-medium text-[#374151]">
            Store name
            <input name="storeName" className={inputClass} defaultValue="Quantum Razer" />
          </label>
          <label className="block text-[13px] font-medium text-[#374151]">
            Contact email
            <input name="contactEmail" type="email" className={inputClass} defaultValue="support@quantumrazer.com" />
          </label>
          <label className="block text-[13px] font-medium text-[#374151]">
            Currency
            <input name="currency" className={inputClass} defaultValue={STORE_CURRENCY} />
          </label>
          <label className="block text-[13px] font-medium text-[#374151]">
            Free shipping threshold (TZS)
            <input
              name="freeShippingThreshold"
              type="number"
              className={inputClass}
              defaultValue={FREE_SHIPPING_MIN_SUBTOTAL}
            />
          </label>
        </div>
      </section>

      <section className="rounded-lg border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-[16px] font-semibold text-[#111111]">Notifications</h2>
        <div className="mt-4 space-y-3 text-[14px]">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="notifyNewOrder" defaultChecked className="h-4 w-4" />
            Email on new order (Inngest / Resend)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="notifyLowStock" className="h-4 w-4" />
            Email on low stock alert
          </label>
          <label className="block text-[13px] font-medium text-[#374151]">
            Low stock threshold
            <input name="lowStockThreshold" type="number" className={inputClass} defaultValue={5} />
          </label>
        </div>
      </section>

      <button
        type="submit"
        disabled={busy}
        className="rounded-md bg-[#111111] px-6 py-2.5 text-[14px] font-semibold text-white"
      >
        Save settings
      </button>
    </form>
  );
}
