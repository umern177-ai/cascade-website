// View of the blog for the PUBLIC pages (brief Section 19.10): built-in posts
// with admin edits applied, plus admin posts, minus deleted ones, drafts out.
// Every post carries final contentHtml (built-in guides are converted from
// their structured sections), so the post page has one clean render path.
import "server-only";
import { getPublishedPosts, getBlogFile } from "@/lib/admin/store";

export type PublicPost = {
  updatedAt?: string;
  categories?: string[];
  noindex?: boolean;
  ogImage?: string;
  seoTitle?: string;
  canonical?: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  tag: string;
  author: string;
  readMinutes: number;
  image: string;
  imageAlt: string;
  contentHtml: string;
};

export async function blogPosts(): Promise<PublicPost[]> {
  const [published, file] = await Promise.all([getPublishedPosts(), getBlogFile()]);
  const out: PublicPost[] = published
    // scheduled posts stay hidden until their publish date
    .filter((p) => {
      if ((p as { draft?: boolean }).draft === true) return false;
      const scheduled = (p as { publishAt?: string }).publishAt;
      return !scheduled || scheduled <= new Date().toISOString().slice(0, 10);
    })
    .map((p) => {
      // an admin override for a built-in guide wins field by field
      const override = file.posts.find((x) => x.id === "base:" + p.slug);
      return {
        slug: (override && override.slug) || p.slug,
        title: override?.title || p.title,
        description: override?.description || p.description,
        date: p.date,
        tag: (p as { tag?: string }).tag || "Guides",
        author: (p as { author?: string }).author || "Cascade Dispatch Team",
        readMinutes: override?.readMinutes || (p as { readMinutes?: number }).readMinutes || 6,
        image: override?.image ?? (p as { image?: string }).image ?? "/images/blog/3.webp",
        imageAlt: override?.imageAlt || (p as { imageAlt?: string }).imageAlt || p.title,
        contentHtml: override?.contentHtml ?? p.contentHtml ?? "",
        updatedAt: (p as { updatedAt?: string }).updatedAt,
        categories: (p as { categories?: string[] }).categories ?? ((p as { tag?: string }).tag ? [(p as { tag?: string }).tag!] : undefined),
        noindex: (p as { noindex?: boolean }).noindex,
        ogImage: (p as { ogImage?: string }).ogImage,
        seoTitle: (p as { seoTitle?: string }).seoTitle,
        canonical: (p as { canonical?: string }).canonical,
      };
    });
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function blogPost(slug: string): Promise<PublicPost | undefined> {
  const all = await blogPosts();
  return all.find((p) => p.slug === slug);
}
