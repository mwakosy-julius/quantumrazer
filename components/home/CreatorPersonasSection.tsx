import Image from "next/image";
import Link from "next/link";

import { IMAGES, imgThumb } from "@/lib/images";

const personas = [
  { label: "The Gamer", src: IMAGES.lifestyle.gamer, href: "/products?sport=Gaming" },
  { label: "The Designer", src: IMAGES.lifestyle.womanDesign, href: "/products?is_featured=true" },
  { label: "The Producer", src: IMAGES.lifestyle.producer, href: "/products?category=accessories" },
  { label: "The Skater", src: IMAGES.lifestyle.skater, href: "/products?category=gadgets" },
] as const;

export function CreatorPersonasSection() {
  return (
    <section className="bg-grey-100 px-6 py-12 md:px-[var(--content-padding)]">
      <div className="mx-auto max-w-content">
        <h2 className="mb-6 text-[28px] font-bold text-black">Built for how you work</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {personas.map((p) => (
            <Link
              key={p.label}
              href={p.href}
              className="group relative aspect-[4/5] overflow-hidden bg-black"
            >
              <Image
                src={imgThumb(p.src)}
                alt=""
                fill
                className="object-cover opacity-90 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.04]"
                sizes="(max-width:768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 text-[18px] font-bold text-white">{p.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
