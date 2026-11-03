import { brand, contact, siteUrl } from "@/lib/site";
import { property } from "@/data/property";

/** SITE_INDEXING=on turns on robots, the sitemap and meta robots together. Off until launch. */
export const indexable = process.env.SITE_INDEXING === "on";
export { siteUrl };
export const abs = (path: string) => new URL(path, siteUrl).toString();

/** Routes that belong in search once indexing is on. */
export const publicRoutes = ["/", "/island-retreat", "/rates", "/book", "/area", "/about", "/contact"];
/** Personal or internal routes that stay out of search even when indexing is on. */
export const privateRoutes = ["/api/", "/audit", "/more", "/thanks"];

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: siteUrl,
    logo: abs("/pwa/icon-512.png"),
    email: contact.email,
    areaServed: "Fort Walton Beach, FL",
  };
}

export function lodgingJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: `${property.name} by ${brand.name}`,
    url: abs("/island-retreat"),
    description: property.summary,
    image: abs("/pwa/og-default.png"),
    brand: { "@type": "Brand", name: brand.name },
    address: { "@type": "PostalAddress", addressLocality: "Fort Walton Beach", addressRegion: "FL", postalCode: "32548", addressCountry: "US" },
    containsPlace: { "@type": "Accommodation", numberOfBedrooms: property.bedrooms, occupancy: { "@type": "QuantitativeValue", maxValue: property.sleeps } },
    petsAllowed: false,
    checkinTime: property.checkIn,
    checkoutTime: property.checkOut,
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
}
