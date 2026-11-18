// NC? no - WA margin: North Bend ~ Chehalis pair. Facts from existing entries.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (s) => data.find((c) => c.state === "wa" && c.slug === s);
const nb = get("north-bend"), ch = get("chehalis");
nb.heroIntro += " The valley's trailhead town keeps the filming-era storefronts beside the highway's pass-bound exits, with the Seattle corridors half an hour west.";
nb.services[0].text += " The museum's depot-row tickets and the accessible-rider arrangements confirm a day ahead through the museum line.";
nb.destinations[0].text += " The falls' ground-level platform row and the visitor deck's paid-lot corners frame the river's plunge from two sides.";
nb.destinations[1].text += " The museum's snow-season holiday trains and the spring-and-summer excursion windows split the schedule around the depot rows.";
nb.premium.heroLead += " with the museum's excursion depots split across the two towns";

ch.heroIntro += " Twin-cities' 1912 depot museum keeps the famous stump's 1903 speech story inside the exhibit rows, with the Willapa hills trail's fifty-six miles running from the falls park west.";
ch.services[0].text += " The museum's five-dollar door rows and the group-hour booking rate carry the depot's history mornings.";
ch.destinations[0].text += " The depot's mission-revival building keeps the National Register row with the model rail line inside the halls.";
ch.destinations[1].text += " The falls' reduced post-flood cascade story and the CCC shelter rows keep the park hour inside the discovered-pass plan.";
ch.premium.heroLead += " and the depot's Roosevelt-stump story inside the halls";

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("north-bend + chehalis margin applied");
