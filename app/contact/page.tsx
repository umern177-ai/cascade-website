// Contact / booking page — rebuilt from docs/live-reference/html/contact-booking-form.html.
// Layout, fields and look identical; hidden fixes per brief 7.9: correct headings
// (Quick Contact not an H5), amber dot pattern (was non-brand blue #0047AB),
// lazy Google Map with a title, FAQ block, phone/email links as links.
import { Phone, Mail, ShieldCheck } from "lucide-react";
import QuoteForm from "@/components/QuoteForm";
import FaqAccordion from "@/components/Faq";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site-data";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "Charter Bus Booking & Free Quote Request",
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

export default function Contact() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CONTACT_FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main className="bg-light min-vh-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="bg-dark text-white py-5 position-relative overflow-hidden" style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="container py-4 text-center position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-4 fw-bold mb-3">
            Professional <span className="text-primary">Charter Booking</span>
          </h1>
          <p className="lead opacity-75 mx-auto mb-0" style={{ maxWidth: 650 }}>
            Complete the form below for a detailed itinerary quote. Average response: 15 minutes.
          </p>
        </div>
        {/* dot pattern — brand amber at low strength (was non-brand blue) */}
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" style={{ backgroundImage: "radial-gradient(#F5A002 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      </section>

      <div className="container pt-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      </div>

      {/* Form + cards */}
      <section className="py-5 mt-n5 position-relative" style={{ zIndex: 10 }}>
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-lg rounded-5 overflow-hidden">
                <QuoteForm />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                <p className="fw-bold mb-4 h5 text-dark">Quick Contact</p>
                <div className="d-flex mb-3 align-items-center">
                  <div className="bg-light p-3 rounded-circle me-3 text-primary">
                    <Phone size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="mb-0 fw-bold text-dark mb-0">
                      <a href={`tel:${SITE.phoneTel}`} className="text-decoration-none text-dark">{SITE.phoneDisplay}</a>
                    </p>
                    <p className="small text-muted mb-0">{SITE.phoneNote}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="bg-light p-3 rounded-circle me-3 text-primary">
                    <Mail size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="mb-0 fw-bold text-dark mb-0">
                      <a href={`mailto:${SITE.email}`} className="text-decoration-none text-dark">{SITE.email}</a>
                    </p>
                    <p className="small text-muted mb-0">Direct Support</p>
                  </div>
                </div>
              </div>
              <div className="card border-0 bg-dark text-white p-4 rounded-4 shadow-sm text-center">
                <ShieldCheck size={40} className="text-primary mx-auto mb-2" aria-hidden="true" />
                <p className="fw-bold text-white h6 mb-2">Guaranteed Pricing</p>
                <p className="small opacity-75 mb-0">The quote you receive is final. No hidden fuel surcharges or driver fees.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ (brief 7.13) */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">Booking Questions</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <FaqAccordion faqs={CONTACT_FAQS} idPrefix="contact-faq" />
            </div>
          </div>
        </div>
      </section>

      {/* Map — loaded only when scrolled into view (IntersectionObserver via loading=lazy iframe) */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">Our Service Coverage</h2>
            <p className="text-muted">Dispatching across all major hubs and surrounding regions.</p>
          </div>
          <div className="rounded-5 overflow-hidden shadow-sm border position-relative" style={{ height: 450 }}>
            <iframe
              title="Google Map of New York — Cascade Charter Bus headquarters"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2528000654!2d-74.11976373966282!3d40.69766374859258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1689000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
