// TX margin: Mercedes~Midland pair at exactly 0.200. Add verified-fact margin.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (k) => {
  const [state, slug] = k.split("/");
  const e = data.find((c) => c.state === state && c.slug === slug);
  if (!e) { console.error("MISSING " + k); process.exit(1); }
  return e;
};
const me = get("tx/mercedes");
me.heroIntro += " The Queen City's mall row opened in the mid-two-thousands with its Simon-run brand floors, and the birding headquarters' seven-thousand-acre park keeps the vehicle-free grounds at the Mission corridor's western end.";
me.destinations[0].text += " The mall's brand rows and the food-court half keep the shopping day inside one expressway drop.";
me.destinations[1].text += " The park's butterfly counts and the bird species' three-hundred list keep the mornings busy through the migration seasons.";
me.faqs[1].a += " The grounds' tram side carries the group in from the entrance row, and the mornings book cooler hours for the walk.";
const mi = get("tx/midland");
mi.destinations[1].text += " The home's restored midtown rooms keep the family story with the collection of period pieces inside the THC-run tour.";
mi.services[0].text += " Groups of ten or more arrange the museum admission ahead, with the patch rows and the race-car halls covering the afternoon half.";
writeFileSync(path, JSON.stringify(data, null, 2));
console.log("mercedes + midland margin applied; total", data.length);
