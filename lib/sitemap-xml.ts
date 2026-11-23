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
