import { sitemapIndexXml } from "@/lib/sitemap-xml";

export const revalidate = 3600; // ISR: picks up admin changes hourly or on admin save

export async function GET() {
  // Pure XML only — the human view of the sitemap lives at /sitemap/.
  return new Response(await sitemapIndexXml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
