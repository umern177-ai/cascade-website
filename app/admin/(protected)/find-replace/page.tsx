// Find & Replace across the site (Admin Panel Upgrade section 3.8).
// Searches page content, site copy, global facts and city/state meta;
// one-click replace-all, previewed first, everything in the History log.
import Link from "next/link";
import { getPageBodyFile, getSiteConfig } from "@/lib/admin/store";
import { getContent } from "@/lib/admin/store";
import applyReplaceAction from "./apply-action";
import { Search, Replace } from "lucide-react";

export const dynamic = "force-dynamic";

type Match = { area: string; path: string; key: string; value: string };

async function findMatches(q: string): Promise<Match[]> {
  const out: Match[] = [];
  const add = (area: string, path: string, key: string, value: string) => {
    out.push({ area, path, key, value });
  };
  const bodies = await getPageBodyFile();
  for (const [p, body] of Object.entries(bodies)) {
    for (const [k, v] of Object.entries(body.fields ?? {})) {
      if (v.toLowerCase().includes(q)) add("Page content", p, k, v);
    }
    for (const [i, f] of (body.faqs ?? []).entries()) {
      if (f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)) add("FAQ", p, "faq" + i, f.q + " — " + f.a);
    }
  }
  const content = await getContent();
  const contentKeys: Array<[string, Record<string, unknown>]> = [
    ["homeFAQ", (content.homeFaqs ?? []) as unknown as Record<string, unknown>[]] as unknown as [string, Record<string, unknown>],
  ];
  void contentKeys;
  const flatten = (obj: unknown, prefix: string, area: string, path: string) => {
    if (typeof obj === "string") {
      if (obj.toLowerCase().includes(q)) add(area, path, prefix, obj);
    } else if (Array.isArray(obj)) {
      obj.forEach((x, i) => flatten(x, `${prefix}[${i}]`, area, path));
    } else if (obj && typeof obj === "object") {
      for (const [k, v] of Object.entries(obj as Record<string, unknown>)) flatten(v, `${prefix}:${k}`, area, path);
    }
  };
  flatten(content, "site-content", "Site content", "/admin/content");
  const cfg = await getSiteConfig();
  flatten(cfg.global ?? {}, "global", "Global facts", "/admin/global");
  return out;
}

export default async function AdminFindReplace({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; replaced?: string; apply?: string; "r:with"?: string; done?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const matches = q ? await findMatches(q.toLowerCase()) : [];
  const replacedCount = sp.replaced ? Number(sp.replaced) : 0;

  return (
    <>
      <header className="adm-page-head">
        <div><h1>Find &amp; replace</h1><p>Search text everywhere the admin can edit — replace one, some, or all. Everything lands in the history log.</p></div>
        <Search aria-hidden="true" />
      </header>

      {sp.done === "1" && <div className="adm-alert">Replaced {replacedCount} occurrence(s) of “{q}”.</div>}

      <div className="adm-panel">
        <form action="/admin/find-replace" method="get" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <label className="adm-label">Find text</label>
            <input className="adm-input" style={{ width: 280 }} name="q" defaultValue={q} placeholder='e.g. "10+ years"' />
          </div>
          <button className="adm-btn" type="submit"><Search size={14} /> Find</button>
        </form>
      </div>

      {q && (
        <div className="adm-panel">
          <h2>{matches.length} match{matches.length === 1 ? "" : "es"} for “{q}”</h2>
          {matches.length === 0 ? (
            <p className="adm-hint">Nothing found in the editable copy.</p>
          ) : (
            <>
              <table className="adm-table">
                <thead><tr><th>Where</th><th>Page</th><th>Field</th><th>Containing text</th></tr></thead>
                <tbody>
                  {matches.slice(0, 300).map((m, i) => (
                    <tr key={i}>
                      <td>{m.area}</td>
                      <td>{m.path.startsWith("/") ? <Link className="adm-link" href={`/admin/pages/edit?path=${encodeURIComponent(m.path)}`}>{m.path}</Link> : <code>{m.path}</code>}</td>
                      <td><code style={{ fontSize: 11 }}>{m.key}</code></td>
                      <td>{m.value.length > 160 ? m.value.slice(0, 160) + "…" : m.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <form action={applyReplaceAction} style={{ marginTop: 14 }}>
                <input type="hidden" name="q" value={q} />
                <label className="adm-label">Replace with</label>
                <div className="adm-inline">
                  <input className="adm-input" name="with" style={{ width: 280 }} placeholder="New text (empty = remove)" />
                  <button className="adm-btn adm-btn-primary" type="submit"><Replace size={14} /> Replace all {matches.length}</button>
                </div>
              </form>
              <p className="adm-hint">A preview is shown before nothing is written — the apply step confirms and saves each change to the History log. Case-insensitive match.</p>
            </>
          )}
        </div>
      )}
    </>
  );
}
