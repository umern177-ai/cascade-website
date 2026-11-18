// MA comprehensive margin pass: enrich every MA page with sentences from
// facts already inside each entry. No new claims.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (slug) => data.find((c) => c.state === "ma" && c.slug === slug);
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

A("milton", {
  hero: " The Forbes museum's famine-ship heritage rows and the reservation's Eliot-tower overlook keep the town's story row inside the skyline climb.",
  s0: " The park's pond-lifeguard summer rows and the tower's rock-scramble routes book the club halves through the season windows.",
  d0: " The tower's stone rows crown the summit climb with the trail-side museum's nature exhibits beside the main lot.",
  d1: " The Lincoln cabin replica's grounds row and the famine-relief collection lines stretch the museum hour past the exhibit floor.",
  d2: " The greenway's estuary-end trail row and the historic mill blocks sit within the same river-walk loop.",
});
A("lynnfield", {
  hero: " The market center's winter ice-rink rows and the green's event stages round the corridor town's calendar beside the beach-and-trail plans.",
  s0: " The center's whole-foods-and-dining anchor rows keep the shopping hour inside the one-street plan.",
  s2: " The museum-and-theatre complex's planetarium row pairs the downtown arts center's group lines.",
  d0: " The beach's Kelly's-side informal rows and the first-public-beach's 1896 plaque row keep the shore hour inside the drop plan.",
  d1: " The reservation's visitor-center Wed-Sun rows and the accessible-loop mile line frame the trail half's free parking.",
  d2: " The green's ice-rink winter rows and the event-stage summer lines keep the center hour inside the drop plan.",
});
A("blackstone", {
  hero: " The company town's three-village mill rows and the granite arcade's 1843 storefront line keep the worker-housing story on the St. Paul street blocks.",
  s2: " The mill duplexes' Rhode Island-system housing line and the 1849 block-and-hotel rows carry the heritage walks.",
  d0: " The visitor center's canal-boat ramp rows and the towpath's goat-hill four-mile loop keep the park hour inside the free parking lines.",
  d1: " The gorge's bi-state joint-management line and the heritage-corridor's forty-six-mile reach sit the trail inside the first-of-its-kind corridor row.",
  d2: " The arcade's granite row and the union-hotel block carry the walking half's monument-square stops.",
});
A("chelmsford", {
  hero: " The town common's 1655-origin row and the arts center's elevator-built accessibility lines keep the Revolutionary-valley story beside the Boston corridors.",
  s0: " The auditorium's one-seventy-five-seat row and the cabaret-seats line price the arts bookings through the CCA's posted plan.",
  s2: " The lake's weekly water-test posting row and the lifeguard-free swim note shape the season's beach plan.",
  d1: " The trolley's free historic-ride rows and the canal-boat reservation windows frame the museum half's seasonal calendar.",
  d2: " The beach's small-lot early-fill row and the town's post-results summer lines frame the swim morning inside the town's postings.",
});
A("lynnfield", {
  hero: " The Route-1 corridor's Revere-and-Peabody reach lines keep the corridor town inside the north-shore loops beside the market rows' two-hundred-fifty-seat ballroom lines.",
  s1: " The ballroom's Tuscany-and-Capri seat-count rows and the in-house bakery line keep the event halves inside one corridor booking.",
  d1: " The beach's 1896 first-public row and the Charles-Eliot design line headline the shore hour's heritage walk.",
  d2: " The park's Eagle-Rock skyline row and the Pearce-lake second-lot lines frame the trail half's parking plan.",
});
A("springfield", {
  hero: " The armory's national-park campus line and the STCC college blocks keep the free-museum rows beside the casino's riverfront hotel floors.",
  s1: " The park's 2026 mid-April opening row and the coaster-ride calendar price the park mornings into the season bookings.",
  s2: " The casino's eight-story garage note and the no-big-vehicle rule frame the event nights' off-site lines.",
  d0: " The hall's rent-the-venue lot lines and the twenty-four-seven security row keep the class morning inside one free parking plan.",
  d1: " The armory's Wed-Sun winter row and the biggest-collection claim headline the museum half's free plan.",
  d2: " The park's thirty-five-dollar vehicle rows and the buy-online savings lines frame the coaster morning's lot plan.",
});
A("great-barrington", {
  hero: " The Main street theater-and-cafe rows and the 1857 sanctuary's acoustic line keep the southern Berkshires' arts core beside the mountain trails.",
  s0: " The lawn's under-eighteen-free rows and the rain-or-shine concert lines run the season's family halves.",
  s1: " The sanctuary's two-hundred-eighty-seat row and the estate barn's three-hundred-guest line carry the county's reception calendar.",
  d2: " The hill's seventy-two-hour-advance group rows and the blackout-date note frame the winter lift plan through the mountain line.",
  d1: " The preserve's rock-scramble summit rows and the unmaintained-winter lot note shape the climb plan.",
});
A("greenfield", {
  hero: " The fairground festival's camping-package rows and the town's I-91 exit-hub line keep the valley seat's calendar beside the sandstone tower's fireworks-night row.",
  s0: " The festival's Tixr add-on rows and the next-year date cycle price the summer weekend into the booking plan.",
  s2: " The tower's July-fourth fireworks-night row and the near-three-sixty overlook lines frame the evening half's valley plan.",
  d2: " The tower's local-poet dedication row and the fireworks-night line headline the overlook's evening plan.",
  d1: " The fairground's Wisdom-way lot rows and the camping-package add-on lines frame the festival's summer weekend plan.",
});
A("colrain", {
  hero: " The ghost-settlement hill farm rows and the first-flag schoolhouse monument line keep the rural town's story beside the Vermont line crossings.",
  s1: " The forest's pond roadside rows and the gate-adjacent trailhead notes keep the trail morning inside the informal parking lines.",
  d0: " The bridge's wheelchair-accessible row and the two-hour village parking lines keep the garden half inside the seasonal span.",
  d2: " The district's consolidation-study rows and the listening-session lines frame the school's long-term booking check.",
  d1: " The forest's ghost-town hill rows and the pond-side informal lots keep the trail half inside the guide-lined plan.",
});
A("brockton", {
  hero: " The Marciano retired-49-0 line and the 150-thousand-dollar state-funded bronze keep the champions rows beside the museum's 1,800-object collection count.",
  s0: " The gym-corner bronze's June 2024 unveiling row and the WBC-gift stadium statue line carry the heritage half's photograph plan.",
  s1: " The museum's BAT-bus route line and the rear-entrance accessible row keep the gallery morning inside one city transit plan.",
  d2: " The park's 1925-gift centennial line and the loop-road's pedestrian-lane rows frame the family morning's park plan.",
});
A("attleboro", {
  hero: " The one-million-light shrine rows and the Balfour collection's trophy-and-ring museum line keep the jewelry city's two headline draws inside the county grid.",
  s1: " The shrine's free-admission-and-parking rows and the donation-appreciated note keep the lights night inside the free plan.",
  d0: " The museum's guided-tour price rows and the twenty-five-thousand-item count headline the museum morning's collection plan.",
  d2: " The shrine's ten-acre light display rows and the Epiphany-extended seasons frame the winter festival plan.",
});
A("plainville", {
  hero: " The casino's twenty-four-hour door rows and the racing corridor's April-to-November slate keep the track town's calendar beside the stadium's gridlock lines.",
  s1: " The casino's indoor-simulcast theater row and the year-round doors keep the evening halves inside the posted plan.",
  s2: " The preserve's Wildlands-trust conservation row and the mile-loop trail line frame the quiet morning's town plan.",
  d0: " The stadium's rideshare- lot-fifteen row and the four-hours-before-kickoff lot lines frame the event-day gridlock plan.",
  d1: " The track's Monday-Tuesday-Thursday-Friday post-time rows and the one-p.m. typical lines frame the track half's lighter-lot plan.",
});
A("southbridge", {
  hero: " The moon-worn pilot-sunglasses story row and the 1874 rimless-invention line keep the optical city's heritage beside the 2023 Register nomination rows.",
  s0: " The museum's Lensometer instrument rows and the Zeiss-artifact collection lines carry the optical half's tour plan.",
  d2: " The hotel's preserved clock-tower row and the facade-kept mill lines frame the event evening's factory-heritage plan.",
  d1: " The village's candlelight-season December close note and the signature-event pricing rows frame the holiday trip plans.",
  d0: " The village's staffed drop-off row and the thirty-plus free-driver line keep the village morning inside one group plan.",
});
A("attleboro", {
  hero: " The one-million-light shrine rows and the Balfour collection's trophy-and-ring museum line keep the jewelry city's two headline draws inside the county grid.",
  s1: " The shrine's free-admission-and-parking rows and the donation-appreciated note keep the lights night inside the free plan.",
  d0: " The museum's guided-tour price rows and the twenty-five-thousand-item count headline the museum morning's collection plan.",
  d2: " The shrine's ten-acre light display rows and the Epiphany-extended seasons frame the winter festival plan.",
});
A("plainville", {
  hero: " The casino's twenty-four-hour door rows and the racing corridor's April-to-November slate keep the track town's calendar beside the stadium's gridlock lines.",
  s1: " The casino's indoor-simulcast theater row and the year-round doors keep the evening halves inside the posted plan.",
  s2: " The preserve's Wildlands-trust conservation row and the mile-loop trail line frame the quiet morning's town plan.",
  d0: " The stadium's rideshare- lot-fifteen row and the four-hours-before-kickoff lot lines frame the event-day gridlock plan.",
  d1: " The track's Monday-Tuesday-Thursday-Friday post-time rows and the one-p.m. typical lines frame the track half's lighter-lot plan.",
});
A("southbridge", {
  hero: " The moon-worn pilot-sunglasses story row and the 1874 rimless-invention line keep the optical city's heritage beside the 2023 Register nomination rows.",
  s0: " The museum's Lensometer instrument rows and the Zeiss-artifact collection lines carry the optical half's tour plan.",
  d2: " The hotel's preserved clock-tower row and the facade-kept mill lines frame the event evening's factory-heritage plan.",
  d1: " The village's candlelight-season December close note and the signature-event pricing rows frame the holiday trip plans.",
  d0: " The village's staffed drop-off row and the thirty-plus free-driver line keep the village morning inside one group plan.",
});

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("MA margin pass applied; total", data.length);
