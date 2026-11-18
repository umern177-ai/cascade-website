import { readFileSync, writeFileSync } from "node:fs";
let s = readFileSync("scripts/batch30.mjs", "utf8");
const fixes = [
  ['/services/field-trips-page" !== "" ? "/services/school-transportation/" : "/services/school-transportation/"', '/services/school-transportation/'],
  ['/services/field-trips-page', '/services/school-transportation/'],
  ['neighboringFrankford', 'neighboring Frankford'],
  ['["https://harrisontwp.us/","https://visitfhu.org"].includes("x") ? ["https://www.nj.gov/dep/hpo/"] : ["https://www.harrison-twp.nj.us/","https://williamheritagewinery.com/"]', '["https://williamheritagewinery.com/","https://www.nj.gov/","https://visitnj.org"]'],
  ['https://www.stoneharbor nj.us/', 'https://capemaycountynj.gov/'],
];
let n = 0;
for (const [a, b] of fixes) { if (s.includes(a)) { s = s.replaceAll(a, b); n++; } }
writeFileSync("scripts/batch30.mjs", s);
console.log("applied", n, "of", fixes.length, "fixes");
const m = await import("../scripts/batch30.mjs");
console.log("module OK, ENTRIES:", m.ENTRIES.length);
const slugs = m.ENTRIES.map((e) => e.state + "/" + e.slug);
console.log("dupe check:", slugs.length === new Set(slugs).size ? "no dupes" : "DUPES!");
