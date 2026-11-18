import { NextResponse } from "next/server";
import { buildIcs } from "@/lib/ical";
import { LABEL, TARGETS, feedKeyOk, feedRanges, readAll, type Target } from "@/lib/calendar";

export const dynamic = "force-dynamic";

const notFound = () => new NextResponse("Not found", { status: 404 });

/**
 * Calendar feeds for the channels to import, behind a secret key:
 *   /api/calendar/<key>/airbnb.ics   Vrbo + Booking.com + direct stays
 *   /api/calendar/<key>/vrbo.ics     Airbnb + Booking.com + direct
 *   /api/calendar/<key>/booking.ics  Airbnb + Vrbo + direct
 *   /api/calendar/<key>/google.ics   Airbnb + Vrbo + Booking.com
 *   /api/calendar/<key>/status.json  which source links are set and reading
 * Events carry dates only ("Not available"), no guest details.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ key: string; target: string }> }) {
  const { key, target } = await ctx.params;
  if (!feedKeyOk(key)) return notFound();
  const results = await readAll();
  if (target === "status.json") {
    return NextResponse.json(
      { sources: results.map((r) => ({ name: LABEL[r.name], ok: r.ok, stays: r.ranges.length })), checked: new Date().toISOString() },
      { headers: { "cache-control": "private, no-store" } },
    );
  }
  const name = target.replace(/\.ics$/, "");
  if (!(name in TARGETS) || !target.endsWith(".ics")) return notFound();
  // A partial feed would open dates that are really booked. Fail instead, and the
  // channel keeps what it imported last time and tries again later.
  const needed = TARGETS[name as Target] as readonly string[];
  if (results.some((r) => needed.includes(r.name) && !r.ok)) {
    return new NextResponse("A source calendar did not load. Try again shortly.", { status: 503, headers: { "retry-after": "600" } });
  }
  const ics = buildIcs(feedRanges(results, name as Target), "Island Retreat (Gulf Coast Stays)");
  return new NextResponse(ics, {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": `inline; filename="island-retreat-${name}.ics"`,
      "cache-control": "private, max-age=300",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
