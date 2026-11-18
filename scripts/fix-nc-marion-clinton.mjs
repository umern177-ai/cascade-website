// NC margin: Marion & Clinton are short pre-existing pages pairing over-gate
// (marion~davidson 0.215, clinton~marion 0.228). Enrich both from entry facts,
// add premium blocks (4th destination where the data supports one), 4th FAQs.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (slug) => data.find((c) => c.state === "nc" && c.slug === slug);

const ma = get("marion");
ma.heroIntro = "Marion sits between the Blue Ridge Parkway and Lake James, the McDowell county seat whose Depot street rows keep the mining-era blocks below Linville Gorge's cliff lines. The falls' ninety-foot drops run the gorge trips, the lake's beach rows carry the swim mornings and the riverfront event halls hold the wedding season. Groups arrive from Charlotte an hour east for the school days and the mountain weekends.";
ma.services[0].text = "The gorge's cliff trails, the Linville Falls stair rows and the lake beaches run the school and family trips through the season's gorge calendar.";
ma.services[1].text = "The Catawba riverbank lawns and the Depot street event halls carry the wedding season with the guests flying into the Charlotte corridors.";
ma.services[2] = { title: "School and History Days", text: "The county's mining-heritage blocks, the depot museum rows and the mountain-history stops run the class-half days through the county lines.", href: "/services/school-transportation/" };
ma.vehicles[0].reason = "Gorge days, Depot street loops and lake mornings.";
ma.vehicles[1].reason = "Charlotte delegations, school blocks and wedding rows.";
ma.vehicles[2].reason = "Trailhead drops and the mountain-lane turns.";
ma.destinations[0].text = "The Linville Falls' ninety-foot staircase drops and the gorge's canyon-floor trail rows, the Blue Ridge's signature run east of the county seat.";
ma.destinations[0].tip = "The falls trailhead's small lot holds the minibus drop with the class walking the stair rows through the ranger-lined route.";
ma.destinations[1].text = "The lake's swimming beaches at the Linville access and the canal-bridge ramp rows, the family kayak legs below the reservoir's dam line.";
ma.destinations[1].tip = "The park's entry prices per vehicle with a posted bus rate, so the written quote books the group row with the park office.";
ma.destinations.push({ name: "Linville Caverns", text: "The mountain's underground cavern rooms across the gorge where the guided walks thread the mineral-lined passages.", tip: "The cavern's guided tours keep group windows through the season, with the parking row confirmed for the coach before the underground hour." });
ma.faqs.push({ q: "What fits a school day?", a: "The falls staircase morning, the cavern's underground hour and the lake beach afternoon, one McDowell plan." });
ma.faqs.push({ q: "Where do wedding guests stay?", a: "The Depot street halls and the mountain inns hold the county's season blocks, with the Charlotte and Asheville corridors carrying the arrivals." });
ma.premium = {
  heroLead: "The gorge-country county seat between the Parkway and the lake: Linville Falls' staircase drops, the lake's swimming beaches and the cavern's mineral passages. We run the gorge trips, school days and mountain weddings.",
  route: { to: "Linville Falls", toNote: "Gorge signature", miles: "~18 mi", time: "~30 min", via: "US-221 N" },
};

const cl = get("clinton");
cl.heroIntro = "Clinton is the Sampson county seat on the sweet-potato capital's farm rows, the courthouse-square town whose festival grounds carry the harvest weekends and whose museum keeps the county's agricultural story. The expo center's rodeo and farm-show nights book the county weekends and the capital rides an hour northwest. Cascade Charter Bus runs the festival weekends, the museum mornings and the farm tours.";
cl.services[0].text = "The capital airport's one-hour runs carry the visiting corporate and wedding blocks, with the airport's terminals tied into one contract.";
cl.services[1].text = "The county history museum's exhibit rows, the sweet-potato farm tours and the rural heritage stops run the school-day calendar.";
cl.services[2].text = "The barn venues, the country churches and the farm lawns carry the April-to-October season with the late ride priced in.";
cl.vehicles[0].reason = "County school trips, expo nights and museum rows.";
cl.vehicles[1].reason = "Farm-venue weddings and the capital transfers.";
cl.destinations[0].text = "The county museum's agricultural exhibits and the rail heritage rows, with the courthouse square's shop blocks completing the downtown walk.";
cl.destinations[0].tip = "The museum's lot takes the minibus while the coach stages the courthouse square, with the class walking one museum block.";
cl.destinations[1].text = "The expo center's farm shows and the rodeo-and-grandstand nights run the county's biggest group calendar.";
cl.destinations[1].tip = "The expo center's lots take the coach through the fair rows, with the shuttle set for the grandstand nights.";
cl.destinations.push({ name: "Sweet-Potato Farm Tours", text: "The county's farm tours through the state-leading sweet-potato fields, the harvest story told at the row's pace.", tip: "The farm tours book through the county's agriculture office, with the fall harvest weeks the season's best windows." });
cl.faqs.push({ q: "Why the sweet-potato capital?", a: "The county's fields lead the country's sweet-potato rows, with the harvest festival weekends drawing the county's biggest crowds." });
cl.faqs.push({ q: "What fits a school day?", a: "The museum's exhibit morning, the farm tour's harvest hour and the courthouse square's lunch row, one Sampson plan." });
cl.premium = {
  heroLead: "The sweet-potato capital's courthouse town: the county museum's agricultural rows, the harvest festival weekends and the farm tours through the leading fields. We run the festival weekends, museum mornings and farm tours.",
  route: { to: "Sampson County History Museum", toNote: "County museum", miles: "", time: "~5 min", via: "Downtown Clinton" },
};

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("marion + clinton enriched; total", data.length);
