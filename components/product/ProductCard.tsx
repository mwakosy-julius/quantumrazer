"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import type { ProductSummary } from "@/types";

export function ProductCard({ product }: { product: ProductSummary }) {
  const [hover, setHover] = useState(false);
  const sizes = ["9", "9.5", "10", "10.5", "11"];

  const sale =
    product.min_price &&
    product.max_price &&
    parseFloat(product.max_price) > parseFloat(product.min_price);

  return (
    <article
      className="group bg-white"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square bg-grey-100">
          {product.primary_image_url && (
            <Image
              src={product.primary_image_url}
              alt={product.name}
              fill
              className="object-contain p-[8%] transition-opacity duration-300"
              sizes="(max-width:768px) 50vw, 25vw"
            />
          )}
          {product.secondary_image_url && (
            <Image
              src={product.secondary_image_url}
              alt=""
              fill
              className={`object-contain p-[8%] transition-opacity duration-300 ${hover ? "opacity-100" : "opacity-0"} absolute inset-0`}
              sizes="(max-width:768px) 50vw, 25vw"
            />
          )}
          <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1">
            {product.is_new && <Badge>New</Badge>}
            {sale && <Badge variant="sale">Sale</Badge>}
          </div>
          <div
            className={`absolute bottom-0 left-0 right-0 flex translate-y-full flex-wrap gap-1 bg-white/90 p-2 transition-transform duration-300 group-hover:translate-y-0`}
          >
            {sizes.map((sz) => (
              <button
                key={sz}
                type="button"
                className="pointer-events-auto rounded-full border border-grey-200 px-2 py-1 text-[11px] hover:border-black"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
        <div className="pt-2">
          <h3 className="truncate text-[15px] font-medium text-black">{product.name}</h3>
          <p className="text-[14px] text-grey-500">{product.sport ?? product.gender}</p>
          <div className="mt-1 flex items-center justify-between text-[15px]">
            {sale && product.max_price ? (
              <>
                <span className="text-red-brand">${product.min_price}</span>
                <span className="text-grey-500 line-through">${product.max_price}</span>
              </>
            ) : (
              <span>${product.min_price ?? "—"}</span>
            )}
          </div>
          <StarRating product={product} />
        </div>
      </Link>
    </article>
  );
}
