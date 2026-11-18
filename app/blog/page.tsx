// Blog hub — premium pp-* design matching the rest of the site. Lists every
// published guide from lib/blog-data.ts. Facts only; no invented content.
import Link from "next/link";
import { ArrowRight, Check, ChevronRight, Phone, ShieldCheck, Tag, Headset } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site-data";
import { POSTS } from "@/lib/blog-data";
import Image from "next/image";
import Image2 from "next/image";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "Charter Bus Planning Guides & Group Travel Tips",
  description:
    "Practical charter bus planning guides from the Cascade dispatch team: booking timelines, vehicle sizing, route planning and pre-trip checklists.",
  path: "/blog/",
});

export default function BlogHub() {
  return (
    <main className="pp bg-white pp-svc" style={{ fontSize: "inherit" }}>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      {/* ===== hero (dark band) ===== */}
      <section className="pp-hero">
        <div className="container">
          <div className="pp-hero-solo">
            <p className="pp-eyebrow">Planning guides · From the dispatch team</p>
            <h1>
              Charter Bus Guides for <em>Smart Group Planners</em>
            </h1>
            <p className="pp-lead">
              Practical timelines, checklists and vehicle advice from the team that
              plans group trips every day—written down so your next quote comes back final.
            </p>
            <ul className="pp-trust">
              <li><ShieldCheck aria-hidden="true" />DOT-compliant fleet</li>
              <li><Tag aria-hidden="true" />Gratuity, tolls &amp; taxes included</li>
              <li><Headset aria-hidden="true" />24/7 dispatch</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== guide list ===== */}
      <section className="pp-sec" id="guides">
        <div className="container">
          <header className="pp-sec-head">
            <p className="pp-eyebrow">Latest guides</p>
            <h2>Start with the timing guide</h2>
            <p>New guides are added as the dispatch team answers real planning questions.</p>
          </header>
          <div className="pp-service-gallery">
            {POSTS.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}/`} className="pp-hub-card" aria-label={p.title}>
                <div className="pp-hub-media">
                  <Image src={p.featuredImage} alt={p.imageAlt || p.title} fill sizes="(max-width: 800px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                </div>
                <div className="pp-hub-body">
                  <span className="pp-badge">{p.date}</span>
                  <h2 className="pp-hub-name">{p.title}</h2>
                  <p className="mb-0" style={{ color: "var(--pp-muted)", fontSize: "0.9rem", lineHeight: 1.55 }}>{p.description}</p>
                  <span className="pp-link-arrow">Read the guide <ChevronRight size={14} style={{ verticalAlign: "-2px" }} aria-hidden="true" /></span>
                </div>
              </Link>
            ))}
            <div className="pp-hub-card" style={{ opacity: 0.75 }}>
              <div className="pp-hub-media" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "none" }}>
                <Check size={30} style={{ color: "var(--pp-amber)" }} aria-hidden="true" />
              </div>
              <div className="pp-hub-body">
                <span className="pp-badge">Coming next</span>
                <h2 className="pp-hub-name">More dispatch answers, in guide form</h2>
                <p className="mb-0" style={{ color: "var(--pp-muted)", fontSize: "0.9rem", lineHeight: 1.55 }}>
                  Vehicle sizing deep-dives and route-planning walkthroughs are in the works.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== final CTA (amber band) ===== */}
      <section className="pp-cta-band">
        <div className="container pp-cta-inner">
          <div>
            <h2>Ready to price your own trip?</h2>
            <p>Share the itinerary and group count—one final quote out, usually in about 15 minutes.</p>
          </div>
          <div className="pp-cta-actions">
            <a className="pp-btn pp-btn-dark" href="/contact/" data-source="blog-cta" rel="nofollow">Get a Free Quote <ArrowRight aria-hidden="true" /></a>
            <a className="pp-btn pp-btn-outline-dark" href={`tel:${SITE.phoneTel}`}><Phone aria-hidden="true" />{`Call ${SITE.phoneDisplay}`}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
