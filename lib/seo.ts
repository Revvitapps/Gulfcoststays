import type { Metadata } from "next";
import { brand, contact, siteUrl } from "@/lib/site";
import { property } from "@/data/property";
import { photos, sketches, tour } from "@/lib/photos";
import { spots } from "@/lib/area";

/**
 * Search indexing. On by default for the Vercel production deployment
 * (gulfcoaststays.co), off everywhere else: previews, local builds, and any
 * *.vercel.app host (next.config.ts sends X-Robots-Tag there, robots.ts
 * disallows it). SITE_INDEXING=on forces it on, SITE_INDEXING=off is the kill
 * switch. Keep this expression in step with next.config.ts.
 */
export const indexable =
  process.env.SITE_INDEXING === "on" || (process.env.SITE_INDEXING !== "off" && process.env.VERCEL_ENV === "production");
export { siteUrl };
export const abs = (path: string) => new URL(path, siteUrl).toString();

/** Personal or internal routes that stay out of search even when indexing is on. */
export const privateRoutes = ["/api/", "/audit", "/more", "/thanks"];

type Img = { url: string; width: number; height: number; alt: string };
const ogDefault: Img = { url: "/pwa/og-default.png", width: 1200, height: 630, alt: `${brand.name}: ${brand.tagline}` };
const ogCourtyard: Img = { url: "/photos/courtyard.jpg", width: 2752, height: 1446, alt: photos.deck.alt };
const ogBeach: Img = { url: "/photos/beach-walk.jpg", width: 2264, height: 1700, alt: photos.beachWalk.alt };

const real = (keys: string[]) => keys.flatMap((k) => {
  const art = sketches.find((a) => a.key === k);
  const photo = art ? photos[art.photo] : undefined;
  return [photo?.src, art?.src].filter((x): x is string => Boolean(x));
});

/**
 * Every public page: its search title, description, share image, crumb name,
 * sitemap photos and the date its content last changed. Update `updated` when
 * a page's copy, facts or photos change; it feeds sitemap.xml lastmod.
 */
export const pages = [
  {
    path: "/",
    crumb: "Home",
    title: "Fort Walton Beach Condo on Okaloosa Island | Gulf Coast Stays",
    absolute: true,
    description: brand.description,
    image: ogDefault,
    images: ["/brand/hero-sketch.jpg", ...real(["beachWalk", "living", "kitchen", "bed2"])],
    updated: "2026-11-10",
  },
  {
    path: "/island-retreat",
    crumb: property.name,
    title: "Island Retreat: 2-Bedroom Okaloosa Island Condo",
    description: "Island Retreat: a raised two-bedroom condo on Okaloosa Island. Beach access across the street, the boat basin a short walk, Gulfarium minutes away. Book direct.",
    image: ogCourtyard,
    images: real(tour),
    updated: "2026-11-10",
  },
  {
    path: "/rates",
    crumb: "Rates",
    title: "Fort Walton Beach Rental Rates: Price Your Dates",
    description: "Pick your dates and see the exact price for Island Retreat on Okaloosa Island, with discounts, the cleaning fee and what you save by booking direct. No login.",
    image: ogDefault,
    images: [],
    updated: "2026-11-10",
  },
  {
    path: "/book",
    crumb: "Book",
    title: "Book Island Retreat Direct, No Platform Fees",
    description: "Pick your dates, see the exact price with discounts and cleaning fee, and send a booking request for Island Retreat on Okaloosa Island. A person confirms by email.",
    image: ogDefault,
    images: [],
    updated: "2026-11-10",
  },
  {
    path: "/area",
    crumb: "Okaloosa Island guide",
    title: "Okaloosa Island Guide: Beach, Pier, Gulfarium, Food",
    description: "What's around Island Retreat on Okaloosa Island: the beach across the street, the boat basin, Gulfarium, the pier, Stewby's and downtown Fort Walton Beach.",
    image: ogBeach,
    images: spots.flatMap((s) => (s.photo ? real([sketches.find((a) => a.photo === s.photo)?.key ?? ""]) : [])),
    updated: "2026-11-10",
  },
  {
    path: "/faq",
    crumb: "Questions",
    title: "Okaloosa Island Vacation Rental FAQ",
    description: "Straight answers about Island Retreat on Okaloosa Island: the beach, bedrooms, parking, Wi-Fi, check-in, pets, minimum stays, fees and how to book direct.",
    image: ogBeach,
    images: [],
    updated: "2026-11-10",
  },
  {
    path: "/about",
    crumb: "About",
    title: "About Gulf Coast Stays | Vacation Homes on the Emerald Coast",
    absolute: true,
    description: "A small, owner-run collection of vacation homes on Florida's Gulf Coast, starting with Island Retreat in Fort Walton Beach. Direct booking, straight talk.",
    image: ogDefault,
    images: ["/brand/gcs-badge.webp"],
    updated: "2026-11-10",
  },
  {
    path: "/contact",
    crumb: "Contact",
    title: "Contact Gulf Coast Stays | Okaloosa Island Vacation Rental",
    absolute: true,
    description: "Email bookings@gulfcoaststays.co or send a note. Questions about Island Retreat, a group, a month-long stay, or a future home in the collection.",
    image: ogDefault,
    images: [],
    updated: "2026-11-10",
  },
  {
    path: "/privacy",
    crumb: "Privacy",
    title: "Privacy Policy",
    description: "How Gulf Coast Stays handles what you send through the booking and contact forms, what Vercel Analytics and Google Analytics measure, and how to opt out.",
    image: ogDefault,
    images: [],
    updated: "2026-11-10",
  },
] as const satisfies readonly {
  path: string; crumb: string; title: string; absolute?: boolean; description: string; image: Img; images: readonly string[]; updated: string;
}[];

export type PagePath = (typeof pages)[number]["path"];
export const publicRoutes = pages.map((p) => p.path);
export const pageFor = (path: PagePath) => pages.find((p) => p.path === path)!;
export const fullTitle = (p: { title: string; absolute?: boolean }) => (p.absolute ? p.title : `${p.title} | ${brand.name}`);

/**
 * Page metadata with its own canonical and share card. Next.js merges metadata
 * shallowly, so a page that set only `title` would inherit the root's og:title
 * and og:url; this writes every field from the page's own values.
 */
export function pageMetadata(path: PagePath): Metadata {
  const p = pageFor(path);
  const title = fullTitle(p);
  const image = { ...p.image, url: abs(p.image.url) };
  return {
    title: "absolute" in p && p.absolute ? { absolute: p.title } : p.title,
    description: p.description,
    alternates: { canonical: abs(p.path) },
    openGraph: { type: "website", siteName: brand.name, locale: "en_US", url: abs(p.path), title, description: p.description, images: [image] },
    twitter: { card: "summary_large_image", title, description: p.description, images: [image.url] },
  };
}

const orgId = abs("/#organization");
const siteId = abs("/#website");
const rentalId = abs("/island-retreat#rental");
const listingUrls = [contact.airbnb, contact.vrbo].filter(Boolean);
const socialUrls = [contact.facebook, contact.instagram].filter(Boolean);

/** Organization and WebSite, on every page. sameAs only lists profiles that exist. */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: brand.name,
        url: siteUrl,
        logo: abs("/pwa/icon-512.png"),
        image: abs("/brand/gcs-badge.webp"),
        description: brand.description,
        slogan: brand.tagline,
        email: contact.email,
        ...(contact.phone ? { telephone: contact.phone } : {}),
        areaServed: { "@type": "Place", name: "Fort Walton Beach, Florida" },
        ...(socialUrls.length || listingUrls.length ? { sameAs: [...socialUrls, ...listingUrls] } : {}),
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        url: siteUrl,
        name: brand.name,
        description: brand.description,
        inLanguage: "en-US",
        publisher: { "@id": orgId },
      },
    ],
  };
}

const bathrooms = parseInt(property.bathrooms, 10);

/** Island Retreat as a VacationRental. Facts come from data/property.ts only: no price, rating or street address. */
export function lodgingJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    "@id": rentalId,
    name: property.name,
    alternateName: `${property.name} by ${brand.name}`,
    identifier: property.slug,
    url: abs("/island-retreat"),
    description: property.summary,
    image: real(tour).filter((src) => !src.includes("/wc-")).map(abs),
    brand: { "@id": orgId },
    email: contact.email,
    ...(contact.phone ? { telephone: contact.phone } : {}),
    address: { "@type": "PostalAddress", addressLocality: "Fort Walton Beach", addressRegion: "FL", postalCode: "32548", addressCountry: "US" },
    containedInPlace: { "@type": "Place", name: "Okaloosa Island, Fort Walton Beach, Florida" },
    containsPlace: {
      "@type": "Accommodation",
      name: `${property.name}, two-bedroom condo`,
      numberOfRooms: property.bedrooms,
      numberOfBedrooms: property.bedrooms,
      ...(Number.isFinite(bathrooms) ? { numberOfBathroomsTotal: bathrooms } : {}),
      occupancy: { "@type": "QuantitativeValue", maxValue: property.sleeps },
    },
    amenityFeature: [
      ["Public Gulf beach access across the street", true],
      [`${property.wifi} internet`, true],
      [`TVs (${property.tvs})`, true],
      ["Beach chairs and towels", true],
      ["Kitchen with a full-size fridge and range", true],
      ["Parking spot under the building", true],
      ["Picnic tables under the building", true],
      ["Pool", false],
      ["Elevator", false],
      ["Washer and dryer in unit", false],
    ].map(([name, value]) => ({ "@type": "LocationFeatureSpecification", name, value })),
    petsAllowed: property.pets,
    smokingAllowed: property.smoking,
    checkinTime: `${property.checkIn}:00`,
    checkoutTime: `${property.checkOut}:00`,
    ...(listingUrls.length ? { sameAs: listingUrls } : {}),
  };
}

export function breadcrumbJsonLd(path: PagePath) {
  const p = pageFor(path);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
      { "@type": "ListItem", position: 2, name: p.crumb, item: abs(p.path) },
    ],
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a.replace(/\s*\[PLACEHOLDER:[^\]]*\]\s*/g, " ").trim() } })),
  };
}
