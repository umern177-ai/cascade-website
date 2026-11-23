// Redirect manager: 301/302 rules that next.config merges in. When a post
// slug changes, add the old → new rule here so rankings carry over.
import { getRedirects, AdminRedirect } from "@/lib/admin/store";
import { addRedirectAction, deleteRedirectAction } from "../../actions";
import { ArrowRightLeft, Trash2 } from "lucide-react";
import RedirectImport from "@/components/RedirectImport";

export default async function AdminRedirectsPage({ searchParams }: { searchParams: Promise<{ added?: string; deleted?: string; imported?: string }> }) {
  const { added, deleted, imported } = await searchParams;
  const list: AdminRedirect[] = await getRedirects();

  return (
    <>
      <header className="adm-page-head">
        <div><h1>Redirects</h1><p>Permanent (301) or temporary (302) — live site-wide on the next request after save.</p></div>
        <div className="adm-inline">
          <a className="adm-btn" href="/api/admin/redirects" download>Export CSV</a>
          <RedirectImport />
        </div>
        <ArrowRightLeft aria-hidden="true" />
      </header>
      {added && <div className="adm-alert">Redirect added.</div>}
      {imported && <div className="adm-alert">Imported {imported} rules from CSV.</div>}
      {deleted && <div className="adm-alert">Redirect removed.</div>}

      <div className="adm-panel">
        <h2>Add a redirect</h2>
        <form action={addRedirectAction} className="adm-form">
          <div className="adm-grid3">
            <div>
              <label className="adm-label">From (old path)</label>
              <input className="adm-input" name="from" required placeholder="/old-url/" pattern="/.*" />
            </div>
            <div>
              <label className="adm-label">To (new path or full URL)</label>
              <input className="adm-input" name="to" required placeholder="/new-url/" pattern="/.*" />
            </div>
            <div>
              <label className="adm-label">Type</label>
              <select className="adm-input" name="status" defaultValue="301">
                <option value="301">301 — permanent (passes SEO)</option>
                <option value="302">302 — temporary</option>
              </select>
            </div>
          </div>
          <label className="adm-label">Note (optional, for the team)</label>
          <input className="adm-input" name="note" placeholder="Why this exists" />
          <button className="adm-btn adm-btn-primary" type="submit">Add redirect</button>
        </form>
      </div>

      <div className="adm-panel">
        <h2>{`Active rules (${list.length})`}</h2>
        {list.length === 0 ? (
          <p className="adm-hint">None yet.</p>
        ) : (
          <table className="adm-table">
            <thead><tr><th>From</th><th>→</th><th>To</th><th>Type</th><th>Note</th><th aria-label="Actions"></th></tr></thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id}>
                  <td><code>{r.from}</code></td>
                  <td>→</td>
                  <td><code>{r.to}</code></td>
                  <td>{r.status}</td>
                  <td className="adm-muted">{r.note || "—"}</td>
                  <td className="adm-row-actions">
                    <form action={deleteRedirectAction}>
                      <input type="hidden" name="id" value={r.id} />
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
