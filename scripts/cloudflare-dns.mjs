// Points gulfcoaststays.co at Vercel via the Cloudflare API.
// Usage: CLOUDFLARE_API_TOKEN=... node scripts/cloudflare-dns.mjs [--apply]
// Token scope: Zone → DNS → Edit on gulfcoaststays.co. Never commit it.
// Without --apply it prints the zone's current records and the plan.
// Mail records (MX, SPF, DKIM, DMARC, Google verification) are never touched.
const token = process.env.CLOUDFLARE_API_TOKEN;
if (!token) {
  console.error("CLOUDFLARE_API_TOKEN is not set");
  process.exit(2);
}
const ZONE_NAME = process.env.ZONE_NAME ?? "gulfcoaststays.co";
const apply = process.argv.includes("--apply");
const api = async (path, init = {}) => {
  const res = await fetch("https://api.cloudflare.com/client/v4" + path, { ...init, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(init.headers ?? {}) } });
  const body = await res.json();
  if (!body.success) throw new Error(`${path}: ${JSON.stringify(body.errors)}`);
  return body.result;
};
const [zone] = await api(`/zones?name=${ZONE_NAME}`);
if (!zone) throw new Error(`Zone ${ZONE_NAME} not found for this token`);
console.log(`Zone ${zone.name} (${zone.id}) status=${zone.status}`);
const records = await api(`/zones/${zone.id}/dns_records?per_page=200`);
console.log("\nCurrent records:");
for (const r of records) console.log(`  ${r.type.padEnd(6)} ${r.name.padEnd(28)} ${r.content}  proxied=${r.proxied}`);

const wanted = [
  { type: "A", name: ZONE_NAME, content: "76.76.21.21", proxied: false, ttl: 1, comment: "Vercel (gulf-coast-stays)" },
  { type: "CNAME", name: `www.${ZONE_NAME}`, content: "cname.vercel-dns.com", proxied: false, ttl: 1, comment: "Vercel (gulf-coast-stays)" },
];
const plan = [];
for (const w of wanted) {
  const same = records.filter((r) => r.name === w.name && ["A", "AAAA", "CNAME"].includes(r.type));
  const keep = same.find((r) => r.type === w.type && r.content === w.content && r.proxied === w.proxied);
  for (const r of same) if (r !== keep) plan.push({ op: "delete", r });
  if (!keep) plan.push({ op: "create", w });
}
console.log("\nPlan:");
if (!plan.length) console.log("  nothing to change");
for (const p of plan) console.log(p.op === "delete" ? `  delete ${p.r.type} ${p.r.name} -> ${p.r.content} (proxied=${p.r.proxied})` : `  create ${p.w.type} ${p.w.name} -> ${p.w.content} (DNS only)`);
if (!apply) {
  console.log("\nDry run. Re-run with --apply to make these changes.");
  process.exit(0);
}
for (const p of plan) {
  if (p.op === "delete") await api(`/zones/${zone.id}/dns_records/${p.r.id}`, { method: "DELETE" });
  else await api(`/zones/${zone.id}/dns_records`, { method: "POST", body: JSON.stringify(p.w) });
  console.log(`${p.op} done: ${p.op === "delete" ? p.r.name : p.w.name}`);
}
console.log("Done.");
