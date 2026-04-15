export type Gender = "mens" | "womens" | "kids" | "unisex";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface UserPublic {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  is_admin: boolean;
}

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  brand: string;
  gender: Gender;
  sport: string | null;
  is_featured: boolean;
  is_new: boolean;
  category_slug: string | null;
  /** ISO-ish code: USD, TZS, TSH */
  currency: string;
  /** True when a variant has compare-at above current min price */
  is_on_sale: boolean;
  min_price: string | null;
  max_price: string | null;
  primary_image_url: string | null;
  secondary_image_url: string | null;
  avg_rating: number | null;
  review_count: number;
  /** Cheapest in-stock variant for quick-add */
  default_variant_id: string | null;
  /** One-line spec teaser for cards (e.g. RAM · storage hints) */
  spec_preview: string | null;
}

export interface ProductVariant {
  id: string;
  sku: string;
  color_name: string;
  color_hex: string | null;
  size: string;
  price: string;
  compare_at_price: string | null;
  inventory_count: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  variant_id: string | null;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  brand: string;
  gender: Gender;
  sport: string | null;
  is_featured: boolean;
  is_new: boolean;
  category_slug: string | null;
  currency: string;
  variants: ProductVariant[];
  images: ProductImage[];
  avg_rating: number | null;
  review_count: number;
  related: ProductSummary[];
}

export interface ProductListResponse {
  products: ProductSummary[];
  total: number;
  page: number;
  pages: number;
}

export interface CollectionSummary {
  id: string;
  name: string;
  handle: string;
  image_url: string | null;
  product_count: number;
}

export interface CollectionDetailResponse {
  collection: CollectionSummary;
  products: ProductSummary[];
  total: number;
  page: number;
  pages: number;
}

export interface CartLine {
  item_id: string;
  variant_id: string;
  quantity: number;
  product_name: string;
  product_slug: string;
  sku: string;
  color_name: string;
  size: string;
  unit_price: string;
  line_total: string;
  image_url: string | null;
  inventory_count: number;
}

export interface CartResponse {
  items: CartLine[];
  subtotal: string;
  estimated_tax: string;
  item_count: number;
}

export interface SearchHit {
  id: string;
  name: string;
  slug: string;
  brand: string;
  primary_image_url: string | null;
}

export interface SearchResponse {
  results: SearchHit[];
  total: number;
  suggestions: string[];
}

export interface OrderSummary {
  id: string;
  order_number: string;
  status: OrderStatus;
  total: string | null;
  created_at: string;
}

export interface OrderListResponse {
  orders: OrderSummary[];
  total: number;
  page: number;
  pages: number;
}
