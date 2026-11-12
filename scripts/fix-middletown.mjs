// Differentiate Middletown NY vs Fallsburg (similarity gate fix, Nov 12):
// Middletown's route card switches to its own famous anchor, LEGOLAND NY.
import { readFileSync, writeFileSync } from "node:fs";
const p = "data/city-pages.json";
const data = JSON.parse(readFileSync(p, "utf8"));
const m = data.find((c) => c.state === "ny" && c.slug === "middletown");
if (m.premium) {
  m.premium.route = { to: "LEGOLAND New York Resort", toNote: "Resort park, Goshen", miles: "~6 mi", time: "~12 min", via: "Route 17M W" };
}
writeFileSync(p, JSON.stringify(data, null, 2));
console.log("Middletown route switched to LEGOLAND");
