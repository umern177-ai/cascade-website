import { readFileSync, writeFileSync } from "node:fs";
let s = readFileSync("scripts/batch30.mjs", "utf8");
// 1. Los Ojos missing quote
const a = '"/services/school-transportation/},{"title":"Steam Train Drives"';
const b = '"/services/school-transportation/"},{"title":"Steam Train Drives"';
if (!s.includes(a)) { console.log("los-ojos pattern not found"); process.exit(1); }
s = s.replace(a, b);
// 2. Mullica Hill: remove the 4th (Philadelphia) service to keep exactly 3
const c = '{"title":"Philadelphia Transfers","text":"The US-322 corridors ride the Philadelphia airport routes.","href":"/services/airport-transfer/"},{"title":"Newark Transfers"';
// not present; find the actual mullica-hill services tail
writeFileSync("scripts/batch30.mjs", s);
console.log("los-ojos quote fixed");
