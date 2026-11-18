// Fix Santa Ynez hero artifact + nearby items in batch28.mjs script source.
import { readFileSync, writeFileSync } from "node:fs";
const p = "scripts/batch28.mjs";
let s = readFileSync(p, "utf8");
const i = s.indexOf("? no,");
if (i >= 0) {
  s = s.slice(0, i) + "pour" + s.slice(i + "? no, seventy wineries pour".length);
  console.log("artifact fixed at", i);
} else console.log("no artifact found");
s = s.replace(
  '"items":[{"city":"Santa Ynez Valley Area"}]',
  '"items":[{"city":"Cayucos"},{"city":"Monterey"},{"city":"Los Angeles"}]'
);
writeFileSync(p, s);
console.log("nearby fixed");
