// The admin "All pages" catalog: EVERY page on the site (800+) in one list —
// core, services, fleet, blog, states, cities — with a title, its path, and a
// type so the WordPress-style editor (/admin/pages/edit) knows what each page
// carries (meta only, meta + body copy, or post editor).
import "server-only";
import { blogPosts } from "@/lib/blog-serve";
import { keptCities, states } from "@/lib/locations";
import { SERVICES, FLEET } from "@/lib/site-data";
import { getPageBodyFile } from "@/lib/admin/store";

export type CatalogType = "core" | "service" | "fleet" | "blog" | "state" | "city";

export type CatalogEntry = {
  path: string;
  title: string;
  type: CatalogType;
  hasBody?: boolean;
};

const CORE: { path: string; title: string }[] = [
  { path: "/", title: "Home" },
  { path: "/about/", title: "About" },
  { path: "/contact/", title: "Contact" },
  { path: "/faqs/", title: "FAQs" },
  { path: "/blog/", title: "Blog hub" },
  { path: "/services/", title: "Services hub" },
  { path: "/fleet/", title: "Fleet hub" },
  { path: "/locations/", title: "Locations hub" },
  { path: "/privacy-policy/", title: "Privacy policy" },
  { path: "/termsandconditions/", title: "Terms & conditions" },
  { path: "/cancellation-policy/", title: "Cancellation policy" },
];

export async function pageCatalog(): Promise<CatalogEntry[]> {
  const [posts, bodies] = await Promise.all([blogPosts(), getPageBodyFile()]);
  const out: CatalogEntry[] = [];
  for (const c of CORE) out.push({ path: c.path, title: c.title, type: "core" });
  for (const s of SERVICES) {
    const p = `/services/${s.slug}/`;
    out.push({ path: p, title: s.name, type: "service", hasBody: !!bodies[p] });
  }
  for (const v of FLEET) {
    const p = `/fleet/${v.slug}/`;
    out.push({ path: p, title: v.name, type: "fleet", hasBody: !!bodies[p] });
  }
  for (const p of posts) {
    out.push({ path: `/blog/${p.slug}/`, title: p.title, type: "blog" });
  }
  for (const s of states()) {
    const p = `/locations/${s.state_code}/`;
    out.push({ path: p, title: `State: ${s.state_name || s.state_code}`, type: "state", hasBody: !!bodies[p] });
    for (const c of keptCities(s.state_code)) {
      const cp = `/locations/${s.state_code}/${c.slug}/`;
      out.push({ path: cp, title: c.city, type: "city", hasBody: !!bodies[cp] });
    }
  }
  return out;
}
