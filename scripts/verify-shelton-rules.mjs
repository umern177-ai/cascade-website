// Zoom-check the premium page rule list (routing section) visibility.
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const browser = await chromium.launch();
const pg = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await pg.goto("http://localhost:3100/locations/ct/shelton/", { waitUntil: "networkidle" });
const out = await pg.evaluate(() =>
  [...document.querySelectorAll(".pp-rule-list li")].map((li) => {
    const strong = li.querySelector("strong");
    const cs = (el) => {
      const s = getComputedStyle(el);
      return s.color + " | display:" + s.display;
    };
    return {
      strongText: strong && strong.textContent.trim(),
      strongStyle: strong && cs(strong),
      liStyle: cs(li),
      liText: (li.textContent || "").trim().slice(0, 80),
    };
  })
);
console.log(JSON.stringify(out, null, 1));
const el = await pg.$(".pp-intro-grid");
if (el) {
  const dir = path.resolve(import.meta.dirname, "..", "docs", "new-site-shots");
  fs.mkdirSync(dir, { recursive: true });
  await el.screenshot({ path: path.join(dir, "shelton-routing-zoom.png") });
  console.log("zoom screenshot saved");
}
await browser.close();
