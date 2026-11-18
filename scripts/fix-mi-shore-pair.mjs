// MI pair fix: Coloma~Bridgman (two shore towns sharing both destinations).
// Bridgman swaps Warren Dunes for the St. Joseph county beach; Coloma doubles
// down on its museum + vineyard identity. Facts already in the entries.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (s) => data.find((c) => c.state === "mi" && c.slug === s);
const co = get("coloma"), br = get("bridgman");

br.destinations[1] = {
  name: "Silver Beach County Park",
  text: "The county park's summer shoreline lots at the St. Joseph boardwalk row, twenty minutes down the Red Arrow shore road.",
  tip: "Buses pay by the space they occupy at the county rows, so the shore-morning plan books the summer windows with the nonresident rates.",
};
br.heroIntro = br.heroIntro.replace(
  "The big dune park rises three miles south, the vineyard tasting room pours on the shore highway and the beach house's palladian hall books the lakefront weddings.",
  "The beach house's palladian hall books the lakefront weddings, the vineyard tasting room pours on the shore highway and the county's boardwalk beach rides twenty minutes down the shore road."
);
br.services[0].text = "The city beach's sand rows and the county boardwalk park's summer rows carry the family and class itineraries.";
br.vehicles[0].reason = "Beach lots, boardwalk rows and shore highway lanes.";
br.destinations[0].text += " The pavilion square's big-ornament rows and the downtown's fountain block headline the light-season walks.";
br.destinations[2].text += " The tasting room's lake-shore view row pours beside the vineyard slopes between the beach hours.";
br.premium.heroLead = br.premium.heroLead.replace(
  "the two-hundred-forty-foot dune climb three miles south and the vineyard tasting room on the shore highway",
  "the county boardwalk beach's summer rows down the shore road and the vineyard tasting room on the highway"
);

co.heroIntro = co.heroIntro.replace(
  "The big dunes' two-hundred-sixty-foot park rises fifteen minutes north, the county beach's summer pricing rows sit down the shore road and the South Bend airport rides an hour east.",
  "The state park's two-hundred-sixty-foot dune rows rise fifteen minutes north, the museum's soda-fountain row keeps the county history in town and the South Bend airport rides an hour east."
);
co.destinations[1].tip += " The shore road's beach plan pairs the vineyard estate's tasting half with the county park row.";
co.destinations[0].text = co.destinations[0].text.replace("fifteen minutes north", "north of the fruit-belt blocks");
co.premium.heroLead = co.premium.heroLead.replace("fifteen minutes north", "north of the fruit-belt blocks");

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("coloma + bridgman differentiated");
