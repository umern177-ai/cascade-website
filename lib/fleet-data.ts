// Fleet data — single source of truth so the hub, vehicle pages, cards and
// service pages can never disagree (brief Sections 7.4, 7.5b, 19.10).
// Numbers follow the brief's confirmed table; sleeper corrected per owner (Nov 9):
// up to 15 bunks, restroom and shower on board, no private artist room.
export type Vehicle = {
  slug: string;
  name: string;            // menu name (singular/plural as the live menu uses)
  cardName: string;
  ctaName: string;     // clean CTA wording: "Need a {ctaName}?"        // heading on the hub card / page H1
  tagline: string;
  passengers: string;      // capacity line (badge on hub)
  photo: string;
  amenities: string[];     // 4 "Key Amenities"
  luggage: string;
  climate: string;
  technology: string;
  intro: string;           // short paragraph under the H1 on the detail page
  features: string[];      // features & amenities list on the detail page
  bestFor: { label: string; href: string }[]; // Ideal For (service links)
  faqs: { q: string; a: string }[];
  useCases: { title: string; text: string }[];
  planningTips: string[];
  whyChoose: string[];      // why people book this vehicle over cars/other options
  metaTitle: string;
  metaDescription: string;
};

export const VEHICLES: Vehicle[] = [
  {
    slug: "charter-bus",
    name: "Charter Bus",
    cardName: "Charter Buses",
    ctaName: "Charter Bus",
    tagline: "Full-Size Motorcoach Travel for Large Groups",
    passengers: "52–56 Passengers",
    photo: "/images/fleet/charter.jpg",
    amenities: ["Onboard Restroom", "High-Speed WiFi", "Under-Bus Luggage Storage", "PA System"],
    luggage: "50–60 Large Bags",
    climate: "Dual-Zone A/C",
    technology: "LCD Monitors / DVD",
    intro:
      "Charter buses—also called motorcoaches or full-size coaches—are the workhorse of group travel: 52–56 seats, 50–60 large bags stored under the floor, an onboard restroom, and dual-zone air conditioning. One coach replaces more than a dozen cars, keeps the whole group on the same schedule, and lets a single driver handle everything from hotel drop-offs to cross-state runs.",
    useCases: [
      { title: "The out-of-state tournament", text: "One bus, 54 seats, gear bags under the floor, nobody in a convoy arriving separately. Teams book the motorcoach when the schedule doesn't allow a 90-minute cushion." },
      { title: "The conference shuttle", text: "56 attendees who all need to be at the venue for the 8:45 keynote. One coach on a fixed hotel-to-venue loop beats forty rideshares, and the onboard restroom means the loop doesn't pause every 20 minutes." },
      { title: "The multi-day trip", text: "A week-long journey is routine: luggage rides in the bays, the restroom is on board, and the driver plans the fuel, meal and rest stops so the group doesn't argue them out mid-trip." },
    ],
    planningTips: [
      "Reserve 4 to 8 weeks ahead for spring weekends and peak-season dates; midweek dates move faster.",
      "Count luggage before you book. The bays hold 50 to 60 large bags, and oversize equipment needs a headcount.",
      "Long runs are scheduled around federal driver hours. Tell us the route and we build the legal timeline.",
      "Confirm WiFi and power outlets if the group works on the road. They're on most motorcoaches, and dispatch confirms the exact vehicle.",
    ],
    whyChoose: [
      "One driver, one vehicle: up to 56 people travel together, arrive together and never lose each other in traffic.",
      "The per-person cost is far lower than reimbursing a dozen cars, rideshares or short flights for the same route.",
      "The ride is part of the day: restroom on board, luggage out of sight in the bays, and everyone steps off rested instead of wrung out from three hours behind the wheel.",
      "It fits the gear. 50 to 60 large bags in the bays, so instruments, coolers and suitcases ride with the people.",
    ],
    features: [
      "Seats 52–56 passengers in reclining chairs",
      "Under-bus luggage bays hold 50–60 large bags",
      "Onboard restroom at the rear of the coach",
      "High-speed WiFi and a PA system",
      "Dual-zone climate control",
      "LCD monitors with DVD for longer rides",
    ],
    bestFor: [
      { label: "Sports Team Transportation", href: "/services/sports-team-transportation/" },
      { label: "School & Field Trip Transportation", href: "/services/school-transportation/" },
      { label: "Corporate Event Transportation", href: "/services/corporate-transportation/" },
      { label: "Sightseeing & Tour Bus Rental", href: "/services/sightseeing-tour-bus/" },
    ],
    faqs: [
      { q: "How many passengers can a charter bus hold?", a: "Our charter buses seat 52–56 passengers. For larger groups we send two coaches or split the group between a motorcoach and a minibus." },
      { q: "Do charter buses have restrooms?", a: "Yes—every charter bus in the fleet has an onboard restroom, which cuts down the number of stops on a long ride." },
      { q: "Can I rent a charter bus for a long-distance trip?", a: "Yes. Charter buses are built for long distances: under-bus luggage bays, an onboard restroom, dual-zone climate control and a professional driver who works to federal hours-of-service rules." },
      { q: "Can charter buses carry luggage?", a: "Yes—the under-bus bays hold 50–60 large bags, and there is overhead storage inside for carry-ons and gear bags." },
    ],
    metaTitle: "Charter Bus & Motorcoach Rental | 52-56 Seats",
    metaDescription:
      "Charter bus and motorcoach rental for 52–56 passengers: onboard restroom, WiFi, 50–60 bag luggage bays. Nationwide charter bus rental service with DOT-certified drivers. Free quote.",
  },
  {
    slug: "sleeper",
    name: "Sleeper / Tour Buses",
    cardName: "Sleeper / Tour Buses",
    ctaName: "Sleeper Bus",
    tagline: "Overnight Touring Comfort for Artists & Crews",
    passengers: "Up to 15 Bunks",
    photo: "/images/fleet/sleeper.jpg",
    amenities: ["Sleeping Bunks", "Front & Rear Lounge", "Restroom & Shower", "Lounge Seating"],
    luggage: "Personal & Tour Gear",
    climate: "Central Climate Control",
    technology: "Premium Sound System",
    intro:
      "Sleeper buses keep a touring group moving overnight: up to 15 bunks depending on the bus, a front and rear lounge, and a restroom and shower on board. Drivers hand off at scheduled relief stops so the bus keeps rolling while the band sleeps, and gear travels in the same vehicle.",
    useCases: [
      { title: "The overnight leg", text: "Play tonight, drive tonight. Up to 15 people sleep in bunks while the coach makes the next city, which is how tours keep a one-show-per-day pace without hotel nights on the road." },
      { title: "The gear-heavy load", text: "Sleeper routing accounts for gear from the first quote: cases, amps and personal bags ride with the band, so load-in starts from the same vehicle the crew slept in." },
      { title: "The late finish", text: "Shows end after midnight. A sleeper coach turns the 3 a.m. departure into a few hours of sleep in a bunk instead of a bleary roadside coffee stop." },
    ],
    planningTips: [
      "Tell us the bunk count you need and the headcount to match. Different buses carry different bunk layouts, up to 15 bunks.",
      "Confirm the restroom and shower setup against your rider expectations before the tour is routed.",
      "Long overnight routes are planned around federal hours-of-service rules, so the schedule is built legal.",
      "Book tour dates early. Sleeper availability thins first in peak touring months.",
    ],
    whyChoose: [
      "Nights on the bus are nights without hotel check-ins, late checkouts or five room bookings that don't match the schedule.",
      "The whole crew sleeps in bunks while the coach makes miles, so tomorrow's call time is today's route.",
      "Restroom and shower on board keep the crew functional between venues.",
      "Gear and people ride in the same vehicle, so load-in happens once, from one vehicle.",
    ],
    features: [
      "Up to 15 sleeping bunks, depending on the bus size",
      "Restroom and shower on board",
      "Front and rear lounge areas",
      "Storage bays for personal and tour gear",
      "Central climate control through the cabin",
      "Premium sound system",
    ],
    bestFor: [
      { label: "Band Tour Bus", href: "/services/band-tour-bus/" },
      { label: "Multi-Day Tours", href: "/services/sightseeing-tour-bus/" },
    ],
    faqs: [
      { q: "How many bunks does a sleeper bus have?", a: "Sleeper buses have up to 15 bunks, depending on the bus we send. Tell us your headcount and we match the right coach." },
      { q: "Is there a shower and restroom on board?", a: "Yes—sleeper buses have both a restroom and a shower on board." },
      { q: "Can the bus pull a trailer for gear?", a: "Trailer options depend on the specific coach and route. Tell us what gear you're moving and the dispatch team will confirm what's available for your dates." },
      { q: "How do driver hours work on overnight runs?", a: "Drivers work to federal hours-of-service rules. On long overnight routes we schedule relief drivers or timed rest stops so the schedule stays legal and safe." },
    ],
    metaTitle: "Sleeper Bus Rental for Band Tours | Up to 15 Bunks",
    metaDescription:
      "Sleeper bus rental for touring bands: up to 15 bunks, onboard restroom and shower, front and rear lounges. Nationwide routing with 24/7 dispatch support.",
  },
  {
    slug: "minibus",
    name: "Minibuses",
    cardName: "Mini Buses",
    ctaName: "Minibus",
    tagline: "Flexible Group Transportation for 20-32 Passengers",
    passengers: "20–32 Passengers",
    photo: "/images/fleet/mini.jpg",
    amenities: ["Air Conditioning", "Reclining Seats", "Overhead Storage", "Easy City Parking"],
    luggage: "Overhead / Seat Storage",
    climate: "Rear Climate Control",
    technology: "WiFi / USB",
    intro:
      "Minibus rental seats 20–32 passengers and fits where a full-size coach can't: narrow venue lanes, tight hotel loops and crowded city centers. They're the go-to vehicle for wedding guest shuttles, airport runs for mid-size groups, and evening loops between venues.",
    useCases: [
      { title: "The wedding-day loop", text: "The venue is down a narrow farm lane. Minibuses run 15-minute loops between the hotel block and the barn, so nobody parks on the shoulder and dinner starts on time." },
      { title: "The airport run", text: "Eight relatives, twelve bags, one terminal. A Sprinter fills and a motorcoach idles. The minibus is the middle answer, and it parks at arrivals without circling." },
      { title: "The city day", text: "Downtown parking is paid per car and there are 28 of you. One minibus on a fixed stop list keeps the group moving without splitting at every light." },
    ],
    planningTips: [
      "Minibuses seat 20 to 32. Count guests plus wedding-party overflow before choosing one bus or two.",
      "Real luggage is the limit: overhead racks take carry-ons, not ski bags. Match the vehicle to the bags.",
      "Venues with tight entrances are minibus territory. Send us the address and we'll route what fits.",
      "For evening events, plan the last loop time in the quote so the send-off isn't improvised.",
    ],
    whyChoose: [
      "It fits where the big coach can't: narrow venue lanes, hotel loops, downtown blocks and winery roads.",
      "20 to 32 seats is the sweet spot for weddings, airport pickups and office parties that a Sprinter can't cover and a motorcoach would idle.",
      "Looping is simple: one minibus on a 15-minute circuit keeps a hotel block moving without a convoy.",
      "Smaller footprint means easier parking at crowded venues, and lower cost than a full-size coach.",
    ],
    features: [
      "Seats 20–32 passengers",
      "Air conditioning with rear climate control",
      "Reclining seats and overhead storage",
      "Maneuvers easily in city traffic and small parking areas",
      "WiFi and USB charging on most vehicles",
    ],
    bestFor: [
      { label: "Wedding Shuttle Bus Rental", href: "/services/wedding-transportation/" },
      { label: "Group Airport Shuttle", href: "/services/airport-transfer/" },
      { label: "Church & Religious Group Transportation", href: "/services/church-religious-transportation/" },
    ],
    faqs: [
      { q: "How many passengers fit in a minibus?", a: "Minibuses seat 20–32 passengers, depending on the vehicle. We confirm the exact seat count when you request your quote." },
      { q: "Does a minibus have luggage space?", a: "Overhead racks carry carry-on bags; larger luggage rides on seats or in a rear area depending on the vehicle. For big bags and long trips, a charter bus is the better fit." },
      { q: "Can a minibus handle narrow venue roads?", a: "Yes—that's what minibuses are for. They handle hotel loops, farm-lane venues and tight downtown blocks where a 45-foot coach can't turn." },
      { q: "Is WiFi available on minibuses?", a: "WiFi and USB charging are on most vehicles. Tell us if connectivity matters and we'll match the right bus." },
    ],
    metaTitle: "Minibus Rental | 20-32 Passenger Shuttle Buses",
    metaDescription:
      "Rent a 20–32 passenger minibus with A/C, reclining seats and easy city maneuvering. Ideal for weddings, shuttles and airport transfers. Get a free quote.",
  },
  {
    slug: "school-bus",
    name: "School Buses",
    cardName: "School Buses",
    ctaName: "School Bus",
    tagline: "High-Capacity Transportation for Short Trips",
    passengers: "28–60 Passengers",
    photo: "/images/fleet/school.jpg",
    amenities: ["Large Group Capacity", "Safety-Focused Design", "Bench Seating", "PA System"],
    luggage: "No Luggage Bay",
    climate: "Climate Varies by Vehicle",
    technology: "PA System",
    intro:
      "School bus rental moves large groups short distances at the lowest per-seat cost: 28–60 passengers per bus, no luggage bay, high-visibility safety design. They work for local field trips, campus shuttles, homecoming runs and short airport hops where gear isn't the issue.",
    useCases: [
      { title: "The field trip across town", text: "Sixty students, a 9 a.m. museum slot, no luggage beyond lunch bags. The school bus is the price-per-seat answer, and the schedule is simple: two pickups, one drop, one return." },
      { title: "The homecoming run", text: "One more reason districts and families book school buses: short radius, high seats, honest price. The trip is 12 minutes each way and everyone arrives together." },
      { title: "The camp shuttle", text: "Weekly shuttles to camp work well with high capacity and bench seating that handles backpacks and coolers without a luggage bay." },
    ],
    planningTips: [
      "No luggage bay. Bench floor space carries day bags, not suitcases. If the gear is big, look at minibuses or charter buses.",
      "Climate control varies by vehicle. Confirm it for summer trips with younger riders.",
      "Book spring field-trip season early. April and May dates fill fastest.",
      "For large grades, ask about a second bus. Two short runs often beat one crowded long one.",
    ],
    whyChoose: [
      "The lowest cost per seat of any vehicle in the fleet, which is why schools, camps and short-radius runs book it.",
      "High capacity without baggage: 28 to 60 seats handles a full class or a whole grade's morning run.",
      "Short trips don't need a restroom or bays, and the school bus skips that cost.",
      "Simple, familiar and purpose-built for moving many people a short way.",
    ],
    features: [
      "Seats 28–60 passengers",
      "Bench seating and a PA system",
      "No luggage bay—best for trips with light gear",
      "Climate control varies by vehicle; we confirm at booking",
    ],
    bestFor: [
      { label: "School & Field Trip Transportation", href: "/services/school-transportation/" },
      { label: "Sports Team Transportation", href: "/services/sports-team-transportation/" },
    ],
    faqs: [
      { q: "How many passengers fit on a school bus?", a: "Between 28 and 60 depending on the bus size. We confirm the exact capacity for your dates when you book." },
      { q: "Do school buses have luggage space?", a: "No—school buses have no luggage bay. Bags ride in laps or under seats, so choose a charter bus or minibus when the group carries real luggage." },
      { q: "Are school buses cheaper than charter buses?", a: "Usually yes—per-seat cost is the lowest in the fleet, especially for short local runs. The trade-off is no restroom, no luggage bay and simpler seating." },
      { q: "Can we book a school bus for a wedding shuttle?", a: "Yes—many couples use school buses for guest shuttles when the venue is close and budget matters more than amenities." },
    ],
    metaTitle: "School Bus Rental | Affordable Group Transportation",
    metaDescription:
      "Rent a school bus for 28–60 passengers— the most economical option for field trips, shuttles and short local trips. DOT-certified drivers nationwide.",
  },
  {
    slug: "sprinter-van",
    name: "Sprinter Vans",
    cardName: "Sprinter Vans",
    ctaName: "Sprinter Van",
    tagline: "Small-Group Transportation With a Professional Driver",
    passengers: "Up to 14 Passengers",
    photo: "/images/fleet/sprinter.jpg",
    amenities: ["Air Conditioning", "Luggage Space", "Reclining Seats", "Easy Handling"],
    luggage: "Carry-on / Rear Storage",
    climate: "Rear Climate Control",
    technology: "12V Charging",
    intro:
      "Sprinter van rental with driver carries up to 14 passengers—no rental, no navigation, no parking hunt. They're right for airport pickups of small groups, executive transfers, and narrow streets or venues that don't fit bigger buses.",
    useCases: [
      { title: "The executive airport pickup", text: "Three travelers land at 6:40. The Sprinter waits at arrivals, the luggage fits, and the receipt is one line instead of three cars, three tolls and three tips." },
      { title: "The board lunch run", text: "Up to 14 to the offsite lunch and back in 90 minutes, no parking lottery. The van loops until the last attendee boards." },
      { title: "The small-group tour", text: "Six friends, eight hours, one route. The Sprinter handles the narrow streets a motorcoach cannot and parks at the overlooks." },
    ],
    planningTips: [
      "Up to 14 passengers, and count generously because gear takes seats.",
      "Carry-on luggage fits. Full-size suitcases for 14 people do not. Match the bags to the vehicle.",
      "For terminal pickups, confirm the airline, flight and meeting point, and the driver builds the timing.",
      "Tight venues and narrow streets are Sprinter work. They're the default answer where buses cannot turn.",
    ],
    whyChoose: [
      "Airport pickups for small groups that one car can't cover and a bus makes idle.",
      "It goes where buses can't: narrow streets, small lots, tight vineyard and venue entrances.",
      "One driver, one receipt, no three-car convoy arriving at different times.",
      "Fast at terminals. No parking hunt, no circling, and the group boards together.",
    ],
    features: [
      "Seats up to 14 passengers",
      "Air conditioning with rear climate control",
      "Carry-on and rear luggage space",
      "Reclining seats and 12V charging",
    ],
    bestFor: [
      { label: "Group Airport Shuttle", href: "/services/airport-transfer/" },
      { label: "Corporate Event Transportation", href: "/services/corporate-transportation/" },
    ],
    faqs: [
      { q: "How many passengers fit in a sprinter van?", a: "Up to 14 passengers plus the driver. For larger groups we run several vans in convoys or move up to a minibus." },
      { q: "Does the sprinter van come with a driver?", a: "Yes—every Cascade Sprinter has a professional driver. There is no self-drive option." },
      { q: "How much luggage fits in a sprinter van?", a: "Carry-ons and a rear storage area—roughly a weekend-trip amount for a full van. For skis, trunks or big equipment cases, use a minibus or charter bus." },
      { q: "Is a sprinter van good for airport transfers?", a: "Very good: it's fast at terminals, parks easily, and handles small groups without splitting into multiple cars." },
    ],
    metaTitle: "Sprinter Van Rental With Driver | Up to 14 Passengers",
    metaDescription:
      "Rent a Sprinter van with a professional driver for up to 14 passengers. Airport pickups, executive transfers and small-group trips nationwide.",
  },
  {
    slug: "party-bus",
    name: "Limo & Party Buses",
    cardName: "Limo & Party Buses",
    ctaName: "Party Bus",
    tagline: "Celebration Transportation With Lights & Sound",
    passengers: "14–40 Passengers",
    photo: "/images/fleet/limo.jpg",
    amenities: ["Premium Interior", "LED Lighting", "Bar Area", "Entertainment System"],
    luggage: "Limited Luggage",
    climate: "Climate Control",
    technology: "Sound & Entertainment",
    intro:
      "Party bus and limo rental holds 14–40 passengers with premium interiors, LED lighting, a bar area and an entertainment system. Built for nights out, proms, bachelor and bachelorette parties and celebration loops—luggage space is limited, so this is not a vehicle for airport runs with big bags.",
    useCases: [
      { title: "The pre-game run", text: "The night starts when the bus does: LED lighting, a sound system, and a driver already parked where the group needs to be at closing time." },
      { title: "Prom night", text: "Parents book the party bus to keep prom night on one route with one schedule, and the pictures start in the limo instead of the parking lot." },
      { title: "The celebration loop", text: "Three bars, one group, one closing-time pickup. The loop keeps the group together and the night on schedule." },
    ],
    planningTips: [
      "Capacity runs 14 to 40 by vehicle. Know the headcount before comparing quotes.",
      "Bar-area policies vary by vehicle and route. Ask when booking so there's no surprise on the night.",
      "Party buses are booked by the hour. Book the real block, including the return leg.",
      "Luggage space is minimal. This is a people mover, not an airport shuttle.",
    ],
    whyChoose: [
      "The party starts in the vehicle: LED lighting, sound system and a bar area make the ride part of the night.",
      "Keep the group together between stops, so nobody drives after drinking and nobody is left at a curb.",
      "Hourly booking matches how the night actually goes instead of a rigid route.",
      "One driver, one plan, one closing-time pickup that the group can count on.",
    ],
    features: [
      "Seats 14–40 passengers",
      "Premium interior with LED lighting",
      "Bar area (byo—ask about what's permitted)",
      "Sound and entertainment system",
      "Limited luggage space",
    ],
    bestFor: [
      { label: "Wedding Shuttle Bus Rental", href: "/services/wedding-transportation/" },
      { label: "Corporate Event Transportation", href: "/services/corporate-transportation/" },
    ],
    faqs: [
      { q: "How many passengers fit in a party bus?", a: "Between 14 and 40 depending on the vehicle. We confirm the exact capacity and layout when you request your quote." },
      { q: "Can we bring drinks on a party bus?", a: "Bar areas allow beverages on most vehicles, subject to local rules and the operator's policy. Ask when booking and we'll confirm for your trip." },
      { q: "Is there a minimum rental time?", a: "Party buses usually run on hourly minimums. Tell us your plan and we'll quote the hours you actually need." },
      { q: "Do party buses have luggage space?", a: "Very limited—party buses are built for people, not bags. For airport or multi-day trips with luggage, use a minibus or charter bus." },
    ],
    metaTitle: "Party Bus & Limo Rental | 14-40 Passengers",
    metaDescription:
      "Rent a limo or party bus for 14–40 passengers with LED lighting, bar area and entertainment system. Nights out, proms and celebrations nationwide.",
  },
  {
    slug: "suv-sedan",
    name: "SUV & Sedans",
    cardName: "SUVs & Sedans",
    ctaName: "Sedan or SUV",
    tagline: "Point-to-Point Transportation for Small Groups",
    passengers: "Up to 7 Passengers",
    photo: "/images/fleet/suv.jpg",
    amenities: ["Climate Control", "Privacy Glass", "Bluetooth Audio", "Comfortable Seating"],
    luggage: "Up to 7 Carry-Ons",
    climate: "Climate Control",
    technology: "Bluetooth / Charging",
    intro:
      "Private SUV and sedan rental carries up to 7 passengers with privacy glass, climate control and Bluetooth audio. They're right for small executive transfers, tight airport pickups and trips where the group splits between a Sprinter and a car is more practical.",
    useCases: [
      { title: "The point-to-point transfer", text: "Two travelers, one hotel, no stops. The sedan run is the quiet, direct option when a group vehicle would be half-full." },
      { title: "The early flight", text: "A 5 a.m. terminal run with one driver and no other passengers is a different product from a shared shuttle. It runs on your clock, not a route." },
      { title: "The split-day errand", text: "Three people, five stops on opposite sides of town. One driver on a fixed list beats three rideshares and a shared map no one agrees on." },
    ],
    planningTips: [
      "Seats up to 7. More than 5 adults with luggage moves to a Sprinter.",
      "7 carry-ons is the practical ceiling. Full-size suitcases ride better in a minibus.",
      "For airport pickups, meet-at-arrivals beats the shuttle queue, and the driver can track late landings.",
      "Privacy glass and Bluetooth audio are standard on most vehicles.",
    ],
    whyChoose: [
      "Point-to-point on your clock: no route, no other passengers, no shuttle queue.",
      "Meet-at-arrivals service without waiting at a shared pickup station.",
      "Right-sized for 1 to 7 people, where a group vehicle would be three-quarters empty.",
      "Privacy glass and a professional driver for executive rides.",
    ],
    features: [
      "Seats up to 7 passengers",
      "Climate control and privacy glass",
      "Bluetooth audio and charging",
      "Up to 7 carry-ons",
    ],
    bestFor: [
      { label: "Corporate Event Transportation", href: "/services/corporate-transportation/" },
      { label: "Group Airport Shuttle", href: "/services/airport-transfer/" },
    ],
    faqs: [
      { q: "How many passengers fit in an SUV or sedan?", a: "Up to 7 passengers. Larger groups split across vehicles or move up to a Sprinter van." },
      { q: "Is there room for luggage?", a: "About 7 carry-ons. For full-size suitcases and gear, a minibus or charter bus is the better match." },
      { q: "Do SUVs come with a driver?", a: "Yes—every vehicle comes with a professional driver; there is no self-drive option." },
      { q: "When is an SUV the right choice?", a: "Small executive transfers, airport pickups of a few people, and trips where parking or access rules out bigger vehicles." },
    ],
    metaTitle: "SUV & Sedan Rental With Driver | Up to 7 Passengers",
    metaDescription:
      "Rent an SUV or sedan with a professional driver for up to 7 passengers. Airport transfers and executive point-to-point trips nationwide.",
  },
];

export function getVehicle(slug: string): Vehicle | undefined {
  return VEHICLES.find((v) => v.slug === slug);
}

export const SERVICE_META: Record<
  string,
  { name: string; title: string; eyebrow: string; h1: string; intro: string; metaTitle: string; metaDescription: string }
> = {
  "corporate-transportation": {
    name: "Corporate Event Transportation",
    title: "Corporate Event Transportation",
    eyebrow: "Professional Group Logistics",
    h1: "Corporate Shuttle Service for Conferences, Retreats & Employee Transportation",
    intro: "Coordinating transportation for a conference, an off-site retreat, or a daily employee shuttle takes more planning than booking a few rideshares and hoping everyone arrives on time. A corporate shuttle keeps your team, clients, or attendees moving on a predictable schedule, with a professional appearance that matches the event. Cascade Charter Bus arranges corporate transportation nationwide, from one-time events to recurring shuttle routes.",
    metaTitle: "Corporate Event Transportation & Shuttle Service",
    metaDescription:
      "Corporate shuttle service for conferences, retreats and daily employee routes. Professional drivers, recurring schedules available. Get a fast quote.",
  },
  "wedding-transportation": {
    name: "Wedding Shuttle Bus Rental",
    title: "Wedding Shuttle Bus Rental",
    eyebrow: "Seamless Guest Experience",
    h1: "Wedding Shuttle Service for Your Guests, Wedding Party & Bachelorette Crew",
    intro: "A wedding shuttle keeps guests moving between hotels, the ceremony and the reception without parking stress or late arrivals. Cascade Charter Bus plans guest loops for weddings across the country—rehearsal dinners, ceremony-to-reception runs, and late pickups after the send-off. Gratuity is included in every quote, and the quote you receive is final.",
    metaTitle: "Wedding Shuttle Bus Rental for Guests & Party",
    metaDescription:
      "Wedding shuttle bus rental with guest hotel loops, ceremony-to-reception runs and party buses. Gratuity included. Get a fast, final quote.",
  },
  "school-transportation": {
    name: "School & Field Trip Transportation",
    title: "School & Field Trip Transportation",
    eyebrow: "Certified Safety",
    h1: "School Trip & Field Trip Bus Rental With DOT-Certified Drivers",
    intro: "Field trips run on tight schedules and strict safety standards. Cascade Charter Bus provides school buses and charter buses for school districts, private schools and colleges—DOT-certified drivers, background-checked and trained on group management for young passengers. One call covers the whole run, from morning pickup to the final drop-off.",
    metaTitle: "School & Field Trip Bus Rental | Safe Group Transport",
    metaDescription:
      "Field trip bus rental with DOT-certified, background-checked drivers. School buses and charter buses for districts, schools and colleges. Free quote.",
  },
  "sports-team-transportation": {
    name: "Sports Team Transportation",
    title: "Sports Team Transportation",
    eyebrow: "The Athlete's Choice",
    h1: "Sports Team Bus Rental for Games, Tournaments & Season Travel",
    intro: "Team travel fails in the details: gear that doesn't fit, arrival windows that slip, and a bus that can't handle the equipment load. Cascade Charter Bus moves teams and their gear to games and tournaments nationwide—charter buses for full rosters, minibuses for staff runs, and luggage bays sized for the equipment.",
    metaTitle: "Sports Team Bus Rental | Games & Tournament Travel",
    metaDescription:
      "Sports team bus rental with gear bays, punctual arrivals and DOT-certified drivers. Charter buses and minibuses for teams and tournaments.",
  },
  "airport-transfer": {
    name: "Group Airport Shuttle",
    title: "Group Airport Shuttle",
    eyebrow: "Punctual Arrivals",
    h1: "Group Airport Shuttle Service & Corporate Airport Transfers",
    intro: "An airport run with a group is one job with three clocks: your people, their bags, and the flight. Cascade Charter Bus runs group airport shuttles nationwide—arrival pickups at the terminal, departure drop-offs with time to spare, and flight tracking on request so a late landing doesn't leave the bus gone.",
    metaTitle: "Group Airport Shuttle & Airport Transfer Service",
    metaDescription:
      "Group airport shuttle service with terminal pickups, flight tracking and room for luggage. Sprinters, minibuses and motorcoaches nationwide.",
  },
  "sightseeing-tour-bus": {
    name: "Sightseeing & Tour Bus Rental",
    title: "Sightseeing & Tour Bus Rental",
    eyebrow: "Extended Journeys",
    h1: "Sightseeing & Charter Tour Bus Rental for Guided Group Trips",
    intro: "A good tour day is a routing problem: which stop, which order, how long at each one. Cascade Charter Bus runs sightseeing and multi-day tours with a driver who knows coach routing and the logistics of parking a 45-foot bus at attractions. From single-day city loops to weeklong journeys, we build the schedule around the stops you want.",
    metaTitle: "Sightseeing & Tour Bus Rental | Guided Group Trips",
    metaDescription:
      "Sightseeing and tour bus rental for day trips and multi-day journeys. Coach routing by experienced drivers, restrooms on board, WiFi on most coaches.",
  },
  "church-religious-transportation": {
    name: "Church & Religious Group Transportation",
    title: "Church & Religious Group Transportation",
    eyebrow: "Respectful & Reliable",
    h1: "Church Bus Rental for Retreats, Camps & Congregation Events",
    intro: "Congregation travel runs on volunteers' time and trust. Cascade Charter Bus handles church group transportation for retreats, camps, conferences and weekly services—charter buses, minibuses and sprinters with drivers who plan the schedule with your group leaders instead of showing up with questions.",
    metaTitle: "Church & Religious Group Bus Rental",
    metaDescription:
      "Church bus rental for retreats, camps, conferences and congregation events. Respectful, reliable service with DOT-certified drivers. Free quote.",
  },
  "band-tour-bus": {
    name: "Band Tour Bus",
    title: "Band Tour Bus",
    eyebrow: "Tour-Grade Equipment",
    h1: "Band Tour Bus Rental for Musicians, Crews & Gear",
    intro: "Tour travel is overnight, gear-heavy and schedule-critical. Cascade Charter Bus rents sleeper buses with up to 15 bunks, a restroom and shower on board, and lounges for the crew—plus vans and minibuses for local dates. Dispatch stays available around the clock, which matters most when the route slips past midnight.",
    metaTitle: "Band Tour Bus Rental | Sleeper Coaches With Bunks & Shower",
    metaDescription:
      "Band tour bus rental with sleeper coaches (up to 15 bunks, restroom and shower on board), lounges and gear storage. Nationwide routing with 24/7 dispatch.",
  },
};

export function getService(slug: string) {
  return SERVICE_META[slug];
}
