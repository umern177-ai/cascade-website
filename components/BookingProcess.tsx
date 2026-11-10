// Shared 3-step booking block + form-filling advice (owner request):
// Call or Request Online → Custom Quote → Relax and Ride.
import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE } from "@/lib/site-data";

const STEPS = [
  {
    title: "Call or Request Online",
    text: "Send the form below or call " + SITE.phoneDisplay + " — 24/7 dispatch, average reply in about 15 minutes.",
  },
  {
    title: "Custom Quote",
    text: "You receive an itinerary-specific quote: vehicle, pickup times, one final price — gratuity, tolls and taxes included.",
  },
  {
    title: "Relax and Ride",
    text: "Your driver arrives before the pickup time. Dispatch stays reachable for the whole trip, day or night.",
  },
];

export default function BookingProcess({ pickup }: { pickup: string }) {
  return (
    <section className="py-5 bg-light">
      <div className="container py-4">
        <div className="text-center mb-5">
          <span className="text-brand-dark fw-bold text-uppercase">Simple Process</span>
          <h2 className="display-6 fw-bold text-dark mt-2">How Booking Works</h2>
          <div className="mx-auto bg-primary mt-3" style={{ width: 60, height: 4 }} />
        </div>
        <div className="row g-4">
          {STEPS.map((s, i) => (
            <div className="col-md-4" key={s.title}>
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white text-center">
                <span
                  className="badge bg-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: 48, height: 48, fontSize: "1.2rem" }}
                >
                  {i + 1}
                </span>
                <h3 className="h6 fw-bold text-dark mb-2">{s.title}</h3>
                <p className="text-muted small mb-0">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="row justify-content-center mt-4">
          <div className="col-lg-9">
            <div className="p-4 bg-white border rounded-4">
              <h3 className="h6 fw-bold text-dark mb-2">Fill the form with the correct itinerary and your quote comes back final</h3>
              <p className="text-muted small mb-3">
                The dispatch team prices exactly what you send, so the more precise your details, the more
                exact the price. Include these five things:
              </p>
              <div className="row g-2">
                {[
                  "Pickup address and time (hotel, venue, office, home)",
                  "Destination — and every stop between",
                  "Date, plus the return time for round trips",
                  "Headcount and total luggage (bags, gear, coolers count)",
                  "Anything special: children, accessibility needs, a late-night return",
                ].map((t) => (
                  <div className="col-md-6" key={t}>
                    <p className="text-muted small mb-0 d-flex align-items-start gap-2">
                      <span className="text-primary fw-bold">✓</span>
                      <span>{t}</span>
                    </p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <a
                  href="/contact/"
                  className="btn btn-primary rounded-pill px-4 py-2 fw-bold"
                  data-pickup={pickup}
                  data-source="booking-process"
                  rel="nofollow"
                >
                  REQUEST A QUOTE
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
