import { timingSafeEqual } from "node:crypto";
import { nightsOf, parseIcs, rangesOf, type Range } from "@/lib/ical";

/**
 * One availability source for Island Retreat. Server only.
 *
 * Every calendar the home is booked on is read from its iCal export link, set
 * in Vercel env (the links are secret, never in the repo):
 *   AIRBNB_ICAL_URL, VRBO_ICAL_URL, BOOKING_ICAL_URL, and DIRECT_ICAL_URL
 *   (the secret iCal address of the Google Calendar where direct stays go).
 * The site blocks the union. Each channel gets a feed back of everything except
 * its own bookings, at /api/calendar/<CALENDAR_FEED_KEY>/<target>.ics, so no
 * channel ever re-imports itself.
 */
export const SOURCES = ["airbnb", "vrbo", "booking", "direct"] as const;
export type Source = (typeof SOURCES)[number];

const ENV: Record<Source, string> = {
  airbnb: "AIRBNB_ICAL_URL",
  vrbo: "VRBO_ICAL_URL",
  booking: "BOOKING_ICAL_URL",
  direct: "DIRECT_ICAL_URL",
};

export const LABEL: Record<Source, string> = { airbnb: "Airbnb", vrbo: "Vrbo", booking: "Booking.com", direct: "Direct" };

/** What each feed carries: everything but the channel's own bookings. */
export const TARGETS = {
  airbnb: ["vrbo", "booking", "direct"],
  vrbo: ["airbnb", "booking", "direct"],
  booking: ["airbnb", "vrbo", "direct"],
  // Google holds the direct stays itself, so its feed is the three channels.
  google: ["airbnb", "vrbo", "booking"],
} as const satisfies Record<string, readonly Source[]>;
export type Target = keyof typeof TARGETS;

export type SourceResult = { name: Source; ok: boolean; ranges: Range[] };

const urlFor = (s: Source) => process.env[ENV[s]]?.trim() || "";
export const configuredSources = () => SOURCES.filter((s) => urlFor(s));

async function read(name: Source): Promise<SourceResult> {
  try {
    const res = await fetch(urlFor(name), {
      headers: { "user-agent": "GulfCoastStays-CalendarSync/1.0", accept: "text/calendar, */*" },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 600 },
    });
    if (!res.ok) return { name, ok: false, ranges: [] };
    const text = await res.text();
    if (!text.includes("BEGIN:VCALENDAR")) return { name, ok: false, ranges: [] };
    return { name, ok: true, ranges: parseIcs(text) };
  } catch {
    return { name, ok: false, ranges: [] };
  }
}

/** Every configured calendar, read in parallel. A failed one comes back ok: false. */
export const readAll = () => Promise.all(configuredSources().map(read));

/** Today in Okaloosa Island time. */
export function todayCentral() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

/** Booked nights from today on, across the given sources (all when omitted). */
export function bookedNights(results: SourceResult[], only?: readonly Source[], from = todayCentral()) {
  const pick = only ? results.filter((r) => only.includes(r.name)) : results;
  return nightsOf(pick.flatMap((r) => r.ranges), from);
}

/** Stretches for a feed. Past stays a month back are kept so channels don't drop recent history. */
export function feedRanges(results: SourceResult[], target: Target) {
  const from = new Date(Date.now() - 31 * 86400000).toISOString().slice(0, 10);
  return rangesOf(bookedNights(results, TARGETS[target], from));
}

/** Nights of a stay (check-in through the night before check-out) that are already booked. */
export function clashes(booked: Iterable<string>, checkIn: string, checkOut: string) {
  const set = booked instanceof Set ? booked : new Set(booked);
  return [...nightsOf([{ start: checkIn, end: checkOut }])].filter((n) => set.has(n));
}

/** Constant-time check of the feed key in the URL. */
export function feedKeyOk(given: string) {
  const key = process.env.CALENDAR_FEED_KEY?.trim();
  if (!key || key.length < 24) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(key);
  return a.length === b.length && timingSafeEqual(a, b);
}
