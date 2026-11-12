// Differentiate Eldred NY vs Fallsburg (similarity gate fix, Nov 12): swap the
// shared casino beat for the Delaware River / Port Jervis corner.
import { readFileSync, writeFileSync } from "node:fs";
const p = "data/city-pages.json";
const data = JSON.parse(readFileSync(p, "utf8"));
const h = data.find((c) => c.state === "ny" && c.slug === "eldred");
h.heroIntro =
  "Eldred sits on the western edge of the Sullivan Catskills, where The Eldred Preserve keeps 600 acres, a private lake and the 28-room Bradstan Boutique Hotel. Bethel Woods waits down the road, the Delaware River rafting liveries run out of Port Jervis, and the mountain lodges of the upper Delaware fill the fall weekends. Cascade Charter Bus runs wedding blocks, concert nights and river days through the county.";
h.services[2] = {
  title: "Delaware River Rafting Days",
  text: "The western county's rafting liveries launch the Delaware at Port Jervis and Barryville. Shuttles cover the takeout parking, the gear runs and the return to the Preserve.",
  href: "/services/sightseeing-tour-bus/",
};
h.destinations[2] = {
  name: "Port Jervis and the Delaware River",
  text: "The river city at the New York corner: rafting liveries, the towpath trail and the riverfront parks where the three states meet.",
  tip: "Rafting takeouts sit downstream of the put-in. Confirm the livery's bus lot before the shuttle day is set.",
};
h.faqs[2] = {
  q: "Can you shuttle a rafting day on the Delaware?",
  a: "Yes. The liveries publish takeout times; the shuttle plan runs the put-in drop, the takeout pickup and the ride back to the Preserve as one loop.",
};
writeFileSync(p, JSON.stringify(data, null, 2));
console.log("Eldred differentiated: river angle replaces the casino beat");
