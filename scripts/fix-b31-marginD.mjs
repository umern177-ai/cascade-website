// Batch31 margin round 3: old short pages (al/albertville, tn/union-city, ok/sapulpa, vt/manchester-center, mo/bethany, co/larkspur, tn/sewanee, ca trio) + OK new top-up.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (st, sl) => data.find((c) => c.state === st && c.slug === sl);
const add = (st, sl, key, val) => {
  const e = get(st, sl);
  if (!e) return;
  try {
  if (key === "h") e.heroIntro += " " + val;
  else if (key === "s0") e.services[0].text += " " + val;
  else if (key === "s1" && e.services[1]) e.services[1].text += " " + val;
  else if (key === "s2" && e.services[2]) e.services[2].text += " " + val;
  else if (key === "d0" && e.destinations[0]) e.destinations[0].text += " " + val;
  else if (key === "d1" && e.destinations[1]) e.destinations[1].text += " " + val;
  else if (key === "d2" && e.destinations[2]) e.destinations[2].text += " " + val;
  else if (key === "f0") e.faqs[0].a += " " + val;
  else if (key === "f1" && e.faqs[1]) e.faqs[1].a += " " + val;
  else if (key === "f2" && e.faqs[2]) e.faqs[2].a += " " + val;
  else if (key === "f3" && e.faqs[3]) e.faqs[3].a += " " + val;
  } catch (err) { console.log("SKIP " + st + "/" + sl + " " + key + ": " + err.message); }
};

// AL Albertville
add("al","albertville","h","The Sand-Mountain Chicken-and-Egg festival's June rows and the Albertville-Museum's heritage blocks keep the county's farm story beside the Alabama-Poultry-Capital-claimed corridor lines.");
add("al","albertville","s0","The festival's June-week market and concert rows carry the county's biggest crowds through the Sand-mountain weekend gates.");
add("al","albertville","d0","The museum's Albertville-Sand-Mountain exhibit rows carry the heritage halves beside the downtown blocks.");
add("al","albertville","d1","The Space-and-Rocket exhibit rows carry the Huntsville-side science halves on the 40-minute corridor.");
add("al","albertville","f0","The US-431-and-I-565 corridors ride the Huntsville routes with the Space-Center drop halves.");
add("al","albertville","f0","The poultry-capital claim rides the Sand-Mountain region lines, with the county farm heritage beside the festival row.");
// TN Union City
add("tn","union-city","h","The Obion-county seat's 1904-register courthouse rows and the Rails-and-Trails museum blocks keep the county story beside the Reelfoot-gate corridor lines.");
add("tn","union-city","s0","The 71-acre park's planetarium and science rows carry the school group halves through the education lines.");
add("tn","union-city","d0","The 94,000-plus-square-foot park's dinosaur and railroad rows carry the discovery halves beside the parking gates.");
add("tn","union-city","d1","The earthquake-formed lake's cypress-boardwalk and state-park rows carry the wetland halves through the Reelfoot lines.");
add("tn","union-city","f0","The Nashville routes ride the two-and-a-half-hour corridors, with Memphis's Highway-51 lines beside the state route.");
add("tn","union-city","f1","The science-park field-trip rows book through the education lines, so the class day confirms the planetarium windows ahead.");
// OK Sapulpa
add("ok","sapulpa","h","The Creek-Nation tribal heritage keeps the Bristow-corridor story beside the Route-66 line, with the Heartland-route history anchoring the mother-road half.");
add("ok","sapulpa","s0","The Route-66 village's neon-and-mural exhibit rows carry the mother-road halves beside the downtown gates.");
add("ok","sapulpa","d0","The Route-66-Historical village's museum and photo-op rows carry the road-trip halves beside the highway gates.");
add("ok","sapulpa","d1","The Creek-Nation council-grounds heritage rows carry the tribal-history halves beside the corridor lines.");
add("ok","sapulpa","f0","The OK-66 fifteen-minute rows ride the Tulsa routes with the corporate-shuttle drop halves.");
add("ok","sapulpa","f1","The town Route-66 museum row pairs the quick-stop heritage half on the western corridor.");
// VT Manchester Center
add("vt","manchester-center","h","The 1784-chartered town keeps the Equinox-mountains story beside the outlet-corridor line, with the Revolutionary-era heritage anchoring the valley half.");
add("vt","manchester-center","s0","The resort mountain's December-to-March lift rows carry the ski-group halves beside the lift lines.");
add("vt","manchester-center","d0","The Lincoln-family home's gardens and exhibit rows carry the guided-tour halves through the estate gates.");
add("vt","manchester-center","d1","The tax-free outlet stores' shop rows run the year-round halves beside the corridor lots.");
add("vt","manchester-center","f0","The Route-7 three-and-a-half-hour rows ride the city routes toward the ski-and-outlet weekends.");
add("vt","manchester-center","f1","The valley estate rows pair the guided half inside the mountain-side plan.");
// MO Bethany
add("mo","bethany","h","The 1879 courthouse line keeps the county-seat heritage beside the falls-lake row, with the I-35-corridor half anchoring the metro drive.");
add("mo","bethany","s0","The lake-and-county park's camping row halves carry the family-event halves beside the fairground gates.");
add("mo","bethany","d0","The courthouse-and-lake heritage row pair the county-seat walk halves beside the square gates.");
add("mo","bethany","d1","The memorial chapel's event rows carry the community halves beside the fairground lines.");
add("mo","bethany","f0","The I-35 ninety-minute rows ride the airport and event legs with the metro-traffic timing built in.");
add("mo","bethany","f1","The rodeo-week crowd rows carry the fairground weekend halves through the county calendar.");
// CO Larkspur
add("co","larkspur","h","The Garden-of-the-Gods red-rock rows keep the spring heritage beside the Front-line corridor, with the Renaissance festival's summer-half story anchoring the town row.");
add("co","larkspur","s0","The festival's summer-weekend rows carry the castle-and-jousting crowd halves on the Larkspur grounds.");
add("co","larkspur","d0","The cog-railway and toll rows carry the summit halves, timed through the weather windows.");
add("co","larkspur","d1","The jousting-field festival rows carry the weekend crowds beside the grounds gates.");
add("co","larkspur","d2","The red-rock gate park rows carry the free-entry photo halves beside the Springs lines.");
add("co","larkspur","f0","The I-25 hour-and-ten rows ride the Denver airport lines with the corridor shuttle halves.");
add("co","larkspur","f1","The Pike's Peak summit rows carry the 14er drive halves through the cog lines.");
// TN Sewanee
add("tn","sewanee","h","The 1857-chartered university line keeps the Episcopal-heritage story beside the plateau row, with the stone-gate entrance anchoring the campus half.");
add("tn","sewanee","s0","The nine-thousand-acre campus trail rows carry the Perimeter halves beside the Gothic-stone walks.");
add("tn","sewanee","d0","The Memorial-Cross overlook and chapel rows carry the vista halves beside the campus gates.");
add("tn","sewanee","d1","The Bridal-Veil-falls trail rows carry the plateau water halves ten minutes west.");
add("tn","sewanee","f0","The I-24-and-41A ninety-minute rows ride the capital routes with the Monteagle grade timed ahead.");
add("tn","sewanee","f1","The campus heritage rows pair the university visits inside the plateau plan.");
// CA Cayucos
add("ca","cayucos","h","The beach-town boardwalk rows keep the pier heritage beside the estuary line, with the dog-friendly shore anchoring the sand half.");
add("ca","cayucos","s0","The beach-weekend shuttle rows run the summer halves timed from the Bay-side drive lines.");
add("ca","cayucos","d0","The Morro-Rock volcanic cone rows carry the landmark photo halves beside the estuary gates.");
add("ca","cayucos","d1","The pier's fishing and sunset rows carry the coast halves beside the town lots.");
add("ca","cayucos","d2","The wine-country tasting rows carry the region halves on the Paso corridor.");
add("ca","cayucos","f0","The 101 three-and-a-half-hour rows ride the city routes inside the beach-week shuttle halves.");
// CA Granada Hills
add("ca","granada-hills","h","The Devonshire-and-Balboa corridor rows keep the northeast-Valley heritage beside the horse-property line, with the O'Melveny park gates anchoring the green half.");
add("ca","granada-hills","s0","The corporate park's event rows carry the shuttle halves through the corridor windows.");
add("ca","granada-hills","d0","The mission's oldest-los-angeles-standing row carries the heritage gardens halves beside the grounds gates.");
add("ca","granada-hills","d1","The hillside horse-trail rows carry the riding halves beside the estate lots.");
add("ca","granada-hills","f0","The I-405 forty-minute rows ride the airport routes through the Valley corridors.");
// CA Emeryville
add("ca","emeryville","h","The Amtrak-Capitol-Corridor terminal rows keep the rail-gateway heritage beside the ferry-side line, with the East-Bay waterfront anchoring the transit half.");
add("ca","emeryville","s0","The ferry-side terminal rows carry the SF-drop halves beside the shuttle gates.");
add("ca","emeryville","d0","The Emeryville-marina bay-street shop rows carry the waterfront halves beside the terminal gates.");
add("ca","emeryville","d1","The Pixar campus-gate row's studio-heritage halves pair the East-Bay corporate plan.");
add("ca","emeryville","f0","The twenty-minute ferry-connect rows ride the terminal corridors inside the bay plan.");

// OK new top-up
add("ok","mcalester","h","The 1870s-railroad camp-to-coal-era founding rows keep the mining-heritage story beside the county-seat line, with the Italian-festival's since-1971 May story anchoring the heritage half.");
add("ok","mcalester","s1","The May Italian-festival rows carry the since-1971 community halves beside the downtown gates.");
add("ok","mcalester","f2","The railroad-district parade rows carry the armed-forces heritage beside the May calendar.");
add("ok","mcalester","d0","The National-Register temple's masonic-museum rows carry the heritage halves on the downtown line.");
add("ok","mcalester","f3","The Krebs-10-minute Little-Italy dinner rows carry the neighboring heritage halves.");
add("ok","smithville","h","The Hochatown-corridor tourism lines keep the Broken-Bow gateway story beside the ~100-resident heritage, with the horseback-ranch tradition anchoring the trail half.");
add("ok","smithville","s1","The hidden-creek shooting-range rows carry the area recreation halves beside the corridor gates.");
add("ok","smithville","f1","The horseback-ride ranch rows carry the guest-group halves through the ranch windows.");
add("ok","smithville","f3","The TXK-85-92-mile one-hour-forty rows carry the practical gateway corridor lines.");
add("ok","stillwater","h","The 1890-land-grant campus founding rows keep the cowboy-heritage story beside the 42,000-resident line, with the game-day Saturday rows anchoring the Boone-Pickens half.");
add("ok","stillwater","s0","The Boone-Pickens stadium's Saturday rows carry the college crowd halves through the season gates.");
add("ok","stillwater","f0","The OKC-73-75-mile row rides the capital field lines with the city-corridor halves.");
add("ok","stillwater","f1","The Eskimo-Joe's 50-year shirt row pairs the college-heritage half beside the Elm gates.");
add("ok","stillwater","d2","The Lake-McMurtry 30-mile trail rows carry the outdoors halves beside the lake gates.");

// LA/MD/CA stragglers
add("la","covington","h","The Bogue-Falaya river town keeps the St.-Tammany heritage beside the Trace gate line, with the 42-46-mile city-field corridor anchoring the transit half.");
add("la","hammond","f0","The I-12-and-I-55 junction town row rides the Manchac-bridge corridors toward the city-field halves.");
add("la","covington","f0","The Causeway wind-and-fog caution rows carry the crossing caution halves beside the I-10 route lines.");
add("az","sierra-vista","h","The America's-City-of-the-Future award rows keep the recognition heritage beside the fort-line, with the Ft-Huachuca corridor anchoring the base half.");

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("round 3 applied");
