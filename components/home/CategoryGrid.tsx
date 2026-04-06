import Image from "next/image";
import Link from "next/link";

const cats = [
  { title: "Men", href: "/products?gender=MENS", image: "https://picsum.photos/seed/catmen/800/600", wide: true },
  { title: "Women", href: "/products?gender=WOMENS", image: "https://picsum.photos/seed/catwomen/600/600" },
  { title: "Kids", href: "/products?gender=KIDS", image: "https://picsum.photos/seed/catkids/500/500" },
  { title: "Sale", href: "/sale", image: "https://picsum.photos/seed/catsale/500/500" },
  { title: "Running", href: "/products?sport=Running", image: "https://picsum.photos/seed/catrun/500/500" },
];

export function CategoryGrid() {
  return (
    <section className="px-[var(--content-padding)] py-8">
      <div className="mx-auto grid max-w-content grid-cols-1 gap-4 md:grid-cols-5 md:grid-rows-2">
        <Link
          href={cats[0].href}
          className="group relative aspect-[4/3] overflow-hidden md:col-span-3 md:row-span-2"
        >
          <Image src={cats[0].image} alt="" fill className="object-cover transition-transform duration-slow group-hover:scale-[1.04]" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <p className="text-2xl font-black">{cats[0].title}</p>
            <span className="text-sm transition-transform group-hover:translate-x-1">Shop Men →</span>
          </div>
        </Link>
        {cats.slice(1).map((c) => (
          <Link key={c.title} href={c.href} className="group relative aspect-[4/3] overflow-hidden md:col-span-1">
            <Image src={c.image} alt="" fill className="object-cover transition-transform duration-slow group-hover:scale-[1.04]" />
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <p className="text-xl font-black">{c.title}</p>
              <span className="text-sm">Shop →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
