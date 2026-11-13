// Differentiate Woodbourne NY vs Eldred (similarity gate fix, Nov 13):
// distinct Bethel Woods wording + the waterpark-forward service block.
import { readFileSync, writeFileSync } from "node:fs";
const p = "data/city-pages.json";
const data = JSON.parse(readFileSync(p, "utf8"));
const w = data.find((c) => c.state === "ny" && c.slug === "woodbourne");
w.destinations[0] = {
  name: "Bethel Woods Center for the Arts",
  text: "The hilltop pavilion and museum stand over the field where the 1969 festival played, with the Monolith gallery tracing that summer's story.",
  tip: "The museum closes before the evening shows. Split the day at the hill: gallery first, pavilion after dinner.",
};
w.services[1] = {
  title: "Concert Nights and Museum Days",
  text: "Bethel Woods books summer and autumn calendars, and the museum's gallery hour pairs with the show as one full Bethel day from Woodbourne.",
  href: "/services/sightseeing-tour-bus/",
};
w.services[2] = {
  title: "Waterpark and Casino Days",
  text: "The Kartrite's indoor waterpark and the Resorts World floor are the county's weather-proof anchors 20 minutes east on the resort corridor.",
  href: "/services/sightseeing-tour-bus/",
};
writeFileSync(p, JSON.stringify(data, null, 2));
console.log("Woodbourne differentiated");
