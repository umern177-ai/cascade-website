import { sitemapIndexXml } from "@/lib/sitemap-xml";

export const dynamic = "force-static";

export async function GET() {
  return new Response(sitemapIndexXml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
