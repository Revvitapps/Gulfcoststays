// Exercises public/sw.js in a fake service-worker environment. Run with
// `npm run check:offline`.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const origin = "https://preview.test";
const handlers = {};
const caches = new Map();
const keyOf = (request) => new URL(typeof request === "string" ? request : request.url, origin).href;
let networkDown = false;

function makeCache(name) {
  const store = new Map();
  const cache = {
    store,
    add: async (request) => store.set(keyOf(request), { body: "page:" + keyOf(request) }),
    addAll: async (requests) => {
      for (const request of requests) await cache.add(request);
    },
    match: async (request) => store.get(keyOf(request)),
    put: async (request, response) => store.set(keyOf(request), response),
    keys: async () => [...store.keys()].map((url) => ({ url })),
    delete: async (request) => store.delete(keyOf(request)),
  };
  caches.set(name, cache);
  return cache;
}

const sandbox = {
  URL,
  self: {
    location: { origin },
    addEventListener: (name, fn) => (handlers[name] = fn),
    skipWaiting: async () => {},
    clients: { claim: async () => {} },
  },
  caches: {
    open: async (name) => caches.get(name) ?? makeCache(name),
    keys: async () => ["gcs-static-v0", ...caches.keys()],
    delete: async (name) => caches.delete(name),
  },
  fetch: async (request) => {
    if (networkDown) throw new TypeError("Failed to fetch");
    return { ok: true, type: "basic", body: "net:" + keyOf(request), text: async () => "", clone() { return this; } };
  },
};
runInNewContext(readFileSync("public/sw.js", "utf8"), sandbox);

const run = (name, event) =>
  new Promise((resolve) => {
    let handled = false;
    handlers[name]({
      ...event,
      waitUntil: (p) => resolve(p),
      respondWith: (p) => {
        handled = true;
        resolve(p);
      },
    });
    if (!handled && name === "fetch") resolve(undefined);
  });
const nav = (path) => ({ request: { url: origin + path, method: "GET", mode: "navigate" } });
const get = (path, mode = "cors") => ({ request: { url: origin + path, method: "GET", mode } });

await run("install", {});
const pages = caches.get("gcs-pages-v1");
for (const path of ["/", "/book", "/rates", "/offline.html"]) assert.ok(pages.store.has(origin + path), `install precaches ${path}`);

await run("activate", {});
assert.ok(!caches.has("gcs-static-v0"), "activate drops old caches");

// Online navigation is network-first and stored for later.
const online = await run("fetch", nav("/island-retreat"));
assert.equal(online.body, "net:" + origin + "/island-retreat");
assert.ok(pages.store.has(origin + "/island-retreat"), "visited page cached");

// Static assets are cache-first and bounded.
for (let i = 0; i < 200; i++) await run("fetch", get(`/photos/${i}.webp`));
await run("fetch", get("/_next/static/chunks/app.js"));
const statics = caches.get("gcs-static-v1");
assert.equal(statics.store.size, 150, "static cache is bounded");

// Offline: visited pages come from cache, unknown pages get the offline page.
networkDown = true;
assert.equal((await run("fetch", nav("/island-retreat"))).body, "net:" + origin + "/island-retreat");
assert.equal((await run("fetch", nav("/rates"))).body, "net:" + origin + "/rates");
assert.equal((await run("fetch", nav("/never-visited"))).body, "net:" + origin + "/offline.html");
networkDown = false;

// Page cache is bounded but keeps the app shell.
for (let i = 0; i < 60; i++) await run("fetch", nav(`/p${i}`));
assert.equal(pages.store.size, 40, "page cache is bounded");
for (const path of ["/", "/book", "/rates", "/offline.html"]) assert.ok(pages.store.has(origin + path), `${path} survives trimming`);

// Non-GET, cross-origin and API requests are never intercepted.
for (const request of [
  { url: origin + "/api/pipeline", method: "POST", mode: "cors" },
  { url: origin + "/api/pipeline", method: "GET", mode: "cors" },
  { url: origin + "/thanks", method: "POST", mode: "cors" },
  { url: "https://elsewhere.test/images/x.png", method: "GET", mode: "cors" },
]) {
  assert.equal(await run("fetch", { request }), undefined, request.url);
}

console.log("PASS offline: app shell precached, visited pages served offline, bounded caches, API and POST untouched.");
