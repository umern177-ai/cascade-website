// NH pair fix: Newbury~Sunapee (sister towns sharing the resort). Sunapee's
// page swaps its resort destination for the harbor museum block and trims
// resort phrasing; facts stay within the research set (harbor museum, dock
// rows, cruises, lake islands).
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (s) => data.find((c) => c.state === "nh" && c.slug === s);
const su = get("sunapee");

su.destinations[1] = {
  name: "Sunapee Harbor Museum & Dock Block",
  text: "The harbor's historical-society museum row and the dock-and-boardwalk line at the quintessential village front.",
  tip: "The compact harbor lot stages the drops along the Lakeside road, with the dock row's walking half pairing the museum block.",
};
su.heroIntro = su.heroIntro.replace(
  "whose cruise catamaran runs the island hours through the season and whose resort slopes lift the winter weeks at the Newbury town line. The ski lodge's post-and-beam hall books the mezzanine weddings and Manchester's field rides an hour south.",
  "whose cruise catamaran runs the island hours through the season and whose harbor museum keeps the lake's steamboat-era story. The six islands ring the four-thousand-acre water and Manchester's field rides an hour south."
);
su.services[1].text = "The winter weekends and the lake-town events ride the corridor rows toward the neighboring resort town.";
su.premium.heroLead = "The harbor village at the lake's south reach: the catamaran's island hours, the steamboat-era museum row on the dock line and the six islands' summer cruises. We run the harbor days, lake events and cruise seasons.";
su.destinations[2].text = su.destinations[2].text.replace(
  "The state-leased resort's sixty-seven trails",
  "The neighboring slopes' sixty-seven trails"
);

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("sunapee differentiated; total", data.length);
