"use client";

// Booking form — rebuilt exactly from docs/live-reference/html/contact-booking-form.html:
// same fields, same order, same labels, same placeholders, same look (Rule R3).
// Hidden fixes (brief 7.9): pill toggles are real radio inputs, labels are linked
// to fields, trip date can't be in the past, pickup pre-fills from a city button
// or city page (sessionStorage.pickup, set in Phase 4), honeypot + time-trap.
import { useEffect, useRef, useState } from "react";
import { Repeat, MapPin, Clock, MapPinned, Calendar, Users, Send } from "lucide-react";

const tripTypes = ["One Way", "Round Trip", "Multi-Day"] as const;
const categories = ["Corporate", "Wedding", "Sports", "Tour", "Event"] as const;

function pill(label: string) {
  return "position-absolute top-50 start-0 translate-middle-y w-100 h-100 opacity-0";
}

export default function QuoteForm() {
  const [tripType, setTripType] = useState<(typeof tripTypes)[number]>("One Way");
  const [category, setCategory] = useState<(typeof categories)[number]>("Corporate");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const mountedAt = useRef<number>(0);
  useEffect(() => { mountedAt.current = Date.now(); }, []);
  // Pick-Up Location pre-fill (brief 7.7): a state-page city button or city page
  // saves "pickup" in sessionStorage; on mount we copy it into the input.
  // Set via the DOM (not state) because it synchronizes an external system.
  const pickupRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    try {
      const v = sessionStorage.getItem("pickup");
      if (v && pickupRef.current && !pickupRef.current.value) pickupRef.current.value = v;
    } catch {
      /* storage unavailable — form still works */
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("tripType", tripType);
    fd.set("category", category);
    // honeypot + time trap
    if ((fd.get("company") as string) || Date.now() - mountedAt.current < 2000) return;
    fd.delete("company");
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/quote/", { method: "POST", body: fd });
      if (res.ok) {
        setStatus("ok");
        form.reset();
      } else {
        const j = await res.json().catch(() => ({}));
        setErrorMsg(j.error || "Something went wrong. Please try again or call us.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network problem—please try again or call us.");
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="p-4 p-md-5 bg-white text-center">
        <h2 className="h3 fw-bold text-dark mb-3">Request received!</h2>
        <p className="text-muted mb-0">
          We got your request—expect a reply in about 15 minutes. Need urgent help?
          Call <a href="tel:+16467050816" className="text-decoration-none fw-bold">+1 (646) 705-0816</a> (24/7 dispatch).
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 p-md-5 bg-white">
      <form onSubmit={onSubmit} noValidate={false}>
        {/* honeypot (hidden from humans) */}
        <div aria-hidden="true" className="d-none">
          <label>Company<input type="text" name="company" tabIndex={-1} autoComplete="off" /></label>
        </div>

        {/* 1. TRIP TYPE */}
        <div className="mb-4">
          <label className="form-label small fw-bold text-muted d-block mb-3">
            <Repeat size={14} aria-hidden="true" /> TRIP TYPE
          </label>
          <div className="d-flex flex-wrap gap-2">
            {tripTypes.map((t) => (
              <label key={t} className="position-relative overflow-hidden" style={{ borderRadius: "50rem" }}>
                <input
                  type="radio"
                  name="tripTypeRadio"
                  value={t}
                  checked={tripType === t}
                  onChange={() => setTripType(t)}
                  className={pill(t)}
                  required
                />
                <span className={`btn rounded-pill px-4 py-2 fw-bold transition-all d-block ${tripType === t ? "btn-primary shadow-sm" : "btn-outline-light text-dark border"}`}>
                  {t}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <label htmlFor="fullName" className="form-label small fw-bold text-muted">FULL NAME</label>
            <input id="fullName" name="fullName" type="text" className="form-control bg-light border-0 py-3" required autoComplete="name" />
          </div>
          <div className="col-md-4">
            <label htmlFor="email" className="form-label small fw-bold text-muted">EMAIL</label>
            <input id="email" name="email" type="email" className="form-control bg-light border-0 py-3" required autoComplete="email" />
          </div>
          <div className="col-md-4">
            <label htmlFor="phone" className="form-label small fw-bold text-muted">PHONE NUMBER</label>
            <input id="phone" name="phone" type="tel" className="form-control bg-light border-0 py-3" required autoComplete="tel" />
          </div>
          <div className="col-md-8">
            <label htmlFor="pickupLocation" className="form-label small fw-bold text-muted">
              <MapPin size={14} aria-hidden="true" /> PICK-UP LOCATION
            </label>
            <input
              ref={pickupRef}
              id="pickupLocation"
              name="pickupLocation"
              type="text"
              className="form-control bg-light border-0 py-3"
              placeholder="Address, Airport, or Hotel"
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="pickupTime" className="form-label small fw-bold text-muted">
              <Clock size={14} aria-hidden="true" /> PICK-UP TIME
            </label>
            <input id="pickupTime" name="pickupTime" type="time" className="form-control bg-light border-0 py-3" required />
          </div>
          <div className="col-md-12">
            <label htmlFor="dropoff" className="form-label small fw-bold text-muted">
              <MapPin size={14} aria-hidden="true" /> DESTINATION / DROP-OFF ADDRESS
            </label>
            <input id="dropoff" name="dropoff" type="text" className="form-control bg-light border-0 py-3" placeholder="Drop-off Address or Venue" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="dropoffTime" className="form-label small fw-bold text-muted">
              <Clock size={14} aria-hidden="true" /> INITIAL DROP-OFF TIME
            </label>
            <input id="dropoffTime" name="dropoffTime" type="time" className="form-control bg-light border-0 py-3" required />
          </div>
          <div className="col-12">
            <label htmlFor="stops" className="form-label small fw-bold text-muted">
              <MapPinned size={14} aria-hidden="true" /> INTERMEDIATE STOPS (IF ANY)
            </label>
            <input id="stops" name="stops" type="text" className="form-control bg-light border-0 py-3" placeholder="e.g. Stop at rest area, via 5th Ave..." />
          </div>
          <div className="col-md-6">
            <label htmlFor="tripDate" className="form-label small fw-bold text-muted">
              <Calendar size={14} aria-hidden="true" /> TRIP DATE
            </label>
            <input id="tripDate" name="tripDate" type="date" min={new Date().toISOString().slice(0, 10)} className="form-control bg-light border-0 py-3" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="passengers" className="form-label small fw-bold text-muted">
              <Users size={14} aria-hidden="true" /> PASSENGER COUNT
            </label>
            <input id="passengers" name="passengers" type="number" min={1} className="form-control bg-light border-0 py-3" placeholder="Total count" required />
          </div>
        </div>

        {/* 12. SERVICE CATEGORY */}
        <div className="mb-4">
          <label className="form-label small fw-bold text-muted d-block mb-3">SERVICE CATEGORY</label>
          <div className="d-flex flex-wrap gap-2">
            {categories.map((c) => (
              <label key={c} className="position-relative overflow-hidden" style={{ borderRadius: "50rem" }}>
                <input
                  type="radio"
                  name="categoryRadio"
                  value={c}
                  checked={category === c}
                  onChange={() => setCategory(c)}
                  className={pill(c)}
                  required
                />
                <span className={`btn rounded-pill px-4 py-2 fw-bold transition-all d-block ${category === c ? "btn-primary shadow-sm" : "btn-outline-light text-dark border"}`}>
                  {c}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 13. ADDITIONAL DETAILS */}
        <div className="mb-4">
          <label htmlFor="details" className="form-label small fw-bold text-muted">ADDITIONAL DETAILS (LUGGAGE, SPECIAL NEEDS)</label>
          <textarea id="details" name="details" rows={3} className="form-control bg-light border-0 py-3" placeholder="Tell us about special requirements..." />
        </div>

        {status === "error" && (
          <p className="text-danger small fw-semibold" role="alert">{errorMsg}</p>
        )}

        <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill fw-bold py-3 shadow-lg d-flex align-items-center justify-content-center gap-3" disabled={status === "sending"}>
          <Send size={20} aria-hidden="true" /> {status === "sending" ? "SENDING..." : "REQUEST BOOKING QUOTE"}
        </button>
      </form>
    </div>
  );
}
