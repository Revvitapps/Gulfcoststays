import plan from "./island-retreat.json";

/**
 * Island Retreat facts. Everything here is from Matthew's brief and the pricing
 * plan (properties/island-retreat/island-retreat.json). Items marked
 * [PLACEHOLDER] are not confirmed and render visibly as such.
 */
export const property = {
  slug: "island-retreat",
  name: plan.property_name,
  collection: plan.collection,
  tagline: plan.tagline,
  // The street address is not published on the site (short-term rental safety); it goes in the booking confirmation.
  area: "Okaloosa Island, Fort Walton Beach, FL",
  summary:
    "A two-bedroom condo on stilts in a low-rise old-Florida courtyard complex on Okaloosa Island. Public beach access is across the street, the boat basin and the bay are a short walk the other way.",
  bedrooms: 2,
  bathrooms: "[PLACEHOLDER: baths]",
  sleeps: 6, // [PLACEHOLDER] assumed 2 bedrooms + sleeper; confirm
  sleepsNote: "[PLACEHOLDER: confirm sleeping arrangements]",
  checkIn: "16:00",
  checkOut: "10:00",
  minNightsDefault: 2,
  pets: false,
  smoking: false,
  parking: "One marked spot under the building, painted Apt 1. [PLACEHOLDER: second car]",
  wifi: "[PLACEHOLDER: Wi-Fi speed]",
  features: [
    { title: "Across from the beach", detail: "Public Gulf beach access is across Santa Rosa Blvd." },
    { title: "Walk to the bay", detail: "Okaloosa Island Boat Basin and the sound are a short walk the other way." },
    { title: "Raised on stilts", detail: "Center building, first floor. Your parking spot and picnic tables underneath, out of the sun." },
    { title: "Two real bedrooms", detail: "Not a studio with a curtain. [PLACEHOLDER: bed sizes]" },
    { title: "Near the Gulfarium", detail: "The Gulfarium, Boardwalk and Brooks Bridge are minutes away." },
    { title: "Quiet complex", detail: "Six units, two floors, courtyard parking. Long-term neighbours, not a party tower." },
  ],
  honest: [
    "Not waterfront. You walk to the water, both ways.",
    "Older, low-rise complex, not a resort. No pool, no elevator.",
    "A lived-in island neighborhood, not a resort strip. Locals, boats and a quiet street.",
  ],
  photoSlots: [
    { key: "hero", label: "Exterior at golden hour, from the courtyard" },
    { key: "living", label: "Living room toward the windows" },
    { key: "kitchen", label: "Kitchen, counter forward" },
    { key: "bed1", label: "Bedroom one, bed made, lamps on" },
    { key: "bed2", label: "Bedroom two" },
    { key: "deck", label: "Courtyard, stairs and the palm" },
    { key: "beachWalk", label: "The beach access across the street" },
    { key: "bayWalk", label: "The boat basin at sunset" },
  ],
  nearby: [
    { name: "Public beach access", distance: "Across the street", kind: "beach" },
    { name: "Okaloosa Island Boat Basin", distance: "Short walk", kind: "water" },
    { name: "Gulfarium Marine Adventure Park", distance: "Minutes by car", kind: "fun" },
    { name: "Okaloosa Island Boardwalk & Pier", distance: "Minutes by car", kind: "fun" },
    { name: "Stewby's Seafood Shanty", distance: "Minutes by car", kind: "food" },
    { name: "Brooks Bridge to downtown Fort Walton Beach", distance: "Minutes by car", kind: "town" },
  ],
  plan,
};

export type Property = typeof property;
