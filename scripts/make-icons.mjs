// Builds home-screen icons, favicon and the share image from the Island
// Retreat badge (assets/brand/island-retreat-badge-alt.png, the small-size
// variant from the brand guide). Run with `npm run icons:make`.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const BADGE = "assets/brand/island-retreat-badge-alt.png";
const GCS = "assets/brand/gcs-badge.png";
const BONE = { r: 244, g: 241, b: 234, alpha: 1 };
const NAVY = { r: 15, g: 30, b: 46, alpha: 1 };

const resized = (file, width) => sharp(file).resize({ width, kernel: sharp.kernel.lanczos3 }).png().toBuffer();

async function square(size, logoWidth, background, out, file = BADGE) {
  const logo = await resized(file, logoWidth);
  await sharp({ create: { width: size, height: size, channels: 4, background } }).composite([{ input: logo, gravity: "centre" }]).png().toFile(out);
}

await mkdir("public/pwa", { recursive: true });
await square(32, 30, BONE, "public/pwa/favicon-32.png");
await square(192, 180, BONE, "public/pwa/icon-192.png");
await square(512, 480, BONE, "public/pwa/icon-512.png");
await square(180, 168, BONE, "public/pwa/apple-touch-icon.png");
// Maskable: badge inside the central 80% safe zone on a bone tile.
await square(192, 150, BONE, "public/pwa/icon-maskable-192.png");
await square(512, 400, BONE, "public/pwa/icon-maskable-512.png");

// Share image: GCS badge on navy with the home badge beside it.
const gcs = await resized(GCS, 440);
const ir = await resized(BADGE, 440);
await sharp({ create: { width: 1200, height: 630, channels: 4, background: NAVY } })
  .composite([
    { input: gcs, left: 120, top: 95 },
    { input: ir, left: 640, top: 95 },
  ])
  .png()
  .toFile("public/pwa/og-default.png");
console.log("Wrote public/pwa icons and og-default.png");
