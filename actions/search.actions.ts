"use server";

import { prisma } from "@/lib/prisma";

export async function getSearchSuggestionsQuery(q: string): Promise<string[]> {
  const term = q.trim();
  if (term.length < 2) return [];
  const rows = await prisma.product.findMany({
    where: { isActive: true, name: { contains: term, mode: "insensitive" } },
    take: 6,
    select: { name: true },
  });
  return rows.map((r) => r.name);
}
