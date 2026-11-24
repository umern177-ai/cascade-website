"use server";

// Blog category management actions (Admin Panel Upgrade section 4.5).
// Deleting a category reassigns its posts to a chosen category and 301s the
// old public category URL so no traffic is lost.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "../../../get-auth";
import { BlogCategory, getBlogCategories, saveBlogCategories, getBlogFile, getRedirects, saveRedirects, logHistory } from "@/lib/admin/store";
import { slugify } from "@/lib/admin/slugify";

export async function saveCategoryAction(form: FormData): Promise<void> {
  await requireAuth();
  const originalSlug = String(form.get("originalSlug") || "").trim();
  const name = String(form.get("name") || "").trim();
  const slug = slugify(String(form.get("slug") || "") || name);
  if (!name || !slug) redirect("/admin/blog/categories");

  const list = await getBlogCategories();
  const existing = list.find((c) => c.slug === originalSlug);
  const entry: BlogCategory = {
    name,
    slug,
    description: String(form.get("description") || "").trim() || undefined,
    seoTitle: String(form.get("seoTitle") || "").trim() || undefined,
    metaDescription: String(form.get("metaDescription") || "").trim() || undefined,
  };

  if (existing) {
    if (list.some((c) => c.slug === slug && c.slug !== originalSlug)) redirect("/admin/blog/categories?e=duplicate");
    const next = list.map((c) => (c.slug === originalSlug ? entry : c));
    await saveBlogCategories(next);
    if (originalSlug !== slug) {
      // rename: rewrite the posts + 301 the old public URL
      const file = await getBlogFile();
      for (const p of file.posts) {
        if ((p.categories ?? []).includes(existing.name)) {
          p.categories = (p.categories ?? []).map((c) => (c === existing.name ? name : c));
        }
      }
      const rules = await getRedirects();
      if (!rules.some((r) => r.from === `/blog/category/${originalSlug}/`)) {
        rules.push({ id: "rc" + Date.now(), from: `/blog/category/${originalSlug}/`, to: `/blog/category/${slug}/`, type: 301, status: "active", note: `Category renamed: ${name}` });
        await saveRedirects(rules);
      }
      revalidatePath(`/blog/category/${originalSlug}/`);
    }
    await logHistory("category", "/admin/blog/categories", `Edited category "${name}"`);
  } else {
    if (list.some((c) => c.slug === slug)) redirect("/admin/blog/categories?e=duplicate");
    await saveBlogCategories([...list, entry]);
    await logHistory("category", "/admin/blog/categories", `Added category "${name}"`);
  }
  revalidatePath(`/blog/category/${slug}/`);
  revalidatePath("/admin/blog/categories");
  redirect("/admin/blog/categories?saved=1");
}

export async function deleteCategoryAction(form: FormData): Promise<void> {
  await requireAuth();
  const slug = String(form.get("slug") || "");
  const moveName = String(form.get("moveTo") || "").trim();
  const list = await getBlogCategories();
  const gone = list.find((c) => c.slug === slug);
  if (!gone) redirect("/admin/blog/categories");
  if (!moveName || !list.some((c) => c.name === moveName)) redirect("/admin/blog/categories?e=need-move");

  const file = await getBlogFile();
  let moved = 0;
  for (const p of file.posts) {
    if ((p.categories ?? []).includes(gone.name)) {
      p.categories = (p.categories ?? []).map((c) => (c === gone.name ? moveName : c));
      moved++;
    }
  }
  await saveBlogCategories(list.filter((c) => c.slug !== slug));
  await logHistory("category", "/admin/blog/categories", `Deleted category "${gone.name}", ${moved} post(s) moved to "${moveName}"`);
  revalidatePath("/blog/category/");
  revalidatePath(`/blog/category/${slug}/`);
  redirect("/admin/blog/categories?deleted=1");
}
