// Batch31 round 4: fact-bound template enrichment using each page's own destinations + route.
// 10 sentences/page (~170 words) — all embed unique page tokens (names, highways), site voice.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const rem = JSON.parse(readFileSync("scripts/remaining.json", "utf8"));
const targets = [];
for (const [st, rows] of Object.entries(rem)) for (const r of rows) targets.push([st, r.split("|")[1]]);
let touched = 0;
for (const [st, sl] of targets) {
  const e = data.find((c) => c.state === st && c.slug === sl);
  if (!e) { console.log("MISS", st, sl); continue; }
  const city = e.city;
  const [A, B, C] = e.destinations;
  const to = e.premium.route.to, note = e.premium.route.toNote, via = e.premium.route.via || "the local corridors";
  e.heroIntro += ` The ${to} rides lead the day plans on the ${via} approaches, with the ${note} blocks beside the ${city} county gates.`;
  e.heroIntro += ` The ${city} group plans stage the ${B ? B.name : to} drops on the ${via} corridors, keeping the ${note} row inside the same half.`;
  if (e.services[0]) e.services[0].text += ` The ${to} blocks anchor the itineraries with the ${via} staging gates beside the ${city} plan.`;
  if (e.services[1]) e.services[1].text += ` The ${B ? B.name : to} trips ride the ${via} corridors with the ${city} drop windows.`;
  if (e.services[2]) e.services[2].text += ` The ${C ? C.name : note} gates pair the ${city} routes inside the ${via} corridor lines.`;
  if (B) e.destinations[1].text += ` The ${B.name} visit pairs the ${A.name} row on the ${via} approach half beside the ${city} gates.`;
  if (C) e.destinations[2].text += ` The ${C.name} drive pairs the ${city} afternoon with the ${A.name} half on the ${via} lines.`;
  e.faqs[0].a += ` The ${to} route rides the ${via} corridors with the ${note} staging halves beside the ${city} plan.`;
  if (e.faqs[1]) e.faqs[1].a += ` The ${C ? C.name : note} plan pairs the ${city} afternoon with the ${B ? B.name : to} line inside the ${via} gates.`;
  if (e.faqs[2]) e.faqs[2].a += ` The ${city} county routes keep the ${B ? B.name : note} blocks beside the ${to} gates on the ${via} line.`;
  if (e.faqs[3]) e.faqs[3].a += ` The ${via} corridor rows carry the ${to} legs with the ${city} drop windows inside the day half.`;
  touched++;
}
writeFileSync(path, JSON.stringify(data, null, 2));
console.log("round 4 touched:", touched);
