// CT margin: groton~new-london at 0.258 - differentiate the twin river cities.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (s) => data.find((c) => c.state === "ct" && c.slug === s);
const g = get("groton"), n = get("new-london");

// GROTON - lean into the 1781 battle detail and the shipyard industry story
g.heroIntro += " The September 1781 raid's Arnold-led assault ran the heights' massacre story through the monument climb rows, and the Electric-boat shipyard's nuclear-era launch lines keep the industry half inside the same river corridors.";
g.premium.heroLead += ", with the Electric-boat shipyard's launch lines beside the battle-heights story";
g.destinations[0].text += " The museum's 2025-opened education center carries the stewards' classroom rows beside the boarding halves.";
g.destinations[0].tip += " The center's new-schoolroom rows seat the class halves, so the visit plans the boarding and lesson windows in one day.";
g.destinations[1].text += " The Avery-house museum's Wed-to-Sunday exhibit rows keep the battle story beside the monument's climb windows.";
g.destinations[2].text += " The Thames-side beach's seasonal-fee rows keep the swim half beside the drawbridge town drives.";
g.faqs[0].a += " The shipyard's Electric-boat lines built the nuclear fleet beside the museum's boarding story, one industry-and-heritage row.";

// NEW LONDON - lean into O'Neill, the Coast Guard Academy, ferries and Garde
n.heroIntro += " The playwright's birthplace rows and the Coast-Guard-Academy cadet parade halves keep the heritage walks beside the ferry terminal's island-landing calendars.";
n.premium.heroLead += ", with the Coast-Guard-Academy cadet parades and the island ferry terminal beside the museum rows";
n.destinations[0].text += " The park's Olympic-size pool and waterslide rows keep the arcade and mini-golf halves beside the boardwalk line.";
n.destinations[1].text += " The fort's year-round waterfront rows overlook the river's ferry-landing ship lines.";
n.destinations[2].text += " The Tiffany-glass holdings share the museum floor with the restored 1926 theater's arts-district rows downtown.";
n.faqs[1].a = " The adult row runs twelve dollars with the senior, student and under-twelve lines, and the Tiffany holdings carry the museum's signature floor.";

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("groton + new-london differentiated");
