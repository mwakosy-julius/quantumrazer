import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
});

export const RegisterSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "One uppercase required")
    .regex(/[0-9]/, "One number required"),
});

export const AddressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(2),
  postalCode: z.string().min(1).max(24),
  country: z.string().default("TZ"),
  phone: z.string().optional(),
});

export const CheckoutShippingSchema = AddressSchema.extend({
  email: z.string().email(),
});

export const AddToCartSchema = z.object({
  variantId: z.string().cuid(),
  quantity: z.number().int().min(1).max(10),
});

export const ReviewSchema = z.object({
  productId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  body: z.string().max(2000).optional(),
});

export const CheckoutSchema = z.object({
  shippingAddress: CheckoutShippingSchema,
  billingAddress: AddressSchema.optional(),
  sameAsBilling: z.boolean().default(true),
  shippingMethod: z.enum(["standard", "express", "next_day"]),
  paymentIntentId: z.string().min(1),
});

export const ProductFilterSchema = z.object({
  category: z.string().optional(),
  collection: z.string().optional(),
  gender: z.enum(["MENS", "WOMENS", "KIDS", "UNISEX"]).optional(),
  sport: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sizes: z.string().optional(),
  colors: z.string().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "popular"]).default("newest"),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(24),
  q: z.string().optional(),
  isNew: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
});

export type ProductFilters = z.infer<typeof ProductFilterSchema>;
