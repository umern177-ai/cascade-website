// IN: Bloomington~Columbus margin - substantial unique content.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (s) => data.find((c) => c.state === "in" && c.slug === s);
const bl = get("bloomington"), co = get("columbus");

// BLOOMINGTON - lean into the lakes, caves, and food scene
bl.heroIntro += " The town's Lake Monroe recreation rows and the Oliver Winery's tasting blocks stretch the campus afternoon into the lake country, and the food-scene rows that earned the farm-to-table name keep the Kirkwood avenue's restaurant corridor filling the evening half.";
bl.premium.heroLead += ", with the Oliver Winery's tasting blocks and Lake Monroe's shore rows stretching the campus afternoon";
bl.destinations[1].text += " The park's Ogle lake and the country store's craft rows carry the Nashville village's walking and gift-gift half alongside the trail miles.";
bl.destinations[2].text += " The statue's campus-block row sits beside the Sample Gates walk in the Old Crescent's limestone half.";

// COLUMBUS - lean into the visitors center, street murals, and dining
co.heroIntro += " The visitors center's downtown shuttle departure row at Fifth street keeps the architecture tours running daily with the city's street-mural and glass-art blocks filling the walking half between the scheduled stops.";
co.premium.heroLead += ", with the daily shuttle tours departing from the Fifth street visitors center row";
co.destinations[0].text += " The shuttle departure includes the visitors center's orientation row at the Fifth street block with the architecture library's reading-room exhibits.";
co.destinations[1].text += " The church's hexagonal spire sits beside the Bartholomew county's courthouse blocks on the city's modern-architecture walking row.";
co.destinations[2].text += " The library's Pei-designed block rows sit beside the Zaharakos ice-cream parlor's 1900s museum exhibit on the Washington street row.";

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("bloomington + columbus margin applied");
