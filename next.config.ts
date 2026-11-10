import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

// Search indexing: on for the Vercel production deployment, off for previews
// and local builds. Same rule as `indexable` in lib/seo.ts.
const indexable =
  process.env.SITE_INDEXING === "on" || (process.env.SITE_INDEXING !== "off" && process.env.VERCEL_ENV === "production");
const noindex = { key: "X-Robots-Tag", value: "noindex, nofollow" };

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
      // Every *.vercel.app host (previews and the production deployment's own
      // URLs) stays out of search; only gulfcoaststays.co is indexed.
      { source: "/:path*", has: [{ type: "host" as const, value: "(?<sub>.+)\\.vercel\\.app" }], headers: [noindex] },
      ...(indexable ? [] : [{ source: "/:path*", headers: [noindex] }]),
    ];
  },
  async redirects() {
    return shortLinks.map((r) => ({ ...r, permanent: true }));
  },
};

export default nextConfig;
