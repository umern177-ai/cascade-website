// Screenshot the new site for side-by-side comparison with docs/live-reference/shots/.
// Usage: node scripts/screenshot-new-site.mjs [baseUrl]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.argv[2] || "http://localhost:3100";
const ROOT = path.resolve(import.meta.dirname, "..");
const VIEWPORTS = {
  phone: { width: 390, height: 844 },
  desktop: { width: 1440, height: 900 },
};
const PAGES = {
  "home": "/",
  "services-hub": "/services/",
  "service-corporate-transportation": "/services/corporate-transportation/",
  "service-band-tour-bus": "/services/band-tour-bus/",
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
  "sitemap": "/sitemap/",
  "not-found": "/does-not-exist/",
  "legal-terms": "/termsandconditions/",
};

async function main() {
  const outdir = path.join(ROOT, "docs", "new-site-shots");
  fs.mkdirSync(outdir, { recursive: true });
  const browser = await chromium.launch();
  for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
    const ctx = await browser.newContext({ viewport });
    const pg = await ctx.newPage();
    for (const [name, pagePath] of Object.entries(PAGES)) {
      const outFile = path.join(outdir, `${name}-${vpName}.jpg`);
      try {
        await pg.goto(BASE + pagePath, { waitUntil: "networkidle", timeout: 60000 });
        await pg.waitForTimeout(400);
        try {
          await pg.screenshot({ path: outFile, fullPage: true, type: "jpeg", quality: 80 });
          console.log(`ok ${name} ${vpName}`);
        } catch {
          await pg.screenshot({ path: outFile, fullPage: false, type: "jpeg", quality: 80 });
          console.log(`ok(partial) ${name} ${vpName}`);
        }
      } catch (e) {
        console.log(`FAIL ${name} ${vpName}: ${String(e.message).split("\n")[0]}`);
      }
    }
    await ctx.close();
  }
  await browser.close();
  console.log("DONE");
}
main();
