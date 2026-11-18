// Fix glued lines and ternary hrefs in batch31.
import { readFileSync, writeFileSync } from "node:fs";
let s = readFileSync("scripts/batch31.mjs", "utf8");
const glueFixes = [
  ['"via":"Main St"}}},{"state":"mo"', '"via":"Main St"}}},\n{"state":"mo"'],
  ['"via":"N Main St"}}},{"state":"ca"', '"via":"N Main St"}}},\n{"state":"ca"'],
  ['"via":"Reservoir Rd"}}},{"state":"ca"', '"via":"Reservoir Rd"}}},\n{"state":"ca"'],
  ['"via":"Woodley Ave"}}},{"state":"ut"', '"via":"Woodley Ave"}}},\n{"state":"ut"'],
  ['"time":"~8 min","via":"MO-76"}}},{', '"time":"~8 min","via":"MO-76"}},\n{'],
];
for (const [a, b] of glueFixes) if (s.includes(a)) s = s.replace(a, b);
s = s.replaceAll('/services/field-trips" !== "" ? "/services/school-transportation/" : "/services/school-transportation/"', '/services/school-transportation/');
s = s.replaceAll('/services/field-trips-page" !== "" ? "/services/school-transportation/" : "/services/school-transportation/"', '/services/school-transportation/');
s = s.replaceAll('/services/field-trips-page', '/services/school-transportation/');
s = s.replaceAll('/services/field-trips"', '"/services/school-transportation/"');
writeFileSync("scripts/batch31.mjs", s);
console.log("fixes applied");
