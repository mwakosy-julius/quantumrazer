import { Gender, OrderStatus, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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

  const shoes = await prisma.category.create({
    data: {
      name: "Shoes",
      slug: "shoes",
      displayOrder: 1,
      children: {
        create: [
          { name: "Running", slug: "running", displayOrder: 1 },
          { name: "Basketball", slug: "basketball", displayOrder: 2 },
          { name: "Casual", slug: "casual", displayOrder: 3 },
          { name: "Training", slug: "training", displayOrder: 4 },
        ],
      },
    },
    include: { children: true },
  });

  const runningCat = shoes.children.find((c) => c.slug === "running")!;

  const collections = await Promise.all([
    prisma.collection.create({ data: { name: "Air Max", handle: "air-max", sortOrder: 1, isActive: true } }),
    prisma.collection.create({ data: { name: "Jordan", handle: "jordan", sortOrder: 2, isActive: true } }),
    prisma.collection.create({ data: { name: "React", handle: "react", sortOrder: 3, isActive: true } }),
    prisma.collection.create({ data: { name: "Pegasus", handle: "pegasus", sortOrder: 4, isActive: true } }),
    prisma.collection.create({ data: { name: "Dri-FIT", handle: "dri-fit", sortOrder: 5, isActive: true } }),
    prisma.collection.create({ data: { name: "Tech Pack", handle: "tech-pack", sortOrder: 6, isActive: true } }),
  ]);

  const sizes = ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13"];
  const colorPairs = [
    ["Black", "#111111"],
    ["White", "#ffffff"],
    ["Volt", "#ceff00"],
    ["University Red", "#d43f21"],
    ["Royal Blue", "#4169e1"],
  ] as const;
  const genders = [Gender.MENS, Gender.WOMENS, Gender.UNISEX, Gender.KIDS];
  const sports = ["Running", "Basketball", "Training", "Casual", "Football", "Yoga"];

  for (let i = 0; i < 30; i++) {
    const slug = `quantum-runner-${i + 1}`;
    const product = await prisma.product.create({
      data: {
        name: `Quantum Runner ${i + 1}`,
        slug,
        description:
          "Lightweight cushioning with responsive foam. Built for everyday miles and bold style.",
        categoryId: runningCat.id,
        collectionId: collections[i % collections.length].id,
        brand: "Nike",
        gender: genders[i % genders.length],
        sport: sports[i % sports.length],
        isFeatured: i % 4 === 0,
        isNew: i % 5 === 0,
        isActive: true,
      },
    });

    const chosenColors = colorPairs.slice(0, 2 + (i % 3));
    for (const [colorName, colorHex] of chosenColors) {
      const sizeSubset = sizes.filter((_, idx) => idx % (2 + (i % 3)) === 0);
      for (const size of sizeSubset) {
        const price = 65 + ((i * 17 + size.length * 3) % 185);
        const compareAt = i % 3 === 0 ? price + 20 + (i % 30) : null;
        const inv = i % 11 === 0 ? 0 : (i + size.charCodeAt(0)) % 25;
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku: `${slug}-${colorName.slice(0, 3)}-${size}`.replace(/\s/g, ""),
            colorName,
            colorHex,
            size,
            price,
            compareAtPrice: compareAt,
            inventoryCount: inv,
            weightGrams: 280 + (i % 140),
          },
        });
      }
    }

    const variantCount = await prisma.productVariant.count({ where: { productId: product.id } });
    const imgCount = 5 + (i % 6);
    for (let k = 0; k < imgCount; k++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: `https://picsum.photos/seed/${slug}-${k}/800/800`,
          altText: `${product.name} view ${k + 1}`,
          displayOrder: k,
          isPrimary: k === 0,
        },
      });
    }
    void variantCount;
  }

  const adminHash = await bcrypt.hash("Admin123!", 12);
  const userHash = await bcrypt.hash("Password123", 12);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@store.com",
        passwordHash: adminHash,
        firstName: "Admin",
        lastName: "User",
        isAdmin: true,
      },
    }),
    ...Array.from({ length: 9 }).map((_, idx) =>
      prisma.user.create({
        data: {
          email: `member${idx + 1}@example.com`,
          passwordHash: userHash,
          firstName: `Member${idx + 1}`,
          lastName: "Test",
        },
      }),
    ),
  ]);

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
        title: ["Great fit", "Love them", "Solid shoe", "Daily driver"][r % 4],
        body: "Comfortable for long sessions. True to size for me.",
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

  for (let o = 0; o < 5; o++) {
    const buyer = users[1 + (o % (users.length - 1))];
    const variants = await prisma.productVariant.findMany({
      take: 8,
      skip: o * 2,
      include: { product: true },
    });
    const v = variants[o % variants.length];
    const subtotal = Number(v.price);
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = subtotal + tax;
    await prisma.order.create({
      data: {
        orderNumber: `NK${10000000 + o}`,
        userId: buyer.id,
        status: statuses[o % statuses.length],
        subtotal,
        shippingCost: 0,
        tax,
        total,
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

  console.log("Seed complete. Admin: admin@store.com / Admin123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
