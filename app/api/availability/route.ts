import { NextResponse } from "next/server";
import { siteAvailability } from "@/lib/calendar";

export const dynamic = "force-dynamic";

/**
 * Booked nights for the booking calendar, from StayOS: dates only, never guest
 * details or which site a stay came from. `configured: false` until StayOS is
 * connected (or reachable); the site then falls back to request-and-confirm.
 */
export async function GET() {
  const a = await siteAvailability();
  return NextResponse.json(
    { ...a, updated: new Date().toISOString() },
    { headers: a.configured ? { "cache-control": "public, max-age=60, s-maxage=120, stale-while-revalidate=600" } : {} },
  );
}
