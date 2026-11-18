// Fix MT/VT glue + collapse the Middletown multi-line faqs array.
import { readFileSync, writeFileSync } from "node:fs";
let s = readFileSync("scripts/batch31.mjs", "utf8");
if (s.includes('"via":"MT-324 W"}}},{"state":"vt"')) {
  s = s.replace('"via":"MT-324 W"}}},{"state":"vt"', '"via":"MT-324 W"}}},\n{"state":"vt"');
}
const a = 'the June-through-October 2-to-4 windows."},\n{"q":"Which airport serves the hamlet?","a":"The Albany field rides the region\'s nearest major gateway with the county field the local row."},\n{"q":"What fits a quiet half?","a":"The spring park\'s morning rows and the museum\'s Sunday afternoon, one hamlet plan."}]';
const b = 'the June-through-October 2-to-4 windows."},{"q":"Which airport serves the hamlet?","a":"The Albany field rides the region\'s nearest major gateway with the county field the local row."},{"q":"What fits a quiet half?","a":"The spring park\'s morning rows and the museum\'s Sunday afternoon, one hamlet plan."}]';
if (s.includes(a)) s = s.replace(a, b);
else console.log("faq split not found (check manually)");
writeFileSync("scripts/batch31.mjs", s);
console.log("fixed");
