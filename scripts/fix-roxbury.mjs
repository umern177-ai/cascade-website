// Differentiate Roxbury NY vs Rye (similarity gate fix, Nov 13):
// add Roxbury's fourth destination + a ski FAQ to dilute overlap.
import { readFileSync, writeFileSync } from "node:fs";
const p = "data/city-pages.json";
const data = JSON.parse(readFileSync(p, "utf8"));
const r = data.find((c) => c.state === "ny" && c.slug === "roxbury");
r.destinations.push({
  name: "Pakatakan Farmers Market",
  text: "The round barn market on Route 30 runs spring to fall with valley growers, bakers and makers under one roofline.",
  tip: "Market Saturdays run 10 to 2. Plan the market hour before the falls drive so the cooler stays loaded.",
});
r.faqs.push({
  q: "Is there skiing nearby in winter?",
  a: "Plattekill Mountain runs 40 trails 20 minutes north with a no-crowd lift policy, and the bus covers the lodge drop from any valley pickup.",
});
writeFileSync(p, JSON.stringify(data, null, 2));
console.log("Roxbury differentiated vs Rye");
