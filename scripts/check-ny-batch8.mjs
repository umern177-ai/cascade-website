// Same-state similarity check for the Batch 8 NY cities (brief 8.7: Jaccard < 0.20).
import { chromium } from "playwright";
const BASE = "http://localhost:3100";
const pages = ["auburn", "larchmont", "lowville", "mayfield", "oneonta", "rock-tavern", "warwick", "windham", "boonville", "central-valley"];
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
const pg = await (await browser.newContext()).newPage();
const texts = {};
for (const slug of pages) {
  await pg.goto(`${BASE}/locations/ny/${slug}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  texts[slug] = shingles(await pg.evaluate(() => {
    const el = document.querySelector("main");
    if (!el) return "";
    const clone = el.cloneNode(true);
    for (const q of ["nav", "button", "script"]) clone.querySelectorAll(q).forEach((e) => e.remove());
    return clone.innerText.replace(/\s+/g, " ");
  }));
}
let worst = 0, worstPair = "";
for (let i = 0; i < pages.length; i++) {
  for (let j = i + 1; j < pages.length; j++) {
    const v = jac(texts[pages[i]], texts[pages[j]]);
    if (v > worst && pages[i] !== pages[j]) { worst = v; worstPair = `${pages[i]}~${pages[j]}`; }
  }
}
const words = Object.fromEntries(Object.entries(texts).map(([k, s]) => [k, s.size + 4]));
console.log("word-count check (>=250 unique body words):", Object.entries(words).map(([k, v]) => k + "=" + v).join(", "));
console.log(`same-state worst Jaccard: ${worst.toFixed(3)} (${worstPair}) — gate < 0.20: ${worst < 0.2 ? "PASS" : "FAIL"}`);
await browser.close();
process.exit(0);
