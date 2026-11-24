// Admin shell (brief Section 19.10 — "everything adjustable from the admin").
// Light, clean, Bootstrap-based; every child route is protected by the session
// check here, except /admin/login which lives outside this gate.
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin/auth";
import { logoutAction } from "../actions";
import { LayoutDashboard, FileText, Files, Tags, PencilRuler, ArrowRightLeft, CircleCheck, LogOut, ExternalLink, Building2, History, Inbox, Globe, Users, Search } from "lucide-react";
import { unreadCount } from "@/lib/admin/leads";
import AdminToaster from "@/components/admin/AdminToaster";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthed())) {
    redirect("/admin/login");
  }
  const newInquiries = await unreadCount();
  const GROUPS: Array<{ group: string; items: Array<{ href: string; label: string; icon: typeof LayoutDashboard; badge?: number }> }> = [
    {
      group: "Overview",
      items: [{ href: "/admin/", label: "Dashboard", icon: LayoutDashboard }],
    },
    {
      group: "Leads",
      items: [{ href: "/admin/inquiries", label: "Quote inquiries", icon: Inbox, badge: newInquiries }],
    },
    {
      group: "Content",
      items: [
        { href: "/admin/pages", label: "All pages", icon: Files },
        { href: "/admin/blog", label: "Blog posts", icon: FileText },
        { href: "/admin/blog/categories", label: "Blog categories", icon: Tags },
        { href: "/admin/media", label: "Media library", icon: Files },
        { href: "/admin/global", label: "Global content", icon: PencilRuler },
      ],
    },
    {
      group: "SEO",
      items: [
        { href: "/admin/meta", label: "Meta tags", icon: Tags },
        { href: "/admin/redirects", label: "Redirects", icon: ArrowRightLeft },
        { href: "/admin/404s", label: "404 monitor", icon: ArrowRightLeft },
        { href: "/admin/schema", label: "Schema & tracking", icon: CircleCheck },
        { href: "/admin/sitemap", label: "Sitemap & robots", icon: Globe },
        { href: "/admin/seo-health", label: "SEO health check", icon: CircleCheck },
      ],
    },
    {
      group: "Settings",
      items: [
        { href: "/admin/users", label: "Users & roles", icon: Users },
        { href: "/admin/history", label: "History log", icon: History },
        { href: "/admin/find-replace", label: "Find & replace", icon: Search },
      ],
    },
  ];
  return (
    <div className="adm" data-adm>
      <div className="adm-shell">
        <aside className="adm-side" aria-label="Admin navigation">
          <div style={{ marginLeft: "auto", marginRight: 12 }}>
            <form action="/admin/search" method="get">
              <input className="adm-input" name="q" placeholder="Search everything…" style={{ width: 220, marginRight: 8 }} />
            </form>
          </div>
          <div className="adm-brand">
            <Building2 size={22} aria-hidden="true" />
            <div>
              <strong>Cascade Admin</strong>
              <small>content · SEO · redirects</small>
            </div>
          </div>
          <nav className="adm-nav">
            {GROUPS.map((g) => (
              <div key={g.group}>
                <div className="adm-hint" style={{ padding: "10px 14px 4px", textTransform: "uppercase", letterSpacing: ".08em", fontSize: 10 }}>{g.group}</div>
                {g.items.map((n) => (
                  <Link key={n.href} href={n.href} className="adm-navlink">
                    <n.icon size={16} aria-hidden="true" />
                    {n.label}
                    {n.badge ? <span className="adm-badge-new">{n.badge}</span> : null}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
          <div className="adm-foot">
            <a href="/" target="_blank" className="adm-navlink adm-ext"><ExternalLink size={15} aria-hidden="true" />View site</a>
            <form action={logoutAction}>
              <button type="submit" className="adm-navlink adm-out"><LogOut size={15} aria-hidden="true" />Log out</button>
            </form>
          </div>
        </aside>
        <main className="adm-main"><AdminToaster />{children}</main>
      </div>
    </div>
  );
}
