// Edge middleware for URL-policy rules (brief Sections 9.1, 10, 14):
// 1. Lowercase enforcement: any URL with uppercase letters 301s to lowercase.
// 2. Removed city URLs (the ~25,900 pages deliberately not kept) return a real
//    410 Gone with the friendly removed-page HTML — never an accidental 404.
// www→apex 301 lives in next.config.ts redirects (host condition).
import { NextResponse, type NextRequest } from "next/server";
import keptSlugs from "./data/kept-slugs.json";

type SlugMap = Record<string, string[]>;

const KEPT = keptSlugs as SlugMap;
const KEPT_STATES = new Set(Object.keys(KEPT));

export const config = {
  // Skip internal assets and the API/admin surfaces.
  matcher: ["/((?!api/|_next/|favicon|robots.txt|sitemap|llms.txt|images/|brand/|manifest).*)"],
};

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 0. STAGING flag read once: deployments with STAGING=1 are never indexable
  //    (robots.txt blocks crawling; the header below keeps discovered URLs out
  //    of Google's index too). The URL rules below still run on staging.
  const isStaging = process.env.STAGING === "1";

  // 1. Lowercase URL policy (Section 14): mixed-case path → 301 to lowercase.
  if (/[A-Z]/.test(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 301);
  }

  // 2. Removed city URLs → 410 Gone (Section 10). Applies to every
  // /locations/{state}/{city}/ that is not in the approved keep list.
  const parts = pathname.split("/").filter(Boolean); // ["locations","oh","aberdeen"]
  if (parts.length === 3 && parts[0] === "locations") {
    const [, state, city] = parts;
    const isRealState = KEPT_STATES.has(state);
    const keptSlugs = isRealState ? KEPT[state] : undefined;
    if (!keptSlugs || !keptSlugs.includes(city)) {
      const html = goneHtml(city ? `${decodeURIComponent(city.replace(/-/g, " "))}` : "this destination");
      return new Response(html, {
        status: 410,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "x-robots-tag": "noindex",
          "cache-control": "public, max-age=86400",
        },
      });
    }
    // Kept city but state not kept (never happens: kept city implies kept state)
  }

  // Non-US locations (e.g. Puerto Rico) and unknown states fall through to the
  // 404 page — there is no state page and no removed-city history for them.
  if (parts.length === 2 && parts[0] === "locations" && !KEPT_STATES.has(parts[1])) {
    // Unknown state codes: 410 matches the removed-areas rule; PR was removed.
    if (parts[1] === "pr") {
      const html = goneHtml("Puerto Rico");
      return new Response(html, {
        status: 410,
        headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" },
      });
    }
  }

  const res = NextResponse.next();
  if (isStaging) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

function goneHtml(place: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Page Removed | Cascade Charter Bus</title>
<meta name="description" content="This page has been removed. Get a quote or browse locations to plan your next trip."/>
<style>
body{margin:0;background:#0f1115;color:#fff;font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center}
.wrap{padding:2rem;max-width:560px}
h1{font-size:1.6rem;margin:0.5rem 0}
p{color:#a1a1a1;line-height:1.7}
a.btn{display:inline-block;background:#f5a002;color:#0f1115;font-weight:700;text-decoration:none;border-radius:50rem;padding:.8rem 1.8rem;margin:.5rem;letter-spacing:1px}
a.ghost{color:#f5a002;text-decoration:none;font-weight:700}
</style></head><body><div class="wrap">
<p style="color:#f5a002;font-weight:700;letter-spacing:1px;margin:0">CASCADE CHARTER BUS</p>
<h1>This page has been removed</h1>
<p>We no longer keep a page for ${place}—but your group can still start anywhere in the U.S.</p>
<a class="btn" href="/contact/">GET A QUOTE</a>
<a class="ghost" href="/locations/">Browse Locations</a>
</div></body></html>`;
}
