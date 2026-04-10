import Image from "next/image";
import Link from "next/link";

import { IMAGES, imgThumb } from "@/lib/images";

const row1 = [
  { title: "Gaming Laptops", href: "/products?sport=Gaming", image: IMAGES.lifestyle.gamer, large: true },
  { title: "Creator Laptops", href: "/products?is_featured=true", image: IMAGES.lifestyle.designer, large: false },
];

const row2 = [
  { title: "Laptop Bags", href: "/products?category=laptop-bags", image: IMAGES.bags.lifestyle },
  { title: "Accessories", href: "/products?category=accessories", image: IMAGES.lifestyle.developer },
  { title: "Gadgets", href: "/products?category=gadgets", image: IMAGES.lifestyle.photographer },
  { title: "Refurbished", href: "/products?collection=budget-picks", image: IMAGES.laptops.workspace },
];

function Card({
  title,
  href,
  image,
  className = "",
  minH = "min-h-[400px] md:min-h-[560px]",
}: {
  title: string;
  href: string;
  image: string;
  className?: string;
  minH?: string;
}) {
  return (
    <Link href={href} className={`group relative block overflow-hidden bg-grey-100 ${className} ${minH}`}>
      <Image
        src={imgThumb(image)}
        alt=""
        fill
        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
        sizes="(max-width:768px) 100vw, 40vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full p-6 text-white">
        <p className="mb-3 text-[22px] font-bold">{title}</p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-pill bg-white px-6 py-3 text-[14px] font-medium text-black transition-colors hover:bg-grey-100">
            Shop
          </span>
          <span className="inline-flex items-center rounded-pill bg-[rgba(0,0,0,0.5)] px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[rgba(0,0,0,0.7)]">
            Learn More
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CategoryGrid() {
  return (
    <section className="bg-white px-6 py-12 md:px-[var(--content-padding)]">
      <div className="mx-auto max-w-content">
        <h2 className="mb-6 text-[28px] font-bold text-black">Shop by Category</h2>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[58fr_42fr]">
            <Card {...row1[0]} />
            <Card {...row1[1]} minH="min-h-[400px] md:min-h-[560px]" />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
            {row2.map((c) => (
              <Card key={c.title} {...c} minH="min-h-[300px] md:min-h-[280px]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
