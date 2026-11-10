import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { indexable, privateRoutes, siteUrl } from "@/lib/seo";

// Search and AI answer engines are allowed on purpose: "best place to stay near
// the Gulfarium" is exactly the question a future guest asks an assistant.
// A crawler that matches a named group ignores the * group, so the named group
// repeats the private disallows.
const answerCrawlers = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot-Extended", "Bingbot", "DuckAssistBot", "CCBot", "meta-externalagent",
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Previews, local builds and every *.vercel.app host stay out of search.
  const host = (await headers()).get("host") ?? "";
  if (!indexable || host.endsWith(".vercel.app")) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: privateRoutes },
      { userAgent: answerCrawlers, allow: "/", disallow: privateRoutes },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
