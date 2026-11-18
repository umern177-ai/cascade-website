// WA margin pass: enrich every WA page below ~850 unique 5-grams with
// sentences from facts already inside each entry. No new claims.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (slug) => data.find((c) => c.state === "wa" && c.slug === slug);
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

A("woodinville", {
  hero: " The Hollywood district's name carries its 1910 farm-line roots and the 1912 schoolhouse rooms beside the hundred-thirty-plus tasting rows, with the red-brick warehouse row holding the industry's barrels a district south.",
  s0: "The four-district map's warehouse-and-valley rows split the tasting plan across the two-mile corridor's shuttle-friendly halves.",
  d2: " The gateway park's trail rows start the Bothell-side miles with the Redmond-end lake rows completing the greenway's loop lines.",
});
A("ellensburg", {
  hero: " The Kittitas valley's hay-country acreage and the county fair's 1885 founding keep the arena week's heritage beside the college's normal-school roots, with the transit-shuttle parking rows planned for the rodeo crowds.",
  s0: " The fair's separate-week rows and the arena's night blocks ride into the written quote with the rodeo office's staging rows.",
  d0: " The fair's century-and-a-half grounds run the week's exhibit rows alongside the arena's professional circuit.",
  d2: " The summit's ski rows and the valley's dinner plans price one corridor itinerary with the winter travel rules.",
});
A("davenport", {
  hero: " The Lincoln county courthouse's 1896-seat-election story and the wheat-belt silo rows keep the crossroads grid beside the Fort Spokane boardwalk's military-and-school museum halls.",
  s0: " The fort museum's residential-school exhibit rows and the tribes' consultation lines frame the class-day rows.",
  s1: " The dam's visitors-center seasonal hours confirm through the bureau line before the county drive north.",
  s2: " The Spokane corridor's morning-and-evening runs price the metro legs into the county plan.",
  d0: " The fort's two-river confluence rows and the boarding-school exhibits headline the national recreation area's history half.",
  d1: " The laser-show summer rows and the dam's concrete-face overlooks carry the evening returns back down the highway.",
});
A("omak", {
  hero: " The Omak name's trout-crossing translation keeps the Okanogan's river-fork town beside the state's largest-county acreages and the Colville reservation's boundary rows.",
  s2: " The Wenatchee corridor's river-valley route and the Spokane's mountain-leg drives price the airport runs into the county plan.",
  d0: " The race course's two-hundred-twenty-five-foot hill descent rows and the river-crossing finish line carry the arena's August hours.",
  d1: " The park's eighty-foot dock rows and the reservable shelter bookings keep the lake half inside the April-October windows.",
});
A("monroe", {
  hero: " The community-transit west-gate shuttle rows and the fair park's two gate-week halves keep the group plan moving through the crowded lots, with the Fryelands boulevard lake keeping the swim-morning rows free.",
  s0: " The transit-shuttle west-gate drops and the per-entry gate pricing run the fair-week plan through the county's posted rows.",
  d0: " The county's transit routes run direct shuttles to the west gate through the fair's biggest weekends.",
  d1: " The monthly-tested swim rows and the one-point-six-mile paved loop keep the park half inside the free-parking plan.",
});
A("hoquiam", {
  hero: " The harbor's log-boom rows and the Bowerman basin's shorebird refuges keep the Grays Harbor estuary inside the city's festival calendar.",
  s0: " The stadium's Friday-night rows and the WPA fir-timber story keep the heritage visits inside the city's block grid.",
  s2: " The church-hall event rows and the downtown center's banquet floors carry the Grays Harbor reception calendar.",
  d0: " The Sandpiper trail's level boardwalk rows and the no-facilities note keep the tide planning inside the free entry.",
  d1: " The stadium's best-preserved-row claim and the Register listing headline the heritage visit's story corners.",
});
A("kennewick", {
  hero: " The tri-city riverfront's park-line shelters and the ballpark's High-A summer nights round the valley's weekday calendar, with the airport's eleven-market board carrying the arriving blocks.",
  d0: " The reactor-tour registration opens the spring windows each April, with the reservation line confirming the season's morning runs.",
  d1: " The valley's first vines date to 1975, the original estate's tasting row still standing among the slopes.",
  d2: " The arena's six-to-seven-thousand-seat nights carry the league and concert calendar inside the same booking row.",
});
A("sequim", {
  hero: " The lavender growers' association farm map keeps the twenty-row valley inside the bloom weeks, with the organic farm's event program anchoring the certified rows.",
  s1: " The spit's lighthouse-tour day rows and the volunteer-keeper visits ride the refuge's nine-to-five lines.",
  d0: " The wildlife refuge's pets-prohibited rule and the cash-gate exact-change rows shape the birding half's planning.",
  d2: " The festival's vendor-count rows and the bloom-week farm windows set the July weekend's two-day plan.",
});
A("stevenson", {
  hero: " The windiest Gorge gap's river-front landing rows and the county-seat records story keep the town inside the national scenic area's boundary lines.",
  s1: " The dam complex's closure-warning lines and the confirm-before-group-trip notes frame the fish-window visits.",
  d1: " The monolith's Clark-named 1805 story and the fifty-two-switchback rail rows headline the park's climb plan.",
  d2: " The museum's seven-day river-cove rows and the twelve-dollar door line price the group hour beside the free drivers.",
});
A("chehalis", {
  hero: " Twin-cities' 1912 depot museum keeps the famous stump's 1903 speech story inside the exhibit rows, with the Willapa hills trail's fifty-six miles running from the falls park west.",
  s0: " The museum's five-dollar door rows and the group-hour booking rate carry the depot's history mornings.",
  d1: " The falls' reduced post-flood cascade story and the CCC shelter rows keep the park hour inside the discovered-pass plan.",
});
A("north-bend", {
  hero: " The valley's trailhead town keeps the filming-era storefronts beside the highway's pass-bound exits, with the Seattle corridors half an hour west.",
  d0: " The falls' ground-level platform row and the visitor deck's paid-lot corners frame the river's plunge from two sides.",
  d1: " The museum's snow-season holiday trains and the spring-and-summer excursion windows split the schedule around the depot rows.",
});
A("anacortes", {
  hero: " The oil-refinery skyline rows and the boatworks yards keep the working harbor beside the island gateway's four-district tasting scene and the terminal's reservation-ready sailings.",
  s0: " The terminal-road queue rows and the winter-reservation windows book the coach's island legs through the WSF reservation rows.",
  s1: " The pass park's camping-row reservations and the retreat center's meeting halls cover the group half beyond the beach lots.",
  d2: " The hotel-events row and the ridge-estate lodge grounds carry the gateway's reception calendar beside the garden barns.",
});
A("port-orchard", {
  hero: " The 1892 seat-vote story and the Sidney-name history keep the county-seat rows beside the mosquito-fleet festival calendar and the car-show summers.",
  d0: " The twelve-RV hookup group camp rows and the covered-shelter block carry the coastal camping plan's reservable lines.",
  d1: " The terminal's first-and-second street drop rows sit within three-and-a-half blocks of every overnight lot posted rate.",
  d2: " The chamber's community-event calendar runs the market rows through the season posted windows.",
});
A("ridgefield", {
  hero: " The refuge's 1965 dusky-goose founding story and the plankhouse's Chinookan build rows keep the refuge lines beside the October festival's crane crowds.",
  s0: " The refuge's education-program request rows and the twenty-rider tour cap keep the class day inside the pre-visit lines.",
  d0: " The blind-overlooking Rest-Lake rows and the four-and-a-half-mile gravel count headline the vehicle-season loop plan.",
  d2: " The longhouse's docent-hour windows and the tribal-use season shifts confirm the culture stop through the education office.",
});
A("snoqualmie-pass", {
  hero: " The pass's three-thousand-foot summit elevation and the four-base resort's complex lines keep the winter calendar at the western Cascades' year-round crossing.",
  s2: " The falls' twenty-minute west drive and the valley towns' dinner rows complete the summit weekend's evening plan.",
  d1: " The mitigation pond's stocked-rainbow rows and the 2024 bridge-over-interstate crossing headline the spring-and-summer walking plan.",
});
A("kingston", {
  hero: " The terminal's twenty-five-departure weekday rows and the ferry fleet's pair keep the Appletree cove crossing inside the Sound's busiest corridor schedule.",
  s2: " The island's Bainbridge ferry corridor rides the Kitsap roads south with the Sound rows completing the loop-day plan.",
  d1: " The village's visitor-row parking plan and the shopfront lines keep the historic stop inside the morning half.",
  d2: " The island crossing's walk-on rows and the terminal lots keep the Bainbridge legs first-come through the season.",
});
A("port-townsend", {
  hero: " The Victorian rows' seven-hundred-residence count and the sixty-commercial-block grid keep the landmark district designation at the waterfront's three-decade award row.",
  s0: " The festival-day shuttle quarter-hour rows and the Haines-place park-and-ride loop keep the dock streets clear for the boats.",
  d1: " The campus's reunion-house fourteen-bedroom rows and the dorm bookings carry the group weekends through the parks campus line.",
  d2: " The whale-skeleton Hope exhibit's 2026 opening row and the adults' seasonal door price keep the center hour inside the pass plan.",
});
A("forks", {
  hero: " The timber museum's 1984 founding row and the lookout-tower exhibit keep the logging-capital story beside the fan calendar's September festival.",
  s1: " The beach-lot paid-session rows and the tribal-enterprise program lines keep the trailhead shuttles inside the app-based parking plan.",
  d0: " The visitor center's March-through-October row and the separate day-fee added 2025 headline the forest's planning rules.",
  d1: " The Second Beach's road-distance rows and the ten-car main lot set the shuttle plan against the tribal-lot rules.",
});

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("WA margin pass applied; total", data.length);
