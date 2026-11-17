import type { NextConfig } from "next";

// Static export so the site can be served by Cloudflare (Workers static assets or Pages).
// `next build` writes the finished site to ./out
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Hide the Next.js dev-tools badge (bottom-left in `npm run dev`); it overlaps the mascot.
  devIndicators: false,
};

export default nextConfig;
