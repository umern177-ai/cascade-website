// Admin content store (brief Section 19.10): a small file-backed CMS.
// Every editable space the SEO writer needs lives here — page meta tags,
// FAQ sets, home/hub copy, city meta, blog posts (with images inside the
// content), slugs and redirects. The site reads these JSON files as
// overrides over the code defaults, so a published edit is a data change,
// never a code change.
//
// Files (all under data/admin/):
//   site-content.json  — FAQ sets, home + hub copy
//   meta.json          — per-path { title, description } overrides
//   city-meta.json     — meta overrides for city + state pages (710 + 48)
//   blog.json          — admin blog posts + edits/deletes of the seeded post
//   redirects.json     — { from, to, status } list (merged into next.config)
//   blog-overrides.json — field overrides for existing code posts
import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

export type Faq = { q: string; a: string };

export type AdminContent = {
  homeFaqs?: Faq[];
  faqsExtra?: Faq[];
  contactFaqs?: Faq[];
  homeHero?: { lead?: string; sub?: string };
  heritage?: { heading?: string; body?: string };
  servicesHub?: { heading?: string; sub?: string };
  fleetHub?: { heading?: string; sub?: string };
};

export type MetaRobots = "index-follow" | "noindex-follow" | "noindex-nofollow" | "index-nofollow";

export type AdminMeta = {
  title?: string;
  description?: string;
  canonical?: string | null;  // absolute URL or /path/; empty = self-referencing
  robots?: MetaRobots;        // default "index-follow"
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;           // /uploads/… or absolute; empty = page default
};
export type MetaFile = Record<string, AdminMeta>;

export type AdminPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  tag: string;
  author: string;
  readMinutes?: number;
  image?: string; // e.g. /uploads/2026/…webp
  ogImage?: string;       // social sharing image
  seoTitle?: string;      // admin SEO title (meta bundle per path preferred)
  canonical?: string;
  noindex?: boolean;
  categories?: string[];  // multi-select; tag stays for back-compat
  publishAt?: string;     // ISO date — post is hidden until this date
  updatedAt?: string;     // last save timestamp (rendered as Updated)
  imageAlt?: string;
  excerpt?: string;       // short summary for list pages (defaults to description)
  tags?: string[];        // free tags beyond categories
  contentHtml: string; // sanitized server-side on save
  draft?: boolean;
};

export type BlogFile = {
  posts: AdminPost[];                    // brand-new posts + overridden base posts
  deletedBaseSlugs?: string[];           // hides a code-seeded post
  baseImported?: boolean;                // built-in guides migrated into posts (Phase 2)
  categories?: BlogCategory[];           // managed category list
  authors?: AuthorProfile[];             // team members usable as blog authors
};

export type BlogCategory = {
  name: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  metaDescription?: string;
};

export type AuthorProfile = { name: string; bio?: string };

export type AdminRedirect = {
  id: string;
  from: string;
  to: string; // empty for 410
  type: 301 | 302 | 307 | 410;
  status?: "active" | "inactive";   // runtime engine applies active rules only
  match?: "exact" | "wildcard";
  note?: string;
  hits?: number;
  last_hit?: string;
};

const DIR = path.join(process.cwd(), "data", "admin");

/* ---------- durable storage (Admin Panel Upgrade Phase 1) ----------
   On localhost the store is the plain files above. On hosting (Vercel) the
   file system is read-only, so every admin save must ALSO live in Vercel
   Blob. When BLOB_READ_WRITE_TOKEN is set, reads check Blob first (seeded
   from the local files on first touch) and writes go to Blob + locally for
   the dev copy. Blob paths are namespaced with an HMAC of a fixed label so
   lead/SEO data is not guessable. Everything else keeps using the files —
   zero behaviour change until the token exists. */
import { head, put } from "@vercel/blob";
import crypto from "node:crypto";

export function blobReady(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

function blobNamespace(): string {
  const secret = process.env.ADMIN_PASSWORD || "cascade-admin";
  return "cb-admin-" + crypto.createHmac("sha256", secret).update("cb-admin-store-v1").digest("hex").slice(0, 16);
}

// Reads the JSON value for `name` from Blob, or null when not there / unavailable.
async function readBlob<T>(name: string): Promise<T | null> {
  if (!blobReady()) return null;
  try {
    const meta = await head(`${blobNamespace()}/${name}`);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (JSON.parse(await res.text()) as T) ?? null;
  } catch {
    return null; // not yet stored / no network — local file value wins
  }
}

async function writeBlob(name: string, data: unknown): Promise<void> {
  if (!blobReady()) return;
  try {
    await put(`${blobNamespace()}/${name}`, JSON.stringify(data, null, 2) + "\n", {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } catch (err) {
    console.error("blob write failed:", err);
  }
}

// Shared low-level store helpers (also used by the leads module).
export async function readFile<T extends object>(name: string, fallback: T): Promise<T> {
  if (blobReady()) {
    const remote = await readBlob<T>(name);
    if (remote !== null) return remote;
    // first touch on a new deployment: push the local (seed) file to Blob
    try {
      await writeFile(name, JSON.parse(await fs.readFile(path.join(DIR, name), "utf8")));
    } catch {
      /* nothing local to seed */
    }
    try {
      return JSON.parse(await fs.readFile(path.join(DIR, name), "utf8")) as T;
    } catch {
      return fallback;
    }
  }
  try {
    return JSON.parse(await fs.readFile(path.join(DIR, name), "utf8")) as T;
  } catch {
    return fallback;
  }
}

export async function writeFile(name: string, data: unknown): Promise<void> {
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(path.join(DIR, name), JSON.stringify(data, null, 2) + "\n", "utf8");
  await writeBlob(name, data);
}

/* ---------- site content (FAQs + home/hub copy) ---------- */

const EMPTY_CONTENT: AdminContent = {};

export async function getContent(): Promise<AdminContent> {
  return readFile("site-content.json", EMPTY_CONTENT);
}

export async function saveContent(patch: AdminContent): Promise<AdminContent> {
  const merged = { ...(await getContent()), ...patch };
  await writeFile("site-content.json", merged);
  return merged;
}

/* ---------- meta overrides (per path) ---------- */

const EMPTY_META: MetaFile = {};

export async function getMetaFile(): Promise<MetaFile> {
  return readFile("meta.json", EMPTY_META);
}

export async function setMetaEntry(pathname: string, value: AdminMeta | null): Promise<MetaFile> {
  const file = await getMetaFile();
  const hasAny =
    value &&
    !!(value.title?.trim() || value.description?.trim() || value.canonical?.trim() || value.robots || value.ogTitle?.trim() || value.ogDescription?.trim() || value.ogImage?.trim());
  if (!value || !hasAny) delete file[pathname];
  else file[pathname] = value;
  await writeFile("meta.json", file);
  return file;
}

/* ---------- city meta overrides ---------- */

const EMPTY_CITY: MetaFile = {};

export async function getCityMetaFile(): Promise<MetaFile> {
  return readFile("city-meta.json", EMPTY_CITY);
}

export async function setCityMetaEntry(pathname: string, value: AdminMeta | null): Promise<MetaFile> {
  const file = await getCityMetaFile();
  if (!value || (!value.title?.trim() && !value.description?.trim())) delete file[pathname];
  else file[pathname] = value;
  await writeFile("city-meta.json", file);
  return file;
}

/* ---------- blog posts ---------- */

const EMPTY_BLOG: BlogFile = { posts: [], deletedBaseSlugs: [] };
export type BasePost = {
  base: true;
  slug: string;
  title: string;
  description: string;
  date: string;
  tag: string;
  author: string;
  readMinutes: number;
  contentHtml: string;
  image?: string;
  imageAlt?: string;
};

function baseHtml(intro: string, sections: { h: string; paras?: string[]; list?: string[] }[]): string {
  return (
    `<p class="pp-article-intro">${intro}</p>\n\n` +
    sections
      .map((s) => {
        const paras = (s.paras ?? []).map((p) => `<p>${p}</p>`).join("\n");
        const list = s.list ? `<ul class="pp-checklist pp-checklist-2col">${s.list.map((li) => `<li>${li}</li>`).join("")}</ul>` : "";
        return `<h2>${s.h}</h2>\n${paras}${list}`;
      })
      .join("\n")
  );
}

export async function getBasePosts(): Promise<BasePost[]> {
  const { POSTS } = await import("@/lib/blog-data");
  return POSTS.map((p) => ({
    base: true,
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    tag: p.tag,
    author: p.author,
    readMinutes: p.readMinutes,
    image: p.featuredImage,
    imageAlt: p.imageAlt,
    contentHtml: baseHtml(p.intro, p.sections),
  }));
}

export async function getBlogFile(): Promise<BlogFile> {
  const file = await readFile("blog.json", EMPTY_BLOG);
  return ensureBuiltInPostsImported(file);
}

/* ---------- built-in posts import (Admin Panel Upgrade Phase 2) ----------
   The code-seeded guides move into the durable store exactly once: every
   field converted to a standalone admin post ("seed:slug"), the original
   hidden by slug, URLs/dates/images preserved. After this, posts live in
   data/admin/blog.json (+ Blob) and are edited like any other post. */
async function ensureBuiltInPostsImported(file: BlogFile): Promise<BlogFile> {
  if (file.baseImported) return file;
  const { POSTS } = await import("@/lib/blog-data");
  const existingSlugs = new Set(file.posts.map((p) => p.slug));
  const hide = new Set(file.deletedBaseSlugs ?? []);
  let changed = false;
  for (const p of POSTS) {
    if (existingSlugs.has(p.slug)) {
      if (!hide.has(p.slug)) { hide.add(p.slug); changed = true; }
      continue;
    }
    // one-time conversion in the same shape the editor would save
    file.posts.push({
      id: "seed:" + p.slug,
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      tag: p.tag,
      author: p.author,
      readMinutes: p.readMinutes,
      image: p.featuredImage,
      imageAlt: p.imageAlt,
      categories: [p.tag],
      contentHtml: baseHtml(p.intro, p.sections),
    });
    hide.add(p.slug);
    changed = true;
  }
  if (changed) {
    file.deletedBaseSlugs = [...hide];
    file.baseImported = true;
    await writeFile("blog.json", file);
  }
  return file;
}

// What the PUBLIC site shows: base posts (lib/blog-data) with admin overrides
// applied and deletions honoured, plus every brand-new admin post (drafts out).
export async function getPublishedPosts(): Promise<(BasePost | AdminPost)[]> {
  const [base, file] = await Promise.all([getBasePosts(), getBlogFile()]);
  const over = new Map(file.posts.map((p) => ["base:" + p.id.replace("base:", ""), p]));
  const out: (BasePost | AdminPost)[] = [];
  for (const b of base) {
    if (file.deletedBaseSlugs?.includes(b.slug)) continue;
    const o = file.posts.find((p) => p.id === "base:" + b.slug);
    out.push(
      o ?? b
    );
  }
  for (const p of file.posts) {
    if (p.id.startsWith("base:")) continue;
    if (!p.draft) out.push(p);
  }
  return out;
}

export async function savePost(post: AdminPost): Promise<void> {
  const file = await getBlogFile();
  const i = file.posts.findIndex((p) => p.id === post.id);
  if (i >= 0) file.posts[i] = post;
  else file.posts.push(post);
  await writeFile("blog.json", file);
}

export async function deleteAdminPost(id: string): Promise<void> {
  const file = await getBlogFile();
  if (id.startsWith("base:")) {
    const slug = id.replace("base:", "");
    file.deletedBaseSlugs = [...(file.deletedBaseSlugs ?? []), slug];
  }
  file.posts = file.posts.filter((p) => p.id !== id);
  await writeFile("blog.json", file);
}

/* ---------- blog categories + authors (Admin Panel Upgrade Phase 2) ---------- */

export async function getBlogCategories(): Promise<BlogCategory[]> {
  return (await getBlogFile()).categories ?? [];
}

export async function saveBlogCategories(list: BlogCategory[]): Promise<void> {
  const file = await getBlogFile();
  file.categories = list;
  await writeFile("blog.json", file);
}

export async function getAuthors(): Promise<AuthorProfile[]> {
  return (await getBlogFile()).authors ?? [];
}

export async function saveAuthors(list: AuthorProfile[]): Promise<void> {
  const file = await getBlogFile();
  file.authors = list;
  await writeFile("blog.json", file);
}

/* ---------- deep page content — EVERY field of a page ----------
   The WordPress-style editor opens a page and shows all its copy as
   individual fields. Values are stored per path as a fields map (template
   keys documented in lib/admin/page-fields.ts) plus the FAQ list. Empty
   fields / removal fall back to the built-in copy. */

export type PageBody = { fields?: Record<string, string>; faqs?: Faq[]; schema?: string; sitemapExclude?: boolean; versions?: PageBodyVersion[] };
export type PageBodyVersion = { at: string; by: string; fields?: Record<string, string>; faqs?: Faq[] };
export type PageBodyFile = Record<string, PageBody>;

export async function getPageBodyFile(): Promise<PageBodyFile> {
  return readFile("page-content.json", {});
}

function meaningfulBody(value: PageBody): boolean {
  if (value.faqs && value.faqs.length) return true;
  if (!value.fields) return false;
  return Object.values(value.fields).some((v) => v && v.trim());
}

export async function setPageBodyEntry(pathname: string, value: PageBody | null, opts?: { by?: string; keepVersions?: boolean }): Promise<PageBodyFile> {
  const file = await getPageBodyFile();
  const previous = file[pathname];
  const cleaned: PageBody = (() => {
    if (!value) return { fields: undefined, faqs: undefined };
    const fields: Record<string, string> = {};
    for (const [k, v] of Object.entries(value.fields ?? {})) {
      if (v && v.trim()) fields[k] = v.trim();
    }
    return {
      fields: Object.keys(fields).length ? fields : undefined,
      faqs: value.faqs && value.faqs.length ? value.faqs : undefined,
      schema: value.schema !== undefined ? value.schema?.trim() || undefined : previous?.schema,
      sitemapExclude: value.sitemapExclude !== undefined ? value.sitemapExclude : previous?.sitemapExclude,
    };
  })();
  if (!meaningfulBody(cleaned)) {
    delete file[pathname];
  } else {
    // keep up to 10 versions of the previous content (restore + diff later)
    if (previous) {
      const versions = previous.versions ?? [];
      versions.unshift({ at: new Date().toISOString(), by: opts?.by || "admin", fields: previous.fields, faqs: previous.faqs });
      cleaned.versions = versions.slice(0, 10);
    }
    file[pathname] = cleaned;
  }
  await writeFile("page-content.json", file);
  return file;
}

// restore an older version (the current one is kept as the newest version)
export async function restorePageBodyVersion(pathname: string, index: number): Promise<PageBodyFile | null> {
  const file = await getPageBodyFile();
  const current = file[pathname];
  const versions = current?.versions ?? [];
  const v = versions[index];
  if (!v) return null;
  return setPageBodyEntry(pathname, { fields: v.fields, faqs: v.faqs, sitemapExclude: current?.sitemapExclude }, { by: "restore" });
}

/* ---------- drafts (section 3.4): Save Draft stores a private copy that
   does NOT touch the live page; publish moves it over. ---------- */
const DRAFTS = "page-drafts.json";
export async function getPageDrafts(): Promise<Record<string, PageBody>> {
  return readFile(DRAFTS, {});
}
export async function savePageDraft(pathname: string, body: PageBody): Promise<void> {
  const file = await getPageDrafts();
  file[pathname] = { ...body };
  await writeFile(DRAFTS, file);
}
export async function deletePageDraft(pathname: string): Promise<void> {
  const file = await getPageDrafts();
  delete file[pathname];
  await writeFile(DRAFTS, file);
}

export async function getPageBody(pathname: string): Promise<PageBody | undefined> {
  return (await getPageBodyFile())[pathname];
}

/* ---------- site config (sitewide schema + custom head code) ----------
   The SEO team can add sitewide JSON-LD (validated) and tracking snippets
   (e.g. Microsoft Clarity) from the admin without a code deployment. */
export type SiteConfig = {
  customSchema?: string;
  headHtml?: string;
  gaMeasurementId?: string;
  clarityId?: string;
  global?: GlobalFacts;       // admin-editable site facts (Phase 3)
  robotsOverride?: string;    // custom robots.txt body (Phase 5)
  llmsOverride?: string;      // custom llms.txt body (Phase 5)
  sitemapExclude?: string[];  // per-path sitemap exclusions (Phase 5)
};

// Admin-editable global facts. Fields match lib/site-data SITE names.
export type GlobalFacts = {
  phoneDisplay?: string;
  phoneTel?: string;
  phoneNote?: string;
  email?: string;
  quoteLabel?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  years?: string;
  coverage?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
};

export async function getSiteConfig(): Promise<SiteConfig> {
  return readFile("site-config.json", {});
}

export async function saveSiteConfig(patch: SiteConfig): Promise<SiteConfig> {
  const merged = { ...(await getSiteConfig()), ...patch };
  await writeFile("site-config.json", merged);
  return merged;
}

/* ---------- redirects ---------- */

const EMPTY_REDIRECTS: AdminRedirect[] = [];

export async function getRedirects(): Promise<AdminRedirect[]> {
  const raw = await readFile<AdminRedirect[] & { type?: number }>("redirects.json", EMPTY_REDIRECTS as unknown as AdminRedirect[]);
  // Legacy rows used status: 301|302 — normalize to type + active once.
  return raw.map((r) => normalizeRedirect(r));
}

// One-time field normalization: status: 301 → type: 301, status: "active".
export function normalizeRedirect(r: Partial<AdminRedirect> & { status?: number | string; type?: number }): AdminRedirect {
  const rawType = (r as { type?: unknown }).type;
  void rawType;
  let type = ((r.type as unknown as number) ?? 301) as AdminRedirect["type"];
  let status = (r.status ?? "active") as AdminRedirect["status"];
  if (typeof (r as { status?: unknown }).status === "number") {
    type = (r.status as unknown as number) as AdminRedirect["type"];
    status = "active";
  }
  const out: AdminRedirect = {
    id: String(r.id),
    from: String(r.from),
    to: String(r.to ?? ""),
    type,
    status: status === "inactive" ? "inactive" : "active",
    note: r.note,
    hits: r.hits,
    last_hit: r.last_hit,
  };
  return out;
}

export async function saveRedirects(list: AdminRedirect[]): Promise<void> {
  await writeFile("redirects.json", list);
}

/* ---------- history log ----------
   Every admin save (meta, page content, blog post, redirect, schema/codes,
   on-page pencil edit) appends one row here. The admin "History log" page
   shows it so the team can always see who-changed-what-and-when. History is
   best-effort: it must never break a real save, so every call is guarded. */
export type HistoryEntry = { id: string; at: string; kind: string; path: string; summary: string };

const HISTORY_MAX = 500;

export async function getHistory(): Promise<HistoryEntry[]> {
  return readFile("history.json", [] as HistoryEntry[]);
}

export async function logHistory(kind: string, pathname: string, summary: string): Promise<void> {
  try {
    const list = await getHistory();
    const entry: HistoryEntry = {
      id: "h" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      at: new Date().toISOString(),
      kind,
      path: pathname,
      summary: summary.slice(0, 200),
    };
    await writeFile("history.json", [entry, ...list].slice(0, HISTORY_MAX));
  } catch (err) {
    // never stop a save because history could not be written
    console.error("history log failed:", err);
  }
}

// Human label used by the History page.
export const HISTORY_KIND_LABELS: Record<string, string> = {
  "meta": "Meta tags",
  "city-meta": "Location meta",
  "content": "FAQs & hub copy",
  "page": "Page content",
  "page-field": "On-page edit",
  "meta-remove": "Meta removed",
  "post-save": "Blog post",
  "post-delete": "Blog post deleted",
  "redirect-add": "Redirect added",
  "redirect-delete": "Redirect removed",
  "redirect-import": "Redirects import",
  "config": "Schema & tracking",
};
