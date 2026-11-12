// Generic premium city page — the Shelton premium frame for every city that
// doesn't have structured content yet (brief Sections 7.8 + 8). Built only
// from real data we hold: the county, pickup places seen in real inquiries,
// researched places/airports/wedding venues where available, and nearby kept
// cities. Site-wide facts only — nothing invented per city.
import Image from "next/image";
import { Phone, MapPin, Users, Check, Plane, Award } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { VEHICLES, type Vehicle } from "@/lib/fleet-data";
import { SITE } from "@/lib/site-data";
import type { Place, Airport } from "@/lib/city-content";

const GENERIC_FACTS = [
  { dt: "Quote reply time", dd: "15", unit: "min" },
  { dt: "Dispatch support", dd: "24/7", unit: "" },
  { dt: "States covered", dd: "50", unit: "" },
  { dt: "Vehicle types", dd: "7", unit: "" },
];

const WEDDING_POINTS = [
  "Guest loops between the hotel block, ceremony and reception—on a published schedule",
  "Timing planned with your photographer and planner, not guessed",
  "Gratuity, tolls and taxes in the quote, so the wedding budget holds",
  "Late pickups after the send-off priced in advance",
];

const CHECKLIST = [
  "Your pickup spot—hotel, venue, home, or just the neighborhood",
  "The destination, and any stops between",
  "Date, pickup time and how many people are riding",
  "Luggage and gear (coolers, instruments, sports bags count)",
  "Anything special: kids, accessibility needs, extra stops, a late-night return",
];

type Props = {
  name: string;
  state: string;
  stName: string;
  county: string | null;
  venues: string[];
  weddingVenues: Place[];
  weddingIntro: string | null;
  places: Place[];
  airports: Airport[];
  wineries: Place[];
  nearby: { city: string; slug: string; path: string }[];
};

export default function GenericPremiumCity({ name, state, stName, county, venues, weddingVenues, weddingIntro, places, airports, wineries, nearby }: Props) {
  const stAbbr = state.toUpperCase();
  const pickup = `${name}, ${stAbbr}`;
  const minDate = new Date().toISOString().slice(0, 10);
  const venueList = weddingVenues.length > 0 ? weddingVenues : venues.map((v) => ({ name: v, note: "Booked by real groups from this area" }));

  const intro = `${name} sits in ${county ? `${county}, ` : ""}${stName}. When real groups traveled from ${name}, pickup was at ${
    venues.length > 0 ? venues.join(", ") : "spots agreed with the organizer"
  }, and the trip was planned the same way we'd plan yours: one vehicle matched to the headcount and luggage, one final quote before anyone commits.`;

  return (
    <main className="pp bg-white" style={{ fontSize: "inherit" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Service", name: `Charter Bus Rental in ${name}`, areaServed: { "@type": "City", name, containedInPlace: { "@type": "State", name: stName } }, provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url, telephone: SITE.phoneDisplay } }) }} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Locations", href: "/locations/" }, { label: stName, href: `/locations/${state}/` }, { label: name }]} />

      {/* ===== hero with quote form ===== */}
      <section className="pp-hero">
        <div className="container">
          <div className="pp-hero-grid">
            <div>
              <p className="pp-eyebrow">{`Charter Bus Rental · ${stName}`}</p>
              <h1>
                Charter Bus Rental in <em>{`${name}, ${stAbbr}`}</em>
              </h1>
              <p className="pp-lead">
                Wedding shuttles, field trips, sports travel and corporate events—one dispatch team from quote to drop-off.
              </p>
              <div className="pp-hero-ctas">
                <a className="pp-btn pp-btn-amber" href="/contact/" data-pickup={pickup} data-source={`city-generic:${state}`} rel="nofollow">Get a Free Quote <Check aria-hidden="true" /></a>
                <a className="pp-btn pp-btn-ghost" href={`tel:${SITE.phoneTel}`}><Phone aria-hidden="true" /> {SITE.phoneDisplay}</a>
              </div>
              <ul className="pp-trust">
                <li><Check aria-hidden="true" />DOT-compliant fleet</li>
                <li><Check aria-hidden="true" />Gratuity, tolls &amp; taxes included</li>
                <li><Check aria-hidden="true" />24/7 dispatch</li>
              </ul>
            </div>

            <form className="pp-quote" id="quote" action="/contact/" method="get" aria-labelledby="gq-title">
              <h2 id="gq-title">{`Get your ${name} quote`}</h2>
              <p className="pp-sub-note">One final price. Average reply in about 15 minutes.</p>
              <input type="hidden" name="city" value={pickup} />
              <div className="pp-field">
                <label htmlFor="gq-pickup">Pickup address</label>
                <input id="gq-pickup" name="pickup" type="text" placeholder={`Hotel, office, venue or home in ${name}`} autoComplete="street-address" />
              </div>
              <div className="pp-field">
                <label htmlFor="gq-dest">Destination</label>
                <input id="gq-dest" name="destination" type="text" />
              </div>
              <div className="pp-field-row">
                <div className="pp-field">
                  <label htmlFor="gq-date">Trip date</label>
                  <input id="gq-date" name="date" type="date" min={minDate} />
                </div>
                <div className="pp-field">
                  <label htmlFor="gq-pax">Passengers</label>
                  <select id="gq-pax" name="passengers" defaultValue="">
                    <option value="">Select</option>
                    <option value="14">1–14 (Sprinter)</option>
                    <option value="32">15–32 (Minibus)</option>
                    <option value="60">33–60 (Coach / School bus)</option>
                    <option value="60">60+ (Multiple vehicles)</option>
                  </select>
                </div>
              </div>
              <button className="pp-btn pp-btn-amber" type="submit" data-pickup={pickup} data-source={`city-generic-submit:${state}`}>Request a Quote</button>
              <p className="pp-fine"><Check aria-hidden="true" />No obligation · No hidden fees</p>
            </form>
          </div>
        </div>
      </section>

      {/* ===== facts strip ===== */}
      <section className="pp-facts" aria-label={`${name} charter bus key facts`}>
        <div className="container">
          <dl className="pp-facts-grid">
            {GENERIC_FACTS.map((f) => (
              <div className="pp-fact" key={f.dt}>
                <dt>{f.dt}</dt>
                <dd>{f.dd}<small>{f.unit}</small></dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ===== intro ===== */}
      <section className="pp-sec" id="about">
        <div className="container">
          <div className="intro-premium">
            <p className="mb-0">{intro}</p>
          </div>
        </div>
      </section>

      {/* ===== wedding priority (owner: ~70% of inquiries) ===== */}
      <section className="pp-sec pp-bg-white" id="wedding">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">Wedding Shuttles</p>
            <h2>{`Wedding Shuttle Service in ${name}`}</h2>
            <p>{weddingIntro ?? "Tell us the venue and the hotel block—the dispatch team builds the loop plan around them."}</p>
          </header>
          {venueList.length > 0 && (
            <div className="row g-3 mb-4">
              {venueList.slice(0, 4).map((v) => (
                <div className="col-md-6" key={v.name}>
                  <div className="p-3 rounded-4 h-100" style={{ background: "var(--pp-paper, #f8f9fa)", border: "1px solid var(--pp-line, #dee2e6)" }}>
                    <p className="mb-0"><strong style={{ color: "var(--pp-ink, #0f1115)" }}>{v.name}</strong>{v.note ? <span className="text-muted small"> — {v.note}</span> : null}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <ul className="pp-checklist">
            {WEDDING_POINTS.map((t) => (
              <li key={t}><Check aria-hidden="true" /><span>{t}</span></li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== places (real, researched where available) ===== */}
      {places.length > 0 && (
        <section className="pp-sec" id="destinations">
          <div className="container">
            <header className="pp-sec-head">
              <p className="pp-eyebrow">Places We Go</p>
              <h2>{`Group Destinations in ${name}`}</h2>
            </header>
            <div className="pp-dest-list">
              {places.map((p, i) => (
                <article className="pp-dest" key={p.name}>
                  <div className="pp-dest-head">
                    <span className="pp-dest-num" aria-hidden="true">{i + 1}</span>
                    <div><MapPin size={18} aria-hidden="true" style={{ color: "var(--pp-amber-deep, #8a5c00)" }} /> <h3>{p.name}</h3></div>
                  </div>
                  <p>{p.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== airports ===== */}
      <section className="pp-sec pb-0" style={{ paddingTop: places.length > 0 ? 0 : undefined }} id="airports">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">Air Travel</p>
            <h2>{`Group Airport Transfers for ${name}`}</h2>
          </header>
          {airports.length > 0 ? (
            <div className="row g-3">
              {airports.map((a) => (
                <div className="col-md-6" key={a.code}>
                  <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white" style={{ border: "1px solid var(--pp-line, #dee2e6)" }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <p className="fw-bold mb-0" style={{ color: "var(--pp-ink, #0f1115)" }}>{a.name}</p>
                        <p className="text-muted small mb-0">Approx. {a.miles} miles from {name}</p>
                      </div>
                      <span className="badge bg-dark rounded-pill px-3 py-1 small">{a.code}</span>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-muted small mb-0 mt-2">Arrival pickups include flight tracking on request, so a late landing does not leave the bus.</p>
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

      {/* ===== wineries (where researched) ===== */}
      {wineries.length > 0 && (
        <section className="pp-sec pp-bg-white" id="wineries">
          <div className="container">
            <header className="pp-sec-head">
              <p className="pp-eyebrow">Wine Trips</p>
              <h2>{`Wineries and Tasting Trips near ${name}`}</h2>
              <p>A designated driver changes the day: one vehicle, every tasting room on the list, and nobody drawing straws for the drive home.</p>
            </header>
            <div className="pp-rule-list">
              {wineries.map((w) => (
                <li key={w.name}><Award aria-hidden="true" style={{ width: 18, height: 18, marginTop: 4, color: "var(--pp-amber-deep, #8a5c00)" }} /><span><strong>{w.name}</strong>{w.note}</span></li>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== vehicles: 5 (owner standard) ===== */}
      <section className="pp-sec" id="fleet">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">Our Fleet</p>
            <h2>{`Vehicles for ${name} Groups`}</h2>
            <p>Pick by headcount and trip length — or tell us both and we&apos;ll match the vehicle for you.</p>
          </header>
          <div className="pp-fleet">
            {(["minibus", "charter-bus", "school-bus", "sprinter-van", "sleeper"] as const).map((slug) => {
              const v = VEHICLES.find((x: Vehicle) => x.slug === slug)!;
              return (
              <a href={`/fleet/${v.slug}/`} className="pp-vehicle" key={v.slug}>
                <div className="pp-vehicle-media">
                  <Image src={v.photo} alt={v.cardName} fill sizes="(max-width:900px) 50vw, 25vw" style={{ objectFit: "cover" }} />
                  <span className="pp-cap"><Users aria-hidden="true" />{v.passengers}</span>
                </div>
                <div className="pp-vehicle-body">
                  <h3>{v.cardName}</h3>
                  <p>{v.tagline}</p>
                </div>
              </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== map ===== */}
      <section className="pp-sec pp-bg-white" id="map">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">Location</p>
            <h2>{`${name} on the Map`}</h2>
          </header>
          <div className="pp-map-frame">
            <iframe title={`Map of ${name}, ${stName}`} src={`https://www.google.com/maps?q=${encodeURIComponent(`${name}, ${stAbbr}`)}&z=11&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
        </div>
      </section>

      {/* ===== nearby kept cities ===== */}
      {nearby.length > 0 && (
        <section className="pp-sec" id="nearby">
          <div className="container">
            <header className="pp-sec-head">
              <p className="pp-eyebrow">Service Area</p>
              <h2>{`Charter Bus Rental near ${name}`}</h2>
            </header>
            <div className="pp-cities">
              {nearby.map((n) => (
                <a href={n.path} key={n.slug}>
                  <span><strong>{n.city}</strong><span>Charter bus page</span></span>
                  <span className="pp-arr"><Check aria-hidden="true" /></span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== booking (dark) ===== */}
      <section className="pp-sec pp-bg-ink on-dark" id="booking">
        <div className="container">
          <header className="pp-sec-head text-center mx-auto">
            <p className="pp-eyebrow" style={{ color: "var(--pp-amber, #f5a002)" }}>Simple Process</p>
            <h2 style={{ color: "#fff" }}>How Booking Works</h2>
            <p style={{ color: "#a9b0c2" }}>Three steps from first message to wheels rolling.</p>
          </header>
          <ol className="pp-steps">
            {[
              { t: "Call or Request Online", d: <span>Send the quote form or call <a href={`tel:${SITE.phoneTel}`} style={{ color: "#fff" }}>{SITE.phoneDisplay}</a>. Average reply in about 15 minutes.</span>, badge: "24/7 Dispatch" },
              { t: "Custom Quote", d: "You receive an itinerary-specific quote: vehicle, pickup times and one final price — gratuity, tolls and taxes included.", badge: null },
              { t: "Relax and Ride", d: "Your driver arrives before the pickup time. Dispatch stays reachable for the whole trip, day or night.", badge: null },
            ].map((s, i) => (
              <li className="pp-step" key={s.t as string}>
                <div className="pp-step-num" aria-hidden="true">{i + 1}</div>
                <h3>{s.t as string}</h3>
                <p>{s.d}</p>
                {s.badge && <span className="pp-badge">{s.badge}</span>}
              </li>
            ))}
          </ol>

          <div className="pp-checklist-card">
            <div>
              <h3>Send the right itinerary and your quote comes back final</h3>
              <p className="pp-checklist-lead">Dispatch prices exactly what you send, so the more precise your details, the more exact the price. Include these five things:</p>
              <ul className="pp-checklist">
                {CHECKLIST.map((t) => (
                  <li key={t}><Check aria-hidden="true" /><span>{t}</span></li>
                ))}
              </ul>
            </div>
            <a className="pp-btn pp-btn-amber" href="/contact/" data-pickup={pickup} data-source={`city-generic-checklist:${state}`} rel="nofollow">Request a Quote</a>
          </div>
        </div>
      </section>

      {/* ===== final CTA (amber band) ===== */}
      <section className="pp-cta-band">
        <div className="container pp-cta-inner">
          <div>
            <h2>{`Ready to Book Your ${name} Charter Bus?`}</h2>
            <p>Fast, final quote. Gratuity, tolls and taxes included. Dispatch answers around the clock.</p>
          </div>
          <div className="pp-cta-actions">
            <a className="pp-btn pp-btn-dark" href="/contact/" data-pickup={pickup} data-source={`city-generic-cta:${state}`} rel="nofollow">Get a Free Quote <Check aria-hidden="true" /></a>
            <a className="pp-btn pp-btn-outline-dark" href={`tel:${SITE.phoneTel}`}><Phone aria-hidden="true" />{`Call ${SITE.phoneDisplay}`}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
