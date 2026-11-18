import { chromium } from "playwright";
import fs from "node:fs";
const data = JSON.parse(fs.readFileSync("data/city-pages.json", "utf8"));
const src = fs.readFileSync("scripts/check-batch18.mjs", "utf8");
const NEW = new Set([...src.matchAll(/"([a-z]{2}\/[a-z-]+)"/g)].map((m) => m[1]));
const pages = data.filter((c) => NEW.has(c.state + "/" + c.slug));
const browser = await chromium.launch();
const pg = await browser.newPage();
const counts = {};
for (const p of pages) {
  await pg.goto("http://localhost:3100/locations/" + p.state + "/" + p.slug + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  const body = await pg.evaluate(() => { const el = document.querySelector("main"); if (!el) return ""; const c = el.cloneNode(true); for (const q of ["nav","button","script","svg"]) c.querySelectorAll(q).forEach((e) => e.remove()); return (c.textContent || "").replace(/\s+/g, " ").trim(); });
  const w = body.toLowerCase().split(/\s+/).filter(Boolean);
  const s = new Set();
  for (let i = 0; i + 5 <= w.length; i++) s.add(w.slice(i, i + 5).join(" "));
  counts[p.state + "/" + p.slug] = s.size;
  await pg.goto("about:blank");
}
await browser.close();
fs.writeFileSync("scripts/grams-b30.json", JSON.stringify(counts, null, 1));
const arr = Object.entries(counts).sort((a, b) => a[1] - b[1]);
console.log(arr.map((x) => x[1] + " " + x[0]).join("\n"));
console.log("under 880:", arr.filter((x) => x[1] < 880).length, "| under 950:", arr.filter((x) => x[1] < 950).length);
