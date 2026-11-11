// Checks the rate engine against the pricing plan by hand-computed cases.
// Runs against the TypeScript source through a tiny transpile step.
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import ts from "typescript";

mkdirSync(".cache", { recursive: true });
const plan = JSON.stringify(JSON.parse(readFileSync("data/island-retreat.json", "utf8")));
const src = readFileSync("lib/rates.ts", "utf8").replace('import { property } from "@/data/property";', `const property = { plan: ${plan} };`);
writeFileSync(".cache/rates.mjs", ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText);
const { nightly, quote, seasonTable, eventTable } = await import("../.cache/rates.mjs");

// Season rates: November Sunday = low weekday, Friday = low weekend.
assert.equal(nightly("2026-11-08").rate, 165);
assert.equal(nightly("2026-11-06").rate, 189);
assert.equal(nightly("2026-11-06").weekend, true);
// Event overrides season: Fourth of July $396, min 4.
assert.equal(nightly("2027-07-03").rate, 396);
assert.equal(nightly("2027-07-03").minNights, 4);
assert.equal(nightly("2027-07-03").event, "Fourth of July");
// New Year's Eve sits inside Christmas range but is listed later; first match wins (Christmas range).
assert.equal(nightly("2026-12-31").event, "Christmas & New Year");

// Weekend in March 2027 (shoulder): Fri 12 + Sat 13 = 250 + 250, min 3 nights → not ok.
const w = quote("2027-03-12", "2027-03-14", "2026-11-03");
assert.equal(w.count, 2);
assert.equal(w.ok, false);
assert.match(w.problem, /at least 3/);

// 7 nights in June 2027 (peak, 323/366): Sat 5 .. Fri 11 → inside Billy Bowlegs 4-6 ($390) for 5,6; then 7-10 weekday 323; 11 Fri 366.
const week = quote("2027-06-05", "2027-06-12", "2026-11-03");
assert.equal(week.count, 7);
assert.equal(week.subtotal, 390 + 390 + 323 * 4 + 366);
assert.equal(week.lengthDiscount, Math.round(week.subtotal * 0.1));
assert.equal(week.launchDiscount, Math.round((week.subtotal - week.lengthDiscount) * 0.1));
assert.equal(week.cleaning, 135);
assert.equal(week.total, week.subtotal - week.lengthDiscount - week.launchDiscount + 135);
assert.equal(week.ok, true);

// After launch window: no launch discount.
assert.equal(quote("2027-06-05", "2027-06-12", "2027-02-01").launchDiscount, 0);
// Monthly: 28+ nights 25% off.
const m = quote("2027-01-04", "2027-02-01", "2026-11-03");
assert.equal(m.count, 28);
assert.equal(m.lengthDiscount, Math.round(m.subtotal * 0.25));
// Past dates and reversed dates fail.
assert.equal(quote("2026-10-01", "2026-10-03", "2026-11-03").ok, false);
assert.equal(quote("2026-12-03", "2026-12-01").count, 0);
// Beyond plan: not published.
assert.match(quote("2027-11-10", "2027-11-13", "2026-11-03").problem, /not published/);

assert.equal(seasonTable().length, 12);
assert.equal(seasonTable()[0].month, "November 2026");
assert.equal(eventTable().filter((e) => e.confirm).length, 2);
console.log("PASS rates: seasons, events, weekend rates, min nights, weekly/monthly/launch discounts, cleaning fee, date guards.");
