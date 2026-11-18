// Force-replace the 135 batch31 entries in data with the corrected module ENTRIES.
import { readFileSync, writeFileSync } from "node:fs";
const { BATCH31 } = await import("./batch31.mjs");
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
let replaced = 0, added = 0;
for (const e of BATCH31) {
  const i = data.findIndex((c) => c.state === e.state && c.slug === e.slug);
  if (i >= 0) { const old = data[i]; data[i] = e; replaced++; continue; }
  data.push(e); added++;
}
writeFileSync(path, JSON.stringify(data, null, 2));
console.log(`replaced ${replaced}, added ${added}, total ${data.length}`);
