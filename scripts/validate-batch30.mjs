import { readFileSync } from "node:fs";
let s = readFileSync("scripts/batch30.mjs", "utf8");
s = s.replaceAll('/services/field-trips" ? "/services/school-transportation/" : "/services/school-transportation/"', '/services/school-transportation/');
if (process.argv[2] === "write") await import("node:fs").then((fs) => fs.writeFileSync("scripts/batch30.mjs", s));
const lines = s.split("\n");
let i = 0, fail = 0;
for (let n = 0; n < lines.length; n++) {
  const L = lines[n].trim();
  if (!L.startsWith('{"state"')) continue;
  try { JSON.parse(L.replace(/,\s*$/, "")); i++; } catch (e) { fail++; console.log("LINE", n + 1, "FAIL:", e.message.slice(0, 90)); }
}
console.log("entries:", i, "fail:", fail);
const req = ["state","slug","city","title","metaDescription","h1","heroIntro","servicesHeading","services","vehiclesHeading","vehicles","destinationsHeading","destinations","mapPins","nearby","faqsHeading","faqs","ctaHeading","reviewChecks","sourceLinks","premium"];
const arts = ["undefined","? no,","heading-placeholder","thegeneral","the general","field-trips","field-trip-","casino-transportation"];
for (let n = 0; n < lines.length; n++) {
  const L = lines[n].trim();
  if (!L.startsWith('{"state"')) continue;
  try {
    const o = JSON.parse(L.replace(/,\s*$/, ""));
    for (const k of req) if (!(k in o)) console.log("MISSING", o.state + "/" + o.slug, k);
    if (o.services.length !== 3) console.log("SERVICES!=3", o.state + "/" + o.slug);
    if (o.vehicles.length !== 3) console.log("VEHICLES!=3", o.state + "/" + o.slug);
    if (o.destinations.length !== 3) console.log("DEST!=3", o.state + "/" + o.slug);
    if (o.faqs.length !== 4) console.log("FAQS!=4", o.state + "/" + o.slug);
    if ((o.nearby.items || []).length < 2) console.log("NEARBY<2", o.state + "/" + o.slug);
    if (!o.premium.heroLead) console.log("NO HEROLEAD", o.state + "/" + o.slug);
    const flat = JSON.stringify(o);
    for (const a of arts) if (flat.includes(a)) console.log("ARTIFACT", o.state + "/" + o.slug, a);
  } catch (e) {}
}
console.log("field check done");
