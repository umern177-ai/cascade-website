// Admin shell (brief Section 19.10 — "everything adjustable from the admin").
// Light, clean, Bootstrap-based; every child route is protected by the session
// check here, except /admin/login which lives outside this gate.
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin/auth";
import { logoutAction } from "../actions";
import { LayoutDashboard, FileText, Files, Tags, PencilRuler, ArrowRightLeft, CircleCheck, LogOut, ExternalLink, Building2, History } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthed())) {
    redirect("/admin/login");
  }
  const nav = [
    { href: "/admin/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/pages", label: "All pages", icon: Files },
    { href: "/admin/blog", label: "Blog posts", icon: FileText },
    { href: "/admin/meta", label: "Meta tags", icon: Tags },
    { href: "/admin/content", label: "Page content", icon: PencilRuler },
    { href: "/admin/redirects", label: "Redirects", icon: ArrowRightLeft },
    { href: "/admin/schema", label: "Schema & tracking", icon: CircleCheck },
    { href: "/admin/history", label: "History log", icon: History },
  ];
  return (
    <div className="adm" data-adm>
      <div className="adm-shell">
        <aside className="adm-side" aria-label="Admin navigation">
          <div className="adm-brand">
            <Building2 size={22} aria-hidden="true" />
            <div>
              <strong>Cascade Admin</strong>
              <small>content · SEO · redirects</small>
            </div>
          </div>
          <nav className="adm-nav">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="adm-navlink">
                <n.icon size={16} aria-hidden="true" />
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="adm-foot">
            <a href="/" target="_blank" className="adm-navlink adm-ext"><ExternalLink size={15} aria-hidden="true" />View site</a>
            <form action={logoutAction}>
              <button type="submit" className="adm-navlink adm-out"><LogOut size={15} aria-hidden="true" />Log out</button>
            </form>
          </div>
        </aside>
        <main className="adm-main">{children}</main>
      </div>
    </div>
  );
}
