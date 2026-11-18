// Similarity-differentiation pass for the short WI/OH/PA pages affected by
// Batch 18 (Amherst, Reedsburg, Danbury, Sidney + Carroll/Huron/Meadville).
// Copy is appended from facts ALREADY held in each entry - no new claims.
// Also adds explicit premium route blocks to the four pages without one.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));

const FIXES = {
  "wi/amherst": {
    heroIntro: " The guide weeks start with the general season the first Saturday in May and run the spring creeks through September, while the orchard weekends land back to back in September and October when the farm lane fills with the school coaches.",
    svc0: " Groups meet the guides at the stream lots and the casting clinics fill the spring Saturdays, with the village's river bends a short walk from the parking.",
    svc1: " One vehicle covers both legs in a day, with the northbound classes riding the same corridor toward Wausau.",
    veh0: " - with the orchard buckets in the bays through the fall weeks.",
    veh2: " - the Sprinter's short wheelbase fits the narrow river-lane turns.",
    dest0text: " The access points sit close together and the guide weeks book them out early, so the day's shuttle timing sets the water half before the orchard half.",
    dest0tip: " Stream-access lots stay small through the season. The minibus drops at one access and the driver resets to the take-out while the coach holds in town.",
    dest1text: " The cider house pours through the picking weekends and the hayride rows fill the parking lane on the September Saturdays.",
  },
  "wi/reedsburg": {
    heroIntro: " The Baraboo's slow bends carry the canoe livery days between the sandbars, and the trailhead park sits at the end of Main Street where the cider and cheese shops keep the afternoon.",
    svc0: " Most clubs book the whole line from the Reedsburg trailhead out to Elroy, with the underfloor bays carrying the bikes and the shuttle covering the return.",
    svc1: " The tasting rooms keep group hours, with the creamery stops and the taproom visits paired on one afternoon loop.",
    svc2: " One vehicle covers the airport leg, the capital visits and the return with the trail gear.",
    veh1: " - the Madison runs and the Elroy end-of-trail pickups ride the same day.",
    dest0text: " The crushed-granite bed rides straight through the river-bottom timber, with the old rail tunnels marking the halfway mark toward Elroy.",
    dest1text: " The shop rows keep the cheese counter, the bakery fronts and the trailhead picnic lawn within one short walk.",
  },
  "wi/danbury": {
    heroIntro: " The Yellow River runs past the fort block before it meets the Scenic Riverway west of the trading-post valley, and the landings along the border river carry the livery season.",
    svc0: " The livery days book their put-ins out ahead, with the drive holding the take-out lot while the boats run the border water.",
    svc1: " The reenactment weekends draw the Twin Cities' school buses in spring and fall, with the interpretive tours booked ahead of arrival.",
    svc2: " One vehicle covers the airport leg, the river day and the drive back to the cities.",
    veh0: " - the river legs and the fort block both sit inside the village.",
    dest0text: " The two posts sit on the Yellow River's flat with the walking loop between the fur-trade buildings and the exhibit hall.",
    dest1text: " The landings book the shuttle weeks out for the club paddles, with each put-in a different county road.",
  },
  "oh/sidney": {
    heroIntro: " The 1883 courthouse's Second Empire dome and the Big Four rail bridge over the Great Miami River carry the postcard half of the square, with the manufacturing corridor running the county's weekday half.",
    svc0: " Dayton International rides forty minutes south on I-75 and Columbus two hours east, so one round trip covers both.",
    svc1: " The county museum's exhibits and the bridge-walk stop fill the class morning before the courthouse square.",
    svc2: " The courthouse-square churches and the surrounding barns keep the April-to-October season.",
    veh0: " - the loop covers the campus, the square and the barn lanes.",
    dest0text: " The square's fountain and the 1883 dome anchor the walking half, with the county museum row a block off the courthouse lawn.",
    dest1text: " The converted rail bridge's pedestrian lane walks straight from the downtown blocks over the Great Miami.",
  },
  "oh/carroll": {
    heroIntro: " The district's event nights and the parish hall weekends keep the village loop busy from April through the fall calendar, with the state-park roads an easy half-day southeast.",
    svc0: " Away-game runs, band nights and the class trips price as one school-year plan on the district calendar.",
    svc1: " The trails and picnic shelters run half-day groups toward Lancaster, with the park lots stage-ready for the buses.",
    svc2: " One vehicle covers the airport leg, the district day and the return south.",
    veh0: " - the village loop and the school lot share the same lanes.",
    dest2text: " The cave-and-falls walks pair the outdoor half with the park's morning loops through the gateway roads.",
  },
  "oh/huron": {
    heroIntro: " The basin's concert nights and the pier rows run the summer calendar, with the walleye charters leaving at dawn from the same shore blocks.",
    svc0: " The free amphitheater concerts, the boardwalk and the pier picnic hours ride one village loop.",
    svc1: " The coaster weekends run the park lots and the lodging loops, with the shuttle beating the drive-in queue by ten.",
    svc2: " Cleveland Hopkins rides an hour east and Detroit Metro covers the connecting flights north.",
    veh1: " - the Cedar Point Saturdays and the shore-block evenings share the same run.",
    dest0text: " The 122-slip basin keeps the Platinum designation, with the river boardwalk running between the amphitheater lawn and the marina rows.",
    dest0tip: " Concert nights fill the basin lot. The shuttle holds the outer row and walks the group to the lawn.",
    dest2text: " The pontoon tours book in season and the storage slips quiet the inland lagoon away from the shore crowds.",
  },
  "pa/meadville": {
    heroIntro: " Erie's bayfront and its regional airport ride forty minutes up the corridor, with Crawford County's courthouse square splitting the two halves of the town.",
    svc0: " Admitted-student days, reunion weekends and move-in runs share the campus loop with luggage aboard.",
    svc1: " The 1843 mansion, the Market House block and the courthouse lawn carry the walking half of the county day.",
    svc2: " One vehicle covers the airport leg, the campus day and the county loop.",
    veh1: " - the county legs and the Erie corridor ride the same coach.",
    dest0text: " The visit-day admissions loops and the alumni weekend rows share the campus blocks, with the reunion shuttles holding the hotel side.",
    dest1text: " The 1843 Greek Revival mansion keeps the county's founding story on its museum floor, with guided tours by the docent hours.",
    dest2text: " The Presque Isle beach hours and the bayfront maritime museum pair on the same forty-minute run north.",
  },
};

// premium blocks for pages without one (all facts from their own entries)
const PREMIUM = {
  "wi/amherst": {
    heroLead: "The Tomorrow River's trout-water village on I-39: the guide weeks in spring, Wojcik's orchard weekends in fall and Stevens Point twenty minutes west. We run the river days and the school loops.",
    route: { to: "Wojcik's Apple Farm", toNote: "Orchard weekends", miles: "", time: "~10 min", via: "County road E" },
  },
  "wi/reedsburg": {
    heroLead: "The 400 State Trail's home rail town on the Baraboo River: 22 miles of crushed-granite trail, the canoe corridors and the Main Street cheese counters. We run the trail shuttles and the Madison legs.",
    route: { to: "Elroy", toNote: "Trail's far end", miles: "~22 mi", time: "", via: "400 State Trail rail bed" },
  },
  "wi/danbury": {
    heroLead: "The fur-trade valley where the Yellow River meets the St. Croix: the 1802 fort posts, the paddling landings and the Twin Cities ninety minutes south. We run the river days and the school tours.",
    route: { to: "Forts Folle Avoine Historical Park", toNote: "Fur-trade park", miles: "", time: "", via: "" },
  },
  "oh/sidney": {
    heroLead: "Shelby County's seat on the Great Miami: the 1883 courthouse dome, the converted Big Four rail bridge and Dayton's airport forty minutes south. We run the history days, wedding loops and airport legs.",
    route: { to: "Dayton International Airport", toNote: "Airport", miles: "", time: "~40 min", via: "I-75 S" },
  },
};

let changed = 0;
for (const [key, f] of Object.entries(FIXES)) {
  const [state, slug] = key.split("/");
  const e = data.find((c) => c.state === state && c.slug === slug);
  if (!e) { console.error("MISSING " + key); continue; }
  if (f.heroIntro && !e.heroIntro.endsWith(f.heroIntro)) e.heroIntro += f.heroIntro;
  if (f.svc0) { e.services[0].text += f.svc0; }
  if (f.svc1) e.services[1].text += f.svc1;
  if (f.svc2 && e.services[2]) e.services[2].text += f.svc2;
  if (e.vehicles?.[0] && f.veh0) e.vehicles[0].reason += f.veh0;
  if (e.vehicles?.[1] && f.veh1) e.vehicles[1].reason += f.veh1;
  if (e.vehicles?.[2] && f.veh2) e.vehicles[2].reason += f.veh2;
  if (e.destinations?.[0]) {
    if (f.dest0text) e.destinations[0].text += f.dest0text;
    if (f.dest0tip) e.destinations[0].tip += f.dest0tip;
  }
  if (e.destinations?.[1] && f.dest1text) e.destinations[1].text += f.dest1text;
  if (e.destinations?.[2] && f.dest2text) e.destinations[2].text += f.dest2text;
  if (PREMIUM[key] && !e.premium) e.premium = PREMIUM[key];
  changed++;
}
writeFileSync(path, JSON.stringify(data, null, 2));
console.log("enriched", changed, "entries; total", data.length);
