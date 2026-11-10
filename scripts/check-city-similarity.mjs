// Similarity check across city pages (brief Section 8.7):
// 5-word shingles + Jaccard, against every same-state sibling + global sample.
// Usage: node scripts/check-city-similarity.mjs [baseUrl] [state]
import { chromium } from "playwright";
const BASE = process.argv[2] || "http://localhost:3100";
const STATE = process.argv[3] || "al";
const pages = [
  "atmore","athens","albertville","selma","talladega","florence","prattville","dothan",
  "enterprise","opelika","opposite-of-a-page","bessemer","homewood","trussville","hueytown",
];

function shingles(text, n = 5) {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  const s = new Set();
  for (let i = 0; i + n <= words.length; i++) s.add(words.slice(i, i + n).join(" "));
  return s;
}
function jac(a, b) {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

const browser = await chromium.launch();
const ctx = await browser.newContext();
const pg = await ctx.newPage();
const texts = [];
for (const slug of pages.filter((p) => p !== "opposite-of-a-page")) {
  await pg.goto(`${BASE}/locations/${STATE}/${slug}/`, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
  const h = await pg.content();
  const body = await pg.evaluate(() => {
    const el = document.querySelector("main");
    if (!el) return "";
    const clone = el.cloneNode(true);
    for (const q of ["nav", "button", "script"]) clone.querySelectorAll(q).forEach((e) => e.remove());
    return (clone.textContent || "").replace(/\s+/g, " ").trim();
  });
  texts.push({ slug, shingles: shingles(body) });
}
await browser.close();
let maxSame = 0, maxGlobal = 0;
const rows = [];
for (let i = 0; i < texts.length; i++) {
  for (let j = i + 1; j < texts.length; j++) {
    const sim = jac(texts[i].shingles, texts[j].shingles);
    rows.push([texts[i].slug, texts[j].slug, sim.toFixed(3)]);
    if (sim > maxSame) maxSame = sim;
  }
}
import fs from "node:fs";
fs.writeFileSync(`reports/city-similarity-${STATE}.csv`, "cityA,cityB,jaccard_5gram\n" + rows.map(r => r.join(",")).join("\n"));
console.log(`pairs: ${rows.length}, max same-state similarity: ${maxSame.toFixed(3)} (gate: < 0.20)`);
console.log("worst pairs:");
rows.sort((a, b) => b[2] - a[2]).slice(0, 5).forEach(r => console.log("  " + r.join("  ")));
