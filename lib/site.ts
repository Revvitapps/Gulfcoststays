/** Brand and contact facts. Anything missing is a visible placeholder, never invented. */
export const brand = {
  name: "Gulf Coast Stays",
  short: "GCS",
  collection: "Fort Walton Beach",
  tagline: "Walk to the Gulf beach one way, the bay the other.",
  description:
    "Gulf Coast Stays rents real homes on Florida's Emerald Coast, starting with Island Retreat on Okaloosa Island in Fort Walton Beach. Book direct and skip the platform fees.",
  legal: "Gulf Coast Stays LLC [PLACEHOLDER: pending Sunbiz filing]",
};

export const contact = {
  email: process.env.NEXT_PUBLIC_EMAIL || "bookings@gulfcoaststays.co",
  phone: process.env.NEXT_PUBLIC_PHONE || "",
  phoneLabel: process.env.NEXT_PUBLIC_PHONE || "[PLACEHOLDER: phone]",
  airbnb: process.env.NEXT_PUBLIC_AIRBNB_URL || "",
  vrbo: process.env.NEXT_PUBLIC_VRBO_URL || "",
  instagram: "",
  facebook: "",
};

export const siteUrl = "https://gulfcoaststays.co";
