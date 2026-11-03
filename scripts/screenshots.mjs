// Screenshots every main route at phone and desktop sizes, checks for
// horizontal overflow, the tab bar and the offline fallback. Requires
// `npm run build`; uses the preinstalled Playwright Chromium.
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");

const port = process.env.CHECK_PORT ?? "3995";
const base = `http://127.0.0.1:${port}`;
const routes = ["/", "/island-retreat", "/rates", "/book", "/area", "/about", "/more", "/audit"];
const viewports = { phone: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, desktop: { width: 1440, height: 900, deviceScaleFactor: 1 } };
mkdirSync("docs/shots", { recursive: true });

const server = spawn("node", ["node_modules/next/dist/bin/next", "start", "-p", port], { stdio: ["ignore", "pipe", "pipe"] });
const stop = () => server.kill("SIGTERM");
process.on("exit", stop);
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(base + "/robots.txt")).ok) break;
  } catch {}
  await new Promise((r) => setTimeout(r, 500));
}

const browser = await chromium.launch();
const problems = [];
for (const [name, vp] of Object.entries(viewports)) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.deviceScaleFactor, isMobile: vp.isMobile, hasTouch: vp.hasTouch });
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 0) problems.push(`${name} ${route}: horizontal overflow ${overflow}px`);
    const tabBar = await page.$(".tab-bar");
    if (!tabBar) problems.push(`${name} ${route}: no tab bar`);
    await page.screenshot({ path: `docs/shots/${name}${route === "/" ? "-home" : route.replace(/\//g, "-")}.png`, fullPage: route !== "/" || name === "desktop" });
  }
  // Second visit unlocks the install prompt (localStorage visit count + new session).
  await context.close();
}
// Offline: load the home, register the SW, kill the server, navigate again.
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await context.newPage();
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.waitForFunction(() => navigator.serviceWorker?.controller || navigator.serviceWorker?.ready, null, { timeout: 15000 }).catch(() => problems.push("service worker did not register"));
await page.waitForTimeout(2500);
stop();
await new Promise((r) => setTimeout(r, 1500));
await context.setOffline(true);
let offlineOk = false;
try {
  await page.goto(base + "/never-visited-page", { waitUntil: "load", timeout: 15000 });
  offlineOk = (await page.textContent("body"))?.includes("No signal") ?? false;
  await page.screenshot({ path: "docs/shots/phone-offline.png" });
  await page.goto(base + "/rates", { waitUntil: "load", timeout: 15000 });
  const rates = (await page.textContent("body"))?.includes("Snowbird");
  if (!rates) problems.push("precached /rates did not render offline");
} catch (e) {
  problems.push("offline navigation failed: " + e.message);
}
if (!offlineOk) problems.push("offline fallback page not shown");
await browser.close();
if (problems.length) {
  console.error("Problems:\n" + problems.join("\n"));
  process.exit(1);
}
console.log(`PASS shots: ${routes.length} routes × 2 viewports, no overflow, tab bar everywhere, offline fallback and precached rates work. See docs/shots/.`);
