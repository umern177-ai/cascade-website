"use client";

// One tiny listener for the whole site: any <a data-pickup="City, ST"> saves the
// pickup into sessionStorage on click so /contact/ can pre-fill it (brief 7.7).
// Lets the ~29,000 city buttons be server-rendered (no per-button hydration).
import { useEffect } from "react";

export default function PickupPrefill() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest?.("[data-pickup]") as HTMLElement | null;
      if (!el) return;
      try {
        sessionStorage.setItem("pickup", el.getAttribute("data-pickup") || "");
        sessionStorage.setItem("pickupSource", el.getAttribute("data-source") || "");
      } catch {
        /* storage unavailable — visitor still lands on the booking form */
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
