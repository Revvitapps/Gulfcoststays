// Accessibility audit: axe-core over each page in jsdom, plus WCAG contrast
// on the brand colour pairs the design uses. Requires `npm run build`.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { JSDOM, VirtualConsole } from "jsdom";

const axeSource = readFileSync("node_modules/axe-core/axe.min.js", "utf8");
const port = process.env.CHECK_PORT ?? "3996";
const base = `http://127.0.0.1:${port}`;
const paths = ["/", "/island-retreat", "/rates", "/book", "/area", "/faq", "/about", "/contact", "/privacy", "/more", "/audit", "/thanks"];
const layoutRules = { "color-contrast": { enabled: false }, "target-size": { enabled: false } };

const server = spawn("node", ["node_modules/next/dist/bin/next", "start", "-p", port], { stdio: ["ignore", "pipe", "pipe"] });
const stop = () => server.kill("SIGTERM");
process.on("exit", stop);

try {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(base + "/robots.txt")).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  let checks = 0;
  const failures = [];
  for (const path of paths) {
    const html = await (await fetch(base + path)).text();
    const dom = new JSDOM(html, { url: base + path, pretendToBeVisual: true, runScripts: "outside-only", virtualConsole: new VirtualConsole() });
    const { window } = dom;
    window.matchMedia ??= () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
    window.eval(axeSource);
    const results = await window.axe.run(window.document, { resultTypes: ["violations"], rules: layoutRules });
    checks += results.passes.length + results.violations.length;
    for (const v of results.violations) failures.push(`${path}: ${v.id} (${v.impact}) — ${v.help}\n    ${v.nodes.slice(0, 3).map((n) => n.html.slice(0, 120)).join("\n    ")}`);
    dom.window.close();
  }

  const hex = (c) => c.replace("#", "").match(/../g).map((h) => parseInt(h, 16));
  const lum = (c) => hex(c).map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
  const ratio = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };
  const blend = (fg, bg, a) => "#" + hex(fg).map((v, i) => Math.round(v * a + hex(bg)[i] * (1 - a)).toString(16).padStart(2, "0")).join("");
  const navy = "#0f1e2e", bone = "#f4f1ea", white = "#ffffff", card = "#fffdf9", seafoam = "#cfe3d6", orange = "#d9622b", orangeDeep = "#b24a18", teal = "#1f6f78", muted = "#5e6873", slate = "#5b6b7a";
  const pairs = [
    ["body on bone", navy, bone, 4.5], ["body on card", navy, card, 4.5], ["body on seafoam", navy, seafoam, 4.5],
    ["muted on bone", muted, bone, 4.5], ["muted on card", muted, card, 4.5], ["slate lede on bone", slate, bone, 4.5],
    ["eyebrow orange-deep on bone", orangeDeep, bone, 4.5], ["eyebrow orange-deep on card", orangeDeep, card, 4.5],
    ["teal link on bone", teal, bone, 4.5], ["teal link on card", teal, card, 4.5],
    ["white on navy", white, navy, 4.5], ["white on orange-deep button", white, orangeDeep, 4.5], ["white on teal fab", white, teal, 4.5],
    ["tab label on navy", blend(white, navy, 0.72), navy, 4.5], ["navy small on navy band 70%", blend(white, navy, 0.7), navy, 4.5],
    ["orange eyebrow on navy (large/label)", orange, navy, 3], ["white on orange orb (icon)", white, orange, 3],
    ["chip orange white text", white, orange, 3], ["warn placeholder", "#8a4b00", "#fff1dd", 4.5], ["season peak label", white, orange, 3],
    ["script accent orange on navy (large)", orange, navy, 3], ["hero lede 85% white on navy", blend(white, navy, 0.85), navy, 4.5],
  ];
  for (const [name, fg, bg, min] of pairs) {
    const r = ratio(fg, bg);
    checks++;
    if (r < min) failures.push(`contrast: ${name} is ${r.toFixed(2)}:1, needs ${min}:1 (${fg} on ${bg})`);
  }
  if (failures.length) {
    console.error("Accessibility violations:\n" + failures.join("\n"));
    assert.fail(`${failures.length} accessibility violation(s)`);
  }
  console.log(`PASS a11y: no axe violations across ${paths.length} pages, ${pairs.length} colour pairs meet WCAG (${checks} checks).`);
} finally {
  stop();
}
