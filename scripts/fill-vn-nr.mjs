// Direct fix: replace Van Nuys and Northridge entries with complete versions.
import { readFileSync, writeFileSync } from "node:fs";
const path = "scripts/batch28.mjs";
const src = readFileSync(path, "utf8");
const m = src.match(/const ENTRIES = \[([\s\S]*?)\n\];/);
const arr = eval("[" + m[1] + "]");

// Replace Northridge with complete version
const nrIdx = arr.findIndex(c => c.slug === "northridge");
if (nrIdx >= 0) {
  const nr = arr[nrIdx];
  nr.services = [
    { title: "Campus Visit Days", text: "The university's admissions rows and the thirty-seven-thousand-student campus blocks carry the class visits.", href: "/services/school-transportation/" },
    { title: "Soraya Event Transfers", text: "The performing-arts center's event nights with the lot-and-valet parking rules ride the valley corridors.", href: "/services/corporate-transportation/" },
    { title: "Valley and LA Transfers", text: "The I-405 corridors and the freeway routes ride the valley-to-city runs.", href: "/services/airport-transfer/" }
  ];
  nr.vehicles = [
    { slug: "minibus", reason: "Campus lots, Soraya rows and valley lanes." },
    { slug: "sprinter-van", reason: "Small groups and airport runs." },
    { slug: "charter-bus", reason: "Valley legs and larger blocks." }
  ];
  nr.destinations = [
    { name: "CSUN Campus", text: "The university's main-campus blocks on the University way row, the valley's biggest school.", tip: "One-time visitors park in the open general and visitor lots without registration, so the class day stages the quad drop there." },
    { name: "The Soraya Performing Arts Center", text: "The campus arts hall's theater-and-plaza event rows on the Nordhoff street edge.", tip: "Patrons self-park at the Darby avenue lots with the daily permit rows priced, and the valet option posted through the center's parking plan." },
    { name: "The Japanese Garden", text: "The reclaimed-water garden's Japanese strolling rows sharing the reclamation plant's gate in the neighboring Van Nuys blocks.", tip: "Groups of ten or more book ahead, with the weekday-and-second-Sunday windows posted and the garden's no-outside-food rule noted." }
  ];
  nr.mapPins = ["CSUN Campus, Northridge CA", "The Soraya, Northridge CA", "The Japanese Garden, Van Nuys CA"];
  nr.nearby = { heading: "Charter Bus Rental Near Northridge", items: [{ city: "Van Nuys" }, { city: "Los Angeles" }, { city: "Anaheim" }] };
  nr.faqs = [
    { q: "How do Soraya visitors park?", a: "The center's Darby avenue lots post the member free rows and the daily campus permit rate, with the marquee-entrance drop for the accessible arrivals." },
    { q: "What does the garden need for groups?", a: "Groups of ten or more book ahead, with the weekday-and-second-Sunday windows posted and the no-outside-food rule noted for the garden's walk lines." },
    { q: "Which airport serves the valley city?", a: "The Burbank field rides about twenty minutes southeast on the valley corridors, with LAX the bigger hub farther south." },
    { q: "What fits a class day?", a: "The campus tour's morning walk and the Soraya's evening show, one valley campus plan." }
  ];
  nr.ctaHeading = "Ready to Book Your Northridge Charter Bus?";
  nr.reviewChecks = [
    "Confirm Soraya group parking through the center's parking plan before the event.",
    "Owner: add one real Northridge job in your own words (1 enquiry came from here)."
  ];
  nr.sourceLinks = ["https://www.csun.edu/about", "https://www.thesoraya.org/en/parking/", "https://planning.lacity.gov/odocument/55e38590-0dcd-46ca-9afa-4b11ba9558b0/Northridge_Community_Plan.pdf"];
  nr.servicesHeading = "Group Transportation Services in Northridge";
  nr.vehiclesHeading = "Vehicles for Northridge Groups";
  nr.destinationsHeading = "Top Charter Bus Destinations in Northridge";
  nr.faqsHeading = "Northridge Charter Bus FAQs";
  nr.ctaHeading = nr.ctaHeading || "Ready to Book Your Northridge Charter Bus?";
  nr.reviewChecks = nr.reviewChecks || [];
  nr.sourceLinks = nr.sourceLinks || [];
  nr.premium = nr.premium || { heroLead: "", route: { to: "", toNote: "", miles: "", time: "", via: "" } };
  nr.premium.heroLead = "The valley campus city on the 118 corridor: the university's thirty-seven-thousand-student rows, the Soraya's valley performing-arts seasons and the reclaimed-water garden a neighborhood south. We run the campus visits, Soraya nights and valley legs.";
  nr.premium.route = { to: "CSUN Campus", toNote: "University campus", miles: "", time: "~5 min", via: "Nordhoff St" };
}

// Replace Van Nuys with complete version
const vnIdx = arr.findIndex(c => c.slug === "van-nuys");
if (vnIdx >= 0) {
  arr[vnIdx] = {
    state: "ca", slug: "van-nuys", city: "Van Nuys",
    title: "Charter Bus Rental in Van Nuys | Cascade Charter Bus",
    metaDescription: "Charter bus, minibus and Sprinter rental in Van Nuys, CA for the Japanese garden's reservation rows, the airport tours and valley-corridor runs. Free quote, 24/7.",
    h1: "Charter Bus Rental in Van Nuys, CA for the Valley Civic Center",
    heroIntro: "Van Nuys is the Valley's civic center on the boulevard, the general-aviation field's world-busy runways sharing the corridor with the reclaimed-water garden's Japanese rows. The garden's ten-plus visitor reservations run the weekday mornings and the civic blocks keep the Valley's government rows. Cascade Charter Bus runs the garden reservations, the airport tours and the valley legs.",
    servicesHeading: "Group Transportation Services in Van Nuys",
    services: [
      { title: "Japanese Garden Days", text: "The reclaimed-water garden's reservation-only visitor rows run the weekday mornings through the season.", href: "/services/sightseeing-tour-bus/" },
      { title: "Airport and Valley Tours", text: "The general-aviation field's operations tours and the corridor routes carry the valley legs.", href: "/services/airport-transfer/" }
    ],
    vehiclesHeading: "Vehicles for Van Nuys Groups",
    vehicles: [
      { slug: "minibus", reason: "Garden rows, airport lots and civic blocks." },
      { slug: "sprinter-van", reason: "Small groups and airport runs." },
      { slug: "charter-bus", reason: "Valley legs and larger blocks." }
    ],
    destinationsHeading: "Top Charter Bus Destinations in Van Nuys",
    destinations: [
      { name: "The Japanese Garden", text: "The reclaimed-water garden's Japanese strolling rows sharing the reclamation plant's gate on the Woodley avenue blocks.", tip: "Groups of ten or more book ahead, with the weekday-and-second-Sunday windows posted and the garden's no-outside-food rule noted for the garden's walk lines." },
      { name: "Van Nuys Airport", text: "The general-aviation field's parallel runways, the world-busy operations row and the LAX reliever's designated corridor.", tip: "The field runs no scheduled airline service, so the airport half carries the aviation-tour context without the airline-booking line." }
    ],
    mapPins: ["The Japanese Garden, Van Nuys CA", "Van Nuys Airport, Van Nuys CA", "Van Nuys Civic Center, Van Nuys CA"],
    nearby: { heading: "Charter Bus Rental Near Van Nuys", items: [{ city: "Los Angeles" }, { city: "Anaheim" }, { city: "Northridge" }] },
    faqsHeading: "Van Nuys Charter Bus FAQs",
    faqs: [
      { q: "Can groups visit the Japanese garden?", a: "Yes, by reservation: groups of ten or more book ahead with the weekday-and-second-Sunday windows posted through the garden's line." },
      { q: "Does the airport have scheduled flights?", a: "No. The general-aviation field runs business-jet and training operations, with no scheduled commercial airline service posted." },
      { q: "Which airport serves the valley?", a: "The Burbank field rides about fifteen minutes southeast on the valley corridors, with LAX the bigger hub farther south." },
      { q: "What fits a valley day?", a: "The garden's morning walk, the airport's heritage hour and the boulevard dinner row, one Van Nuys plan." }
    ],
    ctaHeading: "Ready to Book Your Van Nuys Charter Bus?",
    reviewChecks: [
      "Confirm Japanese garden reservation windows ahead of the group booking.",
      "Owner: add one real Van Nuys job in your own words (1 enquiry came from here)."
    ],
    sourceLinks: ["https://thejapanesegarden.com/", "https://www.iflyvny.com/pilot-information/about-van-nuys-airport"],
    premium: {
      heroLead: "The Valley's civic-center town on the boulevard: the reclaimed-water Japanese garden's reservation-only visitor rows, the world-busy aviation field's corridors and the civic blocks. We run the garden reservations, airport tours and valley legs.",
      route: { to: "The Japanese Garden", toNote: "Reclaimed-water garden", miles: "", time: "~7 min", via: "Woodley Ave" }
    }
  };
}

// Also fix the Dixon h1 typo if present
const dx = arr.find(c => c.slug === 'dixon');
if (dx && dx.h1 && dx.h1.includes('MI? no,')) {
  dx.h1 = 'Charter Bus Rental in Dixon, CA for the May Fair Town';
}
// Check for other "? no" artifacts
for (const e of arr) {
  if (e.heroIntro && e.heroIntro.includes('? no,')) {
    e.heroIntro = e.heroIntro.replace(/\? no, seventy wineries pour/, 'pour');
    e.heroIntro = e.heroIntro.replace(/seven hundred seventy wineries/, 'seventy-plus wineries');
  }
}

writeFileSync(path, "const ENTRIES = " + JSON.stringify(arr, null, 1) + ";\n\nimport { readFileSync, writeFileSync } from \"node:fs\";\nconst path = \"data/city-pages.json\";\nconst data = JSON.parse(readFileSync(path, \"utf8\"));\nlet added = 0, skipped = 0;\nfor (const e of ENTRIES) {\n  if (data.some((c) => c.state === e.state && c.slug === e.slug)) { skipped++; continue; }\n  data.push(e);\n  added++;\n}\nwriteFileSync(path, JSON.stringify(data, null, 2));\nconsole.log(`Batch 28: added ${added}, skipped ${skipped}, total ${data.length}`);\n");
console.log("all 16 entries fixed; total", arr.length);
