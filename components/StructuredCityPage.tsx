// Structured city page — the consultant's content structure (data/city-pages.json)
// on the same house theme: hero → service blocks → vehicles → destinations with
// bus tips → nearby → FAQs → CTA. Facts live in the data file with review checks
// and sources kept for the owner's batch review (not rendered publicly).
import Link from "next/link";
import { Phone } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqAccordion from "@/components/Faq";
import { VEHICLES } from "@/lib/fleet-data";
import { keptCities, isKept, stateName } from "@/lib/locations";
import { SITE } from "@/lib/site-data";
import type { CityPageData } from "@/lib/city-page-data";

export default function StructuredCityPage({ data, state }: { data: CityPageData; state: string }) {
  const name = data.city;
  const stName = stateName(state);
  const pickup = `${name}, ${state.toUpperCase()}`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Charter Bus Rental in ${name}`,
    areaServed: { "@type": "City", name, containedInPlace: { "@type": "State", name: stName } },
    provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url, telephone: SITE.phoneDisplay },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const vehicles = data.vehicles
    .map((v) => ({ ...v, meta: VEHICLES.find((x) => x.slug === v.slug) }))
    .filter((v) => v.meta !== undefined);

  const nearbyItems = (data.nearby.items || []).map((n) => {
    const kept =
      keptCities(state).find((c) => c.city.toLowerCase() === n.city.toLowerCase()) ||
      keptCities(state).find((c) => c.city.startsWith(n.city));
    return { ...n, path: kept && isKept(state, kept.slug) ? `/locations/${state}/${kept.slug}/` : null };
  });

  return (
    <main className="bg-white min-vh-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="py-5 bg-dark text-white" style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <span className="text-primary fw-bold text-uppercase tracking-widest mb-3 d-block">
            Charter Bus Rental
          </span>
          <h1 className="display-5 fw-bold mb-3">{data.h1}</h1>
          <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
            <a
              href="/contact/"
              className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm"
              data-pickup={pickup}
              data-source={`city:${state}:${data.slug}`}
              rel="nofollow"
            >
              GET A QUOTE
            </a>
            <a className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold" href={`tel:${SITE.phoneTel}`}>
              <Phone size={16} className="me-2" aria-hidden="true" /> {SITE.phoneDisplay}
            </a>
          </div>
          <p className="fs-5 opacity-90 lead mb-0 text-center mt-4">{data.heroIntro}</p>
        </div>
      </section>

      <div className="container py-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Locations", href: "/locations/" },
            { label: stName, href: `/locations/${state}/` },
            { label: name },
          ]}
        />
      </div>

      {/* Services */}
      <section className="py-5">
        <div className="container py-4">
          <h2 className="display-6 fw-bold text-dark mb-4">{data.servicesHeading}</h2>
          <div className="row g-4">
            {data.services.map((sv) => (
              <div className="col-md-6" key={sv.title}>
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white d-flex flex-column">
                  <h3 className="h5 fw-bold text-dark mb-3">{sv.title}</h3>
                  <p className="text-muted small flex-grow-1 mb-3">{sv.text}</p>
                  <Link href={sv.href} className="fw-bold small text-decoration-none text-primary mt-auto">
                    Learn More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicles */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <h2 className="display-6 fw-bold text-dark mb-4">{data.vehiclesHeading}</h2>
          <div className="row g-3">
            {vehicles.map((v) => (
              <div className="col-md-6" key={v.slug}>
                <a className="text-decoration-none" href={`/fleet/${v.slug}/`}>
                  <div className="card border-0 shadow-sm rounded-4 hover-lift p-3 h-100 bg-white">
                    <div className="d-flex align-items-center justify-content-between">
                      <h3 className="h6 fw-bold text-dark mb-0">{v.meta!.cardName}</h3>
                      <span className="badge bg-dark rounded-pill px-3 py-1 small">{v.meta!.passengers}</span>
                    </div>
                    <p className="text-muted small mb-0 mt-2">{v.reason}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-5">
        <div className="container py-4">
          <h2 className="display-6 fw-bold text-dark mb-1">{data.destinationsHeading}</h2>
          <p className="text-muted small mb-4">Places on this page: {data.mapPins.join(" · ")}</p>
          <div className="vstack gap-4">
            {data.destinations.map((d, i) => (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white" key={d.name}>
                <div className="d-flex align-items-start gap-3">
                  <span
                    className="badge bg-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 34, height: 34, fontSize: "0.95rem" }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="h5 fw-bold text-dark mb-2">{d.name}</h3>
                    <p className="text-muted small mb-3">{d.text}</p>
                    <div className="d-flex align-items-start gap-2 p-3 bg-light rounded-3 border-start border-primary border-3">
                      <span className="fw-bold small text-dark flex-shrink-0">Bus drop-off tip:</span>
                      <span className="text-muted small">{d.tip}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <h2 className="display-6 fw-bold text-dark mb-4">{data.nearby.heading}</h2>
          {data.nearby.plainText ? (
            <p className="text-muted mb-0" style={{ maxWidth: 800 }}>
              {data.nearby.plainText}
            </p>
          ) : (
            <div className="row g-3">
              {nearbyItems.map((n) => (
                <div className="col-md-6 col-lg-4" key={n.city}>
                  {n.path ? (
                    <Link href={n.path} className="text-decoration-none">
                      <div className="card border-0 shadow-sm rounded-4 hover-lift p-3 h-100">
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="fw-bold text-dark">{n.city}</span>
                          <span aria-hidden="true" className="text-muted">→</span>
                        </div>
                        <p className="text-muted small mb-0 mt-1">{n.miles}</p>
                      </div>
                    </Link>
                  ) : (
                    <div className="card border-0 rounded-4 p-3 h-100" style={{ background: "rgba(245,160,2,0.06)" }}>
                      <span className="fw-bold text-dark">{n.city}</span>
                      <p className="text-muted small mb-0 mt-1">{n.miles}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold text-dark">{data.faqsHeading}</h2>
            <div className="mx-auto bg-primary mt-3" style={{ width: 60, height: 4 }} />
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <FaqAccordion faqs={data.faqs} idPrefix={`city-${state}-${data.slug}`} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 bg-dark text-white text-center">
        <div className="container py-4">
          <h2 className="display-6 fw-bold mb-3">{data.ctaHeading}</h2>
          <p className="text-white-50 mb-4">
            Fast, final quote. Gratuity, tolls and taxes included. Dispatch answers around the clock.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <a
              href="/contact/"
              className="btn btn-primary rounded-pill px-5 py-3 fw-bold btn-lg"
              data-pickup={pickup}
              data-source={`city:${state}:${data.slug}`}
              rel="nofollow"
            >
              GET A FREE QUOTE
            </a>
            <a className="btn btn-outline-light rounded-pill px-5 py-3 fw-bold btn-lg" href={`tel:${SITE.phoneTel}`}>
              CALL {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
