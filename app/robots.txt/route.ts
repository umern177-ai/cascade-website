// robots.txt — served live (Admin Panel Upgrade Phase 5, 7.3): reads the
// admin override from the store; STAGING=1 still blocks everything.
import { getSiteConfig } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.STAGING === "1") {
    return new Response("User-agent: *" + String.fromCharCode(10) + "Disallow: /", {
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex, nofollow" },
    });
  }
  const override = (await getSiteConfig()).robotsOverride?.trim();
  const NL = String.fromCharCode(10);
  let body = override;
  if (body) {
    if (!/^sitemap:/im.test(body)) {
      body += NL + "Sitemap: https://cascadecharterbus.com/sitemap.xml" + NL + "Sitemap: https://cascadecharterbus.com/sitemap-all.xml";
    }
  } else {
    body = [
      "User-agent: *",
      "Allow: /",
      "Disallow: /admin/",
      "Disallow: /api/",
      "",
      "Sitemap: https://cascadecharterbus.com/sitemap.xml",
      "Sitemap: https://cascadecharterbus.com/sitemap-all.xml",
    ].join(NL);
  }
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=3600" },
  });
}
