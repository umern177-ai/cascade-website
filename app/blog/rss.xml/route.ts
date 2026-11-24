// /blog/rss.xml — RSS 2.0 feed of published blog posts (Admin Panel Upgrade
// section 4.4). Styled view for browsers, XML for crawlers, same as sitemaps.
import { blogPosts } from "@/lib/blog-serve";
import { SITE } from "@/lib/site-data";

export const revalidate = 3600;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function GET(req: Request) {
  const posts = await blogPosts();
  const items = posts
    .map(
      (p) =>
        `    <item><title>${esc(p.title)}</title><link>${SITE.url}/blog/${p.slug}/</link><guid isPermaLink="true">${SITE.url}/blog/${p.slug}/</guid><pubDate>${new Date(p.date + "T12:00:00Z").toUTCString()}</pubDate><description>${esc(p.excerpt || p.description)}</description></item>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>Cascade Charter Bus Blog</title>
  <link>${SITE.url}/blog/</link>
  <description>Charter bus planning guides from the Cascade dispatch team.</description>
  <language>en-us</language>
${items}
</channel></rss>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=3600" },
  });
}
