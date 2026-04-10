export const IMAGES = {
  laptops: {
    macbookPro: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    macbookAir: "https://images.unsplash.com/photo-1611186871525-9b2c84b37b25",
    asusRog: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89",
    dellXps: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
    lenovo: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef",
    gaming: "https://images.unsplash.com/photo-1547082299-de196ea013d6",
    openSide: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    workspace: "https://images.unsplash.com/photo-1484788984921-03950022c9ef",
    ultrabook: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2",
  },
  accessories: {
    keyboard: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef",
    gamingMouse: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
    mouse: "https://images.unsplash.com/photo-1615751072497-5f5169febe17",
    hub: "https://images.unsplash.com/photo-1625961332772-3851d3ba09ee",
    monitor: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
    webcam: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da",
    stand: "https://images.unsplash.com/photo-1593642634524-b40b5baae6bb",
    headphones: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    earbuds: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
    ssd: "https://images.unsplash.com/photo-1585771724684-38269d6639fd",
  },
  bags: {
    backpackBlack: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    leatherBag: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
    sleeve: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3",
    messenger: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
    rolling: "https://images.unsplash.com/photo-1581553673739-c4906b5d0de8",
    lifestyle: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
  },
  gadgets: {
    ipad: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
    tablet: "https://images.unsplash.com/photo-1561154464-82e9adf32764",
    watch: "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
    camera: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    controller: "https://images.unsplash.com/photo-1592840496694-26d035b52b48",
    usb: "https://images.unsplash.com/photo-1616628188540-925618b98318",
  },
  lifestyle: {
    dualMonitor: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    designer: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
    producer: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    gamer: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89",
    photographer: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a",
    developer: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    creativeWoman: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
    skater: "https://images.unsplash.com/photo-1547347298-4074fc3086f0",
    editor: "https://images.unsplash.com/photo-1574717024453-354056aafa98",
    africanDev: "https://images.unsplash.com/photo-1531482615713-2afd69097998",
    collab: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    womanDesign: "https://images.unsplash.com/photo-1551434678-e076c223a692",
    /** Museum / gallery hall — strong artistic mood for editorial sections */
    galleryHall: "https://images.unsplash.com/photo-1549887534-1541e32ddb35",
  },
} as const;

function appendUnsplashParams(baseUrl: string, params: Record<string, string | number>) {
  const [base, query = ""] = baseUrl.split("?");
  const sp = new URLSearchParams(query);
  for (const [k, v] of Object.entries(params)) {
    sp.set(k, String(v));
  }
  return `${base}?${sp.toString()}`;
}

/** Hero / full-bleed sections (e.g. 1920w). */
export function imgHero1920(url: string) {
  return appendUnsplashParams(url, { w: 1920, q: 85, fit: "crop" });
}

/** Large banners (~1600w). */
export function imgHero1600(url: string) {
  return appendUnsplashParams(url, { w: 1600, q: 85, fit: "crop" });
}

/** Product grid / PLP cards — grey background hint for catalogue shots. */
export function imgProductCardPrimary(url: string) {
  if (/\bw=\d+/.test(url)) return url;
  return appendUnsplashParams(url, { w: 600, q: 80, fit: "crop", bg: "f5f5f5" });
}

/** Second angle / hover image for cards. */
export function imgProductCardHover(url: string) {
  if (/\bw=\d+/.test(url)) return url;
  return appendUnsplashParams(url, { w: 600, q: 80, fit: "crop" });
}

/** Thumbnails / small tiles. */
export function imgThumb(url: string) {
  if (/\bw=\d+/.test(url)) return url;
  return appendUnsplashParams(url, { w: 400, q: 75, fit: "crop" });
}

/** PDP / seed gallery (~800w). */
export function imgPdp(url: string) {
  if (/\bw=\d+/.test(url)) return url;
  return appendUnsplashParams(url, { w: 800, q: 85, fit: "crop" });
}

/** Flat list of every registry URL for the admin image library picker. */
export function getAllImageLibraryUrls(): { category: string; key: string; url: string }[] {
  const out: { category: string; key: string; url: string }[] = [];
  (Object.keys(IMAGES) as (keyof typeof IMAGES)[]).forEach((cat) => {
    const group = IMAGES[cat];
    (Object.keys(group) as string[]).forEach((key) => {
      out.push({ category: cat, key, url: (group as Record<string, string>)[key] });
    });
  });
  return out;
}
