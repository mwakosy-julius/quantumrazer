export type SerializedFeaturedProduct = {
  slug: string;
  name: string;
  description: string | null;
  categoryName: string | null;
  imageUrl: string | null;
  minPrice: string;
  compareAtPrice: string | null;
};
