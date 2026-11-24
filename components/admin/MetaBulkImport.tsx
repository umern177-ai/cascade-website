"use client";
// Meta CSV import (Phase 5): choose file, the server parses it, and the table
// is refreshed — the server API applies the values in one request.
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";

export default function MetaBulkImport() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  async function onFile(file: File): Promise<void> {
    setBusy(true);
    try {
      const text = await file.text();
      const res = await fetch("/api/admin/meta-import", { method: "POST", headers: { "Content-Type": "text/csv" }, body: text });
      const j = await res.json();
      if (j.ok) router.refresh();
    } catch {
      /* keep silent, next render shows the state */
    }
    setBusy(false);
  }

  return (
    <label className="adm-btn">
      <Upload size={13} style={{ display: "inline", verticalAlign: -2 }} /> {busy ? "Importing…" : "Import CSV"}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <input ref={ref} type="file" accept=".csv" hidden onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
    </label>
  );
}
