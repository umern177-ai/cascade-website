// 410 Gone page — shown for removed city URLs via the redirect rules
// (brief Section 10). Real 410 status is served by the Phase 6 redirect rules;
// this page is rendered for those requests (noindex).
import Link from "next/link";
import { MapPin } from "lucide-react";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "Page Removed | Cascade Charter Bus",
  description: "This page has been removed. Get a quote or browse locations to plan your next trip.",
  path: "/gone/",
  index: false,
});

export default function Gone() {
  return (
    <main className="bg-dark text-white min-vh-100 d-flex align-items-center">
      <div className="container text-center py-5">
        <MapPin size={48} className="text-primary mb-3" aria-hidden="true" />
        <h1 className="h2 fw-bold mb-3">This page has been removed</h1>
        <p className="opacity-75 mx-auto mb-4" style={{ maxWidth: 560 }}>
          We no longer keep a page for this destination—but your group can still start
          anywhere in the U.S. Get a quote, or browse our locations.
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link className="btn btn-primary rounded-pill px-4 py-2 fw-bold" href="/contact/">Get a Quote</Link>
          <Link className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold" href="/locations/">Browse Locations</Link>
        </div>
      </div>
    </main>
  );
}
