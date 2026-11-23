"use client";

// CSV import control for the redirect manager (must be a client component —
// server components can't carry event handlers; that was the 500).
import { useState } from "react";

export default function RedirectImport() {
  const [busy, setBusy] = useState(false);
  return (
    <label className="adm-btn" style={{ position: "relative" }}>
      {busy ? "Importing…" : "Import CSV"}
      <input
        type="file"
        accept=".csv,text/csv"
        style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          try {
            const text = await file.text();
            const res = await fetch("/api/admin/redirects", { method: "POST", body: text, headers: { "Content-Type": "text/csv" } });
            const j = await res.json();
            if (j.ok) window.location.assign("/admin/redirects?imported=" + j.added);
            else alert(j.error || "Import failed.");
          } catch {
            alert("Import failed — check the CSV format.");
          }
          setBusy(false);
        }}
      />
    </label>
  );
}
