// Premium city page — full implementation of the owner-supplied premium design
// (shelton-ct-charter-bus.html). Rendered for city entries that carry the
// "premium" block in data/city-pages.json (Shelton CT first; admin-selectable
// later, brief 19.10). Same facts and data source as the structured pages.
//
// Owner-requested pieces from the HTML: hero-with-quote-form, facts strip,
// route diagram, sticky-sidebar destinations, FAQ accordion (native <details>).
import Image from "next/image";
import { Phone, ArrowRight, Check, ShieldCheck, Tag, Headset, X, Route, Lightbulb, Users } from "lucide-react";

const SERVICE_LINKS: Record<string, string> = {
  "corporate-transportation": "Corporate transportation",
  "school-transportation": "Field trip transportation",
  "wedding-transportation": "Wedding shuttle rental",
  "sports-team-transportation": "Sports team transportation",
  "airport-transfer": "Group airport shuttle",
  "sightseeing-tour-bus": "Sightseeing & tour bus rental",
  "church-religious-transportation": "Church & religious group transportation",
  "band-tour-bus": "Band tour bus rental",
};
import Breadcrumbs from "@/components/Breadcrumbs";
import { VEHICLES } from "@/lib/fleet-data";
import { keptCities, isKept, stateName } from "@/lib/locations";
import { SITE } from "@/lib/site-data";
import type { CityPageData } from "@/lib/city-page-data";

const SERVICE_IMAGES: Record<string, string> = {
  "corporate-transportation": "/images/services/corp.webp",
  "wedding-transportation": "/images/services/wed2.webp",
  "school-transportation": "/images/services/school.webp",
  "sports-team-transportation": "/images/services/sport.webp",
  "airport-transfer": "/images/services/airport.webp",
  "sightseeing-tour-bus": "/images/services/multi.webp",
  "church-religious-transportation": "/images/services/church.webp",
  "band-tour-bus": "/images/fleet/sleeper.jpg",
};

function slugId(name: string) {
  return name.toLowerCase().replace(/[''.]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function PremiumCityPage({ data, state }: { data: CityPageData; state: string }) {
  const name = data.city;
  const stName = stateName(state);
  const stAbbr = state.toUpperCase();
  const pickup = `${name}, ${stAbbr}`;
  const premium = data.premium ?? {};
  const minDate = new Date().toISOString().slice(0, 10);

  const serviceSchema = { "@context": "https://schema.org", "@type": "Service", name: `Charter Bus Rental in ${name}`, areaServed: { "@type": "City", name, containedInPlace: { "@type": "State", name: stName } }, provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url, telephone: SITE.phoneDisplay } };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: data.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  // Every city page shows 5 vehicles: the entry's list plus the sleeper
  // when it isn't already there (owner request, Nov 12).
  const vehiclesBase = data.vehicles.map((v) => ({ ...v, meta: VEHICLES.find((x) => x.slug === v.slug) })).filter((v) => v.meta);
  const sleeperMeta = VEHICLES.find((x) => x.slug === "sleeper");
  const vehicles = vehiclesBase.some((v) => v.slug === "sleeper") || !sleeperMeta
    ? vehiclesBase
    : [...vehiclesBase, { slug: "sleeper", reason: "Bunk beds, restroom and shower — built for overnight band tours and long runs.", meta: sleeperMeta }];
  const nearbyItems = (data.nearby.items || []).map((n) => {
    const kept = keptCities(state).find((c) => c.city.toLowerCase() === n.city.toLowerCase()) || keptCities(state).find((c) => c.city.startsWith(n.city));
    return { ...n, path: kept && isKept(state, kept.slug) ? `/locations/${state}/${kept.slug}/` : null };
  });
  const also = premium.alsoCovered || data.mapPins.join(" · ");

  const bookingSteps = [
    { t: "Call or Request Online", d: <span>Send the quote form or call <a href={`tel:${SITE.phoneTel}`} style={{ color: "#fff" }}>{SITE.phoneDisplay}</a>. Average reply in about 15 minutes.</span>, badge: "24/7 Dispatch" },
    { t: "Custom Quote", d: "You receive an itinerary-specific quote: vehicle, pickup times and one final price — gratuity, tolls and taxes included.", badge: null },
    { t: "Relax and Ride", d: "Your driver arrives before the pickup time. Dispatch stays reachable for the whole trip, day or night.", badge: null },
  ];

  return (
    <main className="pp bg-white" style={{ fontSize: "inherit" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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
              <p className="pp-lead">{premium.heroLead}</p>
              <div className="pp-hero-ctas">
                <a className="pp-btn pp-btn-amber" href="/contact/" data-pickup={pickup} data-source={`city-hero:${state}:${data.slug}`} rel="nofollow">Get a Free Quote <ArrowRight aria-hidden="true" /></a>
                <a className="pp-btn pp-btn-ghost" href={`tel:${SITE.phoneTel}`}><Phone aria-hidden="true" /> {SITE.phoneDisplay}</a>
              </div>
              <ul className="pp-trust">
                <li><ShieldCheck aria-hidden="true" />DOT-compliant fleet</li>
                <li><Tag aria-hidden="true" />Gratuity, tolls &amp; taxes included</li>
                <li><Headset aria-hidden="true" />24/7 dispatch</li>
              </ul>
            </div>

            <form className="pp-quote" id="quote" action="/contact/" method="get" aria-labelledby="pp-quote-title">
              <h2 id="pp-quote-title">{`Get your ${name} quote`}</h2>
              <p className="pp-sub-note">One final price. Average reply in about 15 minutes.</p>
              <input type="hidden" name="city" value={pickup} />
              <div className="pp-field">
                <label htmlFor="pp-q-pickup">Pickup address</label>
                <input id="pp-q-pickup" name="pickup" type="text" placeholder={`Hotel, office, venue or home in ${name}`} autoComplete="street-address" />
              </div>
              <div className="pp-field">
                <label htmlFor="pp-q-dest">Destination</label>
                <input id="pp-q-dest" name="destination" type="text" placeholder="e.g. Midtown Manhattan" />
              </div>
              <div className="pp-field-row">
                <div className="pp-field">
                  <label htmlFor="pp-q-date">Trip date</label>
                  <input id="pp-q-date" name="date" type="date" min={minDate} />
                </div>
                <div className="pp-field">
                  <label htmlFor="pp-q-pax">Passengers</label>
                  <select id="pp-q-pax" name="passengers" defaultValue="">
                    <option value="">Select</option>
                    <option value="14">1–14 (Sprinter)</option>
                    <option value="32">15–32 (Minibus)</option>
                    <option value="60">33–60 (Coach / School bus)</option>
                    <option value="60">60+ (Multiple vehicles)</option>
                  </select>
                </div>
              </div>
              <button className="pp-btn pp-btn-amber" type="submit" data-pickup={pickup} data-source={`city:${state}:${data.slug}`}>Request a Quote <ArrowRight aria-hidden="true" /></button>
              <p className="pp-fine"><Check aria-hidden="true" />No obligation · No hidden fees</p>
            </form>
          </div>
        </div>
      </section>

      {/* ===== facts strip ===== */}
      <section className="pp-facts" aria-label={`${name} charter bus key facts`}>
        <div className="container">
          {premium.facts && premium.facts.length > 0 && (
            <dl className="pp-facts-grid">
              {premium.facts.map((f) => (
                <div className="pp-fact" key={f.dt}>
                  <dt>{f.dt}</dt>
                  <dd>{f.dd}<small>{f.unit}</small></dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {/* ===== intro / routing + route diagram ===== */}
      <section className="pp-sec" id="routing">
        <div className="container pp-intro-grid">
          <div className="pp-intro-copy">
            <p className="pp-eyebrow">Know before you book</p>
            <h2>{data.h1}</h2>
            {premium.routing ? (
              <>
                {(premium.routingIntro || []).map((par) => (
                  <p key={par.slice(0, 24)}>{par}</p>
                ))}
                <ul className="pp-rule-list">
                  {(premium.rules || []).map((r) => (
                    <li key={r.title}>
                      <span className={`pp-ico ${r.kind === "no" ? "pp-ico-no" : "pp-ico-yes"}`}>
                        {r.kind === "no" ? <X aria-hidden="true" /> : <Route aria-hidden="true" />}
                      </span>
                      <span><strong>{r.title}</strong>{r.text}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>{data.heroIntro}</p>
            )}
          </div>

          {premium.routing && (
            <figure className="pp-route-card">
              <figcaption>{`${name} → New York City`}<span>Bus routing</span></figcaption>
              {/* Owner-approved Shelton→NYC bus routing diagram (Merritt Parkway ban) */}
              <svg viewBox="0 0 560 380" role="img" aria-labelledby="pp-map-t pp-map-d">
                <title id="pp-map-t">Bus route from Shelton, CT to New York City</title>
                <desc id="pp-map-d">Diagram showing buses travel south from Shelton on Route 8 to I-95, then southwest along I-95 to New York City, because buses are banned from the Merritt Parkway.</desc>
                <rect width="560" height="380" fill="#121A2E" />
                <path d="M0 330 C90 300 150 318 220 296 C300 270 360 262 440 236 C490 220 530 214 560 204 L560 380 L0 380Z" fill="#1A2B45" />
                <text x="380" y="318" fill="#4C6A93" fontSize="13" fontStyle="italic" letterSpacing="2">LONG ISLAND SOUND</text>
                <path d="M432 92 C360 130 280 150 200 190 C150 215 110 240 78 262" fill="none" stroke="#D64545" strokeWidth="4" strokeDasharray="9 8" opacity=".9" />
                <g transform="translate(262 160)">
                  <circle r="17" fill="#D64545" />
                  <path d="M-6 -6 6 6M6 -6 -6 6" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                </g>
                <text x="232" y="207" fill="#F08A8A" fontSize="13" fontWeight="700">Merritt Pkwy · no buses</text>
                <path d="M432 92 C438 140 436 180 428 222" fill="none" stroke="#F5A002" strokeWidth="6" strokeLinecap="round" />
                <path d="M428 222 C360 240 300 252 230 272 C170 289 120 292 78 262" fill="none" stroke="#F5A002" strokeWidth="6" strokeLinecap="round" />
                <g fontWeight="800" fontSize="12" textAnchor="middle">
                  <rect x="446" y="140" width="34" height="22" rx="5" fill="#fff" />
                  <text x="463" y="155" fill="#0F1115">CT 8</text>
                  <path d="M300 236 h40 v16 a20 10 0 0 1 -40 0z" fill="#2D5BD1" />
                  <text x="320" y="252" fill="#fff">I-95</text>
                </g>
                <g fontSize="12.5" fill="#A9B0C2">
                  <circle cx="428" cy="222" r="4" fill="#A9B0C2" />
                  <text x="440" y="226">Bridgeport</text>
                  <circle cx="300" cy="262" r="3.5" fill="#A9B0C2" />
                  <text x="270" y="290">Norwalk</text>
                  <circle cx="190" cy="282" r="3.5" fill="#A9B0C2" />
                  <text x="176" y="270">Stamford</text>
                </g>
                <g fontWeight="800">
                  <circle cx="432" cy="92" r="13" fill="#F5A002" />
                  <circle cx="432" cy="92" r="5" fill="#0F1115" />
                  <text x="452" y="88" fill="#fff" fontSize="18">Shelton</text>
                  <text x="452" y="106" fill="#A9B0C2" fontSize="11.5" fontWeight="600">Pickup</text>
                  <circle cx="78" cy="262" r="13" fill="#fff" />
                  <circle cx="78" cy="262" r="5" fill="#0F1115" />
                  <text x="40" y="298" fill="#fff" fontSize="18">New York City</text>
                  <text x="40" y="315" fill="#A9B0C2" fontSize="11.5" fontWeight="600">~65 mi · ~2 hrs</text>
                </g>
              </svg>
              <div className="pp-legend">
                <span><i style={{ background: "#F5A002" }} />Bus route (Route 8 + I-95)</span>
                <span><i style={{ background: "repeating-linear-gradient(90deg,#D64545 0 6px,transparent 6px 10px)" }} />Merritt Parkway — banned for buses</span>
              </div>
            </figure>
          )}
        </div>
      </section>

      {/* ===== services ===== */}
      <section className="pp-sec pp-bg-white" id="services">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">What we run in {name}</p>
            <h2>{data.servicesHeading}</h2>
            <p>From daily office loops to once-a-year school trips, each {name} job gets a vehicle and route matched to where you&apos;re going.</p>
          </header>
          <div className="pp-services">
            {data.services.map((sv, i) => {
              const slug = sv.href.replace("/services/", "").replace("/", "");
              const img = SERVICE_IMAGES[slug];
              const tags = (premium.tags && premium.tags[i]) || [];
              return (
                <article className="pp-service" key={sv.title}>
                  <div className="pp-service-media">
                    <span className="pp-num" aria-hidden="true">{`0${i + 1}`}</span>
                    {img && <Image src={img} alt={`${sv.title} - Cascade Charter Bus`} fill sizes="(max-width:900px) 100vw, 50vw" style={{ objectFit: "cover" }} />}
                  </div>
                  <div className="pp-service-body">
                    <h3>{sv.title}</h3>
                    {tags.length > 0 && (
                      <ul className="pp-tags">
                        {tags.map((t, ti) => (
                          <li key={t} className={ti === 0 ? "pp-tag-hl" : undefined}>{t}</li>
                        ))}
                      </ul>
                    )}
                    <p>{sv.text}</p>
                    <a className="pp-link-arrow" href={sv.href}>{SERVICE_LINKS[slug] || sv.title} <ArrowRight aria-hidden="true" /></a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== fleet ===== */}
      <section className="pp-sec" id="fleet">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">Our fleet</p>
            <h2>{data.vehiclesHeading}</h2>
            <p>Pick by headcount and trip length — or tell us both and we&apos;ll match the vehicle for you.</p>
          </header>
          <div className="pp-fleet fleet-slider-m">
            {vehicles.map((v) => (
              <a href={`/fleet/${v.slug}/`} className="pp-vehicle" key={v.slug}>
                <div className="pp-vehicle-media">
                  <Image src={v.meta!.photo} alt={v.meta!.cardName} fill sizes="(max-width:900px) 50vw, 25vw" style={{ objectFit: "cover" }} />
                  <span className="pp-cap"><Users aria-hidden="true" />{v.meta!.passengers}</span>
                </div>
                <div className="pp-vehicle-body">
                  <h3>{v.meta!.cardName}</h3>
                  <p>{v.reason}</p>
                  <span className="pp-best">View this vehicle</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== destinations with sticky sidebar ===== */}
      <section className="pp-sec pp-bg-white" id="destinations">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">Where {name} groups go</p>
            <h2>{data.destinationsHeading}</h2>
            <p>Local favorites, with the drop-off advice our drivers actually use.</p>
          </header>
          <div className="pp-dest-layout">
            <aside className="pp-dest-index" aria-label="Destinations on this page">
              <h3>On this page</h3>
              <ol>
                {data.destinations.map((d) => (
                  <li key={d.name}><a href={`#${slugId(d.name)}`}>{d.name}</a></li>
                ))}
              </ol>
              <p className="pp-also">{`Also covered: ${also}`}</p>
            </aside>
            <div className="pp-dest-list">
              {data.destinations.map((d, i) => (
                <article className="pp-dest" id={slugId(d.name)} key={d.name}>
                  <div className="pp-dest-head">
                    <span className="pp-dest-num" aria-hidden="true">{i + 1}</span>
                    <div>
                      <h3>{d.name}</h3>
                      {"meta" in d && Boolean((d as { meta?: string }).meta) && (
                        <div className="pp-dest-meta">{(d as { meta?: string }).meta}</div>
                      )}
                    </div>
                  </div>
                  <p>{d.text}</p>
                  <div className="pp-tip"><Lightbulb aria-hidden="true" /><p><strong>Bus drop-off tip:</strong> {d.tip}</p></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== nearby + map ===== */}
      <section className="pp-sec" id="nearby">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">Service area</p>
            <h2>{data.nearby.heading}</h2>
            <p>We serve the whole area around {name}. Pickups in these towns are a short drive from {name}.</p>
          </header>
          <div className="pp-near-grid">
            <ul className="pp-cities">
              {nearbyItems.map((n) => (
                <li key={n.city}>
                  {n.path ? (
                    <a href={n.path}>
                      <span><strong>{n.city}</strong><span>{n.miles ? `${n.miles}` : null}</span></span>
                      <span className="pp-arr"><ArrowRight aria-hidden="true" /></span>
                    </a>
                  ) : (
                    <a href="/contact/" data-pickup={`${n.city}, ${stAbbr}`} data-source={`nearby-btn:${state}:${data.slug}`} rel="nofollow">
                      <span><strong>{n.city}</strong><span>{n.miles ? `${n.miles} · quote` : null}</span></span>
                      <span className="pp-arr"><ArrowRight aria-hidden="true" /></span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <div className="pp-map-frame">
              <iframe title={`Map of ${name}, ${stName}`} src={`https://www.google.com/maps?q=${encodeURIComponent(`${name}, ${stAbbr}`)}&z=11&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
          </div>
        </div>
      </section>

      {/* ===== how booking works (dark) ===== */}
      <section className="pp-sec pp-bg-ink on-dark" id="booking">
        <div className="container">
          <header className="pp-sec-head mx-auto text-center" style={{ maxWidth: 760 }}>
            <p className="pp-eyebrow" style={{ color: "var(--pp-amber)" }}>Simple process</p>
            <h2 style={{ color: "#fff" }}>How Booking Works</h2>
            <p style={{ color: "#a9b0c2" }}>Three steps from first message to wheels rolling.</p>
          </header>
          <ol className="pp-steps">
            {bookingSteps.map((s, i) => (
              <li className="pp-step" key={s.t}>
                <div className="pp-step-num" aria-hidden="true">{i + 1}</div>
                <h3>{s.t}</h3>
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
                {[
                  <span key="1"><strong>Pickup address</strong> — hotel, venue, office or home</span>,
                  <span key="2"><strong>Pickup time and date</strong> (plus return time for round trips)</span>,
                  <span key="3"><strong>Destination</strong>, plus every stop in between</span>,
                  <span key="4"><strong>Arrival or event end time</strong>, so timing fits your plan</span>,
                  <span key="5"><strong>Headcount, luggage &amp; extras</strong> — gear, children, accessibility needs</span>,
                ].map((t, i) => (
                  <li key={i}><Check aria-hidden="true" />{t}</li>
                ))}
              </ul>
            </div>
            <a className="pp-btn pp-btn-amber" href="/contact/" data-pickup={pickup} data-source={`city-checklist:${state}:${data.slug}`} rel="nofollow">Request a Quote <ArrowRight aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      {/* ===== FAQ (native details accordion) ===== */}
      <section className="pp-sec" id="faq">
        <div className="container pp-faq-layout">
          <div className="pp-faq-aside">
            <p className="pp-eyebrow">FAQ</p>
            <h2>{data.faqsHeading}</h2>
            <p>Quick answers to what {name} groups ask us most. Don&apos;t see yours?</p>
            <div className="pp-help">
              <strong>Talk to dispatch</strong>
              <a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a>
            </div>
          </div>
          <div className="pp-faq">
            {data.faqs.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}<span className="pm" aria-hidden="true" /></summary>
                <div className="pp-answer"><p>{f.a}</p></div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== final CTA (amber band) ===== */}
      <section className="pp-cta-band">
        <div className="container pp-cta-inner">
          <div>
            <h2>{data.ctaHeading}</h2>
            <p>Fast, final quote. Gratuity, tolls and taxes included. Dispatch answers around the clock.</p>
          </div>
          <div className="pp-cta-actions">
            <a className="pp-btn pp-btn-dark" href="/contact/" data-pickup={pickup} data-source={`city-cta:${state}:${data.slug}`} rel="nofollow">Get a Free Quote <ArrowRight aria-hidden="true" /></a>
            <a className="pp-btn pp-btn-outline-dark" href={`tel:${SITE.phoneTel}`}><Phone aria-hidden="true" />{`Call ${SITE.phoneDisplay}`}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
