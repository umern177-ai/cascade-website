// Blog article page — admin-managed render path (brief Section 19.10).
// Every published post (built-in with admin edits, or written in the admin)
// carries final HTML; here it renders inside the same premium article frame.
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight, Phone, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site-data";
import { blogPost, blogPosts } from "@/lib/blog-serve";
import { getMetaFile } from "@/lib/admin/store";

export function generateStaticParams() {
  // Admin posts are published on-demand (ISR-style via revalidatePath), so at
  // build time we prerender everything that exists in the repo.
  return blogPosts().then((posts) => posts.map((p) => ({ slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await blogPost(slug);
  if (!post) return {};
  const url = `${SITE.url}/blog/${post.slug}/`;
  const img = `${SITE.url}${post.image}`;
  const metaFile = await getMetaFile();
  const o = metaFile[url.replace(SITE.url, "")] ?? metaFile[`/blog/${post.slug}/`];
  const title = o?.title?.trim() || post.title; // brand suffix applied below; brand in own title = absolute
  const description = o?.description?.trim() || post.description;
  const fullTitle = title.includes("Cascade Charter Bus") ? title : `${title} | Cascade Charter Bus`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: { title: fullTitle, description, url, images: [{ url: img, width: 1600, height: 900, alt: post.imageAlt }], type: "article", publishedTime: post.date },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [img] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await blogPost(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE.url}/blog/${post.slug}/#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/blog/${post.slug}/` },
    headline: post.title,
    description: post.description,
    image: `${SITE.url}${post.image}`,
    articleSection: post.tag,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@id": "https://cascadecharterbus.com/#organization" },
    publisher: { "@id": "https://cascadecharterbus.com/#organization" },
    url: `${SITE.url}/blog/${post.slug}/`,
  };
  const others = (await blogPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className="pp bg-white pp-svc" style={{ fontSize: "inherit" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog/" }, { label: post.title }]} />

      {/* ===== article hero (dark band) ===== */}
      <section className="pp-hero">
        <div className="container">
          <div className="pp-hero-solo">
            <p className="pp-eyebrow">{`Guide · ${post.tag}`}</p>
            <h1>{post.title}</h1>
            <p className="pp-lead">{post.description}</p>
            <p className="mb-0 small" style={{ color: "#8b93a8" }}>
              By {post.author} · {new Date(post.date + "T00:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })} · {post.readMinutes} min read
            </p>
          </div>
        </div>
      </section>

      {/* ===== article body ===== */}
      <article className="pp-sec pp-bg-white">
        <div className="container" style={{ maxWidth: 860 }}>
          <Image src={post.image} alt={post.imageAlt} width={1200} height={640} priority sizes="(max-width: 900px) 100vw, 860px" style={{ objectFit: "cover", width: "100%", maxHeight: 420, borderRadius: 22, marginBottom: "1.6rem" }} />
          {/* contentHtml is sanitized on save (scripts, frames, handlers stripped) */}
          <div className="pp-prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </div>
      </article>

      {/* ===== more guides ===== */}
      {others.length > 0 && (
        <section className="pp-sec pp-bg-white" id="more-guides">
          <div className="container">
            <header className="pp-sec-head">
              <p className="pp-eyebrow">Keep planning</p>
              <h2>More guides from the dispatch team</h2>
            </header>
            <div className="pp-service-gallery">
              {others.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}/`} className="pp-hub-card" aria-label={p.title}>
                  <div className="pp-hub-media">
                    <Image src={p.image} alt={p.imageAlt} fill sizes="(max-width: 800px) 100vw, 33vw" style={{ objectFit: "cover" }} loading="lazy" />
                  </div>
                  <div className="pp-hub-body">
                    <span className="pp-badge">{p.tag}</span>
                    <h2 className="pp-hub-name">{p.title}</h2>
                    <span className="pp-link-arrow">Read the guide <ChevronRight size={14} style={{ verticalAlign: "-2px" }} aria-hidden="true" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== final CTA (amber band) ===== */}
      <section className="pp-cta-band">
        <div className="container pp-cta-inner">
          <div>
            <h2>Plan the trip this guide describes</h2>
            <p>Send the itinerary and headcount—one final quote, usually in about 15 minutes.</p>
          </div>
          <div className="pp-cta-actions">
            <a className="pp-btn pp-btn-dark" href="/contact/" data-source={`blog-cta:${post.slug}`} rel="nofollow">Get a Free Quote <ArrowRight aria-hidden="true" /></a>
            <a className="pp-btn pp-btn-outline-dark" href={`tel:${SITE.phoneTel}`}><Phone aria-hidden="true" />{`Call ${SITE.phoneDisplay}`}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
