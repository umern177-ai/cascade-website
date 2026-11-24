// 404 Monitor (Admin Panel Upgrade Phase 4, section 6.7). The proxy logs every
// URL that renders the 404 page; the worst offenders sit on top with
// one-click "create redirect" (prefills the form) and "ignore".
import Link from "next/link";
import { getSiteConfig } from "@/lib/admin/store";
import { Globe, EyeOff } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Admin404s({ searchParams }: { searchParams: Promise<{ ignoredsaved?: string }> }) {
  const { ignoredsaved } = await searchParams;
  const cfg = await getSiteConfig();
  const log404s = (readJsonSafe("data/admin/404s.json") as Record<string, { hits: number; first: string; last: string }> | null) ?? {};
  const ignores = (await getSiteConfig()).global ? ((readJsonSafe("data/admin/404-ignores.json") as string[] | null) ?? []) : [];
  void ignores;
  const rows = Object.entries(log404s)
    .filter(([path]) => !isIgnored(path))
    .sort((a, b) => (b[1].hits ?? 0) - (a[1].hits ?? 0) || (a[1].last < b[1].last ? 1 : -1));

  // suggested target: state hub for old city URLs
  const suggest = (path: string): string => {
    const m = path.match(/^\/locations\/([a-z]{2})\/(.+?)\/?$/i);
    if (m && m[1] !== "pr") return `/locations/${m[1].toLowerCase()}/`;
    if (/^\/blog\//.test(path)) return "/blog/";
    if (/^\/services\//.test(path)) return "/services/";
    return "/";
  };

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1>404 monitor</h1>
          <p>Every 404 the site served, most-hit first. Create a redirect (live instantly) or ignore junk paths.</p>
        </div>
        <Globe aria-hidden="true" />
      </header>
      {ignoredsaved && <div className="adm-alert">Path pattern ignored — future hits will not be logged.</div>}

      <div className="adm-panel">
        {rows.length === 0 ? (
          <p className="adm-hint">No 404s logged yet. Removed city URLs return a friendly 410 instead, so they never appear here.</p>
        ) : (
          <table className="adm-table">
            <thead><tr><th>URL (404)</th><th>Hits</th><th>First seen</th><th>Last seen</th><th>Suggested target</th><th></th></tr></thead>
            <tbody>
              {rows.map(([path, h]) => (
                <tr key={path}>
                  <td><code style={{ fontSize: 11.5 }}>{path}</code></td>
                  <td>{h.hits}</td>
                  <td className="adm-muted" style={{ whiteSpace: "nowrap" }}>{new Date(h.first).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                  <td className="adm-muted" style={{ whiteSpace: "nowrap" }}>{new Date(h.last).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                  <td><code style={{ fontSize: 11 }}><Link className="adm-link" href={suggest(path)} target="_blank">{suggest(path)}</Link></code></td>
                  <td className="adm-row-actions">
                    <Link className="adm-btn" href={`/admin/redirects?from=${encodeURIComponent(path)}`}>Create redirect</Link>
                    <form action="/api/admin/404-ignore" method="post">
                      <input type="hidden" name="pattern" value={path} />
                      <button className="adm-iconbtn" type="submit" title="Ignore this path"><EyeOff size={14} /></button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

import fs from "node:fs";
import pathd from "node:path";

function readJsonSafe(rel: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(pathd.join(process.cwd(), rel), "utf8"));
  } catch {
    return null;
  }
}

function isIgnored(path: string): boolean {
  try {
    return ((readJsonSafe("data/admin/404-ignores.json") as string[] | null) ?? []).some((p) => new RegExp(p).test(path));
  } catch {
    return false;
  }
}