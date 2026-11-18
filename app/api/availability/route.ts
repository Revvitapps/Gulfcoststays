import { NextResponse } from "next/server";
import { bookedNights, configuredSources, readAll, todayCentral } from "@/lib/calendar";

export const dynamic = "force-dynamic";

/**
 * Booked nights for the booking calendar: dates only, never guest details or
 * which site a stay came from. `configured: false` until at least one calendar
 * link is set in env, and the site then falls back to request-and-confirm.
 */
export async function GET() {
  if (configuredSources().length === 0) {
    return NextResponse.json({ configured: false, complete: false, booked: [], updated: new Date().toISOString() });
  }
  const results = await readAll();
  const from = todayCentral();
  const until = new Date(Date.now() + 550 * 86400000).toISOString().slice(0, 10);
  const booked = [...bookedNights(results, undefined, from)].filter((d) => d < until).sort();
  return NextResponse.json(
    { configured: true, complete: results.every((r) => r.ok), booked, updated: new Date().toISOString() },
    { headers: { "cache-control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600" } },
  );
}
