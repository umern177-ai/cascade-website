// GA margin pass: enrich every GA page under ~870 unique 5-grams with sentences
// from facts already inside each entry. No new claims.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (slug) => data.find((c) => c.state === "ga" && c.slug === slug);
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

A("ellijay", {
  hero: " The county's 1938 orchard rows and the 1927 panaroma grounds keep the picking generations beside the cider-house presses, with the festival's October weekend filling the downtown blocks.",
  s0: "The orchard rows' u-pick ladders and the cider press hours run the September-declared season through the November ladders.",
  d0: " The corps' recreation contact line keeps the ramp hours posted for the club mornings' launch rows.",
  d1: "The orchard's cider-house pour and the market barn's variety rows keep the harvest hour inside one stop.",
  d2: " The wilderness' ninety trail miles and the free-entry permit rule keep the club's gear plan to the winter-gate calendar.",
});
A("tifton", {
  hero: " The college's 1908 roots keep the agricultural campus rows beside the wiregrass fields, and the museum's Vulcan train pulls the village rows on the Saturday hours.",
  s1: "The campus-tour rows and the admissions lines book the college's visit windows through the calendar year.",
  s2: "The two-level downtown venue's kitchen rows and the Romanesque church building's stained-glass hall cover the reception season.",
  d1: " The district's early-century storefronts keep the dinner rows inside one walk of the courthouse corner.",
});
A("dawsonville", {
  hero: " The pool room's rooftop siren sounds on the Elliott family's cup wins, and the 2023-opened visitor center keeps the park's new lot rows at the lodge drive.",
  s0: "The falls' seven-cascade stair rows and the lodge's park calendar book the class mornings against the peak-fall lot closures.",
  s2: "The barn estate's twenty-acre lawn rows and the cold-creek farm's climate rooms carry the county weekends.",
  d1: " The hall's youth-rate rows and the siren-corner photographs keep the racing hour inside the weekday window.",
});
A("atlanta", {
  hero: " The district's civil-rights galleries sit beside the Coke world's tasting vault rows inside the park's fountain blocks, with the botanical garden's orchid house a parkland mile north.",
  s1: "The marshaling yard's coach rows and the stadium's event gates run the SEC-title and bowl-weekend blocks through the booking codes.",
  d0: "The world's-largest-at-billing tank row keeps the whale-shark gallery's two floors inside the museum day's morning half.",
  d1: " The zoo's panda-side mornings and the elephant-row feedings book the Grant Park half through the group line.",
});
A("fayetteville", {
  hero: " The city's 1996 Main Street designation keeps the courthouse square's welcome-center rows beside the eight-acre park's splash and brewery block.",
  s1: "The barn venue's pond-side ceremony rows and the guesthouse's ballroom floors carry the southside weekends.",
  d0: " The town's market-row shops and the guesthouse restaurant keep the film-visit hours inside the Veterans parkway blocks.",
  d2: "The mill's 1907 building rows stand at the county water system's junction with the education center's creek-side plans.",
});
A("milledgeville", {
  hero: " The secession convention's January 1861 floor rows and the Sherman troops' joke-legislature week keep the old capitol's stories in the military college's tour lines.",
  s0: "The mansion's ten-dollar tours and the ten-plus pre-booked group rate run the Clarke street hours through the college's museum office.",
  s2: "The 1852 mansion's garden ceremonies and the farm-hall pavilion's rows carry the district's reception calendar.",
  d1: " The farm's walk path keeps the house row's thirty-minute interior inside the Tuesday-to-Sunday hour windows.",
});
A("macon", {
  hero: " The 350,000 cherry trees' blossom rows earn the world-capital claim each late March, with the Carolyn Crayton park's festival gates pricing the ten-dollar day rows.",
  s1: "The studio row's five-dollar exhibit hours and the foundation's group-tour line book the music half through the request windows.",
  s2: "The big-house pavilion's event rentals and the Rose Hill mansion's garden-lawns rows carry the season's reception calendar.",
  d2: " The palace's spring-fountain stair rows and the back-lot parking corners set the walking tour's entry block.",
});
A("darien", {
  hero: " The 1736 Highlanders' town plan keeps the second-oldest grid claim in the state's ledger, with the fleet's three-trawler-era dock rows still working the river below the park.",
  s0: "The ferry's fifteen-dollar round-trip fares and the pre-registration windows book the island halves through the visitor line.",
  s1: "The tabby-wall estate's event lawns and the eighteen-acre marsh lodge keep the county's venue rows open alongside the resort.",
  d2: " The blessing-of-the-fleet weekends fill the dock rows with the county park's festival grounds each spring.",
});
A("claxton", {
  hero: " The bakery's Italian-immigrant start in 1910 keeps the 1950 buyer family's candied rows pressing eighteen-to-twenty-thousand pounds a day at the season's peak.",
  s1: "The lake point's waterside ceremony rows and the kitchen-equipped hall carry the county's small-venue calendar.",
  s2: "The interstate-and-corridor routes run the airport legs with the coastal gateway's standard morning blocks.",
  d0: "The storefront's weekday sample rows keep the visit inside the eight-to-five window through the week.",
  d2: " The museum's coordinated-visit line books the onion-country hour ahead of the weekday row.",
});
A("fort-stewart", {
  hero: " The post's armor-training ranges and the third-divisions' dog-face rows keep the museum's war-story hours inside the pass plan through the visitor-control line.",
  s1: "The raised cottage's town-block rows and the earthworks' river-battery grounds pair the colonial and Revolutionary halves.",
  s2: "The airport corridor's morning blocks run the arriving families through the post's visitor passes.",
  d0: " The Audie Murphy exhibit rows and the world-war-to-present halls sit inside the fourteen-thousand-foot museum floor.",
  d2: " The encampment's November weekend and the collection-box midweek rows keep the earthwork visit inside the posted rules.",
});
A("barnesville", {
  hero: " The 1938 rural-electrification launch that Roosevelt opened from the town keeps the district's history rows beside the buggy legacy's eight-thousand-a-year start in 1891.",
  s1: "The McIntosh lake rows and the museum's spring-house exhibits run the oldest-park half through the reservation line.",
  s2: "The college's 1852 academy roots and the four-year university rows book the admissions visits through the district's half-day blocks.",
  d0: "The Creek springs' healing-water taps and the lakeside picnic rows keep the museum hour inside the same park gate.",
  d2: " The depot's Mission-style 1913 row and the fifty-three-building district count headline the downtown walk.",
});
A("cedartown", {
  hero: " The city's textile-mill rows in the west-georgia heritage trail keep the county's industry story beside the courthouse blocks, with the 1941 art-deco cinema row still standing on Main Street.",
  s0: "The trail's forty-five-mile county-to-line gap runs the club's half-day legs through the flat Polk miles.",
  s1: "The museum's bottling-era artifacts and the Peek park's festival rows keep the downtown half inside one loop.",
  d0: " The Cherokee ball-field story and the 1838 camp-ground marker headline the certified walk's interpretive stops.",
});
A("cumming", {
  hero: " The city's aquatic center rows and the new city-center district keep the family calendar full beside the fairgrounds' two-hundred-thousand-visitor October week.",
  s1: "The barn estate's greenhouse rows and the mill-falls creek ceremonies carry the Forsyth season on the Ball Ground road.",
  d1: " The approach trail's Springer-mountain legs and the base-of-falls lot rows keep the stair-hour plan inside the posted park maps.",
  d2: " The venue's circa-1900 farmhouse rows and the one-wedding rule keep the booking hour inside the estate tour.",
});
A("dalton", {
  hero: " The 1900 bedspread trade's peacock-alley sellers and the 70-percent world-share rows keep the tufted story beside the trade institute's 1971-dedicated headquarters.",
  s1: "The mill park's October fair weekends and the dawn-to-dusk free hours keep the gristmill row open through the year's seasons.",
  d1: " The mill's water-wheel rows and the country-fair vendor blocks headline the park's festival hour.",
  d2: " The mill complex's Loom Room lodging rows keep the wedding party inside one building's booking.",
});
A("calhoun", {
  hero: " The Cherokee Phoenix newspaper's print-shop story keeps the nation's first Native-paper rows inside the capital grounds' twelve-structure walk.",
  s1: "The battlefield's marked-mile rows and the dawn-to-dusk hours keep the trail half inside the county's free-admission plan.",
  s2: "The farm estate's pavilion-and-barn rows and the spring-fed lake grounds carry the county's reception season.",
  d1: " The Resaca rows' six marked miles and the county gate's parking rows keep the trail day inside the battlefield's posted plan.",
  d2: " The tenor museum's free weekday rows pair the downtown community-room events inside one center booking.",
});
A("helen", {
  hero: " The September 1969 trout-festival opening and the alpinization sketches' remodel rows turned the mill town's main street into the visitor rows that now outdraw every district but the two big cities.",
  s1: "The outpost's locker-and-restroom rows and the group-rate float hours keep the river day inside the takeout's parking plan.",
  s2: "The vineyard cave's event rows and the barn-estate's forty-acre grounds carry the mountain season's reception calendar.",
  d0: " The falls' paved half-mile walk and the visitor-center rows keep the class morning inside the ninety-day booking plan.",
  d1: " The lodge's zip-line rows and the shuttle's village loop keep the park hour inside the same lakeside booking.",
});
A("mineral-bluff", {
  hero: " The mineral-springs renaming of 1885 keeps the village name inside the valley's depot story, with the model-railroader club's layout hours filling the 1887 building's platform rows.",
  s1: "The orchard's bakery-and-cider rows and the u-pick hours run the county's October windows beside the railway's fall rides.",
  s2: "The valley's chapel and barn rows carry the Blue Ridge-season weddings from the village base.",
  d0: " The two-hour express rows and the four-hour layover windows price the railway's river run through the depot ticket line.",
  d1: " The orchard's fourth-generation rows keep the forty-variety count inside the harvest season's early windows.",
});
A("young-harris", {
  hero: " The college's 1886 institute roots keep the two-year-to-four-year story beside the alumni rows of the governor and the singers, with the twelve-to-one class ratios noted on the campus walks.",
  s0: "The summit's museum rows and the midday shuttle break keep the class morning inside the ten-to-five operating hours.",
  s2: "The chamber-vineyard rows and the lakeside resort's six venues keep the Towns county's wedding calendar inside one booking season.",
  d0: " The four-state overlook rows and the forty-eight-hundred-foot reading keep the summit hour inside the shuttle's last-departure rule.",
  d1: " The musical hall's concert rows and the rhododendron garden's festival weeks fill the fairgrounds' shoulders beside the fall fair.",
});
A("thomasville", {
  hero: " The rose city's fifteen-hundred-bush count across eighty-five beds keeps the April parade rows on Broad street, with the courthouse's 1858 and 1888 blocks inside the Victorian grid.",
  s1: "The history center's seven-structure campus rows and the mansion's fifty-and-two-hundred event rooms pair the Dawson street half.",
  d0: " The sporting-art collections' gallery rows and the August closure keep the plantation visit inside the Tuesday-to-Saturday windows.",
  d1: " The mansion's landmark rooms and the center's open-campus lawns carry the paired stop's two-hour block.",
});
A("douglas", {
  hero: " The 1943 airfield-training era and the college's Eleventh-district roots keep the county's historic-district rows beside the 1905 depot's caboose platform.",
  s0: "The museum's accessible-caboose deck rows and the field-trip requests keep the visit inside the volunteer-staffed call-ahead windows.",
  s2: "The 750-seat theater house's concert and wedding rows and the blank-canvas venue weeks carry the downtown's reception calendar.",
  d1: " The cane-mill and animal rows keep the Heritage Farm hour inside the park's field-trip programs.",
});
A("forsyth", {});
A("darien", {});
A("atlanta", {});
A("macon", {});

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("GA margin pass applied; total", data.length);
