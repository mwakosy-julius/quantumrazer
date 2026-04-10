import { Gender, OrderStatus, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { IMAGES, imgPdp } from "../lib/images";

const prisma = new PrismaClient();

const L = IMAGES.laptops;
const A = IMAGES.accessories;
const B = IMAGES.bags;
const G = IMAGES.gadgets;
const LS = IMAGES.lifestyle;

type CatSlug = "laptops" | "accessories" | "laptop-bags" | "gadgets";

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  brand: string;
  categorySlug: CatSlug;
  collectionHandle?: string;
  gender: Gender;
  sport?: string | null;
  isFeatured?: boolean;
  isNew?: boolean;
  price: number;
  compareAt?: number | null;
  colorName: string;
  colorHex?: string | null;
  size: string;
  inventory: number;
  images: { url: string; isPrimary?: boolean }[];
};

const products: SeedProduct[] = [
  {
    name: 'Apple MacBook Pro 16" M3 Max',
    slug: "macbook-pro-16-m3-max",
    description:
      "The most powerful MacBook ever. M3 Max chip with up to 40-core GPU, 128GB unified memory, and up to 22 hours battery life. Built for creators who push limits.",
    brand: "Apple",
    categorySlug: "laptops",
    collectionHandle: "creator-series",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: true,
    isNew: true,
    price: 3499,
    compareAt: null,
    colorName: "Space Black",
    colorHex: "#1a1a1a",
    size: '16-inch',
    inventory: 24,
    images: [
      { url: imgPdp(L.macbookPro), isPrimary: true },
      { url: imgPdp(L.openSide) },
      { url: imgPdp(LS.designer) },
      { url: imgPdp(L.workspace) },
    ],
  },
  {
    name: 'Apple MacBook Air 15" M3',
    slug: "macbook-air-15-m3",
    description:
      "Impossibly thin. Remarkably capable. The M3 chip delivers up to 18 hours battery and 60% faster performance than M1. Perfect for creators always on the move.",
    brand: "Apple",
    categorySlug: "laptops",
    collectionHandle: "new-arrivals",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: true,
    isNew: true,
    price: 1299,
    compareAt: 1499,
    colorName: "Midnight",
    colorHex: "#1c1c2e",
    size: '15-inch',
    inventory: 18,
    images: [
      { url: imgPdp(L.macbookAir), isPrimary: true },
      { url: imgPdp(L.ultrabook) },
      { url: imgPdp(LS.creativeWoman) },
    ],
  },
  {
    name: "ASUS ROG Zephyrus G16",
    slug: "asus-rog-zephyrus-g16",
    description:
      "Engineered for the elite gamer and creative professional. RTX 4090 graphics, 240Hz OLED display, and MUX Switch for maximum performance. This is what winning looks like.",
    brand: "ASUS",
    categorySlug: "laptops",
    collectionHandle: "gaming-rigs",
    gender: Gender.UNISEX,
    sport: "Gaming",
    isFeatured: true,
    isNew: false,
    price: 2799,
    compareAt: null,
    colorName: "Eclipse Gray",
    colorHex: "#2a2a35",
    size: '16-inch',
    inventory: 8,
    images: [
      { url: imgPdp(L.asusRog), isPrimary: true },
      { url: imgPdp(L.gaming) },
      { url: imgPdp(LS.gamer) },
    ],
  },
  {
    name: "Razer Blade 16",
    slug: "razer-blade-16",
    description:
      "The world's first laptop with a dual-mode Mini LED display — switch between 4K 120Hz for creators and FHD 240Hz for gaming. RTX 4090, 64GB DDR5.",
    brand: "Razer",
    categorySlug: "laptops",
    collectionHandle: "gaming-rigs",
    gender: Gender.UNISEX,
    sport: "Gaming",
    isFeatured: false,
    isNew: true,
    price: 3199,
    compareAt: null,
    colorName: "Stealth Black",
    colorHex: "#0a0a0a",
    size: '16-inch',
    inventory: 6,
    images: [
      { url: imgPdp(L.gaming), isPrimary: true },
      { url: imgPdp(L.asusRog) },
      { url: imgPdp(LS.gamer) },
    ],
  },
  {
    name: 'Dell XPS 15 OLED',
    slug: "dell-xps-15-oled",
    description:
      'A stunning 15.6" 3.5K OLED touchscreen meets Intel Core i9 power. Thin, light, and built for photographers, video editors, and architects who demand color accuracy.',
    brand: "Dell",
    categorySlug: "laptops",
    collectionHandle: "creator-series",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: false,
    isNew: false,
    price: 1899,
    compareAt: null,
    colorName: "Platinum Silver",
    colorHex: "#c0c0c0",
    size: '15-inch',
    inventory: 14,
    images: [
      { url: imgPdp(L.dellXps), isPrimary: true },
      { url: imgPdp(L.ultrabook) },
      { url: imgPdp(LS.editor) },
    ],
  },
  {
    name: "Lenovo ThinkPad X1 Carbon Gen 12",
    slug: "lenovo-thinkpad-x1-carbon-gen12",
    description:
      "Business-grade durability meets featherlight design at just 1.12kg. Intel Core Ultra 7, 64GB LPDDR5, and 57Whr battery. MIL-SPEC tested for those who work anywhere.",
    brand: "Lenovo",
    categorySlug: "laptops",
    collectionHandle: "everyday-carry",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: false,
    isNew: false,
    price: 1649,
    compareAt: null,
    colorName: "Deep Black",
    colorHex: "#111111",
    size: '14-inch',
    inventory: 11,
    images: [
      { url: imgPdp(L.lenovo), isPrimary: true },
      { url: imgPdp(L.workspace) },
      { url: imgPdp(LS.africanDev) },
    ],
  },
  {
    name: "Samsung Galaxy Book4 Ultra",
    slug: "samsung-galaxy-book4-ultra",
    description:
      '16" Dynamic AMOLED 2X display with 120Hz refresh. Intel Core Ultra 9, RTX 4070, and 76Whr battery. Galaxy ecosystem integration for those deep in Samsung.',
    brand: "Samsung",
    categorySlug: "laptops",
    collectionHandle: "creator-series",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: false,
    isNew: false,
    price: 2199,
    compareAt: 2499,
    colorName: "Moonstone Gray",
    colorHex: "#8a8a95",
    size: '16-inch',
    inventory: 9,
    images: [
      { url: imgPdp(L.openSide), isPrimary: true },
      { url: imgPdp(L.workspace) },
      { url: imgPdp(LS.developer) },
    ],
  },
  {
    name: 'Apple MacBook Pro 14" M3',
    slug: "macbook-pro-14-m3",
    description:
      "All the power of a MacBook Pro in the most portable package. M3 chip, 11-hour battery, Liquid Retina XDR display. The writer's, coder's, and student researcher's machine.",
    brand: "Apple",
    categorySlug: "laptops",
    collectionHandle: "everyday-carry",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: false,
    isNew: false,
    price: 1999,
    compareAt: null,
    colorName: "Silver",
    colorHex: "#e0e0e0",
    size: '14-inch',
    inventory: 15,
    images: [
      { url: imgPdp(L.macbookPro), isPrimary: true },
      { url: imgPdp(L.ultrabook) },
      { url: imgPdp(LS.collab) },
    ],
  },
  {
    name: "ASUS ProArt Studiobook 16 OLED",
    slug: "asus-proart-studiobook-16",
    description:
      "Pantone Validated OLED display with 0.2 Delta E color accuracy. RTX 4070, Intel Core i9, and an integrated ASUS Dial — the creative professional's weapon of choice.",
    brand: "ASUS",
    categorySlug: "laptops",
    collectionHandle: "creator-series",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: true,
    isNew: false,
    price: 2499,
    compareAt: null,
    colorName: "Mineral Black",
    colorHex: "#1a1a1a",
    size: '16-inch',
    inventory: 7,
    images: [
      { url: imgPdp(L.dellXps), isPrimary: true },
      { url: imgPdp(LS.designer) },
      { url: imgPdp(LS.womanDesign) },
    ],
  },
  {
    name: "Dell Inspiron 15 (Refurbished)",
    slug: "dell-inspiron-15-refurbished",
    description:
      "Certified refurbished. Intel Core i7, 16GB RAM, 512GB SSD. Tested, cleaned, and backed by a 12-month Quantum Razer warranty. Serious performance, responsible price.",
    brand: "Dell",
    categorySlug: "laptops",
    collectionHandle: "budget-picks",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: false,
    isNew: false,
    price: 649,
    compareAt: 1099,
    colorName: "Platinum Silver",
    colorHex: "#c0c0c0",
    size: '15-inch',
    inventory: 3,
    images: [
      { url: imgPdp(L.workspace), isPrimary: true },
      { url: imgPdp(L.openSide) },
    ],
  },
  {
    name: "Razer BlackWidow V4 Pro Keyboard",
    slug: "razer-blackwidow-v4-pro",
    description:
      "Razer Green mechanical switches. Doubleshot PBT keycaps. Per-key RGB Chroma lighting. 8000Hz HyperPolling wireless. The keyboard endgame.",
    brand: "Razer",
    categorySlug: "accessories",
    collectionHandle: "gaming-rigs",
    gender: Gender.UNISEX,
    sport: "Gaming",
    isFeatured: false,
    isNew: false,
    price: 229,
    compareAt: null,
    colorName: "Black",
    colorHex: "#111111",
    size: "One Size",
    inventory: 22,
    images: [{ url: imgPdp(A.keyboard), isPrimary: true }, { url: imgPdp(LS.gamer) }],
  },
  {
    name: "Logitech MX Master 3S",
    slug: "logitech-mx-master-3s",
    description:
      "8K DPI tracking on any surface — including glass. Electromagnetic scroll wheel with MagSpeed. Works seamlessly across 3 devices. The mouse that creative professionals swear by.",
    brand: "Logitech",
    categorySlug: "accessories",
    collectionHandle: "creator-series",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: true,
    isNew: false,
    price: 99,
    compareAt: null,
    colorName: "Graphite",
    colorHex: "#333333",
    size: "One Size",
    inventory: 40,
    images: [{ url: imgPdp(A.mouse), isPrimary: true }, { url: imgPdp(LS.designer) }],
  },
  {
    name: "Razer DeathAdder V3 HyperSpeed",
    slug: "razer-deathadder-v3-hyperspeed",
    description:
      "90-hour battery. 63g ultra-lightweight. Focus Pro 30K optical sensor. The gaming mouse built for marathon sessions and competition-grade precision.",
    brand: "Razer",
    categorySlug: "accessories",
    collectionHandle: "gaming-rigs",
    gender: Gender.UNISEX,
    sport: "Gaming",
    isFeatured: false,
    isNew: false,
    price: 79,
    compareAt: null,
    colorName: "Black",
    colorHex: "#0a0a0a",
    size: "One Size",
    inventory: 30,
    images: [{ url: imgPdp(A.gamingMouse), isPrimary: true }, { url: imgPdp(LS.gamer) }],
  },
  {
    name: 'Dell UltraSharp 27" 4K USB-C Monitor',
    slug: "dell-ultrasharp-27-4k-usbc",
    description:
      "IPS Black panel with 2000:1 contrast ratio. 100% sRGB, 98% DCI-P3. Thunderbolt 4 with 90W laptop charging. One cable for everything — display, data, power.",
    brand: "Dell",
    categorySlug: "accessories",
    collectionHandle: "creator-series",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: true,
    isNew: false,
    price: 699,
    compareAt: 799,
    colorName: "Black",
    colorHex: "#111111",
    size: '27-inch',
    inventory: 12,
    images: [{ url: imgPdp(A.monitor), isPrimary: true }, { url: imgPdp(LS.dualMonitor) }],
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    slug: "sony-wh-1000xm5",
    description:
      "Industry-leading noise cancellation with Auto NC Optimizer. 30 hours battery. Multipoint Bluetooth connects to two devices simultaneously. Sound that disappears into music.",
    brand: "Sony",
    categorySlug: "accessories",
    collectionHandle: "everyday-carry",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: true,
    isNew: false,
    price: 349,
    compareAt: null,
    colorName: "Midnight Black",
    colorHex: "#111111",
    size: "One Size",
    inventory: 25,
    images: [{ url: imgPdp(A.headphones), isPrimary: true }, { url: imgPdp(LS.producer) }],
  },
  {
    name: "Apple AirPods Pro 2nd Gen",
    slug: "apple-airpods-pro-2nd-gen",
    description:
      "H2 chip with Adaptive Audio that silences the world or lets it in — automatically. Find My with Precision Finding. 30 hours total with case.",
    brand: "Apple",
    categorySlug: "accessories",
    collectionHandle: "new-arrivals",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: false,
    isNew: true,
    price: 249,
    compareAt: null,
    colorName: "White",
    colorHex: "#ffffff",
    size: "One Size",
    inventory: 35,
    images: [{ url: imgPdp(A.earbuds), isPrimary: true }, { url: imgPdp(LS.creativeWoman) }],
  },
  {
    name: "CalDigit TS4 Thunderbolt 4 Dock",
    slug: "caldigit-ts4-thunderbolt-dock",
    description:
      "18 ports. 98W laptop charging. Dual 4K display support. 2.5GbE ethernet. The last dock you'll ever need for a MacBook or Windows ultrabook setup.",
    brand: "CalDigit",
    categorySlug: "accessories",
    collectionHandle: "creator-series",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: false,
    isNew: false,
    price: 399,
    compareAt: null,
    colorName: "Silver",
    colorHex: "#c0c0c0",
    size: "One Size",
    inventory: 16,
    images: [{ url: imgPdp(A.hub), isPrimary: true }, { url: imgPdp(LS.dualMonitor) }],
  },
  {
    name: "Logitech Brio 4K Webcam",
    slug: "logitech-brio-4k-webcam",
    description:
      "4K Ultra HD at 60fps. HDR technology. Works in challenging light. RightLight 3 AI scene optimization. Built for creators who stream, present, and produce content.",
    brand: "Logitech",
    categorySlug: "accessories",
    collectionHandle: "everyday-carry",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: false,
    isNew: false,
    price: 199,
    compareAt: null,
    colorName: "Black",
    colorHex: "#111111",
    size: "One Size",
    inventory: 20,
    images: [{ url: imgPdp(A.webcam), isPrimary: true }, { url: imgPdp(LS.developer) }],
  },
  {
    name: "Samsung T9 4TB Portable SSD",
    slug: "samsung-t9-4tb-ssd",
    description:
      "2,000MB/s read and write. USB 3.2 Gen 2x2. IP65 rated for dust and water. Dynamic Thermal Guard. Four terabytes of fast, safe storage that fits in your pocket.",
    brand: "Samsung",
    categorySlug: "accessories",
    collectionHandle: "everyday-carry",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: false,
    isNew: false,
    price: 279,
    compareAt: null,
    colorName: "Black",
    colorHex: "#111111",
    size: "4TB",
    inventory: 2,
    images: [{ url: imgPdp(A.ssd), isPrimary: true }],
  },
  {
    name: "Twelve South Curve Flex Laptop Stand",
    slug: "twelve-south-curve-flex-stand",
    description:
      "Adjustable height from 3 to 7.5 inches. Compatible with all MacBooks and Windows laptops. Folds flat for travel. Because your neck deserves better than desk-level.",
    brand: "Twelve South",
    categorySlug: "accessories",
    collectionHandle: "everyday-carry",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: false,
    isNew: false,
    price: 89,
    compareAt: null,
    colorName: "Silver",
    colorHex: "#d0d0d0",
    size: "One Size",
    inventory: 28,
    images: [{ url: imgPdp(A.stand), isPrimary: true }, { url: imgPdp(L.workspace) }],
  },
  {
    name: "Bellroy Transit Backpack Plus",
    slug: "bellroy-transit-backpack-plus",
    description:
      '26L capacity. Dedicated laptop compartment fits up to 16". Recycled fabric. Carry-on compatible. Built for the creator who moves between studios, flights, and coffee shops.',
    brand: "Bellroy",
    categorySlug: "laptop-bags",
    collectionHandle: "everyday-carry",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: true,
    isNew: false,
    price: 289,
    compareAt: null,
    colorName: "Midnight",
    colorHex: "#1c1c2e",
    size: "26L",
    inventory: 14,
    images: [
      { url: imgPdp(B.backpackBlack), isPrimary: true },
      { url: imgPdp(B.lifestyle) },
      { url: imgPdp(LS.africanDev) },
    ],
  },
  {
    name: "Waterfield Designs Bolt Briefcase",
    slug: "waterfield-bolt-briefcase",
    description:
      'Full-grain leather. Fits MacBook Pro 16" and iPad. Hand-stitched in San Francisco. A bag that ages with character — for the creator who takes craft seriously.',
    brand: "Waterfield",
    categorySlug: "laptop-bags",
    collectionHandle: "creator-series",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: false,
    isNew: false,
    price: 349,
    compareAt: null,
    colorName: "Chestnut Brown",
    colorHex: "#8B4513",
    size: "One Size",
    inventory: 6,
    images: [{ url: imgPdp(B.leatherBag), isPrimary: true }, { url: imgPdp(B.messenger) }],
  },
  {
    name: "Incase ICON Sleeve with Tensaerlite",
    slug: "incase-icon-sleeve-tensaerlite",
    description:
      "Featherlight protection for MacBook Pro 14\" and 16\". Tensaerlite foam cushioning. Fits inside any backpack. Magnetic closure. Under 200g.",
    brand: "Incase",
    categorySlug: "laptop-bags",
    collectionHandle: "everyday-carry",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: false,
    isNew: false,
    price: 79,
    compareAt: 99,
    colorName: "Grey",
    colorHex: "#888888",
    size: '16-inch',
    inventory: 45,
    images: [{ url: imgPdp(B.sleeve), isPrimary: true }],
  },
  {
    name: "Peak Design Everyday Backpack 30L",
    slug: "peak-design-everyday-backpack-30l",
    description:
      "Weather-resistant 400D nylon canvas. FlexFold dividers. MagLatch top closure. Fits 16\" laptops. Used by photographers, filmmakers, and anyone who carries everything.",
    brand: "Peak Design",
    categorySlug: "laptop-bags",
    collectionHandle: "creator-series",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: true,
    isNew: false,
    price: 299,
    compareAt: null,
    colorName: "Black",
    colorHex: "#111111",
    size: "30L",
    inventory: 9,
    images: [
      { url: imgPdp(B.backpackBlack), isPrimary: true },
      { url: imgPdp(B.lifestyle) },
      { url: imgPdp(LS.photographer) },
    ],
  },
  {
    name: "Thule Crossover 2 Messenger Bag",
    slug: "thule-crossover-2-messenger",
    description:
      'Fits 13" and 15" laptops. Scratch-free pocket for sunglasses or screen. Tablet sleeve. Durable, clean Scandinavian design that goes from studio to street.',
    brand: "Thule",
    categorySlug: "laptop-bags",
    collectionHandle: "everyday-carry",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: false,
    isNew: false,
    price: 129,
    compareAt: null,
    colorName: "Black",
    colorHex: "#111111",
    size: "One Size",
    inventory: 17,
    images: [{ url: imgPdp(B.messenger), isPrimary: true }, { url: imgPdp(LS.collab) }],
  },
  {
    name: "Everki Titan Rolling Laptop Bag",
    slug: "everki-titan-rolling-laptop-bag",
    description:
      'Fits up to 18.4" gaming laptops. Telescoping handle. Inline skate wheels. TSA-friendly. Because the ROG G16 is going on tour and it\'s not going in the overhead bin.',
    brand: "Everki",
    categorySlug: "laptop-bags",
    collectionHandle: "gaming-rigs",
    gender: Gender.UNISEX,
    sport: "Gaming",
    isFeatured: false,
    isNew: false,
    price: 199,
    compareAt: null,
    colorName: "Black",
    colorHex: "#111111",
    size: "One Size",
    inventory: 5,
    images: [{ url: imgPdp(B.rolling), isPrimary: true }],
  },
  {
    name: 'Apple iPad Pro 13" M4',
    slug: "apple-ipad-pro-13-m4",
    description:
      "The thinnest Apple product ever made. Ultra Retina XDR OLED display. M4 chip with 10-core GPU. Apple Pencil Pro support. Sketch, edit, and animate anywhere.",
    brand: "Apple",
    categorySlug: "gadgets",
    collectionHandle: "new-arrivals",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: true,
    isNew: true,
    price: 1299,
    compareAt: null,
    colorName: "Silver",
    colorHex: "#e0e0e0",
    size: '13-inch',
    inventory: 13,
    images: [{ url: imgPdp(G.ipad), isPrimary: true }, { url: imgPdp(LS.designer) }],
  },
  {
    name: "Sony Alpha ZV-E10 II",
    slug: "sony-alpha-zve10-ii",
    description:
      "APS-C sensor optimized for creators. 4K 60fps. AI Subject Recognition autofocus. Vari-angle touchscreen. The content creator's first serious camera that won't break their budget.",
    brand: "Sony",
    categorySlug: "gadgets",
    collectionHandle: "creator-series",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: false,
    isNew: false,
    price: 749,
    compareAt: null,
    colorName: "Black",
    colorHex: "#111111",
    size: "Body",
    inventory: 10,
    images: [{ url: imgPdp(G.camera), isPrimary: true }, { url: imgPdp(LS.photographer) }],
  },
  {
    name: "PlayStation DualSense Edge Controller",
    slug: "ps-dualsense-edge-controller",
    description:
      "Customizable stick caps, back buttons, and trigger stops. Remappable controls. Built-in profiles. The pro controller for creators who also happen to game seriously.",
    brand: "PlayStation",
    categorySlug: "gadgets",
    collectionHandle: "gaming-rigs",
    gender: Gender.UNISEX,
    sport: "Gaming",
    isFeatured: false,
    isNew: false,
    price: 199,
    compareAt: null,
    colorName: "White",
    colorHex: "#f5f5f5",
    size: "One Size",
    inventory: 24,
    images: [{ url: imgPdp(G.controller), isPrimary: true }, { url: imgPdp(LS.gamer) }],
  },
  {
    name: "Apple Watch Ultra 2",
    slug: "apple-watch-ultra-2",
    description:
      "49mm titanium case. 36-hour battery life. Precision GPS with up to 86% better accuracy. Sapphire front crystal. For the creator who doesn't stop at the studio door.",
    brand: "Apple",
    categorySlug: "gadgets",
    collectionHandle: "new-arrivals",
    gender: Gender.UNISEX,
    sport: null,
    isFeatured: false,
    isNew: false,
    price: 799,
    compareAt: null,
    colorName: "Natural Titanium",
    colorHex: "#c4b8a8",
    size: "49mm",
    inventory: 8,
    images: [{ url: imgPdp(G.watch), isPrimary: true }],
  },
];

async function main() {
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const [catLaptops, catAccessories, catBags, catGadgets] = await Promise.all([
    prisma.category.create({ data: { name: "Laptops", slug: "laptops", displayOrder: 1 } }),
    prisma.category.create({ data: { name: "Accessories", slug: "accessories", displayOrder: 2 } }),
    prisma.category.create({ data: { name: "Laptop Bags", slug: "laptop-bags", displayOrder: 3 } }),
    prisma.category.create({ data: { name: "Gadgets", slug: "gadgets", displayOrder: 4 } }),
  ]);

  const categoryBySlug: Record<CatSlug, string> = {
    laptops: catLaptops.id,
    accessories: catAccessories.id,
    "laptop-bags": catBags.id,
    gadgets: catGadgets.id,
  };

  const collectionRows = await prisma.$transaction([
    prisma.collection.create({
      data: { name: "Creator Series", handle: "creator-series", sortOrder: 1, isActive: true },
    }),
    prisma.collection.create({
      data: { name: "Gaming Rigs", handle: "gaming-rigs", sortOrder: 2, isActive: true },
    }),
    prisma.collection.create({
      data: { name: "Everyday Carry", handle: "everyday-carry", sortOrder: 3, isActive: true },
    }),
    prisma.collection.create({
      data: { name: "Budget Picks", handle: "budget-picks", sortOrder: 4, isActive: true },
    }),
    prisma.collection.create({
      data: { name: "New Arrivals", handle: "new-arrivals", sortOrder: 5, isActive: true },
    }),
  ]);

  const collectionByHandle = Object.fromEntries(collectionRows.map((c) => [c.handle, c.id])) as Record<
    string,
    string
  >;

  for (const p of products) {
    const collectionId = p.collectionHandle ? collectionByHandle[p.collectionHandle] ?? null : null;
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId: categoryBySlug[p.categorySlug],
        collectionId,
        brand: p.brand,
        gender: p.gender,
        sport: p.sport ?? null,
        isFeatured: p.isFeatured ?? false,
        isNew: p.isNew ?? false,
        isActive: true,
      },
    });

    const sku = `QR-${p.slug.replace(/-/g, "").toUpperCase().slice(0, 24)}`;

    await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku,
        colorName: p.colorName,
        colorHex: p.colorHex ?? null,
        size: p.size,
        price: p.price,
        compareAtPrice: p.compareAt ?? null,
        inventoryCount: p.inventory,
      },
    });

    let order = 0;
    for (const im of p.images) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: im.url,
          displayOrder: order,
          isPrimary: im.isPrimary ?? order === 0,
        },
      });
      order += 1;
    }
  }

  const adminHash = await bcrypt.hash("QuantumAdmin2025!", 12);
  const userHash = await bcrypt.hash("Password123", 12);

  await prisma.user.create({
    data: {
      email: "admin@quantumrazer.com",
      passwordHash: adminHash,
      firstName: "Admin",
      lastName: "QR",
      isAdmin: true,
    },
  });

  const members = await Promise.all(
    Array.from({ length: 9 }).map((_, idx) =>
      prisma.user.create({
        data: {
          email: `member${idx + 1}@example.com`,
          passwordHash: userHash,
          firstName: `Member${idx + 1}`,
          lastName: "Test",
        },
      }),
    ),
  );

  const allProducts = await prisma.product.findMany({ select: { id: true } });
  const allUsers = await prisma.user.findMany();

  const reviewKeys = new Set<string>();
  for (let r = 0; r < 50; r++) {
    const p = allProducts[r % allProducts.length];
    const u = allUsers[r % allUsers.length];
    const key = `${p.id}:${u.id}`;
    if (reviewKeys.has(key)) continue;
    reviewKeys.add(key);
    await prisma.review.create({
      data: {
        productId: p.id,
        userId: u.id,
        rating: 3 + (r % 3),
        title: ["Great gear", "Love it", "Solid buy", "Daily driver"][r % 4],
        body: "Comfortable for long sessions. True to expectations.",
        isVerifiedPurchase: r % 2 === 0,
        helpfulCount: r % 12,
      },
    });
  }

  const statuses = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
  ];

  const variants = await prisma.productVariant.findMany({
    take: 24,
    include: { product: true },
  });

  for (let o = 0; o < 8; o++) {
    const buyer = members[o % members.length];
    const v = variants[o % variants.length];
    const subtotal = Number(v.price);
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = subtotal + tax;
    const st = statuses[o % statuses.length];
    await prisma.order.create({
      data: {
        orderNumber: `QR${100000 + o}`,
        userId: buyer.id,
        status: st,
        subtotal,
        shippingCost: 0,
        tax,
        total,
        trackingNumber: st === OrderStatus.SHIPPED || st === OrderStatus.DELIVERED ? `1Z999AA1${o}00000000` : null,
        shippingAddress: {
          firstName: buyer.firstName,
          lastName: buyer.lastName,
          addressLine1: "1 Test St",
          city: "Portland",
          state: "OR",
          postalCode: "97201",
          country: "US",
        },
        items: {
          create: [
            {
              variantId: v.id,
              productName: v.product.name,
              variantSku: v.sku,
              colorName: v.colorName,
              size: v.size,
              quantity: 1,
              unitPrice: v.price,
              totalPrice: v.price,
            },
          ],
        },
      },
    });
  }

  console.log("Seed complete.");
  console.log("Admin: admin@quantumrazer.com");
  console.log("Password: QuantumAdmin2025!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
