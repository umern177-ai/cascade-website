// VA pair fix: Elkton~Stanardsville at 0.222 (both pages carry the Swift Run
// Gap destination from the same research set). Reword + margin from per-entry facts.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (slug) => data.find((c) => c.state === "va" && c.slug === slug);

const el = get("elkton");
el.destinations[0].tip = "The gap station's passes cover the parkway day, with the drive's own speed and tunnel notes shaping where the coach stops along the crest.";
el.destinations[1].tip = "The cavern's party rate books two weeks ahead on the tour line, and the entrance row's wide lot holds the coach through the underground hour.";
el.destinations[2].text = "The General's spring headquarters house on the village's district block, the war's opening move told through the museum rooms.";
el.heroIntro = "Elkton is the valley town where Conrad's store kept the 1812 river crossing at the Massanutten's south end, incorporated in 1908 when the railroad reached the blocks. The national park's gap station sits eight miles east on the Spotswood corridor and the caverns run north on the river road, with the Lithia springs' water having named the town's earliest lots. Cascade Charter Bus runs the park entries, the caverns loops and the valley legs.";
el.services[0].text = "The gap station's entry days and the overlook runs open the mountain corridor from the village blocks.";
el.services[1].text = "Luray's group-tour slots book the class days, with the river road's stops set between the gap hour and the noon lunch.";
el.premium.heroLead = "The valley town under the Massanutten's south end: the national park's gap station eight miles east, Luray's columned rooms north on the river road and the campaign-era headquarters house in the district. We run the gap entries, caverns loops and valley legs.";

const st = get("stanardsville");
st.destinations[0].text = "The park's Blue Ridge gateway on the highway over the mountain, the overlooks' skyline climb from the foothill side.";
st.destinations[0].tip = "The gateway sits between the village and the crest on the same highway, and the four official entrances rule keeps the bus route on the marked doors.";
st.destinations[1].tip = "The estate's visitor lot takes the morning rows, and the gates' late-afternoon close sets the tour's house hour first.";
st.heroIntro = "Stanardsville is the Greene County courthouse village at the Blue Ridge's foothill side, its 1794 lots keeping the National Register district rows on the mountain highway. The parkway's gateway rides east over the ridge from the courthouse green, Madison's constitutional estate sits south on the corridor and the university city rides the valley's southern route. Cascade Charter Bus runs the parkway entries, the estate tours and the Charlottesville legs.";
st.services[0].text = "The parkway gateway's entry days run the overlook climbs east of the courthouse green.";
st.services[1].text = "The estate's guided house tours and the property-pass grounds book the constitutional-history half below the county.";
st.premium.heroLead = "The foothill courthouse village on the mountain highway: the 1794 historic-district rows, the parkway's Blue Ridge gateway east over the ridge and Madison's grounds on the southern corridor. We run the parkway entries, estate tours and university legs.";

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("elkton + stanardsville differentiated; total", data.length);
