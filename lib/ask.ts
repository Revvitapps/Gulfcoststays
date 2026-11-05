/**
 * Scripted "Ask" helper. Every answer comes from the property file, the rate
 * plan or the FAQ. Anything about a specific stay, a deal, or someone's own
 * situation routes to a human (email or the booking form).
 */
export type Node = {
  id: string;
  prompt: string;
  options?: { label: string; next: string }[];
  answer?: string;
  action?: { label: string; href: string };
  human?: boolean;
};

export const askTree: Record<string, Node> = {
  start: {
    id: "start",
    prompt: "What can I help with?",
    options: [
      { label: "Where exactly is it?", next: "where" },
      { label: "How much for my dates?", next: "price" },
      { label: "Is it available?", next: "avail" },
      { label: "Who sleeps where?", next: "sleep" },
      { label: "Rules and fees", next: "rules" },
      { label: "Something else", next: "human" },
    ],
  },
  where: {
    id: "where",
    prompt: "Okaloosa Island, Fort Walton Beach. Public Gulf beach access is across Santa Rosa Blvd; the boat basin and bay are a short walk the other way. Not waterfront, and priced like it.",
    options: [
      { label: "What's nearby?", next: "nearby" },
      { label: "Back", next: "start" },
    ],
    action: { label: "See the area", href: "/area" },
  },
  nearby: {
    id: "nearby",
    prompt: "Gulfarium, the Okaloosa Island Pier and Boardwalk, Stewby's Seafood Shanty, and downtown Fort Walton Beach over Brooks Bridge are all minutes away.",
    options: [{ label: "Back", next: "start" }],
    action: { label: "Area guide", href: "/area" },
  },
  price: {
    id: "price",
    prompt: "Pick your dates and the exact price shows before you book: nightly rate, one cleaning fee, and lodging tax. Weekly stays are 10% off, monthly 25% off, and launch pricing takes another 10% off through January 31, 2027. Booking here skips the listing-site fee, about 15% on the same stay.",
    options: [{ label: "Back", next: "start" }],
    action: { label: "Quote my dates", href: "/book" },
  },
  avail: {
    id: "avail",
    prompt: "Send your dates and you get a yes or no within a few hours, usually faster. Nothing is charged until we confirm.",
    options: [{ label: "Back", next: "start" }],
    action: { label: "Send my dates", href: "/book" },
    human: true,
  },
  sleep: {
    id: "sleep",
    prompt: "Two real bedrooms with doors. Best for a couple, a family of four, or two friends who each want their own room.",
    options: [{ label: "Back", next: "start" }],
    action: { label: "See the home", href: "/island-retreat" },
  },
  rules: {
    id: "rules",
    prompt: "Check-in 4 pm, check-out 10 am. No pets, no smoking, no parties. One cleaning fee per stay, shown in your price. Minimum stay 2 to 4 nights depending on season.",
    options: [
      { label: "Cancellation?", next: "cancel" },
      { label: "Back", next: "start" },
    ],
  },
  cancel: {
    id: "cancel",
    prompt: "Our cancellation terms are in your booking confirmation. For anything about your own booking, email us and a person answers.",
    options: [{ label: "Back", next: "start" }],
    human: true,
  },
  human: {
    id: "human",
    prompt: "Email bookings@gulfcoaststays.co or send the form. A person answers, not a bot.",
    options: [{ label: "Back", next: "start" }],
    action: { label: "Contact us", href: "/contact" },
    human: true,
  },
};
