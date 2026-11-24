// Launch Redirect Map (Admin Panel Upgrade Phase 4, section 6.8): paste old
// URLs (the old sitemap, GSC export or a crawl), the tool classifies each as
// still-exists / needs 301 (with a suggested target = kept page or state hub)
// / 410, and the SEO person applies the suggestions in one click.
import Link from "next/link";
import { pageCatalog } from "@/lib/admin/page-catalog";
import { states } from "@/lib/locations";
import { getBlogFile } from "@/lib/admin/store";
import applyMapAction from "./apply-map-action";
import { Map } from "lucide-react";

export const dynamic = "force-dynamic";

type Class = { url: string; verdict: "exists" | "301" | "410"; target: string; note: string };

export default async function AdminLaunchMap({ searchParams }: { searchParams: Promise<{ pasted?: string; saved?: string }> }) {
  const sp = await searchParams;
  const list = sp.pasted ? sp.pasted.split(/\r?\n/).map((l) => l.trim()).filter(Boolean) : [];
  const classes: Class[] = [];
  if (list.length) {
    const known = new Set((await pageCatalog()).map((c) => c.path));
    const blog = new Set((await getBlogFile()).posts.map((p) => "/blog/" + p.slug + "/"));
    const stateHubs = new Set(states().map((s) => s.state_code));
    const seen = new Set<string>();
    for (const raw of list) {
      let url: string;
      try {
        url = new URL(raw).pathname;
      } catch {
        url = raw;
      }
      const trimmed = "/" + url.replace(/^\/+|\/+$/g, "") + "/";
      if (seen.has(trimmed)) continue;
      seen.add(trimmed);
      let verdict: Class["verdict"] = "410";
      let target = "";
      let note = "No kept page matches — suggest 410 gone";
      if (known.has(trimmed) || blog.has(trimmed)) {
        verdict = "exists";
        target = trimmed;
        note = "Page still exists — no redirect needed";
      } else {
        const m = trimmed.match(/^\/locations\/([a-z]{2})\/(.+?)\/$/i) ?? trimmed.match(/^\/locations\/([a-z]{2})\/(.+?)\/$/);
        const st = (m ? m[1].toLowerCase() : "") || (url.match(/locations\/([a-z]{2})/i)?.[1] || "").toLowerCase();
        const citySlug = m ? m[2] : "";
        if (st === "pr" || (stateHubs.has(st) && citySlug && !/[a-z]/.test("x"))) {
          verdict = "410";
          note = "Non-US area — 410 gone";
        } else if (stateHubs.has(st)) {
          verdict = "301";
          target = `/locations/${st}/`;
          note = "Removed city — 301 to the state hub";
        } else if (blog.has(trimmed)) {
          verdict = "exists";
          target = trimmed;
        } else if (/^\/blog\/.+\/$/.test(trimmed)) {
          verdict = "301";
          target = "/blog/";
          note = "Old post — 301 to the blog hub";
        } else if (/^\/services\/.+\/$/.test(trimmed)) {
          verdict = "301";
          target = "/services/";
          note = "Old service page — 301 to the services hub";
        } else if (/^\/fleet\/.+\/$/.test(trimmed)) {
          verdict = "301";
          target = "/fleet/";
          note = "Old fleet page — 301 to the fleet hub";
        }
      }
      classes.push({ url: trimmed, verdict, target, note });
    }
  }

  const applyable = classes
    .filter((c) => c.verdict !== "exists")
    .map((c) => ({ from: c.url, to: c.verdict === "410" ? "" : c.target, type: c.verdict === "410" ? 410 : 301 }));

  return (
    <>
      <header className="adm-page-head">
        <div><h1>Launch redirect map</h1><p>Paste the old site's URLs. The tool marks each: still exists / needs a 301 (target suggested) / 410. You apply what you accept.</p></div>
        <Map aria-hidden="true" />
      </header>

      {sp.saved && <div className="adm-alert">Applied — the rules are live in the redirect list.</div>}
      <div className="adm-panel">
        <Link className="adm-btn" href="/admin/redirects">← Redirects</Link>
      </div>

      <div className="adm-panel">
        <form method="get" action="/admin/redirects/map" className="adm-form">
          <label className="adm-label">Old URLs (one per line)</label>
          <textarea className="adm-input" rows={8} name="pasted" defaultValue={sp.pasted ?? ""} placeholder={"https://cascadecharterbus.com/locations/ut/park-city/\nhttps://cascadecharterbus.com/locations/al/tuscaloosa/\n…"} />
          <button className="adm-btn adm-btn-primary" type="submit" style={{ marginTop: 10 }}>Classify {list.length ? `(${list.length} lines)` : ""}</button>
        </form>
      </div>

      {classes.length > 0 && (
        <>
          <div className="adm-panel">
            <h2>{`Results — ${classes.filter((c) => c.verdict === "exists").length} exist, ${applyable.length} need rules`}</h2>
            <table className="adm-table">
              <thead><tr><th>URL</th><th>Verdict</th><th>Target</th><th>Note</th></tr></thead>
              <tbody>
                {classes.map((c, i) => (
                  <tr key={i}>
                    <td><code style={{ fontSize: 11 }}>{c.url}</code></td>
                    <td><span className="adm-chip" style={c.verdict === "exists" ? { background: "#e2f2e7", color: "#1d6b3f" } : c.verdict === "410" ? { background: "#fbe3e3", color: "#952e2e" } : undefined}>{c.verdict.toUpperCase()}</span></td>
                    <td>{c.target ? <Link className="adm-link" href={c.target} target="_blank">{c.target}</Link> : "—"}</td>
                    <td className="adm-muted">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {applyable.length > 0 && (
            <div className="adm-panel">
              <form action={applyMapAction}>
                <input type="hidden" name="payload" value={JSON.stringify(applyable)} />
                <button className="adm-btn adm-btn-primary" type="submit">Apply all {applyable.length} ({applyable.filter((a) => a.type === 410).length} × 410, {applyable.filter((a) => a.type === 301).length} × 301)</button>
              </form>
            </div>
          )}
        </>
      )}
    </>
  );
}
