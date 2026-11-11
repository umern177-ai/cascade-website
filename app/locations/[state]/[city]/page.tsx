// City page template (brief Sections 7.8 + 8) — Phase 2 frame: breadcrumb,
// correct H1, hero with a quote CTA that pre-fills the pickup, nearby kept
// cities. The local content (City Profile sections) arrives in Phase 5; only
// cities in the keep list render (Rule R4) — any other URL 404s (410 handled in
// the Phase 6 redirect rules; here they simply do not exist as pages).
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { keptCities, isKept, stateName, nearbyKept, states } from "@/lib/locations";
import { VEHICLES } from "@/lib/fleet-data";
import { getCityContent, getCityFallback, type CityContent } from "@/lib/city-content";
import { variantsFor } from "@/lib/city-variants";
import { getStructuredCityPage } from "@/lib/city-page-data";
import StructuredCityPage from "@/components/StructuredCityPage"
import PremiumCityPage from "@/components/PremiumCityPage"
import FaqAccordion from "@/components/Faq";
import { SITE } from "@/lib/site-data";
import { pageMeta } from "@/lib/page-meta";

type Props = { params: Promise<{ state: string; city: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  // Only kept cities have pages (Rule R4): 710 pages.
  return states().flatMap((s) => s.cities.map((c) => ({ state: s.state_code, city: c.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city } = await params;
  const structured = getStructuredCityPage(state, city);
  if (structured) {
    return pageMeta({
      title: structured.title,
      description: structured.metaDescription,
      path: `/locations/${state}/${city}/`,
    });
  }
  const found = keptCities(state).find((c) => c.slug === city);
  if (!found) return {};
  return pageMeta({
    title: `Charter Bus Rental in ${found.city} | Cascade Charter Bus`,
    description: `Charter bus rental in ${found.city}, ${stateName(state)} for weddings, school trips, sports travel and corporate events. DOT-certified drivers, 24/7 dispatch, final quotes.`,
    path: `/locations/${state}/${city}/`,
  });
}

export default async function CityPage({ params }: Props) {
  const { state, city } = await params;
  const found = isKept(state, city) ? keptCities(state).find((c) => c.slug === city) : undefined;
  if (!found) notFound();

  const structured = getStructuredCityPage(state, city);
  if (structured) {
    // Cities with the "premium" block in data/city-pages.json render the full
    // premium design (owner-supplied HTML); the rest keep the structured layout.
    return structured.premium ? <PremiumCityPage data={structured} state={state} /> : <StructuredCityPage data={structured} state={state} />;
  }
  const nearby = nearbyKept(state, city, 4);
  const name = found.city;
  const stName = stateName(state);

  const cityContent: CityContent | null = getCityContent(state, city);
  const fallback = cityContent ?? {};
  const fb = getCityFallback(state, city);
  const v = variantsFor(`${state}/${city}`);
  const rep = (t: string) => t.replace(/{name}/g, name);
  const wedVenues: { name: string; note: string }[] =
    cityContent?.weddingVenues ??
    (fb?.venues || []).map((v: string) => ({ name: v, note: "Booked by real groups from this area" }));

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Charter Bus Rental in ${name}`,
    areaServed: { "@type": "City", name, containedInPlace: { "@type": "State", name: stName } },
    provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url, telephone: SITE.phoneDisplay },
  };

  return (
    <main className="bg-white min-vh-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      {/* Hero — the local photo + city-profile line arrive in Phase 5; frame matches the theme */}
      <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Locations", href: "/locations/" }, { label: stName, href: `/locations/${state}/` }, { label: name }]}
        />
<section className="py-5 bg-dark text-white" style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="container text-center" style={{ maxWidth: 900 }}>
          <span className="text-brand-dark fw-bold text-uppercase tracking-widest mb-3 d-block">Charter Bus Rental</span>
          <h1 className="display-4 fw-bold mb-3">Charter Bus Rental in {name}</h1>
          <p className="lead opacity-75 mb-4">
            Wedding shuttles, field trips, sports travel, corporate events and nationwide
            tours—one dispatch team from quote to drop-off.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <CityQuoteCta city={name} stateCode={state} />
            <a className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold" href={`tel:${SITE.phoneTel}`}>
              <Phone size={16} className="me-2" aria-hidden="true" /> {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </section>


      {/* Real local facts we hold (county + places real groups were picked up at) */}
      {fb && (
        <section className="py-4 pt-4">
          <div className="container">
            <p className="text-muted mb-0 small" style={{ maxWidth: 900 }}>
              {name} sits in {fb.county ? `${fb.county}, ` : ""}{stName}. When real groups
              traveled from {name}, pickup was at{" "}
              {(fb.venues || []).length > 0 ? fb.venues.join(", ") : "spots agreed with the organizer"}, and
              the trip was planned the same way we&apos;d plan yours: one vehicle matched to the
              headcount and luggage, one final quote before anyone commits.
            </p>
          </div>
        </section>
      )}

      {/* PRIORITY 1 — wedding transportation (owner: ~70% of inquiries are weddings) */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="text-brand-dark fw-bold text-uppercase tracking-wider">Wedding Transportation</span>
            <h2 className="display-5 fw-bold text-dark mt-2">{rep(v.wedding)}</h2>
            <p className="text-muted mb-0" style={{ maxWidth: 760 }}>{rep(v.weddingLead)}</p>
            <div className="mx-auto bg-primary mt-3" style={{ width: 60, height: 4 }} />
          </div>
          {wedVenues.length > 0 && (
            <div className="row g-3 mb-4">
              {wedVenues.slice(0, 4).map((v) => (
                <div className="col-md-6" key={v.name}>
                  <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
                    <div className="d-flex align-items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <div>
                        <h3 className="h6 fw-bold text-dark mb-0">{v.name}</h3>
                        <p className="text-muted small mb-0">{v.note}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {wedVenues.length === 0 ? (
            <p className="text-muted text-center mx-auto mb-4" style={{ maxWidth: 760 }}>
              Tell us the venue and the hotel block—the dispatch team builds the loop plan
              around them. Minibuses (20–32 guests) are the usual wedding vehicle; school
              buses work for short hops; party buses cover the send-off.
            </p>
          ) : (
            <p className="text-muted text-center mx-auto mb-4" style={{ maxWidth: 760 }}>{rep(v.weddingIntro)}</p>
          )}
          <div className="row g-3">
            {[
              "Guest loops between the hotel block, ceremony and reception—on a published schedule",
              "Timing planned with your photographer and planner, not guessed",
              " Gratuity, tolls and taxes in the quote, so the wedding budget holds",
              "Late pickups after the send-off priced in advance",
            ].map((t) => (
              <div className="col-md-6" key={t}>
                <div className="p-3 bg-white border rounded-3 d-flex align-items-start gap-3 h-100">
                  <span className="text-primary mt-1 fw-bold">✓</span>
                  <span className="text-muted small">{t.trim()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Famous places & things to do */}
      {cityContent && cityContent.places.length > 0 && (
        <section className="py-5">
          <div className="container py-4">
            <h2 className="display-6 fw-bold text-dark mb-1">{rep(v.places)}</h2>
            <p className="text-muted mb-4" style={{ maxWidth: 760 }}>{rep(v.placesLead)}</p>
            <div className="row g-4">
              {cityContent.places.map((pl) => (
                <div className="col-md-6" key={pl.name}>
                  <div className="d-flex align-items-start gap-3">
                    <MapPin size={20} className="text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h3 className="h6 fw-bold text-dark mb-1">{pl.name}</h3>
                      <p className="text-muted small mb-0">{pl.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Airports */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <h2 className="display-6 fw-bold text-dark mb-3">{rep(v.airports)}</h2>
          {(cityContent?.airports || []).length > 0 ? (
            <div className="row g-3">
              {cityContent!.airports.map((a) => (
                <div className="col-md-6" key={a.code}>
                  <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h3 className="h6 fw-bold text-dark mb-0">{a.name}</h3>
                        <p className="text-muted small mb-0">Approx. {a.miles} miles from {name}</p>
                      </div>
                      <span className="badge bg-dark rounded-pill px-3 py-1">{a.code}</span>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-muted small mb-0 mt-2">
                Arrival pickups include flight tracking on request, so a late landing does not leave the bus.
              </p>
            </div>
          ) : (
            <p className="text-muted mb-0" style={{ maxWidth: 760 }}>
              {name} is served through the regional airports nearby. Tell dispatch your flight
              or airport and the shuttle plan is built around the terminal, the luggage and
              the arrival time.
            </p>
          )}
        </div>
      </section>

      {/* Wineries nearby */}
      {(cityContent?.wineries || []).length > 0 && (
        <section className="py-5">
          <div className="container py-4">
            <h2 className="display-6 fw-bold text-dark mb-1">Wineries and tasting trips near {name}</h2>
            <p className="text-muted mb-4" style={{ maxWidth: 760 }}>
              A designated driver changes the day: one vehicle, every tasting room on the
              list, and nobody drawing straws for the drive home.
            </p>
            <div className="row g-3">
              {cityContent!.wineries.map((w) => (
                <div className="col-md-6" key={w.name}>
                  <div className="p-3 bg-white border rounded-3 d-flex align-items-start gap-3 h-100">
                    <span className="text-primary mt-1 fw-bold">✓</span>
                    <div>
                      <h3 className="h6 fw-bold text-dark mb-0">{w.name}</h3>
                      <p className="text-muted small mb-0">{w.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Vehicles for {City} trips — real capacities from the fleet data */}
      <section className="py-5">
        <div className="container py-2">
          <h2 className="display-6 fw-bold text-dark mb-1">{rep(v.vehicles)}</h2>
          <p className="text-muted mb-4" style={{ maxWidth: 760 }}>{rep(v.vehiclesLead)}</p>
          <div className="row g-3">
            {VEHICLES.map((v) => (
              <div className="col-md-6 col-lg-4" key={v.slug}>
                <a className="text-decoration-none" href={`/fleet/${v.slug}/`}>
                  <div className="card border-0 shadow-sm rounded-4 hover-lift p-3 h-100">
                    <div className="d-flex align-items-center justify-content-between">
                      <h3 className="h6 fw-bold text-dark mb-0">{v.cardName}</h3>
                      <span className="badge bg-dark rounded-pill px-3 py-1 small">{v.passengers}</span>
                    </div>
                    <p className="text-muted small mb-0 mt-2">{v.tagline}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote request checklist */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="row g-5 align-items-start">
            <div className="col-lg-5">
              <h2 className="display-6 fw-bold text-dark mb-3">{rep(v.checklist)}</h2>
              <p className="text-muted">{rep(v.checklistLead)}</p>
              <a className="btn btn-primary rounded-pill px-4 py-2 fw-bold" href="/contact/">GET A QUOTE</a>
            </div>
            <div className="col-lg-7">
              <div className="vstack gap-3">
                {[
                  `Your pickup spot in ${name}—hotel, venue, home, or just the neighborhood`,
                  "The destination, and any stops between",
                  "Date, pickup time and how many people are riding",
                  "Luggage and gear (coolers, instruments, sports bags count)",
                  "Anything special: kids, accessibility needs, extra stops, a late-night return",
                ].map((t, i) => (
                  <div className="d-flex align-items-start gap-3" key={i}>
                    <span className="badge bg-primary rounded-circle mt-1 flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: 28, height: 28, fontSize: "0.85rem" }}>{i + 1}</span>
                    <p className="text-muted mb-0">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby kept cities (brief 7.8: 3–6 links to kept pages) */}
      {nearby.length > 0 && (
        <section className="py-5">
          <div className="container py-2">
            <h2 className="h4 fw-bold text-dark mb-4">{rep(v.nearby)}</h2>
            <div className="row g-3">
              {nearby.map((n) => (
                <div className="col-lg-3 col-md-4 col-6" key={n.slug}>
                  <Link
                    href={n.path}
                    className="text-decoration-none"
                  >
                    <div className="card h-100 border-0 shadow-sm rounded-4 hover-lift">
                      <div className="card-body p-4 d-flex align-items-center justify-content-between">
                        <span className="h6 fw-bold text-dark mb-0">{n.city}</span>
                        <span className="text-muted" aria-hidden="true">→</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-5 bg-dark text-white text-center">
        <div className="container py-4">
          <h2 className="display-6 fw-bold mb-3">Ready to Travel from {name}?</h2>
          <p className="text-white-50 mb-4">Get a fast, final quote for your group trip.</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <CityQuoteCta city={name} stateCode={state} />
            <a className="btn btn-outline-light rounded-pill px-5 py-3 fw-bold btn-lg" href={`tel:${SITE.phoneTel}`}>
              CALL {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function CityQuoteCta({ city, stateCode }: { city: string; stateCode: string }) {
  const pickup = `${city}, ${stateCode.toUpperCase()}`;
  return (
    <a
      href="/contact/"
      className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm"
      data-pickup={pickup}
      data-source={`city:${stateCode}:${city.toLowerCase().replace(/\s+/g, "-")}`}
      rel="nofollow"
    >
      GET A QUOTE
    </a>
  );
}
