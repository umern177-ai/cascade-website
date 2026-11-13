// Differentiate Interlaken NY vs Penn Yan (similarity gate fix, Nov 13):
// lean into the Ithaca side (Cornell, Commons, ITH) that Penn Yan lacks.
import { readFileSync, writeFileSync } from "node:fs";
const p = "data/city-pages.json";
const data = JSON.parse(readFileSync(p, "utf8"));
const e = data.find((c) => c.state === "ny" && c.slug === "interlaken");
e.services[2] = {
  title: "Ithaca Airport and Cornell Legs",
  text: "Ithaca Tompkins (ITH) sits 40 minutes north with direct flights to New York, and Cornell University's hill and the Commons restaurants sit beyond it, pairing the campus visit with a lake afternoon.",
  href: "/services/airport-transfer/",
};
e.faqs[2] = {
  q: "Can the day end in Ithaca instead of lake route back?",
  a: "Yes. Cornell, the Commons and the airport line up on the same north run, so the itinerary can finish at the terminal or at the lakefront, whichever the group prefers.",
};
writeFileSync(p, JSON.stringify(data, null, 2));
console.log("Interlaken differentiated with Ithaca angle");
