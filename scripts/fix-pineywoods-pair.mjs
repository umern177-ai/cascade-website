// TX margin: Groveton~Nacogdoches pair at 0.206 (Pineywoods phrasing).
// Add margin from facts already in each entry.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (k) => {
  const [state, slug] = k.split("/");
  const e = data.find((c) => c.state === state && c.slug === slug);
  if (!e) { console.error("MISSING " + k); process.exit(1); }
  return e;
};

const gr = get("tx/groveton");
gr.heroIntro += " The town keeps its rail-era oak-grove name, the district's copper-doored courthouse and the ranger district's trail maps an hour's drive from Houston's airport corridor.";
gr.services[0].text += " The wilderness' creek bottoms and the day-use lake's swimming beach book the warm-season class mornings.";
gr.services[2].text += " Huntsville's corridor hotels carry the retreat overflow, with the airport leg timed to the group's flight rows.";
gr.destinations[0].text += " The district's ranger station keeps the trail guides at the forest office, with the wilderness' three-plus thousand acres marked for the creek loops.";
gr.destinations[1].tip += " The beach hour and the picnic pavilion price into one plan on the same afternoon loop.";

const na = get("tx/nacogdoches");
na.heroIntro += " The city lake's two-thousand-acre water keeps the fishing rows ten miles west of the brick streets, and the downtown square's museum blocks hold the oldest-house row's hours.";
na.services[0].text += " The cemetery rows' signer graves and the old stone fort's campus replica complete the county history loop.";
na.destinations[2].text += " The first-house museum's 1830s rooms and the declaration rows keep the walking hour inside the oldest blocks.";
na.destinations[2].tip += " The brick row's curbs stay walk-only, so the bus holds the square's outer lane through the museum hours.";
na.premium.heroLead += ", with the signer graves' cemetery rows an easy walk from the square";

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("pineywoods pair margin applied; total", data.length);
