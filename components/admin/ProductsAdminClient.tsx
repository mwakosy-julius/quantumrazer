"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  bulkDeleteProductsAction,
  bulkSetFeaturedAction,
  bulkSetInactiveAction,
  deleteProductAction,
} from "@/actions/admin.actions";

export type AdminProductRow = {
  id: string;
  name: string;
  slug: string;
  categoryLabel: string;
  primaryImage: string | null;
  priceLabel: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
};

const filters = [
  { id: "all", label: "All" },
  { id: "laptops", label: "Laptops" },
  { id: "accessories", label: "Accessories" },
  { id: "bags", label: "Bags" },
  { id: "gadgets", label: "Gadgets" },
  { id: "featured", label: "Featured" },
  { id: "low", label: "Low Stock" },
] as const;

function buildHref(filter: string, q: string) {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  if (filter && filter !== "all") p.set("filter", filter);
  const qs = p.toString();
  return qs ? `/admin/products?${qs}` : "/admin/products";
}

export function ProductsAdminClient({
  products,
  q,
  activeFilter,
}: {
  products: AdminProductRow[];
  q: string;
  activeFilter: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const toggleAll = () => {
    if (selected.size === products.length) setSelected(new Set());
    else setSelected(new Set(products.map((p) => p.id)));
  };

  return (
    <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[24px] font-bold text-[#111111]">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-[#111111] px-5 py-2.5 text-[14px] font-semibold text-white"
        >
          + Add Product
        </Link>
      </div>

      <form method="get" className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-md gap-2">
          <input type="hidden" name="filter" value={activeFilter === "all" ? "" : activeFilter} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search products..."
            className="h-10 flex-1 rounded-md border border-[#E5E7EB] px-3 text-[14px] outline-none focus:border-[#111111]"
          />
          <button
            type="submit"
            className="rounded-md border border-[#E5E7EB] px-4 text-[14px] font-medium text-[#111111] hover:bg-[#F3F4F6]"
          >
            Search
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const href = buildHref(f.id === "all" ? "all" : f.id, q);
            const active = (f.id === "all" && (activeFilter === "all" || !activeFilter)) || f.id === activeFilter;
            return (
              <Link
                key={f.id}
                href={href}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium ${
                  active ? "border-[#111111] bg-[#111111] text-white" : "border-[#E5E7EB] text-[#374151]"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      </form>

      {selected.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-md border border-[#E5E7EB] bg-white px-4 py-3 text-[14px]">
          <span>{selected.size} products selected</span>
          <button
            type="button"
            className="rounded border border-[#FECACA] px-3 py-1 text-[13px] text-[#DC2626]"
            onClick={async () => {
              if (!confirm("Delete selected products without orders?")) return;
              const r = await bulkDeleteProductsAction({ ids: Array.from(selected) });
              if (r?.serverError) toast.error(r.serverError);
              else {
                toast.success("Bulk delete complete");
                setSelected(new Set());
                router.refresh();
              }
            }}
          >
            Delete Selected
          </button>
          <button
            type="button"
            className="rounded border border-[#E5E7EB] px-3 py-1 text-[13px]"
            onClick={async () => {
              await bulkSetFeaturedAction({ ids: Array.from(selected), featured: true });
              setSelected(new Set());
              router.refresh();
            }}
          >
            Mark as Featured
          </button>
          <button
            type="button"
            className="rounded border border-[#E5E7EB] px-3 py-1 text-[13px]"
            onClick={async () => {
              await bulkSetInactiveAction({ ids: Array.from(selected) });
              setSelected(new Set());
              router.refresh();
            }}
          >
            Mark as Inactive
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-[#E5E7EB] bg-white">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-[#E5E7EB]">
              <th className="px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={products.length > 0 && selected.size === products.length}
                  onChange={toggleAll}
                />
              </th>
              {["Image", "Name", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-[13px] font-medium uppercase tracking-[0.04em] text-[#6B7280]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                <td className="px-3 py-3">
                  <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} />
                </td>
                <td className="px-3 py-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded bg-[#F5F5F5]">
                    {p.primaryImage ? (
                      <Image src={p.primaryImage} alt="" fill className="object-contain" sizes="48px" />
                    ) : null}
                  </div>
                </td>
                <td className="px-3 py-3 text-[14px] font-medium text-[#111111]">{p.name}</td>
                <td className="px-3 py-3 text-[13px] text-[#6B7280]">{p.categoryLabel}</td>
                <td className="px-3 py-3 text-[14px] text-[#111111]">{p.priceLabel}</td>
                <td className="px-3 py-3 text-[14px]">
                  {p.stock === 0 ? (
                    <span className="text-[#DC2626]">Out of stock</span>
                  ) : p.stock <= 10 ? (
                    <span className="text-amber-700">⚠ {p.stock} in stock</span>
                  ) : (
                    <span className="text-[#059669]">{p.stock} in stock</span>
                  )}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      p.isActive ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#F3F4F6] text-[#6B7280]"
                    }`}
                  >
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="rounded border border-[#E5E7EB] px-2.5 py-1 text-[13px] text-[#111111] hover:bg-[#F3F4F6]"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="rounded border border-[#FECACA] px-2.5 py-1 text-[13px] text-[#DC2626] hover:bg-[#FEF2F2]"
                      onClick={async () => {
                        if (!confirm(`Delete ${p.name}?`)) return;
                        const r = await deleteProductAction({ id: p.id });
                        if (r?.serverError) toast.error(r.serverError);
                        else {
                          toast.success("Deleted");
                          router.refresh();
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
