import { property } from "@/data/property";
import { contact } from "@/lib/site";
import { faqs as areaFaqs } from "@/lib/area";
import { pub } from "@/lib/pub";

/**
 * Questions travelers ask, answered only from facts already on the site
 * (data/property.ts, lib/area.ts, lib/ask.ts, the rate plan). The first
 * sentence of each answer is the direct answer, so answer engines can quote it.
 * Questions we cannot answer yet (bed sizes, cancellation policy, phone) are
 * left out and listed in CLAUDE.md for Matthew.
 */
const area = (q: string) => areaFaqs.find((f) => f.q === q)!.a;

export const faqGroups: { heading: string; items: { q: string; a: string }[] }[] = [
  {
    heading: "Where it is",
    items: [
      { q: "Where is Island Retreat?", a: `On Okaloosa Island in Fort Walton Beach, Florida, between the Gulf of Mexico and the bay. The street address comes with your booking confirmation.` },
      { q: "How far is the beach?", a: area("How far is the beach?") },
      { q: "Is Island Retreat on the water?", a: area("Is Island Retreat on the water?") },
      { q: "What is near Island Retreat?", a: "Gulfarium Marine Adventure Park, the Okaloosa Island Pier and Boardwalk, Stewby's Seafood Shanty, and downtown Fort Walton Beach over Brooks Bridge are all minutes away by car." },
    ],
  },
  {
    heading: "The home",
    items: [
      { q: "How many bedrooms and bathrooms does it have?", a: `Two bedrooms and two bathrooms. The master has its own bath; bedroom two is next to the hall bath with a tub. It sleeps up to ${property.sleeps}.` },
      { q: "Is there a pool or an elevator?", a: "No. Island Retreat is in an older, low-rise complex of six units, not a resort, so there is no pool and no elevator." },
      { q: "Is there Wi-Fi and TV?", a: `Yes. The home has ${property.wifi} internet and ${property.tvs} TVs: one in the living room and one in each bedroom.` },
      { q: "Is beach gear included?", a: "Yes. Beach chairs, beach towels and supplies hang on the coat tree by the door." },
      { q: "Is there parking?", a: pub(`Yes. ${property.parking}`) },
      { q: "Is there a washer and dryer?", a: "No. There is no laundry in the unit. Coin laundry and a laundromat are a short drive." },
    ],
  },
  {
    heading: "Rules",
    items: [
      { q: "What are check-in and check-out times?", a: area("What are check-in and check-out?") },
      { q: "Is there a minimum stay?", a: area("Is there a minimum stay?") },
      { q: "Are pets allowed?", a: "No. Pets are not allowed at Island Retreat." },
      { q: "Can I smoke or have a party?", a: "No. No smoking and no parties. It is a quiet complex with long-term neighbors." },
    ],
  },
  {
    heading: "Price and booking",
    items: [
      { q: "How much does Island Retreat cost?", a: "It depends on your dates. Pick dates on the Rates or Book page and the exact price shows: nightly rate, any discounts, one cleaning fee, and lodging tax. No login needed." },
      { q: "Why book direct instead of Airbnb or Vrbo?", a: area("Why book direct?") },
      { q: "Are there weekly or monthly discounts?", a: "Yes. Weekly stays (7+ nights) are 10% off and monthly stays (28+ nights) are 25% off. January and February go by the month." },
      { q: "What is the cleaning fee?", a: area("What is the cleaning fee?") },
      { q: "How do I book?", a: "Pick your dates on the Book page, see the exact price, and send a request. A person confirms by email, usually within a few hours, and nothing is charged until we confirm." },
      { q: "How do I contact Gulf Coast Stays?", a: `Email ${contact.email} or use the contact form. A person answers, not a bot.` },
    ],
  },
];

export const allFaqs = faqGroups.flatMap((g) => g.items.map((i) => ({ q: i.q, a: pub(i.a) })));
