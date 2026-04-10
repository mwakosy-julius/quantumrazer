/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Avoid webpack bundling native / Node-heavy deps into Route Handlers (fixes Vercel build for Stripe webhook).
    serverComponentsExternalPackages: ["@prisma/client", "prisma", "stripe"],
  },
  images: {
    domains: ["images.unsplash.com", "source.unsplash.com"],
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "videos.pexels.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
