import { Gender, type PrismaClient } from "@prisma/client";

import { IMAGES, imgPdp } from "../lib/images";

type CatIds = { laptops: string; accessories: string; "laptop-bags": string };

const L = IMAGES.laptops;
const A = IMAGES.accessories;
const B = IMAGES.bags;
const LS = IMAGES.lifestyle;

/**
 * Twelve Quantum Razer catalogue additions (TSh amounts, currency TSH).
 * Upsert by slug so re-runs are idempotent if products are not wiped.
 */
export async function seedTwelveTshProducts(prisma: PrismaClient, categoryBySlug: CatIds) {
  const common = { gender: Gender.UNISEX, isActive: true, currency: "TSH" };

  await prisma.product.upsert({
    where: { slug: "laptop-stand-aluminium" },
    update: {},
    create: {
      ...common,
      name: "Aluminium Laptop Stand",
      slug: "laptop-stand-aluminium",
      description:
        "Elevate your screen, save your neck. This adjustable aluminium laptop stand raises your display to eye level for a healthier posture. Compatible with all laptops up to 17\". Non-slip base, foldable for travel. The creator's desk essential.",
      brand: "Generic",
      categoryId: categoryBySlug.accessories,
      isFeatured: false,
      isNew: true,
      variants: {
        create: [
          {
            sku: "QR-STAND-SLV-001",
            colorName: "Silver",
            colorHex: "#C0C0C0",
            size: "Universal",
            price: 25_000,
            compareAtPrice: null,
            inventoryCount: 40,
          },
        ],
      },
      images: {
        create: [
          { url: imgPdp(A.laptopStand), isPrimary: true, displayOrder: 0 },
          { url: imgPdp(L.workspace), isPrimary: false, displayOrder: 1 },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "amaya-headphones-wireless" },
    update: {},
    create: {
      ...common,
      name: "Amaya Wireless Headphones",
      slug: "amaya-headphones-wireless",
      description:
        "Deep bass, crystal highs, and 30 hours of wireless freedom. Amaya over-ear headphones deliver premium audio for creators who need to hear every detail — in the studio, on the commute, or at the desk. Foldable design, built-in microphone, 40mm drivers.",
      brand: "Amaya",
      categoryId: categoryBySlug.accessories,
      isFeatured: true,
      isNew: true,
      variants: {
        create: [
          {
            sku: "QR-AMAYA-BLK-001",
            colorName: "Midnight Black",
            colorHex: "#111111",
            size: "One Size",
            price: 150_000,
            compareAtPrice: null,
            inventoryCount: 15,
          },
          {
            sku: "QR-AMAYA-WHT-001",
            colorName: "Pearl White",
            colorHex: "#F5F5F5",
            size: "One Size",
            price: 150_000,
            compareAtPrice: null,
            inventoryCount: 10,
          },
        ],
      },
      images: {
        create: [
          { url: imgPdp(A.headphonesBlack), isPrimary: true, displayOrder: 0 },
          { url: imgPdp(LS.producer), isPrimary: false, displayOrder: 1 },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "laptop-sleeve-neoprene" },
    update: {},
    create: {
      ...common,
      name: "Laptop Sleeve",
      slug: "laptop-sleeve-neoprene",
      description:
        "Clean. Minimal. Protective. A slim neoprene sleeve that slides into any bag and keeps your laptop scratch-free. Fits MacBook Pro, Dell XPS, and most 13–15\" laptops. Magnetic closure, soft inner lining.",
      brand: "Generic",
      categoryId: categoryBySlug["laptop-bags"],
      isFeatured: false,
      isNew: false,
      variants: {
        create: [
          {
            sku: "QR-SLEEVE-13-CHR",
            colorName: "Charcoal",
            colorHex: "#444444",
            size: "13 inch",
            price: 30_000,
            compareAtPrice: null,
            inventoryCount: 25,
          },
          {
            sku: "QR-SLEEVE-15-CHR",
            colorName: "Charcoal",
            colorHex: "#444444",
            size: "15 inch",
            price: 30_000,
            compareAtPrice: null,
            inventoryCount: 25,
          },
          {
            sku: "QR-SLEEVE-15-BLK",
            colorName: "Jet Black",
            colorHex: "#111111",
            size: "15 inch",
            price: 30_000,
            compareAtPrice: null,
            inventoryCount: 10,
          },
        ],
      },
      images: {
        create: [{ url: imgPdp(A.laptopSleeve), isPrimary: true, displayOrder: 0 }],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "gear-backpack-tech" },
    update: {},
    create: {
      ...common,
      name: "Gear Backpack",
      slug: "gear-backpack-tech",
      description:
        "Built for the daily carry. The Gear Backpack holds a 15.6\" laptop in its dedicated padded compartment, with multiple pockets for cables, chargers, and accessories. Durable water-resistant fabric. Ergonomic padded straps for all-day comfort.",
      brand: "Quantum Razer",
      categoryId: categoryBySlug["laptop-bags"],
      isFeatured: false,
      isNew: false,
      variants: {
        create: [
          {
            sku: "QR-GEAR-BLK-001",
            colorName: "Black",
            colorHex: "#111111",
            size: "One Size",
            price: 35_000,
            compareAtPrice: null,
            inventoryCount: 35,
          },
        ],
      },
      images: {
        create: [
          { url: imgPdp(B.gearBackpack), isPrimary: true, displayOrder: 0 },
          { url: imgPdp(B.lifestyle), isPrimary: false, displayOrder: 1 },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "wesley-backpack-premium" },
    update: {},
    create: {
      ...common,
      name: "Wesley Backpack",
      slug: "wesley-backpack-premium",
      description:
        "The Wesley is for the creator who means business. Full-grain leather accents, premium canvas body, and a dedicated 16\" laptop compartment with foam padding. USB charging port, anti-theft rear pocket, 30L capacity. Designed to last years, not seasons.",
      brand: "Wesley",
      categoryId: categoryBySlug["laptop-bags"],
      isFeatured: true,
      isNew: false,
      variants: {
        create: [
          {
            sku: "QR-WESLEY-TAN-001",
            colorName: "Tan Brown",
            colorHex: "#8B6914",
            size: "One Size",
            price: 60_000,
            compareAtPrice: null,
            inventoryCount: 12,
          },
          {
            sku: "QR-WESLEY-BLK-001",
            colorName: "Jet Black",
            colorHex: "#111111",
            size: "One Size",
            price: 60_000,
            compareAtPrice: null,
            inventoryCount: 8,
          },
        ],
      },
      images: {
        create: [
          { url: imgPdp(B.wesleyBackpack), isPrimary: true, displayOrder: 0 },
          { url: imgPdp(LS.africanDev), isPrimary: false, displayOrder: 1 },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "kisonli-desktop-speakers" },
    update: {},
    create: {
      ...common,
      name: "Kisonli Desktop Speakers",
      slug: "kisonli-desktop-speakers",
      description:
        "Fill your room with sound. Kisonli stereo desktop speakers deliver clear, balanced audio for music, films, and video calls. 3.5mm AUX input — plug into any laptop, phone, or tablet instantly. Compact footprint, powerful output for its size. Perfect for the creative desk setup.",
      brand: "Kisonli",
      categoryId: categoryBySlug.accessories,
      isFeatured: false,
      isNew: false,
      variants: {
        create: [
          {
            sku: "QR-KISONLI-BLK-001",
            colorName: "Black",
            colorHex: "#1a1a1a",
            size: "One Size",
            price: 35_000,
            compareAtPrice: null,
            inventoryCount: 30,
          },
        ],
      },
      images: {
        create: [
          { url: imgPdp(A.kisonliSpeaker), isPrimary: true, displayOrder: 0 },
          { url: imgPdp(LS.producer), isPrimary: false, displayOrder: 1 },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "x2-wireless-mouse" },
    update: {},
    create: {
      ...common,
      name: "X2 Wireless Mouse",
      slug: "x2-wireless-mouse",
      description:
        "Silent clicks, smooth tracking, full freedom. The X2 wireless mouse connects via 2.4GHz USB nano-receiver with 10m range. Adjustable 1600 DPI, 6 programmable buttons, 12-month battery life. Ambidextrous ergonomic design — works on any surface.",
      brand: "X2",
      categoryId: categoryBySlug.accessories,
      isFeatured: false,
      isNew: true,
      variants: {
        create: [
          {
            sku: "QR-X2MOUSE-BLK",
            colorName: "Black",
            colorHex: "#111111",
            size: "One Size",
            price: 25_000,
            compareAtPrice: null,
            inventoryCount: 30,
          },
          {
            sku: "QR-X2MOUSE-WHT",
            colorName: "White",
            colorHex: "#EEEEEE",
            size: "One Size",
            price: 25_000,
            compareAtPrice: null,
            inventoryCount: 20,
          },
        ],
      },
      images: {
        create: [
          { url: imgPdp(A.wirelessMouse), isPrimary: true, displayOrder: 0 },
          { url: imgPdp(LS.developer), isPrimary: false, displayOrder: 1 },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "usb-flash-drive-32gb" },
    update: {},
    create: {
      ...common,
      name: "USB Flash Drive",
      slug: "usb-flash-drive-32gb",
      description:
        "Fast, small, always ready. USB 3.0 flash drive with read speeds up to 100MB/s. Compatible with Windows, Mac, and Linux. Cap-free retractable design means you never lose the lid. Available in 32GB and 64GB.",
      brand: "Generic",
      categoryId: categoryBySlug.accessories,
      isFeatured: false,
      isNew: false,
      variants: {
        create: [
          {
            sku: "QR-FLASH-32GB",
            colorName: "Silver",
            colorHex: "#C0C0C0",
            size: "32GB",
            price: 10_000,
            compareAtPrice: null,
            inventoryCount: 40,
          },
          {
            sku: "QR-FLASH-64GB",
            colorName: "Silver",
            colorHex: "#C0C0C0",
            size: "64GB",
            price: 10_000,
            compareAtPrice: null,
            inventoryCount: 40,
          },
        ],
      },
      images: {
        create: [{ url: imgPdp(A.flashDrive), isPrimary: true, displayOrder: 0 }],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "lenovo-thinkpad-x1-yoga-gen6" },
    update: {},
    create: {
      ...common,
      name: "Lenovo ThinkPad X1 Yoga Gen 6",
      slug: "lenovo-thinkpad-x1-yoga-gen6",
      description:
        "The premium 2-in-1 business convertible — laptop, tablet, tent, and stand modes in one machine. 14\" FHD+ 16:10 IPS touchscreen, Intel Core i7 11th Gen, 16GB RAM, 512GB PCIe NVMe SSD. Garaged rechargeable pen included. MIL-SPEC durability, up to 16 hours battery. Intel Evo certified. Storm Grey.",
      brand: "Lenovo",
      categoryId: categoryBySlug.laptops,
      isFeatured: true,
      isNew: false,
      variants: {
        create: [
          {
            sku: "QR-X1YOGA-I7-16-512",
            colorName: "Storm Grey",
            colorHex: "#6E7F80",
            size: "i7 · 16GB · 512GB",
            price: 650_000,
            compareAtPrice: null,
            inventoryCount: 5,
          },
          {
            sku: "QR-X1YOGA-I5-16-256",
            colorName: "Storm Grey",
            colorHex: "#6E7F80",
            size: "i5 · 16GB · 256GB",
            price: 650_000,
            compareAtPrice: null,
            inventoryCount: 3,
          },
        ],
      },
      images: {
        create: [
          { url: imgPdp(L.lenovoX1Yoga), isPrimary: true, displayOrder: 0 },
          { url: imgPdp(L.lenovo), isPrimary: false, displayOrder: 1 },
          { url: imgPdp(LS.africanDev), isPrimary: false, displayOrder: 2 },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "hp-elitebook-845-g7" },
    update: {},
    create: {
      ...common,
      name: "HP EliteBook 845 G7",
      slug: "hp-elitebook-845-g7",
      description:
        "Business-grade durability meets AMD Ryzen power. The EliteBook 845 G7 features AMD Ryzen 7 PRO 4750U (8 cores), 16GB DDR4 RAM, 512GB NVMe SSD, and a 14\" FHD IPS anti-glare display. Wi-Fi 6, fingerprint reader, optional HP Sure View privacy screen, and up to 26 hours battery life. MIL-STD 810H tested.",
      brand: "HP",
      categoryId: categoryBySlug.laptops,
      isFeatured: true,
      isNew: false,
      variants: {
        create: [
          {
            sku: "QR-HP845G7-R7-16-512",
            colorName: "Silver",
            colorHex: "#BDBDBD",
            size: "Ryzen 7 · 16GB · 512GB",
            price: 880_000,
            compareAtPrice: null,
            inventoryCount: 4,
          },
          {
            sku: "QR-HP845G7-R5-16-256",
            colorName: "Silver",
            colorHex: "#BDBDBD",
            size: "Ryzen 5 · 16GB · 256GB",
            price: 880_000,
            compareAtPrice: null,
            inventoryCount: 2,
          },
        ],
      },
      images: {
        create: [
          { url: imgPdp(L.hpElitebook), isPrimary: true, displayOrder: 0 },
          { url: imgPdp(L.dellXps), isPrimary: false, displayOrder: 1 },
          { url: imgPdp(LS.developer), isPrimary: false, displayOrder: 2 },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "microsoft-surface-laptop-4" },
    update: {},
    create: {
      ...common,
      name: "Microsoft Surface Laptop 4",
      slug: "microsoft-surface-laptop-4",
      description:
        "Elegance and performance in a laptop that lasts all day. The Surface Laptop 4 features a stunning 13.5\" PixelSense touchscreen (2256 x 1504), AMD Ryzen 5 4680U, 16GB RAM, and 512GB SSD. Ultra-slim Alcantara keyboard deck, up to 19 hours battery, Wi-Fi 6, and Windows 11. The designer's daily driver.",
      brand: "Microsoft",
      categoryId: categoryBySlug.laptops,
      isFeatured: true,
      isNew: false,
      variants: {
        create: [
          {
            sku: "QR-SURF4-R5-16-512-PLT",
            colorName: "Platinum",
            colorHex: "#D6D6D6",
            size: "Ryzen 5 · 16GB · 512GB",
            price: 1_100_000,
            compareAtPrice: null,
            inventoryCount: 3,
          },
          {
            sku: "QR-SURF4-R5-16-512-BLK",
            colorName: "Matte Black",
            colorHex: "#1a1a1a",
            size: "Ryzen 5 · 16GB · 512GB",
            price: 1_100_000,
            compareAtPrice: null,
            inventoryCount: 2,
          },
        ],
      },
      images: {
        create: [
          { url: imgPdp(L.microsoftSurface), isPrimary: true, displayOrder: 0 },
          { url: imgPdp(L.ultrabook), isPrimary: false, displayOrder: 1 },
          { url: imgPdp(LS.womanDesign), isPrimary: false, displayOrder: 2 },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "asus-tuf-27-inch-monitor" },
    update: {},
    create: {
      ...common,
      name: 'ASUS TUF Gaming VG27AQ 27" Monitor',
      slug: "asus-tuf-27-inch-monitor",
      description:
        "27 inches of pure clarity for creators and gamers. WQHD 2560×1440 IPS panel, 165Hz refresh rate, 1ms MPRT response time, HDR10 support, and G-Sync compatible. ELMB-SYNC eliminates ghosting. Two HDMI 2.0 ports plus DisplayPort 1.2. Built for those who demand more from their display.",
      brand: "ASUS",
      categoryId: categoryBySlug.accessories,
      isFeatured: true,
      isNew: true,
      variants: {
        create: [
          {
            sku: "QR-ASUSTUF-27-VG27AQ",
            colorName: "Black",
            colorHex: "#111111",
            size: "27 inch · 2K · 165Hz",
            price: 850_000,
            compareAtPrice: null,
            inventoryCount: 7,
          },
        ],
      },
      images: {
        create: [
          { url: imgPdp(A.asusTufMonitor), isPrimary: true, displayOrder: 0 },
          { url: imgPdp(LS.dualMonitor), isPrimary: false, displayOrder: 1 },
        ],
      },
    },
  });
}
