// Bracket-balance scan to locate the early-closing brace in the Tillamook entry line.
import { readFileSync, writeFileSync } from "node:fs";
let s = readFileSync("scripts/batch31.mjs", "utf8");
const lines = s.split("\n");
const L = lines[9];
let depth = 0, inStr = false, esc = false, done = false;
for (let i = 0; i < L.length && !done; i++) {
  const c = L[i];
  if (esc) { esc = false; continue; }
  if (inStr && c === "\\") { esc = true; continue; }
  if (c === '"') { inStr = !inStr; continue; }
  if (inStr) continue;
  if (c === "{" || c === "[") depth++;
  if (c === "}" || c === "]") {
    depth--;
    if (depth <= 0) { console.log("depth " + depth + " at pos " + (i + 1), JSON.stringify(L.slice(Math.max(0, i - 70), i + 50))); done = true; }
  }
}
// fix: replace the pattern found (likely an extra } before ,{"state":"co")
