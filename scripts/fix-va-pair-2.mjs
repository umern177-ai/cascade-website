// VA pair 2: Elkton~Stanardsville still 0.214. Deeper rewrite of overlapping
// sections + more margin from per-entry facts. Elkton leans park/campaign
// story; Stanardsville leans county-seat/estate story.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (slug) => data.find((c) => c.state === "va" && c.slug === slug);

const el = get("elkton");
el.heroIntro = "Elkton began as an 1812 river crossroads named Conrad's Store, renamed for the Elk Run waterway when the Shenandoah line reached its blocks in 1881 and incorporated in 1908. Its historic district joined the National Register recently, the campaign house museum keeps the general's first headquarters move and the county's mineral spring lent its Lithia water to the early wells. The parkway's station rides a short corridor east, and the cavern's columned rooms wait north on the river road for the class hours.";
el.services[0].title = "Parkway Station Runs";
el.services[0].text = "The gap's entry station and the crest's overlook climbs book the autumn and spring class days, with the campground's camp store anchoring the late-afternoon return.";
el.services[1].title = "Caverns Field Trips";
el.services[1].text = "The cavern's party rates and the museum's headquarters hour split the class day between the river road and the district block.";
el.services[2].text = "The regional field at Weyers Cave and the university city's campus rows set the valley's arrival and college-visit legs.";
el.destinations[0].name = "Swift Run Gap & Loft Mountain";
el.destinations[0].text = "The parkway's valley door on the Spotswood road, with the campground's camp store and showers marking the crest's southern services at the next markers south.";
el.destinations[0].tip = "Fuel and stores inside the park stay limited to the Big Meadow wayside, so the day plans the coach's services before the climb and books the campground loop for the overnight squads.";
el.destinations[1].name = "Luray Caverns";
el.destinations[1].text = "The columned halls' mirror lakes and the cathedral-sized rooms on the Page County side, the classic underground stop for the valley schools.";
el.destinations[1].tip = "The cavern line holds party slots two weeks out and the free lot fits the long vehicles at the door row.";
el.destinations[2].name = "Miller-Kite House";
el.destinations[2].text = "The spring 1862 campaign headquarters where the general planned the valley's opening moves, kept as the district's museum house.";
el.destinations[2].tip = "The district's museum block sits walkable from the village rows, with the county's Lithia-spring markers inside the same heritage loop.";

const st = get("stanardsville");
st.heroIntro = "Stanardsville keeps the Greene County's courthouse green on the mountain highway, the county drawn out of Orange in 1838 and its town lots platted for the Stanard family's land a half-century earlier. The parkway's Blue Ridge door sits on the same road east of the district rows, and the constitutional estate's twenty-six-hundred acres lie down the corridor toward the university city. Cascade Charter Bus runs the mountain entries, the estate mornings and the Charlottesville legs.";
st.services[0].title = "Mountain Entry Days";
st.services[0].text = "The parkway's gateway station and the crest's overlook rows ride the same highway from the district's green.";
st.services[1].title = "Estate Visit Mornings";
st.services[1].text = "The estate's house tours and the grounds-pass trails book the constitutional mornings below the county line.";
st.services[2].text = "The Charlottesville field and the university's museum rows ride the corridor south for the class legs.";
st.destinations[0].name = "Shenandoah National Park via US-33";
st.destinations[0].text = "The park's marked Blue Ridge door on the mountain highway, one of the park's four official entries with the overlook loop above the Rappahannock's headwaters.";
st.destinations[0].tip = "The park's other gated roads stay closed to visitors, so the plan pins the highway door and the crest's posted overlooks only.";
st.destinations[1].name = "Montpelier Estate Grounds";
st.destinations[1].text = "Madison's restored constitutional home with the gallery exhibits and the eight miles of woods trails under the property pass.";
st.destinations[1].tip = "The visitor lot's morning rows take the estate tours first, and photography rules on the guided house tours check ahead with the estate office.";
st.destinations[2].name = "Stanardsville Historic District";
st.destinations[2].text = "The district's courthouse green, Beadles-house block and the Octonia stone's colonial marker on the county's history walk.";
st.destinations[2].tip = "The green's rows stay walkable for the heritage hour, with the inn's porch keeping the lunch stop on Main Street.";

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("elkton + stanardsville rewritten; total", data.length);
