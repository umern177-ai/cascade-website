import type { Metadata } from "next";
import { withOverrides } from "@/lib/admin/meta-apply";
import { getContent } from "@/lib/admin/store";
// Services hub — premium pp-* design (Nov 17): matches the city-page frame.
// Dark hero + quote form, facts strip, all 12 service cards with real photos,
// dark process band, FAQ, amber CTA band. Same real data as before, nothing
// invented.
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, ChevronRight, Phone, ShieldCheck, Tag, Headset, Quote } from "lucide-react";
import FaqAccordion from "@/components/Faq";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SERVICES } from "@/lib/site-data";
import { getService } from "@/lib/fleet-data";
import { SITE } from "@/lib/site-data";
import { fleetMain } from "@/lib/fleet-photos";
import { pageMeta } from "@/lib/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta(await withOverrides({

  title: "Charter Bus Services & Group Travel",
  description:
    "Charter bus services for corporate events, weddings, schools, sports teams, airport transfers, sightseeing tours, church groups and band tours—nationwide.",
  path: "/services/",
  }));
}

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

const HUB_STEPS = [
  { step: "Request", text: "Send your trip details and schedule by form or the 24/7 line." },
  { step: "Review", text: "Get a detailed, final quote—usually in about 15 minutes." },
  { step: "Confirm", text: "Confirm dates with one call or email; changes go in writing." },
  { step: "Ride", text: "Drivers arrive early; dispatch stays reachable the whole trip." },
];

// Real service photos supplied by the owner (processed to WebP, EXIF stripped).
// band-tour-bus uses the fleet sleeper photo (no owner service photo yet).
const CARD_PHOTOS: Record<string, { src: string; alt: string }> = {
  "corporate-transportation": { src: "/images/services/corp.webp", alt: "Passengers riding a charter coach to a corporate event" },
  "wedding-transportation": { src: "/images/services/wed.webp", alt: "Wedding couple greeting guests riding a shuttle bus" },
  "school-transportation": { src: "/images/services/school.webp", alt: "Students boarding a yellow school bus for a field trip" },
  "sports-team-transportation": { src: "/images/services/sport.webp", alt: "Soccer team lined up on the pitch before a match" },
  "airport-transfer": { src: fleetMain("sprinter-van", "/images/fleet/sprinter.jpg"), alt: "Black Sprinter van parked beside aircraft on an airport apron" },
  "sightseeing-tour-bus": { src: "/images/services/multi.webp", alt: "White motorcoach on a scenic mountain road" },
  "church-religious-transportation": { src: "/images/services/church.webp", alt: "Executive minibuses parked on a city street for a group shuttle" },
  "band-tour-bus": { src: fleetMain("sleeper", "/images/fleet/sleeper.jpg"), alt: "Sleeper tour bus used for band tours" },
  "winery-tour-bus-rental": { src: "/images/services/winery.webp", alt: "Vineyard rows in wine country" },
  "military-group-transportation": { src: "/images/services/military.webp", alt: "The American flag against a blue sky" },
  "government-transportation": { src: "/images/services/government.webp", alt: "The United States Capitol building" },
  "casino-bus-trips": { src: fleetMain("party-bus", "/images/fleet/limo.jpg"), alt: "Party bus hired for a casino night out" },
};

const FACTS = [
  { dt: "Quote reply time", dd: "15", unit: "min" },
  { dt: "Gratuity, tolls & taxes", dd: "Included", unit: "" },
  { dt: "Dispatch support", dd: "24/7", unit: "" },
  { dt: "States covered", dd: "50", unit: "" },
];

export default async function ServicesHub() {
  // admin overrides for the hub headline (brief 19.10)
  const c = await getContent();
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: SERVICES.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: `${SITE.url}/services/${s.slug}/` })),
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SERVICES_FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <main className="pp bg-white pp-svc" style={{ fontSize: "inherit" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />

      {/* ===== hero + quote form (same frame as city/service pages) ===== */}
      <section className="pp-hero">
        <div className="container">
          <div className="pp-hero-grid">
            <div>
              <p className="pp-eyebrow">Charter Services · Every Kind of Group</p>
              <h1>
                {c.servicesHub?.heading ? (
                  c.servicesHub.heading
                ) : (
                  <>
                    Charter Bus Services for <em>Every Kind of Group</em>
                  </>
                )}
              </h1>
              <p className="pp-lead">
                {c.servicesHub?.sub ?? "Weddings, conferences, school trips, teams, tours and unit moves—planned, quoted and run the same disciplined way, across all 50 states."}
              </p>
              <div className="pp-hero-ctas">
                <a className="pp-btn pp-btn-amber" href="/contact/" data-source="services-hero" rel="nofollow">Get a Free Quote <ArrowRight aria-hidden="true" /></a>
                <a className="pp-btn pp-btn-ghost" href={`tel:${SITE.phoneTel}`}><Phone aria-hidden="true" /> {SITE.phoneDisplay}</a>
              </div>
              <ul className="pp-trust">
                <li><ShieldCheck aria-hidden="true" />DOT-compliant fleet</li>
                <li><Tag aria-hidden="true" />Gratuity, tolls &amp; taxes included</li>
                <li><Headset aria-hidden="true" />24/7 dispatch</li>
              </ul>
            </div>

            {/* Field names match the full booking form, so submitting lands on
                /contact/ with pickup, date and passengers already in place. */}
            <form className="pp-quote" id="quote" action="/contact/" method="get" aria-labelledby="hub-quote-title">
              <h2 id="hub-quote-title">Plan any group trip</h2>
              <p className="pp-sub-note">One final price. Average reply in about 15 minutes.</p>
              <input type="hidden" name="source" value="services:hub" />
              <div className="pp-field">
                <label htmlFor="hub-q-pickup">Pickup location</label>
                <input id="hub-q-pickup" name="pickup" type="text" placeholder="Hotel, office, venue or home" autoComplete="street-address" />
              </div>
              <div className="pp-field">
                <label htmlFor="hub-q-dest">Destination</label>
                <input id="hub-q-dest" name="destination" type="text" placeholder="Where the group is going" />
              </div>
              <div className="pp-field-row">
                <div className="pp-field">
                  <label htmlFor="hub-q-date">Trip date</label>
                  <input id="hub-q-date" name="date" type="date" />
                </div>
                <div className="pp-field">
                  <label htmlFor="hub-q-pax">Passengers</label>
                  <select id="hub-q-pax" name="passengers" defaultValue="">
                    <option value="">Select</option>
                    <option value="14">1–14 (Sprinter)</option>
                    <option value="32">15–32 (Minibus)</option>
                    <option value="60">33–60 (Coach / School bus)</option>
                    <option value="60-plus">60+ (Multiple vehicles)</option>
                  </select>
                </div>
              </div>
              <button className="pp-btn pp-btn-amber" type="submit" data-source="services:hub">See the Full Booking Form <ArrowRight aria-hidden="true" /></button>
              <p className="pp-fine"><Check aria-hidden="true" />No obligation · No hidden fees</p>
            </form>
          </div>
        </div>
      </section>

      {/* ===== facts strip ===== */}
      <section className="pp-facts" aria-label="Cascade Charter Bus key facts">
        <div className="container">
          <dl className="pp-facts-grid">
            {FACTS.map((f) => (
              <div className="pp-fact" key={f.dt}>
                <dt>{f.dt}</dt>
                <dd>{f.dd}<small>{f.unit}</small></dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ===== all services ===== */}
      <section className="pp-sec" id="services">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">What we run</p>
            <h2>Pick your service—same discipline behind all of them</h2>
            <p>Each card opens a page sized to that group: the vehicles that fit, the process, the pricing and the answers organizers actually ask for.</p>
          </header>
          <div className="pp-service-gallery">
            {SERVICES.map((s, i) => {
              const meta = getService(s.slug);
              const ph = CARD_PHOTOS[s.slug];
              return (
                <Link key={s.slug} href={`/services/${s.slug}/`} className="pp-hub-card" aria-label={`${s.name} details`}>
                  <div className="pp-hub-media">
                    <span className="pp-num" aria-hidden="true">{`0${i + 1}`}</span>
                    {ph && <Image src={ph.src} alt={ph.alt} fill sizes="(max-width: 800px) 100vw, 33vw" style={{ objectFit: "cover" }} />}
                  </div>
                  <div className="pp-hub-body">
                    <span className="pp-badge">{meta?.eyebrow}</span>
                    <h2 className="pp-hub-name">{s.name}</h2>
                    <span className="pp-link-arrow">View details <ChevronRight size={14} style={{ verticalAlign: "-2px" }} aria-hidden="true" /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== booking process (dark band) ===== */}
      <section className="pp-sec pp-bg-ink on-dark" id="how">
        <div className="container">
          <header className="pp-sec-head mx-auto text-center" style={{ maxWidth: 760 }}>
            <p className="pp-eyebrow" style={{ color: "var(--pp-amber)" }}>Booking made simple</p>
            <h2 style={{ color: "#fff" }}>Four steps from message to ride</h2>
            <p style={{ color: "#a9b0c2" }}>The same process runs behind every service, from a two-van airport run to a four-coach wedding weekend.</p>
          </header>
          <ol className="pp-steps">
            {HUB_STEPS.map((st, i) => (
              <li className="pp-step" key={st.step}>
                <div className="pp-step-num" aria-hidden="true">{i + 1}</div>
                <h3>{st.step}</h3>
                <p>{st.text}</p>
              </li>
            ))}
          </ol>
          <div className="pp-final-card">
            <Quote aria-hidden="true" size={26} style={{ color: "var(--pp-amber)" }} />
            <h3 className="mb-2">The quote you receive is final.</h3>
            <p className="pp-checklist-lead mb-0">Gratuity included. No hidden fuel surcharges or driver fees. Average reply in about 15 minutes.</p>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="pp-sec pp-bg-white" id="faq">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">FAQ</p>
            <h2>Questions organizers ask first</h2>
            <p>The short answers—each service page carries the deeper ones.</p>
          </header>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <FaqAccordion faqs={SERVICES_FAQS} idPrefix="services-hub" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== final CTA (amber band) ===== */}
      <section className="pp-cta-band">
        <div className="container pp-cta-inner">
          <div>
            <h2>Ready to plan your trip?</h2>
            <p>Share the trip and group count—get one final quote, usually in about 15 minutes.</p>
          </div>
          <div className="pp-cta-actions">
            <a className="pp-btn pp-btn-dark" href="/contact/" data-source="services-cta" rel="nofollow">Get a Free Quote <ArrowRight aria-hidden="true" /></a>
            <a className="pp-btn pp-btn-outline-dark" href={`tel:${SITE.phoneTel}`}><Phone aria-hidden="true" />{`Call ${SITE.phoneDisplay}`}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
