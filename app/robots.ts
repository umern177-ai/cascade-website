import type { MetadataRoute } from "next";

// robots.txt (brief Section 9.6). STAGING=1 env → block every crawler:
// the staging/deployment URL must never be indexed. Real site serves the
// normal policy with the sitemap address.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (process.env.STAGING === "1") {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: "https://cascadecharterbus.com/sitemap.xml",
  };
}
