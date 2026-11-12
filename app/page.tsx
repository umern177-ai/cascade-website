// Home page — section order and look exactly as the live site (brief Section 7.1).
// Fixes applied per brief: confirmed facts only (5+ years, no 4.9/5, no 500+),
// heading order corrected, testimonial names kept (owner permission), FAQ answers
// start with the direct answer.
import Image from "next/image";
import Link from "next/link";
import {
  Star, Shield, Users, Clock, Briefcase, Phone,
  ArrowLeftRight, ArrowRight, RefreshCw, Repeat2, CalendarDays, Award,
} from "lucide-react";
import FaqAccordion from "@/components/Faq";
import { VEHICLES } from "@/lib/fleet-data";
import { SERVICES } from "@/lib/site-data";
import { SITE, HOME_FAQS, TESTIMONIALS, TRUSTPILOT_REVIEWS } from "@/lib/site-data";
import { pageMeta } from "@/lib/page-meta";

// Real service photos (owner-supplied, processed to WebP) — same files the
// services hub uses.
const SERVICE_CARD_PHOTOS: Record<string, { src: string; alt: string }> = {
  "corporate-transportation": { src: "/images/services/corp.webp", alt: "Passengers riding a charter coach to a corporate event" },
  "wedding-transportation": { src: "/images/services/wed.webp", alt: "Wedding couple greeting guests riding a shuttle bus" },
  "school-transportation": { src: "/images/services/school.webp", alt: "Students boarding a yellow school bus" },
  "sports-team-transportation": { src: "/images/services/sport.webp", alt: "Football team heading to a stadium" },
  "airport-transfer": { src: "/images/fleet/sprinter.jpg", alt: "Black Sprinter van parked beside aircraft on an airport apron" },
  "sightseeing-tour-bus": { src: "/images/services/multi.webp", alt: "Motorcoach on a scenic tour route" },
  "church-religious-transportation": { src: "/images/services/church.webp", alt: "Minibuses ready for a group shuttle" },
  "band-tour-bus": { src: "/images/fleet/sleeper.jpg", alt: "Sleeper tour bus" },
  "winery-tour-bus-rental": { src: "/images/services/winery.webp", alt: "Vineyard rows in wine country" },
  "military-group-transportation": { src: "/images/services/military.webp", alt: "The American flag against a blue sky" },
  "government-transportation": { src: "/images/services/government.webp", alt: "The United States Capitol building" },
  "casino-bus-trips": { src: "/images/fleet/limo.jpg", alt: "Party bus hired for a casino night out" },
};

// The four booking shapes (owner request, Nov 12).
const TRIP_STYLES = [
  { icon: ArrowLeftRight, title: "One-Way Transfer", text: "One pickup, one drop-off, one ride between them. You give us both addresses and a time, and we quote the single journey door to door.", best: "airport runs, event drop-offs, point-to-point moves" },
  { icon: RefreshCw, title: "Round Trip", text: "Out and back in one booking. The same vehicle returns on your schedule, so the return leg is already priced and reserved when you leave.", best: "day trips, game days, evenings out" },
  { icon: Repeat2, title: "Shuttle Loop", text: "A repeat run between two points on a fixed timetable. Your guests step on and off all day while the same driver keeps the loop moving.", best: "weddings, conferences, hotel-to-venue days" },
  { icon: CalendarDays, title: "Multi-Day Charter", text: "The same coach and driver travel with your group for the whole run, routing each day's plan and staying available between stops.", best: "tours, band runs, camps, multi-city trips" },
];

const ADVANTAGE = [
  {
    icon: Shield,
    title: "A Charter Bus Fleet You Can Trust",
    text: "Every vehicle in our fleet is held to the same standard we set on day one. No shortcuts, no exceptions. When you book a Cascade coach, you are never gambling on what shows up.",
  },
  {
    icon: Users,
    title: "Professional Drivers",
    text: "Our drivers are DOT-certified and understand the difference between a route and a responsibility. They drive like it matters—because your safety is everything.",
  },
  {
    icon: Clock,
    title: "On-Time Arrivals",
    text: "With real-time tracking, our dispatch team always knows where every coach is. Punctuality is a duty we fulfill so your group is never left waiting.",
  },
  {
    icon: Briefcase,
    title: "Executive Logistics",
    text: "From a 14-passenger Sprinter for a small executive team to a 56-seat motorcoach for a whole conference group, we scale to your trip.",
  },
];

function Stars() {
  return (
    <div className="d-flex text-warning mb-3" role="img" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={18} fill="currentColor" aria-hidden="true" />
      ))}
    </div>
  );
}

export const metadata = pageMeta({
  title: "Charter Bus Rental | Cascade Charter Bus",
  description:
    "Charter bus rental for group trips of every size—from weddings and field trips to corporate events and band tours. All 50 states, 24/7 dispatch, final quotes.",
  path: "/",
});

export default function Home() {
  return (
    <main>
      {/* 1. Hero */}
      <section
        className="vh-100 d-flex align-items-center text-white position-relative"
        style={{ background: "linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url('/hero-bus.webp') center/cover" }}
      >
        <div className="container mt-5">
          <div className="row">
            <div className="col-lg-8">
              <span className="badge bg-primary text-dark px-3 py-2 rounded-pill text-uppercase tracking-widest mb-3 fw-bold">
                Premium Group Transportation
              </span>
              <h1 className="display-1 fw-bold mb-3 lh-1">
                Group Travel, <br />
                <span className="text-primary">Elevated.</span>
              </h1>
              <p className="lead mb-4 w-100 opacity-90 fs-4">
                Some trips are more than just travel. Cascade Charter Bus knows the value of
                your gatherings—whether it’s a wedding, group excursion, winery tour, or
                corporate conference.
              </p>
              <p className="mb-5 text-light opacity-75 fs-6">
                From a 7-seat SUV to a full 56-seat motorcoach—modern vehicles for every size
                of group, with professional, DOT-certified drivers. Because your safety is everything.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold hover-lift shadow-lg" href="/contact/">
                  REQUEST A QUOTE
                </Link>
                <Link className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-bold hover-lift" href="/fleet/">
                  VIEW OUR FLEET
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats bar — confirmed facts only (brief 7.1: removed 4.9/5 and 500+). */}
      <section className="py-4 bg-white shadow-sm position-relative z-index-10 mt-n4 mx-auto rounded-4 container border">
        <div className="row text-center g-4 align-items-center">
          <div className="col-md-3 col-6 border-end">
            <p className="fw-bold mb-0 text-dark text-uppercase small">{SITE.years}</p>
          </div>
          <div className="col-md-3 col-6 border-end">
            <p className="fw-bold mb-0 text-dark text-uppercase small">{SITE.coverage}</p>
          </div>
          <div className="col-md-3 col-6 border-end">
            <p className="fw-bold mb-0 text-dark text-uppercase small">24/7 Logistics Team</p>
          </div>
          <div className="col-md-3 col-6">
            <p className="fw-bold mb-0 text-dark text-uppercase small">Multiple Vehicle Types</p>
          </div>
        </div>
      </section>

      {/* 3. Our Heritage (compact, owner request) */}
      <section className="py-5 my-2">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="text-brand-dark fw-bold text-uppercase tracking-wider">Our Heritage</span>
              <h2 className="fw-bold text-dark mt-2 mb-3" style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)" }}>Built on Punctuality, Honesty, and Hard Work</h2>
              <p className="text-muted mb-3" style={{ fontSize: "1rem" }}>
                Cascade Charter Bus started with one vehicle, a small garage, and a core
                belief: punctuality and honesty come first on every journey. We didn&apos;t
                become a company with routes in all 50 states overnight—we grew one trip,
                one customer, one referral at a time.
              </p>
              <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 border-start border-primary border-4">
                <Award size={32} className="text-primary flex-shrink-0" aria-hidden="true" />
                <p className="mb-0 small fw-medium text-dark">
                  Guided by one unwavering principle: get people to their destinations, safely and on time, every single trip.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                <div className="rounded-4 overflow-hidden shadow border border-2 border-white">
                  <Image src="/images/fleet/charter.jpg" alt="Cascade Charter Bus Fleet" width={800} height={600} priority sizes="(max-width: 992px) 100vw, 50vw" className="w-100 h-100 object-fit-cover" style={{ minHeight: 300 }} />
                </div>
                <div className="position-absolute bottom-0 end-0 bg-primary text-white p-3 rounded-4 shadow mb-n3 me-n3 d-none d-md-block">
                  <h3 className="display-6 fw-bold mb-0">5+</h3>
                  <p className="mb-0 text-uppercase small fw-bold">Years of Service</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3b. Fleet showcase — all seven vehicles (owner request, like the Shelton CT page) */}
      <section className="py-5" id="fleet-showcase">
        <div className="container py-lg-3">
          <div className="text-center mb-5">
            <span className="text-brand-dark fw-bold text-uppercase tracking-wider">Our Fleet</span>
            <h2 className="display-5 fw-bold text-dark mt-1">A Vehicle for Every Group and Every Trip</h2>
            <p className="text-muted mt-2 mb-0">Pick by headcount and trip length — or tell us both and we&apos;ll match the vehicle for you.</p>
            <div className="mx-auto bg-primary mt-3" style={{ width: 60, height: 4 }} />
          </div>
          <div className="row g-4 fleet-slider-m">
            {VEHICLES.map((v) => (
              <div className="col-lg-3 col-md-4 col-6" key={v.slug}>
                <Link href={`/fleet/${v.slug}/`} className="text-decoration-none h-100 d-block">
                  <div className="card border-0 shadow-sm rounded-4 hover-lift h-100 overflow-hidden bg-white">
                    <div className="position-relative">
                      <Image src={v.photo} alt={`${v.cardName} rental for ${v.passengers}`} width={480} height={270} sizes="(max-width: 768px) 76vw, 25vw" style={{ width: "100%", height: 170, objectFit: "cover" }} />
                      <span className="badge rounded-pill px-3 py-2" style={{ position: "absolute", left: 12, bottom: 12, background: "rgba(15,17,21,0.86)", color: "#fff", fontWeight: 700, fontSize: "0.78rem" }}>
                        <Users size={13} className="me-1" aria-hidden="true" />{v.passengers}
                      </span>
                    </div>
                    <div className="card-body p-3">
                      <h3 className="h6 fw-bold text-dark mb-1">{v.cardName}</h3>
                      <p className="text-muted mb-0" style={{ fontSize: "0.82rem" }}>{v.tagline}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The Cascade Advantage */}
      <section className="py-5 bg-light">
        <div className="container py-lg-4">
          <div className="text-center mb-5">
            <span className="text-brand-dark fw-bold text-uppercase">The Cascade Advantage</span>
            <h2 className="display-5 fw-bold text-dark mt-1">Why Choose Cascade Bus Service</h2>
            <div className="mx-auto bg-primary mt-3" style={{ width: 60, height: 4 }} />
          </div>
          <div className="row text-center g-4">
            {ADVANTAGE.map((a) => (
              <div className="col-lg-3 col-md-6" key={a.title}>
                <div className="card border-0 bg-white shadow-sm h-100 p-4 rounded-4 hover-lift">
                  <div className="text-primary mb-3 mx-auto d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle" style={{ width: 80, height: 80 }}>
                    <a.icon size={36} strokeWidth={2} aria-hidden="true" />
                  </div>
                  <h3 className="h5 fw-bold mb-3 text-dark">{a.title}</h3>
                  <p className="text-muted small lh-base mb-0">{a.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonials (3, kept with owner permission) + real Trustpilot reviews */}
      <section className="py-5 my-5">
        <div className="container py-lg-4">
          <div className="text-center mb-5">
            <span className="text-brand-dark fw-bold text-uppercase tracking-wider">Testimonials</span>
            <h2 className="display-5 fw-bold text-dark mt-2">What Groups Say About Cascade Charter Bus</h2>
            <p className="text-muted max-w-2xl mx-auto mt-2">
              Real feedback from event planners, tour managers, and group leaders who count on us for reliable trips across the nation.
            </p>
            <div className="mx-auto bg-primary mt-3" style={{ width: 60, height: 4 }} />
          </div>
          <div className="row g-4">
            {TESTIMONIALS.map((t) => (
              <div className="col-lg-4 col-md-6" key={t.name}>
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white d-flex flex-column justify-content-between">
                  <div>
                    <Stars />
                    <p className="text-muted mb-4 fst-italic">“{t.quote}”</p>
                  </div>
                  <div className="pt-3 border-top">
                    <h3 className="h6 fw-bold text-dark mb-0">{t.name}</h3>
                    <span className="text-muted small">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Verified reviews collected on our Trustpilot profile (owner-approved, verbatim). */}
          <div className="mt-5">
            <p className="text-center small text-muted mb-4">
              Also read our verified reviews on{" "}
              <a href={SITE.trustpilotProfile} target="_blank" rel="noopener noreferrer" className="text-decoration-none fw-semibold">
                Trustpilot
              </a>
            </p>
            <div className="row g-4">
              {TRUSTPILOT_REVIEWS.map((r) => (
                <div className="col-lg-4 col-md-6" key={r.name + r.date}>
                  <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <Stars />
                      <span className="x-small-bold text-dark">✓ Verified</span>
                    </div>
                    <p className="fw-bold text-dark mb-2">{r.title}</p>
                    <p className="text-muted small mb-4">{r.text}</p>
                    <p className="mb-0 small">
                      <strong className="text-dark">{r.name}</strong>
                      <span className="text-muted"> · {r.location} · {r.date}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Service tiles — all 8 services, compact (owner request; replaces the
          Tailored Transportation journeys list) + slim custom-quote CTA */}
      <section className="py-5 bg-light" id="services-showcase">
        <div className="container py-lg-3">
          <div className="text-center mb-4">
            <span className="text-brand-dark fw-bold text-uppercase tracking-wider">What We Do</span>
            <h2 className="display-5 fw-bold text-dark mt-1">Charter Bus Services</h2>
            <p className="text-muted mt-2 mb-0">Eight services, one booking team—matched vehicle and driver for every kind of trip.</p>
            <div className="mx-auto bg-primary mt-3" style={{ width: 60, height: 4 }} />
          </div>
          <div className="row g-3 g-lg-4">
            {SERVICES.map((s) => {
              const img = SERVICE_CARD_PHOTOS[s.slug];
              return (
                <div className="col-lg-3 col-md-4 col-6" key={s.slug}>
                  <Link href={`/services/${s.slug}/`} className="text-decoration-none h-100 d-block">
                    <div className="card border-0 shadow-sm rounded-4 hover-lift h-100 overflow-hidden bg-white">
                      {img && (
                        <Image src={img.src} alt={img.alt} width={480} height={270} sizes="(max-width: 768px) 50vw, 25vw" style={{ width: "100%", height: 130, objectFit: "cover" }} />
                      )}
                      <div className="card-body p-3 text-center d-flex flex-column">
                        <h3 className="h6 fw-bold text-dark mb-3" style={{ fontSize: "0.9rem", flexGrow: 1 }}>{s.name}</h3>
                        <span className="btn btn-sm rounded-pill px-3 py-1 fw-bold btn-outline-dark align-self-center" style={{ fontSize: "0.72rem" }}>VIEW DETAILS</span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap bg-dark rounded-4 p-4 mt-4">
            <div>
              <h3 className="fw-bold text-white mb-1" style={{ fontSize: "1.15rem" }}>Plan Your Custom Journey Today</h3>
              <p className="text-white-50 mb-0" style={{ fontSize: "0.9rem" }}>Enter your destination details and group requirements — a custom quote from our 24/7 logistics team.</p>
            </div>
            <Link className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm" href="/contact/">
              REQUEST A CUSTOM QUOTE
            </Link>
          </div>
        </div>
      </section>

      {/* 6b. Plan your charter — the four booking shapes (owner request) */}
      <section className="py-5 my-2" id="plan-your-charter">
        <div className="container py-lg-3">
          <div className="text-center mb-5">
            <span className="text-brand-dark fw-bold text-uppercase tracking-wider">Plan Your Charter</span>
            <h2 className="display-5 fw-bold text-dark mt-1">Four Ways to Book a Charter Bus</h2>
            <p className="text-muted mt-2 mb-0">Every booking is one of these four shapes. Tell us which fits your trip and we&apos;ll quote it as one plan.</p>
            <div className="mx-auto bg-primary mt-3" style={{ width: 60, height: 4 }} />
          </div>
          <div className="row g-4">
            {TRIP_STYLES.map((t) => (
              <div className="col-lg-3 col-md-6" key={t.title}>
                <div className="card border-0 shadow-sm rounded-4 h-100 p-4 hover-lift">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="p-2 bg-primary bg-opacity-10 rounded-circle text-primary d-flex align-items-center justify-content-center" style={{ width: 52, height: 52, flexShrink: 0 }}>
                      <t.icon size={24} aria-hidden="true" />
                    </div>
                    <h3 className="h6 fw-bold text-dark mb-0">{t.title}</h3>
                  </div>
                  <p className="text-muted mb-3 lh-base">{t.text}</p>
                  <p className="mb-0 small"><strong className="text-dark">Best for:</strong> {t.best}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6c. How to book in 4 steps (owner request) */}
      <section className="py-5 bg-light" id="how-to-book">
        <div className="container py-lg-3">
          <div className="text-center mb-5">
            <span className="text-brand-dark fw-bold text-uppercase tracking-wider">Simple Process</span>
            <h2 className="display-5 fw-bold text-dark mt-1">How to Book a Charter Bus in 4 Steps</h2>
            <div className="mx-auto bg-primary mt-3" style={{ width: 60, height: 4 }} />
          </div>
          <div className="row g-4">
            {[
              { t: "Share Your Trip", d: "Send pickup, destination, date, times and headcount by form or phone, day or night." },
              { t: "Get a Final Quote", d: "In about 15 minutes you get the vehicle, schedule and one all-inclusive price." },
              { t: "Confirm in Writing", d: "Approve the itinerary. Changes to stops or times are confirmed with one message." },
              { t: "Relax and Ride", d: "Your driver arrives early, and dispatch stays reachable for the whole trip." },
            ].map((s, i) => (
              <div className="col-lg-3 col-md-6" key={s.t}>
                <div className="card border-0 shadow-sm rounded-4 h-100 p-4 hover-lift">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <span className="badge rounded-circle d-flex align-items-center justify-content-center" style={{ width: 46, height: 46, fontSize: "1.15rem", background: "var(--fleet-orange)", color: "var(--fleet-black)", fontWeight: 800 }}>{i + 1}</span>
                    <h3 className="h6 fw-bold text-dark mb-0">{s.t}</h3>
                  </div>
                  <p className="text-muted mb-0 lh-base">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-sm" href="/contact/">
              START YOUR BOOKING <ArrowRight size={18} className="ms-2" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-5 my-5">
        <div className="container py-lg-4">
          <div className="text-center mb-5">
            <span className="text-brand-dark fw-bold text-uppercase tracking-wider">Help &amp; Resources</span>
            <h2 className="display-5 fw-bold text-dark mt-2">Frequently Asked Questions</h2>
            <p className="text-muted max-w-2xl mx-auto mt-2">
              Get clear answers on charter bus rentals, pricing transparency, and booking details.
            </p>
            <div className="mx-auto bg-primary mt-3" style={{ width: 60, height: 4 }} />
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-lg-10">
              <FaqAccordion faqs={HOME_FAQS} idPrefix="home-faq" />
            </div>
          </div>
        </div>
      </section>

      {/* 9. Closing CTA — amber band, same as the premium city pages (owner request) */}
      <section className="pp pp-cta-band" aria-labelledby="home-cta-title">
        <div className="container pp-cta-inner">
          <div>
            <h2 id="home-cta-title">Ready to Book Your Charter Bus?</h2>
            <p>Fast, final quote. Gratuity, tolls and taxes included. Dispatch answers around the clock.</p>
          </div>
          <div className="pp-cta-actions">
            <a className="pp-btn pp-btn-dark" href="/contact/" data-source="home-cta" rel="nofollow">
              Get a Free Quote <ArrowRight aria-hidden="true" />
            </a>
            <a className="pp-btn pp-btn-outline-dark" href={`tel:${SITE.phoneTel}`}>
              <Phone aria-hidden="true" />
              {`Call ${SITE.phoneDisplay}`}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
