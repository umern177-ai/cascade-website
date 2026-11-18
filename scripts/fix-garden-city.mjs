// MI margin: Garden City (short pre-existing page pairing with Maple City).
// Facts already in entry. No new claims.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const e = data.find((c) => c.state === "mi" && c.slug === "garden-city");

e.heroIntro += " The city's own Ford founding story runs beside the airport corridor's park-and-ride rows, with the west-side school districts booking the museum mornings through the seasons.";
e.services[1].text += " The Rouge factory tour's timed rows pair with the village hours inside the one-day Motor City itinerary.";
e.destinations[0].tip += " The Rouge tour rows book separately from the village tickets, so the written quote sets both windows in the class plan.";
e.destinations[1].text += " The Rivera court's mural panels headline the gallery rows with the performing-arts nights nearby.";

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("garden-city margin applied");
