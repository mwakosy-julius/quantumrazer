"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { createProductAction, updateProductAction } from "@/actions/admin.actions";
import { ProductCard } from "@/components/product/ProductCard";
import { getAllImageLibraryUrls } from "@/lib/images";
import type { ProductSummary } from "@/types";

const BRANDS = [
  "Apple",
  "ASUS",
  "Razer",
  "Dell",
  "Lenovo",
  "Samsung",
  "Sony",
  "Logitech",
  "Incase",
  "Bellroy",
  "Peak Design",
  "Thule",
  "Everki",
  "Waterfield",
  "Twelve South",
  "CalDigit",
  "PlayStation",
  "Other",
] as const;

const CATEGORIES = [
  { slug: "laptops", label: "Laptops" },
  { slug: "accessories", label: "Accessories" },
  { slug: "laptop-bags", label: "Bags" },
  { slug: "gadgets", label: "Gadgets" },
] as const;

type CollectionOpt = { handle: string; name: string };

type InitialProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  brand: string;
  gender: "MENS" | "WOMENS" | "KIDS" | "UNISEX";
  sport: string | null;
  isFeatured: boolean;
  isNew: boolean;
  isActive: boolean;
  categorySlug: string;
  collectionHandle: string | null;
  price: number;
  compareAtPrice: number | null;
  skuPrefix: string;
  inventoryCount: number;
  weightGrams: number | null;
  variants: { colorName: string; colorHex: string | null; size: string }[];
  images: { url: string; isPrimary: boolean }[];
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const inputClass =
  "h-10 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-[14px] text-[#111111] outline-none focus:border-[#111111] focus:ring-[3px] focus:ring-[rgba(17,17,17,0.08)]";
const labelClass = "mb-1.5 block text-[13px] font-medium text-[#374151]";

export function ProductForm({
  mode,
  initial,
  collections,
}: {
  mode: "create" | "edit";
  initial?: InitialProduct;
  collections: CollectionOpt[];
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [brand, setBrand] = useState(initial?.brand ?? "Apple");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [gender, setGender] = useState<InitialProduct["gender"]>(initial?.gender ?? "UNISEX");
  const [sport, setSport] = useState(initial?.sport ?? "");
  const [categorySlug, setCategorySlug] = useState(initial?.categorySlug ?? "laptops");
  const [collectionHandle, setCollectionHandle] = useState(initial?.collectionHandle ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [compareAt, setCompareAt] = useState(initial?.compareAtPrice != null ? String(initial.compareAtPrice) : "");
  const [skuPrefix, setSkuPrefix] = useState(
    initial?.skuPrefix ?? `QR-${Date.now().toString(36).toUpperCase()}`,
  );
  const [inventoryCount, setInventoryCount] = useState(String(initial?.inventoryCount ?? 0));
  const [weightGrams, setWeightGrams] = useState(initial?.weightGrams != null ? String(initial.weightGrams) : "");
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [isNew, setIsNew] = useState(initial?.isNew ?? false);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [variants, setVariants] = useState(
    initial?.variants?.length
      ? initial.variants
      : [{ colorName: "Space Black", colorHex: "#1a1a1a", size: '16-inch' }],
  );
  const [images, setImages] = useState<{ url: string }[]>(
    initial?.images?.length ? initial.images.map((i) => ({ url: i.url })) : [],
  );
  const [newImageUrl, setNewImageUrl] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugTouched && mode === "create") {
      setSlug(slugify(name));
    }
  }, [name, slugTouched, mode]);

  const previewSummary: ProductSummary = useMemo(() => {
    const minP = price ? Number.parseFloat(price) : null;
    const maxP = compareAt ? Number.parseFloat(compareAt) : null;
    const gMap: Record<string, ProductSummary["gender"]> = {
      MENS: "mens",
      WOMENS: "womens",
      KIDS: "kids",
      UNISEX: "unisex",
    };
    return {
      id: "preview",
      name: name || "Product name",
      slug: slug || "preview",
      brand: brand || "Brand",
      gender: gMap[gender] ?? "unisex",
      sport: sport || null,
      is_featured: isFeatured,
      is_new: isNew,
      category_slug: categorySlug,
      min_price: minP != null && !Number.isNaN(minP) ? minP.toFixed(2) : null,
      max_price:
        maxP != null && minP != null && !Number.isNaN(maxP) && maxP > minP ? maxP.toFixed(2) : null,
      primary_image_url: images[0]?.url ?? null,
      secondary_image_url: images[1]?.url ?? null,
      avg_rating: null,
      review_count: 0,
      default_variant_id: null,
      spec_preview: variants[0] ? `${variants[0].size} · ${variants.length} variant(s)` : null,
    };
  }, [name, slug, brand, gender, sport, categorySlug, price, compareAt, isFeatured, isNew, images, variants]);

  const addImageUrl = (url: string) => {
    const u = url.trim();
    if (!u) return;
    if (images.length >= 8) {
      toast.error("Maximum 8 images");
      return;
    }
    setImages((prev) => [...prev, { url: u }]);
    setNewImageUrl("");
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      if (typeof r === "string") addImageUrl(r);
    };
    reader.readAsDataURL(f);
    e.target.value = "";
  };

  const submit = async (publish: boolean) => {
    setError(null);
    setBusy(true);
    const base = {
      name,
      slug,
      brand,
      description,
      gender,
      sport: sport.trim() || null,
      price: Number.parseFloat(price),
      compareAtPrice: compareAt.trim() ? Number.parseFloat(compareAt) : null,
      skuPrefix,
      inventoryCount: Number.parseInt(inventoryCount, 10) || 0,
      weightGrams: weightGrams.trim() ? Number.parseInt(weightGrams, 10) : null,
      categorySlug: categorySlug as "laptops" | "accessories" | "laptop-bags" | "gadgets",
      collectionHandle: collectionHandle.trim() || null,
      isFeatured,
      isNew,
      isActive: publish ? isActive : false,
      variants: variants.map((v) => ({
        colorName: v.colorName,
        colorHex: v.colorHex || null,
        size: v.size,
      })),
      images: images.map((im, i) => ({ url: im.url, isPrimary: i === 0 })),
    };

    const res =
      mode === "create"
        ? await createProductAction(base)
        : initial
          ? await updateProductAction({ ...base, id: initial.id })
          : null;
    if (!res) {
      setBusy(false);
      return;
    }

    setBusy(false);
    if (res?.serverError) {
      setError(res.serverError);
      toast.error(res.serverError);
      return;
    }
    toast.success(publish ? "Product published ✓" : "Draft saved");
    router.push("/admin/products");
    router.refresh();
  };

  const library = getAllImageLibraryUrls();

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="flex-1 space-y-5 lg:max-w-[65%]">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-800">
            {error}
          </div>
        )}

        <section className="rounded-lg border border-[#E5E7EB] bg-white p-6">
          <h2 className="mb-5 border-b border-[#E5E7EB] pb-2 text-[16px] font-semibold text-[#111111]">
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Product Name *</label>
              <input
                className={`${inputClass} h-11`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='e.g. MacBook Pro 16" M3 Max'
              />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <div className="flex rounded-md border border-[#E5E7EB] bg-white focus-within:border-[#111111] focus-within:ring-[3px] focus-within:ring-[rgba(17,17,17,0.08)]">
                <span className="flex items-center border-r border-[#E5E7EB] bg-[#F9FAFB] px-3 text-[12px] text-[#6B7280]">
                  quantumrazer.com/products/
                </span>
                <input
                  className="h-11 flex-1 border-0 bg-transparent px-3 text-[14px] outline-none"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Brand *</label>
              <select className={inputClass} value={brand} onChange={(e) => setBrand(e.target.value)}>
                {BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                className={`${inputClass} min-h-[120px] resize-y py-2`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the product for creators..."
                maxLength={5000}
              />
              <p className="mt-1 text-right text-[13px] text-[#6B7280]">
                {description.length} / 5000
              </p>
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <div className="flex flex-wrap gap-2">
                {(["UNISEX", "MENS", "WOMENS", "KIDS"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`rounded-full border px-4 py-2 text-[13px] font-medium ${
                      gender === g
                        ? "border-[#111111] bg-[#111111] text-white"
                        : "border-[#E5E7EB] text-[#374151]"
                    }`}
                  >
                    {g === "MENS" ? "Men's" : g === "WOMENS" ? "Women's" : g === "KIDS" ? "Kids" : "Unisex"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-[#E5E7EB] bg-white p-6">
          <h2 className="mb-5 border-b border-[#E5E7EB] pb-2 text-[16px] font-semibold text-[#111111]">
            Pricing & Inventory
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Price ($) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#6B7280]">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={`${inputClass} pl-7`}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Compare At ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#6B7280]">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={`${inputClass} pl-7`}
                  value={compareAt}
                  onChange={(e) => setCompareAt(e.target.value)}
                />
              </div>
              <p className="mt-1 text-[12px] text-[#6B7280]">Leave empty if not on sale</p>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>SKU prefix *</label>
              <div className="flex gap-2">
                <input className={inputClass} value={skuPrefix} onChange={(e) => setSkuPrefix(e.target.value)} />
                <button
                  type="button"
                  className="shrink-0 rounded-md border border-[#E5E7EB] px-4 text-[13px] font-medium text-[#111111] hover:bg-[#F3F4F6]"
                  onClick={() => setSkuPrefix(`QR-${Date.now().toString(36).toUpperCase()}`)}
                >
                  Regenerate
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Inventory *</label>
              <input
                type="number"
                min={0}
                step={1}
                className={inputClass}
                value={inventoryCount}
                onChange={(e) => setInventoryCount(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Weight (grams)</label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={weightGrams}
                onChange={(e) => setWeightGrams(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-[#E5E7EB] bg-white p-6">
          <h2 className="mb-5 border-b border-[#E5E7EB] pb-2 text-[16px] font-semibold text-[#111111]">
            Category & Organization
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Category *</label>
              <select
                className={inputClass}
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Sub-category / tags (sport field)</label>
              <input
                className={inputClass}
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                placeholder="gaming, content-creation"
              />
            </div>
            <div>
              <label className={labelClass}>Collection</label>
              <select
                className={inputClass}
                value={collectionHandle}
                onChange={(e) => setCollectionHandle(e.target.value)}
              >
                <option value="">None</option>
                {collections.map((c) => (
                  <option key={c.handle} value={c.handle}>
                    {c.name}
                </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#374151]">Featured product</span>
                <Switch.Root
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                  className="h-6 w-10 rounded-full bg-[#E5E7EB] data-[state=checked]:bg-[#111111]"
                >
                  <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-[18px]" />
                </Switch.Root>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#374151]">New arrival</span>
                <Switch.Root
                  checked={isNew}
                  onCheckedChange={setIsNew}
                  className="h-6 w-10 rounded-full bg-[#E5E7EB] data-[state=checked]:bg-[#111111]"
                >
                  <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-[18px]" />
                </Switch.Root>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#374151]">Active (visible)</span>
                <Switch.Root
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  className="h-6 w-10 rounded-full bg-[#E5E7EB] data-[state=checked]:bg-[#111111]"
                >
                  <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-[18px]" />
                </Switch.Root>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-[#E5E7EB] bg-white p-6">
          <h2 className="mb-4 text-[16px] font-semibold text-[#111111]">Colour Variants</h2>
          <div className="space-y-4">
            {variants.map((v, i) => (
              <div key={i} className="relative rounded-md border border-[#E5E7EB] p-4">
                {variants.length > 1 && (
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-[18px] text-[#6B7280] hover:text-[#111111]"
                    onClick={() => setVariants((prev) => prev.filter((_, j) => j !== i))}
                    aria-label="Remove variant"
                  >
                    ×
                  </button>
                )}
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className={labelClass}>Color Name *</label>
                    <input
                      className={inputClass}
                      value={v.colorName}
                      onChange={(e) => {
                        const nv = [...variants];
                        nv[i] = { ...nv[i], colorName: e.target.value };
                        setVariants(nv);
                      }}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        className="h-10 w-14 cursor-pointer rounded border border-[#E5E7EB]"
                        value={v.colorHex?.startsWith("#") ? v.colorHex : "#111111"}
                        onChange={(e) => {
                          const nv = [...variants];
                          nv[i] = { ...nv[i], colorHex: e.target.value };
                          setVariants(nv);
                        }}
                      />
                      <input
                        className={inputClass}
                        value={v.colorHex ?? ""}
                        onChange={(e) => {
                          const nv = [...variants];
                          nv[i] = { ...nv[i], colorHex: e.target.value || null };
                          setVariants(nv);
                        }}
                        placeholder="#1a1a1a"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Size / Config *</label>
                    <input
                      className={inputClass}
                      value={v.size}
                      onChange={(e) => {
                        const nv = [...variants];
                        nv[i] = { ...nv[i], size: e.target.value };
                        setVariants(nv);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              disabled={variants.length >= 6}
              className="text-[14px] font-medium text-[#111111] underline disabled:opacity-40"
              onClick={() =>
                setVariants((prev) => [...prev, { colorName: "", colorHex: "#111111", size: "" }])
              }
            >
              + Add Another Colour Variant
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-[#E5E7EB] bg-white p-6">
          <h2 className="mb-4 text-[16px] font-semibold text-[#111111]">Product Images</h2>
          <div className="flex flex-wrap gap-2">
            <input
              className={inputClass}
              placeholder="Paste image URL (Unsplash, CDN…)"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
            <button
              type="button"
              className="rounded-md bg-[#111111] px-4 py-2 text-[14px] font-semibold text-white"
              onClick={() => addImageUrl(newImageUrl)}
            >
              Add Image
            </button>
            <label className="flex cursor-pointer items-center text-[14px] text-[#6B7280] underline">
              or upload from device
              <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={onFile} />
            </label>
            <button
              type="button"
              className="text-[14px] font-medium text-[#111111] underline"
              onClick={() => setLibraryOpen(true)}
            >
              Browse Image Library
            </button>
          </div>
          <p className="mt-2 text-[12px] text-[#9CA3AF]">
            Base64 uploads are stored in the DB URL field; replace with S3/Cloudinary in production.
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {images.map((im, i) => (
              <li key={`${im.url.slice(0, 40)}-${i}`} className="relative">
                <div className="relative h-20 w-20 overflow-hidden rounded border border-[#E5E7EB] bg-[#F5F5F5]">
                  {im.url.startsWith("http") || im.url.startsWith("data:") ? (
                    <Image src={im.url} alt="" fill className="object-cover" unoptimized={im.url.startsWith("data:")} />
                  ) : null}
                </div>
                <button
                  type="button"
                  className="mt-1 text-[12px] text-red-600"
                  onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                >
                  Remove
                </button>
                {i > 0 && (
                  <button
                    type="button"
                    className="ml-2 text-[12px] text-[#111111]"
                    onClick={() =>
                      setImages((prev) => {
                        const n = [...prev];
                        [n[i - 1], n[i]] = [n[i], n[i - 1]];
                        return n;
                      })
                    }
                  >
                    Up
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        <Dialog.Root open={libraryOpen} onOpenChange={setLibraryOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[min(900px,90vw)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
              <Dialog.Title className="text-lg font-semibold text-[#111111]">Image library</Dialog.Title>
              <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                {library.map((item) => (
                  <button
                    key={`${item.category}-${item.key}`}
                    type="button"
                    className="relative aspect-square overflow-hidden rounded border border-[#E5E7EB] bg-[#F5F5F5]"
                    onClick={() => {
                      addImageUrl(item.url);
                      setLibraryOpen(false);
                    }}
                  >
                    <Image src={item.url} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
              <Dialog.Close className="mt-4 text-[14px] text-[#6B7280] underline">Close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <div className="sticky bottom-0 z-10 flex flex-wrap justify-end gap-3 border-t border-[#E5E7EB] bg-white py-4">
          <button
            type="button"
            disabled={busy}
            className="rounded-md border border-[#E5E7EB] px-5 py-2.5 text-[14px] font-semibold text-[#111111] hover:bg-[#F3F4F6]"
            onClick={() => submit(false)}
          >
            Save as Draft
          </button>
          <button
            type="button"
            disabled={busy}
            className="rounded-md bg-[#111111] px-5 py-2.5 text-[14px] font-semibold text-white hover:opacity-90"
            onClick={() => submit(true)}
          >
            Publish Product
          </button>
        </div>
      </div>

      <div className="w-full shrink-0 lg:w-[35%]">
        <p className="mb-3 text-[13px] font-medium text-[#6B7280]">Preview</p>
        <div className="rounded-lg border border-[#E5E7EB] bg-[#F8F9FA] p-4">
          <ProductCard product={previewSummary} />
        </div>
        <p className="mt-4 text-[13px] text-[#6B7280]">
          PDP Preview →{" "}
          <Link href={slug ? `/products/${slug}` : "#"} className={!slug ? "pointer-events-none opacity-40" : "underline"}>
            /products/{slug || "…"}
          </Link>
        </p>
      </div>
    </div>
  );
}
