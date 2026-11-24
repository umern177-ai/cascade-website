// Hierarchical sitemap (SEO consultant structure, Nov 2026):
//   /sitemap.xml (index)
//    - sitemap-static.xml     main pages
//    - sitemap-services.xml   service pages
//    - sitemap-fleet.xml      fleet pages
//    - sitemap-locations.xml  state pages + city pages (~758)
//    - sitemap-posts.xml      blog articles
// Only real + indexable URLs: pages/posts the admin marked noindex, and
// deleted posts, are excluded automatically. Blog list comes from the
// admin-aware blogPosts() view.
import "server-only";
import { states } from "@/lib/locations";
import { SERVICES } from "@/lib/site-data";
import { VEHICLES } from "@/lib/fleet-data";
import { getPageBodyFile, getMetaFile, getCityMetaFile } from "@/lib/admin/store";
import { blogPosts } from "@/lib/blog-serve";

const BASE = "https://cascadecharterbus.com";

function entryXml(loc: string, lastmod: string): string {
  return `<url><loc>${BASE}${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
}

function buildXml(locs: string[]): string {
  const NL = String.fromCharCode(10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locs.join(NL)}
</urlset>`;
}

function today(): string {
  return new Date().toISOString();
}

// pages/posts the admin marked noindex are excluded from ALL sitemaps
async function noindexPaths(): Promise<Set<string>> {
  const [meta, cityMeta] = await Promise.all([getMetaFile(), getCityMetaFile()]);
  const out = new Set<string>();
  for (const [p, m] of Object.entries(meta)) if (m.robots && m.robots.startsWith("noindex")) out.add(p);
  for (const [p, m] of Object.entries(cityMeta)) if (m.robots && m.robots.startsWith("noindex")) out.add(p);
  return out;
}

async function staticLocs(): Promise<string[]> {
  const noindex = await noindexPaths();
  const pages: Array<[string]> = [
    ["/"], ["/about/"], ["/contact/"], ["/faqs/"], ["/blog/"], ["/services/"],
    ["/fleet/"], ["/locations/"], ["/sitemap/"], ["/privacy-policy/"],
    ["/termsandconditions/"], ["/cancellation-policy/"],
  ];
  return pages.filter(([p]) => !noindex.has(p)).map(([p]) => entryXml(p, today()));
}

function serviceLocs(): string[] {
  return [entryXml("/services/", today()), ...SERVICES.map((s) => entryXml(`/services/${s.slug}/`, today()))];
}

function fleetLocs(): string[] {
  return [entryXml("/fleet/", today()), ...VEHICLES.map((v) => entryXml(`/fleet/${v.slug}/`, today()))];
}

async function locationLocs(): Promise<string[]> {
  const noindex = await noindexPaths();
  const out: string[] = [];
  for (const s of states()) {
    const sp = `/locations/${s.state_code}/`;
    if (!noindex.has(sp)) out.push(entryXml(sp, today()));
    for (const c of s.cities) {
      const cp = `/locations/${s.state_code}/${c.slug}/`;
      if (!noindex.has(cp)) out.push(entryXml(cp, today()));
    }
  }
  return out;
}

async function postLocs(): Promise<string[]> {
  const [noindex, posts] = await Promise.all([noindexPaths(), blogPosts()]);
  return posts
    .filter((p) => !(p.noindex || noindex.has(`/blog/${p.slug}/`)))
    .map((p) => entryXml(`/blog/${p.slug}/`, today()));
}

export type Child = { name: string; xml: () => Promise<string> };

export const SITEMAP_CHILDREN: Child[] = [
  { name: "sitemap-static.xml", xml: async () => buildXml(await staticLocs()) },
  { name: "sitemap-services.xml", xml: async () => buildXml(serviceLocs()) },
  { name: "sitemap-fleet.xml", xml: async () => buildXml(fleetLocs()) },
  { name: "sitemap-locations.xml", xml: async () => buildXml(await locationLocs()) },
  { name: "sitemap-posts.xml", xml: async () => buildXml(await postLocs()) },
];

export async function sitemapIndexXml(): Promise<string> {
  const NL = String.fromCharCode(10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_CHILDREN.map((c) => `  <sitemap><loc>${BASE}/${c.name}</loc><lastmod>${today()}</lastmod></sitemap>`).join(NL)}
</sitemapindex>`;
}

export { buildXml };

// /sitemap-all.xml — ONE raw XML file containing EVERY live page of the website
// (owner request Nov 24: "raw xml file should have all the links… same as
// cascadecharterbus.com/sitemap.xml" — the old site served one flat file with
// all its URLs). 792 URLs < Google's 50,000-per-file limit. The 5-section
// index stays untouched for the consultant's structure; this file is the
// all-in-one view of the same pages.
export async function allPagesXml(): Promise<string> {
  const [staticLocs_, serviceLocs_, fleetLocs_, locationLocs_, postLocs_] = await Promise.all([
    SITEMAP_CHILDREN[0].xml(),
    SITEMAP_CHILDREN[1].xml(),
    SITEMAP_CHILDREN[2].xml(),
    SITEMAP_CHILDREN[3].xml(),
    SITEMAP_CHILDREN[4].xml(),
  ]);
  const extract = (doc: string): string[] =>
    [...doc.matchAll(/<url><loc>[^<]+<\/loc><lastmod>[^<]*<\/lastmod><\/url>/g)].map((m) => m[0]);
  return buildXml([
    ...extract(staticLocs_),
    ...extract(serviceLocs_),
    ...extract(fleetLocs_),
    ...extract(locationLocs_),
    ...extract(postLocs_),
  ]);
}

/* ---------- browser view (owner request Nov 24)
   Same files, same URLs, same XML for crawlers — but when a human opens a
   sitemap file in a browser they get the site's dark view with every link
   clickable. Negotiated by the Accept header; ?format=xml forces the raw file.
   No XSLT — Chrome/Edge deprecate it. */
export function wantsHtmlView(accept: string | null, format: string | null | undefined): boolean {
  if (format === "xml") return false;
  return !!accept && accept.includes("text/html");
}

const VIEW_CSS = `
:root{--ink:#0f1115;--amber:#f5a002;--line:#e8e8ec;--muted:#6a7180}
*{box-sizing:border-box}
body{margin:0;background:#f5f6f8;color:var(--ink);font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;line-height:1.55}
a{color:var(--ink);text-decoration:none}a:hover{color:var(--amber)}
.hero{background:var(--ink);color:#fff;padding:56px 20px 48px;text-align:center;position:relative;overflow:hidden}
.hero:before{content:"";position:absolute;inset:0;background:radial-gradient(600px 200px at 50% 0%,rgba(245,160,2,.12),transparent 70%)}
.hero>*{position:relative}
.brand{color:var(--amber);font-weight:800;letter-spacing:.18em;font-size:.78rem;text-transform:uppercase;margin:0 0 10px}
h1{font-size:clamp(1.6rem,4vw,2.4rem);margin:0 0 8px;font-weight:800}
.sub{color:#a9b0bd;font-size:.95rem;margin:0 auto 22px;max-width:640px}
.chips{display:flex;justify-content:center;flex-wrap:wrap;gap:8px}
.chip{display:inline-block;border:1px solid rgba(255,255,255,.25);color:#fff;border-radius:999px;padding:6px 14px;font-size:.75rem;font-weight:700;letter-spacing:.06em}
.chip.hot{background:var(--amber);border-color:var(--amber);color:var(--ink)}
.crumb{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin:0 2px 12px;color:var(--muted);font-size:.8rem}
.crumb a{font-weight:700;color:var(--muted);text-decoration:underline}.crumb a:hover{color:var(--amber)}
.card{background:#fff;border-radius:18px;box-shadow:0 18px 40px rgba(15,17,21,.10);overflow:hidden}
table{width:100%;border-collapse:collapse;table-layout:fixed}
th{background:#171920;color:#fff;text-align:left;font-size:.68rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;padding:12px 16px}
td{padding:10px 16px;border-top:1px solid var(--line);font-size:.88rem;vertical-align:top;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
tr:hover td{background:#fff9ec}
td.u{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.8rem}
td.u a{display:block;width:100%}
.d{color:var(--muted);font-size:.8rem}
.foot{text-align:center;color:var(--muted);font-size:.8rem;padding:14px 16px 40px}
.foot a{color:var(--amber);font-weight:700}
@media(max-width:560px){th,td{padding:10px 12px}}`;

const esc = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function sitemapHtml(xml: string, selfUrl: string, parentUrl: string | null): string {
  const isIndex = xml.includes("<sitemapindex");
  const rows: Array<{ path: string; loc: string; last: string; child: boolean }> = [];
  const rx = /<(sitemap|url)><loc>([^<]+)<\/loc>(?:<lastmod>([^<]*)<\/lastmod>)?<\/\1>/g;
  for (const m of xml.matchAll(rx)) {
    const loc = m[2];
    const path = loc.includes("https://cascadecharterbus.com")
      ? loc.slice("https://cascadecharterbus.com".length)
      : loc;
    rows.push({ path, loc, last: (m[3] || "").slice(0, 10), child: m[1] === "sitemap" });
  }
  const countLabel = isIndex ? `${rows.length} sitemap sections` : `${rows.length} pages`;
  const body = rows
    .map(
      (r) => {
        // href stays on the CURRENT host (relative path) so the view is fully
        // clickable on localhost / staging / production; crawlers get the
        // absolute production-domain XML untouched.
        const href = r.path.startsWith("http") ? r.path : r.path;
        return `<tr><td class="u" title="${esc(r.path)}"><a href="${esc(r.path)}">${esc(r.path)}</a></td><td class="d" style="width:120px">${esc(r.last)}</td></tr>`;
      }
    )
    .join("\n");
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><meta name="robots" content="noindex"/><title>XML Sitemap | Cascade Charter Bus</title><style>${VIEW_CSS}</style></head><body>
<div class="hero"><p class="brand">Cascade Charter Bus</p><h1>XML Sitemap</h1>
<p class="sub">Every page, listed and clickable. <a style="color:#fff;text-decoration:underline" href="/sitemap-all.xml">View the raw XML file</a> — every page of the site in one file (what Google also reads, same as the old sitemap).</p>
<div class="chips"><span class="chip hot">${countLabel}</span><span class="chip"><a href="/sitemap/" style="color:#fff">HTML sitemap page →</a></span><span class="chip"><a href="/sitemap.xml" style="color:#fff">Master sitemap →</a></span></div></div>
<div style="max-width:1060px;margin:-28px auto 0;padding:0 16px 56px;position:relative">
<div class="crumb"><span>${isIndex ? "Sitemap index" : "All pages — " + rows.length + " links"}</span><span>${parentUrl ? `<a href="${esc(parentUrl)}">← Back to master sitemap</a>` : `<a href="/sitemap.xml">This is the master sitemap</a>`}</span></div>
<div class="card"><table><thead><tr><th>${isIndex ? "Sitemap section" : "Page link"}</th><th style="width:120px">Last Modified</th></tr></thead><tbody>${body}</tbody></table></div>
</div>
<p class="foot">Crawlers read this same URL as plain XML — the list above is the same file. <a href="/">Cascade Charter Bus</a> — charter buses for groups across the United States.</p>
</body></html>`;
}

// Used by every sitemap route: styled view for browsers, XML for crawlers.
export async function sitemapResponse(
  req: Request,
  selfUrl: string,
  parentUrl: string | null,
  produceXml: () => Promise<string>
): Promise<Response> {
  const accept = req.headers.get("accept");
  const format = new URL(req.url).searchParams.get("format");
  if (wantsHtmlView(accept, format)) {
    return new Response(sitemapHtml(await produceXml(), selfUrl, parentUrl), {
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=3600" },
    });
  }
  return new Response(await produceXml(), {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=3600" },
  });
}
