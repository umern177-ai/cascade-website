"use client";

// The per-page editor body: groups of every content field (built by
// lib/admin/page-fields.ts) + the FAQ list. Saves through /api/admin/page-body.
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FieldGroup, Faq } from "@/lib/admin/page-fields";

export default function PageBodyEditor({
  path,
  groups,
  faqs,
  saved,
}: {
  path: string;
  groups: FieldGroup[];
  faqs: Faq[];
  saved?: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(groups.flatMap((g) => g.fields).map((f) => [f.key, f.value]))
  );
  const [faq, setFaq] = useState<Faq[]>(faqs);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const dirty = JSON.stringify(values) !== JSON.stringify(groups.flatMap((g) => g.fields).map((f) => [f.key, f.value]));

  async function onSave(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setState("saving");
    setError(null);
    try {
      const res = await fetch("/api/admin/page-body", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, fields: values, faq }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) {
        setError(j.error === "not-authenticated" ? "Session expired — reload and log in again." : j.error || "Save failed.");
        setState("idle");
        return;
      }
      setState("saved");
      router.refresh();
    } catch { setError("Save failed — try again."); setState("idle"); }
  }

  const faqMeaningful = faq.some((f) => f.q.trim() || f.a.trim());

  return (
    <form onSubmit={onSave} className="adm-form">
      {state === "saved" && <div className="adm-alert">Saved — this page was re-validated and shows the new copy.</div>}
      {error && <div className="adm-alert adm-alert-err">{error}</div>}

      {groups.map((g) => (
        <div className="adm-panel" key={g.heading}>
          <h2>{g.heading}</h2>
          {g.fields.map((f) => (
            <div key={f.key}>
              <label className="adm-label" htmlFor={"f:" + f.key}>{f.label}</label>
              {f.kind === "textarea" ? (
                <textarea
                  id={"f:" + f.key}
                  className="adm-input"
                  rows={3}
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                />
              ) : (
                <input
                  id={"f:" + f.key}
                  className="adm-input"
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                />
              )}
            </div>
          ))}
        </div>
      ))}

      {faq.length > 0 && (
        <div className="adm-panel">
          <h2>FAQ list</h2>
          <p className="adm-hint">Shown in the page FAQ section and the FAQPage schema. Add up to five questions; empty rows are dropped on save.</p>
          {faq.map((f, i) => (
            <div className="adm-faqrow" key={i}>
              <label className="adm-label">Q{i + 1}</label>
              <input
                className="adm-input"
                value={f.q}
                onChange={(e) => setFaq((arr) => arr.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))}
              />
              <label className="adm-label">Answer</label>
              <textarea
                className="adm-input"
                rows={2}
                value={f.a}
                onChange={(e) => setFaq((arr) => arr.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))}
              />
            </div>
          ))}
        </div>
      )}

      <div className="adm-actionsbar">
        <button className="adm-btn adm-btn-primary" type="submit" disabled={state === "saving"}>
          {state === "saving" ? "Saving…" : "Save all content"}
        </button>
        {dirty && <span className="adm-chip" style={{ marginLeft: 10 }}>unsaved changes</span>}
        {state === "saved" && faqMeaningful === false && Object.keys(values).length === 0 && (
          <span className="adm-hint">Everything cleared — the page falls back to its built-in copy.</span>
        )}
      </div>
    </form>
  );
}
