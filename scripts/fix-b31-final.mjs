// Final final: split glued ME/WV line, fix field-trips hrefs, fix singleton nearby.
import { readFileSync, writeFileSync } from "node:fs";
let s = readFileSync("scripts/batch31.mjs", "utf8");
if (s.includes('"via":"Park Loop Rd"}}},{"state":"wv"')) {
  s = s.replace('"via":"Park Loop Rd"}}},{"state":"wv"', '"via":"Park Loop Rd"}}},\n{"state":"wv"');
}
s = s.replaceAll('/services/field-trips" !== "" ? "/services/school-transportation/" : "/services/school-transportation/"', '/services/school-transportation/');
s = s.replaceAll('/services/field-trips-page" !== "" ? "/services/school-transportation/" : "/services/school-transportation/"', '/services/school-transportation/');
s = s.replaceAll('/services/field-trips-page', '/services/school-transportation/');
s = s.replaceAll('"/services/field-trips"', '"/services/school-transportation/"');
// singleton states: single nearby item is the only valid same-state pick; do NOT duplicate.
writeFileSync("scripts/batch31.mjs", s);
console.log("done");
