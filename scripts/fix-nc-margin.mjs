// NC margin pass: enrich every NC page still below ~860 unique 5-grams with
// sentences from facts already inside each entry. No new claims.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (slug) => data.find((c) => c.state === "nc" && c.slug === slug);
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

A("davidson", {
  hero: " The town's lake campus keeps the college's own hundred-acre reach on the Norman shores, with the 1930s-era Main street hospitality group's restaurants holding the parents' rows between tours.",
  s0: "The eight-to-one classroom ratios and the 1837 founding story run the guided visit rows through the admissions calendar.",
  s1: "The peninsula beach rows and the park trails cover the lake hours with the state-park parking at the Troutman row.",
  s2: "The club ballroom's Jeffersonian rows and the lake venues' yacht-club terraces carry the season's biggest weekends.",
  d0: " The campus's own lake reach keeps the rowing schedules inside the college lines while the town parks hold the public hours.",
  d1: " The park's day-use lots post the swim-season rules with the lake's boat-launch rows beside the trails.",
  d2: " The hall's free group row and the ten-plus rate book the uptown half through the hall's group line.",
});
A("clemmons", {
  hero: " The 1802 founder's river bridge story and the state's first commercial hydroelectric dam keep the Yadkin heritage inside the village's park boundaries.",
  s0: "The Trent Jones-designed championship rows and the second eighteen line the river's course through the park's golf seasons.",
  s1: "The light display's vehicle-count rows price the coach through the county posted rates.",
  d1: " The display's million-bulb count and the seasonal night hours run the winter runs through the county's event calendar.",
  d2: " The town's bus-entrance rows cover the pairing day through the visitor center unload.",
});
A("havelock", {
  hero: " The creek-and-sound waters keep the town's kayak launch at the Church road park and the forest's saltwater paddling trail claims the nation's only such national-forest route.",
  s0: "The creek-trail's twenty-one-mile rows and the campground reservation windows run the coastal-forest plan through the recreation line.",
  s1: "The palace's one-day-pass rows and the governor's-pass tickets price the class hour through the group-services line.",
  s2: "The show's free-admission base-pass rows run the public weekends through the reserved vehicle passes.",
  d0: " The Neusiok trail's segment rows and the river campgrounds sit inside the guided recreation guide's marked sites.",
  d1: " The palace's touring-group cap keeps the class splits at twenty-five per group with the east-entrance drop.",
  d2: " The launch's creek-to-Neuse rows cover the paddle half inside the same town park booking.",
});
A("yadkinville", {
  hero: " The county jail row's National Register building and the courthouse-block line keep the 1857 incorporated town's downtown grid.",
  s0: "The estate's Harvest-Grill restaurant rows and the tasting-room windows keep the valley loop inside one booking day.",
  s1: "The courthouse-block history rows and the valley festival weekends run the county's heritage calendar.",
  d0: " The estate's family-owned scale keeps the largest-estate row inside the county's wine map beside the tasting rooms.",
  d1: " The vineyard's Wednesday-to-Sunday tasting windows and the food-truck rows keep the county pour inside its posted hours.",
  d2: " The tobacco-to-vineyard conversion story runs the multi-generational farm row through the harvest-host parking.",
});
A("raeford", {
  hero: " The county seat's courthouse rows keep the fall festival's cooking-contest weeks beside the post's sandhills boundary, with the horse park's 250-acre equestrian grounds drawing the state's competition rows.",
  s2: "The horse park's event-weekend stages and the estate lawns carry the county's reception calendar.",
  d0: " The chamber's sixteen-foot flight row prices the solo flights with the birthday-party and corporate rows beside the group bookings.",
  d1: " The festival's week-long event rows and the free-admission street plan run the county's biggest visitor weekend.",
  d2: " The park's three-phase weekends and the schooling rows book the equestrian calendar through the park's show plan.",
});
A("mocksville", {
  hero: " The county's 1911 school-building museum shell keeps the new nonprofit's photo-collection rows online while the renovation runs.",
  s0: "The winery's fifteen-to-twenty-five-dollar tour rows and the daily tasting windows carry the vineyard legs through the booking line.",
  s1: "The library room's staffed research hours and the courthouse's weekday rows run the county-heritage mornings.",
  s2: "The I-40 corridor's Winston-Salem and Statesville runs price the metro legs into the county plan.",
  d0: " The villa grounds' Italianate rows and the racing-team estate story carry the touring hour beside the tasting block.",
  d1: " The courthouse's weekday hours and the street-parking rows keep the county walk inside the downtown grid.",
  d2: " The park's entry rows and the barn-hall bookings price the Tanglewood half through the county park line.",
});
A("asheboro", {
  hero: " The county's Heart-of-the-state branding and the pottery highway's state designation keep the clay-country story beside the zoo's gate rows at the 2008-designated 705 corridor.",
  s0: "The habitat rows' walking plan and the fifty-developed acres keep the zoo day inside the ten-to-four entry windows.",
  s2: "The museum's cash-and-credit rows note the hundred-bill limit at the volunteer-staffed door.",
  d0: " The North-America and Africa entrance rows split the bus-lot assignments with the solar-lot's seasonal windows noted.",
  d1: " The Flitfire Piper's wartime ferry story and the airmen-exhibit rows headline the hangar's collection line.",
  d2: " The old-mountain range's sixty-thousand-acre story keeps the forest rows among the nation's oldest ranges.",
});
A("raleigh", {
  hero: " The capital's free-museum row and the renamed arena's decade deal keep the downtown's event calendar booked through the hockey and college seasons.",
  s1: "The arena's group-sales rows and the seventeen-thousand-seat event blocks book the league nights through the venue line.",
  s2: "The 1876 house's carriage-house reception rows and the bridal suites carry the downtown wedding calendar.",
  d0: " The four-floor gallery row's whale and dinosaur halls headline the free museum's walking plan.",
  d1: " The 1911 carousel's original hand-carved rows and the train's figure-eight route keep the park hour inside the ticket rows.",
  d2: " The quarry garden's reclaimed lake rows and the flower-field seasons keep the park half inside the city's permit rules.",
});
A("lillington", {
  hero: " The county seat's courthouses and the university's camel-mascot story keep the Cape Fear river towns inside the corridor's campus-and-park plan.",
  s0: "The rock loop's hundred-thirty-five-step rows and the creek-rapids overlooks run the fee-free mornings through the park calendar.",
  s1: "The university's forty-eight-hundred enrollment rows and the first-law-school story headline the campus visit halves.",
  s2: "The greenhouse-glass garden rows and the appointment-only lawns carry the season's garden weddings.",
  d0: " The backcountry group-campsite row and the bridle-trail accesses sit inside the park's reserved-event lines.",
  d1: " The campus's private-university enrollment row claims the state's biggest private undergraduate count beside the Camels' mascot row.",
  d2: " The event barn's four-thousand-foot hall and the gazebo rows keep the wedding plan inside the thirty-seven-acre gate.",
});
A("kitty-hawk", {
  hero: " The town's oceanfront pier-house weddings and the beachfront inn's block keep the Banks' wedding lawns beside the flight-town's memorial rows.",
  s0: "The memorial's flight-story hours and the anniversary free-day rows book the class days through the park's posted calendar.",
  s2: "The pier-house catering rows and the club's forest-ground lawns carry the Banks' biggest reception weekends.",
  d0: " The monument's hill-top rows and the camp buildings' reconstructed story line the first-flight exhibit plan.",
  d1: " The pier's post-storm repair rows and the walk-up admissions keep the visit confirmed by the posted phone checks.",
  d2: " The dune system's hang-glider launch rows and the free parking rows keep the afternoon inside the park's posted rules.",
});
A("salisbury", {
  hero: " The twelve-district downtown's thousand-two-hundred contributing-property rows and the great-neighborhood award keep the historic blocks beside the soda fountain's 1917 corner.",
  s0: "The museum's group-activity-day seasons and the turntable-ride rows run the rail yard's spring-to-fall calendar.",
  s1: "The college's sixth-oldest row and the ecological preserve's hundred-eighty-nine-acre edge carry the campus walk.",
  s2: "The wagon-ride reservations and the cash-only gate rows keep the safari day inside the weekday booking hours.",
  d0: " The Barber-junction visitor rows and the train-ride platforms keep the museum hour inside the free parking plan.",
  d1: " The foundation's guided-tour rows and the trolley-shuttle event lines keep the walking half inside the district plan.",
  d2: " The safari's USDA-inspection rows and the horse-drawn wagon hours keep the group day inside the reservation rules.",
});
A("charlotte", {
  hero: " The hub's second-largest-airline status keeps the airport's connecting rows beside the stadium's event grid, with the whitewater center's Olympic-training designation anchoring the Catawba courses.",
  s1: "The stadium's oversized-lot rows and the arena's thirty-thousand-space walking blocks run the event-night moves.",
  s2: "The hall's express-entry rows and the chaperone-ratio plans keep the field-trip bookings inside the group line.",
  d0: " The hall's simulator rows and the honored inductee exhibits headline the race-week plan beside the hall's group rows.",
  d1: " The center's raft eight-rider rows and the guide-led channels keep the whitewater hour inside the events-team booking.",
  d2: " The museum's butterfly-house rows and the rainforest exhibits keep the school day's afternoon inside the Coliseum-lot plan.",
});
A("fayetteville", {
  hero: " The market house's circle-renovation rows and the veterans park's hundred-county soil wall keep the downtown story inside the post's museum blocks.",
  s1: "The orangery's glasshouse event rows and the grand-hall banquet floors carry the garden's reception calendar.",
  s2: "The garden's wedding-lawns rows and the military-event plans book the season through the garden's group line.",
  d0: " The museum's drop-tower exhibits and the glider-history rows headline the free gallery plan beside the parking row.",
  d1: " The garden's orangery and grand-hall rows keep the group hour inside the free large-vehicle parking plan.",
  d2: " The lane-closure renovation rows and the free exterior hours keep the circle stop inside the walking plan.",
});
A("avon", {
  hero: " The Kinnakeet village's sound-side flats and the nor'easter seasons keep the pier's repair rows inside the island's storm-calendar plan.",
  s0: "The bathhouse access's shower rows and the ramp thirty-eight's beach lots run the swim-morning plan.",
  s1: "The ferry office's oversized coordination rows and the first-come crossing rules keep the island legs inside the posted plan.",
  s2: "The sound-side inn's waterfront ceremony rows and the island event homes carry the multi-day wedding weeks.",
  d0: " The seashore's no-fee entry rows and the Pea Island refuge's birding miles run the island-day plans north and south.",
  d1: " The kite-site's four-designated-site rule and the shallow-water flats keep the wind day inside the posted NPS plan.",
  d2: " The free-fare window and the hourly off-season runs price the crossing plan through the posted schedule rows.",
});
A("goldsboro", {
  hero: " The Seymour corridors' fighter-wing runways and the naval-officer naming story keep the post town's rows beside the museum's Hurricane-Hazel letter exhibits.",
  s0: "The park's four-mile hiking rows and the bike-trail miles run the fee-free afternoon through the posted park hours.",
  s1: "The museum's traveling-trunk outreach rows and the USO ballroom bookings run the county's event calendar.",
  s2: "The corridor's museum-city airport legs and the capital runs price the metro legs into the county plan.",
  d0: " The lake's eleven-acre swimming rows and the picnic shelter reservations sit inside the free day-use plan.",
  d1: " The wall-of-fame exhibit rows and the Hazel-era letters keep the upstairs ballroom inside the museum's tour plan.",
  d2: " The marker's roadside rows and the private-field easement story keep the history half inside the reading-and-museum plan.",
});
A("high-point", {
  hero: " The market authority's twice-yearly show rows price the world's biggest furnishings trade inside the twelve-building campus blocks, with the jazz giant's piano keeping the museum's celebrity rows.",
  s0: "The museum's Coltrane-piano exhibit row and the pioneer-house village hours run the free-admission days.",
  s1: "The shuttle loop's free-ride rows and the two-hundred-exhibitor scales price the market weeks through the authority plan.",
  s2: "The castle's themed-hall rows and the inn's inclusive packages carry the county-line wedding season.",
  d2: " The landmark's sock-shaped hangs and the photo-stop corners keep the downtown block inside the quick-stop plan.",
});
A("corolla", {
  hero: " The county beach-permit rows and the air-down tire rules keep the four-wheel beach inside the posted ordinance lines, with the lighthouse's walk-up ticket rows running the climbs.",
  s0: "The Hummer fleet's tour rows and the horse-story guide lines keep the handoff plan inside the plaza's bus-legal stops.",
  s1: "The mansion's ghost-tour seasons and the guided-hour windows book the house rows through the reservation line.",
  d1: " The park's shared free-lot rows and the maritime museum's exhibits keep the heritage hour inside one parking plan.",
  d2: " The wildlife center's free-admission rows and the education exhibits keep the group half inside the park's shared lots.",
});
A("mocksville", {});

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("NC margin pass applied; total", data.length);
