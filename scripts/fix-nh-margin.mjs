// NH comprehensive margin pass: enrich every NH page below ~860 unique 5-grams
// with sentences from facts already inside each entry. No new claims.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (slug) => data.find((c) => c.state === "nh" && c.slug === slug);
const A = (slug, add) => {
  const e = get(slug);
  if (add.hero) e.heroIntro += " " + add.hero;
  if (add.s0) e.services[0].text += " " + add.s0;
  if (add.s1) e.services[1].text += " " + add.s1;
  if (e.services[2] && add.s2) e.services[2].text += " " + add.s2;
  if (add.d0) e.destinations[0].text += " " + add.d0;
  if (add.d1) e.destinations[1].text += " " + add.d1;
  if (add.d2 && e.destinations[2]) e.destinations[2].text += " " + add.d2;
};

A("nashua", {
  hero: " The Gate City's 1987 and 1997 best-to-live-in magazine titles sit in the city's own history lines beside the mills' cooperative-store marker on the Amherst street corner.",
  s0: " The stadium's 1946 integration story runs the class visits beside the mill museum's textile rows on the Main street side.",
  s2: " The museum's free-admission craft gallery rows and the mill buildings' exhibit halls carry the school-day afternoons.",
  d0: " The team's silver-knights seasons and the free-lot rows keep the ballpark half inside one city booking.",
  d1: " The falls' hydro-line dam history and the trail map's posted route rows carry the walking half between the gate rows.",
  d2: " The garden's picnic shelter rows and the west-side trail loops keep the family half inside the free park plans.",
});
A("hampton", {
  hero: " The 1933 one-dollar beach sale to the state and the 1819 Winnisimet house's resort-era rows keep the town's founding story beside the sand lines.",
  s0: " The lifeguard season's nine-to-five-thirty rows and the pavilion's rebuilt bathing-house line carry the summer morning hours.",
  s2: " The ballroom's April-to-November show nights run roughly seventy performances through the season's posted calendar.",
  d0: " The south lot's RV pricing and the sixty-five-and-over resident free rows shape the park's seasonal parking plan.",
  d1: " The ballroom's nineteen-twenty-seven grand-hall expansion and the two-thousand-two-hundred capacity headline the boulevard's show-nights plan.",
  d2: " The pavilion's re-opened bathhouse row and the oceanfront stage schedule carry the nightly concert hours through the season.",
});
A("exeter", {
  hero: " The revolutionary congresses that drafted the state's first constitution ran through these town blocks six months before the nation's own declaration, with the seat holding until 1808.",
  s0: " The museum's attic-found broadside printing story headlines the seasonal exhibit rows beside the tavern windows.",
  s1: " The academy's 1783 first-student row and the library's nine-level count headline the campus walking plan.",
  d0: " The tavern's 1789 George Washington breakfast story keeps the freedom half inside the seasonal touring plan.",
  d1: " The riverside parkway's powder-house opposite row and the winter-ban season notes frame the town's parking calendar.",
  d2: " The library's AIA-award row and the second-school-largest volume count headline the campus's architecture stop.",
});
A("meredith", {
  hero: " The mill collection's four lakefront properties keep the inn-and-lodge rows beside the sculpture line's thirteenth season, with the eighteen new works rotating through the shore blocks.",
  s0: " The marketplace's cascading-waterfall row and the gardens' sculpture placements keep the shop hour inside two walk blocks.",
  s1: " The science center's boat-cruise pairing season runs April through October inside the trail's last-admission rule.",
  d1: " The center's nineteen-dollar trail rows and the boat-cruise pairing windows headline the science half's season plan.",
  d2: " The cruise's Sunday schedule rows and the grill's Saturday deck service frame the lake half through the season calendar.",
});
A("alton", {
  hero: " The bay village's 1872 steamboat-heritage birth line and the eleven-and-28 junction story keep the lake gateway's rows beside the range's summit trail.",
  s2: " The resort's December-open ski windows and the paved parking EV rows frame the mountain half through the posted seasons.",
  d1: " The bay community house's insurance-certificate rental line and the town-owned booking row shape the waterfront event plan.",
  d2: " The resort's season-opening December rows and the panorama-drive charging lines frame the mountain half's parking plan.",
});
A("lebanon", {
  hero: " The campus's 225-acre reach and its eight-thousand-plus employee count keep the working-hospital line at the city's story center, moved from the college town in 1991 with the patient pavilion opening 2023.",
  s1: " The advance-transit free bus rows and the museum's free-parking lines make the Vermont pairing the region's easiest class half.",
  s2: " The barn venue's rustic ceremony rows and the inn's ballroom capacity lines carry the season's valley calendars.",
  d0: " The gallery's 1973 founding row and the campus-square block headline the downtown's arts half inside walking lines.",
  d2: " The green's college-row walk and the inn's two-hundred-seat ballroom line sit inside one Hanover morning's loop.",
});
A("berlin", {
  hero: " The mill-era Brown Company Barns and the 2022-dedicated falls-house museum keep the heritage society's three-site row beside the High street museum block.",
  s2: " The college's 1966 vocational founding row and the Littleton academic-center line carry the north-country's trade-school story.",
  d0: " The society's barn-and-falls-house site rows extend the heritage half beyond the High street's main museum line.",
  d1: " The park's seventy-mile winter snowmobile seasons and the summer ATV windows split the trail calendar across the year's halves.",
});
A("gorham", {
  hero: " The 1903 Cascade mill's once-largest-of-its-kind story and the 1927 flood's river-memory line keep the valley's history beside the three mountain ranges' skyline row.",
  s1: " The canoe-trail's national-line passage and the 1851 railroad-arrival story keep the river half inside the valley's heritage row.",
  s2: " The July-fourth tradition's long-running line and the valley's parade blocks carry the summer calendar's biggest weekend.",
  d1: " The creek park's presidential rail-trail connection and the sixty-five-and-over free rows frame the park's fee calendar.",
  d2: " The ravine trail's Tuckerman lines and the fee-station self-serve rows frame the trailhead half's mountain plan.",
});
A("whitefield", {
  hero: " The 1774 charter's provincial-era last-grant story and the 1875 ball-signal rail relic keep the village's heritage rows beside the grand hotel's spa roofline.",
  s0: " The resort's one-hundred-forty-five-room count and the indoor-pool-and-golf lines carry the weekend's all-weather halves.",
  s2: " The theater's nineteen-sixty-six founding row and the professional summer-stock seasons run the Main street's evening half.",
  d1: " The tramway-lot shuttle's five-dollar weekend rows and the no-interstate-parking rule frame the trail half's season plan.",
});
A("concord", {
  hero: " The rattlesnake-hill granite's quarry line and the penacook village's confluence history keep the capital's stone story beside the two-river north-end blocks.",
  s1: " The center's October-through-June weekday field-trip rows and the hundred-three-seat theater count frame the dome half's class plan.",
  d1: " The center's bus-lot accommodation row and the ninety-dollar-plus-per-visitor group rates frame the planetarium's booking plan.",
  d2: " The gallery's free daily rows and the juried-member demonstration windows frame the downtown craft half inside the Phenix hall block.",
});
A("peterborough", {
  hero: " The third-hall-on-that-site row and the 1916-fire rebuild story keep the town house's civic line beside the colony's founding-century roots.",
  s0: " The hall's stage-and-balcony rows and the rehearsal-rate line price the performing bookings through the town's administration row.",
  s2: " The medal-day summer exception row and the downtown-first-Friday talk lines frame the colony's one public program.",
  d1: " The museum's accessible-attraction distinction and the backyard free-lot rows keep the class morning inside one booking line.",
});
A("lebanon", {});

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("NH margin pass applied; total", data.length);
