// ALL PAGES (WordPress-style): every page on the site — 800+ — in one
// searchable list, SERVER-SIDE PAGINATED (Admin Panel Upgrade Phase 1 — the
// old table capped at 200 rows). Search and type filters run across the FULL
// catalog before paging. "Edit" opens the page's existing content: meta tags
// plus its H1 / intro / FAQ copy where the page type carries them.
import Link from "next/link";
import { pageCatalog, CatalogType } from "@/lib/admin/page-catalog";
import { getPageBodyFile, getMetaFile } from "@/lib/admin/store";
import { Search, FileText } from "lucide-react";

const TYPE_LABEL: Record<CatalogType, string> = {
  core: "Core",
  service: "Service",
  fleet: "Fleet",
  blog: "Blog",
  state: "State",
  city: "City",
};

const PAGE_SIZES = [25, 50, 100];

export default async function AdminAllPages({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; page?: string; pageSize?: string }>;
}) {
  const { q, type, page: pageParam, pageSize: sizeParam } = await searchParams;
  const [catalog, bodies, meta] = await Promise.all([pageCatalog(), getPageBodyFile(), getMetaFile()]);

  const query = (q || "").toLowerCase().trim();
  const typeFilter = type as CatalogType | undefined;
  const rows = catalog.filter(
    (c) =>
      (!typeFilter || c.type === typeFilter) &&
      (!query || c.title.toLowerCase().includes(query) || c.path.toLowerCase().includes(query))
  );

  // pagination — no cap on total, kept counting
  const pageSize = PAGE_SIZES.includes(Number(sizeParam)) ? Number(sizeParam) : 50;
  const pages = Math.max(Math.ceil(rows.length / pageSize), 1);
  const page = Math.min(Math.max(Number(pageParam || 1) || 1, 1), pages);
  const slice = rows.slice((page - 1) * pageSize, page * pageSize);

  const counts = catalog.reduce<Record<string, number>>((m, c) => ((m[c.type] = (m[c.type] || 0) + 1), m), {});
  const link = (over: Record<string, string | number>) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries({ q, type: type, page: page, pageSize: pageSize, ...over })) {
      if (v) params.set(k, String(v));
    }
    return "/admin/pages?" + params.toString();
  };

  return (
    <>
      <header className="adm-page-head">
        <div><h1>All pages</h1><p>{catalog.length} pages — every one editable: meta tags, H1, intro and FAQ copy on the pages that carry them.</p></div>
        <FileText aria-hidden="true" />
      </header>

      <div className="adm-panel">
        <form action="/admin/pages" method="get" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input className="adm-input" style={{ width: 320 }} name="q" defaultValue={q ?? ""} placeholder="Search title or URL…" />
          <input type="hidden" name="type" value={typeFilter ?? ""} />
          <input type="hidden" name="pageSize" value={pageSize} />
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
            {slice.map((r) => {
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
        <div className="adm-inline" style={{ marginTop: 14, alignItems: "center" }}>
          <span className="adm-hint">{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, rows.length)} of {rows.length}</span>
          <Link className="adm-btn" style={{ opacity: page <= 1 ? 0.4 : 1 }} href={link({ page: Math.max(page - 1, 1) })}>← Prev</Link>
          <span className="adm-hint">Page {page} / {pages}</span>
          <Link className="adm-btn" style={{ opacity: page >= pages ? 0.4 : 1 }} href={link({ page: Math.min(page + 1, pages) })}>Next →</Link>
          {PAGE_SIZES.map((n) => (
            <Link key={n} className={"adm-btn" + (pageSize === n ? " adm-btn-primary" : "")} href={link({ page: 1, pageSize: n })}>{n} / page</Link>
          ))}
        </div>
      </div>
    </>
  );
}
