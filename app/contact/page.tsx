// Contact / booking page — premium pp-* frame (Nov 17) around the WORKING
// QuoteForm: dark hero with trust chips, facts strip, form + quick-contact
// cards aligned, FAQ, coverage map. No functional form changes.
import UsMap from "@/components/UsMap";
import { Phone, Mail, ShieldCheck, Tag, Headset } from "lucide-react";
import QuoteForm from "@/components/QuoteForm";
import FaqAccordion from "@/components/Faq";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site-data";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "Charter Bus Booking & Free Quote",
  description:
    "Request a detailed itinerary quote for your group trip. Average response: 15 minutes. 24/7 dispatch, final pricing with gratuity included, U.S.-wide coverage.",
  path: "/contact/",
});

const CONTACT_FAQS = [
  {
    q: "How fast will I get my quote?",
    a: "Average response is about 15 minutes during dispatch hours, at any time—coverage is 24/7. Urgent requests are handled by phone fastest.",
  },
  {
    q: "What does the quote include?",
    a: "The vehicle, a professional driver, tolls, taxes and driver gratuity. The quote you receive is final—no hidden fuel surcharges or driver fees.",
  },
  {
    q: "What happens after I send the form?",
    a: "You get a confirmation email right away, then a detailed itinerary quote from the dispatch team. If anything is unclear, they follow up by phone or email.",
  },
  {
    q: "Can I change the trip after booking?",
    a: `Route and timing changes are usually fine—dispatch adjusts the plan with you. Cancellation terms are on our cancellation policy page.`,
  },
];

const FACTS = [
  { dt: "Quote reply time", dd: "15", unit: "min" },
  { dt: "Gratuity, tolls & taxes", dd: "Included", unit: "" },
  { dt: "Dispatch support", dd: "24/7", unit: "" },
  { dt: "States covered", dd: "50", unit: "" },
];

export default function Contact() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CONTACT_FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main className="pp bg-white pp-svc" style={{ fontSize: "inherit" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      {/* ===== hero (dark band, matching the site frame) ===== */}
      <section className="pp-hero">
        <div className="container">
          <div className="pp-hero-solo">
            <p className="pp-eyebrow">Booking &amp; free quote</p>
            <h1>
              Book Your <em>Group Transportation</em>
            </h1>
            <p className="pp-lead">
              Complete the form below for a detailed itinerary quote. Average
              response time: about 15 minutes, any hour of the day.
            </p>
            <ul className="pp-trust">
              <li><ShieldCheck aria-hidden="true" />DOT-compliant fleet</li>
              <li><Tag aria-hidden="true" />Gratuity, tolls &amp; taxes included</li>
              <li><Headset aria-hidden="true" />24/7 dispatch</li>
            </ul>
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

      {/* ===== form + quick contact (aligned grid) ===== */}
      <section className="pp-sec" id="quote">
        <div className="container">
          <div className="pp-form-grid">
            <div className="pp-form-holder">
              <QuoteForm />
            </div>
            <div className="pp-form-side">
              <div className="pp-list-card" style={{ padding: "1.6rem 1.6rem" }}>
                <p className="fw-bold mb-3" style={{ fontSize: "1.05rem", color: "var(--pp-ink)" }}>Quick Contact</p>
                <div className="d-flex mb-3 align-items-center">
                  <div className="p-3 rounded-circle me-3" style={{ background: "rgba(245,160,2,0.12)", color: "var(--pp-amber)" }}>
                    <Phone size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="mb-0 fw-bold" style={{ color: "var(--pp-ink)" }}>
                      <a href={`tel:${SITE.phoneTel}`} className="text-decoration-none" style={{ color: "var(--pp-ink)" }}>{SITE.phoneDisplay}</a>
                    </p>
                    <p className="small mb-0" style={{ color: "var(--pp-muted)" }}>{SITE.phoneNote}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="p-3 rounded-circle me-3" style={{ background: "rgba(245,160,2,0.12)", color: "var(--pp-amber)" }}>
                    <Mail size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="mb-0 fw-bold" style={{ color: "var(--pp-ink)" }}>
                      <a href={`mailto:${SITE.email}`} className="text-decoration-none" style={{ color: "var(--pp-ink)" }}>{SITE.email}</a>
                    </p>
                    <p className="small mb-0" style={{ color: "var(--pp-muted)" }}>Direct Support</p>
                  </div>
                </div>
              </div>
              {/* Card caption as a styled <p>: the page's next real heading level
                  is h2, so an h3 here would skip a heading level (Lighthouse). */}
              <div className="pp-final-card" style={{ marginTop: 18 }}>
                <ShieldCheck aria-hidden="true" />
                <p className="fw-bold mb-2" style={{ fontSize: "1.15rem", color: "var(--pp-ink)", margin: "12px 0 8px" }}>Guaranteed pricing</p>
                <p>The quote you receive is final. No hidden fuel surcharges or driver fees.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="pp-sec pp-bg-white" id="faq">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">Booking questions</p>
            <h2>Before you hit send</h2>
            <p>The four things organizers ask first.</p>
          </header>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <FaqAccordion faqs={CONTACT_FAQS} idPrefix="contact-faq" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== coverage map — whole-USA SVG with a pin in every state (owner
          request Nov 19: replaces the click-to-load Google embed) ===== */}
      <section className="pp-sec" id="map">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">Coverage</p>
            <h2>Sent from one station, received in every state</h2>
            <p>Dispatch runs from South Ozone Park, NY — and routes run to all 50 states, DC and the small towns in between.</p>
          </header>
          <div className="rounded-5" style={{ background: "linear-gradient(140deg,#1e2126,#0f1115)", padding: "clamp(10px, 2.5vw, 28px)" }}>
            <UsMap />
          </div>
        </div>
      </section>
    </main>
  );
}
