// Fleet hub — same structure as the live fleet hub (brief Section 7.4), with the
// corrected sleeper numbers and one data source (lib/fleet-data.ts).
import Image from "next/image";
import Link from "next/link";
import { Users, Check, Briefcase, Wifi, ShieldCheck, Bus, ChevronRight } from "lucide-react";
import FaqAccordion from "@/components/Faq";
import Breadcrumbs from "@/components/Breadcrumbs";
import { VEHICLES } from "@/lib/fleet-data";
import { SITE } from "@/lib/site-data";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "Charter Bus & Motorcoach Fleet | Group Vehicle Guide",
  description:
    "Explore charter buses, sleeper coaches, minibuses, Sprinter vans, school buses, party buses, SUVs and sedans for group transportation across the USA.",
  path: "/fleet/",
});

export const FLEET_FAQS = [
  {
    q: "Which vehicle is right for my group size?",
    a: "Rough guide: up to 7 passengers—SUV or sedan; up to 14—Sprinter van; 20–32—minibus; 52–56—charter bus; sleeping overnight—sleeper bus with up to 15 bunks. The dispatch team confirms the best fit from your headcount, luggage and route.",
  },
  {
    q: "How much luggage can the buses carry?",
    a: "Charter buses hold 50–60 large bags in under-bus bays; minibuses take overhead/seat storage; sprinter vans take carry-ons; school buses have no luggage bay. We match the vehicle to your gear.",
  },
  {
    q: "Do the buses have WiFi?",
    a: "It's on most motorcoaches and minibuses. Because it varies by vehicle, tell us when booking and we'll confirm it for your trip.",
  },
  {
    q: "Are the buses accessible for wheelchair users?",
    a: "Accessibility options depend on the vehicle and route. Tell us when you request a quote and the dispatch team will confirm what's available.",
  },
];

const SPEC_ICONS = { luggage: Briefcase, climate: Wifi, technology: ShieldCheck } as const;

export default function FleetHub() {
  return (
    <main className="bg-white min-vh-100">
      {/* Hero */}
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Fleet" }]} />
<section className="py-5 bg-dark text-white" style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="container text-center">
          <span className="text-brand-dark fw-bold text-uppercase tracking-widest mb-3 d-block">CASCADE CHARTER BUS FLEET</span>
          <h1 className="display-4 fw-bold mb-4">Charter Bus &amp; Group Transportation Fleet</h1>
          <p className="opacity-75 mx-auto mb-4" style={{ maxWidth: 820 }}>
            Explore charter buses, sleeper coaches, minibuses, Sprinter vans, school buses,
            party buses, SUVs and sedans for group transportation across the USA. Choose
            your vehicle based on passenger count, luggage, route, trip length and the
            experience your group needs.
          </p>
          <div className="d-flex justify-content-center">
            <a className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold" href="#vehicles">Explore Our Vehicles</a>
          </div>
        </div>
      </section>

      
      {/* Vehicle cards */}
      <section className="pb-5" id="vehicles">
        <div className="container py-lg-4">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold text-dark">Find the Right Vehicle for Your Group</h2>
            <p className="text-muted mx-auto mt-2" style={{ maxWidth: 820 }}>
              From a seven-passenger executive vehicle to a 56-passenger motorcoach,
              Cascade Charter Bus offers transportation options for local trips, events,
              corporate travel, airport transfers, touring and long-distance journeys.
            </p>
          </div>
          <div className="vstack gap-5">
            {VEHICLES.map((v, i) => (
              <div className="row g-4 align-items-center" key={v.slug}>
                <div className={`col-lg-7 ${i % 2 === 1 ? "order-lg-2" : ""}`}>
                  <div className="rounded-4 overflow-hidden shadow-lg border position-relative">
                    <Image src={v.photo} alt={`${v.cardName} rental - Cascade Charter Bus`} width={900} height={520} style={{ minHeight: 300, objectFit: "cover", width: "100%" }} sizes="(max-width: 992px) 100vw, 58vw" />
                    <div className="position-absolute top-0 end-0 m-4">
                      <span className="badge bg-dark px-3 py-2 rounded-pill shadow-sm fs-6">
                        <Users size={16} className="me-2" aria-hidden="true" />
                        {v.passengers}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`col-lg-5 ${i % 2 === 1 ? "order-lg-1" : ""}`}>
                  <p className="text-uppercase fw-bold small text-muted mb-2">Cascade Fleet</p>
                  <h2 className="display-5 fw-bold mb-2 text-dark">{v.cardName}</h2>
                  <p className="text-dark fw-bold text-uppercase small mb-4">{v.tagline}</p>
                  <p className="text-muted mb-4" style={{ lineHeight: 1.8 }}>{v.intro}</p>
                  <div className="mb-4">
                    <h3 className="fw-bold small text-uppercase mb-3 text-dark">Key Amenities</h3>
                    <div className="row g-2">
                      {v.amenities.map((a) => (
                        <div className="col-12 col-md-6 small d-flex align-items-center gap-2 text-dark" key={a}>
                          <Check size={16} className="text-success flex-shrink-0" aria-hidden="true" />
                          <span>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-light rounded-4 mb-4 border">
                    <div className="row text-center g-3">
                      <div className="col-4 border-end">
                        <Briefcase size={20} className="text-muted mb-2" aria-hidden="true" />
                        <p className="mb-0 small fw-bold text-dark">Luggage</p>
                        <p className="mb-0 small text-muted">{v.luggage}</p>
                      </div>
                      <div className="col-4 border-end">
                        {specIcon({ kind: "climate" })}
                        <p className="mb-0 small fw-bold text-dark">Climate</p>
                        <p className="mb-0 small text-muted">{v.climate}</p>
                      </div>
                      <div className="col-4">
                        {specIcon({ kind: "technology" })}
                        <p className="mb-0 small fw-bold text-dark">Technology</p>
                        <p className="mb-0 small text-muted">{v.technology}</p>
                      </div>
                    </div>
                  </div>
                  <Link className="btn btn-primary rounded-pill px-4 py-3 fw-bold d-flex align-items-center justify-content-center gap-2" href={`/fleet/${v.slug}/`}>
                    VIEW {v.cardName.toUpperCase()} <ChevronRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold text-dark">Frequently Asked Questions</h2>
            <p className="text-muted">Questions about the fleet.</p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <FaqAccordion faqs={FLEET_FAQS} idPrefix="fleet-hub" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 bg-dark text-white text-center">
        <div className="container py-4">
          <Bus size={40} className="text-primary mb-3" aria-hidden="true" />
          <h2 className="display-6 fw-bold mb-3">Not Sure Which Vehicle Fits?</h2>
          <p className="text-white-50 mb-4">Tell us the headcount, luggage and route—the dispatch team will match the right coach.</p>
          <a className="btn btn-primary rounded-pill px-5 py-3 fw-bold btn-lg" href="/contact/">GET A FREE QUOTE</a>
        </div>
      </section>
    </main>
  );
}

function specIcon({ kind }: { kind: "climate" | "technology" }) {
  if (kind === "climate") return <Wifi size={20} className="text-muted mb-2" aria-hidden="true" />;
  return <ShieldCheck size={20} className="text-muted mb-2" aria-hidden="true" />;
}
