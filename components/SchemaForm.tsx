"use client";

// Schema & tracking form (sitewide).
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SchemaForm({
  initial,
}: {
  initial: { customSchema: string; headHtml: string; gaMeasurementId: string; clarityId: string };
}) {
  const router = useRouter();
  const [customSchema, setCustomSchema] = useState(initial.customSchema);
  const [headHtml, setHeadHtml] = useState(initial.headHtml);
  const [ga, setGa] = useState(initial.gaMeasurementId);
  const [clarity, setClarity] = useState(initial.clarityId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSave(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setSaving(true);
    setError(null);
    if (customSchema.trim()) {
      try { JSON.parse(customSchema); } catch {
        setError("Schema is not valid JSON-LD — fix the JSON before saving.");
        setSaving(false);
        return;
      }
    }
    try {
      const res = await fetch("/api/admin/seo-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customSchema, headHtml, gaMeasurementId: ga, clarityId: clarity }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) { setError(j.error || "Save failed."); setSaving(false); return; }
      setOk(true);
      router.refresh();
    } catch { setError("Save failed — try again."); }
    setSaving(false);
  }

  return (
    <form onSubmit={onSave} className="adm-form">
      <div className="adm-panel">
        <h2>Sitewide schema (JSON-LD)</h2>
        <p className="adm-hint">
          A single JSON-LD object (or @graph). Injected into every page&apos;s &lt;head&gt; after the built-in
          blocks — validated before saving. Tip: reference the built-in Organization via {"\"@id\": \"https://cascadecharterbus.com/#organization\""} to avoid duplicates.
        </p>
        <textarea className="adm-editor" rows={10} value={customSchema} onChange={(e) => setCustomSchema(e.target.value)} placeholder='{ "@context": "https://schema.org", "@type": "…" }' />
      </div>

      <div className="adm-grid2">
        <div className="adm-panel">
          <h2>Google Analytics 4</h2>
          <label className="adm-label" htmlFor="ga">Measurement ID (G-…)</label>
          <input id="ga" className="adm-input" value={ga} onChange={(e) => setGa(e.target.value)} placeholder="G-XXXXXXX" />
          <p className="adm-hint">Loaded through GTM as well — set the ID for a direct tag.</p>
        </div>
        <div className="adm-panel">
          <h2>Microsoft Clarity</h2>
          <label className="adm-label" htmlFor="clarity">Project ID</label>
          <input id="clarity" className="adm-input" value={clarity} onChange={(e) => setClarity(e.target.value)} placeholder="clarity project id" />
        </div>
      </div>

      <div className="adm-panel">
        <h2>Custom &lt;head&gt; code</h2>
        <p className="adm-hint">Verification tags, extra trackers, anything that belongs in &lt;head&gt; — injected sitewide, no code deployment. No &lt;script&gt; opening/closing tags needed.</p>
        <textarea className="adm-editor" rows={5} value={headHtml} onChange={(e) => setHeadHtml(e.target.value)} placeholder={'<meta name="…" content="…" />'} />
      </div>

      {ok && <div className="adm-alert">Saved — live sitewide.</div>}
      {error && <div className="adm-alert adm-alert-err">{error}</div>}
      <div className="adm-actionsbar">
        <button className="adm-btn adm-btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save sitewide settings"}</button>
      </div>
    </form>
  );
}
