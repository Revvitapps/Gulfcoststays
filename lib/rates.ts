import { property } from "@/data/property";

/**
 * Rate engine over the pricing plan in data/island-retreat.json. The plan is
 * the source of truth for StayOS/PriceLabs too, so the site quotes the same
 * number the listings do. Pure functions: no fetch, usable in the service worker
 * era offline.
 */
type Season = [name: string, weekday: number, weekend: number, minNights: number, occupancy: number];
type EventRow = [start: string, end: string, name: string, weekday: number, weekend: number, minNights: number];

const plan = property.plan;
const seasons = plan.seasons as unknown as Record<string, Season>;
const events = plan.events as unknown as EventRow[];
const weekendDays = new Set(plan.weekend_nights.map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(d)));

export const CLEANING_FEE = 135; // "$135 per stay" in the plan
export const WEEKLY_DISCOUNT = 0.1;
export const MONTHLY_DISCOUNT = 0.25;
export const LAUNCH_DISCOUNT = plan.launch_discount;
export const LAUNCH_UNTIL = plan.launch_discount_until;
export const MARKET_NOTE = plan.market_note;
/**
 * What the same stay costs a guest through a listing site. Airbnb moved US
 * independent hosts to a host-only 15.5% fee (Sept 2026) and Vrbo charges a flat
 * 12% plus processing (Oct 2026); either way the guest price ends up roughly
 * direct ÷ (1 − fee). 15% is the honest round number we quote.
 */
export const PLATFORM_FEE = 0.15;
export const platformPrice = (direct: number) => Math.round(direct / (1 - PLATFORM_FEE));
export const directSavings = (direct: number) => platformPrice(direct) - direct;

export function toDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
export const iso = (d: Date) => d.toISOString().slice(0, 10);
export function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + n);
  return r;
}

export type Night = { date: string; rate: number; season: string; event?: string; minNights: number; weekend: boolean };

/** Rate for one night. Events override seasons; Fri/Sat take the weekend rate. */
export function nightly(dateIso: string): Night {
  const d = toDate(dateIso);
  const weekend = weekendDays.has(d.getUTCDay());
  const ev = events.find(([s, e]) => dateIso >= s && dateIso <= e);
  if (ev) {
    const [, , name, wd, we, min] = ev;
    return { date: dateIso, rate: weekend ? we : wd, season: "Event", event: name.replace("*", ""), minNights: min, weekend };
  }
  const s = seasons[String(d.getUTCMonth() + 1)];
  return { date: dateIso, rate: weekend ? s[2] : s[1], season: s[0], minNights: s[3], weekend };
}

export type Quote = {
  nights: Night[];
  count: number;
  subtotal: number;
  lengthDiscount: number;
  lengthLabel?: string;
  launchDiscount: number;
  cleaning: number;
  total: number;
  average: number;
  minNights: number;
  ok: boolean;
  problem?: string;
};

/** Quote a stay from check-in to check-out (check-out night excluded). Taxes are not included. */
export function quote(checkIn: string, checkOut: string, today = iso(new Date())): Quote {
  const nights: Night[] = [];
  for (let d = toDate(checkIn); iso(d) < checkOut; d = addDays(d, 1)) nights.push(nightly(iso(d)));
  const count = nights.length;
  const subtotal = nights.reduce((s, n) => s + n.rate, 0);
  const minNights = nights.reduce((m, n) => Math.max(m, n.minNights), 0);
  let lengthDiscount = 0;
  let lengthLabel: string | undefined;
  if (count >= 28) {
    lengthDiscount = Math.round(subtotal * MONTHLY_DISCOUNT);
    lengthLabel = "Monthly stay, 25% off";
  } else if (count >= 7) {
    lengthDiscount = Math.round(subtotal * WEEKLY_DISCOUNT);
    lengthLabel = "Weekly stay, 10% off";
  }
  const launchDiscount = today <= LAUNCH_UNTIL ? Math.round((subtotal - lengthDiscount) * LAUNCH_DISCOUNT) : 0;
  const cleaning = count > 0 ? CLEANING_FEE : 0;
  const total = subtotal - lengthDiscount - launchDiscount + cleaning;
  let problem: string | undefined;
  if (count <= 0) problem = "Check-out must be after check-in.";
  else if (checkIn < today) problem = "Check-in is in the past.";
  else if (count < minNights) problem = `Those dates need at least ${minNights} nights.`;
  else if (checkIn < plan.plan_start || checkOut > addDaysIso(plan.plan_end, 1)) problem = "Rates for those dates are not published yet. Ask us.";
  return { nights, count, subtotal, lengthDiscount, lengthLabel, launchDiscount, cleaning, total, average: count ? Math.round(subtotal / count) : 0, minNights, ok: !problem, problem };
}

function addDaysIso(d: string, n: number) {
  return iso(addDays(toDate(d), n));
}

/** Season table for the Rates page, one row per month in plan order. */
export function seasonTable() {
  const start = toDate(plan.plan_start);
  const rows = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, 1));
    const s = seasons[String(d.getUTCMonth() + 1)];
    rows.push({ month: d.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" }), season: s[0], weekday: s[1], weekend: s[2], minNights: s[3] });
  }
  return rows;
}

export function eventTable() {
  return events.map(([start, end, name, wd, we, min]) => ({ start, end, name: name.replace("*", ""), confirm: name.endsWith("*"), weekday: wd, weekend: we, minNights: min }));
}

export const monthlyOffers = Object.entries(plan.monthly_offers).map(([m, price]) => ({
  month: new Date(Date.UTC(2027, Number(m) - 1, 1)).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" }),
  price,
}));

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;
