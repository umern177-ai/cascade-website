// Structured city page — the consultant's content structure (data/city-pages.json)
// on the same house theme: hero → service blocks → vehicles → destinations with
// bus tips → nearby → FAQs → CTA. Facts live in the data file with review checks
// and sources kept for the owner's batch review (not rendered publicly).
import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqAccordion from "@/components/Faq";
import BookingProcess from "@/components/BookingProcess";
import { VEHICLES } from "@/lib/fleet-data";
import { keptCities, isKept, stateName } from "@/lib/locations";
import { SITE } from "@/lib/site-data";
import type { CityPageData } from "@/lib/city-page-data";

const SERVICE_IMAGES: Record<string, string> = {
  "corporate-transportation": "/images/services/corp.webp",
  "wedding-transportation": "/images/services/wed.webp",
  "school-transportation": "/images/services/school.webp",
  "sports-team-transportation": "/images/services/sport.webp",
  "airport-transfer": "/images/services/airport.webp",
  "sightseeing-tour-bus": "/images/services/multi.webp",
  "church-religious-transportation": "/images/services/school.webp",
  "band-tour-bus": "/images/fleet/sleeper.jpg",
};

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
      <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Locations", href: "/locations/" },
            { label: stName, href: `/locations/${state}/` },
            { label: name },
          ]}
        />

      <section className="py-5 bg-dark text-white" style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <span className="text-primary fw-bold text-uppercase tracking-widest mb-3 d-block">
            Charter Bus Rental
          </span>
          <p className="city-hero-display fw-bold mb-3">{`Charter Bus Rental in ${name}, ${state.toUpperCase()}`}</p>
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
        </div>
      </section>

      {/* Local intro */}
      <section className="py-5 pb-0">
        <div className="container" style={{ maxWidth: 880 }}>
          <h1 className="city-intro-h1 fw-bold text-dark mb-3">{data.h1}</h1>
          <p className="text-muted lead mb-0">{data.heroIntro}</p>
        </div>
      </section>

      {/* Services */}
      <section className="py-5">
        <div className="container py-4">
          <h2 className="display-6 fw-bold text-dark mb-4">{data.servicesHeading}</h2>
          <div className="row g-4">
            {data.services.map((sv) => {
              const slug = sv.href.replace("/services/", "").replace("/", "");
              const img = SERVICE_IMAGES[slug];
              return (
                <div className="col-12" key={sv.title}>
                  <div className="card border-0 shadow-sm rounded-4 h-100 bg-white overflow-hidden">
                    <div className="row g-0 h-100 align-items-center">
                      <div className="col-md-7 p-4 d-flex flex-column order-2 order-md-1">
                        <h3 className="h5 fw-bold text-dark mb-3">{sv.title}</h3>
                        <p className="text-muted services-card-text mb-3">{sv.text}</p>
                        <Link href={sv.href} className="fw-bold small text-decoration-none text-primary mt-auto">
                          Learn More →
                        </Link>
                      </div>
                      {img && (
                        <div className="col-md-5 order-1 order-md-2 px-3 px-md-0 pt-3 pt-md-0">
                          <Image
                            src={img}
                            alt={`${sv.title} — Cascade Charter Bus`}
                            width={520}
                            height={360}
                            className="w-100 object-fit-cover rounded-3"
                            style={{ height: 210 }}
                            sizes="(max-width: 768px) 100vw, 40vw"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fleet showcase — photos in a compact row; click opens the fleet page */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <h2 className="display-6 fw-bold text-dark mb-4">{data.vehiclesHeading}</h2>
          <div className="row g-3 fleet-slider">
            {vehicles.map((v) => (
              <div className="col-lg-3 col-md-4 col-6" key={v.slug}>
                <a className="text-decoration-none" href={`/fleet/${v.slug}/`}>
                  <div className="card border-0 shadow-sm rounded-4 hover-lift h-100 overflow-hidden bg-white">
                    <Image
                      src={v.meta!.photo}
                      alt={`${v.meta!.cardName} — see details`}
                      width={420}
                      height={240}
                      className="w-100 object-fit-cover"
                      style={{ height: 130 }}
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="p-3">
                      <h3 className="h6 fw-bold text-dark mb-1">{v.meta!.cardName}</h3>
                      <span className="badge bg-primary text-dark rounded-pill px-3 py-1 x-small-bold">{v.meta!.passengers}</span>
                      <p className="text-muted x-small mb-0 mt-2">{v.reason}</p>
                    </div>
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
              <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 bg-white" key={d.name}>
                <h3 className="dest-name fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                  <span
                    className="badge bg-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 32, height: 32, fontSize: "0.95rem" }}
                  >
                    {i + 1}
                  </span>
                  {d.name}
                </h3>
                <p className="text-muted small mb-2">{d.text}</p>
                <div className="d-flex align-items-start gap-2 p-2 p-md-3 bg-light rounded-3 border-start border-primary border-3">
                  <span className="fw-bold x-small text-dark flex-shrink-0 mt-1">Bus drop-off tip:</span>
                  <span className="text-muted x-small">{d.tip}</span>
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
            <div className="row g-3">
              {nearbyItems.map((n) => (
                <div className="col-md-4 col-6" key={n.city}>
                  {n.path ? (
                    <Link href={n.path} className="text-decoration-none">
                      <div className="card border-0 shadow-sm rounded-4 hover-lift p-3 h-100 bg-white">
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="fw-bold text-dark">{n.city}</span>
                          <span aria-hidden="true" className="text-muted">→</span>
                        </div>
                        {n.miles && <p className="text-muted small mb-0 mt-1">{n.miles}</p>}
                      </div>
                    </Link>
                  ) : (
                    <div className="card border-0 rounded-4 p-3 h-100" style={{ background: "rgba(245,160,2,0.06)" }}>
                      <span className="fw-bold text-dark">{n.city}</span>
                      {n.miles && <p className="text-muted small mb-0 mt-1">{n.miles}</p>}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* City map (lazy iframe, loads when scrolled into view) */}
      <section className="py-5">
        <div className="container py-4">
          <h2 className="display-6 fw-bold text-dark mb-4">{name} on the map</h2>
          <div className="rounded-5 overflow-hidden shadow-sm border position-relative" style={{ height: 420 }}>
            <iframe
              title={`Map of ${name}, ${stName} and surrounding areas`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(name + ", " + state.toUpperCase())}&z=10&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Booking process */}
      <BookingProcess pickup={pickup} />

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
