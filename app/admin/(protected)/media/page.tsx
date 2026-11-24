// Media Library (/admin/media) — Admin Panel Upgrade Phase 5 (7.5): every
// uploaded image in a grid, usage lookup, and delete (only files not in use).
// On hosting the uploads live in Vercel Blob; locally in public/uploads.
import fs from "node:fs";
import path from "node:path";
import { readBlobListIfConfigured } from "@/lib/admin/media-lib";
import Link from "next/link";
import { FileImage, Trash2 } from "lucide-react";
import { isAuthed } from "@/lib/admin/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminMedia({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  if (!(await isAuthed())) redirect("/admin/login");
  const { deleted } = await searchParams;
  const files = await listUploads();
  const index = await usageIndex();

  return (
    <>
      <header className="adm-page-head">
        <div><h1>Media library</h1><p>Uploaded images (featured + inside blog content). Delete only when no page or post uses them.</p></div>
        <FileImage aria-hidden="true" />
      </header>
      {deleted && <div className="adm-alert">Image deleted — it was not in use.</div>}

      <div className="adm-panel">
        {files.length === 0 ? (
          <p className="adm-hint">No uploads yet — upload from the blog editor and they show up here.</p>
        ) : (
          <>
            <table className="adm-table">
              <thead><tr><th>Image</th><th>File</th><th>Used by</th><th></th></tr></thead>
              <tbody>
                {files.map((f) => {
                  const users = index.get(f.src) ?? [];
                  return (
                    <tr key={f.src}>
                      <td style={{ width: 120 }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={f.url || f.src} alt={f.alt} loading="lazy" width={220} height={110} style={{ borderRadius: 8, objectFit: "cover", width: 110, height: 55 }} /></td>
                      <td><code style={{ fontSize: 11 }}>{f.src}</code><div className="adm-muted" style={{ fontSize: 10.5 }}>{f.alt || "(no alt)"}</div></td>
                      <td>{users.length ? users.map((u) => <Link key={u} className="adm-link" href={`/admin/blog/${encodeURIComponent(u)}`} style={{ display: "block", fontSize: 12 }}>{u}</Link>) : <span className="adm-muted">Not in use</span>}</td>
                      <td className="adm-row-actions">
                        {users.length === 0 ? (
                          <form action="/api/admin/media-delete" method="get">
                            <input type="hidden" name="src" value={f.src} />
                            <button className="adm-iconbtn adm-danger" type="submit" aria-label="Delete unused image"><Trash2 size={14} /></button>
                          </form>
                        ) : (
                          <span className="adm-hint">in use — cannot delete</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
      <p className="adm-hint">Site art (fleet/service photos), logos and the hero image live in public/images as site files — they are edited in code, not here.</p>
    </>
  );
}

type UploadRow = { src: string; url?: string; alt?: string };

function listUploads(): UploadRow[] {
  const dir = path.join(process.cwd(), "public", "uploads");
  const out: UploadRow[] = [];
  try {
    const walk = (d: string) => {
      for (const f of fs.readdirSync(d, { withFileTypes: true })) {
        const full = path.join(d, f.name);
        if (f.isDirectory()) walk(full);
        else if (/\.(webp|jpe?g|png|avif|gif)$/i.test(f.name)) {
          const rel = full.replace(/\\/g, "/").replace(/^.*?(?=public\/)/, "").replace(/^public/, "");
          out.push({ src: rel, alt: path.basename(f.name) });
        }
      }
    };
    walk(dir);
  } catch { /* empty */ }
  return out;
}

function usageIndex(): Map<string, string[]> {
  const index = new Map<string, string[]>();
  const storeDir = path.join(process.cwd(), "data", "admin");
  try {
    const blog = JSON.parse(fs.readFileSync(path.join(storeDir, "blog.json"), "utf8")) as { posts?: Array<{ id: string; image?: string; contentHtml?: string }> };
    for (const p of blog.posts ?? []) {
      const add = (src: string) => index.set(src, [...(index.get(src) ?? []), p.id]);
      if (p.image?.startsWith("/uploads/")) add(p.image);
      for (const m of (p.contentHtml ?? "").matchAll(/<img[^>]+src="([^"]+)"/g)) add(m[1]);
    }
  } catch { /* empty blog */ }
  return index;
}

void readBlobListIfConfigured;
