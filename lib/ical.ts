/**
 * Minimal iCalendar (RFC 5545) reading and writing for availability sync.
 * Only what rental calendars use: VEVENT blocks with DTSTART/DTEND. Pure, no I/O.
 */

const TZ = "America/Chicago"; // Okaloosa Island

export type Range = { start: string; end: string }; // ISO dates, end exclusive (check-out day)

/** Undo RFC 5545 line folding (continuation lines start with a space or tab). */
function unfold(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "").split("\n");
}

function localDate(utc: Date) {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(utc);
}

/** DTSTART/DTEND value to an ISO date. Date-times in UTC are read in Central time. */
function toIsoDate(value: string): string | null {
  const m = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);
  if (!m) return null;
  const [, y, mo, d, h, mi, s, z] = m;
  if (h && z) return localDate(new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)));
  return `${y}-${mo}-${d}`;
}

function addDay(isoDate: string, n = 1) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Every VEVENT as a night range. Cancelled events are skipped. */
export function parseIcs(text: string): Range[] {
  const ranges: Range[] = [];
  let inEvent = false;
  let start: string | null = null;
  let end: string | null = null;
  let cancelled = false;
  for (const line of unfold(text)) {
    if (line === "BEGIN:VEVENT") {
      inEvent = true;
      start = end = null;
      cancelled = false;
      continue;
    }
    if (line === "END:VEVENT") {
      if (inEvent && start && !cancelled) {
        const e = end && end > start ? end : addDay(start);
        ranges.push({ start, end: e });
      }
      inEvent = false;
      continue;
    }
    if (!inEvent) continue;
    const i = line.indexOf(":");
    if (i < 0) continue;
    const name = line.slice(0, i).split(";")[0].toUpperCase();
    const value = line.slice(i + 1).trim();
    if (name === "DTSTART") start = toIsoDate(value);
    else if (name === "DTEND") end = toIsoDate(value);
    else if (name === "STATUS" && value.toUpperCase() === "CANCELLED") cancelled = true;
  }
  return ranges;
}

/** The nights (check-in dates through the night before check-out) a set of ranges covers. */
export function nightsOf(ranges: Range[], from?: string, to?: string): Set<string> {
  const nights = new Set<string>();
  for (const r of ranges) {
    for (let d = r.start; d < r.end; d = addDay(d)) {
      if (from && d < from) continue;
      if (to && d >= to) break;
      nights.add(d);
    }
  }
  return nights;
}

/** Collapse a set of nights back into ranges (end exclusive). */
export function rangesOf(nights: Iterable<string>): Range[] {
  const sorted = [...new Set(nights)].sort();
  const out: Range[] = [];
  for (const d of sorted) {
    const last = out[out.length - 1];
    if (last && last.end === d) last.end = addDay(d);
    else out.push({ start: d, end: addDay(d) });
  }
  return out;
}

const compact = (isoDate: string) => isoDate.replaceAll("-", "");

/** A calendar other sites can import: one all-day event per booked stretch, no guest details. */
export function buildIcs(ranges: Range[], name: string, stamp = new Date()): string {
  const dtstamp = stamp.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Gulf Coast Stays//Island Retreat availability//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${name}`,
    ...ranges.flatMap((r) => [
      "BEGIN:VEVENT",
      `UID:${compact(r.start)}-${compact(r.end)}@gulfcoaststays.co`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${compact(r.start)}`,
      `DTEND;VALUE=DATE:${compact(r.end)}`,
      "SUMMARY:Not available",
      "TRANSP:OPAQUE",
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ];
  return lines.join("\r\n") + "\r\n";
}
