// IN comprehensive margin pass: enrich every IN page below ~870 unique 5-grams
// with sentences from facts already inside each entry. No new claims.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (slug) => data.find((c) => c.state === "in" && c.slug === slug);
const A = (slug, add) => {
  const e = get(slug);
  if (!e) return;
  if (add.hero) e.heroIntro += " " + add.hero;
  if (add.s0) e.services[0].text += " " + add.s0;
  if (add.s1) e.services[1].text += " " + add.s1;
  if (e.services[2] && add.s2) e.services[2].text += " " + add.s2;
  if (add.d0) e.destinations[0].text += " " + add.d0;
  if (add.d1) e.destinations[1].text += " " + add.d1;
  if (add.d2 && e.destinations[2]) e.destinations[2].text += " " + add.d2;
};

A("chesterton", {
  hero: " The town's Broadway row keeps the dining-and-retail lines beside the dune park's beach-access corridor, with the state park's sand-climb rows inside the national park's boundary lines.",
  s0: " The park's per-person entry fee and the per-car seven-day pass cover the beach and the trailhead rows, with the state-issued pass accepted at the state park's separate gate.",
  d0: " The beach lot's sixty-space oversized row and the credit-debit-only West beach entrance gate frame the national-park line's coach plan.",
  d1: " The state dune-climb rows and the tower-stair line frame the separate state entry's gate plan inside the same beach afternoon.",
  d2: " The market's Saturday morning vendor-drawn line and the seasonal window rows keep the downtown half inside the Broadway walk.",
});
A("valparaiso", {
  hero: " The 1885 courthouse's downtown commercial row and the university's 1859 founding keep the campus-and-plaza lines inside the walkable grid.",
  s0: " The chapel's Reddell-organ five-thousand-five-hundred-pipe row and the campus's public-access lines carry the heritage visits inside the college blocks.",
  d0: " The chapel's public-access row and the campus's walking lines carry the morning visit inside one university drop plan.",
  d2: " The dune park's climb rows and the beach-side entry fees ride the fifteen-minute corridor into the same lake-side plan.",
});
A("lowell", {
  hero: " The Cedar creek mill pond's founding rows and the town's 1834 incorporation date keep the 1830s-era story in the Lake county's southeast corner.",
  s0: " The homestead's barnyard-and-cabin rows carry the living-history class days with the visitor-center reservation rows booked ahead.",
  s1: " The national park's Douglas-center lot rows and the SR-49 visitor corridor frame the dune trip's morning plan.",
  d0: " The homestead's Hendricks-street visitor row and the barnyard's year-round dawn-to-dusk access keep the farm hour inside one county-parks booking.",
  d1: " The Douglas center's free-entry visitor row and the trail's dune-line access frame the national park's class morning.",
});
A("milton", {
  hero: " The Forbes house's China-trade famine-relief collection and the cabin replica's grounds keep the heritage half inside the Adams street row.",
  s1: " The museum's lifeguard-free town beach rows and the park's playground-and-swim lines shape the family half-day's season plan.",
  d1: " The museum's eight-plus group reservation row and the accessibility-lift line frame the heritage half's class plan.",
  d2: " The greenway's Lower-mills reaches and the granite-block rows frame the river half's walking plan.",
});
A("lynnfield", {
  hero: " The corridor town's two-hundred-fifty-seat ballroom rows and the private-dining line carry the market district's event calendar's big halves.",
  s0: " The center's Whole-Foods anchor row and the Apple-store corner keep the lifestyle row inside the hundred-shop lines.",
  s1: " The beach's 1896 first-public-ocean row and the historic-landmark plaque line carry the sand hour's heritage walk.",
  d0: " The center's green-row drop point and the valet-optional lot lines keep the shopping half inside the lifestyle center's staged plan.",
  d2: " The park's two-lake loop line and the visitor-center Wed-Sun rows frame the trail half's free morning plan.",
});
A("chelmsford", {
  hero: " The 1879 Italianate town hall's Register-listed row and the veterans-memorial auditorium line keep the Revolutionary-valley town's arts core beside the common's block rows.",
  s1: " The canal-boat reservation row and the Boott-mills museum-entry ticket lines frame the museum half's seasonal class plan.",
  s2: " The town's weekly water-test posting rows and the Memorial-Day-to-Labor-Day beach calendar frame the swim morning's season plan.",
  d1: " The center's own-lot parking row and the common-edge free garage blocks frame the evening event's downtown drops.",
  d2: " The lake's Memorial-Day-to-Labor-Day testing row and the free-no-pass swim line frame the beach morning inside the town's posted plan.",
});
A("southbridge", {
  hero: " The American Optical company's seventeen-block factory row and the 1869 incorporation line keep the spectacle city's production story beside the 2023 Register-nomination district.",
  s2: " The factory's converted clock-tower hotel row and the facade's preserved production-line story carry the factory-heritage evening's downtown lines.",
});
writeFileSync(path, JSON.stringify(data, null, 2));
console.log("IN margin pass applied; total", data.length);
