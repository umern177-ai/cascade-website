// Find buttons/CTAs whose visible content is not vertically centered.
import { chromium } from "playwright";
const BASE = process.argv[2] || "http://localhost:3100";
const PAGES = ["/", "/services/", "/services/corporate-transportation/", "/fleet/", "/fleet/charter-bus/", "/fleet/sleeper/", "/locations/", "/locations/oh/", "/locations/ut/park-city/", "/about/", "/contact/", "/faqs/", "/sitemap/", "/termsandconditions/"];
const browser = await chromium.launch();
for (const path of PAGES) {
  const pg = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await pg.goto(BASE + path, { waitUntil: "networkidle", timeout: 60000 });
  const bad = await pg.evaluate(() => {
    const out = [];
    const els = document.querySelectorAll("a.btn, button.btn, span.btn, .social-btn, .navbar-toggler");
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.height < 8 || r.width < 8) return;
      const cs = getComputedStyle(el);
      if (cs.display === "none") return;
      let top = Infinity, bot = -Infinity;
      const kids = el.children;
      if (!kids.length) return;
      Array.from(kids).forEach((k) => {
        const kr = k.getBoundingClientRect();
        if (kr.height === 0) return;
        if (kr.top < top) top = kr.top;
        if (kr.bottom > bot) bot = kr.bottom;
      });
      if (!isFinite(top)) return;
      const childMid = (top + bot) / 2;
      const boxMid = (r.top + r.bottom) / 2;
      const delta = Math.abs(childMid - boxMid);
      if (delta > 3) out.push({ text: (el.textContent || "").trim().slice(0, 40), delta: Number(delta.toFixed(1)), display: cs.display, h: Math.round(r.height), cls: el.className.slice(0, 80) });
    });
    return out.slice(0, 10);
  });
  if (bad.length) {
    console.log("== " + path);
    for (const b of bad) console.log(`   d=${b.delta}px h=${b.h} display=${b.display} | ${b.text} | ${b.cls}`);
  }
  await pg.close();
}
await browser.close();
console.log("AUDIT DONE");
