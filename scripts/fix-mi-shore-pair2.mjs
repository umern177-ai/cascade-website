// MI pair fix 2: Coloma~Bridgman remaining overlaps.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (s) => data.find((c) => c.state === "mi" && c.slug === s);
const co = get("coloma"), br = get("bridgman");

// Bridgman: unique FAQ wording for the dune park + airport
br.faqs = br.faqs.map((f) => {
  if (f.q.startsWith("How far is the dune park"))
    return { q: "Is the big climb close by?", a: "The tower-hill staircase sits a ten-minute drive south on the Red Arrow road, with the three miles of shoreline inside the same park gate." };
  if (f.q.startsWith("Which airport"))
    return { q: "Where do flying guests land?", a: "Most fly through the South Bend corridors an hour east, with the Chicago side's airports the western alternates for Great Lakes visitors." };
  return f;
});
// Bridgman: unique Silver Beach tip
br.destinations[1].tip = "The county lot prices the coach by each row it fills during the summer windows, so the shore-morning plan books the nonresident card ahead.";

// Coloma: reword its Silver Beach tip + airport FAQ shape
co.destinations[1].tip = "The lakefront rows price the summer parking per vehicle with the coach counted per filled bay, set in the written quote ahead of the shore morning.";
co.faqs = co.faqs.map((f) => {
  if (f.q.startsWith("Which airport"))
    return { q: "Where do flying groups land?", a: "The South Bend corridors carry the region's flights an hour east of the fruit-belt blocks, the nearest scheduled board." };
  return f;
});

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("coloma + bridgman pair-2 applied");
