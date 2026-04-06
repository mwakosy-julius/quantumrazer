"use client";

import { motion } from "framer-motion";

import { ProductCard } from "@/components/product/ProductCard";
import type { ProductSummary } from "@/types";

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04 }}
        >
          <ProductCard product={p} />
        </motion.div>
      ))}
    </div>
  );
}
