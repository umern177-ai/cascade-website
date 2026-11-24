// Blog categories manager (Admin Panel Upgrade section 4.5): add, edit and
// delete categories. Deleting asks where the posts should move (required),
// and the old public /blog/category/{slug}/ URL gets an automatic 301.
import Link from "next/link";
import { getBlogCategories, getBlogFile } from "@/lib/admin/store";
import { saveCategoryAction, deleteCategoryAction } from "./actions";
import { Plus, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBlogCategories({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; e?: string; edit?: string }>;
}) {
  const sp = await searchParams;
  const [cats, file] = await Promise.all([getBlogCategories(), getBlogFile()]);
  const counts = new Map<string, number>();
  for (const p of file.posts) for (const c of p.categories ?? []) counts.set(c, (counts.get(c) ?? 0) + 1);
  const editing = sp.edit ? cats.find((c) => c.slug === sp.edit) : undefined;

  return (
    <>
      <header className="adm-page-head">
        <div><h1>Blog categories</h1><p>Managed categories power /blog/category/{'{slug}'}/ pages and the post editor picker.</p></div>
        <Link href="/admin/blog" className="adm-btn">← Blog posts</Link>
      </header>

      {sp.saved && <div className="adm-alert">Category saved.</div>}
      {sp.deleted && <div className="adm-alert">Category deleted — its posts moved, the old URL 301-redirected.</div>}
      {sp.e === "duplicate" && <div className="adm-alert adm-alert-err">That slug already exists.</div>}
      {sp.e === "need-move" && <div className="adm-alert adm-alert-err">Choose which category the posts should move to.</div>}

      <div className="adm-panel">
        <h2>{editing ? `Edit: ${editing.name}` : "Add a category"}</h2>
        <form action={saveCategoryAction} className="adm-form">
          <input type="hidden" name="originalSlug" value={editing?.slug ?? ""} />
          <div className="adm-grid2">
            <div>
              <label className="adm-label">Name</label>
              <input className="adm-input" name="name" required defaultValue={editing?.name ?? ""} />
            </div>
            <div>
              <label className="adm-label">Slug (URL /blog/category/{'{slug}'}/)</label>
              <input className="adm-input" name="slug" defaultValue={editing?.slug ?? ""} placeholder="auto from name" />
            </div>
            <div>
              <label className="adm-label">SEO title (optional)</label>
              <input className="adm-input" name="seoTitle" defaultValue={editing?.seoTitle ?? ""} />
            </div>
            <div>
              <label className="adm-label">Meta description (optional)</label>
              <input className="adm-input" name="metaDescription" defaultValue={editing?.metaDescription ?? ""} />
            </div>
          </div>
          <label className="adm-label">Description (shown on the category page)</label>
          <textarea className="adm-input" rows={2} name="description" defaultValue={editing?.description ?? ""} />
          <div className="adm-inline" style={{ marginTop: 12 }}>
            <button className="adm-btn adm-btn-primary" type="submit">{editing ? "Save category" : "Add category"}</button>
            {editing && <Link className="adm-btn" href="/admin/blog/categories">Cancel edit</Link>}
          </div>
        </form>
      </div>

      <div className="adm-panel">
        <h2>{`Categories (${cats.length})`}</h2>
        {cats.length === 0 ? (
          <p className="adm-hint">None yet — posts use free-typed categories until you add managed ones.</p>
        ) : (
          <table className="adm-table">
            <thead><tr><th>Name</th><th>URL</th><th>Posts</th><th aria-label="Actions"></th></tr></thead>
            <tbody>
              {cats.map((c) => (
                <tr key={c.slug}>
                  <td><b>{c.name}</b>{c.description && <div className="adm-muted" style={{ fontSize: 12 }}>{c.description}</div>}</td>
                  <td><code style={{ fontSize: 11.5 }}>/blog/category/{c.slug}/</code></td>
                  <td>{counts.get(c.name) ?? 0}</td>
                  <td className="adm-row-actions">
                    <Link className="adm-btn" href={`/admin/blog/categories?edit=${encodeURIComponent(c.slug)}`}>Edit</Link>
                    {/* delete form — requires a move target */}
                    <details style={{ display: "inline-block" }}>
                      <summary className="adm-iconbtn adm-danger" title="Delete" style={{ listStyle: "none" }}><Trash2 size={14} /></summary>
                      <div className="adm-inline" style={{ marginTop: 8 }}>
                        <form action={deleteCategoryAction} style={{ display: "flex", gap: 8 }}>
                          <input type="hidden" name="slug" value={c.slug} />
                          <select className="adm-input" name="moveTo" required defaultValue="">
                            <option value="" disabled>Move its posts to…</option>
                            {cats.filter((x) => x.slug !== c.slug).map((x) => <option key={x.slug} value={x.name}>{x.name}</option>)}
                          </select>
                          <button className="adm-btn adm-danger" type="submit">Confirm delete</button>
                        </form>
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="adm-hint"><Plus size={12} aria-hidden="true" /> Deleting always keeps the posts — you must choose the category they move to, and the old URL 301s to its new page.</p>
      </div>
    </>
  );
}
