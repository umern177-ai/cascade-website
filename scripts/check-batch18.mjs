// Batch 18 verification: render the new pages + all same-state structured pages,
// check word counts, same-state Jaccard gate (< 0.20) and console errors.
// Usage: node scripts/check-batch18.mjs [base] [phase]  phase: all | new-only
import { chromium } from "playwright";
const BASE = process.argv[2] || "http://localhost:3100";
const PHASE = process.argv[3] || "all";
import fs from "node:fs";
const data = JSON.parse(fs.readFileSync("data/city-pages.json", "utf8"));

const NEW = new Set([
  // Batch 18 (Nov 13)
  "wi/rice-lake","wi/sheboygan-falls","wi/south-wayne","wi/saint-germain",
  "pa/allentown","pa/williamsport","pa/lewisburg","pa/stroudsburg","pa/ronks","pa/butler",
  "oh/madison","oh/middlefield","oh/ottawa",
  // Batch 19 (Nov 13) - remaining PA
  "pa/mount-carmel","pa/broomall","pa/denver","pa/east-greenville","pa/east-stroudsburg",
  "pa/hatboro","pa/lake-ariel","pa/middletown","pa/monaca","pa/moscow","pa/north-east",
  "pa/peach-bottom","pa/royersford","pa/summerdale","pa/ulster","pa/west-grove",
  "pa/beaver","pa/hawley",
  // Batch 20 (Nov 13) - all remaining TX
  "tx/brenham","tx/fredericksburg","tx/manor","tx/marble-falls","tx/mont-belvieu",
  "tx/rockport","tx/alpine","tx/buchanan-dam","tx/cotulla","tx/cypress","tx/driftwood",
  "tx/giddings","tx/glen-rose","tx/groveton","tx/harlingen","tx/katy","tx/kenedy",
  "tx/marfa","tx/mercedes","tx/midland","tx/plainview","tx/spicewood","tx/spurger",
  "tx/gatesville","tx/nacogdoches",
  // Batch 21 (Nov 13) - all remaining VA
  "va/harrisonburg","va/elkton","va/penn-laird","va/swoope","va/winchester",
  "va/stanardsville","va/orange","va/nellysford","va/norfolk","va/williamsburg",
  "va/cape-charles","va/chesterfield","va/danville","va/south-hill","va/petersburg",
  "va/hopewell","va/colonial-heights","va/jonesville","va/hot-springs","va/king-george",
  "va/powhatan","va/stafford","va/moneta",
  // Batch 22 (Nov 16) - all remaining GA
  "ga/helen","ga/ellijay","ga/mineral-bluff","ga/young-harris","ga/cumming",
  "ga/dawsonville","ga/gainesville","ga/dalton","ga/calhoun",
  "ga/atlanta","ga/fayetteville","ga/milledgeville","ga/macon","ga/forsyth",
  "ga/thomasville","ga/tifton","ga/douglas","ga/norman-park","ga/darien",
  "ga/claxton","ga/fort-stewart","ga/alamo","ga/barnesville","ga/cedartown",
  // Batch 23 (Nov 16) - all remaining NC
  "nc/clemmons","nc/havelock","nc/kitty-hawk","nc/lillington","nc/mebane",
  "nc/avon","nc/charlotte","nc/corolla","nc/davidson","nc/fayetteville",
  "nc/forest-city","nc/goldsboro","nc/hayesville","nc/high-point","nc/lake-lure",
  "nc/oriental","nc/raeford","nc/raleigh","nc/rocky-mount","nc/selma",
  "nc/taylorsville","nc/winston-salem","nc/kings-mountain","nc/mocksville",
  "nc/asheboro","nc/salisbury","nc/yadkinville",
  // Batch 24 (Nov 16) - all remaining WA
  "wa/monroe","wa/port-townsend","wa/stevenson","wa/anacortes","wa/chehalis",
  "wa/davenport","wa/hoquiam","wa/kennewick","wa/moses-lake","wa/north-bend",
  "wa/omak","wa/port-orchard","wa/renton","wa/ridgefield","wa/sequim",
  "wa/snoqualmie-pass","wa/woodinville","wa/ellensburg","wa/kingston","wa/forks",
  // Batch 25 (Nov 16) - all remaining MI
  "mi/evart","mi/gladwin","mi/harris","mi/bellaire","mi/coloma","mi/dowagiac",
  "mi/maple-city","mi/bridgman","mi/sturgis",
  // Batch 26 (Nov 16) - all remaining NH
  "nh/lebanon","nh/alton","nh/berlin","nh/concord","nh/exeter","nh/gorham",
  "nh/hampton","nh/meredith","nh/nashua","nh/newbury","nh/peterborough",
  "nh/whitefield","nh/sunapee",
  // Batch 27 (Nov 16) - all remaining MA
  "ma/brookline","ma/milton","ma/buzzards-bay","ma/chelmsford","ma/lynnfield",
  // Batch 28 (Nov 16) - all remaining CA
  "ca/anaheim","ca/arnold","ca/cambria","ca/camino","ca/dixon","ca/fallbrook",
  "ca/folsom","ca/fort-bragg","ca/jamestown","ca/monterey","ca/nevada-city",
  "ca/northridge","ca/sacramento","ca/santa-ynez","ca/trinidad","ca/van-nuys",
  // Batch 29 (Nov 16) - all remaining IN
  "in/columbus","in/culver","in/goshen","in/middlebury","in/west-lafayette",
  "in/bloomington","in/chesterton","in/granger","in/huntingburg","in/lowell",
  "in/munster","in/shoals","in/sunman","in/valparaiso","in/warsaw",
  "in/whitestown","in/greensburg",

  // Batch 30 (Nov 16) - CT, MN, MD, NJ, SC, FL, ID, NM, KY
  "ct/essex","ct/new-haven","ct/roxbury","ct/bethel","ct/groton","ct/litchfield",
  "ct/milford","ct/orange","ct/stratford","ct/westport","ct/new-london","ct/old-lyme",
  "mn/baxter","mn/big-lake","mn/crookston","mn/blackduck","mn/duluth","mn/fairmont",
  "mn/mankato","mn/north-branch","mn/taylors-falls","mn/victoria","mn/bemidji",
  "mn/plainview","mn/willmar",
  "md/california","md/easton","md/aberdeen","md/baltimore","md/beltsville","md/clinton",
  "md/laurel","md/lexington-park","md/pasadena","md/perryville","md/poolesville",
  "md/windsor-mill","md/pocomoke-city",
  "nj/chatham","nj/glassboro","nj/ocean-city","nj/stockton","nj/williamstown",
  "nj/emerson","nj/mahwah","nj/mullica-hill","nj/plainfield","nj/springfield",
  "nj/stone-harbor","nj/sussex","nj/whippany",
  "sc/clemson","sc/belton","sc/bishopville","sc/bluffton","sc/columbia","sc/conway",
  "sc/cross","sc/darlington","sc/georgetown","sc/greenville","sc/greenwood",
  "sc/myrtle-beach","sc/plum-branch","sc/taylors","sc/winnsboro","sc/hartsville",
  "sc/kingstree",
  "fl/palatka","fl/vero-beach","fl/alachua","fl/bonita-springs","fl/bradenton-beach",
  "fl/daytona-beach","fl/jacksonville","fl/jensen-beach","fl/perry","fl/saint-petersburg",
  "fl/stuart","fl/tampa","fl/the-villages","fl/venice","fl/winter-haven","fl/yulee",
  "id/ketchum","id/mccall","id/boise","id/fairfield","id/hailey","id/moscow",
  "nm/abiquiu","nm/las-cruces","nm/los-ojos","nm/portales","nm/carlsbad",
  "ky/ashland","ky/georgetown","ky/carlisle","ky/hebron","ky/independence",

  // Batch 31 (Nov 17) - CA, OR, UT, WY, CO, MT, TN, MS, AL, ME, WV, IL, MO, AZ, VT, RI, KS, LA, OK, SD, AR, IA, NE
  "ca/anaheim","ca/arnold","ca/cambria","ca/camino","ca/dixon","ca/fallbrook",
  "ca/folsom","ca/fort-bragg","ca/jamestown","ca/monterey","ca/nevada-city",
  "ca/northridge","ca/sacramento","ca/santa-ynez","ca/trinidad","ca/van-nuys",
  "or/rockaway-beach","or/damascus","or/otter-rock","or/pacific-city",
  "or/mcminnville","or/brookings","or/tillamook",
  "ut/kamas","ut/richfield","ut/draper","ut/jensen","ut/moab",
  "wy/alpine","wy/buffalo","wy/dubois","wy/cheyenne","wy/cora","wy/sheridan",
  "co/nederland","co/salida","co/avon","co/bayfield","co/denver","co/golden",
  "co/vail","co/woodland-park","co/westcliffe",
  "mt/big-sky","mt/livingston","mt/troy","mt/bozeman","mt/emigrant",
  "mt/marion","mt/plentywood","mt/shelby","mt/dillon",
  "tn/paris","tn/chattanooga","tn/mount-juliet","tn/nashville","tn/pulaski",
  "tn/shelbyville","tn/pigeon-forge",
  "ms/ridgeland","ms/ruth","ms/tylertown","ms/waveland","ms/greenwood","ms/greenville",
  "al/auburn","al/calera","al/fairhope","al/opp","al/pinson","al/troy",
  "me/belfast","me/rockland","me/bethel","me/ogunquit","me/portland",
  "me/sanford","me/york","me/bar-harbor",
  "wv/fairmont","wv/kingwood","wv/shepherdstown","wv/white-sulphur-springs",
  "wv/charles-town","wv/lesage","wv/princeton","wv/west-union",
  "il/edwardsville","il/olympia-fields","il/woodstock","il/east-saint-louis",
  "il/elgin","il/lake-zurich","il/machesney-park","il/south-beloit","il/taylor-ridge",
  "mo/belton","mo/branson","mo/independence","mo/joplin","mo/mount-vernon",
  "mo/springfield","mo/wellsville","mo/hannibal",
  "az/bellemont","az/bullhead-city","az/glendale","az/goodyear","az/pinetop",
  "az/prescott","az/prescott-valley","az/sierra-vista","az/show-low",
  "vt/brattleboro","vt/middletown-springs","vt/rutland",
  "ri/bristol","ri/exeter","ri/newport","ri/warwick",
  "ks/atchison","ks/hays","ks/leawood","ks/wichita",
  "la/covington","la/hammond","la/jennings","la/ruston",
  "ok/mcalester","ok/smithville","ok/stillwater",
  "sd/deadwood","ar/benton","ia/muscatine","ne/sidney",
]);

function shingles(text, n = 5) {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  const s = new Set();
  for (let i = 0; i + n <= words.length; i++) s.add(words.slice(i, i + n).join(" "));
  return s;
}
function jac(a, b) {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

// pages to compare = all structured pages of the affected states (derived from NEW)
const states = new Set([...NEW].map((k) => k.split("/")[0]));
const pages = data
  .filter((c) => states.has(c.state))
  .filter((c) => {
    const k = c.state + "/" + c.slug;
    return PHASE === "new-only" ? NEW.has(k) : true;
  })
  .map((c) => ({ state: c.state, slug: c.slug, isNew: NEW.has(c.state + "/" + c.slug) }));

const browser = await chromium.launch();
const ctx = await browser.newContext();
const pg = await ctx.newPage();
const texts = {};
const errors = {};
for (const p of pages) {
  const url = `${BASE}/locations/${p.state}/${p.slug}/`;
  const errs = [];
  pg.removeAllListeners("pageerror");
  pg.on("pageerror", (e) => errs.push(String(e)));
  const resp = await pg.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  if (!resp || resp.status() !== 200) { errors[p.state + "/" + p.slug] = ["HTTP " + (resp ? resp.status() : "null")]; }
  const body = await pg.evaluate(() => {
    const el = document.querySelector("main");
    if (!el) return "";
    const clone = el.cloneNode(true);
    for (const q of ["nav", "button", "script", "svg"]) clone.querySelectorAll(q).forEach((e) => e.remove());
    return (clone.textContent || "").replace(/\s+/g, " ").trim();
  });
  texts[p.state + "/" + p.slug] = { s: shingles(body), state: p.state, isNew: p.isNew };
  if (errs.length) errors[p.state + "/" + p.slug] = errs;
}
await browser.close();

const words = Object.fromEntries(Object.entries(texts).map(([k, v]) => [k, v.s.size + 4]));
console.log("== word counts (new pages, target ~800+, floor 700):");
for (const [k, v] of Object.entries(words)) {
  if (texts[k].isNew) console.log(`  ${k}: ${v} ${v >= 600 ? "OK" : "LOW"}`);
}

let worst = 0, worstPair = "", worstNew = 0, worstNewPair = "";
const keys = Object.keys(texts);
for (let i = 0; i < keys.length; i++) {
  for (let j = i + 1; j < keys.length; j++) {
    if (texts[keys[i]].state !== texts[keys[j]].state) continue;
    const v = jac(texts[keys[i]].s, texts[keys[j]].s);
    const aNew = texts[keys[i]].isNew, bNew = texts[keys[j]].isNew;
    if (aNew || bNew) {
      if (v > worstNew) { worstNew = v; worstNewPair = `${keys[i]}~${keys[j]}`; }
    } else if (v > worst) { worst = v; worstPair = `${keys[i]}~${keys[j]}`; }
  }
}
console.log(`same-state worst NEW-involving Jaccard: ${worstNew.toFixed(3)} (${worstNewPair}) — gate < 0.20: ${worstNew < 0.2 ? "PASS" : "FAIL"}`);
console.log(`same-state worst existing-only Jaccard: ${worst.toFixed(3)} (${worstPair})`);
const errKeys = Object.keys(errors);
console.log("console/HTTP errors:", errKeys.length ? JSON.stringify(errors) : "0");
process.exit(errKeys.length || worstNew >= 0.2 ? 1 : 0);
