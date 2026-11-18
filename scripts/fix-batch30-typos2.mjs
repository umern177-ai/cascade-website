import { readFileSync, writeFileSync } from "node:fs";
let s = readFileSync("scripts/batch30.mjs", "utf8");
const a = '/services/field-trips" !== "" ? "/services/sightseeing-tour-bus/" : "/services/sightseeing-tour-bus/"';
const b = '/services/sightseeing-tour-bus/';
if (!s.includes(a)) { console.log("not found"); process.exit(1); }
s = s.replace(a, b);
writeFileSync("scripts/batch30.mjs", s);
const lines = s.split("\n");
let i = 0, fail = 0;
for (let n = 0; n < lines.length; n++) {
  const L = lines[n].trim();
  if (!L.startsWith('{"state"')) continue;
  try { JSON.parse(L.replace(/,\s*$/, '')); i++; } catch (e) { fail++; console.log("LINE", n + 1, "FAIL:", e.message.slice(0, 90)); }
}
console.log("entries:", i, "fail:", fail);
