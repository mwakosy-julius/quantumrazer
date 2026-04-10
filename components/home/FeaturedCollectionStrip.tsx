import Image from "next/image";
import Link from "next/link";

import { IMAGES, imgThumb } from "@/lib/images";

const cards = [
  { title: "MacBook Pro", href: "/products/macbook-pro-16-m3-max", src: IMAGES.laptops.macbookPro },
  { title: "ASUS ROG", href: "/products/asus-rog-zephyrus-g16", src: IMAGES.laptops.asusRog },
  { title: "Keyboards", href: "/products?category=accessories", src: IMAGES.accessories.keyboard },
  { title: "Backpacks", href: "/products?category=laptop-bags", src: IMAGES.bags.backpackBlack },
] as const;

export function FeaturedCollectionStrip() {
  return (
    <section className="bg-white px-6 py-8 md:px-[var(--content-padding)]">
      <div className="mx-auto grid max-w-content grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group relative aspect-square overflow-hidden bg-grey-100"
          >
            <Image
              src={imgThumb(c.src)}
              alt=""
              fill
              className="object-contain transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
              sizes="(max-width:768px) 50vw, 25vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3">
              <p className="text-[14px] font-semibold text-white">{c.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
