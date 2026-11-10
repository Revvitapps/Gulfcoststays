import type { MetadataRoute } from "next";
import { abs, pages } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((p) => ({
    url: abs(p.path),
    lastModified: p.updated,
    changeFrequency: p.path === "/rates" ? "weekly" : "monthly",
    priority: p.path === "/" ? 1 : p.path === "/island-retreat" || p.path === "/book" ? 0.9 : 0.6,
    ...(p.images.length ? { images: [...new Set(p.images)].map(abs) } : {}),
  }));
}
