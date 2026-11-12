// Differentiate Hunter NY vs Ellicottville (similarity gate fix, Nov 12).
import { readFileSync, writeFileSync } from "node:fs";
const p = "data/city-pages.json";
const data = JSON.parse(readFileSync(p, "utf8"));
const h = data.find((c) => c.state === "ny" && c.slug === "hunter");
h.heroIntro =
  h.heroIntro +
  " The village runs on festival weekends as much as on snow: Tannersville's arts street, the arboretum's meadow loops and the Escarpment lookouts fill the shoulder months, and the bus keeps every stop inside one itinerary.";
h.destinations.push({
  name: "Escarpment Trail",
  text: "The rim trail from Kaaterskill to North-South Lake crosses the lookouts Thomas Cole painted, the longest continuous high walk in the range.",
  tip: "Shuttle hikers to the Scutt Road lot and stage the pickup at North-South Lake for the one-way walk.",
});
h.faqs.push({
  q: "What fits a shoulder-season weekend?",
  a: "The arboretum, the falls platform and one Escarpment walk: a full minibus day with the village lunch between stops.",
});
writeFileSync(p, JSON.stringify(data, null, 2));
console.log("Hunter differentiated: +1 destination, +1 FAQ, hero extended");
