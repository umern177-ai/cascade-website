// Blog article page — premium pp-* article layout. Content comes from
// lib/blog-data.ts (fact-checked against site data; nothing invented).
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronRight, Phone } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site-data";
import { POSTS, getPost } from "@/lib/blog-data";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `https://cascadecharterbus.com/blog/${post.slug}/`;
  const img = `${SITE.url}/images/blog/3.webp`;
  return {
    title: { absolute: `${post.title} | Cascade Charter Bus` },
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      images: [{ url: img, width: 1600, height: 900, alt: post.title }],
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [img],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  // BlogPosting per the consultant's schema doc. Posts have no individual
  // author person/profile URL (byline is the "Cascade Dispatch Team"), so
  // per the consultant's note the author resolves to the Organization @id.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE.url}/blog/${post.slug}/#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/blog/${post.slug}/` },
    headline: post.title,
    description: post.description,
    image: `${SITE.url}/images/blog/3.webp`,
    articleSection: post.tag,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@id": "https://cascadecharterbus.com/#organization" },
    publisher: { "@id": "https://cascadecharterbus.com/#organization" },
    url: `${SITE.url}/blog/${post.slug}/`,
  };

  return (
    <main className="pp bg-white pp-svc" style={{ fontSize: "inherit" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog/" }, { label: post.title }]} />

      {/* ===== article hero (dark band) ===== */}
      <section className="pp-hero">
        <div className="container">
          <div className="pp-hero-solo">
            <p className="pp-eyebrow">{`Guide · ${post.tag}`}</p>
            <h1>
              {post.title.split(":")[0]} <em>{post.title.includes(":") ?post.title.split(":")[1].trim() : post.tag}</em>
            </h1>
            <p className="pp-lead">{post.description}</p>
            <p className="mb-0 small" style={{ color: "#8b93a8" }}>
              By {post.author} · {new Date(post.date+"T00:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })} · {post.readMinutes} min read
            </p>
          </div>
        </div>
      </section>

      {/* ===== article body ===== */}
      <article className="pp-sec pp-bg-white">
        <div className="container" style={{ maxWidth: 860 }}>
          <Image src="/images/blog/3.webp" alt="Cascade Charter Bus motorcoach parked curbside" width={1200} height={640} priority sizes="(max-width: 900px) 100vw, 860px" style={{ objectFit: "cover", width: "100%", maxHeight: 420, borderRadius: 22, marginBottom: "1.6rem" }} />
          <p style={{ color: "var(--pp-ink)", fontSize: "1.12rem", lineHeight: 1.85 }}>{post.intro}</p>
          {post.sections.map((sec) => (
            <section key={sec.h} style={{ marginTop: "2.4rem" }}>
              <h2 style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)", fontWeight: 800, color: "var(--pp-ink)", lineHeight: 1.3, marginBottom: "0.9em" }}>{sec.h}</h2>
              {sec.paras && sec.paras.map((p, i) => (
                <p key={i} style={{ color: "var(--pp-muted)", fontSize: "1.02rem", lineHeight: 1.8, marginBottom: "1em" }}>{p}</p>
              ))}
              {sec.list && (
                <ul className="pp-checklist pp-checklist-2col" style={{ margin: "1.2rem 0" }}>
                  {sec.list.map((li) => (
                    <li key={li}><Check aria-hidden="true" /><span>{li}</span></li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>

      {/* ===== related links ===== */}
      <section className="pp-sec" id="related">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">Keep planning</p>
            <h2>Services and vehicles this guide touches</h2>
          </header>
          <div className="d-flex flex-wrap gap-2">
            {post.related.map((r) => (
              <Link key={r.href} href={r.href} className="pp-chip">{r.label} <ChevronRight size={13} style={{ verticalAlign: "-2px" }} aria-hidden="true" /></Link>
            ))}
          </div>
        </div>
      </section>

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
