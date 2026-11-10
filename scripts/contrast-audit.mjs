// Scan rendered pages for text whose color is too close to its background.
// Usage: node scripts/contrast-audit.mjs [baseUrl]
import { chromium } from "playwright";
const BASE = process.argv[2] || "http://localhost:3100";
const PAGES = ["/", "/services/", "/services/corporate-transportation/", "/fleet/", "/fleet/charter-bus/", "/fleet/sleeper/", "/locations/", "/locations/oh/", "/locations/ut/park-city/", "/about/", "/contact/", "/faqs/", "/blogs/", "/sitemap/", "/termsandconditions/", "/cancellation-policy/", "/privacy-policy/"];

const browser = await chromium.launch();
for (const path of PAGES) {
  const pg = await (await browser.newContext({ viewport: { width: 1200, height: 900 } })).newPage();
  await pg.goto(BASE + path, { waitUntil: "networkidle", timeout: 60000 });
  const bad = await pg.evaluate(() => {
    const lum = (rgb) => {
      const m = rgb.match(/[\d.]+/g).map(Number);
      const f = (v) => (v /= 255) <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]);
    };
    const contrast = (c1, c2) => {
      const l1 = lum(c1), l2 = lum(c2);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };
    const out = [];
    const cached = new Map();
    function bgOf(el) {
      if (cached.has(el)) return cached.get(el);
      let n = el;
      const chain = [];
      while (n && n.nodeType === 1) {
        chain.push(n);
        const c = getComputedStyle(n).backgroundColor;
        if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) {
          chain.forEach((e) => cached.set(e, c));
          return c;
        }
        n = n.parentElement;
      }
      chain.forEach((e) => cached.set(e, "rgb(255, 255, 255)"));
      return "rgb(255, 255, 255)";
    }
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walk.nextNode()) {
      const t = walk.currentNode.textContent.trim();
      if (!t || t.length < 3) continue;
      const el = walk.currentNode.parentElement;
      if (!el || !el.offsetParent) continue;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      const cr = contrast(cs.color, bgOf(el));
      if (cr < 1.6) out.push({ text: t.slice(0, 70), cr: Number(cr.toFixed(2)) });
    }
    return out.slice(0, 14);
  });
  if (bad.length) {
    console.log("== " + path);
    for (const b of bad) console.log(`   [${b.cr}] ${b.text}`);
  }
  await pg.close();
}
await browser.close();
console.log("AUDIT DONE");
