/**
 * Availability for Island Retreat comes from StayOS, the one calendar hub.
 * Server only.
 *
 * StayOS reads the Airbnb, Vrbo and Booking.com calendars, adds the stays
 * booked in StayOS itself, and publishes the unit's booked nights at
 *   <STAYOS_CALENDAR_URL>/availability.json
 * where STAYOS_CALENDAR_URL is the unit's secret calendar base, e.g.
 * https://<stayos host>/api/calendar/<token> (Vercel env, never the repo).
 * StayOS also hands each channel and Google Calendar its own feed; the site
 * only reads.
 */
export type SiteAvailability = { configured: boolean; complete: boolean; booked: string[] };

// Accepts the base or the full ".../availability.json" link copied from StayOS.
const base = () => process.env.STAYOS_CALENDAR_URL?.trim().replace(/\/(availability\.json)?$/, "") || "";
export const calendarConfigured = () => Boolean(base());

/** Booked nights from StayOS. `complete` is false when StayOS or one of its channel links is not reading. */
export async function siteAvailability(): Promise<SiteAvailability> {
  if (!calendarConfigured()) return { configured: false, complete: false, booked: [] };
  try {
    const res = await fetch(`${base()}/availability.json`, {
      headers: { "user-agent": "GulfCoastStays/1.0", accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 120 },
    });
    if (!res.ok) throw new Error(String(res.status));
    const j = (await res.json()) as { complete?: boolean; booked?: unknown };
    const booked = Array.isArray(j.booked) ? j.booked.filter((d): d is string => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) : [];
    return { configured: true, complete: Boolean(j.complete), booked };
  } catch {
    // StayOS unreachable: say nothing is known rather than show every night open.
    return { configured: false, complete: false, booked: [] };
  }
}

/** Nights of a stay (check-in through the night before check-out) that are already booked. */
export function clashes(booked: Iterable<string>, checkIn: string, checkOut: string) {
  const set = booked instanceof Set ? booked : new Set(booked);
  const out: string[] = [];
  const d = new Date(`${checkIn}T00:00:00Z`);
  for (let s = checkIn; s < checkOut; d.setUTCDate(d.getUTCDate() + 1), s = d.toISOString().slice(0, 10)) {
    if (set.has(s)) out.push(s);
  }
  return out;
}
