/**
 * Launch audit for the owner (Matthew). Rendered at /audit and mirrored in
 * content/AUDIT.md. "Today" means the state before this prototype: no site,
 * listings only on the platforms.
 */
export const audit = {
  date: "2026-11-03",
  intro:
    "Gulf Coast Stays has no site yet, so this audit compares the platform-only path a guest takes today with the direct path this prototype opens. Every row has a Try it link into the live prototype.",
  loses: [
    "Every booking pays a platform service fee (guest side 12 to 15% on Airbnb, Vrbo similar). On a $31K year that is roughly $4K of guest money that never reaches the price you could charge.",
    "Repeat guests have nowhere to come back to. The relationship belongs to the platform.",
    "Search finds Fort Walton Beach condos on Airbnb, not Island Retreat. The name builds no equity.",
    "Snowbird months (the best winter revenue) are awkward on nightly platforms and get no landing page.",
    "No way to answer 'is it on the water?' before the question costs you a bad review.",
  ],
  flows: [
    { step: "Find the home", today: "Scroll past 300 Fort Walton Beach listings on Airbnb", now: "gulfcoaststays.co/island-retreat with its own badge, straight-talk copy and schema markup", href: "/island-retreat" },
    { step: "See the price", today: "Enter dates, wait for the fee breakdown, do the math", now: "Rates page lists every season, event and discount with no login", href: "/rates" },
    { step: "Book", today: "Platform checkout plus service fee", now: "Pick dates, see the exact total, request in 30 seconds; no fee", href: "/book" },
    { step: "Ask something", today: "Platform inbox, 24-hour response window", now: "Ask drawer answers the FAQ instantly and routes the rest to bookings@", href: "/area" },
    { step: "A month in winter", today: "Not offered", now: "Snowbird rates on the rates page and a one-tap request", href: "/rates#monthly" },
    { step: "Come back next year", today: "Search again", now: "Installed app on the home screen, works on the beach with one bar", href: "/more" },
  ],
  phases: [
    { name: "Phase 1 (this prototype)", items: ["Brand site and installable PWA", "Rates from the pricing plan", "Booking requests to email or Slack", "Search Console ready, noindex until launch"] },
    { name: "Phase 2 (launch)", items: ["Real photos in every slot", "LLC name, phone, cancellation policy filled in", "gulfcoaststays.co pointed at Vercel, indexing on, sitemap submitted", "Airbnb and Vrbo listings live with links back"] },
    { name: "Phase 3 (StayOS)", items: ["Live calendar synced with the platforms", "Instant booking with card payment", "Guest portal: door code, house guide, local picks", "Second home joins the collection"] },
  ],
  decisions: [
    "Phone number for the site (a Google Voice number on bookings@ is fine).",
    "Cancellation policy: moderate (full refund 14 days out) or strict?",
    "Pets: HOA says no? Confirm.",
    "Confirm festival dates (Billy Bowlegs, Destin Seafood) before rates publish.",
    "LLC name and filing date so the footer can say it.",
  ],
};
