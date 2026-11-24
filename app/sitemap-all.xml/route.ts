// /sitemap-all.xml — ONE file with every live page of the website (owner
// request Nov 24, matching the old site's flat sitemap.xml). The 5-section
// index stays for the consultant structure; Search Console submits
// /sitemap.xml, and this all-in-one file is linked from the sitemap views.
// Browser gets the styled view, crawlers the raw XML (lib/sitemap-xml.ts).
import { allPagesXml, sitemapResponse } from "@/lib/sitemap-xml";

export const revalidate = 3600; // ISR: picks up admin changes hourly or on admin save

export async function GET(req: Request) {
  return sitemapResponse(req, "/sitemap-all.xml", "/sitemap.xml", allPagesXml);
}
