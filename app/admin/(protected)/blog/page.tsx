// Blog manager — every post, live or draft, seed or new. Writers can create,
// edit, retire, or change slugs (with the old URL redirected automatically on
// the next build; see the slug field hint in the editor).
import Link from "next/link";
import { getPublishedPosts, getBlogFile, getBasePosts } from "@/lib/admin/store";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { deletePostAction } from "../../actions";

export default async function AdminBlog({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const { deleted } = await searchParams;
  const [base, file] = await Promise.all([getBasePosts(), getBlogFile()]);
  const live = await getPublishedPosts();
  const drafts = file.posts.filter((p) => p.draft);
  const deletedSlugs = new Set(file.deletedBaseSlugs ?? []);

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1>Blog posts</h1>
          <p>{live.length} live · {drafts.length} draft</p>
        </div>
        <Link href="/admin/blog/new" className="adm-btn adm-btn-primary"><Plus size={15} aria-hidden="true" /> New post</Link>
      </header>

      {deleted && <div className="adm-alert">Post removed from the blog.</div>}

      <div className="adm-panel">
        <table className="adm-table">
          <thead>
            <tr><th>Title</th><th>URL (/blog/…/)</th><th>Date</th><th>Tag</th><th aria-label="Actions"></th></tr>
          </thead>
          <tbody>
            {file.posts.filter((p) => p.id.startsWith("base:")).map((o) => {
              const baseP = base.find((b) => "base:" + b.slug === o.id);
              return (
                <tr key={o.id}>
                  <td><Link className="adm-link" href={`/admin/blog/${encodeURIComponent(o.id)}`}>{o.title || baseP?.title}</Link>{o.draft && <span className="adm-chip">DRAFT</span>}</td>
                  <td><code>{o.slug || baseP?.slug}</code></td>
                  <td>{o.date}</td>
                  <td>{o.tag}</td>
                  <td className="adm-row-actions">
                    <Link className="adm-iconbtn" href={`/admin/blog/${encodeURIComponent(o.id)}`} aria-label="Edit"><Pencil size={14} /></Link>
                    <form action={deletePostAction}>
                      <input type="hidden" name="id" value={o.id} />
                      <button className="adm-iconbtn adm-danger" type="submit" aria-label="Remove"><Trash2 size={14} /></button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {file.posts.filter((p) => !p.id.startsWith("base:")).map((p) => (
              <tr key={p.id}>
                <td><Link className="adm-link" href={`/admin/blog/${encodeURIComponent(p.id)}`}>{p.title}</Link>{p.draft && <span className="adm-chip">DRAFT</span>}</td>
                <td><code>{p.slug}</code></td>
                <td>{p.date}</td>
                <td>{p.tag}</td>
                <td className="adm-row-actions">
                  <Link className="adm-iconbtn" href={`/admin/blog/${encodeURIComponent(p.id)}`} aria-label="Edit"><Pencil size={14} /></Link>
                  <form action={deletePostAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="adm-iconbtn adm-danger" type="submit" aria-label="Remove post"><Trash2 size={14} /></button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="adm-panel">
        <h2>Original built-in post (editable)</h2>
        <table className="adm-table">
          <thead><tr><th>Title</th><th>URL (/blog/…/)</th><th>Date</th><th aria-label="Actions"></th></tr></thead>
          <tbody>
            {base.filter((b) => !file.posts.some((o) => o.id === "base:" + b.slug) && !deletedSlugs.has(b.slug)).map((b) => (
              <tr key={b.slug}>
                <td>{b.title}</td>
                <td><code>{b.slug}</code></td>
                <td>{b.date}</td>
                <td className="adm-row-actions">
                  <Link className="adm-iconbtn" href={`/admin/blog/${encodeURIComponent("base:" + b.slug)}`} aria-label="Edit"><Pencil size={14} /></Link>
                  <form action={deletePostAction}>
                    <input type="hidden" name="id" value={"base:" + b.slug} />
                    <button className="adm-iconbtn adm-danger" type="submit" aria-label="Retire post"><Trash2 size={14} /></button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="adm-hint">The original planning guide lives in the blog list the same way — edit it like any other post; “Remove” takes it off the site until you empty its override.</p>
      </div>
    </>
  );
}
