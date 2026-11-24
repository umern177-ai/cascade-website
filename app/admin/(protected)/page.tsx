// Dashboard (/admin) — Admin Panel Upgrade Phase 6 (section 2): cards +
// recent inquiries + recent changes + warnings + quick buttons.
import Link from "next/link";
import { listInquiries } from "@/lib/admin/leads";
import { adminPostsView } from "@/lib/admin/blog-admin";
import { pageCatalog } from "@/lib/admin/page-catalog";
import { getHistory, getRedirects, getSiteConfig } from "@/lib/admin/store";
import { LayoutDashboard, PenLine, ArrowRightLeft, Inbox } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [inq, blog, catalog, history, redirects, cfg] = await Promise.all([
    listInquiries({ page: 1, pageSize: 5 }),
    adminPostsView({ page: 1, pageSize: 100 }),
    pageCatalog(),
    getHistory(),
    getRedirects(),
    getSiteConfig(),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  const allLeads = (await import("@/lib/admin/leads")).listInquiries({ pageSize: 10000, page: 1 });
  void allLeads;
  const recent = history.slice(0, 10);
  const activeRedirects = redirects.filter((r) => r.type !== undefined && (r as { status?: string }).status !== "inactive");
  void cfg;

  const cards = [
    { label: "Inquiries today", value: "—", href: "/admin/inquiries" },
    { label: "Total pages", value: catalog.length, href: "/admin/pages" },
    { label: "Published posts", value: blog.counts.published, href: "/admin/blog?status=published" },
    { label: "Drafts", value: blog.counts.draft, href: "/admin/blog?status=draft" },
    { label: "Scheduled", value: blog.counts.scheduled, href: "/admin/blog?status=scheduled" },
    { label: "Active redirects", value: activeRedirects.length, href: "/admin/redirects" },
  ];

  return (
    <>
      <header className="adm-page-head">
        <div><h1>Dashboard</h1><p>Everything at a glance — content, leads, SEO safety.</p></div>
        <LayoutDashboard aria-hidden="true" />
      </header>

      <div className="adm-panel" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="adm-btn" style={{ display: "block", textAlign: "left", padding: "14px 16px" }}>
            <span style={{ display: "block", fontSize: "1.5rem", fontWeight: 800 }}>{c.value}</span>
            <span className="adm-hint">{c.label}</span>
          </Link>
        ))}
      </div>

      <div className="adm-inline" style={{ margin: "10px 0 20px", gap: 10 }}>
        <Link className="adm-btn adm-btn-primary" href="/admin/blog/new"><PenLine size={14} aria-hidden="true" /> Write blog post</Link>
        <Link className="adm-btn" href="/admin/redirects"><ArrowRightLeft size={14} aria-hidden="true" /> Add redirect</Link>
        <Link className="adm-btn" href="/admin/inquiries"><Inbox size={14} aria-hidden="true" /> View inquiries</Link>
        <Link className="adm-btn" href="/admin/find-replace">Find &amp; replace</Link>
      </div>

      <div className="adm-panel">
        <h2>Recent inquiries <Link className="adm-link" href="/admin/inquiries" style={{ float: "right", fontSize: 13 }}>View all →</Link></h2>
        {inq.rows.length === 0 ? (
          <p className="adm-hint">None yet — quote forms now save every inquiry here.</p>
        ) : (
          <table className="adm-table">
            <thead><tr><th>Received</th><th>Name</th><th>Phone</th><th>Status</th></tr></thead>
            <tbody>
              {inq.rows.map((l) => (
                <tr key={l.id} style={l.status === "new" ? { fontWeight: 700 } : undefined}>
                  <td className="adm-muted">{new Date(l.receivedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</td>
                  <td><Link className="adm-link" href={`/admin/inquiries/${l.id}`}>{l.fullName}</Link></td>
                  <td><a className="adm-link" href={`tel:${l.phone}`}>{l.phone}</a></td>
                  <td>{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="adm-panel">
        <h2>Recent changes <Link className="adm-link" href="/admin/history" style={{ float: "right", fontSize: 13 }}>History log →</Link></h2>
        <ul className="list-unstyled vstack gap-2 mb-0">
          {recent.map((h) => (
            <li key={h.id}>
              <b>{new Date(h.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</b> · {h.summary} <code style={{ fontSize: 11 }}>{h.path}</code>
            </li>
          ))}
          {recent.length === 0 && <li className="adm-hint">No changes yet.</li>}
        </ul>
      </div>
    </>
  );
}


