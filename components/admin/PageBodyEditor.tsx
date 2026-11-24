"use client";

// The per-page editor body (Admin Panel Upgrade Phase 3):
// Save & publish + Save Draft + Preview link + a History tab listing the
// page's saved versions (restore any of the last 10). Groups still built by
// lib/admin/page-fields.ts; saves through /api/admin/page-body.
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { FieldGroup, Faq } from "@/lib/admin/page-fields";

export type PageVersion = { at: string; by: string; fields?: Record<string, string>; faqs?: Faq[] };

export default function PageBodyEditor({
  path,
  groups,
  faqs,
  saved,
  versions = [],
  hasDraft = false,
}: {
  path: string;
  groups: FieldGroup[];
  faqs: Faq[];
  saved?: boolean;
  versions?: PageVersion[];
  hasDraft?: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"content" | "history">("content");
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(groups.flatMap((g) => g.fields).map((f) => [f.key, f.value]))
  );
  const [faq, setFaq] = useState<Faq[]>(faqs);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [drafting, setDrafting] = useState(false);
  const [restoring, setRestoring] = useState<number | null>(null);
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
      // publishing clears any stored draft for this page
      await fetch("/api/admin/page-drafts?path=" + encodeURIComponent(path), { method: "DELETE" });
      setState("saved");
      router.refresh();
    } catch { setError("Save failed — try again."); setState("idle"); }
  }

  async function onSaveDraft(): Promise<void> {
    setDrafting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/page-drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, fields: values, faq }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error();
      setState("idle");
      router.refresh();
    } catch { setError("Draft save failed — try again."); }
    setDrafting(false);
  }

  async function onRestore(index: number): Promise<void> {
    setRestoring(index);
    setError(null);
    try {
      const res = await fetch("/api/admin/page-body", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, versionIndex: index }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error();
      router.refresh();
    } catch { setError("Restore failed — try again."); }
    setRestoring(null);
  }

  const faqMeaningful = faq.some((f) => f.q.trim() || f.a.trim());

  return (
    <>
      <div className="adm-inline" style={{ marginBottom: 10 }}>
        <button type="button" className={"adm-btn" + (tab === "content" ? " adm-btn-primary" : "")} onClick={() => setTab("content")}>Content</button>
        <button type="button" className={"adm-btn" + (tab === "history" ? " adm-btn-primary" : "")} onClick={() => setTab("history")}>{versions.length > 0 ? `History (${versions.length})` : "History"}</button>
        {hasDraft && <span className="adm-badge-new">draft saved</span>}
      </div>

      {saved && tab === "content" && <div className="adm-alert">Saved — this page was re-validated and shows the new copy.</div>}
      {error && <div className="adm-alert adm-alert-err">{error}</div>}

      <form onSubmit={onSave} className="adm-form" hidden={tab !== "content"}>
        {groups.map((g) => (
          <div className="adm-panel" key={g.heading} style={{ borderTop: "4px solid #f5a002" }}>
            <h2>{g.heading} <span className="adm-hint-inline">section</span></h2>
            {g.fields.map((f) => (
              <div key={f.key}>
                <label className="adm-label" htmlFor={"f:" + f.key}>{f.label}{(f.label.toLowerCase().startsWith("h1") || f.label.toLowerCase().includes("(h1)")) ? <span className="adm-chip" style={{ marginLeft: 6 }}>H1</span> : null}</label>
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
          <div className="adm-panel" style={{ borderTop: "4px solid #f5a002" }}>
            <h2>FAQ list <span className="adm-hint-inline">repeatable — add rows here, remove by clearing</span></h2>
            <p className="adm-hint">Shown in the page FAQ section and the FAQPage schema.</p>
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
            {state === "saving" ? "Publishing…" : "Save & publish"}
          </button>
          <button type="button" className="adm-btn" onClick={onSaveDraft} disabled={drafting}>
            {drafting ? "Saving draft…" : "Save draft"}
          </button>
          {hasDraft && (
            <Link className="adm-btn" href={`/admin/preview/?path=${encodeURIComponent(path)}`} target="_blank">Preview draft</Link>
          )}
          <a className="adm-btn" href={path} target="_blank">View live</a>
          {dirty && <span className="adm-chip" style={{ marginLeft: 10 }}>unsaved changes</span>}
          {state === "saved" && faqMeaningful === false && Object.keys(values).length === 0 && (
            <span className="adm-hint">Everything cleared — the page falls back to its built-in copy.</span>
          )}
        </div>
      </form>

      {tab === "history" && (
        <div className="adm-panel">
          <h2>Page history <span className="adm-hint-inline">last 10 versions, newest first</span></h2>
          {versions.length === 0 ? (
            <p className="adm-hint">No previous versions yet — every publish keeps a version so you can roll back.</p>
          ) : (
            <table className="adm-table">
              <thead><tr><th>Saved</th><th>By</th><th>Fields changed</th><th></th></tr></thead>
              <tbody>
                {versions.map((v, i) => (
                  <tr key={i}>
                    <td className="adm-muted" style={{ whiteSpace: "nowrap" }}>{new Date(v.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</td>
                    <td className="adm-muted">{v.by}</td>
                    <td className="adm-muted" style={{ maxWidth: 420, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {Object.entries(v.fields ?? {}).filter(([, x]) => x).slice(0, 4).map(([k, x]) => { let t = String(x); if (t.length > 46) t = t.slice(0, 46) + "…"; return `${k} → ${t}`; }).join(" · ") || "(FAQs only)"}
                    </td>
                    <td className="adm-row-actions">
                      <button type="button" className="adm-btn" disabled={restoring !== null} onClick={() => onRestore(i)}>{restoring === i ? "Restoring…" : "Restore this version"}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {versions.length > 0 && <p className="adm-hint">"Restore" puts this version live (the current copy is kept as the newest version first, so restoring is reversible).</p>}
        </div>
      )}
    </>
  );
}
