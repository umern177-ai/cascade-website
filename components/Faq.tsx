"use client";

// FAQ accordion — same look as the live Bootstrap accordion, implemented with
// plain React state (no Bootstrap JS needed). One accordion open at a time,
// like data-bs-parent on the live site.
import { useState } from "react";
import type { Faq } from "@/lib/site-data";

export default function FaqAccordion({ faqs, idPrefix }: { faqs: Faq[]; idPrefix: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="accordion accordion-flush shadow-sm rounded-4 overflow-hidden border" id={`${idPrefix}-accordion`}>
      {faqs.map((f, i) => {
        const open = openIndex === i;
        return (
          <div className="accordion-item border-bottom" key={i}>
            <h3 className="accordion-header" id={`${idPrefix}-heading-${i}`}>
              <button
                type="button"
                className={`accordion-button fw-bold text-dark py-3 px-4 ${open ? "" : "collapsed"}`}
                aria-expanded={open}
                aria-controls={`${idPrefix}-collapse-${i}`}
                onClick={() => setOpenIndex(open ? null : i)}
              >
                {f.q}
              </button>
            </h3>
            <div
              id={`${idPrefix}-collapse-${i}`}
              className={`accordion-collapse collapse ${open ? "show" : ""}`}
              aria-labelledby={`${idPrefix}-heading-${i}`}
              role="region"
            >
              <div className="accordion-body text-muted px-4 pb-4 pt-0 lh-relaxed">{f.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
