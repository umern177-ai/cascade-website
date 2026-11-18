// About page — premium pp-* design (Nov 17), same facts as before, corrected
// per brief 7.5b: "5+ years of service" (no 10+/15+), no invented trips,
// drivers or rating numbers. One real testimonial from SITE data.
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Phone, ShieldCheck, Bus, MapPin, Clock, Tag, Headset, Quote } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site-data";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  // absolute: "About Cascade Charter Bus" would otherwise get the brand
  // appended again by the root template (brand must appear exactly once).
  title: "About Cascade Charter Bus",
  description:
    "About Cascade Charter Bus: group transportation across the US with DOT-certified drivers, 24/7 dispatch, 5+ years of service and coverage in all 50 states.",
  path: "/about/",
});

const STANDARDS = [
  {
    icon: ShieldCheck,
    title: "Safety-First Culture",
    text: "Our DOT-compliant safety protocols include rigorous multi-point inspections and electronic logging.",
  },
  {
    icon: Bus,
    title: "Well-Equipped Coaches",
    text: "High-speed WiFi, power outlets, and climate control are available on most motorcoaches—we confirm the amenities for your vehicle when you book.",
  },
  {
    icon: MapPin,
    title: "Local Expertise",
    text: "We employ drivers with deep knowledge of local routes to navigate city traffic efficiently.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    text: "Dispatch is reachable around the clock, before and during your trip.",
  },
];

// Real testimonial — one real review in site data, used word for word.
const TESTIMONIAL = {
  text: "Pardon the tardy email, but I wanted to extend a sincere thank you! Thank you for helping us coordinate and secure a bus for 8/15 from the Connecticut River Museum to Mohegan Sun. A huge thank you to Eric, our driver, who was exceedingly friendly, kind, and helpful. We had an outstanding experience with Cascade thanks to Eric and your entire planning and dispatch team.",
  name: "Ben Brancati",
};

const FACTS = [
  { dd: "5+", dt: "Years of Service" },
  { dd: "50", dt: "States Covered" },
  { dd: "24/7", dt: "Dispatch Team" },
  { dd: "7", dt: "Vehicle Types" },
];

export default function About() {
  return (
    <main className="pp bg-white pp-svc" style={{ fontSize: "inherit" }}>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      {/* ===== hero (dark band, matching the site frame) ===== */}
      <section className="pp-hero">
        <div className="container">
          <div className="pp-hero-solo">
            <p className="pp-eyebrow">About Cascade Charter Bus</p>
            <h1>
              A Fleet Built for <em>Every Kind of Group</em>
            </h1>
            <p className="pp-lead">
              Nationwide transportation with a commitment to safety, comfort and
              reliability—one standard everywhere, from New York to Los Angeles.
            </p>
            <div className="pp-hero-ctas">
              <Link className="pp-btn pp-btn-amber" href="/contact/" data-source="about-hero" rel="nofollow">Get a Free Quote <ArrowRight aria-hidden="true" /></Link>
              <a className="pp-btn pp-btn-ghost" href={`tel:${SITE.phoneTel}`}><Phone aria-hidden="true" /> {SITE.phoneDisplay}</a>
            </div>
            <ul className="pp-trust">
              <li><ShieldCheck aria-hidden="true" />DOT-compliant fleet</li>
              <li><Tag aria-hidden="true" />Gratuity, tolls &amp; taxes included</li>
              <li><Headset aria-hidden="true" />24/7 dispatch</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== facts strip (confirmed facts only) ===== */}
      <section className="pp-facts" aria-label="Cascade Charter Bus key facts">
        <div className="container">
          <dl className="pp-facts-grid">
            {FACTS.map((f) => (
              <div className="pp-fact" key={f.dt}>
                <dt>{f.dt}</dt>
                <dd>{f.dd}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ===== driving excellence: copy + media band ===== */}
      <section className="pp-sec" id="story">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">Our story</p>
            <h2>Driving excellence across the nation</h2>
            <p>Cascade Charter was founded to bridge the gap between local transport and nationwide reliability.</p>
          </header>
          <div className="row g-4 g-lg-5 align-items-center">
            <div className="col-lg-6">
              <p style={{ color: "var(--pp-muted)", fontSize: "1.05rem", lineHeight: 1.75 }}>
                What started with a focus on local corporate shuttles has evolved into a{" "}
                <strong style={{ color: "var(--pp-ink)" }}>premier nationwide network</strong>. We specialize in
                complex logistics, ensuring that whether you are booking in New York or Los Angeles,
                the quality remains consistent.
              </p>
              <ul className="pp-checklist" style={{ marginTop: "1.4rem" }}>
                <li><Check aria-hidden="true" /><span>Real-time tracking on the road</span></li>
                <li><Check aria-hidden="true" /><span>24/7 logistics support before and during the trip</span></li>
              </ul>
              <div className="d-flex align-items-start gap-3 p-3 mt-4" style={{ borderLeft: "4px solid var(--pp-amber)", borderRadius: 12, background: "rgba(245,160,2,0.07)" }}>
                <Check size={20} style={{ color: "var(--pp-amber)", flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                <p className="mb-0 small fw-medium" style={{ color: "var(--pp-ink)" }}>
                  One standard everywhere: on-time, safe, and ready before the group arrives.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="pp-vhero" style={{ minHeight: 380 }}>
                <Image src="/images/fleet/charter.jpg" alt="Cascade Charter Bus motorcoach" fill sizes="(max-width: 992px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                <div className="pp-vhero-chips">
                  <span className="pp-spec pp-spec-dark"><Quote size={13} aria-hidden="true" />5+ years of service</span>
                  <span className="pp-spec pp-spec-dark">50 states covered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== operating standards ===== */}
      <section className="pp-sec pp-bg-white" id="standards">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">How we run</p>
            <h2>Our operating standards</h2>
            <p>The four disciplines behind every quote, every vehicle and every dispatch hour.</p>
          </header>
          <div className="pp-steps" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            {STANDARDS.map((s) => (
              <div className="pp-step" key={s.title}>
                <s.icon size={30} style={{ color: "var(--pp-amber)", flexShrink: 0 }} aria-hidden="true" />
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== real testimonial ===== */}
      <section className="pp-sec" id="testimonial">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">From an organizer</p>
            <h2>What a real trip looked like</h2>
          </header>
          <div className="pp-final-card" style={{ maxWidth: 980 }}>
            <Quote size={28} style={{ color: "var(--pp-amber)" }} aria-hidden="true" />
            <p className="mt-3" style={{ fontStyle: "italic" }}>{`“${TESTIMONIAL.text}”`}</p>
            <p style={{ color: "var(--pp-ink)", fontWeight: 700, marginTop: 14, marginBottom: 0 }}>— {TESTIMONIAL.name}</p>
          </div>
        </div>
      </section>

      {/* ===== final CTA (amber band) ===== */}
      <section className="pp-cta-band">
        <div className="container pp-cta-inner">
          <div>
            <h2>Travel with a team that plans ahead</h2>
            <p>Share the itinerary—get a final quote, usually in about 15 minutes.</p>
          </div>
          <div className="pp-cta-actions">
            <a className="pp-btn pp-btn-dark" href="/contact/" data-source="about-cta" rel="nofollow">Get a Free Quote <ArrowRight aria-hidden="true" /></a>
            <a className="pp-btn pp-btn-outline-dark" href={`tel:${SITE.phoneTel}`}><Phone aria-hidden="true" />{`Call ${SITE.phoneDisplay}`}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
