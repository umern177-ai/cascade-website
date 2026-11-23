import { SITEMAP_CHILDREN } from "@/lib/sitemap-xml";

export const revalidate = 3600; // ISR: picks up admin changes hourly or on admin save

const child = SITEMAP_CHILDREN.find((c) => c.name === "sitemap-posts.xml")!;

export async function GET() {
  return new Response(await child.xml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
