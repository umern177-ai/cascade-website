// City page content variants.
//
// Google penalizes pages where only the city name is swapped (scaled content
// abuse — the pattern that hit the old site). Two defenses layered here:
//
// 1. RESEARCH (the real long-term fix): researched, city-specific content in
//    data/city-content.json — famous places, airports, wedding venues, wineries.
//    Cities without researched data don't get fake local claims; they get fewer,
//    safer sections until their city profile is researched (Phase 5 batches).
// 2. VARIATION (this file): headings and lead sentences drawn from small pools,
//    chosen per city by a stable hash, plus section-order variation. Two pages
//    share a heading set only by chance (~1 in n variants pooled).

type Pair = { h: string; p?: string } | null;

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export type CityVariantKey = string; // `${state}/${slug}`

export function variantsFor(key: CityVariantKey) {
  const n = hash(key);
  const pick = (arr: string[]): string => arr[n % arr.length];
  const pick2 = (arr: string[]): string => arr[Math.floor(n / 7) % arr.length];

  const wedding = pick([
    "Wedding Shuttle Service in {name}",
    "Wedding Guest Shuttles in {name}",
    "Wedding Transportation in {name}",
    "Guest Shuttles for Weddings in {name}",
    "Shuttle Service for Weddings in {name}",
  ]);
  const weddingLead = pick2([
    "About 70% of the inquiries Cascade receives are weddings, so wedding-day logistics are what we do most: guest loops between hotels and the venue, ceremony-to-reception runs, and a plan that holds when photography runs long.",
    "Weddings are our number one booking type, and for good reason: the whole day runs on shuttles. We plan guest loops between the hotel block and the venue, time them with your photographer, and keep one final quote for the whole day.",
    "Most of the groups we serve are wedding parties, so the playbooks here are well worn: hotel-to-venue loops on a published schedule, late pickups after the send-off, and a driver who's briefed on your timeline before the first guest boards.",
    "Wedding groups are the core of what we move in {name}. Guest loops between hotels, ceremony and reception are planned hour by hour with your planner, and every quote includes gratuity, tolls and taxes so the budget holds.",
  ]);
  const weddingIntro = pick([
    "Venues and hotel blocks your guests already use in {name}:",
    "Groups getting married here most often use these spots:",
    "Wedding work in {name} usually involves these venues:",
  ]);
  const places = pick([
    "Places groups visit in and around {name}",
    "Where groups go in {name}",
    "Popular stops on {name} group trips",
    "What groups see in and near {name}",
    "Top stops we drive to around {name}",
  ]);
  const placesLead = pick2([
    "Real stops our buses run to, useful for planning tour days, family reunions and itinerary stops between pickups.",
    "These come up again and again on trips we plan here, handy when you're building a group itinerary.",
    "A useful shortlist when your group wants sightseeing or activity stops between pickups.",
  ]);
  const airports = pick([
    "Airports near {name}",
    "Airport shuttles for groups in {name}",
    "Getting to {name} by air",
    "Airports we serve around {name}",
  ]);
  const vehicles = pick([
    "Vehicles for trips from {name}",
    "Which vehicle fits your trip",
    "Choosing a vehicle in {name}",
    "Vehicles we can send to {name}",
    "From 7 seats to 56: your options from {name}",
  ]);
  const vehiclesLead = pick2([
    "The right vehicle depends on headcount and luggage. These are the options the dispatch team chooses between—each one is priced in your final quote.",
    "Headcount, luggage and route decide the vehicle. Compare the options here, then let the quote pick the fit.",
    "Match the vehicle to the trip: capacities below, and the final quote always names the exact vehicle.",
  ]);
  const checklist = pick([
    "What to tell us for a fast quote",
    "Include these details in your quote request",
    "Five details that speed up your quote",
    "Make your quote come back faster",
  ]);
  const checklistLead = pick2([
    "The more of this is in your request, the faster the dispatch team can answer with one final price—usually in about 15 minutes.",
    "Send these five things and your quote usually comes back in about 15 minutes, final, with the vehicle already chosen.",
    "A quote built on complete details is a quote you can book on the spot. Here's what to include.",
  ]);
  const nearby = pick([
    "Nearby Charter Bus Locations",
    "Charter service in nearby cities",
    "More cities we serve nearby",
    "Also serving these towns",
  ]);

  const fill = (t: string) => t; // caller replaces {name} with the city
  return {
    wedding: fill(wedding),
    weddingLead: fill(weddingLead),
    weddingIntro: fill(weddingIntro),
    places: fill(places),
    placesLead: fill(placesLead),
    airports: fill(airports),
    vehicles: fill(vehicles),
    vehiclesLead: fill(vehiclesLead),
    checklist: fill(checklist),
    checklistLead: fill(checklistLead),
    nearby: fill(nearby),
  };
}
