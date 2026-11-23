// Admin dashboard — overview of every editable space + one-click entry.
import Link from "next/link";
import {
  getBlogFile, getMetaFile, getCityMetaFile, getRedirects, getBasePosts, getPageBodyFile,
} from "@/lib/admin/store";
import { FileText, Tags, PencilRuler, Files, ArrowRightLeft, CircleCheck, Users } from "lucide-react";

export default async function AdminHome() {
  const [blog, meta, cityMeta, redirects, base, pages] = await Promise.all([
    getBlogFile(), getMetaFile(), getCityMetaFile(), getRedirects(), getBasePosts(), getPageBodyFile(),
  ]);
  const live =
    base.filter((b) => !(blog.deletedBaseSlugs ?? []).includes(b.slug)).length +
    blog.posts.filter((p) => !p.id.startsWith("base:") && !p.draft).length;
  const drafts = blog.posts.filter((p) => p.draft).length;
  const overrides = Object.keys(meta).length + Object.keys(cityMeta).length + Object.keys(pages).length;

  const cards = [
    { href: "/admin/pages", icon: Files, title: "All pages", sub: "789 listed", desc: "WordPress-style: pick any page and edit its meta tags and live copy." },
    { href: "/admin/blog", icon: FileText, title: "Blog posts", sub: `${live} live · ${drafts} draft${drafts === 1 ? "" : "s"}`, desc: "Write, edit, add images inside posts, change slugs, publish." },
    { href: "/admin/meta", icon: Tags, title: "Meta tags", sub: `${Object.keys(meta).length} saved override${Object.keys(meta).length === 1 ? "" : "s"}`, desc: "Titles + descriptions for core, service, fleet and any other page." },
    { href: "/admin/content", icon: PencilRuler, title: "Page content", sub: "FAQs · home · hubs", desc: "FAQ answers, home hero and hub headings — no code involved." },
    {
      href: "/admin/redirects",
      icon: ArrowRightLeft,
      title: "Redirects",
      sub: `${redirects.length} rule${redirects.length === 1 ? "" : "s"}`,
      desc: "301 / 302 rules — applied site-wide at the next build.",
    },
  ];

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1>Dashboard</h1>
          <p>Everything your SEO team needs — {live} live posts, {overrides} overrides, {redirects.length} redirects.</p>
        </div>
      </header>
      <div className="adm-cards">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="adm-card">
            <c.icon size={20} aria-hidden="true" />
            <div>
              <strong>{c.title}</strong>
              <span>{c.sub}</span>
              <p>{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      <section className="adm-panel">
        <h2><CircleCheck size={16} aria-hidden="true" />How your edits go live</h2>
        <ul className="adm-list">
          <li>Every save writes to <code>data/admin/</code> and immediately re-validates the affected page — no rebuild, no deploy, no code.</li>
          <li><Users size={13} style={{ display: "inline", verticalAlign: "-2px" }} aria-hidden="true" /> The site reads saved overrides first, then falls back to built-in content when a field is empty.</li>
          <li>The blog list, sitemap and post pages pick up new posts automatically — including images inside the text.</li>
        </ul>
      </section>
    </>
  );
}
