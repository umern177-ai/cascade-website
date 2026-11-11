// Services hub — same layout as the live services hub, with the general FAQ
// replacing the live page's wedding-only FAQ (brief 7.2).
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import FaqAccordion from "@/components/Faq";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SERVICES } from "@/lib/site-data";
import { getService } from "@/lib/fleet-data";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "Professional Services Tailored to Your Journey",
  description:
    "Charter bus services for corporate events, weddings, schools, sports teams, airport transfers, sightseeing tours, church groups and band tours—nationwide.",
  path: "/services/",
});

const SERVICES_FAQS = [
  {
    q: "How does getting a quote work?",
    a: "Send the trip details through the form or call the 24/7 dispatch line. You get a detailed itinerary quote, usually within about 15 minutes.",
  },
  {
    q: "Is the quote final?",
    a: "Yes. The quote you receive is final—no hidden fuel surcharges or driver fees, and gratuity is included.",
  },
  {
    q: "What vehicles can I book?",
    a: "Charter buses (52–56), sleeper buses (up to 15 bunks), minibuses (20–32), school buses (28–60), Sprinter vans (up to 14), limo and party buses (14–40), and SUVs/sedans (up to 7).",
  },
  {
    q: "Do you travel outside major cities?",
    a: "Yes. We operate in all 50 states—small towns, resorts, campuses and rural venues are normal routes for us.",
  },
  {
    q: "How far ahead should I book?",
    a: "4–8 weeks ahead for weddings, conferences and peak-season dates; 1–2 weeks is often enough for small local trips. Call anytime—24/7 dispatch handles urgent requests.",
  },
];

const BOOKING_STEPS = ["Request", "Review", "Confirm", "Ride"];

// Real service photos supplied by the owner (processed to WebP, EXIF stripped).
// band-tour-bus uses the fleet sleeper photo (no owner service photo yet).
const CARD_PHOTOS: Record<string, { src: string; alt: string }> = {
  "corporate-transportation": { src: "/images/services/corp.webp", alt: "Passengers riding a charter coach to a corporate event" },
  "wedding-transportation": { src: "/images/services/wed.webp", alt: "Wedding couple greeting guests riding a shuttle bus" },
  "school-transportation": { src: "/images/services/school.webp", alt: "Students boarding a yellow school bus for a field trip" },
  "sports-team-transportation": { src: "/images/services/sport.webp", alt: "Football team walking through a stadium tunnel before a game" },
  "airport-transfer": { src: "/images/services/airport.webp", alt: "Group shuttle bus waiting at the airport terminal" },
  "sightseeing-tour-bus": { src: "/images/services/multi.webp", alt: "White motorcoach on a scenic mountain road" },
  "church-religious-transportation": { src: "/images/services/church.webp", alt: "Executive minibuses parked on a city street for a group shuttle" },
  "band-tour-bus": { src: "/images/fleet/sleeper.jpg", alt: "Sleeper tour bus used for band tours" },
};

export default function ServicesHub() {
  return (
    <main className="bg-white min-vh-100">
      {/* Hero */}
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
<section className="py-5 bg-dark text-white" style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="container text-center">
          <span className="text-brand-dark fw-bold text-uppercase tracking-widest mb-3 d-block">Elite Charter Solutions</span>
          <h1 className="display-4 fw-bold mb-4">Professional Services Tailored to Your Journey</h1>
          <Link className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm" href="/contact/">BOOK NOW</Link>
        </div>
      </section>

      
      {/* Service cards */}
      <section className="py-5">
        <div className="container py-lg-4">
          <div className="row g-4">
            {SERVICES.map((s) => {
              const meta = getService(s.slug);
              return (
                <div className="col-lg-4 col-md-6" key={s.slug}>
                  <Link href={`/services/${s.slug}/`} className="text-decoration-none">
                    <div className="card border-0 shadow-sm rounded-4 hover-lift h-100 overflow-hidden">
                      {CARD_PHOTOS[s.slug] && (
                        <Image src={CARD_PHOTOS[s.slug].src} alt={CARD_PHOTOS[s.slug].alt} width={800} height={450}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          style={{ width: "100%", height: 200, objectFit: "cover" }} />
                      )}
                      <div className="bg-primary-soft p-2 rounded-3 text-primary mx-4 mt-4 mb-2 d-inline-flex align-self-start" style={{ width: "fit-content" }}>
                        <Check size={20} aria-hidden="true" />
                      </div>
                      <div className="card-body p-4">
                        <h2 className="h5 fw-bold text-dark mb-1">{s.name}</h2>
                        <p className="text-muted small mb-3">{meta?.eyebrow}</p>
                        <span className="btn btn-sm rounded-pill px-3 py-2 fw-bold btn-outline-dark">View Details</span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking Made Simple */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold text-dark">Booking Made Simple</h2>
            <div className="mx-auto bg-primary mt-3" style={{ width: 60, height: 4 }} />
          </div>
          <div className="row g-4 text-center">
            {BOOKING_STEPS.map((s, i) => (
              <div className="col-md-3 col-6" key={s}>
                <div className="p-4 h-100 border-0 card rounded-4 shadow-sm">
                  <span className="badge bg-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, fontSize: "1.2rem" }}>
                    {i + 1}
                  </span>
                  <h3 className="h6 fw-bold text-dark mb-1">{s}</h3>
                  <p className="text-muted small mb-0">
                    {i === 0 && "Send your trip details and schedule."}
                    {i === 1 && "Get a detailed, final quote—usually in ~15 minutes."}
                    {i === 2 && "Confirm dates with one call or email."}
                    {i === 3 && "Drivers arrive early; dispatch stays reachable."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ (general, not wedding-only) */}
      <section className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold text-dark">Frequently Asked Questions</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <FaqAccordion faqs={SERVICES_FAQS} idPrefix="services-hub" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 bg-dark text-white text-center">
        <div className="container py-4">
          <h2 className="display-6 fw-bold mb-3">Ready To Plan Your Trip?</h2>
          <p className="text-white-50 mb-4">Tell us where you&apos;re going—get a final quote fast.</p>
          <Link className="btn btn-primary rounded-pill px-5 py-3 fw-bold btn-lg" href="/contact/">GET A FREE QUOTE</Link>
        </div>
      </section>
    </main>
  );
}
