import { TRUST_BRANDS } from "@/lib/constants";

export function BrandStrip() {
  const line = TRUST_BRANDS.join(" · ");
  return (
    <section className="border-b border-grey-200 bg-white px-6 py-6">
      <p className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-center text-[13px] font-medium uppercase tracking-[0.08em] text-grey-300">
        {line}
      </p>
    </section>
  );
}
