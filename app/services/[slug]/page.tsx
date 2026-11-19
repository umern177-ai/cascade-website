// Service page template — the clearer page format from brief Section 7.2 on the
// same live theme: what it is / who it's for, which vehicle fits, how booking
// works, how pricing works, why Cascade, FAQ, CTA. All numbers come from
// lib/fleet-data.ts so hub, pages and cards can never disagree.

import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { fleetMain } from "@/lib/fleet-photos";
import { SERVICES } from "@/lib/site-data";
import { SERVICE_META } from "@/lib/fleet-data";

import { pageMeta } from "@/lib/page-meta";

type ServiceFaq = { q: string; a: string };

const SERVICE_FAQS: Record<string, ServiceFaq[]> = {
  "corporate-transportation": [
    { q: "Can you provide a recurring employee shuttle, not just a one-time event?", a: "Yes—we arrange both one-time event transportation and recurring shuttle schedules with a consistent driver and vehicle." },
    { q: "Do your vehicles have WiFi for conference attendees?", a: "WiFi, power outlets, an audio system and screens are available on most motorcoaches—tell us this is a requirement when you request your quote and we'll confirm the vehicle." },
    { q: "How far in advance should we book conference transportation?", a: "For large conferences or convention-season dates in busy cities, book several weeks ahead. Smaller or off-peak trips can usually be arranged with less notice." },
    { q: "Can you handle multi-day event transportation?", a: "Yes—we coordinate multi-day conference or retreat transport, including different pickup points each day." },
    { q: "Do you provide invoicing for business bookings?", a: "Yes—we can provide the documentation your finance team needs. Ask when you request your quote." },
  ],
  "wedding-transportation": [
    { q: "Is gratuity included in the quote?", a: "Yes—gratuity is included in your quote, along with the vehicle, driver, tolls and taxes. The quote you receive is final." },
    { q: "When is your busiest wedding season?", a: "Peak season runs May through November. Those dates fill first—book roughly 2–3 months ahead for peak-season weddings." },
    { q: "How many buses do I need for my guest count?", a: "As a rough guide, a minibus fits 20–30 guests and a full-size motorcoach fits up to 56. We'll calculate the right number of vehicles and trips from your guest list." },
    { q: "Can we use a school bus for a more affordable wedding shuttle?", a: "Yes—a school bus is typically the most affordable per-seat option, and many couples choose one for guest shuttles when budget matters more than amenities." },
    { q: "Can we book a separate bus for the bachelor or bachelorette party?", a: "Yes—a party bus or limo bus with sound system and lighting is a popular separate booking from the main wedding-day shuttle." },
  ],
  "school-transportation": [
    { q: "Are your drivers screened for trips with children?", a: `Yes—every driver is DOT-certified and background-checked. Vehicles arrive with the safety checks completed and the driver briefed on your schedule.` },
    { q: "Do buses come equipped for student trips?", a: "On most charter buses: reclining seats, A/C and a PA system. WiFi is on most motorcoaches. Tell us what the trip needs and we'll match the vehicle." },
    { q: "How far ahead should field trips be booked?", a: "Book 2–6 weeks ahead for spring and fall field-trip season; large districts' peak dates fill early. Same-week requests are often workable—call dispatch." },
    { q: "Can you run multiple buses for a whole grade?", a: "Yes—we regularly run several vehicles in convoy with one coordinator for arrival and dismissal timing." },
  ],
  "sports-team-transportation": [
    { q: "Can buses carry team gear and equipment?", a: "Yes—charter bus under-bus bays hold 50–60 large bags, sized for team gear. School buses have no luggage bay, so match the vehicle to the equipment load." },
    { q: "Do you work with tournament schedules that change?", a: "Yes—tournament brackets move. Dispatch stays reachable during the trip and re-times pickups when games shift." },
    { q: "How many players fit on a charter bus?", a: "52–56 seats with 50–60 bag storage—standard for a full roster plus staff. Smaller rosters often use minibuses (20–32)." },
    { q: "Can you handle multi-game weekend trips?", a: "Yes—multi-day travel with overnight stays is routine. Tell us the itinerary and we'll quote the full run." },
  ],
  "airport-transfer": [
    { q: "Do you track flights for pickup?", a: "Yes—on arrival pickups we can watch the flight so a late landing doesn't leave your bus gone. Ask for it when you book." },
    { q: "Where do drivers meet arriving groups?", a: "At the agreed meeting point outside the terminal—curb, arrivals door or a nearby gathering point. We confirm the exact spot when you book." },
    { q: "How much luggage fits for airport trips?", a: "Charter buses hold 50–60 large bags; sprinter vans carry carry-ons; school buses have no luggage bay. Match the vehicle to your bags—minibuses are the usual middle ground." },
    { q: "How early should the bus be there for a departure?", a: `We plan departures to reach the terminal with check-in and security time to spare—tell us the flight time and the dispatch team schedules the pickup backwards from it.` },
  ],
  "sightseeing-tour-bus": [
    { q: "Can you plan the stops and route?", a: "Yes—give us the must-see list and the dispatch team builds the driving plan, including realistic stop times and coach parking at each attraction." },
    { q: "Do the buses have restrooms for long tour days?", a: "Charter buses do; minibuses and sprinter vans do not. For full-day tours, most groups use a motorcoach." },
    { q: "How long can a tour day run?", a: "Full-day tours are normal. Drivers work to federal hours-of-service rules—multi-day tours are scheduled with relief drivers where needed." },
    { q: "Can you handle multi-day tours?", a: "Yes—one-day city loops to weeklong journeys, including overnight routing and hotels for the driver." },
  ],
  "church-religious-transportation": [
    { q: "Can you transport large congregation groups?", a: `Yes—charter buses seat 52–56 and school buses up to 60; multiple vehicles run in convoy with one coordinator.` },
    { q: "Do you handle multi-day retreats and camps?", a: "Yes—retreats and camps are scheduled like any multi-day trip, with luggage bays for gear and rest-day pickup times." },
    { q: "How far ahead should we book?", a: "For retreat and camp season, 4–8 weeks ahead. Weekly service routes can start with a couple of weeks' notice." },
    { q: "Can the driver stay with the group all day?", a: "Yes—drivers stay on-site or arrange turnaround loops, whichever suits the day's plan." },
  ],
  "band-tour-bus": [
    { q: "How many bunks does a sleeper bus have?", a: "Sleeper buses have up to 15 bunks, depending on the bus. Tell us your headcount and we match the right coach." },
    { q: "Is there a shower and restroom on board?", a: "Yes—sleeper buses have both a restroom and a shower on board." },
    { q: "Can the bus pull a trailer for gear?", a: "Trailer options depend on the specific coach and route. Tell us what gear you're moving and dispatch confirms what's available for your dates." },
    { q: "How do driver hours work on overnight runs?", a: "Drivers work to federal hours-of-service rules. Long overnight routes are scheduled with relief drivers or timed rest stops so the tour stays legal and safe." },
  ],
  "winery-tour-bus-rental": [
    { q: "How far ahead should we book a winery tour?", a: "The earlier the better for spring and fall weekends, when tasting rooms fill first. Mid-week plans can often be quoted the same day the trip details come in." },
    { q: "Can the bus wait at every stop?", a: "Yes—your group keeps the same bus and driver all day. The driver waits at each winery in the nearest legal parking spot, so nothing gets left behind and nobody is ever waiting for a different vehicle to arrive." },
    { q: "Can you pick up from several hotels?", a: "Yes. Give us the addresses and the group splits across the pickup points you set. Multi-pickup routing is confirmed in the written quote before anything is booked." },
    { q: "What if a winery is down a narrow or dirt road?", a: "Tell us when you send the stop list. We match a vehicle that fits the road and the driver knows it before travel day, so the plan never depends on a driveway a bus cannot use." },
    { q: "Can we bring snacks or a cooler on board?", a: "Ask when you request the quote—rules vary by vehicle and by the licensed operators in our network. If a cooler is fine, tell us the size so the storage is planned around it." },
    { q: "Do you do winery trips for bachelorette and birthday groups?", a: "Yes, and a party bus is a popular pick for those nights. Book the tastings first so the schedule is built around the reservations, and tell us the vibe—you may want more driving music than a quiet club outing." },
  ],
  "military-group-transportation": [
    { q: "Can you move a whole unit with several buses on one booking?", a: "Yes. Several vehicles book as one move—shared arrival windows, a convoy order and one coordinator—priced as a single itinerary rather than separate orders." },
    { q: "Can you pick up at the base gate or a specific building?", a: "Yes. Give us the gate, building number or lot and it goes into the driver's plan. Where visitor rules limit access, the pickup moves to the closest legal point and the walking distance is kept short." },
    { q: "Can the driver wait during a ceremony?", a: "Yes. The driver waits on-site or returns at an agreed time. Long ceremonies are scheduled with federal driver-hours limits in mind, so the wait does not knock the return off plan." },
    { q: "Do you handle trips for veteran groups and reunions?", a: "Yes, including multi-day reunions, memorial trips and museum visits. Luggage help at the vehicle is arranged on request, and pickup points are set with the group's walking distances in mind." },
    { q: "How far ahead should we book?", a: "As early as you can, especially for large moves and weekend dates. Short-notice requests are welcome—dispatch answers around the clock, and quotes for urgent work go out the same day." },
    { q: "Do you offer a military discount?", a: "Yes. A 10% military discount applies to military group bookings. Mention it when you request the quote, and dispatch includes it in the final price." },
    { q: "What paperwork can you provide?", a: "A written quote, a W-9 and the operator's certificate of insurance (COI). The operator's USDOT number and vehicle details go in the quote too, so base gate staff have what they need." },
  ],
  "government-transportation": [
    { q: "Do you provide the operator's USDOT number?", a: "Yes. The trip is run by licensed operators in our network, and the operator's USDOT number and vehicle details are provided with the quote, including what gate staff may need." },
    { q: "Can you run daily shuttles for a set period?", a: "Yes. Shuttle programs run on fixed timetables for weeks or months at a stretch, with the same vehicle and driver where schedules allow, and one contact who manages the pattern." },
    { q: "Do you offer wheelchair-accessible vehicles?", a: "Yes, on request. A suitable wheelchair-accessible vehicle is confirmed in writing before the booking is final, so give as much notice as the timeline allows." },
    { q: "Can you cover trips in more than one state?", a: "Yes. Trips are booked across all 50 states, so a route that crosses state lines is planned and quoted as one itinerary with the same contact from start to finish." },
    { q: "What paperwork can you provide?", a: "A written quote, a W-9 and the operator's certificate of insurance (COI). The operator's USDOT number and vehicle details are included with the quote where an agency needs them for gate access." },
  ],
  "casino-bus-trips": [
    { q: "Can the bus wait all day at the casino?", a: "Yes. The usual setup is the driver waiting on site until your set return time, or the group choosing an earlier departure. Long waits sit within federal driver-hours limits, and the quote states exactly how the day is planned." },
    { q: "Can we stop for food on the way?", a: "Yes. Named stops go into the route when you send the itinerary, timed so the food break does not eat into your floor time." },
    { q: "Is there a minimum group size?", a: "No fixed minimum. Small groups often take a Sprinter van (up to 14), while bigger outings split across a minibus or coach—priced as one booking either way." },
    { q: "Do you do overnight casino trips?", a: "Yes. Two-day and overnight plans are common for distant casinos. The coach stays with the group, and the plan includes the hotel stop and day-two timings." },
    { q: "Can we drink on the bus?", a: "That depends on state law and the licensed operators in our network, and it is confirmed before booking rather than promised. Ask when you request the quote and we confirm for your route." },
    { q: "Can you pick up from more than one location?", a: "Yes. Send the addresses and the route is built around them, with pickup windows confirmed in the written quote before anything is booked." },
  ],
};

const HOW_BOOKING = "Send the trip details (dates, headcount, luggage, route) through the form or the 24/7 line. You get a detailed quote—usually within about 15 minutes. Confirm, and the driver arrives early with the plan already set.";

// Real service photos supplied by the owner (processed in
// scripts/process-service-photos.mjs: WebP, resized, EXIF/GPS stripped).
// band-tour-bus uses the fleet sleeper photo (no owner service photo yet).
const SERVICE_PHOTOS: Record<string, { src: string; alt: string }[]> = {
  "corporate-transportation": [
    { src: "/images/services/corp.webp", alt: "Passengers riding a charter coach to a corporate event at sunset" },
    { src: "/images/services/corp2.webp", alt: "Reclining coach seats on a corporate shuttle" },
    { src: "/images/services/corp3.webp", alt: "Business groups arriving for a corporate meeting in a downtown street" },
  ],
  "wedding-transportation": [
    { src: "/images/services/wed.webp", alt: "Wedding couple greeting guests riding a cream shuttle bus" },
    { src: "/images/services/wed2.webp", alt: "Wedding party celebrating with confetti at the venue" },
    { src: "/images/services/wed3.webp", alt: "Bride and groom beside a white limousine at a wedding venue" },
  ],
  "school-transportation": [
    { src: "/images/services/school.webp", alt: "Students boarding a yellow school bus for a field trip" },
    { src: "/images/services/school2.webp", alt: "District yellow school bus driving along a coastal road" },
  ],
  "sports-team-transportation": [
    { src: "/images/services/sport.webp", alt: "Soccer team lined up on the pitch before a match" },
  ],
  "airport-transfer": [
    { src: "/images/services/airport.webp", alt: "Group shuttle bus waiting on the airport apron beside the terminal" },
    { src: fleetMain("sprinter-van", "/images/fleet/sprinter.jpg"), alt: "Black Sprinter van parked beside aircraft on an airport apron" },
  ],
  "sightseeing-tour-bus": [
    { src: "/images/services/multi.webp", alt: "White motorcoach driving down a scenic mountain road" },
  ],
  "church-religious-transportation": [
    { src: "/images/services/church.webp", alt: "Two executive minibuses parked on a city street ready for a group shuttle" },
  ],
  "band-tour-bus": [
    { src: fleetMain("sleeper", "/images/fleet/sleeper.jpg"), alt: "Sleeper tour bus used for band tours" },
  ],
  "winery-tour-bus-rental": [
    { src: "/images/services/winery.webp", alt: "Vineyard rows in wine country" },
    { src: "/images/services/winery2.webp", alt: "Friends toasting with wine glasses among the vines" },
    { src: "/images/services/winery3.webp", alt: "A group tasting wine in a winery cellar" },
  ],
  "military-group-transportation": [
    { src: "/images/services/military.webp", alt: "The American flag against a blue sky" },
    { src: fleetMain("charter-bus", "/images/fleet/charter.jpg"), alt: "Charter bus used for military group transportation" },
  ],
  "government-transportation": [
    { src: "/images/services/government.webp", alt: "The United States Capitol building" },
    { src: fleetMain("minibus", "/images/fleet/mini.jpg"), alt: "Minibus shuttle for a government agency" },
  ],
  "casino-bus-trips": [
    { src: fleetMain("party-bus", "/images/fleet/limo.jpg"), alt: "Party bus hired for a casino night out" },
    { src: fleetMain("charter-bus", "/images/fleet/charter.jpg"), alt: "Charter coach waiting for a casino group" },
  ],
};


// Per-service humanized content (unique wording per page, brief Section 12).
const SERVICE_STORY: Record<string, { step: string; text: string }[]> = {
  "corporate-transportation": [
    { step: "Tell us the schedule", text: "Meeting times, venue addresses, headcount. For recurring shuttles, the weekly pattern is enough to price." },
    { step: "Review the plan", text: "You get a written itinerary and one final quote, usually in about 15 minutes." },
    { step: "Pre-trip check", text: "The driver is briefed on your pickup points, and day-of changes are confirmed with one message." },
    { step: "Ride days", text: "Dispatch stays reachable while the shuttle runs, so a late meeting shifts pick-up without a scramble." },
  ],
  "wedding-transportation": [
    { step: "Share the timeline", text: "Ceremony and reception times, hotel block address, expected guest count." },
    { step: "Review the loop plan", text: "We propose the shuttle schedule and one final quote that includes gratuity, tolls and taxes." },
    { step: "Confirm the fleet", text: "Minibuses or school buses sized to your guest list, and a party bus for the send-off if you want one." },
    { step: "Wedding day", text: "Drivers arrive early, the loops run on schedule, and the last pickup lands at the agreed time." },
  ],
  "school-transportation": [
    { step: "Send the trip sheet", text: "Destination, roster size, departure windows and any parking instructions from the venue." },
    { step: "Review the quote", text: "One final price with the driver, tolls and taxes, and school or charter buses sized to the roster." },
    { step: "Safety brief", text: "The driver is briefed on group management with young passengers and on your chaperone checkpoints." },
    { step: "Trip day", text: "On-time pickups, a schedule the lead chaperone can follow, and a phone number to call during the day." },
  ],
  "sports-team-transportation": [
    { step: "Send the schedule", text: "Games, venue addresses, roster and the gear load." },
    { step: "Review the routing", text: "We match the bus size to the gear and plan arrival windows with warm-up time built in." },
    { step: "Confirm the run", text: "One final quote, and multi-game weekends are scheduled as one trip rather than five bookings." },
    { step: "Game days", text: "Gear rides with the team, and dispatch re-times pickups when the bracket shifts." },
  ],
  "airport-transfer": [
    { step: "Send flight details", text: "Airline, flight numbers, terminal, headcount and bags." },
    { step: "Review the plan", text: "We propose pickup timing around the flight and confirm vehicle size for the luggage." },
    { step: "Confirm", text: "One final quote. Arrival pickups can include flight tracking, so a late landing does not leave the bus." },
    { step: "Travel day", text: "The driver meets the group at the agreed point and dispatch stays reachable the whole way." },
  ],
  "sightseeing-tour-bus": [
    { step: "List your must-sees", text: "Stops, dates and rough timing. Half-day or multi-day, it works the same way." },
    { step: "Review the route", text: "We build the driving plan with realistic stop times and coach parking at each attraction." },
    { step: "Confirm", text: "One final quote with the vehicle matched to the length of the day and the luggage." },
    { step: "Tour days", text: "The driver holds the schedule, and rest stops fall where the group needs them, not where the fuel light does." },
  ],
  "church-religious-transportation": [
    { step: "Send the plan", text: "Event dates, congregation size, pickup points and any multi-day routing." },
    { step: "Review the quote", text: "One final price, with charter buses, school buses or minibuses sized to headcount and gear." },
    { step: "Confirm the vehicles", text: "Multi-bus runs go in convoy with one coordinator so nobody waits on a second vehicle." },
    { step: "Trip day", text: "Drivers coordinate with your group leaders and stay reachable for the whole run." },
  ],
  "band-tour-bus": [
    { step: "Send the routing", text: "Show dates, venues, headcount and the gear list. Overnight legs are planned around driver hours from the start." },
    { step: "Match the sleeper", text: "We confirm a sleep bus with up to 15 bunks and a restroom and shower on board, sized to your crew." },
    { step: "Confirm the tour block", text: "One final quote for the full run, including gear storage and any day-leg vehicles." },
    { step: "On the road", text: "Dispatch stays available around the clock. When a show runs long, the plan moves with you." },
  ],
  "winery-tour-bus-rental": [
    { step: "Share your trip", text: "Send the winery list, date, headcount and pickup addresses by form or phone. Tasting reservations in hand are even better." },
    { step: "Get a written quote", text: "Same day: the vehicle, the stop order and one final price." },
    { step: "Confirm in writing", text: "Approve the itinerary. Later changes to stops or times are confirmed with one message." },
    { step: "Ride", text: "The driver arrives early and holds the plan through tastings and parking." },
  ],
  "military-group-transportation": [
    { step: "Share your trip", text: "Send the move details: pickup point, destination, times and headcount, by form or phone at any hour." },
    { step: "Get a written quote", text: "Same day: vehicles, schedule and one all-inclusive price." },
    { step: "Confirm in writing", text: "Approve the itinerary. Changes to stops or times are confirmed with one message." },
    { step: "Ride", text: "The driver arrives ahead of the pickup time, and dispatch stays reachable for the whole trip." },
  ],
  "government-transportation": [
    { step: "Share your trip", text: "Send the requirement: sites, dates, headcount and any gate or paperwork details the agency needs." },
    { step: "Get a written quote", text: "Same day, in writing: vehicle, schedule, operator details and one final price." },
    { step: "Confirm in writing", text: "Approve the itinerary. Schedule changes are confirmed with one message." },
    { step: "Ride", text: "One contact for the whole trip, with dispatch reachable around the clock." },
  ],
  "casino-bus-trips": [
    { step: "Share your trip", text: "Tell us the casino, the date, the group size and any stops on the way home." },
    { step: "Get a written quote", text: "Same day: the vehicle, the day's shape—including wait or return times—and one final price." },
    { step: "Confirm in writing", text: "Approve the itinerary. Changes are confirmed with one message." },
    { step: "Ride", text: "The driver arrives early, waits where it makes sense, and brings everyone home." },
  ],
};

// TODO (owner): confirm the unnamed congregational trip (was in the retired
// SERVICE_EXAMPLE data) before publishing any "real booking example" box.
const CROSS_LINKS: Record<string, { href: string; anchor: string; lead: string }[]> = {
  "sightseeing-tour-bus": [
    { href: "/services/winery-tour-bus-rental/", anchor: "winery tour bus rental", lead: "Planning a wine country day trip? The same planning goes into our" },
  ],
  "wedding-transportation": [
    { href: "/services/winery-tour-bus-rental/", anchor: "winery tour bus rental", lead: "Bachelorette weekends and wine-country hen parties are booked through our" },
  ],
  "corporate-transportation": [
    { href: "/services/government-transportation/", anchor: "government charter bus rental", lead: "Agencies and public-sector work are handled on our" },
  ],
  "airport-transfer": [
    { href: "/services/military-group-transportation/", anchor: "military group transportation", lead: "Base-to-airport moves sit under our" },
  ],
  "church-religious-transportation": [
    { href: "/services/casino-bus-trips/", anchor: "casino bus trips", lead: "Senior and club groups often book our" },
    { href: "/services/military-group-transportation/", anchor: "military group transportation", lead: "For veterans' organizations, see our" },
  ],
  "winery-tour-bus-rental": [
    { href: "/services/sightseeing-tour-bus/", anchor: "sightseeing & tour bus rental", lead: "Multi-day wine regions pair well with our" },
    { href: "/services/wedding-transportation/", anchor: "wedding shuttle bus rental", lead: "Wedding-party weekends start on our" },
  ],
  "military-group-transportation": [
    { href: "/services/airport-transfer/", anchor: "group airport shuttle", lead: "Terminals and arrival runs are covered on our" },
    { href: "/services/government-transportation/", anchor: "government transportation", lead: "Public-sector side trips belong on our" },
  ],
  "government-transportation": [
    { href: "/services/corporate-transportation/", anchor: "corporate event transportation", lead: "Staff-facing events borrow from our" },
    { href: "/services/military-group-transportation/", anchor: "military group transportation", lead: "Ceremonial group moves are detailed on our" },
  ],
  "casino-bus-trips": [
    { href: "/services/sightseeing-tour-bus/", anchor: "sightseeing & tour bus rental", lead: "Longer touring itineraries sit on our" },
    { href: "/services/church-religious-transportation/", anchor: "church group transportation", lead: "Congregation and club outings start on our" },
  ],
};

const SERVICE_TRIP_EXAMPLES: Record<string, string[]> = {  "corporate-transportation": [
    "A 40-person hotel-to-venue loop for an awards dinner",
    "A daily employee shuttle with the same driver all quarter",
    "An offsite move for a 120-person firm, with two coaches in convoy",
    "Client airport pickups split between a Sprinter and a sedan",
  ],
  "wedding-transportation": [
    "A hotel-to-barn loop for 120 guests with three minibuses",
    "Ceremony and reception runs timed to the photography schedule",
    "A school-bus guest shuttle for a 60-guest backyard wedding",
    "A party bus booked by the hour for the bachelor crew",
  ],
  "school-transportation": [
    "A 55-student museum run with two chaperone checkpoints",
    "A college-visit trip for a 12th-grade class",
    "A campus shuttle during orientation week",
    "A band-and-orchestra trip with instrument cases in the bays",
  ],
  "sports-team-transportation": [
    "A 34-player soccer roster with gear bays for a weekend tournament",
    "A 5 a.m. hockey run with two minibuses and a Sprinter",
    "A cheer squad loop between hotel and arena",
    "A season arrangement for weekly league fixtures",
  ],
  "airport-transfer": [
    "A 28-person arrivals pickup with a full charter bus",
    "A 4 a.m. departure run with a Sprinter for a 14-person crew",
    "A cruise-terminal transfer with a minibus",
    "A corporate arrivals block: two Sprinters, five flights, one contact",
  ],
  "sightseeing-tour-bus": [
    "A day loop through the city with a 50-seat coach",
    "A fall-foliage run with three stops and a late lunch",
    "A multi-day tour with the same driver all week",
    "A winery afternoon: three tastings, one designated driver",
  ],
  "church-religious-transportation": [
    "A youth-group retreat with gear in the bays",
    "A 50-seat run to a conference center two states away",
    "A weekly service loop with the same driver every Sunday",
    "A choir trip with a minibus and instrument space",
  ],
  "band-tour-bus": [
    "A 10-bunk sleeper routing a five-show week",
    "A 15-bunk sleeper for a full band plus crew",
    "A day-leg charter for the acoustic dates",
    "A Sprinter for load-in runs between venue and hotel",
  ],
  "winery-tour-bus-rental": [
    "A three-stop tasting afternoon with pickups from two hotels",
    "A wine-club weekend with the same driver on both days",
    "A bachelorette run with a party bus and a late hotel return",
    "A club outing through a valley wine trail, cooler space requested",
  ],
  "military-group-transportation": [
    "A pre-dawn base-to-airport run with a headcount roster",
    "A graduation day pickup at the visitor center, timed to the ceremony",
    "A training transfer with two vehicles in convoy",
    "A veterans' reunion with pickup help arranged at the hotel",
  ],
  "government-transportation": [
    "A conference shuttle loop between two halls all week",
    "A delegation arrivals met at the terminal with a Sprinter",
    "Election-day staff runs on a fixed timetable",
    "A multi-site field visit with one contact holding the plan",
  ],
  "casino-bus-trips": [
    "An evening run to a regional casino with a set return time",
    "A senior-center day trip with a minibus and step-free boarding",
    "A birthday night out with a party bus and a food stop en route",
    "An overnight two-day trip with the same coach and driver",
  ],
};

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = SERVICE_META[slug];
  if (!meta) return {};
  return pageMeta({
    title: meta.metaTitle,
    description: meta.metaDescription,
    path: `/services/${slug}/`,
  });
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = SERVICE_META[slug];
  const faqs = SERVICE_FAQS[slug];
  if (!meta || !faqs) notFound();
  const photos = SERVICE_PHOTOS[slug];

  // Vehicle recommendations (brief 7.2: group size → vehicle → why)
  const vehiclesFor: Record<string, { slug: string; why: string }[]> = {
    "corporate-transportation": [
      { slug: "charter-bus", why: "Full conference groups and long transfers" },
      { slug: "minibus", why: "Executive loops and hotel-to-venue runs" },
      { slug: "sprinter-van", why: "Small leadership teams and airport pickups" },
    ],
    "wedding-transportation": [
      { slug: "minibus", why: "Guest hotel loops (20–32 guests each)" },
      { slug: "school-bus", why: "Budget-friendly guest shuttles, short distances" },
      { slug: "party-bus", why: "Bachelor/bachelorette parties and send-offs" },
    ],
    "school-transportation": [
      { slug: "school-bus", why: "Local field trips, lowest per-seat cost" },
      { slug: "charter-bus", why: "Longer trips with luggage and restroom" },
      { slug: "minibus", why: "Small groups and tight campus roads" },
    ],
    "sports-team-transportation": [
      { slug: "charter-bus", why: "Full roster plus staff, 50–60 bag gear bays" },
      { slug: "minibus", why: "Staff runs and local fixtures" },
      { slug: "school-bus", why: "Short tournament hops without heavy gear" },
    ],
    "airport-transfer": [
      { slug: "minibus", why: "Mid-size groups with real luggage" },
      { slug: "sprinter-van", why: "Small groups, fast terminal pickups" },
      { slug: "charter-bus", why: "Big groups and heavy luggage" },
    ],
    "sightseeing-tour-bus": [
      { slug: "charter-bus", why: "Full-day comfort: restroom, WiFi, big storage" },
      { slug: "minibus", why: "Small touring groups on narrow streets" },
      { slug: "sleeper", why: "Multi-day journeys with overnight driving" },
    ],
    "church-religious-transportation": [
      { slug: "charter-bus", why: "Congregation retreats with luggage" },
      { slug: "school-bus", why: "Short local runs at the lowest cost" },
      { slug: "minibus", why: "Small committees and choir trips" },
    ],
    "band-tour-bus": [
      { slug: "sleeper", why: "Overnight legs: up to 15 bunks, restroom & shower on board" },
      { slug: "charter-bus", why: "Day legs and heavy gear in under-bus bays" },
      { slug: "sprinter-van", why: "Local dates and load-in runs" },
    ],
    "winery-tour-bus-rental": [
      { slug: "sprinter-van", why: "Up to 14 guests; fits narrow vineyard lanes" },
      { slug: "minibus", why: "20–32 guests; the everyday wine tour vehicle" },
      { slug: "party-bus", why: "14–40 guests; bachelorette and birthday outings" },
      { slug: "charter-bus", why: "52–56 guests for large club trips with big entrances" },
    ],
    "military-group-transportation": [
      { slug: "charter-bus", why: "52–56 seats for unit moves and long legs" },
      { slug: "school-bus", why: "28–60 seats; economical base-to-base transfers" },
      { slug: "minibus", why: "20–32 guests for ceremonies and staff runs" },
      { slug: "sprinter-van", why: "Up to 14 for small details and airport pickups" },
    ],
    "government-transportation": [
      { slug: "charter-bus", why: "52–56 seats for delegations and events" },
      { slug: "minibus", why: "20–32 guests for recurring staff shuttles" },
      { slug: "sprinter-van", why: "Up to 14 for visiting officials and site visits" },
      { slug: "school-bus", why: "28–60 seats when the budget matters most" },
    ],
    "casino-bus-trips": [
      { slug: "charter-bus", why: "52–56 seats with a restroom for long rides" },
      { slug: "minibus", why: "20–32 guests; the standard club outing" },
      { slug: "party-bus", why: "14–40 guests for birthdays and nights out" },
      { slug: "sprinter-van", why: "Up to 14 for small groups and quick runs" },
    ],
  };

  // Rolled out Nov 17 (owner approved the wedding demo): every service page
  // uses the premium pp-* component. The old layout below is retired but kept
  // in the file as content reference.
  const PremiumServicePage = (await import("@/components/PremiumServicePage")).default;
  return (
    <PremiumServicePage
      slug={slug}
      meta={meta}
      faqs={faqs}
      photos={photos}
      story={SERVICE_STORY[slug] || []}
      vehiclesFor={(vehiclesFor[slug] as { slug: string; why: string }[] | undefined) || []}
      trips={SERVICE_TRIP_EXAMPLES[slug] || []}
      crossLinks={CROSS_LINKS[slug] || []}
      siblings={SERVICES.filter((s) => s.slug !== slug).map((s) => ({ slug: s.slug, name: s.name }))}
    />
  );
}