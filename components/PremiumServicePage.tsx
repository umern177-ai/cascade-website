// Premium service page — the pp-* city-page design applied to ALL service
// pages (owner approved Nov 17 after the wedding-shuttle demo). Content comes
// from the same real data the old page used (SERVICE_META, real owner photos,
// verified FAQ answers, vehiclesFor from fleet-data). Facts only — nothing
// invented. Per-service hero/form/section copy lives in SERVICE_FEATURED below.
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, ChevronRight, Phone, ShieldCheck, Tag, Headset, Quote } from "lucide-react";
import FaqAccordion from "@/components/Faq";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site-data";
import VehiclePhoto from "@/components/VehiclePhoto";
import { fleetMain, fleetShots } from "@/lib/fleet-photos";
import { serviceSchema as serviceSchemaOf } from "@/lib/schema";
import Editable from "@/components/admin/Editable";
import EditBar from "@/components/admin/EditBar";
import { VEHICLES } from "@/lib/fleet-data";

type Photo = { src: string; alt: string };
type StoryStep = { step: string; text: string };
type VehiclePick = { slug: string; why: string };
type Faq = { q: string; a: string };

const SERVICE_IMAGES: Record<string, string> = {
  "minibus": fleetMain("minibus", "/images/fleet/mini.jpg"),
  "school-bus": fleetMain("school-bus", "/images/fleet/school.jpg"),
  "party-bus": fleetMain("party-bus", "/images/fleet/limo.jpg"),
  "charter-bus": fleetMain("charter-bus", "/images/fleet/charter.jpg"),
  "sprinter-van": fleetMain("sprinter-van", "/images/fleet/sprinter.jpg"),
  "sleeper": fleetMain("sleeper", "/images/fleet/sleeper.jpg"),
};

const FACTS = [
  { dt: "Quote reply time", dd: "15", unit: "min" },
  { dt: "Gratuity, tolls & taxes", dd: "Included", unit: "" },
  { dt: "Dispatch support", dd: "24/7", unit: "" },
  { dt: "States covered", dd: "50", unit: "" },
];

type Featured = {
  h1: string; em: string; lead: string;
  form: { title: string; pickup: string; pickupPh: string; dest: string; destPh: string; date: string; pax: string };
  vehicles: string; steps: string; stepsLead: string; faq: string; faqLead: string; cta: string;
};

const FEATURED: Record<string, Featured> = {
  "corporate-transportation": {
    h1: "Corporate Shuttle Service for", em: "Conferences & Employee Routes",
    lead: "Meetings, off-sites and recurring employee shuttles on a published schedule—one final quote with gratuity, tolls and taxes included.",
    form: { title: "Plan your corporate transport", pickup: "Pickup location(s)", pickupPh: "Office, venue or hotel", dest: "Destinations & venues", destPh: "Conference halls, airports, off-sites", date: "Trip date", pax: "People to move" },
    vehicles: "Which vehicle fits your group", steps: "From schedule to wheels rolling", stepsLead: "Four steps, one plan—the itinerary is in writing before anyone books.",
    faq: "Corporate shuttle questions", faqLead: "What organizers ask before booking the routes.", cta: "Plan your corporate transport",
  },
  "wedding-transportation": {
    h1: "Wedding Shuttle Service for", em: "Guest Loops & Party Buses",
    lead: "Guest loops between the hotel block, ceremony and reception—on a published schedule, with a final quote that includes gratuity, tolls and taxes.",
    form: { title: "Plan your wedding shuttle", pickup: "Pickup location", pickupPh: "Hotel block, ceremony venue or home", dest: "Ceremony & reception venues", destPh: "The venues the loops should connect", date: "Wedding date", pax: "Guests to shuttle" },
    vehicles: "Which vehicle fits your wedding", steps: "How the wedding-day shuttle runs", stepsLead: "Four steps, one plan. The schedule is written down before anyone books, and dispatch stays reachable all day.",
    faq: "Wedding shuttle questions", faqLead: "Everything organizers ask before booking the loops.", cta: "Plan your wedding-day shuttle",
  },
  "school-transportation": {
    h1: "School Trip & Field Trip", em: "Bus Rental Service",
    lead: "DOT-certified drivers, background-checked and briefed on group management—school and charter buses sized to the roster, from one call.",
    form: { title: "Plan your school trip", pickup: "School or pickup address", pickupPh: "School campus, district lot or home", dest: "Field trip destination", destPh: "Museum, park, campus or venue", date: "Trip date", pax: "Students & chaperones" },
    vehicles: "Which vehicle fits your class", steps: "How the trip booking runs", stepsLead: "Send the trip sheet and the quote comes back sized to the roster.",
    faq: "School trip questions", faqLead: "What trip organizers ask before booking the run.", cta: "Plan your school trip",
  },
  "sports-team-transportation": {
    h1: "Sports Team Travel &", em: "Game-Day Shuttles",
    lead: "Roster, staff and gear moving as one plan—arrival windows with warm-up time built in, and dispatch re-timing when brackets shift.",
    form: { title: "Plan your team travel", pickup: "Team pickup address", pickupPh: "Training ground, school or hotel", dest: "Stadium, rink or complex", destPh: "Venue names and cities", date: "First game date", pax: "Players & staff" },
    vehicles: "Which vehicle fits your team", steps: "How the team booking runs", stepsLead: "Send the schedule and gear load—the routing is built around both.",
    faq: "Sports travel questions", faqLead: "What coaches and managers ask before booking the run.", cta: "Plan your team travel",
  },
  "airport-transfer": {
    h1: "Group Airport Transfers &", em: "Terminal Pickups",
    lead: "Pickups scheduled backwards from the flight, luggage matched to the vehicle, and flight tracking on arrival runs when you ask for it.",
    form: { title: "Plan your airport transfer", pickup: "Pickup location", pickupPh: "Terminal, hotel or office", dest: "Airport and terminals", destPh: "Airport name and terminal", date: "Transfer date", pax: "Travelers" },
    vehicles: "Which vehicle fits your transfer", steps: "How the transfer booking runs", stepsLead: "Flight details in, pickup plan out—timed with check-in and security to spare.",
    faq: "Airport transfer questions", faqLead: "What groups ask before booking the run.", cta: "Plan your airport transfer",
  },
  "sightseeing-tour-bus": {
    h1: "Charter Bus Tours &", em: "Sightseeing Days",
    lead: "Your must-see list into a driving plan—realistic stop times and coach parking at every stop, half-day or multi-day.",
    form: { title: "Plan your tour", pickup: "Hotel or meeting point", pickupPh: "Hotel, pier or downtown meeting point", dest: "Attractions and stops", destPh: "Stops in your must-see list", date: "Tour date", pax: "Tour group size" },
    vehicles: "Which vehicle fits your tour", steps: "How the tour booking runs", stepsLead: "The route is built around your list, with rest stops where the group needs them.",
    faq: "Tour bus questions", faqLead: "What tour organizers ask before booking the day.", cta: "Plan your tour bus",
  },
  "church-religious-transportation": {
    h1: "Church Group Transportation for", em: "Services & Retreats",
    lead: "Congregation runs, choir trips and multi-day retreats—in convoy with one coordinator so nobody waits on a second vehicle.",
    form: { title: "Plan your group run", pickup: "Church or pickup point", pickupPh: "Church lot, parking area or campus", dest: "Retreat centers & venues", destPh: "Retreat center names and cities", date: "Trip date", pax: "Congregation size" },
    vehicles: "Which vehicle fits your group", steps: "How the group booking runs", stepsLead: "One contact holds the plan from first message to final drop-off.",
    faq: "Church group questions", faqLead: "What group leaders ask before booking the run.", cta: "Plan your church group transport",
  },
  "band-tour-bus": {
    h1: "Band Tour Bus Rental with", em: "Sleeper Coaches",
    lead: "Up to 15 bunks with restroom and shower on board—overnight legs planned around driver hours from the start.",
    form: { title: "Plan your tour block", pickup: "First load-in point", pickupPh: "Venue, rehearsal space or label office", dest: "Show venues & cities", destPh: "Cities on the routing, one per line", date: "First show date", pax: "Band & crew size" },
    vehicles: "Which vehicle fits your tour block", steps: "How the tour booking runs", stepsLead: "Routing, gear and driver hours are planned together from the first message.",
    faq: "Band tour questions", faqLead: "What tour managers ask before booking the run.", cta: "Plan your band tour",
  },
  "winery-tour-bus-rental": {
    h1: "Winery Tour Bus Rental for", em: "Tasting Days",
    lead: "The same bus and driver all day, timed around your tasting reservations—narrow lanes and cooler space handled in the plan.",
    form: { title: "Plan your tasting day", pickup: "Pickup location", pickupPh: "Hotel, home or meeting point", dest: "Wineries in your list", destPh: "Winery names, one per line", date: "Tour date", pax: "Guests in your group" },
    vehicles: "Which vehicle fits your wine group", steps: "How the tasting day runs", stepsLead: "Stop order and timing are confirmed in the written quote before anything books.",
    faq: "Winery tour questions", faqLead: "What groups ask before booking the day.", cta: "Plan your tasting day",
  },
  "military-group-transportation": {
    h1: "Military Group Transportation", em: "Base Moves & Ceremonies",
    lead: "Several vehicles as one move—shared arrival windows, a convoy order and one coordinator, with a 10% military discount on group bookings.",
    form: { title: "Plan your unit move", pickup: "Base gate or pickup point", pickupPh: "Gate, building number or lot", dest: "Bases, terminals & venues", destPh: "Installations, terminals or sites", date: "Move date", pax: "Unit headcount" },
    vehicles: "Which vehicle fits your move", steps: "How the move booking runs", stepsLead: "Gate paperwork and vehicle details go in the quote, so base staff have what they need.",
    faq: "Military group questions", faqLead: "What organizers ask before booking the move.", cta: "Plan your unit move",
  },
  "government-transportation": {
    h1: "Government Charter Bus", em: "Service & Shuttles",
    lead: "Written quotes the same day with W-9 and operator COI on request—staff shuttles, delegations and multi-site field visits.",
    form: { title: "Plan your agency transport", pickup: "Agency site or meeting point", pickupPh: "Agency building, lot or hall", dest: "Sites, halls & terminals", destPh: "Sites, halls or terminals in the plan", date: "Service date", pax: "Staff to move" },
    vehicles: "Which vehicle fits your agency", steps: "How the booking runs", stepsLead: "Paperwork and gate details ride with the quote and the itinerary.",
    faq: "Government transport questions", faqLead: "What agencies ask before booking the run.", cta: "Plan your agency transport",
  },
  "casino-bus-trips": {
    h1: "Casino Bus Trips &", em: "Nights Out",
    lead: "Arrive late morning, leave at a set evening time—the driver waits on site, and the quote states exactly how the day runs.",
    form: { title: "Plan your casino trip", pickup: "Pickup address", pickupPh: "Club, hotel or senior-center lot", dest: "Casino name & city", destPh: "Casino you want to visit", date: "Trip date", pax: "Riders in your group" },
    vehicles: "Which vehicle fits your casino group", steps: "How the trip runs", stepsLead: "Named stops, set return times and overnight plans all go in the written quote.",
    faq: "Casino trip questions", faqLead: "What groups ask before booking the night.", cta: "Plan your casino trip",
  },
};

export default function PremiumServicePage({
  slug,
  meta,
  faqs,
  photos,
  story,
  vehiclesFor,
  trips,
  crossLinks,
  siblings,
  editPath,
  copyH1,
  copyLead,
}: {
  slug: string;
  meta: { name: string; title: string; eyebrow: string; h1: string; intro: string; metaTitle: string; metaDescription: string; lastUpdated?: string };
  faqs: Faq[];
  photos?: Photo[];
  story: StoryStep[];
  vehiclesFor: VehiclePick[];
  trips: string[];
  crossLinks: { href: string; anchor: string; lead: string }[];
  siblings: { slug: string; name: string }[];
  editPath?: string;
  copyH1?: string;
  copyLead?: string;
}) {
  const f = FEATURED[slug];
  const serviceSchema = serviceSchemaOf({
    path: `/services/${slug}/`,
    name: meta.name,
    description: meta.metaDescription,
    image: photos?.[0]?.src ? `${SITE.url}${photos[0].src}` : undefined,
  });
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
  };

  return (
    <main className="pp bg-white pp-svc" style={{ fontSize: "inherit" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services/" }, { label: meta.title }]} />
      {editPath && <EditBar path={editPath} />}

      {/* ===== hero with quote form (same frame as city pages) ===== */}
      <section className="pp-hero">
        <div className="container">
          <div className="pp-hero-grid">
            <div>
              <p className="pp-eyebrow">{editPath ? `${meta.name} · ` : `${meta.name} · `}{editPath ? <Editable path={editPath} fkey="eyebrow" value={meta.eyebrow} as="span" label="Eyebrow" /> : meta.eyebrow}</p>
              <h1>
                {editPath ? <Editable path={editPath} fkey="h1" value={`${copyH1 ?? `${f.h1} ${f.em}`}`} as="span" label="Page H1" /> : copyH1 ? <>{copyH1}</> : <>{f.h1} <em>{f.em}</em></>}
              </h1>
              <p className="pp-lead">{editPath ? <Editable path={editPath} fkey="intro" value={copyLead ?? f.lead} as="p" className="" label="Intro" /> : copyLead ? <>{copyLead}</> : f.lead}</p>
              <div className="pp-hero-ctas">
                <a className="pp-btn pp-btn-amber" href="/contact/" data-source={`service-hero:${slug}`} rel="nofollow">Get a Free Quote <ArrowRight aria-hidden="true" /></a>
                <a className="pp-btn pp-btn-ghost" href={`tel:${SITE.phoneTel}`}><Phone aria-hidden="true" /> {SITE.phoneDisplay}</a>
              </div>
              <ul className="pp-trust">
                <li><ShieldCheck aria-hidden="true" />DOT-compliant fleet</li>
                <li><Tag aria-hidden="true" />Gratuity, tolls &amp; taxes included</li>
                <li><Headset aria-hidden="true" />24/7 dispatch</li>
              </ul>
            </div>

            <form className="pp-quote" id="quote" action="/contact/" method="get" aria-labelledby="sv-quote-title">
              <h2 id="sv-quote-title">{f.form.title}</h2>
              <p className="pp-sub-note">One final price. Average reply in about 15 minutes.</p>
              {/* field names match the full booking form's prefill, so submitting
                  this card lands on /contact/ with the details already in place. */}
              <input type="hidden" name="source" value={`service:${slug}`} />
              <div className="pp-field">
                <label htmlFor="sv-q-pickup">{f.form.pickup}</label>
                <input id="sv-q-pickup" name="pickup" type="text" placeholder={f.form.pickupPh} autoComplete="street-address" />
              </div>
              <div className="pp-field">
                <label htmlFor="sv-q-dest">{f.form.dest}</label>
                <input id="sv-q-dest" name="destination" type="text" placeholder={f.form.destPh} />
              </div>
              <div className="pp-field-row">
                <div className="pp-field">
                  <label htmlFor="sv-q-date">{f.form.date}</label>
                  <input id="sv-q-date" name="date" type="date" />
                </div>
                <div className="pp-field">
                  <label htmlFor="sv-q-pax">{f.form.pax}</label>
                  <select id="sv-q-pax" name="passengers" defaultValue="">
                    <option value="">Select</option>
                    <option value="14">1–14 (Sprinter)</option>
                    <option value="32">15–32 (Minibus)</option>
                    <option value="60">33–60 (Coach / School bus)</option>
                    <option value="60-plus">60+ (Multiple vehicles)</option>
                  </select>
                </div>
              </div>
              <button className="pp-btn pp-btn-amber" type="submit" data-source={`service:${slug}`}>See the Full Booking Form <ArrowRight aria-hidden="true" /></button>
              <p className="pp-fine"><Check aria-hidden="true" />No obligation · No hidden fees</p>
            </form>
          </div>
        </div>
      </section>

      {/* ===== facts strip ===== */}
      <section className="pp-facts" aria-label={`${meta.name} key facts`}>
        <div className="container">
          <dl className="pp-facts-grid">
            {FACTS.map((fact) => (
              <div className="pp-fact" key={fact.dt}>
                <dt>{fact.dt}</dt>
                <dd>{fact.dd}<small>{fact.unit}</small></dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ===== what this service is ===== */}
      <section className="pp-sec" id="about">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">What this service is</p>
            <h2>{`Booked to the minute, quoted to the penny`}</h2>
            <p>{meta.intro}</p>
          </header>
          {photos && (
            <div className="pp-service-gallery">
              {photos.map((p) => (
                <figure key={p.src} className="pp-service-photo">
                  <Image src={p.src} alt={p.alt} width={900} height={620} sizes="(max-width: 900px) 100vw, 33vw" style={{ objectFit: "cover", width: "100%", height: 250, borderRadius: 18 }} loading="lazy" decoding="async" />
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== which vehicle fits ===== */}
      <section className="pp-sec pp-bg-white" id="vehicles">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">Vehicle match</p>
            <h2>{f.vehicles}</h2>
            <p>Every quote proposes the vehicle against your group and route—larger trips split across two vehicle types. Specs are the real ones for each vehicle.</p>
          </header>
          <div className="pp-vrows">
            {vehiclesFor.map((v, i) => {
              const vh = VEHICLES.find((x) => x.slug === v.slug);
              if (!vh) return null;
              const img = SERVICE_IMAGES[v.slug];
              const specs = [vh.passengers, vh.luggage, ...vh.amenities.slice(0, 2)];
              return (
                <article className={`pp-vrow${i === 0 ? " pp-vrow-top" : ""}`} key={v.slug}>
                  <Link href={`/fleet/${vh.slug}/`} className="pp-vrow-media" aria-label={`See the ${vh.ctaName} details`}>
                    <span className="pp-num" aria-hidden="true">{`0${i + 1}`}</span>
                    {i === 0 && <span className="pp-vrow-pick">Best fit</span>}
                    {img && (
                      <VehiclePhoto
                        photos={fleetShots(vh.slug, img)}
                        alt={`${vh.cardName} - Cascade Charter Bus`}
                        fill
                        sizes="(max-width: 800px) 100vw, 320px"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </Link>
                  <div className="pp-vrow-body">
                    <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-1">
                      <Link className="pp-vrow-title" href={`/fleet/${vh.slug}/`}>{vh.cardName}</Link>
                      <span className="pp-badge">{vh.passengers}</span>
                    </div>
                    <p className="pp-vrow-why">{v.why}</p>
                    <div className="pp-specs" aria-label={`${vh.cardName} key specs`}>
                      {specs.map((sp) => (
                        <span className="pp-spec" key={sp}>
                          <Check size={13} aria-hidden="true" />{sp}
                        </span>
                      ))}
                    </div>
                    <Link className="pp-link-arrow" href={`/fleet/${vh.slug}/`}>See the {vh.ctaName} <ArrowRight size={15} style={{ verticalAlign: "-3px" }} aria-hidden="true" /></Link>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-4 d-flex flex-wrap gap-2 align-items-center">
            <span className="small fw-bold" style={{ color: "var(--pp-muted)" }}>Or compare the whole fleet:</span>
            {VEHICLES.map((v) => (
              <Link key={v.slug} href={`/fleet/${v.slug}/`} className="pp-chip">{v.cardName} <span>{v.passengers}</span></Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== how it runs (dark band, city-page style) ===== */}
      <section className="pp-sec pp-bg-ink on-dark" id="how">
        <div className="container">
          <header className="pp-sec-head mx-auto text-center" style={{ maxWidth: 760 }}>
            <p className="pp-eyebrow" style={{ color: "var(--pp-amber)" }}>Simple process</p>
            <h2 style={{ color: "#fff" }}>{f.steps}</h2>
            <p style={{ color: "#a9b0c2" }}>{f.stepsLead}</p>
          </header>
          <ol className="pp-steps">
            {story.map((st, i) => (
              <li className="pp-step" key={st.step}>
                <div className="pp-step-num" aria-hidden="true">{i + 1}</div>
                <h3>{st.step}</h3>
                <p>{st.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== pricing ===== */}
      <section className="pp-sec pp-bg-white" id="pricing">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">Pricing</p>
            <h2>How pricing works</h2>
            <p>One quote covers it: vehicle type and group size, trip length, season demand, overnight stays and late pickups.</p>
          </header>
          <div className="row g-3 align-items-stretch">
            <div className="col-lg-7 d-flex">
              <ul className="pp-checklist" style={{ width: "100%" }}>
                <li><Check aria-hidden="true" /><span>Gratuity, tolls and taxes are in the quote—nothing is added later</span></li>
                <li><Check aria-hidden="true" /><span>The quote states the plan: schedule, vehicle count, pickup and return times</span></li>
                <li><Check aria-hidden="true" /><span>No hidden fuel surcharges or driver fees</span></li>
                <li><Check aria-hidden="true" /><span>Changes are confirmed in writing before travel day</span></li>
              </ul>
            </div>
            <div className="col-lg-5 d-flex">
              <div className="pp-final-card" style={{ width: "100%", maxWidth: "none", margin: 0 }}>
                <Quote aria-hidden="true" size={26} style={{ color: "var(--pp-amber)" }} />
                <h3 className="mb-2">The quote you receive is final.</h3>
                <p className="pp-checklist-lead mb-0">Gratuity included. No hidden fuel surcharges or driver fees. Average reply in about 15 minutes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== trips + cross links ===== */}
      <section className="pp-sec" id="trips">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">Real runs</p>
            <h2>Trips we run all the time</h2>
          </header>
          <ul className="pp-checklist pp-checklist-2col">
            {trips.map((t) => (
              <li key={t}><Check aria-hidden="true" /><span>{t}</span></li>
            ))}
          </ul>
          {(crossLinks || []).length > 0 && (
            <p className="mt-4 mb-0" style={{ color: "var(--pp-muted)" }}>
              {crossLinks.map((l) => (
                <span className="d-block d-sm-inline me-2" key={l.href + l.anchor}>
                  {l.lead} <Link href={l.href} className="fw-semibold text-decoration-none text-link-pad" style={{ color: "var(--pp-ink)" }}>{l.anchor}</Link> page.
                </span>
              ))}
            </p>
          )}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="pp-sec pp-bg-white" id="faq">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">FAQ</p>
            <h2>{f.faq}</h2>
            <p>{f.faqLead}</p>
          </header>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <FaqAccordion faqs={faqs} idPrefix={`service-${slug}`} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== related services ===== */}
      <section className="pp-sec" id="related">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">Keep planning</p>
            <h2>Other services</h2>
          </header>
          <div className="d-flex flex-wrap gap-2">
            {siblings.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}/`} className="pp-chip">{s.name} <ChevronRight size={13} style={{ verticalAlign: "-2px" }} aria-hidden="true" /></Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== final CTA (amber band) ===== */}
      <section className="pp-cta-band">
        <div className="container pp-cta-inner">
          <div>
            <h2>{f.cta}</h2>
            <p>Share the trip and group count—get one final quote, usually in about 15 minutes.</p>
          </div>
          <div className="pp-cta-actions">
            <a className="pp-btn pp-btn-dark" href="/contact/" data-source={`service-cta:${slug}`} rel="nofollow">Get a Free Quote <ArrowRight aria-hidden="true" /></a>
            <a className="pp-btn pp-btn-outline-dark" href={`tel:${SITE.phoneTel}`}><Phone aria-hidden="true" />{`Call ${SITE.phoneDisplay}`}</a>
          </div>
        </div>
      </section>
    </main>
  );
}

export { SERVICE_IMAGES };
