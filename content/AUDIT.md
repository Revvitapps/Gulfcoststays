# Launch audit: Gulf Coast Stays / Island Retreat

For Matthew · 2026-11-03 · rendered live at `/audit` in the prototype

Gulf Coast Stays has no site yet, so this audit compares the platform-only path a guest takes today with the direct path this prototype opens.

## What the platform-only path loses

- Every booking pays a platform service fee (guest side 12 to 15% on Airbnb, Vrbo similar). On a $31K year that is roughly $4K of guest money that never reaches the price you could charge.
- Repeat guests have nowhere to come back to. The relationship belongs to the platform.
- Search finds Fort Walton Beach condos on Airbnb, not Island Retreat. The name builds no equity.
- Snowbird months (the best winter revenue) are awkward on nightly platforms and get no landing page.
- No way to answer "is it on the water?" before the question costs you a bad review.

## Today vs. the new flow

| Step | Today | New flow | Try it |
|---|---|---|---|
| Find the home | Scroll past 300 Fort Walton Beach listings on Airbnb | gulfcoaststays.co/island-retreat with its own badge, straight-talk copy and schema markup | `/island-retreat` |
| See the price | Enter dates, wait for the fee breakdown, do the math | Rates page lists every season, event and discount with no login | `/rates` |
| Book | Platform checkout plus service fee | Pick dates, see the exact total, request in 30 seconds; no fee | `/book` |
| Ask something | Platform inbox, 24-hour response window | Ask drawer answers the FAQ instantly and routes the rest to bookings@ | `/area` |
| A month in winter | Not offered | Snowbird rates on the rates page and a one-tap request | `/rates#monthly` |
| Come back next year | Search again | Installed app on the home screen, works on the beach with one bar | `/more` |

## Phasing

**Phase 1 (this prototype):** brand site and installable PWA; rates from the pricing plan; booking requests to email or Slack; Search Console ready, noindex until launch.

**Phase 2 (launch):** real photos in every slot; LLC name, phone, cancellation policy filled in; gulfcoaststays.co pointed at Vercel, indexing on, sitemap submitted; Airbnb and Vrbo listings live with links back.

**Phase 3 (StayOS):** live calendar synced with the platforms; instant booking with card payment; guest portal (door code, house guide, local picks); second home joins the collection.

## Decisions needed from you

1. ~~Bed sizes~~ Answered Nov 9: a queen in each bedroom, no sleeper sofa, an air mattress; sleeps 6. Baths answered Nov 6: 2, master en suite plus hall bath with tub.
2. Phone number for the site (a Google Voice number on bookings@ is fine).
3. Cancellation policy: moderate (full refund 14 days out) or strict?
4. Pets: HOA says no? Confirm.
5. Confirm festival dates (Billy Bowlegs, Destin Seafood) before rates publish.
6. LLC name and filing date so the footer can say it.
