// Phase 1: full-page screenshots of the LIVE site (read-only) at 3 widths.
// Saves into docs/live-reference/shots/{name}-{viewport}.jpg
// Usage: node scripts/screenshot-live-site.mjs
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const BASE = "https://www.cascadecharterbus.com";
const VIEWPORTS = {
  phone: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
};

const PAGES = {
  "home": "/",
  "services-hub": "/services/",
  "service-corporate-transportation": "/services/corporate-transportation/",
  "service-wedding-transportation": "/services/wedding-transportation/",
  "fleet-hub": "/fleet/",
  "fleet-charter-bus": "/fleet/charter-bus/",
  "fleet-sleeper": "/fleet/sleeper/",
  "locations-hub": "/locations/",
  "state-oh": "/locations/oh/",
  "city-park-city-ut": "/locations/ut/park-city/",
  "about": "/about/",
  "contact": "/contact/",
  "faqs": "/faqs/",
  "blogs-hub": "/blogs/",
  "legal-terms": "/termsandconditions/",
  "not-found": "/this-page-does-not-exist-404-test/",
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36";

async function main() {
  const outdir = path.join(ROOT, "docs", "live-reference", "shots");
  fs.mkdirSync(outdir, { recursive: true });
  let blogUrl = null;
  const browser = await chromium.launch();
  for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
    const ctx = await browser.newContext({ viewport, userAgent: UA, locale: "en-US" });
    const pg = await ctx.newPage();
    for (const [name, pagePath] of Object.entries(PAGES)) {
      const outFile = path.join(outdir, `${name}-${vpName}.jpg`);
      if (fs.existsSync(outFile)) {
        console.log(`skip ${name} ${vpName} (exists)`);
        continue;
      }
      if (name === "not-found") {
        // A 404 page full-page screenshot: capture whatever renders (status 404).
        const resp = await pg.goto(BASE + pagePath, { waitUntil: "domcontentloaded", timeout: 60000 });
        await pg.waitForTimeout(800);
        console.log(`ok ${name} ${vpName} status=${resp.status()}`);
      } else {
        try {
          await pg.goto(BASE + pagePath, { waitUntil: "networkidle", timeout: 60000 });
        } catch {
          console.log(`goto-timeout ${name} ${vpName} — continuing with whatever loaded`);
        }
        await pg.waitForTimeout(800);
      }
      try {
        await pg.screenshot({
          path: path.join(outdir, `${name}-${vpName}.jpg`),
          fullPage: true,
          type: "jpeg",
          quality: 80,
        });
        console.log(`ok ${name} ${vpName}`);
      } catch {
        // Very tall pages (long state city lists) exceed the browser's max
        // screenshot height. Capture the visible viewport instead.
        await pg.screenshot({
          path: path.join(outdir, `${name}-${vpName}.jpg`),
          fullPage: false,
          type: "jpeg",
          quality: 80,
        });
        console.log(`ok(partial) ${name} ${vpName} — viewport only (page too tall)`);
      }
    }
    if (vpName === "desktop" && !blogUrl) {
      // discover one real blog post URL by clicking the first card
      try {
        await pg.goto(BASE + "/blogs/", { waitUntil: "networkidle", timeout: 60000 });
        await pg.click("div.card[role=button]", { timeout: 20000 });
        await pg.waitForTimeout(3000);
        blogUrl = pg.url();
        console.log("BLOG_POST_URL=" + blogUrl);
        await pg.screenshot({
          path: path.join(outdir, `blog-post-desktop.jpg`),
          fullPage: true,
          type: "jpeg",
          quality: 80,
        });
      } catch (e) {
        console.log("no blog post discovered: " + e.message);
      }
    }
    await ctx.close();
  }
  await browser.close();
  if (blogUrl) fs.writeFileSync(path.join(ROOT, "capture", "blog-post-url.txt"), blogUrl);
  console.log("DONE");
}

main();
