// Search-readiness check: builds with SITE_INDEXING=on, verifies robots,
// sitemap, per-page title/description/canonical/OG and JSON-LD, then builds
// with indexing off and verifies everything is noindex. Slow (two builds).
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";

const port = process.env.CHECK_PORT ?? "3997";
const base = `http://127.0.0.1:${port}`;
const indexable = ["/", "/island-retreat", "/rates", "/book", "/area", "/about", "/contact"];
const hidden = ["/more", "/audit", "/thanks"];

function build(on) {
  const r = spawnSync("node", ["node_modules/next/dist/bin/next", "build"], { env: { ...process.env, SITE_INDEXING: on ? "on" : "" }, encoding: "utf8" });
  if (r.status !== 0) throw new Error("build failed:\n" + r.stdout.slice(-2000) + r.stderr.slice(-2000));
}
async function serve(on, fn) {
  const server = spawn("node", ["node_modules/next/dist/bin/next", "start", "-p", port], { env: { ...process.env, SITE_INDEXING: on ? "on" : "" }, stdio: ["ignore", "pipe", "pipe"] });
  try {
    for (let i = 0; i < 60; i++) {
      try {
        if ((await fetch(base + "/robots.txt")).ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 500));
    }
    await fn();
  } finally {
    server.kill("SIGTERM");
    await new Promise((r) => server.on("exit", r));
  }
}
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
const meta = (html, attr, name) => { const m = html.match(new RegExp(`<meta[^>]*${attr}="${name}"[^>]*content="([^"]*)"`, "i")) ?? html.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${name}"`, "i")); return m ? decode(m[1]) : null; };
async function page(path) {
  const html = await (await fetch(base + path)).text();
  return {
    title: decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ""),
    description: meta(html, "name", "description"),
    robots: meta(html, "name", "robots"),
    ogImage: meta(html, "property", "og:image"),
    canonical: html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)?.[1] ?? null,
    jsonLd: [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])),
  };
}

build(true);
await serve(true, async () => {
  const robots = await (await fetch(base + "/robots.txt")).text();
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Disallow: \/audit/);
  assert.match(robots, /Sitemap: .*\/sitemap\.xml/);
  const locs = [...(await (await fetch(base + "/sitemap.xml")).text()).matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  for (const p of indexable) assert.ok(locs.includes(p), `sitemap lists ${p}`);
  for (const p of hidden) assert.ok(!locs.includes(p), `sitemap omits ${p}`);
  const titles = new Set();
  for (const p of indexable) {
    const x = await page(p);
    assert.ok(x.title && x.title.length <= 90, `${p} title "${x.title}"`);
    assert.ok(x.description && x.description.length >= 50 && x.description.length <= 170, `${p} description ${x.description?.length}`);
    assert.ok(!/noindex/.test(x.robots ?? ""), `${p} indexable`);
    assert.equal(x.canonical && new URL(x.canonical).pathname, p, `${p} canonical`);
    assert.ok(x.ogImage, `${p} og image`);
    assert.ok(!titles.has(x.title), `${p} duplicate title`);
    titles.add(x.title);
    assert.ok(x.jsonLd.some((n) => n["@type"] === "Organization"), `${p} organization`);
  }
  assert.ok((await page("/island-retreat")).jsonLd.some((n) => n["@type"] === "VacationRental"));
  assert.ok((await page("/area")).jsonLd.some((n) => n["@type"] === "FAQPage"));
  for (const p of hidden) assert.match((await page(p)).robots ?? "", /noindex/, `${p} noindex`);
});
build(false);
await serve(false, async () => {
  assert.match(await (await fetch(base + "/robots.txt")).text(), /Disallow: \/\s*$/m);
  for (const p of indexable) assert.match((await page(p)).robots ?? "", /noindex/, `${p} noindex while off`);
});
console.log(`PASS seo: ${indexable.length} indexable URLs with unique titles, descriptions, canonicals, OG and structured data; hidden pages noindex; switch works both ways.`);
