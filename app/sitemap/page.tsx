// HTML sitemap page (brief Section 9.6): main pages, services, fleet, states,
// kept cities grouped by state. Structured layout with the site theme (Nov 12).
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { states, stateName } from "@/lib/locations";
import { SERVICES, FLEET } from "@/lib/site-data";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "HTML Sitemap",
  description: "Every page on cascadecharterbus.com: services, fleet, locations and city pages.",
  path: "/sitemap/",
});

const SIMPLE = [
  ["Home", "/"],
  ["About Us", "/about/"],
  ["Contact", "/contact/"],
  ["FAQ's", "/faqs/"],
  ["Privacy Policy", "/privacy-policy/"],
  ["Terms & Conditions", "/termsandconditions/"],
  ["Cancellation Policy", "/cancellation-policy/"],
  ["View Sitemap", "/sitemap/"],
];

function LinkCard({ title, items, eyebrow }: { title: string; eyebrow: string; items: [string, string][] }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-2 mb-1">
          <span className="badge bg-primary text-dark rounded-pill px-3 py-2 x-small-bold" style={{ fontSize: "0.68rem" }}>{eyebrow}</span>
        </div>
        <h2 className="h5 fw-bold text-dark mb-3">{title}</h2>
        <ul className="list-unstyled mb-0 vstack gap-2">
          {items.map(([t, h]) => (
            <li key={h}>
              <Link className="sitemap-link d-flex align-items-center justify-content-between small" href={h}>
                {t}
                <span aria-hidden="true" className="text-muted">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function SitemapPage() {
  const allStates = [...states()].sort((a, b) => a.state_code.localeCompare(b.state_code));
  const cityPages = allStates.reduce((n, s) => n + s.cities.length, 0);
  const byLetter = new Map<string, typeof allStates>();
  for (const s of allStates) {
    const letter = stateName(s.state_code)[0].toUpperCase();
    if (!byLetter.has(letter)) byLetter.set(letter, []);
    byLetter.get(letter)!.push(s);
  }

  return (
    <main className="bg-white min-vh-100">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sitemap" }]} />

      <section className="py-5 bg-dark text-white" style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="container text-center">
          <span className="text-primary fw-bold text-uppercase tracking-widest mb-3 d-block">Site Map</span>
          <h1 className="display-4 fw-bold mb-3">Every Page, Organized</h1>
          <p className="lead opacity-75 mx-auto mb-4" style={{ maxWidth: 640 }}>
            Find any page on the site: services, fleet, and charter bus locations
            grouped by state.
          </p>
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <span className="badge bg-primary text-dark px-4 py-2 rounded-pill x-small-bold">{allStates.length} States + DC</span>
            <span className="badge bg-white bg-opacity-10 border border-white border-opacity-25 text-white px-4 py-2 rounded-pill x-small-bold">{cityPages} City Pages</span>
            <span className="badge bg-white bg-opacity-10 border border-white border-opacity-25 text-white px-4 py-2 rounded-pill x-small-bold">{SERVICES.length} Services</span>
            <span className="badge bg-white bg-opacity-10 border border-white border-opacity-25 text-white px-4 py-2 rounded-pill x-small-bold">{FLEET.length} Vehicle Types</span>
          </div>
        </div>
      </section>

      {/* Main pages / Services / Fleet cards */}
      <section className="py-5">
        <div className="container py-lg-3">
          <div className="row g-4">
            <div className="col-md-4">
              <LinkCard eyebrow="Core" title="Main Pages" items={SIMPLE as [string, string][]} />
            </div>
            <div className="col-md-4">
              <LinkCard
                eyebrow="What We Do"
                title="Our Services"
                items={[["All Services", "/services/"], ...SERVICES.map((s) => [s.name, `/services/${s.slug}/`] as [string, string])]}
              />
            </div>
            <div className="col-md-4">
              <LinkCard
                eyebrow="Our Fleet"
                title="Vehicle Types"
                items={[["View Entire Fleet", "/fleet/"], ...FLEET.map((f) => [f.name, `/fleet/${f.slug}/`] as [string, string])]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Locations by state, grouped A–Z */}
      <section className="py-5 bg-light">
        <div className="container py-2">
          <div className="text-center mb-4">
            <span className="text-brand-dark fw-bold text-uppercase tracking-wider">Locations</span>
            <h2 className="display-5 fw-bold text-dark mt-1">Charter Bus Pages by State</h2>
            <p className="text-muted mt-2 mb-0">Each state page also carries a button for every other town we serve.</p>
            <div className="mx-auto bg-primary mt-3" style={{ width: 60, height: 4 }} />
          </div>

          {/* A–Z jump row */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
            {[...byLetter.keys()].map((letter) => (
              <a key={letter} href={`#state-${letter}`} className="sitemap-chip fw-bold">{letter}</a>
            ))}
          </div>

          <div style={{ contentVisibility: "auto", containIntrinsicSize: "auto 60000px" }}>
            {[...byLetter.entries()].map(([letter, group]) => (
              <div className="mb-5" key={letter} id={`state-${letter}`} style={{ scrollMarginTop: 110 }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="sitemap-letter" aria-hidden="true">{letter}</span>
                  <h2 className="h4 fw-bold text-dark mb-0">{letter === "A" ? "A" : letter} States</h2>
                </div>
                <div className="row g-4">
                  {group.map((s) => (
                    <div className="col-lg-6" key={s.state_code}>
                      <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                        <div className="card-body p-4">
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <Link className="h6 fw-bold sitemap-link mb-0" href={`/locations/${s.state_code}/`}>
                              {stateName(s.state_code)}
                            </Link>
                            <span className="badge bg-primary text-dark rounded-pill px-3">{s.cities.length} cities</span>
                          </div>
                          <div>
                            {s.cities.map((c) => (
                              <a className="sitemap-chip" key={c.slug} href={`/locations/${s.state_code}/${c.slug}/`}>{c.city}</a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="h3 fw-bold text-dark mb-2">Can&apos;t find your city?</h2>
          <p className="text-muted mb-4">City pages cover 710 destinations — every other town still opens the booking form with the pickup pre-filled.</p>
          <Link className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-sm" href="/contact/">
            GET A QUOTE
          </Link>
        </div>
      </section>
    </main>
  );
}
