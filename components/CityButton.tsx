// City buttons for state pages (brief Section 7.7) — SERVER-rendered:
// - Group 1 (kept city): a link to the city page, small arrow icon.
// - Group 2 (no page): link to /contact/ with data-pickup="City, ST" and
//   rel="nofollow" (thousands of form-links must never look like pages).
// Pre-fill is handled by one delegated listener (components/PickupPrefill.tsx).
import Link from "next/link";
import { MessageSquareText } from "lucide-react";

export function KeptCityButton({ stateCode, city, slug }: { stateCode: string; city: string; slug: string }) {
  return (
    <Link href={`/locations/${stateCode}/${slug}/`} className="text-decoration-none">
      <div className="card h-100 border-0 shadow-sm rounded-4 hover-lift transition-all">
        <div className="card-body p-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="bg-primary-soft p-2 rounded-3 text-primary me-3">
              <BusIcon />
            </div>
            <h2 className="h6 fw-bold mb-0 text-dark">{city}</h2>
          </div>
          <ChevronArrow />
        </div>
      </div>
    </Link>
  );
}

export function QuoteCityButton({ city, stateCode }: { city: string; stateCode: string }) {
  const pickup = `${city}, ${stateCode.toUpperCase()}`;
  // single-element markup — 1,000+ of these render per state page and DOM node
  // count is the dominant cost. The card look lives on the anchor itself.
  return (
    <a
      href="/contact/"
      className="city-quote text-decoration-none d-flex align-items-center justify-content-between"
      data-pickup={pickup}
      data-source={`state:${stateCode}`}
      rel="nofollow"
    >
      <span className="fw-bold text-muted" style={{ fontSize: "0.95rem" }}>{city}</span>
      <QuoteIcon />
    </a>
  );
}

function QuoteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-muted opacity-50 flex-shrink-0" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function BusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 6v6" />
      <path d="M15 6v6" />
      <path d="M2 12h19.6" />
      <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
      <circle cx="7" cy="18" r="2" />
      <path d="M9 18h5" />
      <circle cx="16" cy="18" r="2" />
    </svg>
  );
}

function ChevronArrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-muted opacity-50" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
