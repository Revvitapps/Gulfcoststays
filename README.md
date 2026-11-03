# Gulf Coast Stays PWA

Installable, offline-first site for **Gulf Coast Stays** and its first home, **Island Retreat** (2-bedroom condo on Okaloosa Island, Fort Walton Beach, FL). Built from the brand kit in the project Library (`gulf-coast-stays/brand`, v3) on the Revvit PWA shell (Knot His storefront → VI.A). There was no previous site, so nothing was recovered; every fact comes from Matthew's brief and the pricing plan, and anything unconfirmed renders as a visible `[PLACEHOLDER]`.

## Run

Requires Node 20.9+.

```sh
npm install
npm run dev                  # http://localhost:3000 (service worker off in dev; LAN phones allowed)
npm run build && npm start   # production build, service worker on
npm run check                # typecheck, lint, rates, offline, routes, a11y
npm run shots                # Playwright screenshots + overflow + offline checks → docs/shots/
```

## Configuration

Copy `.env.example` to `.env.local`. Everything is optional; the app runs with none of it.

| Variable | Effect |
|---|---|
| `SITE_INDEXING=on` | Turns on robots, sitemap and meta robots together. Off by default (noindex) until launch. Needs a redeploy. |
| `PIPELINE_WEBHOOK_URL` | Booking requests, inquiries and Ask handoffs are POSTed here as JSON (`{text, contact}`); works with a Slack incoming webhook. Unset: logged on the server. |
| `STAYOS_API_URL`, `STAYOS_API_KEY` | Switches `lib/booking.ts` to the StayOS adapter (stub today). |
| `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_EMAIL` | Contact details. Email defaults to bookings@gulfcoaststays.co; phone shows a placeholder until set. |
| `NEXT_PUBLIC_AIRBNB_URL`, `NEXT_PUBLIC_VRBO_URL` | Platform links on the Book page once the listings are live. |

`GET /api/health` reports which of these are set.

## Brand

From `gulf-coast-stays-brand-guide.pdf` v3 (2026-11-03). Tokens live at the top of `app/globals.css`.

| Token | Hex | Use |
|---|---|---|
| navy | `#0F1E2E` | text, dark bands, tab bar |
| orange | `#D9622B` | fills, rules, icons, the orb, chips (white text on it only at 3:1 icon/large sizes) |
| orange-deep | `#B24A18` | text and filled buttons (white on true orange is 3.5:1, under AA) |
| bone | `#F4F1EA` | page background |
| seafoam | `#CFE3D6` | soft bands and cards |
| slate `#5B6B7A`, teal `#1F6F78` | lede text; links and the Ask button |

Fonts via `next/font/google`: **Bebas Neue** (headlines, labels, numbers), **Kaushan Script** (the orange accent word), **Inter** (body). Logos: the pelican badges Matthew supplied (`brand/final/*.png`), cut to transparent circles in `public/brand/*.webp`; 1024px masters in `assets/brand/`. PWA icons, favicon and the 1200×630 share image are generated from the Island Retreat alt badge by `npm run icons:make`.

Photos: none yet. `lib/photos.ts` maps every slot to a labelled plate (the shot list). Drop `public/photos/<key>.jpg` and set `src` to swap one in; `components/photo.tsx` serves it through `next/image`.

## Screens

| Route | What it does |
|---|---|
| `/` | Tagline hero with tonight's rate, "What do you need?" with six priced answers, straight-talk section, book-direct band |
| `/island-retreat` | The home: gallery (8 slots), features, sleeps/rules cards, nearby list, schema.org VacationRental |
| `/rates` | Every month, event and snowbird rate from `data/island-retreat.json`, season strip, market note |
| `/book` | Date picker with a live quote (season/event rates, weekend uplift, weekly/monthly/launch discounts, cleaning fee, min-night guard), request form → pipeline → `/thanks` |
| `/area` | Okaloosa Island guide (six spots) and FAQ with FAQPage schema |
| `/about`, `/contact`, `/more` | Brand story, contact form, app install help and links |
| `/audit` | The launch audit for the owner, with Try-it links (noindex) |
| Ask | Floating drawer, scripted tree over the FAQ and rates; stay-specific questions route to bookings@ |
| `/offline.html`, `/sw.js`, `/manifest.webmanifest` | PWA shell; short links `/ir`, `/stay`, `/book-now` |

## What's real and what's stubbed

- Real: rate engine (same numbers as the pricing plan, unit-tested in `scripts/check-rates.mjs`), booking requests (saved on the device, POSTed to `/api/pipeline`, retried when back online, forwarded to a webhook), installable manifest, service worker (precaches home, the home, rates, book, area, more; offline fallback), install prompt, tab bar, security headers, robots/sitemap switch, Organization + VacationRental + FAQPage JSON-LD.
- Stubbed: availability is "unknown" until StayOS exposes a calendar (`lib/booking.ts` is the seam); no payment; no photos; phone, bathrooms, bed sizes, parking, Wi-Fi, cancellation policy and LLC name are placeholders.

## Verified

2026-11-03, headless Chromium at 390×844 and 1440×900: every route screenshotted (`docs/shots/`), no horizontal overflow, tab bar on every screen, offline fallback and precached `/rates` work with the server killed. `npm run check` passes (typecheck, lint, 20 rate assertions, service-worker simulation, routes/headers/API, axe on 10 pages + 22 colour pairs).

## Launch steps

1. Create `Revvitapps/gulf-coast-stays`, push `main`, import into Vercel (team Revvit Apps). Previews deploy from PRs.
2. Add `gulfcoaststays.co` and `www` in the Vercel project. In Cloudflare (zone already active): `A @ 76.76.21.21` and `CNAME www cname.vercel-dns.com`, **DNS only**. `scripts/cloudflare-dns.mjs` prints the plan and applies it with `--apply` (needs `CLOUDFLARE_API_TOKEN`, Zone DNS Edit).
3. Replace placeholders, drop photos, set `PIPELINE_WEBHOOK_URL`.
4. Set `SITE_INDEXING=on` in Vercel production, redeploy, submit `https://gulfcoaststays.co/sitemap.xml` in Search Console (domain property already verified).
5. Rollback: remove the A/CNAME records; email is untouched (MX/SPF/DKIM stay as they are).
