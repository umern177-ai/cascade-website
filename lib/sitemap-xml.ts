// Sitemap XML helpers (brief Section 9.6): hierarchical sitemap index with the
// SEO consultant's child filenames, real lastmod dates, only real + indexable
// URLs. Regenerated on each request (cached by the host/CDN); when the admin
// publishes content (Phase 3b), pages revalidate and these update with it.
import { states } from "@/lib/locations";
import { SERVICES, FLEET } from "@/lib/site-data";
import { VEHICLES } from "@/lib/fleet-data";

const BASE = "https://cascadecharterbus.com";

function xmlEntry(loc: string, lastmod: string): string {
  return `<url><loc>${BASE}${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
}

function build(children: { path: string; locs: [string, string][] }): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${children.locs.map(([l, m]) => xmlEntry(l, m)).join("\n")}
</urlset>`;
}

function today(): string {
  return new Date().toISOString();
}

export type Child = { name: string; xml: () => string };

export const SITEMAP_CHILDREN: Child[] = [
  {
    name: "sitemap-pages.xml",
    xml: () =>
      build({
        path: "pages",
        locs: [["/", today()], ["/about/", today()], ["/contact/", today()], ["/faqs/", today()], ["/privacy-policy/", today()], ["/termsandconditions/", today()], ["/cancellation-policy/", today()]],
      }),
  },
  {
    name: "sitemap-services.xml",
    xml: () =>
      build({
        path: "services",
        locs: [["/services/", today()], ...SERVICES.map((s) => [`/services/${s.slug}/`, today()] as [string, string])],
      }),
  },
  {
    name: "sitemap-fleet.xml",
    xml: () =>
      build({
        path: "fleet",
        locs: [["/fleet/", today()], ...VEHICLES.map((v) => [`/fleet/${v.slug}/`, today()] as [string, string])],
      }),
  },
  {
    name: "sitemap-locations-states.xml",
    xml: () =>
      build({ path: "states", locs: states().map((s) => [`/locations/${s.state_code}/`, today()] as [string, string]) }),
  },
  {
    name: "sitemap-locations-cities.xml",
    xml: () =>
      // The 710 approved kept city pages only (Rule R4).
      build({
        path: "cities",
        locs: states().flatMap((s) => s.cities.map((c) => [`/locations/${s.state_code}/${c.slug}/`, today()] as [string, string])),
      }),
  },
];

export function sitemapIndexXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_CHILDREN.map((c) => `  <sitemap><loc>${BASE}/${c.name}</loc><lastmod>${today()}</lastmod></sitemap>`).join("\n")}
</sitemapindex>`;
}

export { build };
