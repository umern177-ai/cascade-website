// Service page template — the clearer page format from brief Section 7.2 on the
// same live theme: what it is / who it's for, which vehicle fits, how booking
// works, how pricing works, why Cascade, FAQ, CTA. All numbers come from
// lib/fleet-data.ts so hub, pages and cards can never disagree.
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, ChevronRight, Phone, ArrowLeft } from "lucide-react";
import FaqAccordion from "@/components/Faq";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SERVICES } from "@/lib/site-data";
import { getService, SERVICE_META, VEHICLES } from "@/lib/fleet-data";
import { SITE } from "@/lib/site-data";
import { notFound as nf404 } from "next/navigation";
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
};

const HOW_BOOKING = "Send the trip details (dates, headcount, luggage, route) through the form or the 24/7 line. You get a detailed quote—usually within about 15 minutes. Confirm, and the driver arrives early with the plan already set.";


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
};

const SERVICE_TRIP_EXAMPLES: Record<string, string[]> = {
  "corporate-transportation": [
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
  const siblings = SERVICES.filter((s) => s.slug !== slug).slice(0, 6);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: meta.name,
    provider: { "@type": "LocalBusiness", name: SITE.name, telephone: SITE.phoneDisplay, url: SITE.url },
    areaServed: { "@type": "Country", name: "United States" },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

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
  };

  return (
    <main className="bg-white min-vh-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="py-5 bg-dark text-white" style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="container text-center">
          <span className="text-brand-dark fw-bold text-uppercase tracking-widest mb-3 d-block">{meta.eyebrow}</span>
          <h1 className="display-4 fw-bold mb-4">{meta.h1}</h1>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2" href="/services/">
              <ArrowLeft size={16} aria-hidden="true" /> ALL SERVICES
            </Link>
            <Link className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2" href="/contact/">
              GET A QUOTE
            </Link>
          </div>
        </div>
      </section>

      <div className="container py-4">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services/" }, { label: meta.title }]} />
      </div>

      {/* 1. What this service is */}
      <section className="py-5">
        <div className="container py-4">
          <h2 className="display-6 fw-bold mb-3 text-dark">What this service is</h2>
          <p className="text-muted lead mb-4" style={{ fontSize: "1.1rem" }}>{meta.intro}</p>
        </div>
      </section>

      {/* 2. Which vehicle fits */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <h2 className="display-6 fw-bold mb-4 text-dark">Which vehicle fits</h2>
          <div className="table-responsive">
            <table className="table bg-white rounded-4 shadow-sm overflow-hidden align-middle">
              <thead>
                <tr>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Why it fits this service</th>
                </tr>
              </thead>
              <tbody>
                {(vehiclesFor[slug] || []).map((row) => {
                  const v = VEHICLES.find((x) => x.slug === row.slug);
                  if (!v) return null;
                  return (
                    <tr key={row.slug}>
                      <td className="p-3">
                        <Link href={`/fleet/${v.slug}/`} className="fw-bold text-dark text-decoration-none">
                          {v.cardName}
                        </Link>
                        <div className="x-small-bold text-muted">{v.passengers}</div>
                      </td>
                      <td className="p-3 text-muted">{row.why}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* We provide every kind of vehicle */}
      <section className="py-5 pt-0">
        <div className="container">
          <h2 className="display-6 fw-bold text-dark mb-1">Every kind of vehicle for your group, one booking</h2>
          <p className="text-muted mb-4" style={{ maxWidth: 800 }}>
            This is what a charter company with a full fleet means: whatever your group size or
            luggage load, we have the vehicle for it—and we match it in your quote instead of
            sending whatever is free. Larger groups can mix vehicles: a motorcoach for the main
            group, a minibus for staff, a Sprinter for the pickups that can&apos;t take a bus.
          </p>
          <div className="row g-2">
            {VEHICLES.map((v) => (
              <div className="col-lg-4 col-md-6" key={v.slug}>
                <a className="text-decoration-none" href={`/fleet/${v.slug}/`}>
                  <div className="p-3 bg-white border rounded-3 d-flex align-items-center justify-content-between h-100 hover-lift">
                    <span className="small fw-bold text-dark">{v.cardName}</span>
                    <span className="badge bg-primary text-dark rounded-pill px-3 py-1 x-small">{v.passengers}</span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How booking works + 4. How pricing works */}
      <section className="py-5">
        <div className="container py-4">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="p-4 bg-light border rounded-4 h-100">
                <h3 className="h4 fw-bold mb-3 text-dark">How booking works</h3>
                <p className="text-muted small lh-relaxed">{HOW_BOOKING}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 bg-light border rounded-4 h-100">
                <h3 className="h4 fw-bold mb-3 text-dark">How pricing works</h3>
                <ul className="list-unstyled text-dark mb-0">
                  <li className="mb-3 d-flex align-items-start"><span className="badge bg-primary rounded-circle me-2 mt-1">1</span><span>Vehicle type and group size</span></li>
                  <li className="mb-3 d-flex align-items-start"><span className="badge bg-primary rounded-circle me-2 mt-1">2</span><span>Trip length (hours and distance)</span></li>
                  <li className="mb-3 d-flex align-items-start"><span className="badge bg-primary rounded-circle me-2 mt-1">3</span><span>Season and local event demand</span></li>
                  <li className="mb-3 d-flex align-items-start"><span className="badge bg-primary rounded-circle me-2 mt-1">4</span><span>Overnight stays and late-night pickups</span></li>
                  <li className="mb-0 d-flex align-items-start"><span className="badge bg-primary rounded-circle me-2 mt-1">5</span><span className="fw-semibold">The quote is final—gratuity, tolls and taxes included</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Cascade — true, specific claims only */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <h2 className="display-6 fw-bold mb-4 text-dark">Why Cascade</h2>
          <div className="row g-3">
            {[
              "The quote you receive is final—no hidden fuel surcharges or driver fees, gratuity included",
              "Response in about 15 minutes, day or night",
              "DOT-certified drivers, background-checked",
              "24/7 dispatch reachable during every trip",
              "Coverage in all 50 states",
            ].map((t) => (
              <div className="col-md-6" key={t}>
                <div className="p-3 bg-white border rounded-3 d-flex align-items-center gap-3">
                  <Check size={18} className="text-primary flex-shrink-0" aria-hidden="true" />
                  <span className="text-dark small fw-medium">{t}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What your booking looks like */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <h2 className="display-6 fw-bold mb-4 text-dark">How your booking goes</h2>
          <div className="row g-4">
            {(SERVICE_STORY[slug] || []).map((st, i) => (
              <div className="col-md-6 col-lg-3" key={i}>
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                  <span className="badge bg-primary rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, fontSize: "1rem" }}>{i + 1}</span>
                  <h3 className="h6 fw-bold text-dark mb-2">{st.step}</h3>
                  <p className="text-muted small mb-0">{st.text}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-muted small mt-4 mb-0">
            The quote you receive is final — no hidden fuel surcharges or driver fees, gratuity included.
          </p>
        </div>
      </section>

      {/* Trips we run */}
      <section className="py-5">
        <div className="container py-4">
          <h2 className="display-6 fw-bold mb-4 text-dark">Trips we run all the time</h2>
          <div className="row g-3">
            {(SERVICE_TRIP_EXAMPLES[slug] || []).map((t) => (
              <div className="col-md-6" key={t}>
                <div className="p-3 bg-light border rounded-3 d-flex align-items-start gap-3">
                  <Check size={18} className="text-primary flex-shrink-0 mt-1" aria-hidden="true" />
                  <span className="text-dark small fw-medium">{t}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold text-dark">Frequently Asked Questions</h2>
            <p className="text-muted">Everything you need to know about {meta.name.toLowerCase()}.</p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <FaqAccordion faqs={faqs} idPrefix={`service-${slug}`} />
            </div>
          </div>
        </div>
      </section>

      {/* Related services */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <h2 className="display-6 fw-bold mb-4 text-center text-dark">Explore Other Services</h2>
          <div className="row g-3 d-flex flex-wrap justify-content-center">
            {siblings.map((s) => (
              <div className="col-auto" key={s.slug}>
                <Link href={`/services/${s.slug}/`} className="btn btn-outline-dark rounded-pill px-4 py-2 small fw-semibold">
                  {s.name} <ChevronRight size={14} className="ms-1" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 bg-dark text-white text-center">
        <div className="container py-4">
          <h2 className="display-6 fw-bold mb-3">Ready to Book Your {meta.name}?</h2>
          <p className="text-white-50 mb-4">Tell us your trip details and schedule to receive a fast, transparent quote.</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link className="btn btn-primary rounded-pill px-5 py-3 fw-bold btn-lg" href="/contact/">GET A FREE QUOTE</Link>
            <a className="btn btn-outline-light rounded-pill px-5 py-3 fw-bold btn-lg" href={`tel:${SITE.phoneTel}`}>
              <Phone size={16} className="me-2" aria-hidden="true" /> {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
