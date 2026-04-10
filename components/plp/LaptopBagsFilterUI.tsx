"use client";

/**
 * Presentational filters for laptop bags (visual only — backend filters unchanged).
 */
export function LaptopBagsFilterUI() {
  const chips = ["11\"", "13\"", "14\"", "15\"", "16\"", "17\"+"];
  const types = ["Backpack", "Sleeve/Case", "Messenger", "Rolling", "Hard Shell", "Tote"];
  const materials = ["Nylon", "Canvas", "Leather", "Recycled", "Hard Shell"];

  return (
    <div className="mb-8 rounded-brand border border-grey-200 bg-grey-100/50 p-6">
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-black" style={{ fontFamily: "var(--font-body)" }}>
        Fits laptop size
      </p>
      <div className="mb-6 flex flex-wrap gap-2">
        {chips.map((c) => (
          <span
            key={c}
            className="cursor-default rounded-pill border border-grey-200 bg-white px-3 py-1.5 text-[13px] text-grey-500"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {c}
          </span>
        ))}
      </div>
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-black" style={{ fontFamily: "var(--font-body)" }}>
        Bag type
      </p>
      <ul className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {types.map((t) => (
          <li key={t} className="flex items-center gap-2 text-[14px] text-grey-500" style={{ fontFamily: "var(--font-body)" }}>
            <span className="h-4 w-4 rounded-sm border border-grey-300" aria-hidden />
            {t}
          </li>
        ))}
      </ul>
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-black" style={{ fontFamily: "var(--font-body)" }}>
        Material
      </p>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {materials.map((m) => (
          <li key={m} className="flex items-center gap-2 text-[14px] text-grey-500" style={{ fontFamily: "var(--font-body)" }}>
            <span className="h-4 w-4 rounded-sm border border-grey-300" aria-hidden />
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}
