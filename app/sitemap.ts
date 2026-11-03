import type { MetadataRoute } from "next";
import { abs, publicRoutes } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((path) => ({
    url: abs(path),
    changeFrequency: path === "/rates" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/island-retreat" || path === "/book" ? 0.9 : 0.6,
  }));
}
