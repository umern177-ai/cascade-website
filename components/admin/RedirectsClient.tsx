"use client";

// URL Redirect Manager (client surface). All state is local for instant
// search/filter/sort/page; saves go through server actions and rules apply
// live via proxy.ts. Spec: section 6 of the Redirect Manager brief.
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRightLeft, Pencil, Trash2, X, Download, FileDown, Plus } from "lucide-react";

export type ClientRule = {
  id: string;
  from: string;
  to: string;
  type: number;
  status: "active" | "inactive";
  match?: string;
  note?: string;
  hits?: number;
  last_hit?: string;
  created_at?: string;
  updated_at?: string;
};

const TYPE_CARDS: Array<{ type: number; title: string; sub: string }> = [
  { type: 301, title: "301 Permanent", sub: "SEO value transfers. Browser caches forever." },
  { type: 302, title: "302 Temporary", sub: "No SEO transfer. Not cached by browser." },
  { type: 307, title: "307 Preserve Method", sub: "Temporary, keeps POST as POST." },
  { type: 410, title: "410 Gone", sub: "Page permanently removed. No target needed." },
];

const PAGE_SIZES = [20, 50, 100];

function norm(p: string): string {
  try {
    return decodeURI(p).toLowerCase().replace(/\/+$/, "") || "/";
  } catch {
    return p.toLowerCase().replace(/\/+$/, "") || "/";
  }
}

// tiny CSV parser handling quotes
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else { inQuotes = false; }
      } else cur += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { out.push(cur); cur = ""; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

export default function RedirectsClient({
  rules,
  prefillFrom,
  prefillTo,
}: {
  rules: ClientRule[];
  prefillFrom?: string;
  prefillTo?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortKey, setSortKey] = useState<"created" | "hits">("created");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [pageSize, setPageSize] = useState(20);
  const [page, setPageState] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // popup state
  const [popup, setPopup] = useState<null | { editing: ClientRule | null }>(null);
  const [pFrom, setPFrom] = useState(prefillFrom ?? "");
  const [pTo, setPTo] = useState(prefillTo ?? "");
  const [pType, setPType] = useState(301);
  const [pStatus, setPStatus] = useState<"active" | "inactive">("active");
  const [pNote, setPNote] = useState("");
  const [pSaving, setPSaving] = useState(false);
  const [pError, setPError] = useState<string | null>(null);
  const [pWarnConfirm, setPWarnConfirm] = useState<string[] | null>(null);
  const popupOpen = useRef(false);
  if ((prefillFrom || prefillTo) && !popupOpen.current) {
    popupOpen.current = true;
  }

  // import modal state
  const [importOpen, setImportOpen] = useState(false);
  const [importPhase, setImportPhase] = useState<"pick" | "preview" | "run">("pick");
  const importRows = useRef<Array<{ row: number; source_url: string; target_url: string; redirect_type?: string; status?: string; note?: string }>>([]);
  const [importPreview, setImportPreview] = useState<null | { newCount: number; updateCount: number; skipCount: number; errors: Array<{ row: number; reason: string }> }>(null);
  const [importMode, setImportMode] = useState<"skip" | "overwrite">("skip");
  const [importResult, setImportResult] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // auto-open the popup when ?create= is passed (404 monitor prefill)
  const [autoOpened, setAutoOpened] = useState(false);
  if ((prefillFrom || prefillTo) && !autoOpened) {
    setAutoOpened(true);
    setPopup({ editing: null });
    setPFrom(prefillFrom || "");
    setPTo(prefillTo || "");
    setPType(301);
    setPStatus("active");
    setPNote("");
  }

  const setPage = (p: number) => setPageState(Math.max(1, p));

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let out = rules.filter(
      (r) =>
        (!typeFilter || String(r.type) === typeFilter) &&
        (!statusFilter || r.status === statusFilter) &&
        (!q || `${r.from} ${r.to}`.toLowerCase().includes(q))
    );
    const ka = (r: ClientRule) => (sortKey === "hits" ? r.hits ?? 0 : new Date(r.created_at ?? 0).getTime());
    const kb = (r: ClientRule) => (sortKey === "hits" ? r.hits ?? 0 : new Date(r.created_at ?? 0).getTime());
    out = [...out].sort((a, b) => (sortDir === "asc" ? ka(a) - kb(b) : kb(b) - ka(a)));
    return out;
  }, [rules, query, typeFilter, statusFilter, sortKey, sortDir]);

  const pages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * pageSize, current * pageSize);
  const allOnPageSelected = slice.length > 0 && slice.every((r) => selected.has(r.id));

  function resetFilters(): void {
    setQuery("");
    setTypeFilter("");
    setStatusFilter("");
    setPage(1);
  }

  function openPopup(prefill?: ClientRule): void {
    setPopup({ editing: prefill ?? null });
    setPFrom(prefill?.from ?? "");
    setPTo(prefill?.type === 410 ? "" : prefill?.to ?? "");
    setPType(prefill?.type ?? 301);
    setPStatus(prefill?.status ?? "active");
    setPNote(prefill?.note ?? "");
    setPError(null);
    setPWarnConfirm(null);
  }

  function closePopup(): void {
    setPopup(null);
    setPWarnConfirm(null);
  }

  async function savePopup(ignoreWarnings: boolean): Promise<void> {
    if (!pFrom.startsWith("/")) { setPError("Source must start with / — e.g. /old-about-us"); return; }
    if (pType !== 410 && !pTo.startsWith("/") && !pTo.startsWith("http")) {
      setPError("Target must start with / or be a full https:// link.");
      return;
    }
    setPSaving(true);
    setPError(null);
    try {
      const res = await fetch("/api/admin/redirect-upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: popup?.editing?.id,
          from: pFrom,
          to: pType === 410 ? "" : pTo,
          type: pType,
          status: pStatus,
          note: pNote,
          force: ignoreWarnings,
        }),
      });
      const j = await res.json();
      if (j.ok) {
        closePopup();
        setNotice(popup?.editing ? "Changes saved — live immediately ✓" : "Redirect created — live immediately ✓");
        router.refresh();
      } else if (j.warnings && j.warnings.length) {
        setPWarnConfirm(j.warnings as string[]);
      } else {
        setPError(j.error || "Save failed.");
      }
    } catch {
      setPError("Save failed — check your connection.");
    }
    setPSaving(false);
  }

  async function del(rule: ClientRule): Promise<void> {
    if (!window.confirm(`Are you sure you want to delete the rule for ${norm(rule.from)}?`)) return;
    setBusy(true);
    await fetch("/api/admin/redirect-del", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: rule.id }),
    });
    setSelected((s) => { const n = new Set(s); n.delete(rule.id); return n; });
    setNotice("Redirect deleted ✓");
    setBusy(false);
    router.refresh();
  }

  async function bulk(action: "activate" | "deactivate" | "delete"): Promise<void> {
    if (action === "delete" && !window.confirm(`Are you sure you want to ${action} the ${selected.size} selected rule(s)?`)) return;
    setBusy(true);
    await fetch("/api/admin/redirect-bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [...selected], action }),
    });
    setSelected(new Set());
    setNotice(`${action} applied to ${selected.size} rule(s) ✓`);
    setBusy(false);
    router.refresh();
  }

  // ---- CSV export respecting current filters/sort ----
  function exportCsv(): void {
    const NL = String.fromCharCode(10);
    const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const header = "source_url,target_url,redirect_type,status,note,hits,created_at";
    const lines = filtered.map((r) =>
      [r.from, r.type === 410 ? "" : r.to, r.type, r.status, r.note ?? "", r.hits ?? 0, r.created_at ?? ""].map(cell).join(",")
    );
    const blob = new Blob([header + NL + lines.join(NL)], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "redirects.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function downloadTemplate(): void {
    const NL = String.fromCharCode(10);
    const body = [
      "source_url,target_url,redirect_type,status,note",
      '"/old-about-us","/about/",301,active,"Example: permanent move"',
      '"/old-promo/","https://partner-site.com/page",302,active,"Example: temporary external link"',
    ].join(NL);
    const blob = new Blob([body], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "redirect-import-template.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // ---- import: pick file -> preview -> batched apply ----
  async function onCsvPicked(file: File): Promise<void> {
    setError(null);
    setImportResult(null);
    if (!/\.csv$/i.test(file.name)) { setError("CSV only."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Max 5MB."); return; }
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    const start = /^"?source_url"?/i.test(lines[0] ?? "") ? 1 : 0;
    const rows: typeof importRows.current = [];
    for (let i = start; i < lines.length; i++) {
      const cols = parseCsvLine(lines[i]);
      const source = (cols[0] ?? "").trim();
      if (!source) continue;
      rows.push({
        row: i + 1,
        source_url: source,
        target_url: (cols[1] ?? "").trim(),
        redirect_type: (cols[2] ?? "").trim(),
        status: (cols[3] ?? "").trim(),
        note: (cols[4] ?? "").trim(),
      });
    }
    if (rows.length === 0) { setError("No data rows found."); return; }
    importRows.current = rows;
    setImportOpen(true);
    setImportPhase("preview");
    setImportPreview(null);
    try {
      const res = await fetch("/api/admin/redirect-import-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: rows.slice(0, 5000), existingMode: importMode }),
      });
      const j = await res.json();
      setImportPreview(j);
    } catch { setError("Preview failed."); setImportPhase("pick"); }
  }

  async function runImport(): Promise<void> {
    setImportPhase("run");
    const chunkSize = 500;
    const rows = importRows.current;
    let imported = 0, updated = 0, skipped = 0;
    const errors: Array<{ row: number; reason: string }> = [];
    for (let i = 0; i < rows.length; i += chunkSize) {
      try {
        const res = await fetch("/api/admin/redirect-import-apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rows: rows.slice(i, i + chunkSize), existingMode: importMode }),
        });
        const j = await res.json();
        imported += j.imported ?? 0;
        updated += j.updated ?? 0;
        skipped += j.skipped ?? 0;
        if (j.errors) errors.push(...j.errors);
      } catch {
        errors.push({ row: i + 1, reason: "chunk failed — check connection" });
      }
    }
    setImportResult(`✅ Done: ${imported} imported, ${updated} updated, ${skipped} skipped` + (errors.length ? ` — ${errors.length} with issues (listed below)` : ""));
    setImportPreview({ newCount: imported, updateCount: updated, skipCount: skipped, errors });
  }

  return (
    <>
      {notice && <div className="adm-alert">{notice}</div>}
      {error && <div className="adm-alert adm-alert-err">{error}</div>}

      {/* ===== 7 summary cards ===== */}
      <div className="adm-panel" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, textAlign: "center" }}>
        {[
          ["Total rules", rules.length],
          ["Active", rules.filter((r) => r.status === "active").length],
          ["Inactive", rules.filter((r) => r.status === "inactive").length],
          ["Total hits", rules.reduce((n, r) => n + (r.hits ?? 0), 0)],
          ["301 permanent", rules.filter((r) => r.type === 301).length],
          ["302 temporary", rules.filter((r) => r.type === 302).length],
          ["410 gone", rules.filter((r) => r.type === 410).length],
        ].map(([label, value]) => (
          <div key={String(label)} style={{ padding: "10px 6px", background: "#f5f6f8", borderRadius: 12 }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{value}</div>
            <span className="adm-hint">{label}</span>
          </div>
        ))}
      </div>

      {/* ===== buttons + filters ===== */}
      <div className="adm-panel" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <Link className="adm-btn" href="/admin/404s">404 monitor →</Link>
        <Link className="adm-btn" href="/admin/redirects/map">Launch redirect map →</Link>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className="adm-btn" type="button" onClick={exportCsv} title="Downloads the current filtered/sorted list"><Download size={13} style={{ display: "inline", verticalAlign: -2 }} /> Export CSV</button>
          <button className="adm-btn" type="button" onClick={() => { setImportOpen(true); setImportPhase("pick"); setImportResult(null); setImportPreview(null); }}><FileDown size={13} style={{ display: "inline", verticalAlign: -2 }} /> Bulk import (CSV)</button>
          <button className="adm-btn adm-btn-primary" type="button" onClick={() => openPopup()}><Plus size={13} style={{ display: "inline", verticalAlign: -2 }} /> Add redirect</button>
        </div>
      </div>

      <div className="adm-panel" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <input className="adm-input" style={{ width: 260, paddingRight: 26 }} value={query} placeholder="Search source or target…" onChange={(e) => { setQuery(e.target.value); setPage(1); }} />
          {query && <button type="button" onClick={() => setQuery("")} style={{ position: "absolute", right: 6, top: 5, background: "transparent", border: 0, cursor: "pointer", fontWeight: 800 }} aria-label="Clear search"><X size={14} /></button>}
        </div>
        <div style={{ position: "relative" }}>
          <select className="adm-input" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
            <option value="">All types</option><option value="301">301</option><option value="302">302</option><option value="307">307</option><option value="410">410</option>
          </select>
          {typeFilter && <button type="button" onClick={() => setTypeFilter("")} style={{ position: "absolute", right: -10, top: -8, background: "#fff", border: "1px solid #ddd", borderRadius: "50%", width: 18, height: 18, cursor: "pointer", fontSize: 10, lineHeight: 1 }} aria-label="Clear type filter"><X size={9} /></button>}
        </div>
        <div style={{ position: "relative" }}>
          <select className="adm-input" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option>
          </select>
          {statusFilter && <button type="button" onClick={() => setStatusFilter("")} style={{ position: "absolute", right: -10, top: -8, background: "#fff", border: "1px solid #ddd", borderRadius: "50%", width: 18, height: 18, cursor: "pointer", fontSize: 10, lineHeight: 1 }} aria-label="Clear status filter"><X size={9} /></button>}
        </div>
        <span className="adm-hint"><b>{filtered.length} rules found</b></span>
        {selected.size > 0 && (
          <div className="adm-inline" style={{ marginLeft: "auto", gap: 6 }}>
            <button className="adm-btn" type="button" onClick={() => bulk("activate")} disabled={busy}>Activate ({selected.size})</button>
            <button className="adm-btn" type="button" onClick={() => bulk("deactivate")} disabled={busy}>Deactivate ({selected.size})</button>
            <button className="adm-btn adm-danger" type="button" onClick={() => bulk("delete")} disabled={busy}>Delete selected ({selected.size})</button>
          </div>
        )}
      </div>

      {/* ===== table ===== */}
      <div className="adm-panel">
        <table className="adm-table">
          <thead>
            <tr>
              <th style={{ width: 30 }}>
                <input type="checkbox" checked={allOnPageSelected} onChange={(e) => {
                  const n = new Set(selected);
                  if (e.target.checked) slice.forEach((r) => n.add(r.id));
                  else slice.forEach((r) => n.delete(r.id));
                  setSelected(n);
                }} aria-label="Select all on page" />
              </th>
              <th>Source URL</th><th>Target URL</th><th>Type</th><th>Status</th><th>Hits</th><th>Note</th>
              <th style={{ cursor: "pointer" }} onClick={() => setSortKey("created")} title="Sort by created date">Created {sortKey === "created" ? (sortDir === "desc" ? "↓" : "↑") : "↕"}</th>
              <th style={{ cursor: "pointer" }} onClick={() => setSortKey("hits")} title="Sort by hits">Hits {sortKey === "hits" ? (sortDir === "desc" ? "↓" : "↑") : "↕"}</th>
              <th aria-label="Actions"></th>
            </tr>
          </thead>
          <tbody>
            {slice.map((r) => {
              const badge = r.type === 301 ? { bg: "#e2f2e7", fg: "#1d6b3f" } : r.type === 302 || r.type === 307 ? { bg: "#fff1d6", fg: "#8a5c00" } : { bg: "#fbe3e3", fg: "#952e2e" };
              return (
                <tr key={r.id} style={busy ? { opacity: 0.6 } : undefined}>
                  <td><input type="checkbox" checked={selected.has(r.id)} onChange={(e) => { const n = new Set(selected); if (e.target.checked) n.add(r.id); else n.delete(r.id); setSelected(n); }} aria-label={`Select ${norm(r.from)}`} /></td>
                  <td style={{ maxWidth: 210 }} className="adm-muted"><span style={{ display: "inline-block", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", verticalAlign: "bottom" }} title={norm(r.from)}>{norm(r.from)}</span></td>
                  <td style={{ maxWidth: 210 }} className="adm-muted"><span style={{ display: "inline-block", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", verticalAlign: "bottom" }} title={norm(r.to)}>{r.type === 410 ? <em>gone</em> : norm(r.to)}</span></td>
                  <td><span className="adm-chip" style={{ background: badge.bg, color: badge.fg, margin: 0 }}>{r.type}</span></td>
                  <td>
                    <button className="adm-chip" style={r.status === "active" ? { background: "#e2f2e7", color: "#1d6b3f", margin: 0, cursor: "pointer", border: 0 } : { background: "#e8e8ec", color: "#6a7180", margin: 0, cursor: "pointer", border: 0 }} title="Click to toggle active/inactive — saves instantly" onClick={async () => {
                      setBusy(true);
                      await fetch("/api/admin/redirect-upsert", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: r.id, from: r.from, to: r.type === 410 ? "" : r.to, type: r.type, status: r.status, note: r.note, force: true }) });
                      setBusy(false);
                      router.refresh();
                    }}>{r.status}</button>
                  </td>
                  <td className="adm-muted">{r.hits ?? 0}</td>
                  <td style={{ maxWidth: 170 }} className="adm-muted"><span style={{ display: "inline-block", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", verticalAlign: "bottom" }} title={r.note}>{r.note || "—"}</span></td>
                  <td className="adm-muted" style={{ whiteSpace: "nowrap" }}>{r.created_at ? new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                  <td className="adm-row-actions">
                    <button className="adm-iconbtn" type="button" title="Edit" onClick={() => openPopup(r)}><Pencil size={14} /></button>
                    <button className="adm-iconbtn adm-danger" type="button" title="Delete" onClick={() => del(r)}><Trash2 size={14} /></button>
                  </td>
                </tr>
              );
            })}
            {slice.length === 0 && <tr><td colSpan={10}><p className="adm-hint">No rules match the filters.</p></td></tr>}
          </tbody>
        </table>

        {/* pagination */}
        <div className="adm-inline" style={{ marginTop: 14, flexWrap: "wrap" }}>
          <span className="adm-hint">{`Showing ${(current - 1) * pageSize + 1}–${Math.min(current * pageSize, filtered.length)} of ${filtered.length}`}</span>
          <button className="adm-btn" onClick={() => setPage(1)} disabled={current === 1}>« First</button>
          <button className="adm-btn" onClick={() => setPage(current - 1)} disabled={current <= 1}>‹ Prev</button>
          {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
            const p = Math.max(1, Math.min(pages - 4, current - 2)) + i;
            if (p > pages) return null;
            return <button key={p} className={"adm-btn" + (p === current ? " adm-btn-primary" : "")} onClick={() => setPage(p)}>{p}</button>;
          })}
          <button className="adm-btn" onClick={() => setPage(current + 1)} disabled={current >= pages}>Next ›</button>
          <button className="adm-btn" onClick={() => setPage(pages)} disabled={current === pages}>Last »</button>
          <span className="adm-hint">Go to:</span>
          <input className="adm-input" type="number" min={1} max={pages} style={{ width: 64 }} placeholder={String(current)} onKeyDown={(e) => { if (e.key === "Enter") setPage(Number((e.target as HTMLInputElement).value) || 1); }} />
          {PAGE_SIZES.map((n) => (
            <button key={n} className={"adm-btn" + (pageSize === n ? " adm-btn-primary" : "")} onClick={() => { setPageSize(n); setPage(1); }}>{n} / page</button>
          ))}
        </div>
      </div>

      {/* ===== add/edit popup ===== */}
      {popup && (
        <div className="adm-picker-overlay" onClick={closePopup}>
          <div className="adm-picker" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <h3>{popup.editing ? "Edit redirect" : "Add redirect"}</h3>
            <p className="adm-hint">Saved with Active status = live within seconds (runtime proxy, no build).</p>
            {pError && <div className="adm-alert adm-alert-err">{pError}</div>}
            <label className="adm-label">Source URL</label>
            <input className="adm-input" value={pFrom} onChange={(e) => setPFrom(e.target.value)} placeholder="/old-page-path" />
            <p className="adm-hint">Must start with / — e.g. /old-about-us</p>
            {pType !== 410 && (
              <>
                <label className="adm-label">Target URL</label>
                <input className="adm-input" value={pTo} onChange={(e) => setPTo(e.target.value)} placeholder="/new-page or https://external.com/page" />
              </>
            )}
            <label className="adm-label">Redirect type</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {TYPE_CARDS.map((c) => (
                <button key={c.type} type="button" onClick={() => setPType(c.type)} style={{ border: pType === c.type ? "2px solid #f5a002" : "1px solid #ddd", background: pType === c.type ? "#fff9ec" : "#fff", borderRadius: 12, padding: "10px 12px", textAlign: "left", cursor: "pointer" }}>
                  <b>{c.title}</b>
                  <div style={{ fontSize: 11.5, color: "#6a7180" }}>{c.sub}</div>
                </button>
              ))}
            </div>
            <label className="adm-label" style={{ marginTop: 10 }}>Status</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button type="button" onClick={() => setPStatus("active")} style={{ border: pStatus === "active" ? "2px solid #1d6b3f" : "1px solid #ddd", background: pStatus === "active" ? "#e2f2e7" : "#fff", borderRadius: 12, padding: "10px 12px", textAlign: "left", cursor: "pointer" }}>
                <b>Active</b><div style={{ fontSize: 11.5, color: "#6a7180" }}>Applied right away</div>
              </button>
              <button type="button" onClick={() => setPStatus("inactive")} style={{ border: pStatus === "inactive" ? "2px solid #6a7180" : "1px solid #ddd", background: pStatus === "inactive" ? "#eee" : "#fff", borderRadius: 12, padding: "10px 12px", textAlign: "left", cursor: "pointer" }}>
                <b>Inactive</b><div style={{ fontSize: 11.5, color: "#6a7180" }}>Saved, not applied</div>
              </button>
            </div>
            <label className="adm-label" style={{ marginTop: 10 }}>Note (optional)</label>
            <input className="adm-input" value={pNote} onChange={(e) => setPNote(e.target.value)} placeholder="404 Pages Search Console" />
            {pWarnConfirm && (
              <div className="adm-alert" style={{ marginTop: 10 }}>
                <b>Heads up:</b>
                <ul style={{ margin: "6px 0 10px 16px", fontSize: 13 }}>
                  {pWarnConfirm.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
                <button type="button" className="adm-btn adm-btn-primary" onClick={() => savePopup(true)}>Save anyway</button>
              </div>
            )}
            <div className="adm-inline" style={{ marginTop: 14, justifyContent: "space-between" }}>
              <span className="adm-hint">{pStatus === "active" ? "⚡ Will go live immediately" : "Saved as inactive — not applied"}</span>
              <div>
                <button type="button" className="adm-btn" onClick={closePopup}>Cancel</button>
                <button type="button" className="adm-btn adm-btn-primary" disabled={pSaving} onClick={() => savePopup(false)}>{pSaving ? "Saving…" : popup.editing ? "Save Changes" : "Create Redirect"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== import modal ===== */}
      {importOpen && (
        <div className="adm-picker-overlay" onClick={() => setImportOpen(false)}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, maxWidth: 560, maxHeight: "85vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            <h3>Bulk Import Redirects (CSV)</h3>
            <div style={{ background: "#f5f6f8", borderRadius: 10, padding: 12, margin: "10px 0", fontSize: 13 }}>
              Columns: <code>source_url, target_url, redirect_type, status, note</code>
              <button type="button" className="adm-btn" style={{ margin: 0, marginLeft: 10, fontSize: 12 }} onClick={downloadTemplate}><FileDown size={12} style={{ display: "inline", verticalAlign: -2 }} /> Download Template</button>
            </div>
            {importPhase === "pick" && (
              <div style={{ border: "2px dashed #ccc", borderRadius: 12, padding: 26, textAlign: "center", cursor: "pointer" }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) void onCsvPicked(f); }} onClick={() => fileRef.current?.click()}>
                <ArrowRightLeft size={26} style={{ color: "#f5a002" }} aria-hidden="true" />
                <div className="fw-bold">Drag &amp; drop CSV here, or click to browse</div>
                <div className="adm-hint">CSV only · max 5MB</div>
                <input ref={fileRef} type="file" accept=".csv" hidden onChange={(e) => e.target.files?.[0] && onCsvPicked(e.target.files[0])} />
              </div>
            )}
            {importPhase === "preview" && importPreview && (
              <>
                <div className="adm-inline" style={{ margin: "10px 0" }}>
                  <span className="adm-chip adm-chip-ok">{importPreview.newCount} new</span>
                  <span className="adm-chip" style={{ background: "#fff1d6", color: "#8a5c00" }}>{importPreview.updateCount} will update</span>
                  <span className="adm-chip" style={{ background: "#eee" }}>{importPreview.skipCount} skipped</span>
                  <span className="adm-chip" style={{ background: importPreview.errors.length ? "#fbe3e3" : "#e2f2e7", color: importPreview.errors.length ? "#952e2e" : "#1d6b3f" }}>{importPreview.errors.length} errors</span>
                </div>
                {importPreview.errors.length > 0 && (
                  <div style={{ maxHeight: 220, overflow: "auto", border: "1px solid #eee", borderRadius: 10, padding: 10 }}>
                    {importPreview.errors.map((e, i) => (
                      <div key={i} style={{ fontSize: 12.5, padding: "4px 0", borderBottom: "1px solid #f2f2f2" }}>
                        <b>Row {e.row}</b> — {e.reason}
                      </div>
                    ))}
                  </div>
                )}
                <label className="adm-label" style={{ marginTop: 10 }}>If source already exists:</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <button type="button" onClick={() => setImportMode("skip")} style={{ border: importMode === "skip" ? "2px solid #f5a002" : "1px solid #ddd", borderRadius: 10, padding: 8, cursor: "pointer", background: importMode === "skip" ? "#fff9ec" : "#fff" }}><b>Skip</b></button>
                  <button type="button" onClick={() => setImportMode("overwrite")} style={{ border: importMode === "overwrite" ? "2px solid #f5a002" : "1px solid #ddd", borderRadius: 10, padding: 8, cursor: "pointer", background: importMode === "overwrite" ? "#fff9ec" : "#fff" }}><b>Overwrite</b></button>
                </div>
                <div className="adm-inline" style={{ marginTop: 12, justifyContent: "flex-end" }}>
                  <button className="adm-btn" type="button" onClick={() => setImportPhase("pick")}>Back</button>
                  <button className="adm-btn adm-btn-primary" type="button" disabled={importPreview.newCount + importPreview.updateCount === 0} onClick={runImport} style={{ opacity: importPreview.newCount + importPreview.updateCount === 0 ? 0.5 : 1 }}>Import</button>
                </div>
              </>
            )}
            {importPhase === "run" && <p className="adm-hint" style={{ margin: "20px 0", fontSize: 14 }}>Importing in batches of 500… hang tight (5,000+ rows work).</p>}
            {importResult && (
              <>
                <div className="adm-alert" style={{ margin: "10px 0" }}>{importResult}</div>
                <button className="adm-btn adm-btn-primary" type="button" onClick={() => { setImportOpen(false); setImportPhase("pick"); setImportResult(null); }}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
