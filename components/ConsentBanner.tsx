"use client";

// Cookie consent banner (checklist #17, brief Section 9.8). Google Consent Mode
// defaults are set before any measurement; the banner lets the visitor accept or
// decline (analytics) and stores the choice. Design matches the footer aesthetic.
import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const KEY = "cc-consent";

export default function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Default consent state (denied) pushed before any tags fire.
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
      /* storage unavailable — banner shows, choice not persisted */
    }
    w.dataLayer.push([
      "consent",
      "default",
      { ad_storage: "denied", analytics_storage: stored === "accept" ? "granted" : "denied" },
    ]);
    if (!stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- show banner only when no stored choice exists
      setShow(true);
    }
  }, []);

  function choose(value: "accept" | "decline") {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer?.push([
      "consent",
      "update",
      { ad_storage: "denied", analytics_storage: value === "accept" ? "granted" : "denied" },
    ]);
    setShow(false);
  }

  if (!show) return null;
  return (
    <div
      className="position-fixed bottom-0 start-0 end-0 bg-dark text-white py-3"
      style={{ zIndex: 1050, borderTop: "3px solid var(--fleet-orange)" }}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="container d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-3">
        <p className="mb-0 small d-flex align-items-center gap-2">
          <Cookie size={18} className="text-primary flex-shrink-0" aria-hidden="true" />
          <span>
            We use cookies to improve the site and measure how it performs.
            <Link href="/privacy-policy/" className="text-primary ms-1">Privacy Policy</Link>
          </span>
        </p>
        <div className="d-flex gap-2 flex-shrink-0">
          <button type="button" className="btn btn-primary rounded-pill px-4 py-2 fw-bold" onClick={() => choose("accept")}>
            Accept
          </button>
          <button type="button" className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold" onClick={() => choose("decline")}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
