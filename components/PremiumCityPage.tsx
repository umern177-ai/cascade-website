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
import RouteDiagram, { etaText } from "@/components/RouteDiagram";
import { VEHICLES } from "@/lib/fleet-data";
import { keptCities, isKept, stateName } from "@/lib/locations";
import { SITE } from "@/lib/site-data";
import { getCityContent } from "@/lib/city-content";
import type { CityPageData, CityRoute, CityRule } from "@/lib/city-page-data";

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
  // Every city page shows 5 vehicles (owner request: the standard four plus
  // the sleeper). Any of the standard five missing from the city's data is
  // added with a true, generic reason from the fleet data.
  const vehiclesBase = data.vehicles.map((v) => ({ ...v, meta: VEHICLES.find((x) => x.slug === v.slug) })).filter((v) => v.meta);
  const STANDARD_EQUIP: [string, string][] = [
    ["minibus", "Easy to stage outside venues; softer hourly rate than a coach."],
    ["charter-bus", "Restroom, reclining seats and luggage bays for long days."],
    ["school-bus", "Lowest cost per seat for short local runs."],
    ["sprinter-van", "Small groups, airport runs and executive transfers."],
    ["sleeper", "Bunk beds, restroom and shower — built for overnight band tours and long runs."],
  ];
  const bySlug = new Map(vehiclesBase.map((v) => [v.slug, v]));
  for (const [slug, reason] of STANDARD_EQUIP) {
    if (!bySlug.has(slug)) {
      const meta = VEHICLES.find((x) => x.slug === slug);
      if (meta) bySlug.set(slug, { slug, reason, meta });
    }
  }
  const vehicles = [...bySlug.values()];
  const destinations = data.destinations.filter((d) => d && typeof d.name === "string" && d.name.trim());
  const nearbyItems = (data.nearby.items || []).map((n) => {
    const kept = keptCities(state).find((c) => c.city.toLowerCase() === n.city.toLowerCase()) || keptCities(state).find((c) => c.city.startsWith(n.city));
    return { ...n, path: kept && isKept(state, kept.slug) ? `/locations/${state}/${kept.slug}/` : null };
  });
  const also = premium.alsoCovered || data.mapPins.join(" · ");
  // Routing for EVERY city (owner request): explicit data route first, then the
  // researched famous place/venue, then the researched airport.
  const cc = getCityContent(state, data.slug);
  const route: CityRoute | null = premium.route ??
    (cc?.places?.length
      ? { to: cc.places[0].name, toNote: "Famous destination" }
      : data.destinations.find((d) => d && d.name)
        ? { to: data.destinations.find((d) => d && d.name)!.name, toNote: "Top destination" }
        : cc?.airports?.length
          ? { to: `${cc.airports[0].name} (${cc.airports[0].code})`, toNote: "Airport", miles: `~${Math.round(cc.airports[0].miles)} mi`, time: etaText(cc.airports[0].miles) }
          : null);
  const routingRules: CityRule[] = premium.rules ?? [];

  // Auto retrofit (owner request: make every structured page Shelton-level):
  // hero lead = the opening of the approved intro, facts strip = the routing
  // distance when we hold one, plus the site-true facts. No copy invented.
  let heroLead = premium.heroLead ?? "";
  let introRemainder = "";
  if (!premium.routing && !premium.heroLead && data.heroIntro) {
    const sentences = data.heroIntro.match(/[^.!?]+[.!?]+(?:["']|\)|])?\s*/g) ?? [data.heroIntro];
    if (sentences.length >= 3) {
      heroLead = sentences.slice(0, 2).join(" ").trim();
      introRemainder = sentences.slice(2).join(" ").trim();
    }
  }
  const autoFacts = premium.facts ??
    (route?.miles
      ? [
          { dt: `Drive from ${name}`, dd: route.miles.replace("~", "").replace(/\s*mi$/, ""), unit: "mi" },
          { dt: "Quote reply time", dd: "15", unit: "min" },
          { dt: "Dispatch support", dd: "24/7", unit: "" },
          { dt: "Vehicle types", dd: "7", unit: "" },
        ]
      : [
          { dt: "Quote reply time", dd: "15", unit: "min" },
          { dt: "Dispatch support", dd: "24/7", unit: "" },
          { dt: "States covered", dd: "50", unit: "" },
          { dt: "Vehicle types", dd: "7", unit: "" },
        ]);
  const showIntro = premium.routing ? true : introRemainder.length > 40 || !!premium.heroLead;

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
              {heroLead && <p className="pp-lead">{heroLead}</p>}
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
      {autoFacts.length > 0 && (
        <section className="pp-facts" aria-label={`${name} charter bus key facts`}>
          <div className="container">
            <dl className="pp-facts-grid">
              {autoFacts.map((f) => (
                <div className="pp-fact" key={f.dt}>
                  <dt>{f.dt}</dt>
                  <dd>{f.dd}<small>{f.unit}</small></dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* ===== intro / routing + route diagram ===== */}
      {showIntro && (
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
              introRemainder.length > 40 ? <p>{introRemainder}</p> : <p>{data.heroIntro}</p>
            )}
          </div>
          {premium.routing && (
            <RouteDiagram from={name} route={route ?? { to: "New York City" }} />
          )}
        </div>
      </section>
      )}

      {/* ===== routing diagram =========================
          Every city gets its famous routing (owner request): the researched
          route (city-routes.json) first, then the researched famous place
          or venue, then the researched airport. Shelton's geography-specific
          card lives in its data entry. */}
      {route && !premium.routing && (
        <section className="pp-sec pp-bg-white" id="route">
          <div className="container">
            <header className="pp-sec-head">
              <p className="pp-eyebrow">Bus Routing</p>
              <h2>{`How the trip runs from ${name}`}</h2>
            </header>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              <RouteDiagram from={name} route={route} />
            </div>
          </div>
        </section>
      )}

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
                {destinations.map((d) => (
                  <li key={d.name}><a href={`#${slugId(d.name)}`}>{d.name}</a></li>
                ))}
              </ol>
              <p className="pp-also">{`Also covered: ${also}`}</p>
            </aside>
            <div className="pp-dest-list">
              {destinations.map((d, i) => (
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
