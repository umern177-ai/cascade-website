// Differentiate Quogue + Wainscott (similarity gate fix, Nov 13).
import { readFileSync, writeFileSync } from "node:fs";
const p = "data/city-pages.json";
const data = JSON.parse(readFileSync(p, "utf8"));

const q = data.find((c) => c.state === "ny" && c.slug === "quogue");
q.faqs[2] = {
  q: "What makes Quogue different from the east-end villages?",
  a: "It kept its 19th-century scale: the historic district, the 300-acre refuge and the quiet Dune Road pass instead of a commercial strip. The shuttle plan follows the village's pace, not the traffic.",
};
q.destinations[1] = {
  name: "Quogue Wildlife Refuge",
  text: "Three hundred protected acres of pine barrens boardwalks and seven miles of trails, free and open daily with the nature center at the gate.",
  tip: "The refuge parking is small. Drop at the entrance gate and hold the bus on Old Country Road.",
};

const w = data.find((c) => c.state === "ny" && c.slug === "wainscott");
w.services[2] = {
  title: "South Fork Day Loops",
  text: "One vehicle covers the whole morning: the farm stands, the conservancy's gardens and the beach pass hour, with the vineyard tasting saved for the afternoon tent.",
  href: "/services/sightseeing-tour-bus/",
};
w.faqs[2] = {
  q: "Can we run a farm-stand morning?",
  a: "Yes. The stands and the conservancy gardens make a light morning loop before any beach or vineyard hour, with the cooler space in the bus.",
};
writeFileSync(p, JSON.stringify(data, null, 2));
console.log("Quogue + Wainscott differentiated");
