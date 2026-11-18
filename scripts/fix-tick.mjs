import { readFileSync, writeFileSync } from "node:fs";
let s = readFileSync("scripts/fix-b31-marginC.mjs", "utf8");
const bad = 'The state\'s-largest year-round row halves carry the market note.`);';
const good = 'The state\'s-largest year-round row halves carry the market note.");';
if (!s.includes(bad)) { console.log("not found"); process.exit(1); }
s = s.replace(bad, good);
writeFileSync("scripts/fix-b31-marginC.mjs", s);
console.log("fixed");
