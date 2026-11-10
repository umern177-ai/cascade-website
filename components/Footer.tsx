// Footer rebuilt from the live footer markup (capture/extract-footer.html),
// with the three fixes from brief Section 6.1: correct address, Sitemap link to
// the HTML sitemap page, fixed copyright line. Column titles are <p>/<span>, not
// headings (brief 7.5b), styled to look identical.
import Link from "next/link";
import { MapPin, Phone, Mail, ShieldCheck } from "lucide-react";
import { SITE, SERVICES } from "@/lib/site-data";

// Social icons inlined (paths copied from the live footer markup — lucide's new
// versions dropped brand icons, but the look must stay identical).
const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function FacebookIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1={17.5} x2={17.51} y1={6.5} y2={6.5} />
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width={4} height={12} x={2} y={9} />
      <circle cx={4} cy={4} r={2} />
    </svg>
  );
}
function TiktokIcon() {
  // TikTok's official glyph (the path outlines the note itself), rendered
  // filled so it reads like the real logo at small sizes (20px).
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
      <path d="M12.525.02c1.31 0 2.591.214 3.794.613V5.5c-1.127-.661-2.42-1.042-3.794-1.042V9.11a5.617 5.617 0 0 1 5.617 5.617 5.617 5.617 0 0 1-5.617 5.617 5.617 5.617 0 0 1-5.617-5.617V0h5.617Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer-modern pt-5 pb-3">
      <div className="container">
        <div className="row gy-5">
          <div className="col-lg-4">
            <Link className="text-decoration-none d-flex align-items-center gap-3 mb-4" href="/">
              {/* eslint-disable-next-line @next/next/no-img-element -- matches live markup */}
              <img alt="Cascade Logo" loading="lazy" width={60} height={60} className="rounded-0 shadow-glow" src="/logo.png" />
              <span className="fw-black mb-0 text-white tracking-tighter lh-1 fs-4 d-block">
                CASCADE
                <br />
                <span className="text-primary fs-5 tracking-widest text-uppercase">Charter BUS</span>
              </span>
            </Link>
            <p className="pe-lg-5 small lh-lg">
              Nationwide <strong>group transportation</strong> with late-model motorcoaches
              and executive shuttles, driven by DOT-certified professionals and backed by a
              24/7 dispatch team.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a target="_blank" rel="noopener noreferrer" className="social-btn" href={SITE.social.facebook} aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a target="_blank" rel="noopener noreferrer" className="social-btn" href={SITE.social.instagram} aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a target="_blank" rel="noopener noreferrer" className="social-btn" href={SITE.social.linkedin} aria-label="LinkedIn">
                <LinkedinIcon />
              </a>
              <a target="_blank" rel="noopener noreferrer" className="social-btn" href={SITE.social.tiktok} aria-label="TikTok">
                <TiktokIcon />
              </a>
            </div>
          </div>
          <div className="col-lg-2 col-6">
            <p className="footer-heading mb-4 text-white mb-4">Quick Links</p>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link className="footer-link text-white" href="/">Home</Link></li>
              <li className="mb-2"><Link className="footer-link text-white" href="/fleet/">Our Fleet</Link></li>
              <li className="mb-2"><Link className="footer-link text-white" href="/locations/">Service Areas</Link></li>
              <li className="mb-2"><Link className="footer-link text-white" href="/services/">Services</Link></li>
              <li className="mb-2"><Link className="footer-link text-white" href="/about/">About Us</Link></li>
              <li className="mb-2"><Link className="footer-link text-white" href="/contact/">Get A Quote</Link></li>
              <li className="mb-2"><Link className="footer-link text-white" href="/faqs/">FAQ&apos;s</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-6">
            <p className="footer-heading mb-4 text-white">Our Services</p>
            <ul className="list-unstyled small">
              {SERVICES.map((s) => (
                <li className="mb-2" key={s.slug}>
                  <Link className="footer-link text-white" href={`/services/${s.slug}/`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-3">
            <p className="footer-heading mb-4 text-white">Contact HQ</p>
            <ul className="list-unstyled text-muted small mb-4">
              <li className="d-flex align-items-start mb-3 gap-3">
                <MapPin size={18} className="text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                <span className="text-white">
                  {SITE.address.street}, {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
                </span>
              </li>
              <li className="d-flex align-items-center mb-3 gap-3">
                <Phone size={18} className="text-primary flex-shrink-0" aria-hidden="true" />
                <a href={`tel:${SITE.phoneTel}`} className="text-white fw-bold text-decoration-none hover-orange">{SITE.phoneDisplay}</a>
              </li>
              <li className="d-flex align-items-center mb-3 gap-3">
                <Mail size={18} className="text-primary flex-shrink-0" aria-hidden="true" />
                <a href={`mailto:${SITE.email}`} className="text-white fw-bold text-decoration-none hover-orange">{SITE.email}</a>
              </li>
            </ul>
            <div className="safety-card">
              <div className="d-flex align-items-center gap-2 mb-1">
                <ShieldCheck size={18} className="text-primary" aria-hidden="true" />
                <span className="fw-bold text-white small">DOT COMPLIANT</span>
              </div>
              <p className="x-small mb-0">Safety-first infrastructure for every group ride.</p>
            </div>
          </div>
        </div>
        <hr className="my-5 border-white border-opacity-10" />
        <div className="row align-items-center gy-3 pb-3">
          <div className="col-md-6 text-center text-md-start">
            <p className="x-small text-muted mb-0">
              © {new Date().getFullYear()} <strong>Cascade Charter Bus</strong>.
              <span className="ms-2 opacity-50">All rights reserved.</span>
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3 gap-md-4 flex-wrap">
              <Link className="x-small text-white text-decoration-none opacity-75" href="/privacy-policy/">Privacy</Link>
              <Link className="x-small text-white text-decoration-none opacity-75" href="/termsandconditions/">Terms</Link>
              <Link className="x-small text-white text-decoration-none opacity-75" href="/cancellation-policy/">Cancellation</Link>
              <Link className="x-small text-white text-decoration-none opacity-75" href="/sitemap/">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
