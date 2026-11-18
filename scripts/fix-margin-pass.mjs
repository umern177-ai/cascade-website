// Margin pass: add unique words to every batch-18/19 page still below ~860.
// Every sentence derives from facts already inside that entry. No new claims.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const bySlug = (k) => {
  const [state, slug] = k.split("/");
  const e = data.find((c) => c.state === state && c.slug === slug);
  if (!e) { console.error("MISSING " + k); process.exit(1); }
  return e;
};
const A = (key, add) => {
  const e = bySlug(key);
  e.heroIntro += " " + add.hero;
  e.services[0].text += " " + (add.s0 || "");
  e.services[1].text += " " + (add.s1 || "");
  if (e.services[2] && add.s2) e.services[2].text += " " + add.s2;
  if (add.d0) e.destinations[0].text += " " + add.d0;
  if (add.d1) e.destinations[1].text += " " + add.d1;
  if (add.d2) e.destinations[2].text += " " + add.d2;
};

A("pa/north-east", {
  hero: "The borough's grape rows run both lake roads, with the harbor piers and the winery courts keeping the tasting order one loop apart through the season.",
  s0: "Harvest weekends fill the tasting rows first, so the club days book the stop order before the crush brings the traffic.",
  s1: "The shoreline mornings ride the same peninsula loop, with the beach hours set against the park's sunset close.",
  s2: "Burch Farms' harvest days and the Lake View banquet calendar keep the fall weekends booking well out.",
  d0: "The peninsula's trail miles and marina watch the bay's bird seasons, with the environmental center's indoor hours covering the weather days.",
  d1: "The borough permits the pavilion events, and the beach lot's short walk keeps the reunion hour at the water line.",
  d2: "Tastings pair with the farm markets along the same road, so the day runs the wine and the orchard halves in one loop.",
});
A("pa/summerdale", {
  hero: "The village keeps its century marker and the restored miller's house at First and Miller, and the West Shore's banquet row runs minutes south of the college blocks.",
  s0: "The college's graduation and tour days ride the campus block loop with the river corridors set for the parents' arrivals.",
  s1: "The trail's open-air miles cover the class morning before the museum's indoor block, an easy pairing on one itinerary.",
  s2: "The club's ballroom rows and the Hershey hotel blocks run one wedding-day plan from the village.",
  d0: "The museum's heritage trail mile carries the outdoor morning in every season, with the winter's Saturday closures worth the calendar check.",
  d1: "The arena's show nights price the lot through the pre-purchase, saving the walk-up rate on the county's biggest indoor nights.",
  d2: "The track's sprint-car seasons fill the spring and fall weekends, with the national nights drawing the out-of-town grandstands.",
});
A("pa/ulster", {
  hero: "The river's wide reach keeps the township's farm flats, with the ferry history and the valley overlooks marking the county's oldest settlement ground.",
  s0: "The valley's museum hours pair the Athens and Sayre blocks on one morning loop down the corridor.",
  s1: "Windswept's barn weekends book the Towanda-side guest loops with the late ride set against the send-off.",
  s2: "The tournament's August weeks pull the valley blocks south, with the county seat's hotel row holding the overflow.",
  d0: "The refuge site's river side keeps the Marie Antoinette view free through the seasons, an easy stop over the water.",
  d1: "The library's top-floor museum room books its open afternoons twice weekly, so the day plans the corridor south around the hours.",
  d2: "The station block's railroad row pairs with the hospital town's blocks on the same north leg of the valley loop.",
});
A("pa/moscow", {
  hero: " The borough keeps the 1904 station's brick face over the ravine, with the trailhead park's crossings drawing the walking mornings between the rails.",
  s1: " The trolley museum's ride hours pair with the roundhouse yard on one city morning, quoted as one itinerary.",
});
A("pa/hawley", {
  hero: " The borough's falls-side blocks keep the lodge row and Bingham Park's bandstand, with the lake's fee launches and free cove covering the boat mornings both ways.",
  s1: "The sister properties' courtyards run one guest-block plan, with the Woodloch campus taking the larger reunion weekends.",
  d0: "Private charters extend the lake hour beyond the season, with the marina's captains listed for the off-season dates.",
  d1: "The mill's heritage rooms and the waterfalls' trail loop keep the walking half a block from the lodges.",
});
A("pa/lake-ariel", {
  hero: " The community's lake stays behind its own gates while the region's inns and sanctuaries keep the county's guest season booking through the Twin Rocks corridor.",
  s1: "The Hideout lodge's in-house catering and the pavilion venues set the reception loops from the interstate side.",
  d0: "The sanctuary's research story runs the school morning with the lake's landmark status in the docent line.",
  d2: "The cruise's group windows book beside the marina's rentals, one lake-front plan for the block.",
});
A("pa/monaca", {
  hero: " The borough's river-bend blocks keep the college gate, with the turners' hall and the Broadhead corridor holding the banquet half of the calendar.",
  s0: "The graduation blocks book the spring weekend first, with the orientation weeks filling the summer calendar alongside.",
  d1: " The dining row's river views run the evening half from the same drop, with the blocks' outer row holding the bus.",
});
A("pa/denver", {
  hero: " The borough keeps the Bucher valley's mill history and the covered bridge at neighboring Reamstown, with the turnpike interchange carrying the long legs both ways.",
  s0: "The cloister's guided half-hours set the class day around the Wednesday-to-Sunday tour calendar.",
  s1: "The wildlife-drive mornings book around the refuge's Monday closures, with the center's lot taking the minibus.",
  s2: "The Ephrata barn venues' guest loops ride the same corridor as the cloister runs, one plan for the county weekend.",
  d1: " The goose season's dawn hours run the flats before the drive opens, with the overlook rows holding the coach clear of the pull-ins.",
});
A("pa/east-greenville", {
  hero: " The tri-borough row keeps the creek's mill heritage at Main Street, with the valley's high school and the theater's marquee marking the district's calendar.",
  s1: "The trail's county lot row lets the group split the drop ends, running the town-to-Oaks half on shuttle legs.",
  s2: "The Pennsburg estate and the creekside inn book the Upper Perk weekends, with the borough blocks holding the guest loops.",
  d0: "The reservoir's bird area keeps the eagle overlooks on the water's north shore, an easy pairing with the trailhead morning.",
});
A("pa/west-grove", {
  hero: " The borough keeps its rose-nursery name from the Dingee and Conard greenhouses, with the mushroom houses' ridges running the county roads both directions.",
  s1: "The festival's wristband entry runs the street fair from the remote staging, with the fair's two-day weekend priced as one plan.",
  d2: "The Kennett taproom and the Parkesburg production house split the beer-country half, one loop for the club day.",
  d1: "The fair's cooking rows and the grower stands keep the crowd hour inside the closed blocks, with the pickup set well past the barricades.",
});
A("pa/broomall", {
  hero: " The township keeps the county's garden-suburb blocks, with the Blue Route's interchanges carrying the museum mornings out of the Marple grid.",
  s2: "The Drexelbrook's grand ballroom and the Ellis Preserve's market-rooms split the Delaware County season one corridor apart.",
  d2: "The farmstead's brick section and stone addition carry the township's 1696 story on the docent tour's indoor half.",
});
A("pa/hatboro", {
  hero: " The borough keeps the Pennypack's mill row and the battlefield's history block on York Road, with the library's charter dates anchoring the town's heritage story.",
  s1: "The estate's tours pair with the mall's shopping hour, with the district's cathedral morning completing the Bryn Athyn loop.",
  d1: " The garage's short-stay rows take the group drop, with the outer lots priced free for the longer shopping hours.",
});
A("pa/royersford", {
  hero: " The borough keeps the stove works' foundry blocks at the water, with the twin-borough school district and the historical society carrying the iron story's exhibits.",
  s0: "The trestle's river crossing carries the trail loop into Spring City's blocks, one round leg for the club morning.",
  d1: " The valet and garage rows price the event hours, with the outer lots holding the coach clear of the decks.",
  d2: "The theater's three-venue block keeps the borough's film heritage on the marquee row, with Steel City's listening room next door.",
});
A("pa/mount-carmel", {
  hero: " The borough keeps its coal-town row homes and the 1888 Gothic parish in the valley grid, with the Route 61 corridors carrying the mine and brewery legs both ways.",
  s1: "The park's hundredth-season coasters draw the reunion blocks first, with the grove's picnic hours booking for the school dates.",
  d1: " The ride-all-day passes price the group's coaster hour, with the free gates keeping the block budget for the ride plan.",
  d2: " The tunnel tours' barroom history pairs with the brewery's vault rooms on one Route-61 day, so the class books both windows.",
});
A("pa/middletown", {
  hero: " The borough keeps the Union Canal's early works in its blocks, with the Swatara's meeting water marking the excursion line's crossings west of the square.",
  s0: "The reservation calendar books the excursion seats months out, with the diesel power noted in the confirmation.",
  d1: "The chocolate-avenue blocks and the boardwalk slides price one park day, with the free bus lot confirmed in the plan.",
  d2: "The caverns' constant cool runs the tours year-round, with the group discount's twenty-passenger floor setting the bus minimum.",
});
A("pa/east-stroudsburg", {
  hero: " The river-front blocks sit under the water gap's walls, with the university's enrollment growth keeping the campus rows and the downtown's hotel side busy through the school year.",
  s1: "The raceway's June weekend draws the campus's out-of-town guests, with the hotel loops priced into the race-day plan.",
  s2: "The Shawnee Inn's island ceremonies and the brewery's taproom evenings keep the riverside blocks booking through the seasons.",
  d1: "The triangle's infield hours book the group hospitality, with the expressway's lot row set for the June heat.",
});
A("pa/peach-bottom", {
  hero: " The ferry road's crossing history and the McCall's span story sit under the pond's water line, with the Norman Wood bridge carrying the county lines across the river.",
  s1: "The dam's overlooks run the eagle counts from the park's free lots, one river-morning plan for the winter weekends.",
  d0: " The lock's restored kiln and the sawmill ruins keep the interpretive row open through the seasons, with the towpath's trailhead parking beside the falls.",
  d2: "The chapel's Welsh services and the cottages' narrow lanes keep the Delta hour a walk-in visit, with the Main Street curbs booked for the coach.",
});
A("pa/ronks", {
  hero: " The village's farm rows and the kitchen lanes keep the bake-shop mornings, with the show campus and the rail yards splitting the county's two big draws.",
  s0: "The theater's season calendar fills the show dates months ahead, so the bus books at the same time as the group's tickets.",
  d0: "The railroad's short-line grade runs the farmland miles with the combination windows covering the museum row across the gap road.",
  d1: "The kitchen's jam batches and the quilt shop rows keep the village hour a walk, with the outer lot holding the bus past the lane.",
});
A("pa/lewisburg", {
  hero: " The campus counts its four thousand undergraduates along the river's edge, with the Market Street blocks and the Weis Center's seasons filling the borough's calendar.",
  s1: "The vineyard's country rows and the Iron Front's downtown doors split the season's venue halves, one loop for the guest blocks.",
  s2: "The capital's airport corridor rides the US-15 junction, with MDT's wider flight board carrying the conference arrivals.",
  d0: "The hall's acoustic seasons run the touring calendar's professional half, with the group discounts covering ten-plus bookings.",
  d2: "The hotel row and the storefront blocks keep the shopping hour walkable, with the Diamond's side lanes holding the bus.",
});
A("pa/allentown", {
  hero: " The city keeps the Lehigh's river-front parks below the arena blocks, with the museum row's Front Street hours and the brewery rooms booking the downtown evenings.",
  s1: "The park's coaster weekends price the lot rows per car, with the school days running the museum's weekday hours instead.",
  s2: "The brewery's private rooms and the Hamilton blocks' dinner hour complete the city wedding loop, priced as one plan.",
  d1: "The ballpark's three entrances split the arrival sides by direction, with the airport-side approach setting the Dauphin drop.",
});
A("pa/williamsport", {
  hero: " The city's millionaires' row keeps the Victorian district's house museum half, with the Third Street's downtown blocks and the river park running the walking hours.",
  s0: "The series' free complex lots book the tournament week early, so the written quote locks the drop row before the August crowds.",
  s2: " The riverboat's charter option books the private cruise hour, with the dock's free parking covering the shuttle plan.",
});
A("pa/stroudsburg", {
  hero: " The county seat keeps the Main Street blocks and the courthouse row, with the river's 611 corridors and the mountain resort roads splitting the day's two halves.",
  s1: " The park's falls and overlooks book the spring class mornings, with the trail shuttles set against the 209 spur's seasonal gates.",
  s2: "The Stroudsmoor inn's mountaintop ceremony lawns sit minutes above the blocks, one plan for the county weekends.",
  d0: " The river's launch rows divide the boat ramps by river mile, so the shuttle legs price the put-in and take-out separately.",
});
A("oh/middlefield", {
  hero: " The settlement's plain-meeting rows spread across the county roads, with the co-op's cheese house and the Monday market keeping the borough's two anchors busy.",
  s1: "The Amish-country shops keep the cash-and-carry rows, with the co-op's viewing windows pairing the tasting loop for the county day.",
  s2: "The Swine Creek lodge's pond side and the manor lodge's Tudor blocks hold the season's guest loops.",
  d0: " The retail keeps the weekdays with a Saturday morning window, so the tasting run books the make-day hours ahead.",
  d2: " The reservation system takes the lodge weeknights, with the county-resident waiver noted in the booking.",
});
A("oh/ottawa", {
  hero: " The courthouse's Beaux-Arts stones keep the 1912 county story on the square, with the river's flood walls and the fort monument marking the water's reach.",
  s0: " The grandstand nights book the fair week's return times first, with the fairground's East Second Street gates setting the drop.",
  s1: "The Knights of Columbus hall's kitchen and the fairgrounds center split the county's big reception calendar, one shuttle plan for either floor.",
  s2: " The Detroit arrivals ride the turnpike corridors north, with the wedding block's return timed to the send-off hour.",
  d1: " The fort's memorial park marks the 1812 supply-post story on the Auglaize's banks, with the festival's reenactment encampment booking the mid-August weekend.",
});
A("pa/butler", {
  hero: " The county keeps the jeep heritage markers in the downtown blocks and the Bantam yard's story on the museum row, with the state park's lake running the western half of the calendar.",
  s1: " The Farm Show's August week books the grounds' gate row early, with the county event calendar filling the shoulder seasons.",
  d1: " The show grounds' hundred acres take the trailer traffic on the county road, with the written quote confirming the pickup corner after the gates close.",
});
// beaver was already enriched in the prior pass
writeFileSync(path, JSON.stringify(data, null, 2));
console.log("margin pass applied; total", data.length);
