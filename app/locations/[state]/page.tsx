// State page (brief Section 7.7): still shows a button for EVERY city, with
// kept cities on top (link to their page) and all other cities below as
// booking-form buttons. Real 200 pages; cities without pages never get URLs.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { KeptCityButton, QuoteCityButton } from "@/components/CityButton";
import { keptCities, otherCities, stateName, stateCodes } from "@/lib/locations";
import { VEHICLES } from "@/lib/fleet-data";
import { pageMeta } from "@/lib/page-meta";

export function generateStaticParams() {
  return stateCodes().map((state) => ({ state }));
}

type Props = { params: Promise<{ state: string }> };

// State FAQ: short, specific-ish but true for every state (no state-false facts).
function stateFaqs(stateNameStr: string) {
  return [
    {
      q: `Do you serve cities across ${stateNameStr}?`,
      a: `Yes—every city you see on this page is bookable, and groups start from towns of any size. Larger ${stateNameStr} destinations have their own pages; the rest open the quote form with the pickup pre-filled.`,
    },
    {
      q: `What if my ${stateNameStr} city is not on this list?`,
      a: "It&apos;s still bookable. Open the quote form and type your city in the Pick-Up Location—the dispatch team plans routes anywhere in the country.",
    },
    {
      q: "How do I know which bus to choose?",
      a: "Tell us the headcount, luggage and route. As a guide: up to 14—sprinter van, 20–32—minibus, 52–56—charter bus, overnight—sleeper bus with up to 15 bunks.",
    },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const name = stateName(state);
  return pageMeta({
    title: `Charter Bus Rental in ${name}, ${state.toUpperCase()} | Cascade Charter Bus`,
    description: `Charter bus rental across ${name}. Choose your city to see local group transportation, or open the booking form with your pickup pre-filled. 24/7 dispatch nationwide.`,
    path: `/locations/${state}/`,
  });
}

export default async function StatePage({ params }: Props) {
  const { state } = await params;
  if (!/^[a-z]{2}$/.test(state)) {
    return notFound();
  }
  const name = stateName(state);
  const kept = keptCities(state);
  const others = otherCities(state);

  const introSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Charter Bus Rental in ${name}`,
    areaServed: { "@type": "State", name },
    provider: { "@type": "LocalBusiness", name: "Cascade Charter Bus", url: "https://cascadecharterbus.com", telephone: "+1 (646) 705-0816" },
  };

  return (
    <main className="bg-white min-vh-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(introSchema) }} />
      <section className="py-5 bg-dark text-white" style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Charter Bus Rental in {name}</h1>
          <p className="lead opacity-75 mx-auto mb-0" style={{ maxWidth: 650 }}>
            Select a city below to explore local group transportation services and fleet options.
          </p>
        </div>
      </section>

      <div className="container py-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Locations", href: "/locations/" }, { label: name }]} />
      </div>

      <section className="py-5">
        <div className="container">
          {kept.length > 0 && (
            <>
              <div className="row g-3 mb-5">
                <div className="col-12">
                  <h2 className="h4 fw-bold text-dark mb-4">Popular {name} Charter Bus Locations</h2>
                </div>
                {kept.map((c) => (
                  <div className="col-lg-3 col-md-4 col-6" key={c.slug}>
                    <KeptCityButton stateCode={state} city={c.city} slug={c.slug} />
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="row g-3" style={{ contentVisibility: "auto", containIntrinsicSize: "auto 50000px" }}>
            <div className="col-12">
              <h2 className="h4 fw-bold text-dark mb-2">More Cities We Serve in {name}</h2>
              <p className="text-muted mb-4">Don&apos;t see a page for your city? Pick it below and we&apos;ll start your quote.</p>
            </div>
            {others.map((c) => (
              <div className="col-lg-3 col-md-4 col-6" key={c.slug}>
                <QuoteCityButton city={c.city} stateCode={state} />
              </div>
            ))}
            {others.length === 0 && (
              <p className="text-muted">All cities in {name} have their own pages above.</p>
            )}
          </div>
        </div>
      </section>

      {/* Reliable Transportation Across {State} */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <h2 className="display-6 fw-bold text-dark mb-3">Reliable Transportation Across {name}</h2>
          <p className="text-muted" style={{ maxWidth: 820 }}>
            Cascade Charter Bus runs group transportation in {name} and all 50 states: coach
            tours, sports travel, wedding shuttles, airport transfers and school trips. Tell
            dispatch where your group starts and ends—the route is planned for you, with the
            driver arriving early and a final quote before you commit.
          </p>
          <p className="text-muted mb-0" style={{ maxWidth: 820 }}>
            Trips in {name} usually need one of two things: a schedule that holds, or a load
            that fits. We plan both. Pickup times are built backwards from your arrival time,
            and the vehicle is matched to your headcount and luggage, so the bus that shows up
            is the one your trip actually needs.
          </p>
        </div>
      </section>

      {/* How booking works in {State} */}
      <section className="py-5">
        <div className="container py-4">
          <h2 className="display-6 fw-bold text-dark mb-4">How booking works in {name}</h2>
          <div className="row g-4">
            {[
              { step: "Pick your city or open the form", text: "Cities with their own page are linked above. Everyone else can pick from the list below, or just open the booking form and type an address." },
              { step: "Get the plan, not just a price", text: "You'll receive an itinerary with the vehicle, the pickup times and one final quote—usually within about 15 minutes." },
              { step: "Confirm and go", text: "Confirm the quote and the driver arrives early. On the road, dispatch stays reachable for the whole trip." },
            ].map((st, i) => (
              <div className="col-md-4" key={i}>
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                  <span className="badge bg-primary rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, fontSize: "1rem" }}>{i + 1}</span>
                  <h3 className="h6 fw-bold text-dark mb-2">{st.step}</h3>
                  <p className="text-muted small mb-0">{st.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicles ready in {State} */}
      <section className="py-5 pt-0">
        <div className="container">
          <h2 className="display-6 fw-bold text-dark mb-4">Vehicles available in {name}</h2>
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

      {/* FAQ */}
      <section className="py-5">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="accordion accordion-flush shadow-sm rounded-4 overflow-hidden border">
                {stateFaqs(name).map((f, i) => (
                  <details className="accordion-item border-bottom" key={i} open={i === 0}>
                    <summary className="accordion-button fw-bold text-dark py-3 px-4" style={{ display: "flex", cursor: "pointer" }}>
                      {f.q}
                    </summary>
                    <div className="accordion-body text-muted px-4 pb-4 pt-0 lh-relaxed">{f.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

