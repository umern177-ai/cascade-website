// CA artifact fix: Santa Ynez hero phrase + nearby items.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const sy = data.find((c) => c.state === "ca" && c.slug === "santa-ynez");
sy.heroIntro = sy.heroIntro.replace(
  /where seven hundred seventy wineries\? no, seventy wineries pour/,
  "where seventy-plus wineries pour"
);
sy.nearby.items = [
  { city: "Cayucos" },
  { city: "Monterey" },
  { city: "Los Angeles" },
];
writeFileSync(path, JSON.stringify(data, null, 2));
console.log("santa-ynez fixed; nearby:", sy.nearby.items.map(i=>i.city).join());
