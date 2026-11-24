// Global search (Admin Panel Upgrade Phase 7): pages + posts + inquiries +
// redirects in one query, from the top bar.
import { pageCatalog } from "@/lib/admin/page-catalog";
import { adminPostsView } from "@/lib/admin/blog-admin";
import { listInquiries } from "@/lib/admin/leads";
import { listRules } from "@/lib/admin/redirect-engine";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q || "").toLowerCase().trim();
  const [catalog, blog, leads, rules] = await Promise.all([
    query ? pageCatalog() : Promise.resolve([]),
    query ? adminPostsView({ q, status: "", cat: "", page: 1, pageSize: 100 }) : Promise.resolve({ rows: [] as never[] } as unknown as { rows: never[] }),
    query ? listInquiries({ q, page: 1, pageSize: 10 }) : Promise.resolve({ rows: [] as never[] } as unknown as { rows: never[] }),
    query ? listRules() : Promise.resolve([]),
  ]);
  const pages = catalog.filter((c) => `${c.title} ${c.path}`.toLowerCase().includes(query)).slice(0, 20);
  const posts = (blog.rows as Array<{ id: string; title: string; slug: string }> as unknown as Array<{ id: string; title: string; slug: string }>).filter((p) => `${p.title} ${p.slug}`.toLowerCase().includes(query)).slice(0, 10);
  const leadRows = (leads.rows as unknown as Array<{ id: string; fullName: string; email: string; phone: string }>).filter((l) => `${l.fullName} ${l.email} ${l.phone}`.toLowerCase().includes(query)).slice(0, 10);
  const redirectRows = (rules as unknown as Array<{ from: string; to: string }>).filter((r) => `${r.from} ${r.to}`.toLowerCase().includes(query)).slice(0, 10);

  return (
    <>
      <header className="adm-page-head">
        <div><h1>Search</h1><p>Pages, blog posts, inquiries and redirects — one query.</p></div>
        <SearchIcon aria-hidden="true" />
      </header>

      <div className="adm-panel">
        <form action="/admin/search" method="get" className="adm-form" style={{ display: "flex", gap: 8 }}>
          <input className="adm-input" style={{ width: 340 }} name="q" defaultValue={q} autoFocus placeholder="Search everything…" />
          <button className="adm-btn adm-btn-primary" type="submit">Search</button>
        </form>
      </div>

      {!query ? null : (
        <>
          <div className="adm-panel">
            <h2>Pages ({pages.length})</h2>
            {pages.map((c) => (
              <div key={c.path} style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}>
                <Link className="adm-link" href={`/admin/pages/edit?path=${encodeURIComponent(c.path)}`}>{c.title}</Link> <code style={{ fontSize: 11 }}>{c.path}</code>
              </div>
            ))}
            {pages.length === 0 && <p className="adm-hint">No pages.</p>}
          </div>
          <div className="adm-panel">
            <h2>Blog posts ({posts.length})</h2>
            {posts.map((p) => (
              <div key={p.id} style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}>
                <Link className="adm-link" href={`/admin/blog/${encodeURIComponent(p.id)}`}>{p.title}</Link> <code style={{ fontSize: 11 }}>/blog/{p.slug}/</code>
              </div>
            ))}
            {posts.length === 0 && <p className="adm-hint">No posts.</p>}
          </div>
          <div className="adm-panel">
            <h2>Inquiries ({leadRows.length})</h2>
            {leadRows.map((l) => (
              <div key={l.id} style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}>
                <Link className="adm-link" href={`/admin/inquiries/${l.id}`}>{l.fullName}</Link> · {l.phone} · {l.email}
              </div>
            ))}
            {leadRows.length === 0 && <p className="adm-hint">No inquiries.</p>}
          </div>
          <div className="adm-panel">
            <h2>Redirects ({redirectRows.length})</h2>
            {redirectRows.map((r, i) => (
              <div key={i} style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}>
                <code style={{ fontSize: 12 }}>{r.from}</code> → <code style={{ fontSize: 12 }}>{r.to || "(410)"}</code>
              </div>
            ))}
            {redirectRows.length === 0 && <p className="adm-hint">No redirects.</p>}
          </div>
        </>
      )}
    </>
  );
}
