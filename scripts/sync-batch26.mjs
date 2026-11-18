// Reusable: sync scripts/batch26.mjs ENTRIES to current data for its slugs.
import fs from "node:fs";
const src = fs.readFileSync("scripts/batch26.mjs", "utf8");
const m = src.match(/const ENTRIES = \[([\s\S]*?)\n\];/);
const arr = eval("[" + m[1] + "]");
const data = JSON.parse(fs.readFileSync("data/city-pages.json", "utf8"));
for (let i = 0; i < arr.length; i++) {
  const e = data.find((c) => c.state === arr[i].state && c.slug === arr[i].slug);
  if (JSON.stringify(e) !== JSON.stringify(arr[i])) arr[i] = e;
}
fs.writeFileSync(
  "scripts/batch26.mjs",
  "const ENTRIES = " + JSON.stringify(arr, null, 1) + ";\n\nimport { readFileSync, writeFileSync } from \"node:fs\";\nconst path = \"data/city-pages.json\";\nconst data = JSON.parse(readFileSync(path, \"utf8\"));\nlet added = 0, skipped = 0;\nfor (const e of ENTRIES) {\n  if (data.some((c) => c.state === e.state && c.slug === e.slug)) { skipped++; continue; }\n  data.push(e);\n  added++;\n}\nwriteFileSync(path, JSON.stringify(data, null, 2));\nconsole.log(`Batch 26: added ${added}, skipped ${skipped}, total ${data.length}`);\n"
);
console.log("batch26 synced");
