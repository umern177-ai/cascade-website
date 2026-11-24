// Redirect manager — full upgrade (Admin Panel Upgrade Phase 4, section 6.4):
// summary cards, live-applied rules (the runtime engine in proxy.ts applies
// saved settings in seconds), active/inactive toggles, hits, 410 type, test
// tool, CSV export/import, and the Launch-redirect-map tool.
import Link from "next/link";
import { listRules, RuntimeRule } from "@/lib/admin/redirect-engine";

import { ArrowRightLeft, Trash2, RefreshCw } from "lucide-react";
import RedirectImport from "@/components/RedirectImport";
import { saveRuleAction, toggleRuleAction, deleteRuleAction } from "./actions";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<number, string> = { 301: "301 permanent", 302: "302 temp", 307: "307 temp", 410: "410 gone" };

export default async function AdminRedirects({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; e?: string; from?: string; q?: string; type?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const all = await listRules();
  const q = (sp.q || "").toLowerCase().trim();
  const filtered = all
    .filter((r) => (!sp.type || String(r.type) === sp.type) && (!sp.status || (r.status ?? "active") === sp.status))
    .filter((r) => (!q || `${r.from} ${r.to}`.toLowerCase().includes(q)));
  const cards = {
    total: all.length,
    active: all.filter((r) => (r.status ?? "active") === "active").length,
    inactive: all.filter((r) => r.status === "inactive").length,
    t301: all.filter((r) => r.type === 301).length,
    t410: all.filter((r) => r.type === 410).length,
    hits: all.reduce((n, r) => n + (r.hits ?? 0), 0),
  };

  return (
    <>
      <header className="adm-page-head">
        <div><h1>Redirects</h1><p>Live from the moment you save (no build/deploy) — served as real HTTP statuses by the proxy.</p></div>
        <ArrowRightLeft aria-hidden="true" />
      </header>

      {sp.saved && <div className="adm-alert">Saved {sp.saved === "toggle" ? "— rule toggled." : "."}</div>}
      {sp.deleted && <div className="adm-alert">Redirect removed.</div>}
      {sp.e === "badsave" && <div className="adm-alert adm-alert-err">Check the fields: source must start with /, and the target must start with / or https (except 410, which has no target).</div>}
      {sp.e === "parse" && <div className="adm-alert adm-alert-err">Could not parse the map payload — try again.</div>}
      {sp.e && sp.e.startsWith("This creates") && <div className="adm-alert adm-alert-err">{sp.e}</div>}
      {sp.e === "imported" && <div className="adm-alert">Imported from CSV.</div>}
      {sp.e === "empty" && <div className="adm-alert adm-alert-err">Nothing to import.</div>}

      {/* summary cards */}
      <div className="adm-panel">
        <div className="adm-grid4" style={{ textAlign: "center" }}>
          <div><div style={{ fontSize: "1.6rem", fontWeight: 800 }}>{cards.total}</div><span className="adm-hint">Total rules</span></div>
          <div><div style={{ fontSize: "1.6rem", fontWeight: 800 }}>{cards.active}</div><span className="adm-hint">Active</span></div>
          <div><div style={{ fontSize: "1.6rem", fontWeight: 800 }}>{cards.inactive}</div><span className="adm-hint">Inactive</span></div>
          <div><div style={{ fontSize: "1.6rem", fontWeight: 800 }}>{cards.hits}</div><span className="adm-hint">Total hits</span></div>
          <div><div style={{ fontSize: "1.6rem", fontWeight: 800 }}>{cards.t301}</div><span className="adm-hint">301</span></div>
          <div><div style={{ fontSize: "1.6rem", fontWeight: 800 }}>{cards.t410}</div><span className="adm-hint">410</span></div>
        </div>
        <div className="adm-inline" style={{ marginTop: 14 }}>
          <Link className="adm-btn" href="/admin/redirects/map">Launch redirect map →</Link>
          <Link className="adm-btn" href="/admin/404s">404 monitor →</Link>
          <a className="adm-btn" href="/api/admin/redirects" download>Export CSV</a>
          <RedirectImport />
        </div>
      </div>

      {/* add rule */}
      <div className="adm-panel">
        <h2>Add / edit a rule</h2>
        <form action={saveRuleAction} className="adm-form">
          <div className="adm-grid3">
            <div>
              <label className="adm-label">From (old path)</label>
              <input className="adm-input" name="from" required placeholder="/old-url/" defaultValue={sp.from ?? ""} />
            </div>
            <div>
              <label className="adm-label">To (target — blank for 410)</label>
              <input className="adm-input" name="to" placeholder="/new-url/" />
            </div>
            <div>
              <label className="adm-label">Type</label>
              <select className="adm-input" name="type" defaultValue="301">
                <option value="301">301 — permanent (passes SEO)</option>
                <option value="302">302 — temporary</option>
                <option value="307">307 — temporary (preserves method)</option>
                <option value="410">410 — gone (no target)</option>
              </select>
            </div>
          </div>
          <label className="adm-label">Note (optional)</label>
          <input className="adm-input" name="note" placeholder="Why this rule exists" />
          <button className="adm-btn adm-btn-primary" type="submit" style={{ marginTop: 12 }}>Save rule — live right away</button>
          {sp.from && <p className="adm-hint">Prefilled from the 404 monitor.</p>}
        </form>
      </div>

      {/* list */}
      <div className="adm-panel">
        <h2>{`Rules (${filtered.length} shown / ${all.length})`}</h2>
        <form className="adm-form" action="/admin/redirects" method="get" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <input className="adm-input" style={{ width: 240 }} name="q" defaultValue={sp.q ?? ""} placeholder="Search source or target…" />
          <select className="adm-input" name="type" defaultValue={sp.type ?? ""}>
            <option value="">All types</option>
            {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select className="adm-input" name="status" defaultValue={sp.status ?? ""}>
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="adm-btn" type="submit">Filter</button>
          <a className="adm-btn" href="/admin/redirects"><RefreshCw size={13} style={{ display: "inline", verticalAlign: -2 }} /> Reset</a>
        </form>
        {filtered.length === 0 ? (
          <p className="adm-hint">No rules yet.</p>
        ) : (
          <table className="adm-table">
            <thead><tr><th>Source</th><th>→</th><th>Target</th><th>Type</th><th>Status</th><th>Hits</th><th>Note</th><th aria-label="Actions"></th></tr></thead>
            <tbody>
              {filtered.map((r: RuntimeRule) => (
                <tr key={r.id}>
                  <td><code>{r.from}</code></td>
                  <td>→</td>
                  <td><code>{r.type === 410 ? "(gone)" : r.to}</code></td>
                  <td>{TYPE_LABEL[r.type] ?? r.type}</td>
                  <td>
                    <form action={toggleRuleAction}>
                      <input type="hidden" name="from" value={r.from} />
                      <button className={"adm-chip" + ((r.status ?? "active") === "active" ? " adm-chip-ok" : "")} type="submit" title="Toggle active/inactive">
                        {(r.status ?? "active") === "active" ? "Active" : "Inactive"}
                      </button>
                    </form>
                  </td>
                  <td className="adm-muted">{r.hits ?? 0}{r.last_hit ? <div style={{ fontSize: 10 }}>{new Date(r.last_hit).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div> : null}</td>
                  <td className="adm-muted">{r.note || "—"}</td>
                  <td className="adm-row-actions">
                    <form action={deleteRuleAction}>
                      <input type="hidden" name="from" value={r.from} />
                      <button className="adm-iconbtn adm-danger" type="submit" aria-label="Delete rule"><Trash2 size={14} /></button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
