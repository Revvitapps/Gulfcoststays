// Search, GEO and AEO check on the BUILT site (next start), not the source,
// because layouts and templates add to what the page declares.
//
//   npm run check:seo              builds as Vercel production, checks; then builds
//                                  as a Vercel preview and checks it is noindex.
//   npm run build && npm run check:seo -- --built
//                                  checks the existing .next build in whichever
//                                  mode it was built (local builds are noindex).
//
// Every public page: 200, title <= 70, description 50-165, absolute canonical,
// page-specific og:title/og:url/og:image, one <h1>, no skipped heading levels,
// alt on every <img>, no [PLACEHOLDER] text, Organization + WebSite JSON-LD.
// Site-wide: robots (AI crawlers, Sitemap line), sitemap (every page, lastmod,
// images), /llms.txt, the IndexNow key file, *.vercel.app noindex, and the same
// one-line description in meta, Organization, llms.txt and the home hero.
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import http from "node:http";

const port = Number(process.env.CHECK_PORT ?? "3997");
const site = "https://gulfcoaststays.co";
const indexable = ["/", "/island-retreat", "/rates", "/book", "/area", "/faq", "/about", "/contact", "/privacy"];
const hidden = ["/more", "/audit", "/thanks"];
const answerCrawlers = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot", "DuckAssistBot", "CCBot", "meta-externalagent"];
const builtOnly = process.argv.includes("--built");

// Clean env so a stray shell variable cannot flip the mode.
const baseEnv = { ...process.env };
for (const k of ["VERCEL_ENV", "SITE_INDEXING", "VERCEL_PROJECT_PRODUCTION_URL", "NEXT_PUBLIC_GA_ID"]) delete baseEnv[k];

function build(vercelEnv) {
  const r = spawnSync("node", ["node_modules/next/dist/bin/next", "build"], { env: { ...baseEnv, VERCEL_ENV: vercelEnv }, encoding: "utf8" });
  if (r.status !== 0) throw new Error("build failed:\n" + r.stdout.slice(-2000) + r.stderr.slice(-2000));
}

/** GET with an explicit Host header (fetch will not let us set one). */
function get(path, host = `127.0.0.1:${port}`) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: "127.0.0.1", port, path, headers: { host } }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (c) => (body += c));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on("error", reject);
  });
}

async function serve(vercelEnv, fn) {
  const env = { ...baseEnv, ...(vercelEnv ? { VERCEL_ENV: vercelEnv } : {}) };
  const server = spawn("node", ["node_modules/next/dist/bin/next", "start", "-p", String(port)], { env, stdio: ["ignore", "pipe", "pipe"] });
  let log = "";
  server.stdout.on("data", (c) => (log += c));
  server.stderr.on("data", (c) => (log += c));
  try {
    for (let i = 0; ; i++) {
      try {
        if ((await get("/robots.txt")).status === 200) break;
      } catch {}
      if (i > 60) throw new Error("server did not start:\n" + log);
      await new Promise((r) => setTimeout(r, 500));
    }
    await fn();
  } finally {
    server.kill("SIGTERM");
    await new Promise((r) => server.on("exit", r));
  }
}

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const meta = (html, attr, name) => {
  const m = html.match(new RegExp(`<meta[^>]*${attr}="${name}"[^>]*content="([^"]*)"`, "i")) ?? html.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${name}"`, "i"));
  return m ? decode(m[1]) : null;
};
const types = (nodes) => nodes.flatMap((n) => (n["@graph"] ? n["@graph"] : [n])).flatMap((n) => [].concat(n["@type"]));

async function page(path) {
  const res = await get(path);
  const html = res.body;
  const bodyHtml = html.slice(html.indexOf("<body"));
  // Text outside scripts, for the visible-copy checks.
  const visible = bodyHtml.replace(/<script[\s\S]*?<\/script>/g, " ");
  return {
    status: res.status,
    headers: res.headers,
    html,
    visible,
    title: decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ""),
    description: meta(html, "name", "description"),
    robots: meta(html, "name", "robots"),
    ogTitle: meta(html, "property", "og:title"),
    ogUrl: meta(html, "property", "og:url"),
    ogImage: meta(html, "property", "og:image"),
    twitterCard: meta(html, "name", "twitter:card"),
    canonical: html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)?.[1] ?? null,
    headings: [...bodyHtml.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1])),
    imgs: [...bodyHtml.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]),
    jsonLd: [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])),
  };
}

/** Checks that hold in both modes: the content of every page and the GEO files. */
async function contentChecks() {
  const titles = new Set();
  let home;
  for (const p of indexable) {
    const x = await page(p);
    assert.equal(x.status, 200, `${p} status`);
    assert.ok(x.title && x.title.length <= 70, `${p} title ${x.title.length} chars: "${x.title}"`);
    assert.ok(!titles.has(x.title), `${p} duplicate title`);
    titles.add(x.title);
    assert.ok(x.description && x.description.length >= 50 && x.description.length <= 165, `${p} description ${x.description?.length} chars`);
    assert.equal(x.canonical, site + (p === "/" ? "" : p), `${p} canonical`);
    assert.equal(x.ogTitle, x.title, `${p} og:title is the page's own`);
    assert.equal(x.ogUrl, x.canonical, `${p} og:url`);
    assert.ok(x.ogImage?.startsWith("https://"), `${p} og:image ${x.ogImage}`);
    assert.equal(x.twitterCard, "summary_large_image", `${p} twitter card`);
    assert.equal(x.headings.filter((h) => h === 1).length, 1, `${p} has exactly one h1 (${x.headings.join(",")})`);
    assert.equal(x.headings[0], 1, `${p} first heading is the h1`);
    x.headings.forEach((h, i) => i && assert.ok(h <= x.headings[i - 1] + 1, `${p} skips from h${x.headings[i - 1]} to h${h}`));
    for (const img of x.imgs) assert.match(img, /\salt="[^"]*"/, `${p} img without alt: ${img.slice(0, 120)}`);
    assert.ok(!x.visible.includes("[PLACEHOLDER"), `${p} shows a placeholder`);
    const t = types(x.jsonLd);
    for (const need of ["Organization", "WebSite"]) assert.ok(t.includes(need), `${p} ${need} JSON-LD`);
    if (p !== "/") assert.ok(t.includes("BreadcrumbList"), `${p} BreadcrumbList`);
    if (p === "/") home = x;
  }
  for (const [p, need] of [["/", "VacationRental"], ["/island-retreat", "VacationRental"], ["/faq", "FAQPage"], ["/area", "FAQPage"]]) {
    assert.ok(types((await page(p)).jsonLd).includes(need), `${p} ${need}`);
  }
  const rental = (await page("/island-retreat")).jsonLd.find((n) => n["@type"] === "VacationRental");
  assert.ok(rental.image.length >= 8 && rental.amenityFeature.length && rental.containsPlace.occupancy, "VacationRental has photos, amenities, occupancy");
  assert.ok(!/priceRange|aggregateRating|review|streetAddress/.test(JSON.stringify(rental)), "VacationRental carries no invented price, rating or street address");
  for (const p of hidden) assert.match((await page(p)).robots ?? "", /noindex/, `${p} noindex`);

  // Sitemap: every public page, lastmod, photos; no private pages.
  const xml = (await get("/sitemap.xml")).body;
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
  const locs = entries.map((e) => new URL(e.match(/<loc>([^<]*)<\/loc>/)[1]).pathname);
  assert.deepEqual([...locs].sort(), [...indexable].sort(), "sitemap lists exactly the public pages");
  for (const e of entries) assert.match(e, /<lastmod>\d{4}-\d{2}-\d{2}/, "sitemap lastmod");
  assert.ok(entries.find((e) => e.includes("/island-retreat<")).includes("<image:loc>"), "sitemap has Island Retreat photos");

  // llms.txt from the same content source.
  const llms = await get("/llms.txt");
  assert.equal(llms.status, 200, "/llms.txt status");
  assert.match(llms.headers["content-type"], /text\/plain/);
  assert.match(llms.body, /^# Gulf Coast Stays\n\n> /);
  for (const s of ["## Notes for accurate representation", "/island-retreat", "bookings@", "## Questions and answers"]) assert.ok(llms.body.includes(s), `llms.txt has ${s}`);
  assert.ok(!llms.body.includes("[PLACEHOLDER"), "llms.txt has no placeholders");

  // One description everywhere: meta, Organization, llms.txt summary, home hero.
  const org = types(home.jsonLd) && home.jsonLd.flatMap((n) => n["@graph"] ?? [n]).find((n) => n["@type"] === "Organization");
  const line = llms.body.match(/^> (.*)$/m)[1];
  assert.equal(org.description, home.description, "Organization description = meta description");
  assert.equal(line, home.description, "llms.txt summary = meta description");
  assert.ok(decode(home.visible).includes(home.description), "home hero carries the description");

  // IndexNow key: one file, holding only its own name.
  const keys = readdirSync("public").filter((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  assert.equal(keys.length, 1, "exactly one IndexNow key file in public/");
  const key = keys[0].replace(".txt", "");
  assert.equal(readFileSync(`public/${keys[0]}`, "utf8"), key, "key file holds only the key");
  const served = await get(`/${keys[0]}`);
  assert.equal(served.status, 200, "key file served");
  assert.equal(served.body.trim(), key);

  // *.vercel.app never indexes, whatever the build.
  const vercelHost = "gulf-coast-stays.vercel.app";
  assert.match((await get("/", vercelHost)).headers["x-robots-tag"] ?? "", /noindex/, "vercel.app X-Robots-Tag");
  assert.match((await get("/robots.txt", vercelHost)).body, /Disallow: \/\s*$/m, "vercel.app robots Disallow");
}

async function productionChecks() {
  const robots = (await get("/robots.txt", "gulfcoaststays.co")).body;
  assert.match(robots, /User-Agent: \*\nAllow: \/\n/, "robots allows all");
  assert.doesNotMatch(robots, /Disallow: \/\s*$/m, "robots does not block the site");
  assert.match(robots, /Disallow: \/audit/);
  assert.match(robots, new RegExp(`Sitemap: ${site}/sitemap\\.xml`), "robots Sitemap line");
  for (const bot of answerCrawlers) assert.match(robots, new RegExp(`User-Agent: ${bot}\\n`), `robots names ${bot}`);
  for (const p of indexable) {
    const x = await page(p);
    assert.ok(!/noindex/.test(x.robots ?? ""), `${p} meta robots indexable`);
    const h = await get(p, "gulfcoaststays.co");
    assert.ok(!/noindex/.test(h.headers["x-robots-tag"] ?? ""), `${p} no X-Robots-Tag on gulfcoaststays.co`);
  }
}

async function previewChecks() {
  assert.match((await get("/robots.txt")).body, /Disallow: \/\s*$/m, "preview robots Disallow");
  for (const p of indexable) {
    assert.match((await page(p)).robots ?? "", /noindex/, `${p} meta noindex on preview`);
    assert.match((await get(p)).headers["x-robots-tag"] ?? "", /noindex/, `${p} X-Robots-Tag on preview`);
  }
}

async function run(vercelEnv) {
  await serve(vercelEnv, async () => {
    const isProd = !/Disallow: \/\s*$/m.test((await get("/robots.txt", "gulfcoaststays.co")).body);
    await contentChecks();
    if (isProd) await productionChecks();
    else await previewChecks();
    console.log(`  ${isProd ? "production" : "preview/local"} build: ${indexable.length} public pages, ${hidden.length} hidden pages checked`);
  });
}

if (builtOnly) {
  await run();
} else {
  build("production");
  await run("production");
  build("preview");
  await run("preview");
}
console.log(`PASS seo: titles <= 70, descriptions <= 165, one h1, heading order, alt text, canonicals, OG, JSON-LD, sitemap, robots + AI crawlers, llms.txt, IndexNow key, *.vercel.app noindex${builtOnly ? "" : "; production indexes and previews do not"}.`);
