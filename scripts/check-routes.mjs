// Starts the production build on a spare port and requests every route,
// the PWA files, the short links and the pipeline API. Requires `npm run build`.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const port = process.env.CHECK_PORT ?? "3999";
const base = `http://127.0.0.1:${port}`;
const server = spawn("node", ["node_modules/next/dist/bin/next", "start", "-p", port], { stdio: ["ignore", "pipe", "pipe"] });
let log = "";
server.stdout.on("data", (c) => (log += c));
server.stderr.on("data", (c) => (log += c));
const stop = () => server.kill("SIGTERM");
process.on("exit", stop);

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(base + "/robots.txt")).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("Server did not start:\n" + log);
}
async function expectPage(path, needles) {
  const res = await fetch(base + path);
  assert.equal(res.status, 200, `${path} status`);
  const html = await res.text();
  for (const n of [].concat(needles)) assert.ok(html.includes(n), `${path} should contain ${JSON.stringify(n)}`);
  return html;
}
async function expectRedirect(path, location) {
  const res = await fetch(base + path, { redirect: "manual" });
  assert.ok([301, 307, 308].includes(res.status), `${path} should redirect, got ${res.status}`);
  assert.equal(new URL(res.headers.get("location"), base).pathname, location, `${path} target`);
}

try {
  await waitForServer();
  await expectPage("/", ["What do you need?", "Book direct", "VacationRental"]);
  await expectPage("/island-retreat", ["Island Retreat", "House rules", "application/ld+json"]);
  await expectPage("/rates", ["Your dates, your price", "Snowbird", "No listing-site fee"]);
  await expectPage("/book", ["Check your dates", "Request these dates"]);
  await expectPage("/area", ["Gulfarium", "FAQPage"]);
  for (const p of ["/about", "/contact", "/more", "/audit", "/thanks"]) await expectPage(p, "Gulf Coast Stays");
  // Every tab bar and header link has a page.
  const home = await expectPage("/", []);
  const links = [...new Set([...home.matchAll(/href="(\/[a-z-]*)"/g)].map((m) => m[1]))].filter((h) => h !== "/");
  for (const h of links) assert.equal((await fetch(base + h)).status, 200, `nav link ${h}`);
  await expectPage("/manifest.webmanifest", ['"Gulf Coast Stays"', "maskable"]);
  await expectPage("/offline.html", "No signal");
  await expectPage("/sw.js", "gcs-static");
  await expectPage("/sitemap.xml", "/island-retreat");
  for (const f of ["/pwa/icon-192.png", "/pwa/icon-512.png", "/pwa/icon-maskable-512.png", "/pwa/apple-touch-icon.png", "/pwa/og-default.png", "/brand/gcs-badge.webp"]) {
    assert.equal((await fetch(base + f)).status, 200, f);
  }
  const robots = await (await fetch(base + "/robots.txt")).text();
  assert.match(robots, /Disallow: \//, "preview must stay unindexed");
  const headers = (await fetch(base + "/")).headers;
  assert.equal(headers.get("x-content-type-options"), "nosniff");
  assert.ok(headers.get("strict-transport-security"));
  await expectRedirect("/ir", "/island-retreat");
  await expectRedirect("/book-now", "/book");
  assert.equal((await fetch(base + "/nope")).status, 404);

  const bad = await fetch(base + "/api/pipeline", { method: "POST", body: "{}" });
  assert.equal(bad.status, 422);
  const ok = await fetch(base + "/api/pipeline", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: "t1", kind: "inquiry", email: "a@b.co", note: "hi" }) });
  assert.equal(ok.status, 201);
  const health = await (await fetch(base + "/api/health")).json();
  assert.equal(health.ok, true);
  console.log(`PASS routes: 10 pages, ${links.length} nav links, PWA files, headers, short links, 404, pipeline API.`);
} finally {
  stop();
}
