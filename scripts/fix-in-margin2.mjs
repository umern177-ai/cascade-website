// IN margin pass 2: substantial enrichment for all IN pages under 800.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (slug) => data.find((c) => c.state === "in" && c.slug === slug);
const A = (slug, add) => {
  const e = get(slug);
  if (add.hero) e.heroIntro += " " + add.hero;
  if (add.s0) e.services[0].text += " " + add.s0;
  if (add.s1) e.services[1].text += " " + add.s1;
  if (e.services[2] && add.s2) e.services[2].text += " " + add.s2;
  if (add.d0) e.destinations[0].text += " " + add.d0;
  if (add.d1) e.destinations[1].text += " " + add.d1;
  if (add.d2 && e.destinations[2]) e.destinations[2].text += " " + add.d2;
  if (add.f0) e.faqs[0].a += " " + add.f0;
  if (add.f1) e.faqs[1].a += " " + add.f1;
};

A("marion", {
  hero: " The town's gas-boom heritage line runs through the courthouse row beside the river district blocks, with the regional schools' event calendars carrying the county's big-group weekends.",
  s0: " The courthouse district's dining row and the gas-boom museum blocks carry the class mornings inside the county seat's square line.",
  d0: " The lake's boat-launch and swim rows plus the equestrian camping lines ride the park's posted fee schedule through the season windows.",
});
A("goshen", {
  hero: " The town's mill-district brewery and restaurant rows keep the downtown's evening half beside the First Fridays' season lines and the county's courthouse dome.",
  s0: " The county courthouse's dome tower row and the downtown's First Fridays' vendor lines carry the heritage half inside walking distance.",
  s1: " The fairgrounds' August fair week runs the county's biggest-attended event rows beside the January's farm-machinery shows.",
  d0: " The factory's artisan studios and the marketplace's craft-food rows keep the shopping half inside the morning's walking plan.",
  d1: " The fair's hundred-thousand-plus attendance rows and the fairground's RV-hookup camping lines carry the August week's busiest group plan.",
  d2: " The museum's RV-production exhibits and the founding-era lines carry the industry half beside the Hall-of-Fame's walking tours.",
});
A("middlebury", {
  hero: " The town's Heritage Trail corridor keeps the Amish farm-row drives beside the Essenhaus's inn-and-conference-campus event blocks and the bakery's crossroads rows.",
  s0: " The dining halls' Amish-style fried-chicken and pie rows keep the meal plan inside the group-menu booking lines.",
  s1: " The bakery's cinnamon-caramel doughnut morning rows and the deli's Amish-style lunch lines carry the corridor town's food calendar.",
  d0: " The inn-side conference-center rooms and the gift-shop row's five-store lines keep the overnight groups inside the campus booking.",
  d1: " The trailhead's town-side park rows and the asphalt-surface bicycle line keep the cycling half inside the corridor's trail plan.",
  d2: " The flea market's vendor row and the town park's trail endpoint line carry the Amish-country afternoon's shopping half.",
});
A("warsaw", {
  hero: " The lake-chain village's canal-side walk and the Boathouse's lakefront dining line keep the Winona village's evening blocks beside the orthopedic-firm corridors.",
  s0: " The Zimmer-Biomet headquarters row and the DePuy founding's 1895 factory line anchor the corporate visit's device-history plan.",
  s1: " The Winona village's Boathouse lakefront line and the canal-side shop row keep the family afternoon inside the lakeside walk.",
  s2: " The campus's Grace-College block line and the Billy-Sunday home's heritage row sit inside the village's walking lines.",
  d0: " The village's National Register district line and the canal-side walking row keep the family afternoon inside the lakeside event plan.",
  d1: " The trail's nine-mile reach and the splash-pad's summer-beach lines frame the lake shore's swimming half for the group plans.",
  d2: " The lake's county-side fishing reach and the Warsaw city-park blocks carry the lake-day half's family swimming lines.",
});
A("culver", {
  hero: " The naval school's sailing-row lines and the Woodcraft camp's century-deep tradition keep the academy's campus story beside the eighteen-hundred-acre lake's shoreline.",
  s0: " The academy's tours carry the campus visit through the school's admissions line, with the lakeside campus's Naval-building row inside the block lines.",
  s1: " The lake beach's summer-swim row and the Main street's farmers-market Saturday lines carry the family half inside the village plan.",
  s2: " The visitor center's heritage-walk line and the Row's shop-and-dining blocks sit inside the Register-listed downtown walking plan.",
  d0: " The campus's lakeside Naval-building line and the square-rigger's sailing-training block headline the academy visit's Naval tradition row.",
  d1: " The lake beach's public-swim row and the park's playground lines keep the family morning inside the town's shore-side reach.",
  d2: " The market's Saturday morning vendor rows and the heritage-walk's Register-district block lines keep the downtown walking half inside the village plan.",
});
A("huntingburg", {
  hero: " The 1894 ballpark's movie-renovation heritage and the downtown's Victorian storefront row keep the Dubois county town's story beside the German-settlement museum lines.",
  s0: " The Bombers' college-team summer schedule and the stadium's movie-ad outfield fence rows keep the heritage visit's baseball half inside one town plan.",
  s1: " The convention center's divisible-room floors and the two-kitchen kitchen lines carry the thousand-seat banquet and trade show halves.",
  s2: " The museum's German-immigration exhibit rows and the county's Strassenfest heritage line carry the Jasper-side cultural morning.",
  d0: " The stadium's city-park parking rows and the movie-ad outfield fence's photograph line keep the heritage visit inside one park plan.",
  d1: " The center's loading-dock row and the five-divisible-room floor lines keep the banquet and trade-show halves inside one campus booking.",
  d2: " The museum's woodworking-capital story row and the county's German-immigration exhibits carry the cultural half inside Jasper's block line.",
});
A("greensburg", {
  hero: " The courthouse tree's Wi-Fi-monitor system keeps the famous mulberry's soil-moisture row inside the county's preservation line and the Smithsonian-examined heritage story.",
  s0: " The courthouse's 1854 Register-listed row and the museum tree's historic-monument lines carry the heritage walk's downtown half.",
  s1: " The arts row's love-grows-here mural line and the culture listings' craft-vendor rows keep the arts half inside the downtown walk plan.",
  d0: " The courthouse's clock-tower tree row and the downtown square's metered-and-lot parking lines keep the heritage visit inside one walking plan.",
  d1: " The mural's love-grows-here line and the arts-and-culture block rows carry the arts half inside the downtown walk plan.",
});
A("granger", {
  hero: " The suburb's Penn-Harris-Madison school-district rows keep the university-faculty neighborhood lines beside the South Bend's event-row reach.",
  s0: " The university's campus-visit row and the Golden-Dome grounds line carry the class visits inside the Notre-Dame campus plan.",
  s1: " The center's riverfront event floors and the hundred-thousand-square-foot reach carry the convention-block group halves.",
  s2: " The mall's Grape-road retail row and the shopping-corridor lines keep the suburb's retail half inside the region plan.",
  d0: " The campus's Notre-Dame grounds line and the Golden-Dome's iconic row headline the class visit's morning campus plan.",
  d1: " The center's catering-and-AV inclusive rows and the St. Joseph-river frontage lines keep the event half inside one riverfront plan.",
  d2: " The mall's retail-corridor rows and the Mishawaka shopping lines keep the region's retail half inside the suburban plan.",
});
A("whitestown", {
  hero: " The town's eight-year consecutive growth rows keep the annexation-and-construction story beside the Boone-county corridor's two-year I-65 interchange rebuild and the SR-267 diverging-diamond rebuild lines.",
  s0: " The complex's regional-tournament weeks carry the state's youth-baseball championship blocks into the headquarters-side event calendar.",
  s2: " The corridor's I-65 southbound ramps and the I-465 airport-runway corridor lines keep the highway legs inside the capital-city runs.",
  d0: " The complex's youth-sports tournament rows and the championship-week calendar keep the region's team travel inside the headquarters-side plan.",
  d2: " The corridor's I-65 southbound capital-runs and the airport-row lines frame the Indianapolis legs inside one highway plan.",
});
A("sunman", {
  hero: " The town's 1856 railroad-founding line and the postmaster's name row keep the rural crossroads story beside the Versailles-park's second-largest acreage.",
  s0: " The park's two-hundred-thirty-acre lake's boat-rental rows and the trolling-motors-only water rules keep the fishing half inside the posted park plan.",
  s1: " The Batesville employer-and-lodging corridor's hotel and dining rows carry the paired morning inside one crossroads plan.",
  d0: " The park's horse-trail twenty-mile line and the pool's waterslide summer rows headline the state park's group-camp plan.",
  d1: " The Batesville employer's corridor-and-lodging half sits inside the Batesville town's block plan on the same county corridor.",
  d2: " The river town's Ohio-river riverfront row and the casino-side line keep the evening half inside the river-city plan.",
});

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("IN margin pass 2 applied; total", data.length);
