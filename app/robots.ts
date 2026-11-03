import type { MetadataRoute } from "next";
import { indexable, privateRoutes, siteUrl } from "@/lib/seo";

// AI answer engines are allowed on purpose: "best place to stay near the
// Gulfarium" is exactly the question a future guest asks an assistant.
const aiCrawlers = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Claude-SearchBot", "Google-Extended", "Applebot-Extended"];

export default function robots(): MetadataRoute.Robots {
  if (!indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: privateRoutes },
      { userAgent: aiCrawlers, allow: "/", disallow: privateRoutes },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
