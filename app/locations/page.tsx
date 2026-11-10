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
      <section className="py-5 bg-dark text-white" style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Our Service Locations</h1>
          <p className="lead opacity-75 mx-auto mb-0" style={{ maxWidth: 700 }}>
            Charter Bus Rental | Explore our charter bus network across {count} states and DC.
          </p>
        </div>
      </section>
      <div className="container py-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Locations" }]} />
      </div>
      <section className="pb-5">
        <div className="container">
          <div className="row g-4">
            {areas.map((a) => (
              <div className="col-lg-3 col-md-4 col-6" key={a.code}>
                <Link href={`/locations/${a.code}/`} className="text-decoration-none">
                  <div className="card border-0 shadow-sm rounded-4 hover-lift h-100">
                    <div className="card-body p-4 d-flex align-items-center justify-content-between">
                      <h2 className="h6 fw-bold mb-0 text-dark">{a.name}</h2>
                      <span className="badge bg-primary text-dark x-small-bold">VIEW CITIES</span>
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
