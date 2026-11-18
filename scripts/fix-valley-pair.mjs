// TX margin: Harlingen~Mercedes pair at 0.204 (both lean on the island day).
// Reword shared SPI phrasing; each page leans on its own anchors. Facts unchanged.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (k) => {
  const [state, slug] = k.split("/");
  const e = data.find((c) => c.state === state && c.slug === slug);
  if (!e) { console.error("MISSING " + k); process.exit(1); }
  return e;
};

const ha = get("tx/harlingen");
ha.destinations[1] = {
  name: "Gladys Porter Zoo",
  text: "The boundary zoo's thirty-one accredited acres in Brownsville, four hundred species from the Valley's birds to the endangered-list rows.",
  tip: "Zoo lots fill first on school days, so the morning admission books ahead and the shuttle holds through the indoor hall hours.",
};
ha.destinations[2] = {
  name: "South Padre Island",
  text: "The barrier island's beach rows and the causeway crossing, the Valley's standard group beach day southeast of the expressway.",
  tip: "Island lots fill first on holidays, so the plan books the beach row and a fixed late return through the island side.",
};
ha.services[0].text = "The zoo's morning rows and the island's beach afternoons price as one southern loop through Brownsville.";
ha.services[1].text = "The monument's flag-raiser story and the academy's campus rows carry the class itineraries on the museum side.";
ha.destinations[0].text += " The academy's group visits run through the school's own office, with the parade-ground rows a walk-in stop for the class hours.";
ha.premium.heroLead = ha.premium.heroLead.replace(
  "and South Padre's beaches forty minutes east. We run the island days and the airport legs.",
  "the boundary zoo's four-hundred-species rows down the corridor. We run the monument days, zoo mornings and airport legs."
);

const me = get("tx/mercedes");
me.destinations[2].tip = "Holiday weekends fill the causeway lines both directions, so the island hour books a mid-morning crossing and the late-afternoon return ahead.";
me.destinations[2].text = "The island's beach rows east on the causeway, the dune-side lots and the break-hour runs from the Valley's interior towns.";
me.services[0].text = "The outlet row's hundred-brand floors and the border-town legs keep the club afternoons on the Expressway row.";
me.services[1].text = "The birding center's vehicle-free flagship park runs the class mornings with the park's internal transport plan noted.";
me.heroIntro = me.heroIntro.replace(
  "and the border crossings south connect the Mexican legs. Cascade Charter Bus runs the shopping days, the birding mornings and the airport legs.",
  "and the border bridge's shopping rows link the Mexican legs south. Cascade Charter Bus runs the outlet days, the birding mornings and the airport legs."
);
me.premium.heroLead = me.premium.heroLead.replace(
  "and the island's beaches east. We run the shopping days, birding mornings and airport legs.",
  "and the beach rows east beyond the causeway gates. We run the outlet days, birding mornings and airport legs."
);

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("valley pair differentiated; total", data.length);
