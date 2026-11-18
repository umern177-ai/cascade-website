// Content-audit fixes (Nov 18): missing-space typos, in-field duplicate
// sentences, Talkeetna misleading nearby, Bethany missing FAQ.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (st, sl) => data.find((c) => c.state === st && c.slug === sl);
let fixes = 0;

const SPACE_FIXES = [
  ["town tours andDenali shuttles", "town tours and Denali shuttles"],
  ["into Manhattan and theboroughs", "into Manhattan and the boroughs"],
  ["and theSeptember harvest", "and the September harvest"],
  ["andProspector golf course", "and Prospector golf course"],
  ["thePenn-Brad oil museum", "the Penn-Brad oil museum"],
  ["the GardeniaLane side", "the Gardenia Lane side"],
];
for (const e of data) {
  const walk = (o) => {
    if (typeof o === "string") {
      for (const [a, b] of SPACE_FIXES) {
        if (o.includes(a)) { o = o.replaceAll(a, b); fixes++; }
      }
      return o;
    }
    if (Array.isArray(o)) return o.map(walk);
    if (o && typeof o === "object") { for (const k of Object.keys(o)) o[k] = walk(o[k]); return o; }
    return o;
  };
  walk(e);
}

const DUP_FIELDS = [
  ["wa", "kennewick", "hero"],
  ["wa", "kennewick", "d0"],
  ["wa", "ellensburg", "hero"],
  ["wa", "ellensburg", "s0"],
  ["wa", "monroe", "s1"],
  ["wa", "monroe", "d0"],
  ["wa", "north-bend", "hero"],
  ["wa", "north-bend", "d0"],
  ["wa", "chehalis", "hero"],
  ["wa", "chehalis", "s0"],
  ["wa", "chehalis", "d0"],
  ["ma", "attleboro", "hero"],
  ["ma", "attleboro", "s0"],
  ["ma", "attleboro", "d0"],
  ["mn", "alexandria", "hero"],
];
const applyField = (e, key) => {
  let target;
  if (key === "hero") target = e.heroIntro;
  else if (key.startsWith("s")) target = (e.services[Number(key[1])] || {}).text;
  else if (key.startsWith("d")) target = (e.destinations[Number(key[1])] || {}).text;
  if (!target) return false;
  const parts = target.split(/(?<=\.)\s+/);
  const seen = new Set();
  const kept = [];
  let dropped = false;
  for (const p of parts) {
    const k = p.trim().toLowerCase();
    if (k.length > 40 && seen.has(k)) { dropped = true; continue; }
    seen.add(k);
    kept.push(p);
  }
  if (!dropped) return false;
  const fixed = kept.join(" ");
  if (key === "hero") e.heroIntro = fixed;
  else if (key.startsWith("s")) e.services[Number(key[1])].text = fixed;
  else e.destinations[Number(key[1])].text = fixed;
  return true;
};
for (const [st, sl, key] of DUP_FIELDS) {
  const e = get(st, sl);
  if (!e) continue;
  if (applyField(e, key)) fixes++;
}

const tk = get("ak", "talkeetna");
if (tk) {
  tk.nearby.items = [{ city: "Palmer" }];
  fixes++;
}

const be = get("mo", "bethany");
if (be && be.faqs.length < 3) {
  be.faqs.push({
    q: "What does the lake park cost?",
    a: "The Bethany Falls lake-side park's family rows run free with the fairground-side gates, so the group covers only the transportation half.",
  });
  fixes++;
}

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("content fixes applied:", fixes);
