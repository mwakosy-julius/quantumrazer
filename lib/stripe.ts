import Stripe from "stripe";

let cached: Stripe | null | undefined;

/** Lazy init so `new Stripe()` never runs at module load (avoids build-time failures on Vercel when env is missing or bundling misbehaves). */
export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    cached = null;
    return null;
  }
  try {
    cached = new Stripe(key, { typescript: true });
  } catch {
    cached = null;
  }
  return cached;
}

export function requireStripe(): Stripe {
  const client = getStripe();
  if (!client) throw new Error("Stripe is not configured");
  return client;
}
