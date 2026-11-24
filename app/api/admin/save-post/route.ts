// Admin API: save a blog post (POST, JSON). Used by the BlogForm because a
// plain API POST is more reliable across dev/preview hosts than a
// client-component server action. Auth is checked here, content is sanitized
// server-side, and the affected pages are re-validated so the post is live.
//
// Also handles (SEO checklist #14): slug uniqueness validation, automatic
// 301 redirect when a post slug changes, and per-post SEO bundle writes
// (metaTitle override, canonical, noindex, OG image) into meta.json.
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/admin/auth";
import { AdminPost, savePost, deleteAdminPost, getBlogFile, setMetaEntry, getRedirects, saveRedirects, getPublishedPosts, logHistory } from "@/lib/admin/store";
import { sanitizeHtml } from "@/lib/admin/sanitize";
import { slugify } from "@/lib/admin/slugify";
import { pageCatalog } from "@/lib/admin/page-catalog";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as
    | { post?: Omit<AdminPost, "contentHtml"> & { contentHtml: string }; oldSlug?: string; seoBundle?: { seoTitle?: string; canonical?: string; noindex?: boolean; ogImage?: string; ogTitle?: string; ogDescription?: string } }
    | null;
  const post = body?.post;
  if (!post || !post.id || !post.title?.trim()) {
    return NextResponse.json({ ok: false, error: "invalid-post" }, { status: 400 });
  }
  const cleanSlug = slugify(post.slug);
  if (!cleanSlug) return NextResponse.json({ ok: false, error: "invalid-slug" }, { status: 400 });

  // slug uniqueness (consultant #14): the URL must not collide with another
  // post (this one excluded) or an existing static page.
  const [catalog, published, file] = await Promise.all([pageCatalog(), getPublishedPosts(), getBlogFile()]);
  const duplicatePost = published.some((p) => p.slug === cleanSlug && p.slug !== (body?.oldSlug ?? "") && !("base:" + p.slug === post.id));
  const duplicatePage = catalog.some((c) => c.path === `/blog/${cleanSlug}/` && c.type !== "blog");
  if (duplicatePost || duplicatePage) {
    return NextResponse.json({ ok: false, error: `slug-taken:/blog/${cleanSlug}/` }, { status: 409 });
  }

  // auto 301 when the slug changed (consultant #4): old → new stored so the
  // next build serves the redirect without anyone touching a CSV.
  if (body?.oldSlug && body.oldSlug !== cleanSlug && !file.posts.some((p) => p.id === post.id && !body.oldSlug)) {
    const rules = await getRedirects();
    if (!rules.some((r) => r.from === `/blog/${body.oldSlug}/`)) {
      const next = [
        ...rules.filter((r) => r.to !== `/blog/${cleanSlug}/` || r.from !== `/blog/${body.oldSlug}/`),
        { id: "r" + Date.now(), from: `/blog/${body.oldSlug}/`, to: `/blog/${cleanSlug}/`, type: 301 as const, status: "active" as const, note: `Slug change: ${post.title.slice(0, 60)}` },
      ];
      await saveRedirects(next);
    }
  }

  const cleanHtml = sanitizeHtml(post.contentHtml || "");
  const isPublished = !post.draft && !(post.publishAt && post.publishAt > new Date().toISOString());

  // ALT text is REQUIRED to publish (Admin Panel Upgrade section 4.3):
  // featured image plus every <img> inside the content.
  if (isPublished) {
    const missing: string[] = [];
    if (post.image && !post.imageAlt?.trim()) missing.push("featured image");
    for (const m of cleanHtml.matchAll(/<img\b[^>]*>/gi)) {
      if (!/\balt\s*=\s*["'][^"']+["']/i.test(m[0])) missing.push(m[0].slice(0, 60));
    }
    if (missing.length) {
      return NextResponse.json({
        ok: false,
        error: `Publishing blocked — image(s) without ALT text: ${missing.slice(0, 3).join(", ")}. Add ALT text or save as draft.`,
      }, { status: 400 });
    }
  }

  // Reading time auto-calculated when the writer leaves it 0 (from the words).
  const wordCount = cleanHtml.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  const finalReadMinutes = post.readMinutes || Math.max(1, Math.round(wordCount / 200));
  const now = new Date().toISOString();
  await savePost({
    ...post,
    excerpt: (post as { excerpt?: string }).excerpt?.trim() || undefined,
    tags: (post as { tags?: string[] }).tags?.length ? (post as { tags?: string[] }).tags : undefined,
    slug: cleanSlug,
    author: post.author || "Cascade Dispatch Team",
    tag: (!post.categories || post.categories.length === 0) ? (post.tag || "Guides") : post.categories[0],
    categories: post.categories?.length ? post.categories : post.tag ? [post.tag] : undefined,
    readMinutes: finalReadMinutes,
    contentHtml: cleanHtml,
    updatedAt: now,
    // schedule: a publish date in the future keeps the public page hidden
    // but the editor can still draft it (same rule the list uses).
  });

  // revalidate affected category pages too (posts flow through them)
  for (const cat of post.categories ?? []) {
    revalidatePath(`/blog/category/${slugify(cat)}/`);
  }
  revalidatePath("/blog/category/");

  // author bio — kept in the blog authors list so the public post can show it
  const authorBio = (body as { authorBio?: string } | null)?.authorBio?.trim();
  if (post.author && authorBio) {
    const { getAuthors, saveAuthors } = await import("@/lib/admin/store");
    const authors = await getAuthors();
    const existing = authors.find((a) => a.name === post.author);
    if (existing) {
      if (existing.bio !== authorBio) {
        existing.bio = authorBio;
        await saveAuthors(authors);
      }
    } else {
      await saveAuthors([...authors, { name: post.author, bio: authorBio }]);
    }
  }

  // per-post SEO bundle (consultant #2 + #7): written to meta.json, which
  // blog/[slug] generateMetadata reads through withOverrides.
  const metaFields = body?.seoBundle;
  if (metaFields && (metaFields.seoTitle?.trim() || metaFields.canonical?.trim() || metaFields.noindex || metaFields.ogImage?.trim() || metaFields.ogTitle?.trim() || metaFields.ogDescription?.trim())) {
    await setMetaEntry(`/blog/${cleanSlug}/`, {
      title: metaFields.seoTitle?.trim() || undefined,
      description: undefined,
      canonical: metaFields.canonical?.trim() || null,
      robots: metaFields.noindex ? "noindex-follow" : "index-follow",
      ogTitle: metaFields.ogTitle?.trim() || undefined,
      ogDescription: metaFields.ogDescription?.trim() || undefined,
      ogImage: metaFields.ogImage?.trim() || undefined,
    });
  } else {
    // clear any stale bundle if the writer emptied the fields
    await setMetaEntry(`/blog/${cleanSlug}/`, null);
  }

  revalidatePath("/blog/");
  revalidatePath("/blog/" + cleanSlug + "/");
  if (body?.oldSlug && body.oldSlug !== cleanSlug) revalidatePath("/blog/" + body.oldSlug + "/");
  revalidatePath("/sitemap-pages.xml");
  revalidatePath("/", "layout");
  const slugChanged = !!body?.oldSlug && body.oldSlug !== cleanSlug;
  await logHistory(
    "post-save",
    "/blog/" + cleanSlug + "/",
    (post.draft ? "Draft saved: " : "Saved: ") + post.title + (post.publishAt && post.publishAt > now ? " (scheduled for " + post.publishAt.slice(0, 10) + ")" : "") + (slugChanged ? " (slug renamed from /blog/" + body?.oldSlug + "/ — auto 301 added)" : ""),
  );
  return NextResponse.json({ ok: true, slug: cleanSlug });
}

// DELETE removes an override or retires a built-in guide.
export async function DELETE(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  }
  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  if (!id) return NextResponse.json({ ok: false, error: "no-id" }, { status: 400 });
  const doomed = (await getBlogFile()).posts.find((p) => p.id === id);
  await deleteAdminPost(id);
  await logHistory("post-delete", "/admin/blog", "Deleted " + (doomed ? `“${doomed.title}”` : "post " + id));
  revalidatePath("/blog/");
  revalidatePath("/sitemap-pages.xml");
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
