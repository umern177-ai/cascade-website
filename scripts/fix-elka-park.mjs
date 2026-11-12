// Differentiate Elka Park NY vs Cobleskill (similarity gate fix, Nov 12):
// swap the duplicated Albany-airport beat for a city-clubs angle.
import { readFileSync, writeFileSync } from "node:fs";
const p = "data/city-pages.json";
const data = JSON.parse(readFileSync(p, "utf8"));
const e = data.find((c) => c.state === "ny" && c.slug === "elka-park");
e.services[2] = {
  title: "City Club Runs and Airport Legs",
  text: "Weekend club buses start at Manhattan and the river counties, with the mountain drop a pass past Tannersville. Albany's airport is the usual arrival point an hour east when the group flies in.",
  href: "/services/airport-transfer/",
};
e.faqs[3] = {
  q: "Do you run city pickups for the mountain?",
  a: "Yes. Weekend buses start in Manhattan and the river counties, with one pickup point and the gear aboard before the pass climb.",
};
writeFileSync(p, JSON.stringify(data, null, 2));
console.log("Elka Park differentiated");
