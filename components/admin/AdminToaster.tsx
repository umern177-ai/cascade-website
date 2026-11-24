"use client";

// Toast messages (Phase 7): reads the saved/deleted/duplicated/etc query flags
// and shows a toast top-right, then cleans the URL.
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const MESSAGES: Record<string, string> = {
  saved: "Saved ✓",
  deleted: "Deleted ✓",
  duplicated: "Duplicated — write unique content before publishing ✓",
  added: "Added ✓",
};

export default function AdminToaster() {
  const params = useSearchParams();
  const pathname = usePathname();
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    for (const [k, text] of Object.entries(MESSAGES)) {
      if (params.get(k)) {
        setMsg(text);
        // strip flags from the URL so refresh does not re-toast
        const next = new URLSearchParams(params.toString());
        next.delete(k);
        const qs = next.toString();
        window.history.replaceState(null, "", pathname + (qs ? "?" + qs : ""));
        const t = setTimeout(() => setMsg(null), 3500);
        return () => clearTimeout(t);
      }
    }
  }, [params, pathname]);

  if (!msg) return null;
  return (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, background: "#0f1115", color: "#fff", padding: "12px 18px", borderRadius: 12, boxShadow: "0 12px 30px rgba(0,0,0,.25)", fontWeight: 700, fontSize: 14 }}>
      {msg}
    </div>
  );
}
