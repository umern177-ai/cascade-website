// Blog manager — every post, live or draft, after the Phase 2 migration.
// Thumbnails, status (Draft / Scheduled / Published), author, categories with
// a managed-category filter, search, pagination, duplicate + delete.
import Link from "next/link";
import { postStatusBadge, adminPostsView } from "@/lib/admin/blog-admin";
import { duplicatePostAction, deletePostAction } from "../../actions";
import { Plus, Pencil, Trash2, Copy } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBlog({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; cat?: string; page?: string; deleted?: string; duplicated?: string; pageSize?: string }>;
}) {
  const sp = await searchParams;
  const { rows, total, counts, page, pages, pageSize } = await adminPostsView({
    q: sp.q || undefined,
    status: sp.status || undefined,
    cat: sp.cat || undefined,
    page: Number(sp.page || 1) || 1,
    pageSize: Number(sp.pageSize || 25) || 25,
  });
  const link = (over: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries({ q: sp.q, status: sp.status, cat: sp.cat, page: sp.page, pageSize: sp.pageSize, ...over })) {
      if (v) params.set(k, String(v));
    }
    return "/admin/blog?" + params.toString();
  };
  const catNames = new Set<string>();
  for (const r of rows) for (const c of r.categories ?? []) catNames.add(c);

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1>Blog posts</h1>
          <p>Built-in guides moved into the store — everything here is a normal editable post, with the same URLs as before.</p>
          <p className="adm-hint" style={{ marginTop: 6 }}>{counts.published} published · {counts.draft} drafts · {counts.scheduled} scheduled · <Link className="adm-link" href="/admin/blog/categories">Manage categories →</Link></p>
        </div>
        <Link href="/admin/blog/new" className="adm-btn adm-btn-primary"><Plus size={15} aria-hidden="true" /> New post</Link>
      </header>

      {sp.deleted && <div className="adm-alert">Post removed from the blog.</div>}
      {sp.duplicated && <div className="adm-alert">Duplicated as a draft — write unique content before publishing.</div>}

      <div className="adm-panel">
        <form className="adm-form" action="/admin/blog" method="get" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <label className="adm-label">Search</label>
            <input className="adm-input" style={{ width: 240 }} name="q" defaultValue={sp.q ?? ""} placeholder="Title or URL…" />
          </div>
          <div>
            <label className="adm-label">Status</label>
            <select className="adm-input" name="status" defaultValue={sp.status ?? ""}>
              <option value="">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          <div>
            <label className="adm-label">Category</label>
            <select className="adm-input" name="cat" defaultValue={sp.cat ?? ""}>
              <option value="">All</option>
              {[...catNames].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button className="adm-btn" type="submit">Apply</button>
          <Link className="adm-btn" href="/admin/blog">Clear</Link>
        </form>
      </div>

      <div className="adm-panel">
        {rows.length === 0 ? (
          <p className="adm-hint">No posts match.</p>
        ) : (
          <>
            <table className="adm-table">
              <thead>
                <tr><th>Image</th><th>Title</th><th>Category</th><th>Author</th><th>Status</th><th>Publish date</th><th>Last edited</th><th aria-label="Actions"></th></tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td style={{ width: 84 }}>
                      <Link href={`/admin/blog/${encodeURIComponent(r.id)}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {r.image ? <img src={r.image} alt={r.imageAlt || r.title} width={72} height={40} style={{ borderRadius: 8, objectFit: "cover" }} /> : <span className="adm-muted" style={{ fontSize: 11 }}>no image</span>}
                      </Link>
                    </td>
                    <td style={{ maxWidth: 340 }}>
                      <Link className="adm-link" href={`/admin/blog/${encodeURIComponent(r.id)}`}>{r.title || "Untitled draft"}</Link>
                      <div><code style={{ fontSize: 11 }}>/blog/{r.slug}/</code></div>
                    </td>
                    <td className="adm-muted">{(r.categories ?? []).join(", ") || r.tag || "—"}</td>
                    <td className="adm-muted">{r.author}</td>
              <td><span className="adm-chip" style={r.postStatus === "published" ? { background: "#e2f2e7", color: "#1d6b3f" } : undefined}>{postStatusBadge(r)}</span></td>
                    <td className="adm-muted" style={{ whiteSpace: "nowrap" }}>{r.publishAt ? `Scheduled ${r.publishAt.slice(0, 10)}` : r.date}</td>
                    <td className="adm-muted" style={{ whiteSpace: "nowrap" }}>{r.updatedAt ? new Date(r.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</td>
                    <td className="adm-row-actions">
                      <Link className="adm-iconbtn" href={`/admin/blog/${encodeURIComponent(r.id)}`} aria-label="Edit"><Pencil size={14} /></Link>
                      <form action={duplicatePostAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <button className="adm-iconbtn" type="submit" aria-label="Duplicate as draft" title="Duplicate (draft)"><Copy size={14} /></button>
                      </form>
                      <a className="adm-iconbtn" href={`/blog/${r.slug}/`} target="_blank" rel="noreferrer" aria-label="View live" title="View live">↗</a>
                      <form action={deletePostAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <button className="adm-iconbtn adm-danger" type="submit" aria-label="Remove post"><Trash2 size={14} /></button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="adm-inline" style={{ marginTop: 14, alignItems: "center" }}>
              <span className="adm-hint">{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}</span>
              <Link className="adm-btn" style={{ opacity: page <= 1 ? 0.4 : 1 }} href={link({ page: Math.max(page - 1, 1) })}>← Prev</Link>
              <span className="adm-hint">Page {page} / {pages}</span>
              <Link className="adm-btn" style={{ opacity: page >= pages ? 0.4 : 1 }} href={link({ page: Math.min(page + 1, pages) })}>Next →</Link>
              {[25, 50, 100].map((n) => (
                <Link key={n} className={"adm-btn" + (pageSize === n ? " adm-btn-primary" : "")} href={link({ page: 1, pageSize: n })}>{n} / page</Link>
              ))}
            </div>
          </>
        )}
      </div>

    </>
  );
}
