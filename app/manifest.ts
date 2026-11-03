import type { MetadataRoute } from "next";
import { brand } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${brand.name} · Island Retreat`,
    short_name: brand.name,
    description: brand.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    categories: ["travel", "lifestyle"],
    background_color: "#f4f1ea",
    theme_color: "#0f1e2e",
    shortcuts: [
      { name: "Book direct", short_name: "Book", url: "/book" },
      { name: "Rates and seasons", short_name: "Rates", url: "/rates" },
      { name: "Island Retreat", short_name: "The home", url: "/island-retreat" },
      { name: "Okaloosa Island guide", short_name: "Area", url: "/area" },
    ],
    icons: [
      { src: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/pwa/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/pwa/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/pwa/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
