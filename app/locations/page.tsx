// Locations hub — same structure as the live hub: H1, intro, one block per
// state with a VIEW CITIES button, A–Z. Fixes: true count of state areas,
// state names as H2 (same look as the live H5), breadcrumb + intro line.
import Link from "next/link";
import { MapPin } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { stateCodes, stateName } from "@/lib/locations";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "Charter Bus Service Locations | All 50 States",
  description:
    "Our service locations: charter bus rental in 50 states and Washington DC. Browse cities and regions for local group transportation and fleet options.",
  path: "/locations/",
});

export default function LocationsHub() {
  const codes = [...stateCodes()].sort((a, b) => a.localeCompare(b));
  const areas = codes.map((c) => ({ code: c, name: stateName(c) }));
  const count = areas.length;

  return (
    <main className="bg-white min-vh-100">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Locations" }]} />
<section className="py-5 bg-dark text-white" style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="container text-center">
          <span className="text-primary fw-bold text-uppercase tracking-widest mb-3 d-block">Service Areas</span>
          <h1 className="display-4 fw-bold mb-3">Our Service Locations</h1>
          <p className="lead opacity-75 mx-auto mb-4" style={{ maxWidth: 700 }}>
            Charter bus rental in {count} states and Washington, DC — pick a state to see
            its destinations, or send the form from any town in America.
          </p>
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <span className="badge bg-primary text-dark px-4 py-2 rounded-pill x-small-bold">{count} States + DC</span>
            <span className="badge bg-white bg-opacity-10 border border-white border-opacity-25 text-white px-4 py-2 rounded-pill x-small-bold">710 City Pages</span>
            <span className="badge bg-white bg-opacity-10 border border-white border-opacity-25 text-white px-4 py-2 rounded-pill x-small-bold">24/7 Dispatch</span>
          </div>
        </div>
      </section>
            <section className="pb-5">
        <div className="container">
          <p className="text-center text-muted mb-4">
            Every state below has a full page with its destinations — popular cities at the
            top, every other town one click away through the quote form.
          </p>
          <div className="row g-3 g-md-4">
            {areas.map((a, i) => (
              <div className="col-lg-3 col-sm-6 col-6" key={a.code}>
                <Link href={`/locations/${a.code}/`} className="text-decoration-none">
                  <div className="card border-0 shadow-sm rounded-4 hover-lift h-100 location-tile">
                    <div className="card-body p-3 p-md-4 d-flex flex-column align-items-center text-center">
                      <span className="bg-primary-soft text-primary rounded-circle mb-2 mb-md-3" style={{ width: 46, height: 46 }} aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 8 }}>
                          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </span>
                      <h2 className="h5 fw-bold mb-1 mt-1 text-dark lh-sm">{a.name}</h2>
                      <span className="badge bg-primary text-dark rounded-pill px-3 mb-2 mt-2">VIEW CITIES</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-5 bg-light border-top border-bottom">
        <div className="container py-4 text-center">
          <MapPin size={40} className="text-primary mb-3" aria-hidden="true" />
          <h2 className="fw-bold mb-3 text-dark">Not Seeing Your City Listed?</h2>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: 680 }}>
            We serve every state—city pages highlight the busiest destinations, but any town is bookable. Open the booking form and tell us where you&apos;re going.
          </p>
          <Link className="btn btn-primary rounded-pill px-5 fw-bold py-3 hover-lift shadow-sm" href="/contact/">
            GET A QUOTE
          </Link>
        </div>
      </section>
    </main>
  );
}
