import { ProductFilterSchema, type ProductFilters } from "@/lib/validations";

const defaults = { page: 1, limit: 24, sort: "newest" as const };

export function parseProductFilters(
  searchParams: Record<string, string | string[] | undefined>,
): ProductFilters {
  const qp = (key: string): string | undefined => {
    const v = searchParams[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const gr = qp("gender")?.toLowerCase();
  const gender =
    gr === "mens" || gr === "men"
      ? ("MENS" as const)
      : gr === "womens" || gr === "women"
        ? ("WOMENS" as const)
        : gr === "kids"
          ? ("KIDS" as const)
          : gr === "unisex"
            ? ("UNISEX" as const)
            : (qp("gender") as ProductFilters["gender"]) ?? undefined;

  const parsed = ProductFilterSchema.safeParse({
    category: qp("category"),
    collection: qp("collection"),
    gender,
    sport: qp("sport"),
    minPrice: qp("minPrice"),
    maxPrice: qp("maxPrice"),
    sizes: qp("sizes"),
    colors: qp("colors"),
    sort: qp("sort"),
    page: qp("page"),
    limit: qp("limit"),
    q: qp("q"),
    isNew: qp("is_new") === "true" ? true : qp("is_new") === "false" ? false : undefined,
    isFeatured: qp("is_featured") === "true" ? true : undefined,
  });

  if (!parsed.success) {
    return ProductFilterSchema.parse(defaults);
  }
  return parsed.data;
}
