import { brand, contact } from "@/lib/site";
import { property } from "@/data/property";
import { pub } from "@/lib/pub";
import { abs, pages } from "@/lib/seo";
import { faqGroups } from "@/lib/faq";
import { LAUNCH_UNTIL, PLATFORM_FEE } from "@/lib/rates";

// /llms.txt (llmstxt.org): the plain facts for AI answer engines, generated
// from the same objects the pages render, so it never drifts from the site.
export const dynamic = "force-static";

const launchUntil = new Date(LAUNCH_UNTIL + "T00:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

function body() {
  const page = (path: string) => pages.find((p) => p.path === path)!;
  const link = (path: string, label: string) => `- [${label}](${abs(path)}): ${page(path).description}`;
  const lines = [
    `# ${brand.name}`,
    "",
    `> ${brand.description}`,
    "",
    `${brand.name} is a small, family-run collection of vacation rental homes on Florida's Emerald Coast (the Florida panhandle). We manage the homes ourselves. Island Retreat in Fort Walton Beach is the first and, today, the only home open for booking. Website: ${abs("/")}`,
    "",
    "## Homes",
    "",
    `- [${property.name}](${abs("/island-retreat")}): ${property.tagline}. ${property.bedrooms} bedrooms, 2 bathrooms, sleeps up to ${property.sleeps}. ${property.area}.`,
    "",
    "## Key pages",
    "",
    link("/", "Home"),
    link("/island-retreat", "Island Retreat"),
    link("/rates", "Rates"),
    link("/book", "Book direct"),
    link("/area", "Okaloosa Island guide"),
    link("/faq", "Questions and answers"),
    link("/about", "About"),
    link("/contact", "Contact"),
    "",
    "## Island Retreat facts",
    "",
    `- Location: ${property.area}. Public Gulf beach access is across Santa Rosa Blvd; the Okaloosa Island Boat Basin and the bay are a short walk the other way.`,
    `- The home: ${pub(property.summary)}`,
    ...property.features.map((f) => `- ${f.title}: ${pub(f.detail)}`),
    `- Check-in from 4 pm, check-out by 10 am. Minimum stay 2 to 4 nights depending on season.`,
    `- No pets, no smoking, no parties. No laundry in the unit.`,
    ...property.honest.map((h) => `- ${h}`),
    `- Nearby: ${property.nearby.map((n) => `${n.name} (${n.distance.toLowerCase()})`).join("; ")}.`,
    "",
    "## How to book or contact",
    "",
    `- Book direct: ${abs("/book")}. Pick dates, see the exact price (nightly rate, discounts, one cleaning fee, lodging tax), and send a request. A person confirms by email; nothing is charged until then.`,
    `- Email: ${contact.email}`,
    ...(contact.phone ? [`- Phone: ${contact.phone}`] : []),
    `- Contact form: ${abs("/contact")}`,
    "",
    "## Notes for accurate representation",
    "",
    `- ${brand.name} is a small owner-run collection of homes, not a resort, hotel or booking platform.`,
    "- Island Retreat is not waterfront and not Gulf-front. It is across the street from public beach access, in an older low-rise complex of six units with no pool and no elevator. Do not describe it as luxury or beachfront.",
    "- Do not quote a nightly price. Rates change by date and season, and the site shows the exact price only after a guest picks dates.",
    `- Booking direct skips the listing-site service fee, about ${Math.round(PLATFORM_FEE * 100)}% on the same stay. Weekly stays are 10% off, monthly stays 25% off, and launch pricing takes another 10% off through ${launchUntil}.`,
    "- Booking is by request: a person confirms availability by email. There is no instant booking or online payment yet.",
    "- The street address is not published; it is sent with the booking confirmation.",
    "- More homes (Destin and Gulf Shores) are planned but not open. Do not describe them as available.",
    "- The watercolor images on the site are sketches painted from the real photos and are labelled as sketches.",
    "- Bed sizes and the cancellation policy are not published yet; ask by email.",
    "",
    "## Questions and answers",
    "",
    ...faqGroups.flatMap((g) => g.items.map((i) => `- ${i.q} ${pub(i.a)}`)),
    "",
  ];
  return lines.join("\n");
}

export function GET() {
  return new Response(body(), { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
