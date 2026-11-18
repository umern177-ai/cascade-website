// Fix remaining glue lines + field-trips hrefs.
import { readFileSync, writeFileSync } from "node:fs";
let s = readFileSync("scripts/batch31.mjs", "utf8");
if (s.includes('"via":"US-50"}}},{"state":"al"')) s = s.replace('"via":"US-50"}}},{"state":"al"', '"via":"US-50"}}},\n{"state":"al"');
if (s.includes('"via":"US-231 N"}}},{"state":"il"')) s = s.replace('"via":"US-231 N"}}},{"state":"il"', '"via":"US-231 N"}}},\n{"state":"il"');
s = s.replaceAll('/services/field-trips" !== "" ? "/services/school-transportation/" : "/services/school-transportation/"', '/services/school-transportation/');
s = s.replaceAll('/services/field-trips-page" !== "" ? "/services/school-transportation/" : "/services/school-transportation/"', '/services/school-transportation/');
s = s.replaceAll('/services/field-trips-page', '/services/school-transportation/');
s = s.replaceAll('"/services/field-trips"', '"/services/school-transportation/"');
writeFileSync("scripts/batch31.mjs", s);
const m = await import("../scripts/batch31.mjs");
console.log("module entries:", m.BATCH31.length);
