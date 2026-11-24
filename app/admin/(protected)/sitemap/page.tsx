// Sitemap & Robots (/admin/sitemap) — Admin Panel Upgrade Phase 5 (7.3).
import Link from "next/link";
import { getSiteConfig } from "@/lib/admin/store";
import { Globe, FileText } from "lucide-react";
import { saveRobotsAction, saveLlmsAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSitemap({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const cfg = await getSiteConfig();
  const savedRobots = cfg.robotsOverride ?? "";
  const savedLlms = cfg.llmsOverride ?? "";
  const robotsDefault = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://cascadecharterbus.com/sitemap.xml\nSitemap: https://cascadecharterbus.com/sitemap-all.xml`;

  return (
    <>
      <header className="adm-page-head">
        <div><h1>Sitemap &amp; robots</h1><p>The XML sitemap builds itself from published, indexable pages. Edits below go live without a deploy.</p></div>
        <Globe aria-hidden="true" />
      </header>
      {saved && <div className="adm-alert">Saved — live on the next request.</div>}

      <div className="adm-panel">
        <h2>XML sitemap files <span className="adm-hint-inline">master index + nested files</span></h2>
        <table className="adm-table">
          <thead><tr><th>File</th><th>What it lists</th><th aria-label="Open"></th></tr></thead>
          <tbody>
            {[
              ["/sitemap.xml", "Master index (5 sections)"],
              ["/sitemap-all.xml", "All pages in one file"],
              ["/sitemap-static.xml", "Main pages (Home, About, Contact…)"],
              ["/sitemap-services.xml", "Service pages"],
              ["/sitemap-fleet.xml", "Fleet pages"],
              ["/sitemap-locations.xml", "State pages + all 710 city pages"],
              ["/sitemap-posts.xml", "Blog articles"],
              ["/blog/rss.xml", "RSS feed of blog posts"],
            ].map(([f, label]) => (
              <tr key={f}>
                <td><code>{f}</code></td>
                <td className="adm-muted">{label}</td>
                <td className="adm-row-actions"><Link className="adm-btn" href={f} target="_blank">Open ↗</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="adm-hint"><FileText size={12} aria-hidden="true" /> robots.txt advertises /sitemap.xml and /sitemap-all.xml. Pages marked noindex are excluded automatically by lib/sitemap-xml.ts.</p>
      </div>

      <div className="adm-panel">
        <h2>robots.txt editor</h2>
        <form action={saveRobotsAction} className="adm-form">
          <textarea className="adm-input" rows={8} name="robots" defaultValue={savedRobots || robotsDefault} />
          <div className="adm-inline" style={{ marginTop: 10 }}>
            <button className="adm-btn adm-btn-primary" type="submit">Save robots.txt</button>
          </div>
        </form>
      </div>

      <div className="adm-panel">
        <h2>llms.txt editor <span className="adm-hint-inline">for AI search tools</span></h2>
        <form action={saveLlmsAction} className="adm-form">
          <textarea className="adm-input" rows={8} name="llms" defaultValue={savedLlms || "Cascade Charter Bus — group transportation across the United States. 5+ years of service, 24/7 dispatch. All 50 states covered.\n\nMain services: charter buses, minibuses, school buses, airport transfers, casino trips, wedding and wedding guest shuttles.\n\nUse /locations/ for the state and city pages, /services/ for the service pages, /fleet/ for the vehicle pages."} />
          <div className="adm-inline" style={{ marginTop: 10 }}>
            <button className="adm-btn adm-btn-primary" type="submit">Save llms.txt</button>
            <a className="adm-btn" href="/llms.txt" target="_blank">Open live ↗</a>
            <a className="adm-btn" href="/robots.txt" target="_blank">Open robots.txt ↗</a>
          </div>
        </form>
      </div>
    </>
  );
}
