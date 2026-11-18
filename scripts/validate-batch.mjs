// Reusable entry-line validator: node scripts/validate-batch.mjs scripts/batchNN.mjs [write]
import { readFileSync, writeFileSync } from "node:fs";
const file = process.argv[2];
if (!file) { console.log("usage: node scripts/validate-batch.mjs scripts/batchNN.mjs [write]"); process.exit(1); }
let s = readFileSync(file, "utf8");
const ARTIFACTS = ["undefined", "? no,", "heading-placeholder", "thegeneral", "the general", "field-trips", "fapps", "fapqs", "TheNotre"];
const lines = s.split("\n");
let i = 0, fail = 0;
for (let n = 0; n < lines.length; n++) {
  const L = lines[n].trim();
  if (!L.startsWith('{"state"')) continue;
  try { JSON.parse(L.replace(/,\s*$/, "")); i++; }
  catch (e) {
    fail++;
    const pos = parseInt((e.message.match(/position (\d+)/) || [])[1] || "0");
    console.log("LINE", n + 1, "FAIL pos", pos, ":", JSON.stringify(L.slice(Math.max(0, pos - 60), pos + 60)));
  }
}
console.log("entries:", i, "fail:", fail);
let bad = 0;
for (let n = 0; n < lines.length; n++) {
  const L = lines[n].trim();
  if (!L.startsWith('{"state"')) continue;
  let o; try { o = JSON.parse(L.replace(/,\s*$/, "")); } catch (e) { continue; }
  const req = ["state","slug","city","title","metaDescription","h1","heroIntro","servicesHeading","services","vehiclesHeading","vehicles","destinationsHeading","destinations","mapPins","nearby","faqsHeading","faqs","ctaHeading","reviewChecks","sourceLinks","premium"];
  for (const k of req) if (!(k in o)) { console.log("MISSING", o.state + "/" + o.slug, k); bad++; }
  if (o.services?.length !== 3) { console.log("SERVICES!=3", o.state + "/" + o.slug); bad++; }
  if (o.vehicles?.length !== 3) { console.log("VEHICLES!=3", o.state + "/" + o.slug); bad++; }
  if (o.destinations?.length !== 3) { console.log("DEST!=3", o.state + "/" + o.slug); bad++; }
  if (o.faqs?.length !== 4) { console.log("FAQS!=4", o.state + "/" + o.slug); bad++; }
  if ((o.nearby?.items || []).length < 2) { console.log("NEARBY<2", o.state + "/" + o.slug); bad++; }
  for (const a of ARTIFACTS) if (JSON.stringify(o).includes(a)) { console.log("ARTIFACT", o.state + "/" + o.slug, a); bad++; }
}
console.log(bad ? "FIELD ISSUES: " + bad : "field check clean");
