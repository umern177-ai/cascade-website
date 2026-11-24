// Meta Tags bulk view (Admin Panel Upgrade Phase 5, section 7.1): a paginated
// table of ALL pages with the title and description inline-edited per row,
// problem highlighting (missing / too long / too short / duplicate), CSV
// export and import with a preview-before-save flow.
import Link from "next/link";
import { pageCatalog } from "@/lib/admin/page-catalog";
import { getMetaFile } from "@/lib/admin/store";
import MetaCell from "@/components/admin/MetaCell";
import { Tags } from "lucide-react";
import MetaBulkImport from "@/components/admin/MetaBulkImport";

export const dynamic = "force-dynamic";

export default async function AdminMetaBulk({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; page?: string; problem?: string }>;
}) {
  const sp = await searchParams;
  const [catalog, meta] = await Promise.all([pageCatalog(), getMetaFile()]);

  const q = (sp.q || "").toLowerCase().trim();
  const filtered = catalog
    .map((c) => ({ ...c, saved: meta[c.path] }))
    .filter((c) => (!q || `${c.title} ${c.path}`.toLowerCase().includes(q)));

  // duplicate detection across the WHOLE meta file
  const slugifyTitle = (t?: string) => (t || "").trim().toLowerCase().slice(0, 64);
  const dupTitles = new Map<string, number>();
  const dupDescs = new Map<string, number>();
  const titlesSeen = new Map<string, string[]>();
  const descsSeen = new Map<string, string[]>();
  for (const c of filtered) {
    const t = slugifyTitle(c.saved?.title);
    const d = (c.saved?.description || "").trim().toLowerCase().slice(0, 64);
    if (t) titlesSeen.set(t, [...(titlesSeen.get(t) ?? []), c.path]);
    if (d) descsSeen.set(d, [...(descsSeen.get(d) ?? []), c.path]);
  }
  for (const [k, paths] of titlesSeen) if (paths.length > 1) for (const p of paths) dupTitles.set(p, (dupTitles.get(p) ?? 0) + paths.length);
  for (const [k, paths] of descsSeen) if (paths.length > 1) for (const p of paths) dupDescs.set(p, (dupDescs.get(p) ?? 0) + paths.length);

  const isProblem = (row: (typeof filtered)[number]) => {
    const t = (row.saved?.title || "").trim();
    const d = (row.saved?.description || "").trim();
    return !t || t.length < 30 || t.length > 70 || !d || d.length < 90 || d.length > 165 || dupTitles.has(row.path) || dupDescs.has(row.path);
  };
  const problemCount = filtered.filter(isProblem).length;

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1>Meta tags — bulk view</h1>
          <p>{filtered.length} pages · {problemCount} needing attention (missing / short / long / duplicate). Click a cell to edit it.</p>
        </div>
        <Tags aria-hidden="true" />
      </header>

      <div className="adm-panel" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <form action="/admin/meta" method="get" style={{ display: "flex", gap: 8 }}>
          <input className="adm-input" style={{ width: 260 }} name="q" defaultValue={sp.q ?? ""} placeholder="Search all pages…" />
          <button className="adm-btn" type="submit">Search</button>
          <Link className="adm-btn" href="/admin/meta">Reset</Link>
        </form>
        <a className="adm-btn" href="/api/admin/meta-export" download>Export CSV</a>
        <MetaBulkImport />
      </div>

      <div className="adm-panel">
        <table className="adm-table">
          <thead>
            <tr><th style={{ width: 240 }}>Page</th><th>SEO title <span className="adm-hint-inline">50–60 best</span></th><th>Meta description <span className="adm-hint-inline">140–160</span></th></tr>
          </thead>
          <tbody>
            {(filtered.length ? filtered : []).map((row) => {
              const t = (row.saved?.title || "").trim();
              const d = (row.saved?.description || "").trim();
              const flags: string[] = [];
              if (!t) flags.push("title missing");
              else if (t.length < 30) flags.push("title short");
              else if (t.length > 70) flags.push("title long");
              if (dupTitles.has(row.path)) flags.push("title duplicate");
              if (!d) flags.push("description missing");
              else if (d.length < 90) flags.push("description short");
              else if (d.length > 165) flags.push("description long");
              if (dupDescs.has(row.path)) flags.push("description duplicate");
              return (
                <tr key={row.path} style={flags.length ? { background: "#fff6f6" } : undefined}>
                  <td>
                    <Link className="adm-link" href={`/admin/pages/edit?path=${encodeURIComponent(row.path)}`}>{row.title}</Link>
                    <div><code style={{ fontSize: 10.5 }}>{row.path}</code></div>
                    {flags.length > 0 && <div style={{ marginTop: 4 }}>{flags.map((f) => <span key={f} className="adm-badge-new" style={{ marginRight: 4, background: flags.length && (f.includes("duplicate") || f.includes("missing")) ? "#e23b3b" : "#d98a00", fontSize: 9.5 }}>{f}</span>)}</div>}
                  </td>
                  <MetaCell path={row.path} field="title" value={t} />
                  <MetaCell path={row.path} field="description" value={d} />
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length > 60 && <p className="adm-hint">Showing the first 60 — use search to narrow (the search covers every page).</p>}
      </div>
    </>
  );
}
