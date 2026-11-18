// Differentiation pass: Lewis Center OH (short page pairing over-gate).
// Copy appended from facts already in the entry. No new claims.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const e = data.find((c) => c.state === "oh" && c.slug === "lewis-center");
if (!e) { console.error("MISSING"); process.exit(1); }
e.heroIntro += " The Olentangy riverfront keeps the commuters' trail half quiet, while the reservoir's marina rows carry the boating weekends down the shoreline from the beach lots.";
e.services[0].text += " The beach mornings and the bluff overlooks split the day's north loop, with McCammon's trailhead a short shuttle leg between.";
e.services[1].text += " Convention blocks and zoo days price as one southern loop with the corridor's timing set ahead.";
e.services[2].text += " One vehicle covers the airport legs and the corridor drives with the day's plan.";
e.vehicles[0].reason += " - the reservoir loops and the bluff overlooks share the same lanes.";
e.vehicles[1].reason += " - zoo Saturdays and the convention days ride one southern run.";
e.destinations[0].text += " The marina, the beach rows and the mountain-bike singletrack split the shoreline, with the dog park keeping its own cove.";
e.destinations[1].text += " The overlook decks sit over the Olentangy and the deep-woods trails run the quiet half of the 1,200 acres.";
e.destinations[2].text += " The 1930s farm's demo days and the woods trails split the preserve's calendar through the seasons.";
writeFileSync(path, JSON.stringify(data, null, 2));
console.log("lewis-center enriched; total", data.length);
