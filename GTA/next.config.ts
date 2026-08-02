import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Art is served straight from the CDN / local /public — no server-side
    // optimization needed, which also keeps preview environments simple.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "*.fal.media" },
      { protocol: "https", hostname: "fal.media" },
    ],
  },
};

export default nextConfig;
