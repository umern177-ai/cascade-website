// Fix Marion destinations block: ':' typo and null tips.
import { readFileSync, writeFileSync } from "node:fs";
let s = readFileSync("scripts/batch31.mjs", "utf8");
const a = '"destinations"},{"name":"Little Bitterroot Lake","text":"The 2,969-acre deep lake\'s public-ramp fishing rows and western shore lot gates.","tip":null},{"name":"Lost Trail Wildlife Refuge","text":"The 20-mile-out refuge\'s waterfowl, elk, moose and lynx ranges through the wildlife seasons.","tip":null},{"name":"Canyon Creek Brewery","text":"The old-hangar brewery\'s remote-country tour rows through the appointment windows.","tip":null}]';
const b = '"destinations":[{"name":"Little Bitterroot Lake","text":"The 2,969-acre deep lake\'s public-ramp fishing rows and the western shore lot gates at the Kokanee country.","tip":"The public-ramp rows stage the launch mornings, so the angler group books the western-shore windows ahead."},{"name":"Lost Trail Wildlife Refuge","text":"The 20-mile-out refuge\'s waterfowl, elk, moose and lynx ranges through the wildlife seasons.","tip":"The refuge\'s drive rows carry the wildlife halves, staged from the refuge-side gates."},{"name":"Canyon Creek Brewery","text":"The old-hangar brewery\'s remote-country tour rows through the appointment windows.","tip":"The brewery tour rows book by appointment through the valley-side lines."}]';
if (!s.includes(a)) { console.log("anchor STILL not found"); process.exit(1); }
s = s.replace(a, b);
// also fix the glued MT start
if (s.includes('"via":"S Main St"}}},{"state":"mt"')) {
  s = s.replace('"via":"S Main St"}}},{"state":"mt"', '"via":"S Main St"}}},\n{"state":"mt"');
}
writeFileSync("scripts/batch31.mjs", s);
console.log("marion fixed");
