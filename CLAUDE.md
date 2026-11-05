@AGENTS.md

# Gulf Coast Stays PWA

## 0. Status and decisions (update first)

- 2026-11-03: Prototype built from the brand kit; no live site existed. Island Retreat lives at `/island-retreat` on gulfcoaststays.co, not on its own domain (one domain collects reviews and search authority; future homes are more paths).
- 2026-11-03: Street address is not published on the site; it goes in the booking confirmation.
- 2026-11-03: Prices come only from `data/island-retreat.json` (the pricing plan). Change rates there, never in components. `npm run check:rates` guards the math.
- 2026-11-03: Booking is request-only until StayOS exposes availability and payment. `lib/booking.ts` is the adapter seam.
- 2026-11-04: Look is rustic old-Florida, not resort: paper grain, ink rules, watercolor washes, flat buttons, matted photos (brief: project-files gulf-coast-stays/brand/hero/rustic-direction.md). Home hero is the ink-and-watercolor courtyard sketch (`public/brand/hero-sketch.jpg`), navy headline on paper, full stretch. Layout is full bleed: no content width cap.
- 2026-11-05: Customer-facing. No season or nightly prices anywhere until a guest picks dates (`components/quote-widget.tsx` on /rates, `QuotePanel` on /book). Every quote shows the listing-site comparison at `PLATFORM_FEE` 15% (`lib/rates.ts`) and `DirectBenefits` runs on home, home page, rates and book. Placeholders are stripped from public copy by `lib/pub.ts`; the audit page still lists them. Five ink-and-watercolor sketches (`public/photos/wc-*.jpg`, `components/sketchbook.tsx`) are labelled as sketches, not photos.
- Indexing stays off (`SITE_INDEXING` unset) until Matthew says launch.

### Open questions for Matthew

See `content/AUDIT.md` → "Decisions needed": bed sizes and baths, phone number, cancellation policy, pets, festival dates, LLC name.

## 1. Brief

Umbrella brand Gulf Coast Stays (LLC pending), collection Fort Walton Beach, home Island Retreat (371 Bluefish Dr Apt 1, Okaloosa Island). Direct-booking PWA that later connects to StayOS. Voice: talk like the dock, not the front desk; short sentences, real distances; no "luxury", no "paradise"; search words in titles, not home names.

## 2. Working rules

- Never invent facts, photos, reviews or prices. Missing facts render as `[PLACEHOLDER]` (see `.placeholder` class) and go in the audit.
- Keep the tab bar, install prompt and service worker shell intact; bump `VERSION` in `public/sw.js` when precached pages change.
- Run `npm run check` and `npm run shots` before handing over; look at the screenshots.
- No secrets in the repo. Webhooks and tokens live in Vercel env.
