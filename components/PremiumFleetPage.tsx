// Premium fleet page — the pp-* city/service design applied to fleet vehicles.
// Owner-demo build (Nov 17): wired only for /fleet/charter-bus/ until the
// owner reviews and approves. All content comes from lib/fleet-data.ts
// (VEHICLES) — verified specs, amenities, use cases, planning tips and FAQs.
// Nothing invented. Form fields match the booking form's prefill params.
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, ChevronRight, Phone, ShieldCheck, Tag, Headset, Quote, Users, Luggage, Snowflake, MonitorPlay } from "lucide-react";
import FaqAccordion from "@/components/Faq";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site-data";
import { VEHICLES, type Vehicle } from "@/lib/fleet-data";
import VehiclePhoto from "@/components/VehiclePhoto";
import { fleetShots } from "@/lib/fleet-photos";
import { serviceSchema as serviceSchemaOf } from "@/lib/schema";

const FACTS = [
  { dt: "Quote reply time", dd: "15", unit: "min" },
  { dt: "Gratuity, tolls & taxes", dd: "Included", unit: "" },
  { dt: "Dispatch support", dd: "24/7", unit: "" },
  { dt: "States covered", dd: "50", unit: "" },
];

export default function PremiumFleetPage({ v, others, h1, em, gallery = [] }: { v: Vehicle; others: Vehicle[]; h1?: string; em?: string; gallery?: string[] }) {
  const h1Plain = h1 || `${v.cardName} Rental for `;
  const h1Em = em || "Groups";
  const serviceSchema = serviceSchemaOf({
    path: `/fleet/${v.slug}/`,
    name: `${v.cardName} Rental`,
    description: v.metaDescription,
    image: `${SITE.url}${v.photo}`,
  });
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: v.faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
  };

  // The four real spec chips from fleet-data.
  const specs = [
    { icon: <Users size={14} aria-hidden="true" />, label: v.passengers },
    { icon: <Luggage size={14} aria-hidden="true" />, label: v.luggage },
    { icon: <Snowflake size={14} aria-hidden="true" />, label: v.climate },
    { icon: <MonitorPlay size={14} aria-hidden="true" />, label: v.technology },
  ];

  return (
    <main className="pp bg-white pp-svc" style={{ fontSize: "inherit" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Fleet", href: "/fleet/" }, { label: v.cardName }]} />

      {/* ===== hero with quote form (same frame as city/service pages) ===== */}
      <section className="pp-hero">
        <div className="container">
          <div className="pp-hero-grid">
            <div>
              <p className="pp-eyebrow">{`Cascade Fleet · ${v.passengers}`}</p>
              <h1>
                {h1Plain}
                <em>{h1Em}</em>
              </h1>
              <p className="pp-lead">
                {v.intro}
              </p>
              <div className="pp-hero-ctas">
                <a className="pp-btn pp-btn-amber" href="/contact/" data-source={`fleet-hero:${v.slug}`} rel="nofollow">Get a Free Quote <ArrowRight aria-hidden="true" /></a>
                <a className="pp-btn pp-btn-ghost" href={`tel:${SITE.phoneTel}`}><Phone aria-hidden="true" /> {SITE.phoneDisplay}</a>
              </div>
              <ul className="pp-trust">
                <li><ShieldCheck aria-hidden="true" />DOT-compliant fleet</li>
                <li><Tag aria-hidden="true" />Gratuity, tolls &amp; taxes included</li>
                <li><Headset aria-hidden="true" />24/7 dispatch</li>
              </ul>
            </div>

            <form className="pp-quote" id="quote" action="/contact/" method="get" aria-labelledby="fl-quote-title">
              <h2 id="fl-quote-title">{`Plan your ${v.ctaName.toLowerCase()} trip`}</h2>
              <p className="pp-sub-note">One final price. Average reply in about 15 minutes.</p>
              {/* same prefill params as city/service hero forms */}
              <input type="hidden" name="source" value={`fleet:${v.slug}`} />
              <div className="pp-field">
                <label htmlFor="fl-q-pickup">Pickup location</label>
                <input id="fl-q-pickup" name="pickup" type="text" placeholder="Hotel, office, venue or home" autoComplete="street-address" />
              </div>
              <div className="pp-field">
                <label htmlFor="fl-q-dest">Destination</label>
                <input id="fl-q-dest" name="destination" type="text" placeholder="Where the group is going" />
              </div>
              <div className="pp-field-row">
                <div className="pp-field">
                  <label htmlFor="fl-q-date">Travel date</label>
                  <input id="fl-q-date" name="date" type="date" />
                </div>
                <div className="pp-field">
                  <label htmlFor="fl-q-pax">Passengers</label>
                  <select id="fl-q-pax" name="passengers" defaultValue="">
                    <option value="">Select</option>
                    <option value="14">1–14 (Sprinter)</option>
                    <option value="32">15–32 (Minibus)</option>
                    <option value="60">33–60 (Coach / School bus)</option>
                    <option value="60-plus">60+ (Multiple vehicles)</option>
                  </select>
                </div>
              </div>
              <button className="pp-btn pp-btn-amber" type="submit" data-source={`fleet:${v.slug}`}>See the Full Booking Form <ArrowRight aria-hidden="true" /></button>
              <p className="pp-fine"><Check aria-hidden="true" />No obligation · No hidden fees</p>
            </form>
          </div>
        </div>
      </section>

      {/* ===== facts strip (real vehicle specs) ===== */}
      <section className="pp-facts" aria-label={`${v.cardName} key facts`}>
        <div className="container">
          <dl className="pp-facts-grid">
            <div className="pp-fact"><dt>Capacity</dt><dd>{v.passengers}</dd></div>
            <div className="pp-fact"><dt>Luggage</dt><dd>{v.luggage}</dd></div>
            <div className="pp-fact"><dt>Dispatch support</dt><dd>24/7</dd></div>
            <div className="pp-fact"><dt>States covered</dt><dd>50</dd></div>
          </dl>
        </div>
      </section>

      {/* ===== the vehicle: media band with overlaid spec chips ===== */}
      <section className="pp-sec" id="about">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">What this vehicle is</p>
            <h2>{v.tagline}</h2>
            <p>{v.intro}</p>
          </header>
          <div className="pp-vhero">
            <Image src={v.photo} alt={`${v.cardName} - Cascade Charter Bus`} fill sizes="(max-width: 900px) 100vw, 90vw" style={{ objectFit: "cover" }} priority />
            <div className="pp-vhero-chips" aria-label={`${v.cardName} key specs`}>
              {specs.map((sp) => (
                <span className="pp-spec pp-spec-dark" key={sp.label}>{sp.icon}{sp.label}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== photo showcase (extra photos dropped in the vehicle's folder by
          the owner — data/fleet-photos.json, generated by scripts/fleet-manifest
          at build). Compact, evenly-sized tiles (owner asked for small shots). ===== */}
      {gallery.length > 0 && (
        <section className="pp-sec pp-bg-white" id="photos">
          <div className="container">
            <header className="pp-sec-head">
              <p className="pp-eyebrow">Photo showcase</p>
              <h2>{`More photos of our ${v.ctaName.toLowerCase()}`}</h2>
              <p>Actual vehicles from our fleet. Tell dispatch if a specific photo matters to your event and we&apos;ll match it.</p>
            </header>
            <div className="pp-vshow">
              {gallery.map((src, i) => (
                <figure key={src} className="pp-service-photo">
                  <Image src={src} alt={`${v.cardName} photo ${i + 1} - Cascade Charter Bus fleet`} width={460} height={345} sizes="(max-width: 640px) 45vw, 230px" style={{ width: "100%", height: "auto", objectFit: "cover" }} loading="lazy" />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== what's on board ===== */}
      <section className="pp-sec" id="features">
        <div className="container">
          <header className="pp-sec-head mx-auto text-center" style={{ maxWidth: 760 }}>
            <p className="pp-eyebrow">On board</p>
            <h2>What the group gets on every {v.ctaName.toLowerCase()}</h2>
            <p>The standard features of the vehicle your quote proposes—confirmed vehicle-by-vehicle if a specific amenity matters.</p>
          </header>
          <div className="pp-list-card">
            <ul className="pp-checklist" style={{ width: "100%" }}>
              {v.features.map((feat) => (
                <li key={feat}><Check aria-hidden="true" /><span>{feat}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== ideal for (service links) ===== */}
      <section className="pp-sec" id="best-for">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">Ideal for</p>
            <h2>{`Groups that book the ${v.ctaName.toLowerCase()}`}</h2>
            <p>Each chip opens the service page that pairs with this vehicle.</p>
          </header>
          <div className="d-flex flex-wrap gap-2 mb-5">
            {v.bestFor.map((b) => (
              <Link key={b.href} href={b.href} className="pp-chip">{b.label} <ChevronRight size={13} style={{ verticalAlign: "-2px" }} aria-hidden="true" /></Link>
            ))}
          </div>
          <div className="row g-3">
            {v.whyChoose.map((w) => (
              <div className="col-md-6" key={w}>
                <div className="p-3 h-100 d-flex align-items-start gap-2" style={{ background: "var(--pp-white)", border: "1px solid var(--pp-line)", borderRadius: 16 }}>
                  <Check size={16} style={{ color: "var(--pp-amber)", flexShrink: 0, marginTop: 3 }} aria-hidden="true" />
                  <p className="mb-0" style={{ color: "var(--pp-ink)", fontSize: "0.95rem", lineHeight: 1.6 }}>{w}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== real trips (light cards) ===== */}
      <section className="pp-sec pp-bg-white" id="use-cases">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">Real runs</p>
            <h2>Trips this vehicle is booked for</h2>
            <p>How customers actually use the {v.ctaName.toLowerCase()}, so you can match it to your own trip.</p>
          </header>
          <div className="pp-service-gallery">
            {v.useCases.map((u) => (
              <div key={u.title} style={{ background: "var(--pp-white)", border: "1px solid var(--pp-line)", borderRadius: 22, padding: "1.6rem 1.7rem" }}>
                <h3 style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--pp-ink)", marginBottom: 8 }}>{u.title}</h3>
                <p className="mb-0" style={{ color: "var(--pp-muted)", fontSize: "0.95rem", lineHeight: 1.65 }}>{u.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== planning tips (dark band) ===== */}
      <section className="pp-sec pp-bg-ink on-dark" id="tips">
        <div className="container">
          <header className="pp-sec-head mx-auto text-center" style={{ maxWidth: 760 }}>
            <p className="pp-eyebrow" style={{ color: "var(--pp-amber)" }}>Before you book</p>
            <h2 style={{ color: "#fff" }}>Planning tips for a final quote</h2>
            <p style={{ color: "#a9b0c2" }}>Four answers settle most of the details. Give them to the dispatch team and the quote comes back final, with the vehicle already chosen.</p>
          </header>
          <ol className="pp-steps">
            {v.planningTips.map((tip, i) => (
              <li className="pp-step" key={i}>
                <div className="pp-step-num" aria-hidden="true">{i + 1}</div>
                <p style={{ color: "#e7eaf2", fontWeight: 600, fontSize: "1.02rem", margin: 0, lineHeight: 1.6 }}>{tip}</p>
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
            <h2>{`${v.cardName} questions`}</h2>
            <p>What groups ask before booking this vehicle.</p>
          </header>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <FaqAccordion faqs={v.faqs} idPrefix={`fleet-${v.slug}`} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== other fleet options ===== */}
      <section className="pp-sec" id="related">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">The rest of the fleet</p>
            <h2>Other fleet options</h2>
            <p>Seven vehicle types across one booking—mix them in any trip.</p>
          </header>
          <div className="pp-service-gallery">
            {others.map((o) => (
              <Link key={o.slug} href={`/fleet/${o.slug}/`} className="pp-hub-card" aria-label={`${o.cardName} details`}>
                <div className="pp-hub-media">
                  <VehiclePhoto
                    photos={fleetShots(o.slug, o.photo)}
                    alt={`${o.cardName} - Cascade Charter Bus`}
                    fill
                    sizes="(max-width: 800px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="pp-hub-body">
                  <span className="pp-badge">{o.passengers}</span>
                  <h2 className="pp-hub-name">{o.cardName}</h2>
                  <p className="mb-0" style={{ color: "var(--pp-muted)", fontSize: "0.88rem", lineHeight: 1.5 }}>{o.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== final CTA (amber band) ===== */}
      <section className="pp-cta-band">
        <div className="container pp-cta-inner">
          <div>
            <h2>{`Need a ${v.ctaName.toLowerCase()}?`}</h2>
            <p>Headcount, luggage and route in—one final quote out, usually in about 15 minutes.</p>
          </div>
          <div className="pp-cta-actions">
            <a className="pp-btn pp-btn-dark" href="/contact/" data-source={`fleet-cta:${v.slug}`} rel="nofollow">Get a Free Quote <ArrowRight aria-hidden="true" /></a>
            <a className="pp-btn pp-btn-outline-dark" href={`tel:${SITE.phoneTel}`}><Phone aria-hidden="true" />{`Call ${SITE.phoneDisplay}`}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
