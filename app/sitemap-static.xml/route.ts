import { SITEMAP_CHILDREN, sitemapResponse } from "@/lib/sitemap-xml";

export const revalidate = 3600; // ISR: picks up admin changes hourly or on admin save

const child = SITEMAP_CHILDREN.find((c) => c.name === "sitemap-static.xml")!;

export async function GET(req: Request) {
  // Styled view for browsers, XML for crawlers (lib/sitemap-xml.ts).
  return sitemapResponse(req, "/sitemap-static.xml", "/sitemap.xml", child.xml);
}
