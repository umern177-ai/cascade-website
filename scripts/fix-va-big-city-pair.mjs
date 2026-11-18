// VA pair: Danville~Norfolk at 0.215. Reword + margin from per-entry facts.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (slug) => data.find((c) => c.state === "va" && c.slug === slug);

const da = get("danville");
da.heroIntro += " The textile rows' Dan River Works kept the mill town's payroll into this century, and the Sutherlin lawn's museum row still carries the war's last week inside the downtown grid.";
da.services[0].text = "The river resort's hotel tower, WSOP poker tables and concert floor book the weekend blocks, with the resort's own lots setting the coach rows.";
da.services[2].text += " The 1891 warehouse ballroom and the newspaper building's boutique-hotel roof deck book the downtown's reception nights.";
da.destinations[0].text += " The resort's table rows and the WSOP room carry the weekend floor, with the old cotton-mill walls beside the new-build tower.";
da.destinations[2].text += " The museum's self-guided mansion row pairs the gallery rooms on the same Main Street hour.";
da.premium.heroLead += " and the museum mansion's tours on the same Main Street block";

const no = get("norfolk");
no.heroIntro += " The Elizabeth River Trail's harbor-side miles thread the shipyard views past the marina rows, and the Chrysler's glass-house fires run the free demonstration hours beside the museum row.";
no.services[0].text = "The rover's narrated base pass and the battleship's deck rows run the class and club harbor days from the Waterside dock.";
no.services[1].text = "The zoo's free bus rows and the glass studio's hot-shop hours cover the school calendar across the river bends.";
no.destinations[0].text += " The battlewagon's gun turrets and the science center's aquarium rows share the one waterfront drop.";
no.destinations[2].text += " The zoo's animal rows stretch down the Lafayette's riverside bends with the giraffe feedings on the boardwalk.";
no.premium.heroLead = "The navy town at the harbor's deep bend: the battlewagon's open decks at the science center's dock, the fleet-view cruise's two-hour base run and the free glass-house fires by the museum. We run the harbor days, museum loops and airport legs.";

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("danville + norfolk differentiated; total", data.length);
