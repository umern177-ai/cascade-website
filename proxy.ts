// Middleware (Admin Panel Upgrade Phase 4): NODE RUNTIME so the redirect
// engine reads data/admin/redirects.json at REQUEST time — a saved rule goes
// live in seconds, no build. Also runs the 410 policy and the 404 monitor.
// If Next rejects the nodejs runtime, this deploy build fails and the old
// edge fallback is re-applied (git history has it).
import { NextResponse, type NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";
import keptSlugs from "./data/kept-slugs.json";

type SlugMap = Record<string, string[]>;

const KEPT = keptSlugs as SlugMap;
const KEPT_STATES = new Set(Object.keys(KEPT));

export const config = {
  matcher: ["/((?!_next/|favicon|robots.txt|llms.txt|images/|brand/|manifest|uploads/.*|api/|admin|_next).*)?"],
};

// ---- tiny in-process cache so every request does not hit the disk --------
type Cached = { mtime: number; rules: RuntimeRule[] };
type CacheState = {
  rules?: Cached;
  hits: Map<string, { count: number; last: string }>;
  lastFlush: number;
  known?: Set<string>;
  ignores?: RegExp[];
};
const __g = globalThis as unknown as { __cbMid?: CacheState };
const state: CacheState = (__g.__cbMid ??= { hits: new Map(), lastFlush: 0, rules: undefined, known: undefined });

type RuntimeRule = { id: string; from: string; to: string; type: number; status?: string; match?: string; note?: string; hits?: number; last_hit?: string };

function readJson(rel: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), rel), "utf8"));
  } catch {
    return null;
  }
}

function loadRules(): RuntimeRule[] {
  const file = path.join(process.cwd(), "data", "admin", "redirects.json");
  let mtime = 0;
  try {
    mtime = fs.statSync(file).mtimeMs;
  } catch {
    return [];
  }
  if (state.rules && state.rules.mtime === mtime) return state.rules.rules;
  const raw = readJson("data/admin/redirects.json") as RuntimeRule[] | null;
  const rules = raw ?? [];
  state.rules = { mtime, rules };
  return rules;
}

const norm = (p: string) => {
  try {
    return decodeURI(p).toLowerCase().replace(/\/+$/, "") || "/";
  } catch {
    return p.toLowerCase().replace(/\/+$/, "") || "/";
  }
};

function matchRule(rules: RuntimeRule[], pathname: string): RuntimeRule | undefined {
  const key = norm(pathname);
  const exact = rules.find((r) => (r.status ?? "active") === "active" && !(r as { match?: string }).match && norm(r.from) === key);
  const wild = rules.find(
    (r) => (r.status ?? "active") === "active" && (r as { match?: string }).match === "wildcard" && wildcardHit(r.from, key)
  );
  return exact ?? wild;
}

function wildcardHit(pattern: string, key: string): boolean {
  const p = norm(pattern);
  const i = p.indexOf("*");
  if (i < 0) return norm(pattern) === key;
  const head = p.slice(0, i);
  const tail = p.slice(i + 1).replace(/\/+$/, "");
  return key.startsWith(head) && (tail === "" || key.endsWith(tail));
}

// known paths for the 404 monitor (page catalog approximation from data files)
function isKnownPath(pathname: string): boolean {
  if (state.known) return state.known.has(norm(pathname));
  const set = new Set<string>(["/", "/about/", "/contact/", "/faqs/", "/blog/", "/services/", "/fleet/", "/locations/", "/sitemap/", "/privacy-policy/", "/termsandconditions/", "/cancellation-policy/", "/admin/login",
    "/sitemap.xml", "/sitemap-all.xml", "/sitemap-static.xml", "/sitemap-services.xml", "/sitemap-fleet.xml", "/sitemap-locations.xml", "/sitemap-posts.xml", "/blog/rss.xml", "/llms.txt"]);
  for (const st of Object.keys(KEPT)) set.add(norm("/sitemap-locations-" + st + ".xml"));
  const services = readJson("data/services-live.json") as { slug?: string }[] | null;
  void services;
  // service + fleet slugs: code constants (kept in sync with lib/site-data.ts)
  const SERVICE_SLUGS = ["corporate-transportation","wedding-transportation","school-transportation","sports-team-transportation","airport-transfer","sightseeing-tour-bus","church-religious-transportation","band-tour-bus","winery-tour-bus-rental","military-group-transportation","government-transportation","casino-bus-trips"];
  const FLEET_SLUGS = ["charter-bus","sleeper","minibus","school-bus","sprinter-van","party-bus","suv-sedan"];
  for (const sl of SERVICE_SLUGS) set.add(norm("/services/" + sl + "/"));
  for (const fl of FLEET_SLUGS) set.add(norm("/fleet/" + fl + "/"));
  const blogs = readJson("data/admin/blog.json") as { posts?: { slug: string }[] } | null;
  for (const b of blogs?.posts ?? []) set.add(norm("/blog/" + b.slug + "/"));
  for (const st of Object.keys(KEPT)) {
    set.add(norm("/locations/" + st + "/"));
    for (const c of KEPT[st]) set.add(norm("/locations/" + st + "/" + c + "/"));
  }
  set.add(norm("/locations/pr/rincon/"));
  set.add(norm("/locations/pr/arecibo/"));
  state.known = set;
  return set.has(norm(pathname));
}

const IGNORE_PATTERNS: RegExp[] = [/^\/wp-login/, /^\/\.env/, /^\/phpmyadmin/, /^\/wp-admin/, /\/\.well-known\/acme-challenge/, /\.(txt|xml|php|aspx)$/i];

function ignore404(p: string): boolean {
  const saved = readJson("data/admin/404-ignores.json") as string[] | null;
  if (saved) {
    for (const pattern of saved) {
      try {
        if (new RegExp(pattern).test(p)) return true;
      } catch { /* bad pattern */ }
    }
  }
  return IGNORE_PATTERNS.some((r) => r.test(p));
}

function log404(pathname: string, referrer: string | null): void {
  if (state.hits.has(pathname)) {
    const h = state.hits.get(pathname)!;
    h.count += 1;
    h.last = new Date().toISOString();
  } else {
    state.hits.set(pathname, { count: 1, last: new Date().toISOString() });
  }
  void referrer;
}

function flush404s(): void {
  const existing = (readJson("data/admin/404s.json") as Record<string, { hits: number; first: string; last: string; referrer?: string }> | undefined) ?? {};
  for (const [p, h] of state.hits) {
    const prev = existing[p];
    existing[p] = {
      hits: (prev?.hits ?? 0) + h.count,
      first: prev?.first ?? new Date().toISOString(),
      last: h.last,
    };
  }
  try {
    fs.mkdirSync(path.join(process.cwd(), "data", "admin"), { recursive: true });
    fs.writeFileSync(path.join(process.cwd(), "data", "admin", "404s.json"), JSON.stringify(existing, null, 2) + "\n");
  } catch {
    /* non-fatal */
  }
  const total = [...state.hits.values()].reduce((n, h) => n + h.count, 0);
  state.hits = new Map();
  state.lastFlush = Date.now();
  void total;
}

export default function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // ADMIN_ONLY site-closed gate (unchanged Phase behaviour)
  if (process.env.ADMIN_ONLY === "1") {
    const isAdminSurface =
      pathname === "/admin" ||
      pathname.startsWith("/admin/") ||
      pathname.startsWith("/api/admin") ||
      pathname.startsWith("/api/quote") || // the public quote API keeps working (leads save)
      pathname.startsWith("/uploads");
    const hasSession = !!req.cookies.get("cb_admin_open");
    if (!isAdminSurface && !hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url, 307);
    }
  }

  const isStaging = process.env.STAGING === "1";

  // 1. Lowercase URL policy (Section 14): mixed-case path → 301 to lowercase.
  if (/[A-Z]/.test(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 301);
  }

  // 2. Runtime redirect engine (Phase 4): saved admin rules, live in seconds.
  const rules = loadRules();
  const rule = matchRule(rules, pathname);
  if (rule) {
    void bumpHitsFile(rule);
    const type = rule.type;
    if (type === 410) {
      return gone404Response(rule.from);
    }
    const to = buildTarget(rule, pathname, search);
    if (to) {
      const res = NextResponse.redirect(new URL(to, req.nextUrl.origin), (type === 307 ? 307 : type === 302 ? 302 : 301) as 301 | 302 | 307);
      res.headers.set("x-redirect-by", "cascade-rules");
      return res;
    }
  }

  // 3. Removed city URLs → 410 Gone (Section 10)
  const parts = pathname.split("/").filter(Boolean); // ["locations","oh","aberdeen"]
  if (parts.length === 3 && parts[0] === "locations") {
    const [, stateCode, city] = parts;
    const citySlugs = KEPT_STATES.has(stateCode) ? KEPT[stateCode] : undefined;
    if (!citySlugs || !citySlugs.includes(city)) {
      return gone404Response(city ? `${decodeURIComponent(city.replace(/-/g, " "))}` : "this destination");
    }
  }

  // 4. Puerto Rico / unknown non-US areas removed (Section 10)
  if (parts.length === 2 && parts[0] === "locations" && !KEPT_STATES.has(parts[1])) {
    if (parts[1] === "pr") {
      return gone404Response("Puerto Rico");
    }
  }

  // 5. 404 monitor (Section 6.7): log every URL that will render the 404 page.
  // Known-path check uses the page catalog approximation; admin + api skip.
  if (!isKnownPath(pathname) && !ignore404(pathname)) {
    log404(pathname, req.headers.get("referer"));
    if (Date.now() - state.lastFlush > 15_000 || state.hits.size > 20) {
      flush404s();
    }
  }

  const res = NextResponse.next();
  if (isStaging) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

function buildTarget(rule: RuntimeRule, _pathname: string, search: string): string {
  if (rule.type === 410) return "";
  const to = rule.to;
  return to + (search ? (to.includes("?") ? "&" : "?") + search.replace(/^\?/, "") : "");
}

const HIT_FLUSH: { dirty: Map<string, RuntimeRule> } = { dirty: new Map() };
function bumpHitsFile(rule: RuntimeRule): void {
  HIT_FLUSH.dirty.set(rule.id, {
    ...rule,
    hits: (rule.hits ?? 0) + 1,
    last_hit: new Date().toISOString(),
  });
  // flush every 10 hits or 20 s — keeps rule file updated, cheap at this scale
  const file = path.join(process.cwd(), "data", "admin", "redirects.json");
  if (HIT_FLUSH.dirty.size >= 10 || Date.now() - (state.lastFlush || 0) > 20_000) {
    try {
      const raw = (readJson("data/admin/redirects.json") as RuntimeRule[] | null) ?? [];
      for (const r of raw) {
        const upd = HIT_FLUSH.dirty.get(r.id);
        if (upd) {
          r.hits = upd.hits;
          r.last_hit = upd.last_hit;
          HIT_FLUSH.dirty.delete(r.id);
        }
      }
      fs.writeFileSync(file, JSON.stringify(raw, null, 2) + "\n");
      state.rules = undefined; // reload mtime
    } catch {
      /* non-fatal */
    }
    state.lastFlush = Date.now();
  }
}

function gone404Response(place: string): Response {
  return new Response(goneHtml(place), {
    status: 410,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex",
      "cache-control": "public, max-age=86400",
    },
  });
}

function goneHtml(place: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex"/>
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
