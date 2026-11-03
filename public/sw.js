// Gulf Coast Stays service worker (Revvit PWA shell).
//  - App shell (home, the home page, rates, book, area, more, offline page) is
//    precached at install together with the JS and CSS those pages load, so
//    the booking form works on first use with no signal.
//  - Page navigations are network-first; the last good copy of a page is
//    served when offline, then the offline page.
//  - Images, icons and hashed build assets are cache-first, bounded.
//  - API requests and anything that is not a GET are never touched.
const VERSION = "v1";
const STATIC_CACHE = `gcs-static-${VERSION}`;
const PAGE_CACHE = `gcs-pages-${VERSION}`;
const OFFLINE_PAGE = "/offline.html";
// The home, rates and booking form must open with no signal.
const APP_SHELL = ["/", "/island-retreat", "/rates", "/book", "/area", "/more", OFFLINE_PAGE];
// Badges are on every page and the offline page.
const SHELL_ASSETS = ["/brand/gcs-badge.webp", "/brand/island-retreat-badge.webp"];
const MAX_STATIC = 150;
const MAX_PAGES = 40;
const STATIC_PATTERNS = [/^\/photos\//, /^\/pwa\//, /^\/brand\//, /^\/_next\/static\//, /^\/_next\/image/];

async function precacheShell() {
  const pages = await caches.open(PAGE_CACHE);
  const statics = await caches.open(STATIC_CACHE);
  const assets = new Set(SHELL_ASSETS);
  for (const path of APP_SHELL) {
    const response = await fetch(path, { cache: "reload" });
    if (!response.ok) continue;
    await pages.put(path, response.clone());
    const html = await response.text();
    for (const match of html.matchAll(/\/_next\/static\/[^"'\s)]+/g)) assets.add(match[0]);
  }
  await Promise.all([...assets].map((url) => statics.add(url).catch(() => {})));
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheShell().then(() => self.skipWaiting?.()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("gcs-") && key !== STATIC_CACHE && key !== PAGE_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients?.claim?.()),
  );
});

async function trim(cache, max, keep) {
  const keys = await cache.keys();
  if (keys.length <= max) return;
  const victim = keys.find((request) => !keep.includes(new URL(request.url).pathname));
  if (victim) await cache.delete(victim);
}

async function handleNavigation(request) {
  const cache = await caches.open(PAGE_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
      await trim(cache, MAX_PAGES, APP_SHELL);
    }
    return response;
  } catch {
    const cached = await cache.match(request, { ignoreSearch: true });
    return cached || cache.match(OFFLINE_PAGE);
  }
}

async function handleStatic(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok && response.type === "basic") {
    await cache.put(request, response.clone());
    await trim(cache, MAX_STATIC, []);
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }
  if (STATIC_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    event.respondWith(handleStatic(request));
  }
});
