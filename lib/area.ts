/**
 * Okaloosa Island guide. Only places Matthew named or that sit on the island
 * itself. Distances are described, not measured, until he confirms them.
 */
export type Spot = { name: string; kind: "beach" | "water" | "fun" | "food" | "town"; blurb: string; distance: string; photo?: string };

export const spots: Spot[] = [
  { name: "The beach across the street", kind: "beach", blurb: "Public Gulf access on Santa Rosa Blvd. Sugar sand, green water, no parking fight.", distance: "Across the street", photo: "beachWalk" },
  { name: "Okaloosa Island Boat Basin", kind: "water", blurb: "The bay side. Launch a kayak, watch the boats come in, catch the sunset.", distance: "Short walk", photo: "bayWalk" },
  { name: "Gulfarium Marine Adventure Park", kind: "fun", blurb: "Dolphins, sea lions and the sea turtle hospital. Half a day with kids.", distance: "Minutes by car", photo: "gulfarium" },
  { name: "Okaloosa Island Pier & Boardwalk", kind: "fun", blurb: "Fish the pier, eat on the Boardwalk, walk it off on the beach.", distance: "Minutes by car", photo: "pier" },
  { name: "Stewby's Seafood Shanty", kind: "food", blurb: "Fried shrimp, oysters and the catch of the day. Order at the window.", distance: "Minutes by car", photo: "food" },
  { name: "Downtown Fort Walton Beach", kind: "town", blurb: "Over Brooks Bridge: the Landing, the Indian Temple Mound, coffee and breweries.", distance: "Minutes by car", photo: "town" },
];

export const kinds: Record<Spot["kind"], string> = { beach: "Beach", water: "Bay", fun: "Fun", food: "Eat", town: "Town" };

export const faqs = [
  { q: "How far is the beach?", a: "Public Gulf beach access is across Santa Rosa Blvd from the complex. The bay and boat basin are a short walk the other direction." },
  { q: "Is Island Retreat on the water?", a: "No. It sits between the Gulf and the bay on Okaloosa Island, a walk to either. That is why it costs less than the Gulf-front towers." },
  { q: "What are check-in and check-out?", a: "Check-in from 4 pm, check-out by 10 am. Early or late is sometimes possible; ask when you book." },
  { q: "Do you allow pets?", a: "Not at Island Retreat. [PLACEHOLDER: confirm HOA rule]" },
  { q: "Is there a minimum stay?", a: "Two nights in low season, three in spring and summer, four around the Fourth of July. The rates page shows every date." },
  { q: "Why book direct?", a: "No platform service fee, the same house, and you talk to the person who manages it. Weekly stays are 10% off, monthly 25% off, and launch pricing is 10% off through January 31, 2027." },
  { q: "What is the cleaning fee?", a: "One cleaning fee per stay, shown in your price when you pick dates. Lodging taxes are added as Florida and Okaloosa County require." },
];
