"use client";

// Header rebuilt from the live header markup (capture/extract-header.html).
// Bootstrap's JS is not loaded — dropdowns, collapse and toggles are small React
// state handlers (same look and behavior, less JavaScript, brief Section 7.5b).
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mail, Phone, Menu, ChevronDown } from "lucide-react";
import { SITE, SERVICES, FLEET } from "@/lib/site-data";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [fleetOpen, setFleetOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  // Close menus when clicking outside or pressing Escape
  useEffect(() => {
    function onClickAway(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
        setFleetOpen(false);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setServicesOpen(false);
        setFleetOpen(false);
        setOpen(false);
      }
    }
    document.addEventListener("click", onClickAway);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("click", onClickAway);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <header className="shadow-lg" ref={rootRef}>
      <div className="top-ribbon py-2 d-none d-md-block bg-black border-bottom border-white border-opacity-10">
        <div className="container d-flex justify-content-between align-items-center">
          <a href={`mailto:${SITE.email}`} className="text-decoration-none d-flex align-items-center gap-2">
            <Mail size={14} className="text-primary" aria-hidden="true" />
            <span className="small fw-bold text-white opacity-75">{SITE.email}</span>
          </a>
          <a href={`tel:${SITE.phoneTel}`} className="text-decoration-none d-flex align-items-center gap-2">
            <Phone size={14} className="text-primary" aria-hidden="true" />
            <span className="small fw-bold text-white opacity-75">{SITE.phoneDisplay}</span>
          </a>
        </div>
      </div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top py-2 shadow-lg border-bottom border-primary border-opacity-25">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element -- matches live markup; logo is small (192px) */}
            <img alt="Cascade Charter Logo" width={50} height={50} className="rounded-0 shadow-sm" src="/logo.png" />
            <span className="d-flex flex-column lh-1">
              <span className="fw-black fs-4 tracking-tighter text-white mb-0">CASCADE</span>
              <span className="text-primary small fw-bold tracking-widest">CHARTER BUS</span>
            </span>
          </Link>
          <button
            type="button"
            className="navbar-toggler border-0 shadow-none"
            aria-expanded={open}
            aria-controls="navContent"
            aria-label="Toggle navigation"
            onClick={() => setOpen(!open)}
          >
            <Menu size={28} color="#fff" aria-hidden="true" />
          </button>
          <div id="navContent" className={`collapse navbar-collapse ${open ? "show" : ""}`}>
            <ul className="navbar-nav mx-auto gap-1">
              <li className="nav-item">
                <Link className="nav-link px-3 text-uppercase x-small-bold" href="/">Home</Link>
              </li>
              <li className="nav-item dropdown">
                <button
                  type="button"
                  className="nav-link px-3 text-uppercase x-small-bold d-flex align-items-center gap-1 dropdown-toggle custom-nav-link bg-transparent border-0"
                  aria-expanded={servicesOpen}
                  onClick={() => { setServicesOpen(!servicesOpen); setFleetOpen(false); }}
                >
                  Services <ChevronDown size={14} aria-hidden="true" />
                </button>
                <ul className={`dropdown-menu dropdown-menu-dark border-0 shadow-xl rounded-0 mt-2 py-3 px-2 ${servicesOpen ? "show" : ""}`}>
                  {SERVICES.map((s) => (
                    <li key={s.slug}>
                      <Link className="dropdown-item py-2 px-3 small" href={`/services/${s.slug}/`}>
                        {s.name}
                      </Link>
                    </li>
                  ))}
                  <li><hr className="dropdown-divider opacity-10" /></li>
                  <li>
                    <Link className="dropdown-item fw-bold text-primary small" href="/services/">All Services</Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <button
                  type="button"
                  className="nav-link px-3 text-uppercase x-small-bold d-flex align-items-center gap-1 dropdown-toggle custom-nav-link bg-transparent border-0"
                  aria-expanded={fleetOpen}
                  onClick={() => { setFleetOpen(!fleetOpen); setServicesOpen(false); }}
                >
                  Fleet <ChevronDown size={14} aria-hidden="true" />
                </button>
                <ul className={`dropdown-menu dropdown-menu-dark border-0 shadow-xl rounded-0 mt-2 py-3 px-2 ${fleetOpen ? "show" : ""}`}>
                  {FLEET.map((f) => (
                    <li key={f.slug}>
                      <Link className="dropdown-item py-2 px-3 small" href={`/fleet/${f.slug}/`}>
                        {f.name}
                      </Link>
                    </li>
                  ))}
                  <li><hr className="dropdown-divider opacity-10" /></li>
                  <li>
                    <Link className="dropdown-item fw-bold text-primary small" href="/fleet/">View Entire Fleet</Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-3 text-uppercase x-small-bold" href="/locations/">Locations</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-3 text-uppercase x-small-bold" href="/about/">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-3 text-uppercase x-small-bold" href="/contact/">Contact</Link>
              </li>
            </ul>
            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              <Link className="btn btn-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm" href="/contact/">
                BOOK NOW
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
