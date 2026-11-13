// Differentiate Wainscott NY vs Rye (similarity gate fix, Nov 13).
import { readFileSync, writeFileSync } from "node:fs";
const p = "data/city-pages.json";
const data = JSON.parse(readFileSync(p, "utf8"));
const w = data.find((c) => c.state === "ny" && c.slug === "wainscott");
w.services[1] = {
  title: "Georgica and Estate Weddings",
  text: "The pond-side estates and the Sagaponack barn venues take the ceremonies, with guest blocks arriving on the Jitney and met at the village stops by the waiting van.",
  href: "/services/wedding-transportation/",
};
if (w.premium && w.premium.heroLead) {
  w.premium.heroLead = w.premium.heroLead.replace(
    "We run the tasting shuttles and the wedding blocks.",
    "We run the vineyard shuttles down the corridor and meet the Jitney arrivals."
  );
}
w.destinations[1] = {
  name: "Wainscott and Town Line Beach",
  text: "The hamlet's quiet sand sits below the estate lanes between Georgica Pond and the Sagaponack line, the low-key side of the South Fork.",
  tip: "Town passes apply on summer days. Confirm the pass holder with the town office before the schedule locks.",
};
writeFileSync(p, JSON.stringify(data, null, 2));
console.log("Wainscott differentiated vs Rye");
