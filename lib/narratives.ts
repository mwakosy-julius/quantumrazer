import { VIDEOS } from "./videos";

export type NarrativeId = "story" | "reviews" | "hoops" | "sound" | "office" | "studio" | "home";

export interface Narrative {
  id: NarrativeId;
  /** Optional clip; themes without one show the photo with a slow zoom. */
  heroVideo: string | null;
  heroPoster: string;
  /** Which part of the picture stays in view on narrow screens (CSS position). */
  heroFocus?: string;
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

/** Real review figures from the database, when the shop has any reviews. */
export interface ReviewSummary {
  average: number;
  count: number;
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
    headline: ["Quantum Razer.", "For", "students."],
    subheadline:
      "Laptops and gear for lectures, assignments and late-night study, explained without the jargon.",
    ctaPrimary: "Shop Student Laptops",
    ctaSecondary: "Contact Us",
    ctaPrimaryHref: "/products?category=laptops",
    ctaSecondaryHref: "/help",
    eyebrow: "For students",
    featuredSlug: "asus-rog-zephyrus-g16",
    accentWord: 0,
  },
  reviews: {
    id: "reviews",
    heroVideo: null,
    heroPoster: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=85&fit=crop",
    headline: ["Rated", "by our", "customers."],
    subheadline: "Read what buyers say on every product page, then pick yours with confidence.",
    ctaPrimary: "Shop Popular Products",
    ctaSecondary: "See What's New",
    ctaPrimaryHref: "/products?sort=popular",
    ctaSecondaryHref: "/products?sort=newest",
    eyebrow: "Reviews",
    featuredSlug: "asus-rog-zephyrus-g16",
    accentWord: 0,
    stats: [
      { value: 4.9, decimals: 1, suffix: "★", label: "Average rating" },
      { value: 30, suffix: "+", label: "Brands carried" },
      { value: 48, suffix: "hr", label: "Express delivery" },
    ],
  },
  hoops: {
    id: "hoops",
    heroVideo: null,
    heroPoster: "https://images.unsplash.com/photo-1630794180018-433d915c34ac?w=1920&q=85&fit=crop",
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
    heroVideo: VIDEOS.heroSound,
    heroPoster: "/hero/sound.jpg",
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
    heroPoster: "/hero/office.jpg",
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
    heroPoster: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=1920&q=85&fit=crop",
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
    heroVideo: VIDEOS.heroHome,
    heroPoster: "/hero/home.jpg",
    heroFocus: "62% 50%",
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

export const NARRATIVE_ORDER: NarrativeId[] = ["story", "reviews", "hoops", "sound", "office", "studio", "home"];

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
  reviews: ["creator", "gaming", "bags", "peripherals", "gadgets"],
  hoops: ["gaming", "creator", "peripherals", "bags", "gadgets"],
  sound: ["peripherals", "gadgets", "creator", "gaming", "bags"],
  office: ["bags", "peripherals", "creator", "gaming", "gadgets"],
  studio: ["creator", "gaming", "peripherals", "bags", "gadgets"],
  home: ["gaming", "gadgets", "creator", "bags", "peripherals"],
};
