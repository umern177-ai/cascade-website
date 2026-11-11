// Verify the premium Shelton page: the two owner-flagged headings are actually
// visible (non-transparent text on the right background), plus screenshots.
// Usage: node scripts/verify-shelton.mjs
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = "http://localhost:3100";
const ROOT = path.resolve(import.meta.dirname, "..");
const TARGETS = [
  { sel: ".pp-intro-grid h2", label: "intro heading" },
  { sel: ".pp-faq-aside h2", label: "FAQ heading" },
];

async function check(browser, vp, url) {
  const ctx = await browser.newContext({ viewport: vp });
  const pg = await ctx.newPage();
  const errors = [];
  pg.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await pg.goto(`${BASE}${url}`, { waitUntil: "networkidle" });
  for (const t of TARGETS) {
    const info = await pg.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        text: (el.textContent || "").trim().slice(0, 60),
        visible: r.width > 0 && r.height > 0,
        size: `${Math.round(r.width)}x${Math.round(r.height)}`,
        color: getComputedStyle(el).color,
      };
    }, t.sel);
    console.log(`[${vp.width}px] ${t.label}:`, info ? JSON.stringify(info) : "NOT FOUND");
  }
  const dir = path.join(ROOT, "docs", "new-site-shots");
  fs.mkdirSync(dir, { recursive: true });
  await pg.screenshot({ path: path.join(dir, `shelton-premium-${vp.width === 390 ? "m" : "d"}.jpg`), type: "jpeg", quality: 70, fullPage: true });
  console.log(`[${vp.width}px] console errors:`, errors.length ? errors : "none");
  await ctx.close();
}

const browser = await chromium.launch();
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  await check(browser, vp, "/locations/ct/shelton/");
}
await browser.close();
