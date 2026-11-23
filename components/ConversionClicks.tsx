"use client";

// Click conversion events for GA4/GTM (consultant checklist #17): phone taps,
// email clicks and BOOK NOW / quote CTAs push generate_lead events into the
// dataLayer the GTM snippet creates. Renders nothing.
import { useEffect } from "react";

export default function ConversionClicks(): null {
  useEffect(() => {
    function onClick(e: MouseEvent): void {
      const link = (e.target as HTMLElement | null)?.closest?.("a, button") as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href") || "";
      const isTel = href.startsWith("tel:");
      const isMail = href.startsWith("mailto:");
      const isQuote = link.hasAttribute("data-source") && /quote|contact/i.test(link.getAttribute("data-source") ?? "" + href + link.textContent);
      if (!isTel && !isMail && !isQuote) return;
      const dl = (window as unknown as { dataLayer?: object[] }).dataLayer;
      if (!Array.isArray(dl)) return;
      dl.push({
        event: isTel ? "click_phone" : isMail ? "click_email" : "cta_quote_click",
        cta_text: (link.textContent || "").trim().slice(0, 60),
        page_path: window.location.pathname,
      });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
