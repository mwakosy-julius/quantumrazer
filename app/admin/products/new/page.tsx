import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export default async function AdminNewProductPage() {
  const collections = await prisma.collection.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { handle: true, name: true },
  });

  return (
    <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <h1 className="mb-6 text-[24px] font-bold text-[#111111]">Add Product</h1>
      <ProductForm mode="create" collections={collections} />
    </div>
  );
}
