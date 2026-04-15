/**
 * Store is priced and displayed in Tanzanian Shillings (TZS).
 * Stripe: TZS is zero-decimal — PaymentIntent `amount` is whole shillings.
 */

export const STORE_CURRENCY = "TZS";
export const STORE_CURRENCY_STRIPE = "tzs";
export const STORE_LOCALE = "en-TZ";
export const STORE_REGION_LABEL = "Tanzania";

/** VAT-style rate applied in cart/checkout (Tanzania VAT is 18%). */
export const STORE_TAX_RATE = 0.18;

/** Free standard shipping when subtotal meets this (TZS). */
export const FREE_SHIPPING_MIN_SUBTOTAL = 200_000;

/** Flat standard delivery when order is below the free-shipping minimum (TZS). */
export const SHIPPING_PAID_FLAT = 25_000;
export const SHIPPING_EXPRESS = 25_000;
export const SHIPPING_NEXT_DAY = 40_000;

/** Upper bound for PLP price range filter (TZS). */
export const PLP_PRICE_SLIDER_MAX = 12_000_000;

export function formatMoney(amount: number): string {
  const rounded = Math.round(amount);
  return new Intl.NumberFormat(STORE_LOCALE, {
    style: "currency",
    currency: STORE_CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rounded);
}

/**
 * Per-product display: TSh (Tanzanian shilling, written form), TZS (Intl), or USD.
 * Numeric `amount` is the major unit (whole shillings for TSH/TZS, dollars for USD).
 */
export function formatPrice(amount: number, currency: string = "USD"): string {
  const c = (currency || "USD").toUpperCase();
  if (c === "TSH") {
    return `TSh ${Math.round(amount).toLocaleString("en-TZ")}`;
  }
  if (c === "TZS") {
    return formatMoney(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Stripe PaymentIntent amount for the cart total (TZS, integer). */
export function stripeAmountFromTotal(total: number): number {
  return Math.round(total);
}

export function shippingCostForMethod(method: "standard" | "express" | "next_day", subtotal: number): number {
  if (method === "standard") {
    return subtotal >= FREE_SHIPPING_MIN_SUBTOTAL ? 0 : SHIPPING_PAID_FLAT;
  }
  if (method === "express") return SHIPPING_EXPRESS;
  return SHIPPING_NEXT_DAY;
}

export function estimatedStandardShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_MIN_SUBTOTAL ? 0 : SHIPPING_PAID_FLAT;
}
