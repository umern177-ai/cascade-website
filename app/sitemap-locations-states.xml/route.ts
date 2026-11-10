import { SITEMAP_CHILDREN } from "@/lib/sitemap-xml";

export const dynamic = "force-static";

const child = SITEMAP_CHILDREN.find((c) => c.name === "sitemap-locations-states.xml")!;

export async function GET() {
  return new Response(child.xml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
