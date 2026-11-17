import { VIDEOS } from "./videos";

export type NarrativeId = "story" | "hoops" | "sound" | "office" | "studio" | "home";

export interface Narrative {
  id: NarrativeId;
  /** Optional clip; themes without one show the photo with a slow zoom. */
  heroVideo: string | null;
  heroPoster: string;
  headline: string[];
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaPrimaryHref: string;
  ctaSecondaryHref: string;
  eyebrow: string;
  featuredSlug: string;
  accentWord: number;
  /** Optional counters shown on the slide (they count up when it appears). */
  stats?: NarrativeStat[];
}

export interface NarrativeStat {
  value: number;
  /** Digits after the decimal point, e.g. 1 for "4.9". */
  decimals?: number;
  suffix: string;
  label: string;
}

export const NARRATIVES: Record<NarrativeId, Narrative> = {
  story: {
    id: "story",
    heroVideo: null,
    heroPoster: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&q=85&fit=crop",
    headline: ["Quantum Razer.", "For your photos,", "shows & studies."],
    subheadline:
      "We help families, students and creators find laptops and gear that are easy to use and nice to look at, without the jargon.",
    ctaPrimary: "Shop All Products",
    ctaSecondary: "Contact Us",
    ctaPrimaryHref: "/products",
    ctaSecondaryHref: "/help",
    eyebrow: "Our story",
    featuredSlug: "asus-rog-zephyrus-g16",
    accentWord: 0,
    stats: [
      { value: 30, suffix: "+", label: "Brands carried" },
      { value: 4.9, decimals: 1, suffix: "★", label: "Average rating" },
      { value: 48, suffix: "hr", label: "Express delivery" },
    ],
  },
  hoops: {
    id: "hoops",
    heroVideo: null,
    heroPoster: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1920&q=85&fit=crop",
    headline: ["Game", "on.", "Anywhere."],
    subheadline: "Smooth motion, fast refresh rates, and the power to play anything, at your desk or on the couch.",
    ctaPrimary: "Shop Gaming Laptops",
    ctaSecondary: "See Accessories",
    ctaPrimaryHref: "/products?category=laptops&sport=Gaming",
    ctaSecondaryHref: "/products?category=accessories",
    eyebrow: "Gaming laptops",
    featuredSlug: "asus-rog-zephyrus-g16",
    accentWord: 1,
  },
  sound: {
    id: "sound",
    heroVideo: null,
    heroPoster: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=1920&q=85&fit=crop",
    headline: ["Turn it", "up.", "Feel it."],
    subheadline: "Recording, playlists, and calls — laptops that keep rhythm with your day.",
    ctaPrimary: "Shop Laptops",
    ctaSecondary: "Browse Headphones",
    ctaPrimaryHref: "/products?category=laptops",
    ctaSecondaryHref: "/products?category=accessories",
    eyebrow: "Music & sound",
    featuredSlug: "macbook-pro-14-m3",
    accentWord: 1,
  },
  office: {
    id: "office",
    heroVideo: VIDEOS.heroOffice,
    heroPoster: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920&q=85&fit=crop",
    headline: ["Meetings.", "Deadlines.", "Done."],
    subheadline: "Reliable laptops for video calls, documents, and the work that actually pays the bills.",
    ctaPrimary: "Shop Work Laptops",
    ctaSecondary: "Browse Accessories",
    ctaPrimaryHref: "/products?category=laptops",
    ctaSecondaryHref: "/products?category=accessories",
    eyebrow: "Office ready",
    featuredSlug: "lenovo-thinkpad-x1-carbon-gen12",
    accentWord: 2,
  },
  studio: {
    id: "studio",
    heroVideo: null,
    heroPoster: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1920&q=85&fit=crop",
    headline: ["Create", "without", "waiting."],
    subheadline: "Color-accurate screens and speed for photo, video, and everything you publish.",
    ctaPrimary: "Shop Creative Laptops",
    ctaSecondary: "See Accessories",
    ctaPrimaryHref: "/products?category=laptops&is_featured=true",
    ctaSecondaryHref: "/products?category=accessories",
    eyebrow: "Studio power",
    featuredSlug: "asus-proart-studiobook-16",
    accentWord: 0,
  },
  home: {
    id: "home",
    heroVideo: null,
    heroPoster: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=1920&q=85&fit=crop",
    headline: ["Movies.", "Shows.", "Chill."],
    subheadline: "Big, clear screens for streaming, browsing, and lazy Sundays at home.",
    ctaPrimary: "Shop Entertainment Laptops",
    ctaSecondary: "See Accessories",
    ctaPrimaryHref: "/products?category=laptops",
    ctaSecondaryHref: "/products?category=accessories",
    eyebrow: "Home & streaming",
    featuredSlug: "samsung-galaxy-book4-ultra",
    accentWord: 2,
  },
};

export const NARRATIVE_ORDER: NarrativeId[] = ["story", "hoops", "sound", "office", "studio", "home"];

export function getNextNarrative(current: NarrativeId | null): NarrativeId {
  if (!current) return NARRATIVE_ORDER[0];
  const idx = NARRATIVE_ORDER.indexOf(current);
  if (idx < 0) return NARRATIVE_ORDER[0];
  return NARRATIVE_ORDER[(idx + 1) % NARRATIVE_ORDER.length];
}

export function isNarrativeId(value: string): value is NarrativeId {
  return (NARRATIVE_ORDER as string[]).includes(value);
}

export type CategoryCardKey = "creator" | "gaming" | "bags" | "peripherals" | "gadgets";

export const CATEGORY_ORDER_BY_NARRATIVE: Record<NarrativeId, CategoryCardKey[]> = {
  story: ["creator", "gaming", "bags", "peripherals", "gadgets"],
  hoops: ["gaming", "creator", "peripherals", "bags", "gadgets"],
  sound: ["peripherals", "gadgets", "creator", "gaming", "bags"],
  office: ["bags", "peripherals", "creator", "gaming", "gadgets"],
  studio: ["creator", "gaming", "peripherals", "bags", "gadgets"],
  home: ["gaming", "gadgets", "creator", "bags", "peripherals"],
};
