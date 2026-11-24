import { sitemapIndexXml, sitemapResponse } from "@/lib/sitemap-xml";

export const revalidate = 3600; // ISR: picks up admin changes hourly or on admin save

export async function GET(req: Request) {
  // Styled view for browsers, XML for crawlers (lib/sitemap-xml.ts).
  return sitemapResponse(req, "/sitemap.xml", null, sitemapIndexXml);
}
