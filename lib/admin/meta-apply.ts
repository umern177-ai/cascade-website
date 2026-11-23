// Applies admin SEO overrides over a page's built-in metadata: title,
// description, canonical URL, robots directives and OG fields — one place,
// used by every page's generateMetadata, so a saved override re-renders the
// page with the new tags (revalidatePath triggers on save).
// Empty override fields fall back to the built-in copy.
import "server-only";
import { getMetaFile, getCityMetaFile } from "@/lib/admin/store";

export async function withOverrides<T extends { title: string; description: string; path: string }>(base: T): Promise<T & {
  canonical?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}> {
  const [siteMeta, cityMeta] = await Promise.all([getMetaFile(), getCityMetaFile()]);
  const o = siteMeta[base.path] ?? cityMeta[base.path];
  if (!o) return base;
  return {
    ...base,
    title: o.title?.trim() || base.title,
    description: o.description?.trim() || base.description,
    canonical: o.canonical?.trim() || undefined,
    robots: o.robots?.trim() || undefined,
    ogTitle: o.ogTitle?.trim() || undefined,
    ogDescription: o.ogDescription?.trim() || undefined,
    ogImage: o.ogImage?.trim() || undefined,
  };
}
