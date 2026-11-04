import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

// Photos, icons and brand files never change under the same name.
const immutable = { key: "Cache-Control", value: "public, max-age=31536000, immutable" };

// Gulf Coast Stays has no previous site, so there are no legacy paths to
// redirect. Short links used on printed material live here instead.
const shortLinks = [
  { source: "/ir", destination: "/island-retreat" },
  { source: "/stay", destination: "/island-retreat" },
  { source: "/book-now", destination: "/book" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560, 3840],
    qualities: [75, 90],
    minimumCacheTTL: 2678400,
  },
  poweredByHeader: false,
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/photos/:path*", headers: [immutable] },
      { source: "/brand/:path*", headers: [immutable] },
      { source: "/pwa/:path*", headers: [immutable] },
      { source: "/sw.js", headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }] },
    ];
  },
  async redirects() {
    return shortLinks.map((r) => ({ ...r, permanent: true }));
  },
};

export default nextConfig;
