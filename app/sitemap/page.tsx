// HTML sitemap page (brief Section 9.6): main pages, services, fleet, states,
// kept cities grouped by state. The footer "Sitemap" link points here.
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
];

export default function SitemapPage() {
  const allStates = [...states()].sort((a, b) => a.state_code.localeCompare(b.state_code));
  return (
    <main className="bg-white min-vh-100">
      <section className="py-5 bg-dark text-white" style={{ paddingTop: 140, paddingBottom: 60 }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-2">Sitemap</h1>
          <p className="opacity-75 mx-auto mb-0" style={{ maxWidth: 560 }}>
            Every page on the site, organized.
          </p>
        </div>
      </section>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sitemap" }]} />
      <section className="pb-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-md-4">
              <h2 className="h5 fw-bold text-dark mb-3">Main Pages</h2>
              <ul className="list-unstyled small">
                {SIMPLE.map(([t, h]) => (
                  <li className="mb-2" key={h}><Link className="text-decoration-none" href={h}>{t}</Link></li>
                ))}
              </ul>
              <h2 className="h5 fw-bold text-dark mb-3 mt-4">Our Services</h2>
              <ul className="list-unstyled small">
                <li className="mb-2"><Link className="text-decoration-none" href="/services/">All Services</Link></li>
                {SERVICES.map((s) => (
                  <li className="mb-2" key={s.slug}><Link className="text-decoration-none" href={`/services/${s.slug}/`}>{s.name}</Link></li>
                ))}
              </ul>
              <h2 className="h5 fw-bold text-dark mb-3 mt-4">Fleet</h2>
              <ul className="list-unstyled small">
                <li className="mb-2"><Link className="text-decoration-none" href="/fleet/">View Entire Fleet</Link></li>
                {FLEET.map((f) => (
                  <li className="mb-2" key={f.slug}><Link className="text-decoration-none" href={`/fleet/${f.slug}/`}>{f.name}</Link></li>
                ))}
              </ul>
            </div>
            <div className="col-md-8">
              <h2 className="h5 fw-bold text-dark mb-3">Charter Bus Locations by State</h2>
              {allStates.map((s) => (
                <div className="mb-4" key={s.state_code}>
                  <h3 className="h6 fw-bold text-dark mb-2">
                    <Link className="text-decoration-none" href={`/locations/${s.state_code}/`}>{stateName(s.state_code)}</Link>
                  </h3>
                  <p className="small mb-0" style={{ lineHeight: 2 }}>
                    {s.cities.map((c, i) => (
                      <span key={c.slug}>
                        <Link className="text-decoration-none" href={`/locations/${s.state_code}/${c.slug}/`}>{c.city}</Link>
                        {i < s.cities.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
