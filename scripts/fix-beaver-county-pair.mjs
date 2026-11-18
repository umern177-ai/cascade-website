// Differentiation: Monaca~Beaver PA pair at 0.212 (same research set, shared
// venue sentences). Monaca leans campus/banquet/Moraine; Beaver keeps its
// fort/courthouse/station identity. Copy changes only; no new facts.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));

const monaca = data.find((c) => c.state === "pa" && c.slug === "monaca");
const beaver = data.find((c) => c.state === "pa" && c.slug === "beaver");
if (!monaca || !beaver) { console.error("MISSING"); process.exit(1); }

// ---- MONACA: reword identity copy + replace shared destinations
monaca.heroIntro = "Monaca rebuilt itself from the 1840 steamboat town of Phillipsburg, renamed in 1892 for the Oneida chief Monacatootha, and its college campus holds the river bend at 1 Campus Drive. The banquet halls along Old Broadhead Road book the county's receptions and Pittsburgh's airport sits half an hour up the expressway. Cascade Charter Bus runs the campus runs, the banquet loops and the airport legs.";
monaca.services[0].text = "Graduations, orientations and the college's athletic calendar ride the river-bend blocks from the county inns.";
monaca.services[1].text = "Center Stage's in-house catering halls and the Monaca Turners' floor carry the receptions, with guest loops timed to the ceremony.";
monaca.services[2].text = "Pittsburgh International (PIT) sits 25 minutes southwest up the expressway, met at the terminal for arrivals.";
monaca.vehicles[0].reason = "Campus rows and banquet-hall corridors.";
monaca.vehicles[1].reason = "Graduation blocks and Pittsburgh legs.";
monaca.vehicles[2].reason = "Small receptions and airport runs.";
monaca.destinationsHeading = "Top Charter Bus Destinations near Monaca";
monaca.destinations[0].text = "The river-bend campus that anchors the borough, with the graduation rows and the athletics calendar marking the college year.";
monaca.destinations[0].tip = "The college side of Campus Drive keeps the event lots. The written quote confirms the row with the events office before the day.";
monaca.destinations[1].name = "Moraine State Park";
monaca.destinations[1].text = "The lake park's 42-mile shoreline east of the valley, the county's favorite outing water with the pontoon tours and the trail rows.";
monaca.destinations[1].tip = "The boathouse and the South Shore lots split the shoreline. Confirm the launch lot with the group before the lake morning.";
monaca.destinations[2].name = "Center Stage Weddings and Banquets";
monaca.destinations[2].text = "The full-service banquet hall on Old Broadhead Road, the reception anchor with in-house catering and the ceremony calendar to match.";
monaca.destinations[2].tip = "The hall keeps its own lot. Book the send-off return and the guest loop into one plan for the date.";
monaca.mapPins = ["CCBC, Monaca PA", "Moraine State Park, Portersville PA", "Center Stage Weddings & Banquets, Monaca PA"];
monaca.faqs[1].q = "Do you shuttle campus events?";
monaca.faqs[1].a = "Yes. Graduation, orientation and athletic days run hotel-to-campus loops with the lot row confirmed through the college.";
monaca.faqs[2].q = "Can the banquet and airport pair?";
monaca.faqs[2].a = "Yes. The airport arrivals and the banquet returns ride one plan along the expressway corridor.";
monaca.premium.heroLead = "The river-bend college town: CCBC's graduation rows at 1 Campus Drive, the Broadhead Road banquet halls and Pittsburgh's airport half an hour up the expressway. We run the campus shuttles, banquet loops and airport legs.";
monaca.premium.route.toNote = "Airport";
monaca.reviewChecks = [
  "Confirm CCBC lot row and event window with the college.",
  "Confirm Moraine launch lot assignment with the group leader.",
  "Owner: add one real Monaca job in your own words (1 enquiry came from here).",
];

// ---- BEAVER: reword to remove duplicated sentence shapes
beaver.heroIntro = "Beaver is the county seat laid out in 1792 on the Fort McIntosh ground where the river meets the Ohio, the first Continental Army post built north of the water in 1778 and the treaty field of 1785. Third Street's cupola courthouse fills the borough blocks, the restored railroad station books the events and Pittsburgh's airport rides twenty minutes from the riverfront. Cascade Charter Bus runs the heritage loops, the station weddings and the city legs.";
beaver.services[0].text = "The fort park, the courthouse square and the county history blocks carry the class and club itineraries.";
beaver.services[1].text = "The restored station's gardens and the Baden barn park hold the wedding season, with guest loops up from Pittsburgh arrivals.";
beaver.services[2].text = "Pittsburgh rides about forty minutes southeast and its airport twenty, the gateway pair for county arrivals.";
beaver.vehicles[0].reason = "Riverside drops and the heritage blocks.";
beaver.destinations[1].tip = "The village keeps Friday-to-Sunday hours in the open season, with admission posted and the ten-plus reservations booked ahead.";
beaver.destinations[2].tip = "The station's lot serves the hall. Confirm the caterer's load-in and the send-off return with the center.";
beaver.premium.heroLead = "The 1792 county seat on the fort's ground: the Continental Army's first post north of the Ohio, the rebuilt cupola courthouse and the restored station's event hall. We run the heritage loops and the city legs.";

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("monaca + beaver differentiated; total", data.length);
