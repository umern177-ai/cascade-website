"use client";

// Blog editor: title → live slug suggestion, meta description with length
// counter, a featured image, and images INSIDE the content — upload once,
// click, and it drops in at the cursor as a proper <figure>.
// Saving goes through /api/admin/save-post (cookie-authenticated, sanitized
// server-side); content that can run scripts never leaves the browser.
import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { slugify } from "@/lib/admin/slugify";

export type EditorPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  tag: string;
  author: string;
  readMinutes?: number;
  image?: string;
  imageAlt?: string;
  contentHtml: string;
  draft?: boolean;
  isBase?: boolean;
};

export default function BlogForm({ post, saved }: { post: EditorPost; saved?: boolean }) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [slugLocked, setSlugLocked] = useState(!!post.isBase && !!post.slug);
  const [contentHtml, setContentHtml] = useState(post.contentHtml);
  const [image, setImage] = useState(post.image ?? "");
  const [featuredAlt, setFeaturedAlt] = useState(post.imageAlt ?? "");
  const [description, setDescription] = useState(post.description);
  const [dateVal, setDateVal] = useState(post.date);
  const [tag, setTag] = useState(post.tag);
  const [author, setAuthor] = useState(post.author);
  const [readMinutes, setReadMinutes] = useState(post.readMinutes ?? 0);
  const [draft, setDraft] = useState(!!post.draft);
  // SEO bundle + scheduling + categories (consultant checklist #2, #5, #14)
  const [seoTitle, setSeoTitle] = useState((post as { seoTitle?: string }).seoTitle ?? "");
  const [canonical, setCanonical] = useState((post as { canonical?: string }).canonical ?? "");
  const [noindex, setNoindex] = useState(!!(post as { noindex?: boolean }).noindex);
  const [ogImage, setOgImage] = useState((post as { ogImage?: string }).ogImage ?? "");
  const [publishAt, setPublishAt] = useState((post as { publishAt?: string }).publishAt ?? "");
  const [categories, setCategories] = useState<string[]>((post as { categories?: string[] }).categories ?? (post.tag ? [post.tag] : []));
  const [uploading, startUpload] = useTransition();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(!!saved);
  const [tagInput, setTagInput] = useState("");
  function addCategory(): void {
    const t = tagInput.trim();
    if (t && !categories.includes(t)) setCategories([...categories, t]);
    setTagInput("");
  }
  const [picker, setPicker] = useState(false);
  const [pickerList, setPickerList] = useState<{ path: string; title: string }[]>([]);
  async function openPicker(): Promise<void> {
    setPicker(true);
    try {
      const res = await fetch("/api/admin/page-catalog", { headers: { "Cache-Control": "no-cache" } });
      const j = await res.json();
      if (j.ok) setPickerList((j.catalog as { path: string; title: string }[]).filter((c) => c.path !== "/"));
    } catch { setPicker(false); }
  }
  function insertLink(page: { path: string; title: string }): void {
    wrapSelection('<a href="' + page.path + '">', "</a>");
    setPicker(false);
  }
  const [previewKey, setPreviewKey] = useState(0);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const words = useMemo(() => contentHtml.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length, [contentHtml]);
  const readMin = Math.max(1, Math.round(words / 200));

  function insertAtCursor(text: string): void {
    const ta = areaRef.current;
    if (!ta) { setContentHtml((c) => c + text); return; }
    const s = ta.selectionStart ?? contentHtml.length;
    const e = ta.selectionEnd ?? contentHtml.length;
    const next = contentHtml.slice(0, s) + text + contentHtml.slice(e);
    setContentHtml(next);
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(s + text.length, s + text.length); });
  }
  function wrapSelection(before: string, after: string): void {
    const ta = areaRef.current;
    if (!ta) return;
    const s = ta.selectionStart ?? 0;
    const e = ta.selectionEnd ?? 0;
    const selected = contentHtml.slice(s, e) || "text";
    insertAtCursor(before + selected + after);
  }

  async function toWebP(file: File): Promise<File> {
    // auto-convert any raster upload to WebP (consultant #10) — no Photoshop step
    if (file.type === "image/webp" || file.type === "image/svg+xml") return file;
    return new Promise((resolve) => {
      const img = document.createElement("img") as HTMLImageElement;
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d")?.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(img.src);
            resolve(blob ? new File([blob], file.name.replace(/.[^.]+$/, "") + ".webp", { type: "image/webp" }) : file);
          },
          "image/webp",
          0.85
        );
      };
      img.onerror = () => resolve(file);
    });
  }

  function onUpload(file: File, mode: "featured" | "content"): void {
    setError(null);
    startUpload(async () => {
      const webp = await toWebP(file);
      const fd = new FormData();
      fd.append("file", webp);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const j = await res.json();
        if (j.error) { setError(j.error); return; }
        if (mode === "featured") setImage(j.src);
        else insertAtCursor(`\n<figure><img src="${j.src}" alt="${(featuredAlt || title).replace(/"/g, "&quot;")}" width="900" height="600" /><figcaption></figcaption></figure>\n`);
        setPreviewKey((k) => k + 1);
      } catch { setError("Upload failed — check your connection."); }
    });
  }

  async function onSave(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !slug) { setError("Title and slug are required."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/save-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post: { ...post, title, slug, description, date: dateVal, tag: categories[0] || "Guides", author, readMinutes, image, imageAlt: featuredAlt, contentHtml, draft, ogImage, noindex, publishAt: publishAt || undefined, categories },
          oldSlug: post.isBase ? post.slug : undefined,
          seoBundle: { seoTitle, canonical, noindex, ogImage, ogTitle: seoTitle, ogDescription: description },
        }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) {
        setError(j.error === "not-authenticated" ? "Session expired — reload this page and log in again." : j.error || "Save failed.");
        setSaving(false);
        return;
      }
      setOk(true);
      setSaving(false);
      router.refresh();
      router.push("/admin/blog/" + encodeURIComponent(post.id) + "?saved=1");
    } catch { setError("Save failed — try again."); setSaving(false); }
  }

  return (
    <form onSubmit={onSave} className="adm-form">
      <input type="hidden" name="id" value={post.id} />
      <input type="hidden" name="image" value={image} />

      {ok && <div className="adm-alert">Saved — the site was re-validated.</div>}
      {error && <div className="adm-alert adm-alert-err">{error}</div>}

      <div className="adm-panel">
        <h2>Post details</h2>
        <div className="adm-grid2">
          <div>
            <label className="adm-label" htmlFor="title">Title</label>
            <input id="title" className="adm-input" required value={title} onChange={(e) => { setTitle(e.target.value); if (!slugLocked) setSlug(slugify(e.target.value)); }} />
          </div>
          <div>
            <label className="adm-label" htmlFor="slug">URL slug (/blog/<b>{slug}</b>/)</label>
            <div className="adm-inline">
              <input id="slug" className="adm-input" required value={slug} readOnly={slugLocked} onChange={(e) => setSlug(slugify(e.target.value))} />
              {slugLocked && <button type="button" className="adm-btn" onClick={() => setSlugLocked(false)}>Change</button>}
            </div>
            <p className="adm-hint">Changing the slug changes the published URL — a 301 redirect from the old URL is created automatically on save.</p>
          </div>
        </div>

        <label className="adm-label" htmlFor="description">Meta description <span className={(description.length < 70 || description.length > 160) ? "adm-warn-long" : "adm-ok"}>{description.length} chars (120–160 ideal)</span></label>
        <textarea id="description" className="adm-input" rows={2} required value={description} onChange={(e) => setDescription(e.target.value)} />

        <div className="adm-grid4">
          <div>
            <label className="adm-label" htmlFor="date">Date</label>
            <input id="date" type="date" className="adm-input" value={dateVal} onChange={(e) => setDateVal(e.target.value)} />
          </div>
          <div>
            <label className="adm-label" htmlFor="tag">Tag</label>
            <input id="tag" className="adm-input" value={tag} onChange={(e) => setTag(e.target.value)} />
          </div>
          <div>
            <label className="adm-label" htmlFor="author">Author</label>
            <input id="author" className="adm-input" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div>
            <label className="adm-label" htmlFor="readMinutes">Read time (0 = auto)</label>
            <input id="readMinutes" type="number" min={0} max={60} className="adm-input" value={readMinutes} onChange={(e) => setReadMinutes(Number(e.target.value) || 0)} />
          </div>
        </div>

        <div className="adm-field">
          <label className="adm-label">Featured image</label>
          {image && <NextImage src={image} alt={featuredAlt || "Featured image"} width={240} height={135} style={{ borderRadius: 10, display: "block", marginBottom: 8 }} unoptimized />}
          <div className="adm-inline">
            {!image && <input className="adm-input" type="file" accept="image/*" onChange={(e) => e.target.files && onUpload(e.target.files[0], "featured")} />}
            {image && (
              <>
                <label className="adm-label" style={{ margin: 0, alignSelf: "center" }}>Alt text</label>
                <input className="adm-input" id="imageAlt" value={featuredAlt} onChange={(e) => setFeaturedAlt(e.target.value)} placeholder="Describe the image for SEO" />
                <button type="button" className="adm-btn" onClick={() => setImage("")}>Remove</button>
              </>
            )}
          </div>
          {uploading && <p className="adm-hint">Uploading…</p>}
        </div>

        <label className="adm-checkrow"><input type="checkbox" checked={draft} onChange={(e) => setDraft(e.target.checked)} /> Save as draft (stays hidden from /blog/)</label>
      </div>

      <div className="adm-panel">
        <h2>SEO settings</h2>
        <label className="adm-label" htmlFor="seoTitle">SEO title <span className="adm-hint-inline">{seoTitle.length}/60 · replaces the post title in Google when set</span></label>
        <input id="seoTitle" className="adm-input" maxLength={120} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Leave empty to use the post title" />
        <label className="adm-label" htmlFor="canonical">Canonical URL <span className="adm-hint-inline">empty = self-referencing</span></label>
        <input id="canonical" className="adm-input" value={canonical} onChange={(e) => setCanonical(e.target.value)} placeholder="https://cascadecharterbus.com/blog/…/" />
        <label className="adm-checkrow"><input type="checkbox" checked={noindex} onChange={(e) => setNoindex(e.target.checked)} /> noindex — keep this URL out of Google (still visible on /blog/)</label>
        <label className="adm-label">Social sharing image (Open Graph)</label>
        <div className="adm-inline">
          {ogImage ? (
            <>
              <NextImage src={ogImage} alt="OG image" width={160} height={84} style={{ borderRadius: 8 }} unoptimized />
              <button type="button" className="adm-btn" onClick={() => setOgImage("")}>Remove</button>
            </>
          ) : (
            <input className="adm-input" type="file" accept="image/*" onChange={(e) => e.target.files && onUpload(e.target.files[0], "featured")} />
          )}
        </div>
        <p className="adm-hint">Converted to WebP automatically; a social image is cropped 1600×900 by the network.</p>
      </div>

      <div className="adm-panel">
        <h2>Publishing &amp; categories</h2>
        <div className="adm-grid2">
          <div>
            <label className="adm-label" htmlFor="publishAt">Scheduled publication (empty = published now)</label>
            <input id="publishAt" type="date" className="adm-input" value={publishAt} onChange={(e) => setPublishAt(e.target.value)} />
            <p className="adm-hint">Posts with a future date stay hidden from /blog/ until that date.</p>
          </div>
          <div>
            <label className="adm-label">Categories (multi-select)</label>
            <div className="adm-inline">
              {categories.map((t) => (
                <span key={t} className="adm-chip" style={{ margin: 0 }}>{t}</span>
              ))}
            </div>
            <div className="adm-inline" style={{ marginTop: 8 }}>
              <input className="adm-input" style={{ width: 200 }} value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add category…" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCategory(); } }} />
              <button type="button" className="adm-btn" onClick={addCategory}>Add</button>
            </div>
          </div>
        </div>
      </div>

      <div className="adm-panel">
        <h2>Content</h2>
        <div className="adm-toolbar">
          <button type="button" className="adm-tool" onClick={() => insertAtCursor("\n<h2>Section heading</h2>\n<p>First paragraph…</p>\n")}>H2</button>
          <button type="button" className="adm-tool" onClick={() => insertAtCursor("<strong>bold</strong>")}>B</button>
          <button type="button" className="adm-tool" onClick={() => insertAtCursor("<em>italic</em>")}>I</button>
          <button type="button" className="adm-tool" onClick={openPicker}>Link…</button>
          <button type="button" className="adm-tool" onClick={() => insertAtCursor("\n<ul>\n<li>Point one</li>\n<li>Point two</li>\n</ul>\n")}>Bullet list</button>
          <span className="adm-toolbar-sep" />
          <label className="adm-tool"><input type="file" accept="image/*" hidden onChange={(e) => e.target.files && onUpload(e.target.files[0], "content")} />{uploading ? "Uploading…" : "Insert image"}</label>
          <button type="button" className="adm-tool" onClick={() => insertAtCursor("\n<p>…</p>\n")}>Paragraph</button>
          <span className="adm-toolbar-spacer" />
          <span className="adm-hint">{words} words · ≈{readMin} min read</span>
        </div>
        <textarea
          ref={areaRef}
          className="adm-editor"
          rows={18}
          value={contentHtml}
          onChange={(e) => setContentHtml(e.target.value)}
          placeholder={'Write the article as HTML: <h2>…</h2>, <p>…</p>, <ul><li>…</li></ul>, <a href=…>, or use the buttons.'}
        />
        <div className="adm-toolbar">
          <button type="button" className="adm-btn" onClick={() => setPreviewKey((k) => k + 1)}>Refresh preview</button>
          <span className="adm-hint">Scripts and event handlers are stripped automatically on save.</span>
        </div>
        <div className="adm-preview" key={previewKey} dangerouslySetInnerHTML={{ __html: contentHtml || "<p><em>Nothing to preview yet.</em></p>" }} />
      </div>

      <div className="adm-actionsbar">
        <button className="adm-btn adm-btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save post"}</button>
        {slug && <a className="adm-btn" href={`/blog/${slug}/`} target="_blank" rel="noreferrer">Open live post</a>}
      </div>

      {picker && (
        <div className="adm-picker-overlay" onClick={() => setPicker(false)}>
          <div className="adm-picker" onClick={(e) => e.stopPropagation()}>
            <h3>Insert internal link</h3>
            <p className="adm-hint">Click a page — the link is inserted around your selected text.</p>
            <div className="adm-picker-list">
              {pickerList.map((pg) => (
                <button key={pg.path + pg.title} type="button" className="adm-pickerrow" onClick={() => insertLink(pg)}>
                  <strong>{pg.title}</strong>
                  <code>{pg.path}</code>
                </button>
              ))}
              {pickerList.length === 0 && <p className="adm-hint">Loading pages…</p>}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
