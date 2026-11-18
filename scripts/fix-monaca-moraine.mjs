// Differentiation: Butler~Monaca PA pair (Monaca's new 2nd destination reused
// Butler's Moraine State Park text). Swap to Monaca's own riverfront item and
// reword. Facts from Monaca's research set (Bridgewater/Rochester riverfronts;
// Beaver Valley Power Station context). No new venue claims.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const mon = data.find((c) => c.state === "pa" && c.slug === "monaca");
if (!mon) { console.error("MISSING"); process.exit(1); }

mon.destinations[1] = {
  name: "Bridgewater and Rochester Riverfronts",
  text: "The twin riverfronts two miles up the Ohio, where the Bridgewater blocks' dining row and Rochester's old-business front face the river bend.",
  tip: "The riverfront streets keep short-stay curbs. The bus holds the Bridgewater side's outer row and walks the group to the blocks.",
};
mon.destinationsHeading = "Top Charter Bus Destinations near Monaca";
mon.mapPins = ["CCBC, Monaca PA", "Bridgewater Riverfront, Bridgewater PA", "Center Stage Weddings & Banquets, Monaca PA"];
// small rewordings to drop residual shared phrases with Butler
mon.heroIntro = mon.heroIntro.replace(
  "and its college campus holds the river bend at 1 Campus Drive.",
  "with the college campus holding the river bend at 1 Campus Drive and the riverfront blocks of Bridgewater and Rochester two miles up the water."
);
mon.services[1].text = mon.services[1].text.replace(
  "Center Stage's in-house catering halls and the Monaca Turners' floor carry the receptions, with guest loops timed to the ceremony.",
  "The Broadhead Road halls book the receptions, with Center Stage's in-house catering and the Turners' floor carrying the guest loops to the hour."
);
mon.premium.heroLead = mon.premium.heroLead.replace(
  "CCBC's graduation rows at 1 Campus Drive, the Broadhead Road banquet halls and Pittsburgh's airport half an hour up the expressway.",
  "CCBC's graduation rows at the river bend, the Broadhead Road banquet halls and the twin riverfronts two miles up the water."
);
writeFileSync(path, JSON.stringify(data, null, 2));
console.log("monaca 2nd destination swapped; total", data.length);
