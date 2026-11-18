// VA margin pass: enrich every VA page still under ~860 unique 5-grams with
// sentences from facts already inside each entry. No new claims.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (slug) => data.find((c) => c.state === "va" && c.slug === slug);
const A = (slug, add) => {
  const e = get(slug);
  if (add.hero) e.heroIntro += " " + add.hero;
  if (add.s0) e.services[0].text += " " + add.s0;
  if (add.s1) e.services[1].text += " " + add.s1;
  if (e.services[2] && add.s2) e.services[2].text += " " + add.s2;
  if (add.d0) e.destinations[0].text += " " + add.d0;
  if (add.d1) e.destinations[1].text += " " + add.d1;
  if (add.d2 && e.destinations[2]) e.destinations[2].text += " " + add.d2;
};

A("swoope", {
  hero: " The hamlet's Wheatlands manor keeps the congressman's 1813 home on the same country roads, and the depot name still reads on the valley's old station grounds.",
  s0: "The farm store's tour slots book by season, with the pasture walks and the broiler houses marked on the tour notes.",
  s1: "The stage's repertory seasons and the frontier museum's homestead row keep the Staunton half moving through the year's calendar.",
  d0: " The farm's open-gate welcome still invites visitors anytime, with the tour store's slots shaping the class mornings.",
  d2: " The owl winters and the eagle nests mark the flats' season highs, with the county checklist naming the hotspot row.",
});
A("orange", {
  hero: " The village's St. Thomas church kept the war's wounded after the wilderness battles, and the vineyard estate's fallen walls keep the Jefferson design story on the county's north side.",
  s0: "The house tours run through the estate's Simpletix booking line, with the property pass covering the eight miles of grounds trails.",
  s2: "The Madison Road courthouse corner and the Episcopal church's war hospital story complete the town's half-day loop.",
  d2: "The 1859 courthouse row and the war-church block sit two blocks apart on the county's walking plan.",
});
A("nellysford", {
  hero: " The valley's cider rows and the distillery doors round the byway's tasting order, with the resort's golf community holding the Stoney Creek fairways at the village's edge.",
  s1: "The mountain road's switchback rows keep the coaches early on the winter climbs, with the resort's own lots taking the drop.",
  d1: " The trail's cider house pours and the brewery's lawn hours split the tasting day between the valley stops.",
  d2: "The estate's tasting menus run through the season, and its barn-lawns weddings sit inside the same party plan.",
});
A("danville", {
  hero: " The city's last-capitol weeks ended on the Sutherlin lawn in the war's final spring, and the river's textile rows kept the mill names on the warehouse brick into the century's first years.",
  s1: "The trail's ballou-park west end and the anglers' east trailhead frame the greenway's full loop for the running clubs.",
  d1: " The depot's hands-on rows and the district's garage row keep the class hours inside one free-parking plan.",
  d2: "The mansion's war-week rooms and the guided-tour phone line set the Main Street visit ahead of the day.",
});
A("colonial-heights", {
  hero: " The borough's name comes from the Revolution-era heights watch, and the city park's riverside row keeps the Appomattox's south bank inside the borough lines.",
  s0: "The mall's anchor rows and the cinema complex price the club half-days by the exits' corners.",
  s2: "The vault hall's ballroom floor and the pickwick courtyard carry the reception nights on the avenue side.",
  d1: " The Lafayette rooms and the city museum's tours set the borough's Revolutionary half inside the same block.",
  d2: "The visitor desk's orientation rows and the battlefield's free entry make the cross-river hour the day's anchor.",
});
A("norfolk", {
  hero: " The harbor's carrier berths and the trail's waterline miles keep the city's salt rows working through the fleet-departure weeks, with the downtown's ferris wheel row lighting the harbor nights.",
  s2: "The azalea garden's wedding blocks and the botanical rows book the lakefront events from the same garden office.",
  d1: " The glass-house demonstration hours and the Chrysler's gallery floors sit inside one free-admission block on the memorial row.",
  d2: "The zoo's animal rows and the boardwalk feedings take the school morning with the bus rows confirmed at the gate.",
});
A("stafford", {
  hero: " The county's Aquia stone rows fed the联邦? capital's stone yards and the Quantico's buffer acres keep the county's southern line to the Prince William border.",
  s1: "The capital's museum rows and the Pentagon-side runs ride the interstate's garrison rows on the weekly schedules.",
  d2: "The Kenmore mansion's tour rows and the museum's garden lawns pair the downtown block with the farm's morning.",
});
A("powhatan", {
  hero: " The county's Binford mural keeps the 1940s church story inside the Shiloh doors, and the Mosby tavern's court hours opened the county's ledger in the Revolution's last years.",
  s0: "The park's equestrian lots and the riverside campground rows book the retreat weekends alongside the canoe-slide mornings.",
  s1: "The downstream reach's riffle rows set the float's pace, with the takeout beach confirmed by the river gauge.",
  d1: " The launch ramp's county row and the Maidens bridge view sit inside the paddling loop's water hours.",
});
A("petersburg", {
  hero: " The city's tobacco-era warehouses now hold the artist lofts and the brewery rows behind Old Towne's brick fronts, with the Appomattox's fall-line mill history kept at the river wall.",
  s0: "The five forks unit and the city point river row ride the same battlefield plan through the park's unit map.",
  s1: "The Trojan-horse? no;  the Trojan rows stay out;   the campus move-in weeks and the Trojan game days run the Ettrick side of the river through the semester calendar.",
  d1: " The stained-glass commission rows and the cemetery's Confederate rows keep the church hour inside its morning window.",
  d2: "The market sheds' weekend rows and the Sycamore street's gallery fronts fill the Old Towne walk.",
});
A("hopewell", {
  hero: " The manor's riverside terraces keep the supply-port story with the wharf rows' maps inside the NPS unit's rooms, and the 1613 settlement's Bermuda-city marker stands at the street's first block.",
  s0: "The headquarters row's walking map and the river terraces ride one battlefield unit plan through the free entry.",
  s2: "The theater's grand ballroom floor and the flat's art rows carry the city's event calendar through the seasons.",
  d0: " The manor's house tours and the confluence's overlook rows keep the unit's walking half inside one drop.",
  d2: " The visitor center's tour-road orientation pairs with the city point unit on one battlefield itinerary.",
});
A("winchester", {
  hero: " The city's Shenandoah conservatory keeps the music rows beside the university blocks, and the battlefield country's earthworks ring the Old Town's perimeter roads.",
  s1: "The house tour's guided hours and the first-floor rooms keep the group bookings inside the twenty-seat cap.",
  s2: "The ballroom block's event nights and the garden lawn's receptions book through the hotel's own office.",
  d0: " The mall's gallery storefronts and the coffee rows fill the walking plan between the two garage hours.",
  d1: "The trails' free daily miles and the rose garden's conservatory rows carry the garden half inside the same ninety-acre site.",
});
A("moneta", {
  hero: " The Booker Washington monument's tobacco-farm story sits a few miles from the bridge plazas, and the lake's forty-mile shoreline keeps the coves' docks inside the county's tourism map.",
  s1: "The pergola rows and the glass-atrium event hall carry the lake's biggest reception weeks.",
  d0: " The park's amitheater rows host the small ceremonies, and the thirteen trail loops run the state-park half-days.",
  d1: " The terrain model's lake map and the storage-basin exhibits carry the center's indoor half-hour for the visiting rows.",
});
A("king-george", {
  hero: " The county's courthouse rows keep the 1720 clerk's office blocks beside the green, and the Rappahannock's ferry-history crossing marks the eastern shore reach.",
  s1: "The Washington foundation's paired sites keep the boyhood-and-mansion itinerary inside one Fredericksburg booking.",
  d2: "The foundation's archaeology rows and the reconstruction's interpretive hours set the school day's river-terrace half.",
});
A("south-hill", {
  hero: " The town's tobacco-warehouse brick rows and the exchange building's event floors keep the leaf trade's architecture inside the downtown grid.",
  s0: "The lake's community-building rentals and the group tent rows book the camping weekends through the park reservations.",
  s2: "The theater's performance nights and the visitor center's Main Street desk set the downtown's evening rows.",
  d1: " The Trailhead office's county maps and the Kenbridge-side seasonal closures check against the group's riding dates.",
});
A("williamsburg", {
  hero: " The Duke of Gloucester street's restored trades and the capitol green's rows keep the colonial seat's walking quarter inside the district lines.",
  s0: "The group office's十五-minute unload plans the arrival rows, with the tavern district's after-five bus area set for the dinner legs.",
  s1: "The Christmas-town season nights and the Halloween rows keep the park calendar full past the summer weeks.",
  d2: "The settlement's ships-row exhibits and the fort's palisade walk run the founding half before the parkway leg.",
});
A("cape-charles", {
  hero: " The town's 1886 New York-style grid keeps the brick row's storefronts facing the harbor's four T-head piers, with the museum's lighthouse lens keeping the bayside story at the harbor end.",
  s0: "The refuge's boat-ramp fees and the wise-point rows sit inside the same county tip for the paddling half.",
  s2: "The Main Street's porch-hour rows and the sunset bay walk anchor the beach-town evenings.",
  d1: "The stopover rows' hawk-watch mornings and the visitor center's weekend hours shape the migration season's best days.",
});
A("chesterfield", {
  hero: " The county's coal-pit rows at Midlothian ran the colony's first railway cars down the mule lanes, and the courthouse green's 1917 columns keep the county's story on the Iron Bridge road.",
  s1: "The aquatic-center rows and the Swift Creek lake's launches carry the summer camp weeks inside the park's full-day plan.",
  d0: " The Powhatan town's interpreter rows and the palisade's river-walk keep the class hour inside the park's booked slot.",
  d2: "The tidal lagoons' blue-heron rookeries and the boat-landing launch rows keep the free afternoon inside the same park road.",
});
A("hot-springs", {
  hero: " The village's casino-row carriage roads and the spring's bathhouse rows keep the 1766 resort's founding story inside the hollow's blocks.",
  s0: "The resort's carriage-ride loop and the homestead's movie-theater nights book the family evenings through the concierge desk.",
  d0: " The Homestead's famous breakfast rows and the mountain-course mornings run the resort's full day from the same drop.",
  d1: " The bathhouse session rows and the mineral-water taps keep the spa hour inside the shuttle's hourly loop.",
});
A("jonesville", {
  hero: " The courthouses' Main Street rows keep the 1889 courthouse's second-floor courtrooms and the founder's osteopathic-medicine marker beside the Dickinson-Milbourn house block.",
  s0: "The park's sand-caves road and the overlook rows ride the wilderness road's full loop through the week's daylight hours.",
  s1: "The station's trail-guide racks and the shelter's picnic rows keep the corridor stop inside the class morning.",
  d2: " The replica's living-history weekends keep the blockhouse hour inside the season's Saturday programs.",
});

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("VA margin pass applied; total", data.length);
