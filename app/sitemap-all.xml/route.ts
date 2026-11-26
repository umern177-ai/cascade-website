// /sitemap-all.xml — ONE file with every live page of the website (same
// shape as the old site's flat sitemap.xml), always pure XML.
import { allPagesXml } from "@/lib/sitemap-xml";

export const revalidate = 3600;

export async function GET() {
  return new Response(await allPagesXml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
