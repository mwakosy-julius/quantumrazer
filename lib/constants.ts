export const BRAND = {
  name: "QUANTUM RAZER",
  tagline: "Precision tools for creative minds.",
  subTagline: "Tech built for the ones who make things.",
} as const;

export const TRUST_BRANDS = [
  "APPLE",
  "ASUS",
  "RAZER",
  "LENOVO",
  "DELL",
  "SAMSUNG",
  "LG",
  "LOGITECH",
  "SONY",
  "INCASE",
] as const;

export type MegaMenuKey = "new" | "laptops" | "accessories" | "gadgets" | "sale";

export const NAV_MAIN: { id: MegaMenuKey; label: string; href: string }[] = [
  { id: "new", label: "New & Featured", href: "/products?sort=newest" },
  { id: "laptops", label: "Laptops", href: "/products?category=laptops" },
  { id: "accessories", label: "Accessories", href: "/products?category=accessories" },
  { id: "gadgets", label: "Gadgets", href: "/products?category=gadgets" },
  { id: "sale", label: "Sale", href: "/sale" },
];

export type MegaColumn = { title: string; links: { label: string; href: string }[] };

export const MEGA_BY_KEY: Record<
  MegaMenuKey,
  { columns: MegaColumn[]; featuredImage?: string; featuredEyebrow?: string; featuredTitle?: string; featuredHref?: string }
> = {
  new: {
    columns: [
      {
        title: "JUST DROPPED",
        links: [
          { label: "New Laptops", href: "/products?sort=newest&category=laptops" },
          { label: "New Accessories", href: "/products?sort=newest&category=accessories" },
          { label: "New Gadgets", href: "/products?sort=newest&category=gadgets" },
        ],
      },
      {
        title: "TRENDING",
        links: [
          { label: "Gaming Rigs", href: "/products?sport=Gaming" },
          { label: "Creator Picks", href: "/products?is_featured=true" },
          { label: "Laptop Bags", href: "/products?category=laptop-bags" },
        ],
      },
      {
        title: "SHOP",
        links: [
          { label: "All Products", href: "/products" },
          { label: "Refurbished", href: "/sale" },
        ],
      },
      {
        title: "CREATORS",
        links: [
          { label: "The Gamer", href: "/creators#gamer" },
          { label: "The Designer", href: "/creators#designer" },
          { label: "The Producer", href: "/creators#producer" },
          { label: "The Skater", href: "/creators#skater" },
        ],
      },
    ],
    featuredImage: "https://picsum.photos/seed/qrnew/480/640",
    featuredEyebrow: "FEATURED",
    featuredTitle: "Creator Series Drop",
    featuredHref: "/products?is_featured=true",
  },
  laptops: {
    columns: [
      {
        title: "BY USE CASE",
        links: [
          { label: "Gaming Laptops", href: "/products?sport=Gaming" },
          { label: "Creator Laptops", href: "/products?is_featured=true" },
          { label: "Ultrabooks", href: "/products" },
          { label: "Workstations", href: "/products" },
          { label: "Refurbished", href: "/sale" },
        ],
      },
      {
        title: "BY BRAND",
        links: [
          { label: "Apple MacBooks", href: "/products?q=MacBook" },
          { label: "ASUS ROG", href: "/products?q=ASUS" },
          { label: "Razer Blade", href: "/products?q=Razer" },
          { label: "Lenovo ThinkPad", href: "/products?q=ThinkPad" },
          { label: "Dell XPS", href: "/products?q=XPS" },
          { label: "Samsung Galaxy", href: "/products?q=Samsung" },
        ],
      },
      {
        title: "ACCESSORIES",
        links: [
          { label: "Mice & Trackpads", href: "/products?category=accessories" },
          { label: "Keyboards", href: "/products?category=accessories" },
          { label: "Laptop Bags", href: "/products?category=laptop-bags" },
          { label: "Monitors", href: "/products?category=accessories" },
          { label: "Audio", href: "/products?category=accessories" },
          { label: "Hubs", href: "/products?category=accessories" },
        ],
      },
      {
        title: "FEATURED DROP",
        links: [{ label: "Shop All Laptops →", href: "/products?category=laptops" }],
      },
    ],
    featuredImage: "https://picsum.photos/seed/qrlap/480/640",
    featuredEyebrow: "FEATURED DROP",
    featuredTitle: "Blade-Class Power",
    featuredHref: "/products?category=laptops",
  },
  accessories: {
    columns: [
      {
        title: "CARRY",
        links: [
          { label: "Laptop Bags", href: "/products?category=laptop-bags" },
          { label: "Backpacks", href: "/products?category=laptop-bags" },
          { label: "Sleeves", href: "/products?category=laptop-bags" },
          { label: "Messenger Bags", href: "/products?category=laptop-bags" },
          { label: "Hard Cases", href: "/products?category=laptop-bags" },
          { label: "Rolling Cases", href: "/products?category=laptop-bags" },
        ],
      },
      {
        title: "PERIPHERALS",
        links: [
          { label: "Mice", href: "/products?category=accessories" },
          { label: "Keyboards", href: "/products?category=accessories" },
          { label: "Webcams", href: "/products?category=accessories" },
          { label: "Hubs", href: "/products?category=accessories" },
          { label: "Cables", href: "/products?category=accessories" },
        ],
      },
      {
        title: "DISPLAY & AUDIO",
        links: [
          { label: "Monitors", href: "/products?category=accessories" },
          { label: "Headphones", href: "/products?category=gadgets" },
          { label: "Speakers", href: "/products?category=gadgets" },
          { label: "Microphones", href: "/products?category=accessories" },
        ],
      },
      {
        title: "FEATURED",
        links: [{ label: "Shop Bags →", href: "/products?category=laptop-bags" }],
      },
    ],
    featuredImage: "https://picsum.photos/seed/qrbag/480/640",
    featuredEyebrow: "CARRY",
    featuredTitle: "Peak Design & Thule",
    featuredHref: "/products?category=laptop-bags",
  },
  gadgets: {
    columns: [
      {
        title: "DEVICES",
        links: [
          { label: "Tablets", href: "/products?category=gadgets" },
          { label: "Phones", href: "/products?category=gadgets" },
          { label: "Cameras", href: "/products?category=gadgets" },
          { label: "Handheld Gaming", href: "/products?category=gadgets" },
        ],
      },
      {
        title: "WEARABLES",
        links: [
          { label: "Smartwatches", href: "/products?category=gadgets" },
          { label: "Earbuds", href: "/products?category=gadgets" },
          { label: "Fitness Trackers", href: "/products?category=gadgets" },
        ],
      },
      {
        title: "STORAGE",
        links: [
          { label: "External SSDs", href: "/products?category=gadgets" },
          { label: "USB Drives", href: "/products?category=gadgets" },
          { label: "Memory Cards", href: "/products?category=gadgets" },
        ],
      },
      {
        title: "FEATURED",
        links: [{ label: "Shop Gadgets →", href: "/products?category=gadgets" }],
      },
    ],
    featuredImage: "https://picsum.photos/seed/qrgad/480/640",
    featuredEyebrow: "HANDHELD",
    featuredTitle: "Stream Anywhere",
    featuredHref: "/products?category=gadgets",
  },
  sale: {
    columns: [
      {
        title: "DEALS",
        links: [
          { label: "All Sale", href: "/sale" },
          { label: "Refurbished", href: "/sale" },
          { label: "Open Box", href: "/sale" },
        ],
      },
      {
        title: "CATEGORIES",
        links: [
          { label: "Laptops", href: "/sale" },
          { label: "Accessories", href: "/sale" },
          { label: "Gadgets", href: "/sale" },
        ],
      },
      {
        title: "MORE",
        links: [
          { label: "Laptop Bags", href: "/products?category=laptop-bags" },
          { label: "New Arrivals", href: "/products?sort=newest" },
        ],
      },
      {
        title: "ACCOUNT",
        links: [
          { label: "Sign In", href: "/login" },
          { label: "Join Us", href: "/register" },
        ],
      },
    ],
    featuredImage: "https://picsum.photos/seed/qrsale/480/640",
    featuredEyebrow: "LIMITED",
    featuredTitle: "Up To 40% Off",
    featuredHref: "/sale",
  },
};

export const US_SIZES = [
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "11.5",
  "12",
  "13",
];
