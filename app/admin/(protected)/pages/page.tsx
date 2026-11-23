// ALL PAGES (WordPress-style): every page on the site — 800+ — in one
// searchable list. "Edit" opens the page's existing content: meta tags plus
// its H1 / intro / FAQ copy where the page type carries them.
import Link from "next/link";
import { pageCatalog, CatalogType } from "@/lib/admin/page-catalog";
import { getPageBodyFile } from "@/lib/admin/store";
import { getMetaFile } from "@/lib/admin/store";
import { Search, FileText } from "lucide-react";

const TYPE_LABEL: Record<CatalogType, string> = {
  core: "Core",
  service: "Service",
  fleet: "Fleet",
  blog: "Blog",
  state: "State",
  city: "City",
};

export default async function AdminAllPages({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q, type } = await searchParams;
  const [catalog, bodies, meta] = await Promise.all([pageCatalog(), getPageBodyFile(), getMetaFile()]);

  const query = (q || "").toLowerCase().trim();
  const typeFilter = type as CatalogType | undefined;
  const rows = catalog.filter(
    (c) =>
      (!typeFilter || c.type === typeFilter) &&
      (!query || c.title.toLowerCase().includes(query) || c.path.toLowerCase().includes(query))
  );

  const counts = catalog.reduce<Record<string, number>>((m, c) => ((m[c.type] = (m[c.type] || 0) + 1), m), {});

  return (
    <>
      <header className="adm-page-head">
        <div><h1>All pages</h1><p>{catalog.length} pages — every one editable: meta tags, H1, intro and FAQ copy on the pages that carry them.</p></div>
        <FileText aria-hidden="true" />
      </header>

      <div className="adm-panel">
        <form action="/admin/pages" method="get" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input className="adm-input" style={{ width: 320 }} name="q" defaultValue={q ?? ""} placeholder="Search title or URL…" />
          <input type="hidden" name="type" value={type ?? ""} />
          <button className="adm-btn" type="submit"><Search size={14} /> Search</button>
          {query && <Link className="adm-btn" href="/admin/pages">Clear</Link>}
        </form>
        <div className="adm-inline" style={{ marginTop: 12 }}>
          <Link href={`/admin/pages${q ? `?q=${encodeURIComponent(q)}` : ""}`} className={"adm-btn" + (!typeFilter ? " adm-btn-primary" : "")}>All ({catalog.length})</Link>
          {(Object.keys(TYPE_LABEL) as CatalogType[]).map((t) => (
            <Link
              key={t}
              href={`/admin/pages?type=${t}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={"adm-btn" + (typeFilter === t ? " adm-btn-primary" : "")}
            >
              {TYPE_LABEL[t]} ({counts[t] || 0})
            </Link>
          ))}
        </div>
      </div>

      <div className="adm-panel">
        <table className="adm-table">
          <thead>
            <tr><th>Title</th><th>URL</th><th>Type</th><th>Content</th><th aria-label="Actions"></th></tr>
          </thead>
          <tbody>
            {rows.slice(0, 200).map((r) => {
              const custom = bodies[r.path] || meta[r.path];
              return (
                <tr key={r.path + r.type}>
                  <td><Link className="adm-link" href={`/admin/pages/edit?path=${encodeURIComponent(r.path)}`}>{r.title}</Link></td>
                  <td><code style={{ fontSize: 11.5 }}>{r.path}</code></td>
                  <td>{TYPE_LABEL[r.type]}</td>
                  <td>{custom ? <span className="adm-chip adm-chip-ok">custom</span> : "—"}</td>
                  <td className="adm-row-actions">
                    <Link className="adm-btn" href={`/admin/pages/edit?path=${encodeURIComponent(r.path)}`}>Edit</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length > 200 && (
          <p className="adm-hint">Showing the first 200 of {rows.length} — use the search or a type filter to narrow down.</p>
        )}
      </div>
    </>
  );
}
