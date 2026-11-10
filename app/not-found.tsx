// 404 page — real 404 status + noindex (brief 7.11). Same look and buttons as
// the live site's dark sections; links to home, services, fleet, locations, contact.
import Link from "next/link";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "Page Not Found | Cascade Charter Bus",
  description:
    "Sorry, the page you're looking for could not be found. It may have been moved or removed. Explore our locations or return to the homepage to find the transportation services you need.",
  path: "/does-not-exist/",
  index: false,
});

export default function NotFound() {
  return (
    <main className="bg-dark text-white min-vh-100 d-flex align-items-center">
      <div className="container text-center py-5">
        <p className="display-1 fw-black text-primary">404</p>
        <h1 className="h2 fw-bold mb-3">This page couldn&apos;t be found</h1>
        <p className="opacity-75 mx-auto mb-4" style={{ maxWidth: 560 }}>
          The page you&apos;re looking for may have been moved or removed. Explore our
          locations, services or fleet — or tell us where your group needs to go.
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link className="btn btn-primary rounded-pill px-4 py-2 fw-bold" href="/">Return Home</Link>
          <Link className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold" href="/services/">View Services</Link>
          <Link className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold" href="/fleet/">View Fleet</Link>
          <Link className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold" href="/locations/">Browse Locations</Link>
          <Link className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold" href="/contact/">Get a Quote</Link>
        </div>
      </div>
    </main>
  );
}
