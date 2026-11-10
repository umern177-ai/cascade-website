// Shared legal-page renderer: same simple layout for privacy, terms,
// cancellation. Text comes from lib/legal-content.ts (live text, kept).
import Breadcrumbs from "@/components/Breadcrumbs";
import { LEGAL } from "@/lib/legal-content";

type Keys = keyof typeof LEGAL;

const META: Record<Keys, { title: string; h1: string; description: string }> = {
  "privacy-policy": {
    title: "Privacy Policy",
    h1: "Privacy Policy",
    description: "How Cascade Charter Bus collects, uses and protects your personal information.",
  },
  termsandconditions: {
    title: "Terms & Conditions",
    h1: "Terms & Conditions",
    description: "Service terms for Cascade Charter Bus bookings, rates and driver regulations.",
  },
  "cancellation-policy": {
    title: "Cancellation & Refund Policy",
    h1: "Cancellation & Refund Policy",
    description: "Booking deposits, cancellation windows and refund terms for group charters.",
  },
};

export default function LegalBody({ slug }: { slug: Keys }) {
  const meta = META[slug];
  const items: ReadonlyArray<{ 0: string; 1: string }> = LEGAL[slug];
  return (
    <main className="bg-white min-vh-100">
      <section className="py-5 bg-dark text-white" style={{ paddingTop: 140, paddingBottom: 60 }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-2">{meta.h1}</h1>
        </div>
      </section>
      <div className="container py-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: meta.h1 }]} />
      </div>
      <section className="pb-5">
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="text-body">
            {items.map((it, i) => {
              const text = it[1].replace(/\*\*/g, "");
              if (it[0] === "p" && i === 0) {
                return <p className="lead text-dark" key={i}>{decode(text)}</p>;
              }
              if (it[0].startsWith("h")) {
                const level = it[0];
                if (level === "h3") return <h2 className="h4 fw-bold text-dark mt-4" key={i}>{decode(text)}</h2>;
                if (level === "h4") return <h3 className="h5 fw-bold text-dark mt-4" key={i}>{decode(text)}</h3>;
                return <p className="h3 fw-bold" key={i}>{decode(text)}</p>;
              }
              if (it[0] === "li") {
                return (
                  <li key={i} className="d-flex align-items-start gap-2 mb-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted">{decode(text)}</span>
                  </li>
                );
              }
              return <p className="text-muted" key={i}>{decode(text)}</p>;
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&[a-z]+;/gi, " ");
}
