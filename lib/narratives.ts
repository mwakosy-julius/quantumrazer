import { VIDEOS } from "./videos";

export type NarrativeId = "hoops" | "sound" | "office" | "studio" | "home";

export interface Narrative {
  id: NarrativeId;
  heroVideo: string;
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
}

export const NARRATIVES: Record<NarrativeId, Narrative> = {
  hoops: {
    id: "hoops",
    heroVideo: VIDEOS.heroBasketball,
    heroPoster: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1920&q=85&fit=crop",
    headline: ["Game", "on.", "Anywhere."],
    subheadline: "Smooth motion, fast refresh, and power for highlights — on the court or on the couch.",
    ctaPrimary: "Shop Gaming Laptops",
    ctaSecondary: "See Accessories",
    ctaPrimaryHref: "/products?category=laptops&sport=Gaming",
    ctaSecondaryHref: "/products?category=accessories",
    eyebrow: "Courtside energy — Spring 2026",
    featuredSlug: "asus-rog-zephyrus-g16",
    accentWord: 1,
  },
  sound: {
    id: "sound",
    heroVideo: VIDEOS.heroMusic,
    heroPoster: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1920&q=85&fit=crop",
    headline: ["Turn it", "up.", "Feel it."],
    subheadline: "Recording, playlists, and calls — laptops that keep rhythm with your day.",
    ctaPrimary: "Shop Laptops",
    ctaSecondary: "Browse Headphones",
    ctaPrimaryHref: "/products?category=laptops",
    ctaSecondaryHref: "/products?category=accessories",
    eyebrow: "Music & sound — Spring 2026",
    featuredSlug: "macbook-pro-14-m3",
    accentWord: 1,
  },
  office: {
    id: "office",
    heroVideo: VIDEOS.heroOffice,
    heroPoster: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=85&fit=crop",
    headline: ["Meetings.", "Deadlines.", "Done."],
    subheadline: "Reliable laptops for video calls, documents, and the work that actually pays the bills.",
    ctaPrimary: "Shop Work Laptops",
    ctaSecondary: "Browse Accessories",
    ctaPrimaryHref: "/products?category=laptops",
    ctaSecondaryHref: "/products?category=accessories",
    eyebrow: "Office ready — Spring 2026",
    featuredSlug: "lenovo-thinkpad-x1-carbon-gen12",
    accentWord: 2,
  },
  studio: {
    id: "studio",
    heroVideo: VIDEOS.heroStudio,
    heroPoster: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1920&q=85&fit=crop",
    headline: ["Create", "without", "waiting."],
    subheadline: "Color-accurate screens and speed for photo, video, and everything you publish.",
    ctaPrimary: "Shop Creative Laptops",
    ctaSecondary: "See Accessories",
    ctaPrimaryHref: "/products?category=laptops&is_featured=true",
    ctaSecondaryHref: "/products?category=accessories",
    eyebrow: "Studio power — Spring 2026",
    featuredSlug: "asus-proart-studiobook-16",
    accentWord: 0,
  },
  home: {
    id: "home",
    heroVideo: VIDEOS.heroHome,
    heroPoster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&q=85&fit=crop",
    headline: ["Movies.", "Shows.", "Chill."],
    subheadline: "Big, clear screens for streaming, browsing, and lazy Sundays at home.",
    ctaPrimary: "Shop Entertainment Laptops",
    ctaSecondary: "See Accessories",
    ctaPrimaryHref: "/products?category=laptops",
    ctaSecondaryHref: "/products?category=accessories",
    eyebrow: "Home theater — Spring 2026",
    featuredSlug: "samsung-galaxy-book4-ultra",
    accentWord: 2,
  },
};

export const NARRATIVE_ORDER: NarrativeId[] = ["hoops", "sound", "office", "studio", "home"];

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
  hoops: ["gaming", "creator", "peripherals", "bags", "gadgets"],
  sound: ["peripherals", "gadgets", "creator", "gaming", "bags"],
  office: ["bags", "peripherals", "creator", "gaming", "gadgets"],
  studio: ["creator", "gaming", "peripherals", "bags", "gadgets"],
  home: ["gaming", "gadgets", "creator", "bags", "peripherals"],
};
