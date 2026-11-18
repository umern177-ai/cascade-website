// One-off artifact cleanup for data/city-pages.json (Nov 16).
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
let fixes = 0;
for (const e of data) {
  const walk = (obj) => {
    if (typeof obj === "string") {
      if (obj.includes("TheNotre")) { obj.replaceAll; }
      return obj.replace(/TheNotre/g, "The Notre");
    }
    if (Array.isArray(obj)) return obj.map(walk);
    if (obj && typeof obj === "object") {
      for (const [k, v] of Object.entries(obj)) obj[k] = walk(v);
      return obj;
    }
    return obj;
  };
  const clean = walk(e);
  if (JSON.stringify(clean) !== JSON.stringify(e)) fixes++;
  Object.assign(e, clean);
}
// Targeted fixes on specific entries
const get = (st, sl) => data.find((c) => c.state === st && c.slug === sl);
// columbus: bad source link "Columbus,_ Indiana"
const col = get("in", "columbus");
if (col) col.sourceLinks = col.sourceLinks.map((u) => u.replace("Columbus,_ Indiana", "Columbus,_Indiana"));
// lowell: sourceLinks trailing artifact " Low"
const lo = get("in", "lowell");
if (lo && lo.sourceLinks.some((u) => u.trim() === "Low")) {
  lo.sourceLinks = lo.sourceLinks.map((u) => (u.trim() === "Low" ? "https://en.wikipedia.org/wiki/Lowell,_Indiana" : u));
}
// ", Ind" occurrences — find and inspect first
writeFileSync(path, JSON.stringify(data, null, 2));
console.log("string-fix entries:", fixes);
for (const e of data) {
  const s = JSON.stringify(e);
  if (s.includes(", Ind ") || s.includes("#, Ind")) {
    // print context
    const i = s.indexOf(", Ind ");
    console.log("CHECK", e.state + "/" + e.slug, ":", s.slice(Math.max(0, i - 90), i + 60));
  }
}
