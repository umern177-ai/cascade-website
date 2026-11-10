// FAQs page — dark hero + accordion, same look as the live /faqs/ page.
// The live questions are kept (brief 7.11 "keep text"); the wider grouped list
// grows in Phase 3 as more page FAQs are written. FAQPage schema included.
import Link from "next/link";
import FaqAccordion from "@/components/Faq";
import { Site } from "@/lib/faq-data";
import { HOME_FAQS } from "@/lib/site-data";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "Frequently Asked Questions | Charter Bus Rentals",
  description:
    "Answers about booking, safety, cancellations, amenities and group travel logistics for charter bus rentals nationwide.",
  path: "/faqs/",
});

const ALL = [...Site.faqs, ...HOME_FAQS.filter((f) => !Site.faqs.some((s) => s.q === f.q))];

export default function FaqsPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ALL.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <main className="bg-dark min-vh-100 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="text-center" style={{ paddingTop: 140, paddingBottom: 60 }}>
        <div className="container">
          <p className="text-brand-dark fw-bold text-uppercase tracking-widest mb-3 x-small-bold">Knowledge Base</p>
          <h1 className="fw-black display-5">
            FREQUENTLY ASKED <span className="text-primary">QUESTIONS</span>
          </h1>
          <p className="mx-auto opacity-75 mt-3" style={{ maxWidth: 600 }}>
            Everything you need to know about booking, safety, and logistics for your next group journey.
          </p>
        </div>
      </section>
      <section className="pb-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 rounded-4 p-2 p-md-4 bg-white">
                <FaqAccordion faqs={ALL} idPrefix="faqs-page" />
              </div>
            </div>
          </div>
          <p className="text-center opacity-75 mt-4">
            Not seeing your question?{" "}
            <Link href="/contact/" className="text-primary fw-bold text-decoration-none">
              Ask the dispatch team
            </Link>{" "}
            — they answer around the clock.
          </p>
        </div>
      </section>
    </main>
  );
}
