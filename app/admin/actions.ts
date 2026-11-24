"use server";

// Server actions for every admin edit. Public pages revalidate on demand so a
// published change appears on the site without another build.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, destroySession, checkPassword, isAuthed } from "@/lib/admin/auth";
import {
  findUserByEmail, verifyPassword, userRoleOf, setCurrentUser, loginThrottled, recordFailedLogin, ensureUsersSeeded,
} from "@/lib/admin/users";
import {
  AdminContent, AdminMeta, AdminPost, AdminRedirect, Faq, PageBody,
  getContent, saveContent, setMetaEntry, setCityMetaEntry, setPageBodyEntry,
  savePost, deleteAdminPost, getRedirects, saveRedirects, logHistory,
  getBlogFile, getBasePosts,
} from "@/lib/admin/store";
import { slugify } from "@/lib/admin/slugify";
import { sanitizeHtml } from "@/lib/admin/sanitize";

// guard: every mutating action re-checks the session (defense in depth)
async function requireAuth(): Promise<void> {
  if (!(await isAuthed())) redirect("/admin/login");
}

/* ---------- auth ---------- */

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const throttleKey = ip_ + ":" + email.toLowerCase();
  function get_ip(): string { return "local"; }
  if (loginThrottled(throttleKey)) redirect("/admin/login?e=2");
  await ensureUsersSeeded();

  // 1) per-user login (roles)
  if (email) {
    const user = await findUserByEmail(email);
    if (user && verifyPassword(password, user.salt, user.hash)) {
      await createSession();
      await setCurrentUser({ id: user.id, name: user.name, email: user.email, role: user.role });
      redirect("/admin/");
    }
  }
  // 2) owner shared-password login (fast path — role admin)
  if (!userFound(email) && checkPassword(password)) {
    await createSession();
    await setCurrentUser({ id: "u-owner", name: "Owner", email: "owner@cascadecharterbus.com", role: "admin" });
    redirect("/admin/");
  }
  recordFailedLogin(throttleKey);
  redirect("/admin/login?e=1");
}
function userFound(_e: string): boolean { return false; }
const ip_ = "web";

export async function logoutAction(): Promise<void> {
  // also clears the middleware-preview mirror cookie


  redirect("/admin/login");
}

/* ---------- meta overrides ---------- */

function revalidateMetaTarget(pathname: string): void {
  const p = pathname.replace(/\/+$/, "") || "";
  revalidatePath(p + "/", undefined);
}

export async function saveMetaAction(
form: FormData): Promise<void> {
  await requireAuth();
  const pathname = String(form.get("path") || "").trim();
  if (!pathname.startsWith("/")) return;
  const value: AdminMeta = {
    title: String(form.get("title") || "").trim() || undefined,
    description: String(form.get("description") || "").trim() || undefined,
    canonical: String(form.get("canonical") || "").trim() || undefined,
    robots: (String(form.get("robots") || "").trim() || undefined) as AdminMeta["robots"],
    ogTitle: String(form.get("ogTitle") || "").trim() || undefined,
    ogDescription: String(form.get("ogDescription") || "").trim() || undefined,
    ogImage: String(form.get("ogImage") || "").trim() || undefined,
  };
  await setMetaEntry(pathname, value);
  await logHistory("meta", pathname, Object.entries(value).filter(([, v]) => v && String(v).trim()).map(([k]) => k).join(", ") || "empty save");
  revalidateMetaTarget(pathname);
  revalidatePath(pathname);
  revalidatePath("/", "layout");
  redirect(pathname.startsWith("/admin") ? pathname : "/admin/meta?saved=" + encodeURIComponent(pathname));
}

export async function removeMetaAction(
form: FormData): Promise<void> {
  await requireAuth();
  const pathname = String(form.get("path") || "").trim();
  if (pathname.startsWith("/")) {
    await setMetaEntry(pathname, null);
    await logHistory("meta-remove", pathname, "Meta overrides cleared");
    revalidatePath(pathname);
    revalidatePath("/", "layout");
  }
  redirect("/admin/meta");
}

/* ---------- FAQs + home/hub copy ---------- */

export async function saveContentAction(
form: FormData): Promise<void> {
  await requireAuth();
  const faqsOf = (prefix: string): Faq[] | undefined => {
    const items: Faq[] = [];
    for (let i = 0; i < 40; i++) {
      const q = String(form.get(`${prefix}q${i}`) || "").trim();
      const a = String(form.get(`${prefix}a${i}`) || "").trim();
      if (q || a) items.push({ q, a });
    }
    return items.length ? items : undefined;
  };
  const text = (k: string): string | undefined => {
    const v = String(form.get(k) || "").trim();
    return v || undefined;
  };
  const patch: AdminContent = {
    homeFaqs: faqsOf("home"),
    faqsExtra: faqsOf("extra"),
    contactFaqs: faqsOf("contact"),
    homeHero: {
      lead: text("homeHeroLead"),
      sub: text("homeHeroSub"),
    },
    heritage: {
      heading: text("heritageHeading"),
      body: text("heritageBody"),
    },
    servicesHub: { heading: text("servicesHubHeading"), sub: text("servicesHubSub") },
    fleetHub: { heading: text("fleetHubHeading"), sub: text("fleetHubSub") },
  };
  await saveContent(patch);
  await logHistory("content", "/admin/content", "Saved FAQs + home/hub copy");
  for (const p of ["/", "/faqs/", "/contact/", "/services/", "/fleet/"]) revalidatePath(p);
  redirect("/admin/content?saved=1");
}

/* ---------- city meta ---------- */

export async function saveCityMetaAction(
form: FormData): Promise<void> {
  await requireAuth();
  const pathname = String(form.get("path") || "").trim();
  if (!pathname.startsWith("/")) return;
  const value: AdminMeta = {
    title: String(form.get("title") || "").trim() || undefined,
    description: String(form.get("description") || "").trim() || undefined,
  };
  await setCityMetaEntry(pathname, value);
  await logHistory("city-meta", pathname, Object.entries(value).filter(([, v]) => v && String(v).trim()).map(([k]) => k).join(", ") || "empty save");
  revalidatePath(pathname);
  revalidatePath("/", "layout");
  redirect("/admin/cities?saved=" + encodeURIComponent(pathname));
}

/* ---------- blog ---------- */

export async function savePostAction(
form: FormData): Promise<void> {
  await requireAuth();
  const id = String(form.get("id") || "").trim();
  if (!id) return;
  const post: AdminPost = {
    id,
    slug: slugify(String(form.get("slug") || "")),
    title: String(form.get("title") || "").trim(),
    description: String(form.get("description") || "").trim(),
    date: String(form.get("date") || new Date().toISOString().slice(0, 10)),
    tag: String(form.get("tag") || "").trim() || "Guides",
    author: String(form.get("author") || "Cascade Dispatch Team").trim(),
    readMinutes: Number(form.get("readMinutes") || 0) || undefined,
    image: (String(form.get("image") || "") || undefined) as string | undefined,
    imageAlt: String(form.get("imageAlt") || "").trim() || undefined,
    contentHtml: sanitizeHtml(String(form.get("contentHtml") || "")),
    draft: form.get("draft") === "on",
  };
  if (!post.title || !post.slug) return;
  await savePost(post);
  await logHistory("post-save", "/blog/" + post.slug + "/", (post.draft ? "Draft saved: " : "Saved: ") + post.title);
  revalidatePath("/blog/");
  revalidatePath("/blog/" + post.slug + "/");
  revalidatePath("/sitemap-pages.xml");
  revalidatePath("/", "layout");
  redirect("/admin/blog/" + encodeURIComponent(id) + "?saved=1");
}

export async function duplicatePostAction(
form: FormData): Promise<void> {
  await requireAuth();
  const id = String(form.get("id") || "").trim();
  if (!id) redirect("/admin/blog");
  const [file, base] = await Promise.all([getBlogFile(), getBasePosts()]);
  let src: AdminPost | undefined = file.posts.find((p) => p.id === id);
  if (!src) {
    const slug = id.replace("base:", "");
    const b = base.find((x) => x.slug === slug);
    if (!b) redirect("/admin/blog");
    src = { ...b, id: "base:" + b.slug, categories: [b.tag] } as unknown as AdminPost;
  }
  const copy: AdminPost = {
    ...src,
    id: "new:" + Date.now().toString(36),
    slug: slugify(src.slug + "-copy-" + Date.now().toString(36).slice(-4)),
    title: (src.title || "Untitled") + " (copy)",
    draft: true,
    publishAt: undefined,
    updatedAt: new Date().toISOString(),
  };
  await savePost(copy);
  revalidatePath("/blog/");
  revalidatePath("/", "layout");
  redirect("/admin/blog/" + encodeURIComponent(copy.id) + "?duplicated=1");
}

export async function deletePostAction(
form: FormData): Promise<void> {
  await requireAuth();
  const id = String(form.get("id") || "").trim();
  if (id) {
    await deleteAdminPost(id);
    await logHistory("post-delete", "/admin/blog", "Deleted post " + id);
  }
  revalidatePath("/blog/");
  revalidatePath("/", "layout");
  redirect("/admin/blog?deleted=1");
}


/* ---------- deep page content (edit / update / delete real copy) ---------- */

export async function savePageBodyAction(form: FormData): Promise<void> {
  await requireAuth();
  const pathname = String(form.get("path") || "").trim();
  if (!pathname.startsWith("/")) return;
  const fields: Record<string, string> = {};
  for (const [k, v] of Array.from(form as unknown as Iterable<[string, FormDataEntryValue]>)) {
    if (k.startsWith("f:")) fields[k.slice(2)] = String(v).trim();
  }
  const faqs: Faq[] = [];
  for (let i = 0; i < 10; i++) {
    const q = String(form.get("faqQ" + i) || "").trim();
    const a = String(form.get("faqA" + i) || "").trim();
    if (q || a) faqs.push({ q, a });
  }
  await setPageBodyEntry(pathname, { fields, faqs });
  const edited = Object.values(fields).filter((v) => v).length;
  await logHistory("page", pathname, `${edited} field${edited === 1 ? "" : "s"} + ${faqs.length} FAQ${faqs.length === 1 ? "" : "s"} saved`);
  revalidatePath(pathname);
  revalidatePath("/sitemap-pages.xml");
  revalidatePath("/", "layout");
  redirect(pathname.startsWith("/admin") ? pathname : "/admin/pages?saved=" + encodeURIComponent(pathname));
}
/* ---------- redirects ---------- */

export async function addRedirectAction(
form: FormData): Promise<void> {
  await requireAuth();
  const from = String(form.get("from") || "").trim();
  const to = String(form.get("to") || "").trim();
  const type = (Number(form.get("type") || form.get("status") || 301) || 301) as 301 | 302 | 410;
  if (!from.startsWith("/") || (!to.startsWith("/") && !to.startsWith("http") && type !== 410)) return;
  const list = await getRedirects();
  const id = "r" + Date.now();
  const next: AdminRedirect[] = [...list, { id, from, to, type, status: "active", note: String(form.get("note") || "").trim() || undefined } as AdminRedirect];
  await saveRedirects(next);
  await logHistory("redirect-add", from, `${status} → ${to}`);
  redirect("/admin/redirects?added=1");
}

export async function deleteRedirectAction(
form: FormData): Promise<void> {
  await requireAuth();
  const id = String(form.get("id") || "").trim();
  if (id) {
    const removed = (await getRedirects()).find((r) => r.id === id);
    await saveRedirects((await getRedirects()).filter((r) => r.id !== id));
    if (removed) await logHistory("redirect-delete", removed.from, `${removed.status} → ${removed.to}`);
  }
  redirect("/admin/redirects?deleted=1");
}
