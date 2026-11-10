// Home page — section order and look exactly as the live site (brief Section 7.1).
// Fixes applied per brief: confirmed facts only (5+ years, no 4.9/5, no 500+),
// heading order corrected, testimonial names kept (owner permission), FAQ answers
// start with the direct answer.
import Image from "next/image";
import Link from "next/link";
import {
  Mail, Phone, Menu, ChevronDown, Star, Shield, Users, Clock, Briefcase, Check,
  Bus, MapPin, ArrowRight, Award,
} from "lucide-react";
import FaqAccordion from "@/components/Faq";
import { SITE, HOME_FAQS, TESTIMONIALS, TRUSTPILOT_REVIEWS } from "@/lib/site-data";
import { pageMeta } from "@/lib/page-meta";

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

const JOURNEYS = [
  { title: "Corporate Events", text: "Get your team there on-time, sharp, relaxed, and stress-free." },
  { title: "Weddings", text: "Guest shuttle bus loops between hotels, ceremony and reception—one less thing to worry about on the biggest day." },
  { title: "Sports Teams", text: "Reliable routing because the game starts whether the bus is late or not." },
  { title: "School & University Bus Rentals", text: "Field trip buses and campus shuttles—the trust of a hundred parents, carried carefully, with strict safety protocols." },
  { title: "Airport Transfers", text: "Shuttle bus service door-to-terminal, with no missed flights and no scramble for airport parking." },
  { title: "Band Tours & Motorcoach Charters", text: "Sleeper coaches, tour buses and multi-day motorcoach charters for touring groups and band itineraries." },
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
  title: "Charter Bus Rental Nationwide | Cascade Charter Bus",
  description:
    "Nationwide charter bus rental, coast to coast from New York to Los Angeles. Premium motorcoaches, shuttles, and executive group transportation with DOT-certified drivers.",
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
                Premium Nationwide Service
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
                Nationwide charter bus rentals coast to coast from New York to Los Angeles.
                Enjoy comfortable, secure, and on-time travel with our professional,
                DOT-certified drivers. Because your safety is everything.
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

      {/* 3. Our Heritage */}
      <section className="py-5 my-5">
        <div className="container py-lg-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="text-brand-dark fw-bold text-uppercase tracking-wider">Our Heritage</span>
              <h2 className="display-5 fw-bold text-dark mt-2 mb-4">Built on Punctuality, Honesty, and Hard Work</h2>
              <p className="text-muted lead mb-4">
                Cascade Charter Bus started with just one vehicle, a small garage, and a lot
                of hard work. There was no big investment and no fleet waiting in the wings.
                We started with one core belief: that punctuality and honesty are the
                fundamental principles of every journey we take.
              </p>
              <p className="text-muted mb-4">
                We didn’t become a nationwide company overnight. We’ve grown little by
                little—one trip, one customer, one referral at a time. Every early pickup and
                late drop-off taught us something we carried into the next trip. That is why
                reliability is not something that we just advertise; it is something we built
                the company around.
              </p>
              <p className="text-muted mb-4">
                What started as a small local operation has grown into a charter bus service
                serving groups across the country. We’ve helped thousands of people reach
                their destination safely—whether that’s guests attending a wedding, students
                going on a field trip, teams heading to championship games, coworkers
                traveling for corporate events, families gathering for reunions, or friends
                setting off together.
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
                <div className="rounded-5 overflow-hidden shadow-lg border border-2 border-white">
                  <Image src="/images/fleet/charter.jpg" alt="Cascade Charter Bus Fleet" width={800} height={600} priority sizes="(max-width: 992px) 100vw, 50vw" className="w-100 h-100 object-fit-cover" style={{ minHeight: 400 }} />
                </div>
                <div className="position-absolute bottom-0 end-0 bg-primary text-white p-4 rounded-4 shadow-lg mb-n3 me-n3 d-none d-md-block">
                  <h3 className="display-6 fw-bold mb-0">5+</h3>
                  <p className="mb-0 text-uppercase small fw-bold">Years of Service</p>
                </div>
              </div>
            </div>
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

      {/* 6. Tailored Transportation */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="text-brand-dark fw-bold text-uppercase">Tailored Transportation</span>
              <h2 className="display-6 fw-bold mb-4 text-dark">The Journeys We Serve Nationwide</h2>
              <p className="text-muted mb-4 lead">
                Whether you’re planning a corporate transfer or a group trip, the same high
                standard of service comes with every vehicle we send.
              </p>
              <div className="vstack gap-4">
                {JOURNEYS.map((j) => (
                  <div className="d-flex align-items-start gap-3" key={j.title}>
                    <div className="p-2 bg-primary bg-opacity-10 rounded-circle text-primary mt-1">
                      <Check size={20} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="h6 fw-bold text-dark mb-1">{j.title}</h3>
                      <p className="text-muted small mb-0">{j.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="bg-dark p-2 shadow-lg rounded-5 overflow-hidden">
                <div className="bg-dark p-5 text-white rounded-5 text-center shadow-sm border border-secondary">
                  <Bus size={48} className="text-primary mb-3" aria-hidden="true" />
                  <h3 className="fw-bold mb-3">Plan Your Custom Journey Today</h3>
                  <p className="opacity-75 mb-4 small">
                    Enter your destination details and group requirements to receive a custom quote from our 24/7 logistics team.
                  </p>
                  <Link className="btn btn-primary btn-lg rounded-pill px-5 fw-bold w-100 py-3" href="/contact/">
                    REQUEST A CUSTOM QUOTE
                  </Link>
                </div>
              </div>
            </div>
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

      {/* 8. Locations */}
      <section className="py-5 bg-light border-top border-bottom">
        <div className="container py-4 text-center">
          <MapPin size={40} className="text-primary mb-3" aria-hidden="true" />
          <h2 className="fw-bold mb-3 text-dark">Serving Every Major City &amp; Region in the USA</h2>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: 680 }}>
            From coast to coast—New York, Los Angeles, Chicago, Houston, Atlanta, and everywhere in between. Browse our directory to find charter bus solutions in your region.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link className="btn btn-primary rounded-pill px-5 fw-bold py-3 hover-lift shadow-sm" href="/locations/">
              BROWSE ALL LOCATIONS <ArrowRight size={18} className="ms-2" aria-hidden="true" />
            </Link>
            <Link className="btn btn-outline-dark rounded-pill px-5 fw-bold py-3 hover-lift" href="/fleet/">
              EXPLORE OUR FLEET
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Closing CTA */}
      <section className="py-5 bg-dark text-white text-center position-relative">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-3">Your Journey Starts With One Call</h2>
              <p className="lead opacity-75 mb-4">
                One promise that hasn’t changed since day one: get your group there safely and on time. Tell us where you’re going—we’ll build the trip around you.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
                <Link className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg" href="/contact/">
                  GET STARTED
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
