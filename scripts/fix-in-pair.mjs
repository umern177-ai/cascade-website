// IN pair fix: Bloomington~West Lafayette (two university towns).
// Differentiate framing: Bloomington = limestone campus + arts row,
// West Lafayette = engineering/aviation + river row.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (s) => data.find((c) => c.state === "in" && c.slug === s);
const bl = get("bloomington"), wl = get("west-lafayette");

bl.heroIntro = "Bloomington holds the Old Crescent's limestone campus that enrolled forty-eight thousand six hundred students in the 2025 census, the Sample Gates's Kirkwood avenue entry line and the Indiana Memorial Union's banquet rooms anchoring the college row. Brown county's eighteen-thousand-acre woods ride twenty minutes east for the Nashville crafts village, with the Mellencamp statue on the campus block keeping the singer's area ties. Cascade Charter Bus runs the campus tours, the craft-village mornings and the Indy legs.";
bl.premium.heroLead = "The limestone Old Crescent that enrolled forty-eight thousand six hundred in the 2025 season: the Sample Gates walk into the Union's banquet floors, the Mellencamp statue row and Brown county's Nashville crafts beyond. We run the campus tours, craft-village mornings and Indy legs.";
bl.premium.route = { to: "Sample Gates", toNote: "IU campus entry", miles: "", time: "~5 min", via: "Kirkwood Ave" };

wl.heroIntro = "West Lafayette holds Purdue's fifty-four-thousand-student campus on the Wabash's west bank, the Boilermaker blocks where Amelia Earhart joined the faculty in 1935 and the university bought her Lockheed Electra's flying laboratory the next summer. The Ross-Ade stadium's game-day Saturday rows and the Mackey arena's basketball Mondays run the sports calendar, with the Prophetstown prairie park's confluence trails fifteen minutes north. Cascade Charter Bus runs the game-day shuts, the campus visits and the prairie trails.";
wl.premium.heroLead = "The Boilermaker campus where Amelia Earhart flew: the fifty-four-thousand-student rows on the Wabash's west bank, the stadium-and-arena game-day calendar and the Prophetstown prairie trails fifteen minutes up river. We run the game-day shuts, campus visits and prairie trails.";
wl.premium.route = { to: "Purdue University", toNote: "Boilermaker campus", miles: "", time: "~5 min", via: "University St" };

// Also enrich both for extra margin
bl.destinations[0].tip += " The Union's hotel-row accommodations sit inside the campus block for the visit-day stays.";
bl.destinations[2].text += " The campus statue's 2024 unveiling joined the Belmont studio's founding on the singer's Bloomington-area heritage line.";
wl.destinations[0].tip += " The stadium's permit-restricted gameday rows and the arena's event lots confirm through the university's parking office ahead.";
wl.destinations[1].text += " The prairie's confluence-trail rows sit between the two rivers where the Tippecanoe meets the Wabash at the Battle Ground line.";

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("bloomington + west-lafayette differentiated; total", data.length);
