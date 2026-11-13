// Differentiate Penn Yan NY vs Interlaken (similarity gate fix, Nov 13):
// lean into the Keuka-only facts (1860 birthplace, the lake's crook circuit).
import { readFileSync, writeFileSync } from "node:fs";
const p = "data/city-pages.json";
const data = JSON.parse(readFileSync(p, "utf8"));
const e = data.find((c) => c.state === "ny" && c.slug === "penn-yan");
e.services[0] = {
  title: "Keuka Wine Trail Tours",
  text: "Keuka Lake is where American winemaking started in 1860, and its crooked Y shape means the full circuit returns to Penn Yan instead of crossing the lake twice. Six family wineries pour on the loop, timed to the reservations the group holds.",
  href: "/services/sightseeing-tour-bus/",
};
e.destinations[1] = {
  name: "Keuka Outlet Trail and Mills",
text: "The 6.8-mile walking and biking trail follows the Keuka Outlet past two waterfalls and the ruins of the mill race that powered the valley's industries.",
  tip: "Bike-and-wine combos work as one loop, with the bus meeting riders at the Seneca Lake end gate.",
};
e.faqs[2] = {
  q: "Do you handle rail-bike and trail groups?",
  a: "Yes. Rail-bike shifts and Outlet Trail walks slot into the morning, with the wine trail afternoon booked around the reservation times.",
};
writeFileSync(p, JSON.stringify(data, null, 2));
console.log("Penn Yan differentiated with Keuka-only facts");
