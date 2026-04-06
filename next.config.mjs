/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Avoid webpack bundling native / Node-heavy deps into Route Handlers (fixes Vercel build for Stripe webhook).
    serverComponentsExternalPackages: ["@prisma/client", "prisma", "stripe"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
