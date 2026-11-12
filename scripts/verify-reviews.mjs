import { chromium } from "playwright";
const browser = await chromium.launch();
const pg = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
await pg.goto("http://localhost:3100/", { waitUntil: "networkidle" });
const state = await pg.evaluate(() => {
  const t = document.body.innerText;
  return {
    brancati: t.includes("Ben Brancati"),
    katie: /Katie\b/.test(t),
    benSchuster: t.includes("Ben"),
    verified: t.includes("Verified"),
    trustpilotProfiles: t.includes("Trustpilot profile"),
    reviewCards: [...document.querySelectorAll("main .card")].filter((c) => c.innerText.includes("Verified")).length,
  };
});
console.log(JSON.stringify(state, null, 1));
const h2 = await pg.evaluateHandle(() => [...document.querySelectorAll("h2")].find((h) => h.innerText.includes("What Groups Say")).closest("section"));
await h2.asElement().screenshot({ path: "docs/new-site-shots/home-reviews.jpg", type: "jpeg", quality: 65 });
console.log("reviews screenshot saved");
await browser.close();
process.exit(0);
