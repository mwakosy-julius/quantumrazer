import Image from "next/image";
import Link from "next/link";

type Props = {
  imageSrc: string;
  headline: string;
  sub?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  variant?: "center" | "bottom";
};

export function FullWidthPromo({
  imageSrc,
  headline,
  sub,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  variant = "center",
}: Props) {
  const inner =
    variant === "center" ? (
      <div className="flex max-w-[600px] flex-col items-center text-center">
        <h2 className="text-[clamp(28px,4vw,52px)] font-bold leading-tight text-white">{headline}</h2>
        {sub && <p className="mt-3 text-[18px] text-white/90">{sub}</p>}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center rounded-pill bg-white px-8 py-4 text-[16px] font-medium tracking-[0.02em] text-black transition-colors duration-200 hover:bg-[rgba(255,255,255,0.85)]"
          >
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-pill bg-[rgba(0,0,0,0.5)] px-8 py-4 text-[16px] font-medium tracking-[0.02em] text-white transition-colors duration-200 hover:bg-[rgba(0,0,0,0.7)]"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    ) : (
      <div className="mx-auto w-full max-w-content">
        <h2 className="max-w-[600px] text-[clamp(28px,4vw,52px)] font-bold leading-tight text-white">{headline}</h2>
        {sub && <p className="mt-3 max-w-[500px] text-[18px] text-white/90">{sub}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center rounded-pill bg-white px-8 py-4 text-[16px] font-medium tracking-[0.02em] text-black transition-colors duration-200 hover:bg-[rgba(255,255,255,0.85)]"
          >
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-pill bg-[rgba(0,0,0,0.5)] px-8 py-4 text-[16px] font-medium tracking-[0.02em] text-white transition-colors duration-200 hover:bg-[rgba(0,0,0,0.7)]"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    );

  return (
    <section className="relative w-full bg-black">
      <div className="relative h-[min(45vw,480px)] min-h-[280px] w-full md:min-h-[360px]">
        <Image src={imageSrc} alt="" fill className="object-cover" sizes="100vw" priority={false} />
      </div>
      <div
        className={`absolute inset-0 flex px-6 py-12 md:px-12 ${
          variant === "center" ? "items-center justify-center" : "items-end bg-gradient-to-t from-black/55 to-transparent pb-12"
        }`}
      >
        {inner}
      </div>
    </section>
  );
}
