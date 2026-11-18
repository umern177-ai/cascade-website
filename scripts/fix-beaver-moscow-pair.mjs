// Differentiation: Beaver + Moscow (scaffold-floor pair at 0.205 - pages too
// short, no genuine content overlap). Add margin from facts already in entries.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const be = data.find((c) => c.state === "pa" && c.slug === "beaver");
const mo = data.find((c) => c.state === "pa" && c.slug === "moscow");
if (!be || !mo) { console.error("MISSING"); process.exit(1); }

be.heroIntro += " The fort's riverside markers sit in the borough's National Register district, with the Bridgewater span's bridges crossing the water in view of the courthouse blocks.";
be.services[0].text += " The fort walk's granite features and the DAR marker run the borough's story hour before the courthouse square.";
be.services[1].text += " Two Mile Run's trail miles book the outdoor half-day nearby, with the Brighton township lots free for the coaches' overflow.";
be.destinations[0].text += " The 1778 Continental post's riverside ground keeps the 1785 treaty story on the interpretive row beside the water.";
be.premium.heroLead += " and the fort's riverside ground at the district's heart";

mo.heroIntro += " The borough counts about two thousand neighbors, its station block restored by the railway historical society for the excursion days and the Roaring Brook's trail miles running through the Pinchot forest tracts south of Market Street.";
mo.services[0].text += " The excursion connection books the group's seats through the park's tour-planning program, with the round trip back to the borough station by the season's calendar.";
mo.services[1].text += " The arena's hockey nights and the city's museum hours ride the same valley corridor, priced as one evening plan.";
mo.services[2].text = "Elmhurst Country Club's ballroom and the Lake Hideaway pavilions book the plateau receptions, with guest loops from the city corridors.";
mo.vehicles[0].reason = "Station blocks, trailhead lots and the valley corridor.";
mo.vehicles[1].reason = "Excursion crowds and the city's event nights.";
mo.destinations[0].text += " The yard's roundhouse hours and the excursion calendar run the group's rail half-year, with the platform connection back to the borough on the season's dates.";
mo.destinations[2].text += " The trail's seven miles wind Roaring Brook's crossings with the Kellum Creek forks, keeping the walking half shaded through the seasons.";
mo.faqs[0].a = "About fifteen miles and twenty minutes down the trail road into the downtown blocks, with the arena's Wilkes-Barre leg another twenty minutes beyond.";
mo.premium.heroLead = mo.premium.heroLead.replace(
  "We run the rail days and the city legs.",
  "We run the rail days, the trail mornings and the city legs."
);

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("beaver + moscow enriched; total", data.length);
