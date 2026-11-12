// Step 5 checks for the 4 new service pages (spec of Nov 12):
// status 200, word count 600-800, banned-word scan in main, JSON-LD valid
// and FAQ schema == visible FAQ text (word for word).
import { chromium } from "playwright";

const SLUGS = [
  "winery-tour-bus-rental",
  "military-group-transportation",
  "government-transportation",
  "casino-bus-trips",
];
const BANNED = ["$", "per hour", "per-hour", "years", "rating", "stars", "star rating", "premium", "seamless", "elevate", "elevated", "unforgettable", "look no further", "world-class", "top-notch"];

const browser = await chromium.launch();
const pg = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();

for (const slug of SLUGS) {
  const res = await pg.goto(`http://localhost:3100/services/${slug}/`, { waitUntil: "networkidle" });
  const out = { status: res.status() };
  out.body = await pg.evaluate((BANNED) => {
    const main = document.querySelector("main");
    const text = main.innerText;
    const wc = text.trim().split(/\s+/).length;
    const hits = BANNED.filter((b) => text.toLowerCase().includes(b));
    // FAQ schema vs visible
    const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent));
    const faq = schemas.find((s) => s["@type"] === "FAQPage");
    const svc = schemas.find((s) => s["@type"] === "Service");
    const crumb = schemas.find((s) => s["@type"] === "BreadcrumbList");
    const visible = [...main.querySelectorAll("details")].map((d) => {
      const q = d.querySelector("summary").innerText.trim();
      const a = d.querySelector(".accordion-body").innerText.trim();
      return { q, a };
    });
    const schemaText = JSON.stringify(faq);
    const match = visible.every(({ q, a }) => schemaText.includes(q) && schemaText.includes(a));
    return {
      wc,
      bannedHits: hits,
      faqCountVisible: visible.length,
      faqInSchema: faq ? faq.mainEntity.length : 0,
      faqMatch: match,
      hasService: !!svc,
      areaServed: svc?.areaServed?.name,
      hasBreadcrumb: !!crumb,
      hasOffers: JSON.stringify(schemas).includes('"Offer"') || JSON.stringify(schemas).includes("price"),
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      lastUpdated: text.includes("Last updated: November 2026"),
      h1: main.querySelector("h1")?.innerText,
    };
  }, BANNED);
  const mob = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  const resM = await mob.goto(`http://localhost:3100/services/${slug}/`, { waitUntil: "load" });
  await mob.close();
  out.mobileStatus = resM.status();
  console.log(slug, JSON.stringify(out, null, 1));
}
await browser.close();
process.exit(0);
