import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo>; the Pages workflow sets PAGES_BASE_PATH.
const basePath = process.env.PAGES_BASE_PATH ?? "";
const isPages = basePath !== "";

const nextConfig: NextConfig = {
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // NEXT_DIST lets a production build live beside the dev server's .next (used for video capture)
  // static export writes into distDir, so Pages builds go straight to out/
  distDir: process.env.NEXT_DIST || (isPages ? "out" : ".next"),
  ...(isPages && { output: "export", trailingSlash: true }),
  images: {
    formats: ["image/avif", "image/webp"],
    // static hosting has no image optimizer
    unoptimized: isPages,
  },
};

export default nextConfig;
