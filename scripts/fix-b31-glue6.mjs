// Final batch31 polish: fix ternaries, typo titles, glue.
import { readFileSync, writeFileSync } from "node:fs";
let s = readFileSync("scripts/batch31.mjs", "utf8");
const fixes = [
  ['{"city":"Idabel" in true ? ["Idabel"]:"Stillwater"}', '{"city":"Stillwater"}'],
  ['"DistRICT and Mural Walks"', '"District and Mural Walks"'],
  ['WV for the race-night casino runs', 'WV for the race-night casino runs'],
];
for (const [x, y] of fixes) if (s.includes(x)) s = s.replaceAll(x, y);
writeFileSync("scripts/batch31.mjs", s);
const m = await import("../scripts/batch31.mjs");
console.log("module entries:", m.BATCH31.length);
const slugs = m.BATCH31.map((e) => e.state + "/" + e.slug);
console.log("dupes:", slugs.length - new Set(slugs).size);
