// Pings IndexNow (Bing, Yandex, Seznam, Naver...) with the live sitemap's URLs,
// or just the paths given: `npm run indexnow -- /faq /island-retreat`.
// The key is public by design: it sits at https://gulfcoaststays.co/<key>.txt.
// Expect 202 the first time (key pending verification) and 200 after.
import { readdirSync, readFileSync } from "node:fs";

const host = "gulfcoaststays.co";
const site = `https://${host}`;
const keyFile = readdirSync(new URL("../public/", import.meta.url)).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("No IndexNow key file in public/");
const key = readFileSync(new URL(`../public/${keyFile}`, import.meta.url), "utf8").trim();
const keyLocation = `${site}/${keyFile}`;

async function retry(fn, tries = 6) {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i >= tries) throw e;
      await new Promise((r) => setTimeout(r, 10_000));
    }
  }
}

// The key file must be live before IndexNow can verify it (a deploy may still be aliasing).
await retry(async () => {
  const res = await fetch(keyLocation, { cache: "no-store" });
  const text = (await res.text()).trim();
  if (!res.ok || text !== key) throw new Error(`Key file not live yet at ${keyLocation} (${res.status})`);
});

const paths = process.argv.slice(2).filter((a) => a.startsWith("/"));
const urlList = paths.length
  ? paths.map((p) => new URL(p, site).href)
  : await retry(async () => {
      const xml = await (await fetch(`${site}/sitemap.xml`, { cache: "no-store" })).text();
      const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
      if (!locs.length) throw new Error("Sitemap has no URLs");
      return locs;
    });

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList }),
});
console.log(`IndexNow ${res.status} ${res.statusText} for ${urlList.length} URLs`);
for (const u of urlList) console.log(`  ${u}`);
if (![200, 202].includes(res.status)) {
  console.error(await res.text());
  process.exit(1);
}
