// Differentiate Ellicottville NY vs Windham (similarity gate fix, Nov 12).
import { readFileSync, writeFileSync } from "node:fs";
const p = "data/city-pages.json";
const data = JSON.parse(readFileSync(p, "utf8"));
const e = data.find((c) => c.state === "ny" && c.slug === "ellicottville");
e.services[0] = {
  title: "Ski Weekend Transfers",
  text: "Buses run the US-219 corridor from the Buffalo airport and the southern suburbs all winter, with gear bays split across the vehicles and the village drop at Washington Street. Sunday-to-Thursday bookings can fold HoliMont into the plan while it runs public hours.",
  href: "/services/sports-team-transportation/",
};
e.faqs[1] = {
  q: "Is HoliMont open to everyone?",
  a: "Monday through Friday the slopes open to the public; weekends and peak holidays stay members-only. The written quote books the weekday so public groups stay inside those hours.",
};
e.faqs[3] = {
  q: "How many ski clubs can ride at once?",
  a: "Several buses run in convoy on one booking, with gear bays split across the vehicles and one coordinator timing the Washington Street drop.",
};
writeFileSync(p, JSON.stringify(data, null, 2));
console.log("Ellicottville differentiated");
