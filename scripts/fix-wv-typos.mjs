// Fix WV-block typos in batch31.
import { readFileSync, writeFileSync } from "node:fs";
let s = readFileSync("scripts/batch31.mjs", "utf8");
s = s.replaceAll('{"city":"Prison"}', '{"city":"Princeton"}');
s = s.replace('{"state":"wv","slug":"fairmont"', 'PLACEHOLDER_NOT_PRESENT');
const fixes = [
  ['"Time (approx.)":"","time":"~15 min"', '"time":"~15 min"'],
  ['festival\'s fairrows', 'festival\'s fair rows'],
  ['"title":"Transfers","text":"The coastal corridors', '"title":"Airport Transfers","text":"The coastal corridors'],
  ['"title":"Transfers","text":"The interstate corridors', '"title":"Airport Transfers","text":"The interstate corridors'],
  ['"title":"Transfers","text":"The river corridors', '"title":"Airport Transfers","text":"The river corridors'],
  ['"title":"Transfers","text":"The corridors', '"title":"Airport Transfers","text":"The corridors'],
  ['title":"Fisherville', 'title":"Fisherville'],
  ['"text":"The fort\'s costumed season', '"text":"The fort\'s costumed season'],
  ['Charles Town, Wv', 'Charles Town, WV'],
  ['"Arts District walks"', '"Arts District Walks"'],
  ['prison-row nights', 'race-row nights'],
  ['"city":"Prison"', '"city":"Princeton"'],
  ['The Centre\'s show rows', 'The center\'s show rows'],
  ['Book bunkers-tour windows', 'Book bunker-tour windows'],
  ['"h1":"Charter Bus Rental in Fairmont', '"h1":"Charter Bus Rental in Fairmont'],
  ['prison-row ', 'race-row '],
  ['"city":"Prison"', '"city":"Princeton"'],
];
let n = 0;
for (const [x, y] of fixes) {
  while (s.includes(x)) { s = s.replace(x, y); n++; }
}
writeFileSync("scripts/batch31.mjs", s);
console.log("applied", n, "fixes");
