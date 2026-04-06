import Link from "next/link";
import { redirect } from "next/navigation";

import { ProductGrid } from "@/components/product/ProductGrid";
import { auth } from "@/lib/auth";
import { mapProductListRowToSummary } from "@/lib/mappers/product";
import { prisma } from "@/lib/prisma";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account/wishlist");

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          images: { orderBy: { displayOrder: "asc" }, take: 2 },
          variants: { take: 8, orderBy: { price: "asc" } },
          reviews: { select: { rating: true } },
          category: { select: { slug: true } },
        },
      },
    },
  });

  const summaries = items.map((w) => mapProductListRowToSummary(w.product));

  return (
    <div>
      <h1 className="text-2xl font-black">Wishlist</h1>
      {summaries.length === 0 ? (
        <p className="mt-6 text-grey-500">
          Nothing saved yet.{" "}
          <Link href="/products" className="underline">
            Browse products
          </Link>
        </p>
      ) : (
        <div className="mt-8">
          <ProductGrid products={summaries} />
        </div>
      )}
    </div>
  );
}
