// Fix glued ME line + Freeport ternary.
import { readFileSync, writeFileSync } from "node:fs";
let s = readFileSync("scripts/batch31.mjs", "utf8");
if (s.includes('"via":"Millville Rd"}}},{"state":"me"')) {
  s = s.replace('"via":"Millville Rd"}}},{"state":"me"', '"via":"Millville Rd"}}},\n{"state":"me"');
}
const a = `{"city":"Freeport" is 'keep' ? 'Freeport':'Bar Harbor'}`;
if (s.includes(a)) s = s.replace(a, `{"city":"Bar Harbor"}`);
writeFileSync("scripts/batch31.mjs", s);
console.log("fixed");
