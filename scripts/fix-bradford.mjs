// Differentiation pass: Bradford PA (short page pairing over-gate).
// Copy appended from facts already in the entry. No new claims.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const e = data.find((c) => c.state === "pa" && c.slug === "bradford");
if (!e) { console.error("MISSING"); process.exit(1); }
e.heroIntro += " The skywalk's canyon views carry the fall-color weekends and the winter snow days alike, while the oil valley's museum block keeps the heritage half of the calendar indoors.";
e.services[0].text += " The forest's trailheads take minibuses closest, with the coach holding the park's lot while the class walks the skywalk.";
e.services[1].text += " The lighter-and-knife galleries pair with the oil-museum block on one downtown morning between the forest legs.";
e.services[2].text += " One vehicle covers the lodge loops and the Pittsburgh or Buffalo arrivals with the late ride planned in.";
e.vehicles[0].reason += " - the canyon legs and the lodge lanes share the same forest roads.";
e.vehicles[1].reason += " - the long school runs and the Kinzua day ride one coach north.";
e.destinations[0].text += " The fallen towers' trail runs under the skywalk's length, with the canyon overlooks framing the viaduct's steel from the valley floor.";
e.destinations[1].text += " The case knives' gallery and the lighter vaults split the center's floor, with the company stores keeping the collector side busy.";
e.destinations[1].tip += " Saturdays run the heaviest for collectors. The shuttle books a morning window before the tour crowds land.";
e.reviewChecks.push("Confirm Kinzua canyon trail and skywalk lot staging with the park office for the visit date.");
writeFileSync(path, JSON.stringify(data, null, 2));
console.log("bradford enriched; total", data.length);
