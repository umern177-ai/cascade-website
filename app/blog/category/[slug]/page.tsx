// /blog/category/{slug}/ — managed blog category listing (Admin Panel Upgrade
// section 4.4/4.5). Posts flow through revalidation when published, and a
// renamed/deleted category leaves a 301 automatically.
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site-data";
import { blogPosts } from "@/lib/blog-serve";
import { getBlogCategories } from "@/lib/admin/store";
import { slugify } from "@/lib/admin/slugify";
import { withOverrides } from "@/lib/admin/meta-apply";
import { pageMeta } from "@/lib/page-meta";

export function generateStaticParams() {
  return getBlogCategories().then((cats) => cats.map((c) => ({ slug: c.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = (await getBlogCategories()).find((c) => c.slug === slugify(slug));
  if (!cat) return {};
  return pageMeta(
    await withOverrides({
      title: cat.seoTitle?.trim() || `${cat.name} Guides`,
      description: cat.metaDescription?.trim() || cat.description?.trim() || `Charter bus guides about ${cat.name.toLowerCase()} from the Cascade dispatch team.`,
      path: `/blog/category/${cat.slug}/`,
    }),
  );
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = (await getBlogCategories()).find((c) => c.slug === slugify(slug));
  if (!cat) notFound();
  const posts = (await blogPosts()).filter((p) => (p.categories ?? [p.tag]).some((c) => slugify(c) === cat.slug));

  return (
    <main className="pp bg-white pp-svc" style={{ fontSize: "inherit" }}>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog/" }, { label: cat.name }]} />

      <section className="pp-hero">
        <div className="container">
          <div className="pp-hero-solo">
            <p className="pp-eyebrow">Guides</p>
            <h1>{`${cat.name} Guides`}</h1>
            <p className="pp-lead">{cat.description || `Plan smarter with every guide in the ${cat.name.toLowerCase()} series.`}</p>
          </div>
        </div>
      </section>

      <section className="pp-sec pp-bg-white">
        <div className="container">
          {posts.length === 0 ? (
            <p className="text-muted">Guides in this series are on the way.</p>
          ) : (
            <div className="pp-service-gallery">
              {posts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}/`} className="pp-hub-card" aria-label={p.title}>
                  <div className="pp-hub-media">
                    <Image src={p.image} alt={p.imageAlt} fill sizes="(max-width: 800px) 100vw, 33vw" style={{ objectFit: "cover" }} loading="lazy" />
                  </div>
                  <div className="pp-hub-body">
                    <span className="pp-badge">{p.tag}</span>
                    <h2 className="pp-hub-name" style={{ fontSize: "1.05rem" }}>{p.title}</h2>
                    <p className="mb-1" style={{ fontSize: "0.9rem", color: "#4a5060" }}>{p.excerpt || p.description.slice(0, 110) + "…"}</p>
                    <span className="pp-link-arrow">Read the guide <ChevronRight size={14} style={{ verticalAlign: "-2px" }} aria-hidden="true" /></span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
