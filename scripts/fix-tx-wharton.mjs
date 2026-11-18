// TX margin pass: Wharton (short existing page pairing over-gate) + small
// boosts to Granbury and Cypress. Copy from facts already in the entries.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (k) => {
  const [state, slug] = k.split("/");
  const e = data.find((c) => c.state === state && c.slug === slug);
  if (!e) { console.error("MISSING " + k); process.exit(1); }
  return e;
};

const wh = get("tx/wharton");
wh.heroIntro = "Wharton is the Colorado River county seat seventy minutes southwest of Houston on the US-59 corridor, the 1910s courthouse square and the college's performing-arts blocks filling the town's calendar. The county fairgrounds book the fall festival weeks, the river parks run the picnic half and the county museum keeps the heritage row. Groups arrive for church retreats, school trips and the county's festival schedule.";
wh.services[0].text = "Houston rides seventy minutes northeast on US-59, with church retreat groups, school trips and the county's visiting families riding one vehicle.";
wh.services[1].text = "The Colorado River's parks, the Wharton County Fairgrounds' fall calendar and the county museum row run the school and heritage itineraries.";
wh.services[2].text = "The county's farm venues and rural churches host weddings and reunions, with the guest inns and ranches feeding the shuttle loop.";
wh.services.push({ title: "Fair and Festival Shuttles", text: "The fairgrounds' gate rows and the downtown festival blocks run the county's big weekend plans, with gate times and returns set ahead.", href: "/services/sightseeing-tour-bus/" });
wh.vehicles[0].reason = "County trips, courthouse drops and river-park loops.";
wh.vehicles[1].reason = "Wedding loops, fair weeks and Houston transfers.";
wh.vehicles[2].reason = "Houston delegations, airport legs and farm venues.";
wh.destinations[0].text = "The college's performing-arts center hosts the county's theatrical productions and concert seasons inside the campus blocks.";
wh.destinations[0].tip = "The college's lot takes a minibus at the arts hall, and the coach stages at the fairgrounds row on event nights.";
wh.destinations[1].text = "The courthouse square's shops, the river bridge's overlooks and the historic downtown's storefront row run the walking plan for the visiting blocks.";
wh.destinations[1].tip = "The square's parking stays free with the drop at the courthouse lawn, a walk of less than a block into the row.";
wh.destinationsHeading = "Top Charter Bus Destinations in Wharton";
wh.destinations.push({ name: "Wharton County Fairgrounds", text: "The fairgrounds' arenas and barns book the county's fall festival weeks and the year-round community events on the edge of town.", tip: "Event dates close the gate roads, so the written quote sets the gate time and the pickup corner with the fair board." });
wh.faqsHeading = "Wharton Charter Bus FAQs";
wh.faqs.push({ q: "When is the county fair?", a: "The fairgrounds' season weeks land in the fall calendar, with the gate row and the grandstand nights confirmed before the shuttle plan.", });
wh.premium = {
  heroLead: "The Colorado River county seat on the US-59 corridor: the college's performing-arts blocks, the fairgrounds' fall festival weeks and the farm venues' wedding season. We run the church retreats, school trips and Houston legs.",
  route: { to: "Wharton County Fairgrounds", toNote: "Event grounds", miles: "", time: "~6 min", via: "US-59 Business" },
};

const gr = get("tx/granbury");
gr.destinations[1].text += " The city park's boardwalk rows and the dam's walking path keep the lake hour indoors-free through the seasons.";
gr.destinations[2].tip += " The winery rows pair the safari day's afternoon on the same southern loop.";

const cy = get("tx/cypress");
cy.destinations[1].text += " The row's weekly free music nights fill the boardwalk's Friday and Saturday hours through the seasons.";
cy.destinations[2].text += " The park's racing calendar runs thoroughbreds through spring and the quarter horses into early summer.";
cy.heroIntro += " The suburb's lake keeps the waterline tables and the free weekend music, with the outlet center's brand floors a short freeway run apart.";

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("wharton + granbury + cypress enriched; total", data.length);
