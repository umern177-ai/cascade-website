// List all NEW-involving same-state pairs over the 0.20 gate.
import { chromium } from "playwright";
import fs from "node:fs";
const data = JSON.parse(fs.readFileSync("data/city-pages.json", "utf8"));
const src = fs.readFileSync("scripts/check-batch18.mjs", "utf8");
const NEW = new Set([...src.matchAll(/"([a-z]{2}\/[a-z-]+)"/g)].map((m) => m[1]));
const states = new Set([...NEW].map((k) => k.split("/")[0]));
const pages = data.filter((c) => states.has(c.state)).map((c) => ({ state: c.state, slug: c.slug, isNew: NEW.has(c.state + "/" + c.slug) }));
function shingles(text, n = 5) { const w = text.toLowerCase().split(/\s+/).filter(Boolean); const s = new Set(); for (let i = 0; i + n <= w.length; i++) s.add(w.slice(i, i + n).join(" ")); return s; }
function jac(a, b) { let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i); }
const browser = await chromium.launch();
const pg = await browser.newPage();
const texts = {};
for (const p of pages) {
  await pg.goto("http://localhost:3100/locations/" + p.state + "/" + p.slug + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  const body = await pg.evaluate(() => { const el = document.querySelector("main"); if (!el) return ""; const c = el.cloneNode(true); for (const q of ["nav","button","script","svg"]) c.querySelectorAll(q).forEach((e) => e.remove()); return (c.textContent || "").replace(/\s+/g, " ").trim(); });
  texts[p.state + "/" + p.slug] = { s: shingles(body), isNew: p.isNew };
}
await browser.close();
const keys = Object.keys(texts);
const fails = [];
for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
  if (!texts[keys[i]].isNew && !texts[keys[j]].isNew) continue;
  const v = jac(texts[keys[i]].s, texts[keys[j]].s);
  if (v >= 0.19) fails.push([v, keys[i], keys[j], texts[keys[i]].s.size, texts[keys[j]].s.size]);
}
fails.sort((a, b) => b[0] - a[0]);
console.log(fails.map((f) => f[0].toFixed(3) + " " + f[1] + " ~ " + f[2] + "  (" + f[3] + "/" + f[4] + ")").join("\n") || "none over 0.19");
