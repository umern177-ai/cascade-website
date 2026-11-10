// About page — same layout as live; facts corrected per brief 7.5b:
// "5+ years of service" (no 10+/15+), no invented trips/drivers/rating numbers,
// WiFi claim reflects the fleet data (on most motorcoaches), no invented team.
import Link from "next/link";
import Image from "next/image";
import { Check, Bus, MapPin, Award, Users, Clock, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/site-data";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "About Cascade Charter Bus",
  description:
    "About Cascade Charter Bus: nationwide group transportation with DOT-certified drivers, 24/7 dispatch, 5+ years of service and coverage in all 50 states.",
  path: "/about/",
});

const STANDARDS = [
  {
    icon: ShieldCheck,
    title: "Safety-First Culture",
    text: "Our DOT-compliant safety protocols include rigorous multi-point inspections and electronic logging.",
  },
  {
    icon: Bus,
    title: "Well-Equipped Coaches",
    text: "High-speed WiFi, power outlets, and climate control are available on most motorcoaches—we confirm the amenities for your vehicle when you book.",
  },
  {
    icon: MapPin,
    title: "Local Expertise",
    text: "We employ drivers with deep knowledge of local routes to navigate city traffic efficiently.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    text: "Dispatch is reachable around the clock, before and during your trip.",
  },
];

export default function About() {
  return (
    <main className="bg-white min-vh-100">
      {/* hero with photo */}
      <section
        className="py-5 position-relative text-white"
        style={{ paddingTop: 140, paddingBottom: 80, background: "linear-gradient(rgba(15,23,42,0.8), rgba(15,23,42,0.85)), url('/images/about-bus.jpg') center/cover" }}
      >
        <div className="container text-center">
          <span className="text-brand-dark fw-bold text-uppercase tracking-widest mb-3 d-block">About Cascade Charter</span>
          <h1 className="display-4 fw-bold mb-3">Redefining Group Travel</h1>
          <p className="lead opacity-75 mx-auto mb-0" style={{ maxWidth: 650 }}>
            Providing nationwide transportation infrastructure with a commitment to safety, comfort, and reliability.
          </p>
        </div>
      </section>

      {/* stats — confirmed facts only */}
      <section className="py-4 bg-white shadow-sm position-relative z-index-10 mt-n4 mx-auto rounded-4 container border">
        <div className="row text-center g-4">
          <div className="col-md-3 col-6 border-end">
            <p className="h3 fw-bold text-primary mb-1">5+</p>
            <p className="mb-0 x-small-bold text-dark">Years of Service</p>
          </div>
          <div className="col-md-3 col-6 border-end">
            <p className="h3 fw-bold text-primary mb-1">50</p>
            <p className="mb-0 x-small-bold text-dark">States Covered</p>
          </div>
          <div className="col-md-3 col-6 border-end">
            <p className="h3 fw-bold text-primary mb-1">24/7</p>
            <p className="mb-0 x-small-bold text-dark">Logistics Team</p>
          </div>
          <div className="col-md-3 col-6">
            <p className="h3 fw-bold text-primary mb-1">7</p>
            <p className="mb-0 x-small-bold text-dark">Vehicle Types</p>
          </div>
        </div>
      </section>

      {/* Driving Excellence */}
      <section className="py-5 my-5">
        <div className="container py-lg-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold text-dark mb-4">Driving Excellence Across the Nation</h2>
              <p className="text-muted lead mb-4">
                Cascade Charter was founded to bridge the gap between local transport and nationwide reliability.
              </p>
              <p className="text-muted mb-4">
                What started with a focus on local corporate shuttles has evolved into a{" "}
                <strong>premier nationwide network</strong>. We specialize in complex
                logistics, ensuring that whether you are booking in New York or Los Angeles,
                the quality remains consistent.
              </p>
              <ul className="list-unstyled mb-4">
                <li className="mb-2 d-flex align-items-center gap-2">
                  <Check size={18} className="text-primary" aria-hidden="true" />
                  <span className="text-dark">Real-time Tracking</span>
                </li>
                <li className="mb-2 d-flex align-items-center gap-2">
                  <Check size={18} className="text-primary" aria-hidden="true" />
                  <span className="text-dark">24/7 Logistics Support</span>
                </li>
              </ul>
              <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 border-start border-primary border-4">
                <Award size={32} className="text-primary flex-shrink-0" aria-hidden="true" />
                <p className="mb-0 small fw-medium text-dark">
                  One standard everywhere: on-time, safe, and ready before the group arrives.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="rounded-5 overflow-hidden shadow-lg border border-2 border-white position-relative">
                <Image src="/images/fleet/charter.jpg" alt="Cascade Charter Bus" width={800} height={560} style={{ objectFit: "cover", width: "100%" }} sizes="(max-width: 992px) 100vw, 50vw" />
                <div className="position-absolute bottom-0 end-0 bg-primary text-white p-4 rounded-4 shadow-lg mb-n3 me-n3 d-none d-md-block">
                  <p className="display-6 fw-bold mb-0">5+</p>
                  <p className="mb-0 text-uppercase small fw-bold">Years of Service</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Standards */}
      <section className="py-5 bg-light">
        <div className="container py-lg-4">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark">Our Operating Standards</h2>
            <div className="mx-auto bg-primary mt-3" style={{ width: 60, height: 4 }} />
          </div>
          <div className="row g-4">
            {STANDARDS.map((s) => (
              <div className="col-lg-3 col-md-6" key={s.title}>
                <div className="card border-0 shadow-sm h-100 p-4 rounded-4">
                  <div className="text-primary mb-3">
                    <s.icon size={36} aria-hidden="true" />
                  </div>
                  <h3 className="h6 fw-bold text-dark mb-2">{s.title}</h3>
                  <p className="text-muted small mb-0">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 bg-dark text-white text-center">
        <div className="container py-4">
          <Users size={40} className="text-primary mb-3" aria-hidden="true" />
          <h2 className="display-6 fw-bold mb-3">Travel With a Team That Plans Ahead</h2>
          <p className="text-white-50 mb-4">Tell us your itinerary and get a final quote—usually in about 15 minutes.</p>
          <Link className="btn btn-primary rounded-pill px-5 py-3 fw-bold btn-lg shadow-lg" href="/contact/">GET A QUOTE</Link>
        </div>
      </section>
    </main>
  );
}
