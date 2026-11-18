// Coverage map — client component so the ~350 KB Google Maps embed loads only
// when the visitor clicks (performance audit fix 4, Nov 18).
"use client";
import { useState } from "react";

export default function MapEmbed() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="rounded-5 overflow-hidden shadow-sm border position-relative" style={{ height: 450, background: "linear-gradient(140deg,#1e2126,#0f1115)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14 }}>
      {loaded ? (
        <iframe
          title="Google Map of New York — Cascade Charter Bus headquarters"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2528000654!2d-74.11976373966282!3d40.69766374859258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1689000000000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0, position: "absolute", inset: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <>
          <button type="button" onClick={() => setLoaded(true)} className="pp-btn pp-btn-amber" data-source="contact-map" style={{ cursor: "pointer" }}>
            Load the coverage map
          </button>
          <p className="mb-0 small" style={{ color: "#a9b0c2", padding: "0 24px", textAlign: "center" }}>
            Dispatches from Ozone Park, NY across all 50 states — the map loads on click.
          </p>
        </>
      )}
    </div>
  );
}
