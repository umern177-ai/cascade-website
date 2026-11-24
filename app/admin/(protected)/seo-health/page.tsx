// SEO Health Check (/admin/seo-health) — Admin PanelUpgrade Phase 5 (7.4).
// Scans the page catalog + saved meta/content for the fixable problems and
// lists them with direct links into the editor. Run on demand (server-side,
// no API cost — data is local).
import Link from "next/link";
import { pageCatalog } from "@/lib/admin/page-catalog";
import { getMetaFile } from "@/lib/admin/store";
import { HeartPulse } from "lucide-react";

export const dynamic = "force-dynamic";

type Issue = { page: string; type: string; note: string; edit: string };

export default async function AdminSeoHealth({ searchParams }: { searchParams: Promise<{ scanned?: string }> }) {
  const { scanned } = await searchParams;
  const [catalog, meta] = await Promise.all([pageCatalog(), getMetaFile()]);

  const issues: Issue[] = [];
  const slug = (t?: string) => (t || "").trim().toLowerCase().slice(0, 70);
  const titleCounts = new Map<string, number>();
  const descCounts = new Map<string, number>();
  const rows = catalog.map((c) => ({ ...c, saved: meta[c.path] }));
  for (const r of rows) {
    titleCounts.set(slug(r.saved?.title || r.title), (titleCounts.get(slug(r.saved?.title || r.title)) ?? 0) + 1);
    descCounts.set(slug(r.saved?.description), (descCounts.get(slug(r.saved?.description)) ?? 0) + 1);
  }
  for (const r of rows) {
    const t = (r.saved?.title || "").trim();
    const d = (r.saved?.description || "").trim();
    const editQ = encodeURIComponent(r.path);
    const edit = `/admin/pages/edit?path=${editQ}`;
    if (!d) issues.push({ page: r.path, type: "Missing meta description", note: "Add one in the editor (140–160 chars).", edit });
    else if (d.length < 90) issues.push({ page: r.path, type: "Meta description short", note: `${d.length} chars — target 140–160.`, edit });
    else if (d.length > 165) issues.push({ page: r.path, type: "Meta description long", note: `${d.length} chars — trim to 160.`, edit });
    if (!t) issues.push({ page: r.path, type: "Title missing", note: "Falls back to the built-in title — override it if it is wrong.", edit });
    if (t && t.length > 70) issues.push({ page: r.path, type: "Title long", note: `${t.length} chars — target 50–60.`, edit });
    if ((titleCounts.get(slug(r.saved?.title || r.title)) ?? 0) > 1 && r.saved?.title) {
      issues.push({ page: r.path, type: "Duplicate title", note: `${titleCounts.get(slug(r.saved?.title))} pages share this saved title.`, edit });
    }
    if ((descCounts.get(slug(r.saved?.description)) ?? 0) > 1 && d) {
      issues.push({ page: r.path, type: "Duplicate meta description", note: `${descCounts.get(slug(d))} pages share it.`, edit });
    }
    if (r.saved?.robots?.startsWith("noindex") && r.type === "city") {
      issues.push({ page: r.path, type: "Noindex on a location page", note: "This city page stays out of Google — check it is intentional.", edit });
    }
  }
  const byType = new Map<string, number>();
  for (const i of issues) byType.set(i.type, (byType.get(i.type) ?? 0) + 1);

  return (
    <>
      <header className="adm-page-head">
        <div><h1>SEO health check</h1><p>Scanned {rows.length} pages — {issues.length} issue(s) found. Click the page to fix it.</p></div>
        <HeartPulse aria-hidden="true" />
      </header>

      <div className="adm-panel">
        <div className="adm-inline">
          {[...byType.entries()].sort((a, b) => b[1] - a[1]).map(([type, n]) => (
            <Link key={type} className="adm-btn" href={`/admin/meta?q=`}>{n} × {type}</Link>
          ))}
          {issues.length === 0 && <span className="adm-chip adm-chip-ok">All clean — everything scans green.</span>}
        </div>
      </div>

      <div className="adm-panel">
        {issues.length === 0 ? (
          <p className="adm-hint">No issues found in the meta / duplicates / noindex scan. Word-count and link scans grow as page content moves fully into the store.</p>
        ) : (
          <table className="adm-table">
            <thead><tr><th>Page</th><th>Issue</th><th>Detail</th><th></th></tr></thead>
            <tbody>
              {issues.slice(0, 400).map((i, k) => (
                <tr key={k}>
                  <td><Link className="adm-link" href={i.edit}>{i.page}</Link></td>
                  <td>{i.type}</td>
                  <td className="adm-muted">{i.note}</td>
                  <td className="adm-row-actions"><Link className="adm-btn" href={i.edit}>Fix</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
