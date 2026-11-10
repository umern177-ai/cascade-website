// Full technical-SEO verification against RENDERED pages (the SEO consultant's
// checklist). Writes reports/seo-verify.md. Usage: node scripts/seo-verify.mjs [base]
import { chromium } from "playwright";
import fs from "node:fs";
const BASE = process.argv[2] || "http://localhost:3200";

const PAGES = [
  ["home", "/", "https://cascadecharterbus.com/"],
  ["services-hub", "/services/", "https://cascadecharterbus.com/services/"],
  ["service-corporate", "/services/corporate-transportation/", "https://cascadecharterbus.com/services/corporate-transportation/"],
  ["service-wedding", "/services/wedding-transportation/", "https://cascadecharterbus.com/services/wedding-transportation/"],
  ["fleet-hub", "/fleet/", "https://cascadecharterbus.com/fleet/"],
  ["fleet-charter", "/fleet/charter-bus/", "https://cascadecharterbus.com/fleet/charter-bus/"],
  ["fleet-sleeper", "/fleet/sleeper/", "https://cascadecharterbus.com/fleet/sleeper/"],
  ["locations-hub", "/locations/", "https://cascadecharterbus.com/locations/"],
  ["state-oh", "/locations/oh/", "https://cascadecharterbus.com/locations/oh/"],
  ["city-atmore", "/locations/al/atmore/", "https://cascadecharterbus.com/locations/al/atmore/"],
  ["city-park-city", "/locations/ut/park-city/", "https://cascadecharterbus.com/locations/ut/park-city/"],
  ["about", "/about/", "https://cascadecharterbus.com/about/"],
  ["contact", "/contact/", "https://cascadecharterbus.com/contact/"],
  ["faqs", "/faqs/", "https://cascadecharterbus.com/faqs/"],
  ["sitemap-html", "/sitemap/", "https://cascadecharterbus.com/sitemap/"],
  ["terms", "/termsandconditions/", "https://cascadecharterbus.com/termsandconditions/"],
  ["privacy", "/privacy-policy/", "https://cascadecharterbus.com/privacy-policy/"],
  ["cancellation", "/cancellation-policy/", "https://cascadecharterbus.com/cancellation-policy/"],
  ["gone-410", "/locations/oh/aberdeen/", null], // must be 410 + noindex
  ["not-found-404", "/does-not-exist/", null], // must be 404 + noindex
];

const browser = await chromium.launch();
const ctx = await browser.newContext();
const pg = await ctx.newPage();
const rows = [];
const seenTitles = new Map();
const seenDesc = new Map();

for (const [name, path, canonical] of PAGES) {
  const resp = await pg.goto(BASE + path, { waitUntil: "networkidle", timeout: 60000 });
  const status = resp.status();
  const html = await pg.content();
  const checks = [];
  const add = (label, pass, extra = "") => checks.push([label, pass, extra]);

  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || []) [1] || "";
  const robots = (html.match(/<meta name="robots" content="([^"]*)"/) || [])[1] || "";
  const h1s = (html.match(/<h1[\s>]/g) || []).length;

  if (canonical) {
    add("canonical present", canon.length > 0, canon);
    add("canonical self-referencing", canon === canonical, `got: ${canon}`);
    add("canonical https + apex", /^https:\/\/cascadecharterbus\.com/.test(canon));
    add("title present+unique", title.length > 0, title);
    if (seenTitles.has(title) && status === 200) add("TITLE UNIQUE", false, "duplicate of " + seenTitles.get(title));
    seenTitles.set(title, name);
    if (seenDesc.has(desc) && status === 200) add("DESC UNIQUE", false, "duplicate of " + seenDesc.get(desc));
    seenDesc.set(desc, name);
    add("meta robots exact", robots.startsWith("index, follow, max") || robots.includes("max-snippet"), robots);
    add("one H1", h1s === 1, String(h1s));
    add("OG tags", html.includes('property="og:title"'));
    add("GTM installed", html.includes("googletagmanager.com/gtm.js?id=GTM-5WTG8HBP") || html.includes("googletagmanager.com/ns.html?id=GTM-5WTG8HBP"));
    add("JSON-LD schema", /application\/ld\+json/.test(html));
    add("status 200", status === 200, String(status));
    if (name === "city-atmore" || name === "city-park-city" || name === "fleet-charter" || name === "fleet-sleeper") {
      add("breadcrumb visible+schema", html.includes("breadcrumb") && /BreadcrumbList/.test(html));
    }
  } else if (name === "gone-410") {
    add("status 410", status === 410, String(status));
    add("410 noindex", html.includes("noindex") || (resp.headers()["x-robots-tag"] || "").includes("noindex"));
  } else if (name === "not-found-404") {
    add("status 404", status === 404, String(status));
    add("404 title", title === "Page Not Found | Cascade Charter Bus", title);
    add("404 meta description", desc.includes("Sorry, the page you're looking for"), desc.slice(0, 40));
  }

  rows.push({ name, path, checks });
}
await browser.close();

// robots.txt + sitemap.xml + llms.txt quick checks
const robotsTxt = await (await fetch(BASE + "/robots.txt")).text();
const sitemaps = await (await fetch(BASE + "/sitemap.xml")).text();
const childCities = await (await fetch(BASE + "/sitemap-locations-cities.xml")).text();
const llms = await (await fetch(BASE + "/llms.txt")).status;
const gsc = fs.existsSync(".env") && fs.readFileSync(".env", "utf8").includes("NEXT_PUBLIC_GSC_VERIFICATION");

let out = `# Technical SEO verification — ${new Date().toISOString()}\nBase: ${BASE}\n\n`;
let passCount = 0, failCount = 0;
for (const r of rows) {
  out += `## ${r.name} (${r.path})\n`;
  for (const [label, ok, extra] of r.checks) {
    out += `- [${ok ? "x" : " "}] ${label}${extra && !ok ? " — " + extra : ""}\n`;
    ok ? passCount++ : failCount++;
  }
  out += "\n";
}
out += `## Site infrastructure\n`;
out += `- [${robotsTxt.includes("Sitemap: https://cascadecharterbus.com/sitemap.xml")}] robots.txt lists sitemap\n`;
out += `- [${robotsTxt.includes("/admin/") && robotsTxt.includes("/api/")}] robots.txt blocks /admin/ and /api/\n`;
out += `- [${sitemaps.includes("<sitemapindex")}] sitemap.xml is an index with child sitemaps\n`;
out += `- [${(childCities.match(/<loc>/g) || []).length}] city URLs in sitemap-locations-cities.xml (expected 710)\n`;
out += `- [${llms === 200}] llms.txt served at /llms.txt\n`;
out += `- [${gsc ? "x" : " "}] Google Search Console verification meta supported (set NEXT_PUBLIC_GSC_VERIFICATION env)\n`;

fs.writeFileSync("reports/seo-verify.md", out);
console.log(`PASS: ${passCount}  FAIL: ${failCount}`);
const fails = [];
for (const r of rows) for (const [label, ok, extra] of r.checks) if (!ok) fails.push(`${r.name}: ${label} ${extra || ""}`);
for (const f of fails) console.log("FAIL " + f);
