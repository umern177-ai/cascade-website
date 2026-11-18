// Differentiation: Broomall~Royersford PA pair at 0.208 (Valley Forge + mall
// phrasing shared). Rewrites overlap; facts unchanged.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const bro = data.find((c) => c.state === "pa" && c.slug === "broomall");
const roy = data.find((c) => c.state === "pa" && c.slug === "royersford");
if (!bro || !roy) { console.error("MISSING"); process.exit(1); }

// ---- ROYERSFORD: lean stove-foundry history + river trestle
roy.heroIntro = "Royersford sits on the Schuylkill's bend across from Spring City, the twin-borough pair born at the Royer brothers' 1801 ford. The stove works' brick foundries shipped from the 1860s through the 1930s, the river trail crosses the water on the old pedestrian trestle and Phoenixville's Colonial Theatre stands up the river road. Cascade Charter Bus runs the foundry-day loops, the park drives and the river-town evenings.";
roy.services[0].title = "Foundry and River Days";
roy.services[0].text = "The Historical Society's foundry story, the riverfront park's trestle crossing and the trail's county miles carry the club afternoons.";
roy.services[1].text = "The Colonial's Bridge Street palace and Steel City's listening-room nights fill the river towns' evening half.";
roy.services[2].text = "The Spring-Ford club rooms, the Collegeville barn and the foundry-hall events cover the river counties' season.";
roy.vehicles[0].reason = "Foundry blocks, trestle lots and river lanes.";
roy.destinations[0].text = "The park's hut rows and headquarters loop east of the river bend, an easy drive up the 422 corridor.";
roy.destinations[0].tip = "The visitor-center lot is the standard coach row and the inner drive stays off the bus map. Confirm the shuttle return with the group's ranger hour.";
roy.destinations[1].text = "The mall's five outer lots and three garages over the river bend keep the shopping half-day in one drop.";
roy.destinations[1].tip = "Pickups land at the store-court corners. The written quote books the corner and the departure hour with the group.";
roy.destinations[2].text = "Phoenixville's 1902 palace where The Blob premiered, still running three venues on Bridge Street for the borough evenings.";
roy.destinations[2].tip = "Bridge Street parks street-side, so the shuttle drops at the bridge end and holds through the final reel.";
roy.faqs[0].a = "About forty miles east, 45 to 60 minutes through the Blue Route into the Schuylkill's city corridors.";
roy.faqs[1].q = "Where does the bus park at the park?";
roy.faqs[1].a = "The Lower Visitor Center lot is the coach row, with the headquarters lot as the overflow and no waiting at the drop."
roy.faqs[2].a = "Yes. The trestle trail hour and the Phoenixville evening run one river-towns day inside the same booking.";
roy.premium.heroLead = "The twin-borough foundry town on the Schuylkill: the stove-works brick row, the river trestle into the trail and Phoenixville's film palace up the road. We run the foundry-day loops and the river-town evenings.";

// ---- BROOMALL: lean Marple Township colonial + Independence angle
bro.heroIntro = "Broomall is the postal name of Marple Township in Delaware County, thirteen road miles west of Center City, where the 1696 Massey house keeps the township's colonial farmstead on Lawrence Road. The Springfield mall row runs down Baltimore Pike and the Blue Route lifts the museum days into the city. Cascade Charter Bus runs the founding-block days, the mall half-days and the airport legs.";
bro.services[0].title = "Independence and Museum Days";
bro.services[0].text = "The mall's security-screened pavilion, the Hall's timed tours and the museum blocks carry the class itineraries from Marple.";
bro.services[1].text = "The Blue Route's mall corridor covers the shopping half-day while the park's encampment drive fills the fall class loop.";
bro.services[2].text = "The Paxon Hollow golf club's banquet rooms and the Springfield and Drexelbrook ballroom row carry the season's receptions.";
bro.vehicles[0].reason = "Township lanes and the Massey house block.";
bro.destinations[0].text = "The city's founding blocks with the bell pavilion and the timed Hall tours, the standard school-day run from the township.";
bro.destinations[0].tip = "Both the bell and the Hall pass screening, so the plan sets the entry window with the drop on the mall blocks.";
bro.destinations[1].text = "The encampment park's huts row and headquarters twelve miles north, the encampment story inside one class morning.";
bro.destinations[1].tip = "The Lower Visitor Center lot takes the coach with the drop at the doors, and the park asks the bus to move off rather than wait.";
bro.destinations[2].text = "The 1696 English Quaker farmhouse, among Pennsylvania's oldest surviving homes, kept as the township's history museum.";
bro.destinations[2].tip = "Group tours run by arrangement with the historical society's docent hours, so the visit books ahead of the day.";
bro.faqs[0].q = "How close is the city?";
bro.faqs[0].a = "Thirteen road miles from Center City, about half an hour on the Blue Route and the expressway into the museum blocks.";
bro.faqs[1].a = "Yes. The Independence Mall morning and the museum afternoon price as one city plan from Marple Township.";
bro.faqs[2].a = "Yes. The mall corridor's half-day and the park drive pair on the same northern run in one booking.";
bro.faqs[3].q = "Where does the wedding bus drop?";
bro.faqs[3].a = "At the club's porte-cochere or the ballroom venue's own row, confirmed per venue with the send-off return planned in.";
bro.premium.heroLead = "Marple Township's colonial quarter: the 1696 Massey house next door, Independence Mall's founding blocks half an hour east and the Blue Route lifting the class days to the city. We run the founding-block days and the reception loops.";

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("broomall + royersford differentiated; total", data.length);
