import { chromium } from "playwright";
const browser = await chromium.launch();
const pg = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await pg.goto("http://localhost:3100/", { waitUntil: "load" });

// 1) chevron toggles Services dropdown; All Services first
await pg.click('button[aria-label="Open Services menu"]');
await pg.waitForTimeout(300);
const items = await pg.evaluate(() =>
  [...document.querySelectorAll("li.nav-item.dropdown")[0].querySelectorAll(".dropdown-menu .dropdown-item")].map((a) => a.innerText + " -> " + a.getAttribute("href"))
);
console.log("services dropdown (first 3):", JSON.stringify(items.slice(0, 3), null, 1));

// 2) hovering Fleet opens its dropdown, View Entire Fleet first
await pg.hover("span.nav-link:has-text('Fleet')");
await pg.waitForTimeout(350);
const fleetFirst = await pg.evaluate(() => [...document.querySelectorAll("li.nav-item.dropdown")[1].querySelectorAll(".dropdown-menu .dropdown-item")][0].innerText);
console.log("fleet first item on hover:", fleetFirst);

// screenshot the open services dropdown
await pg.click('button[aria-label="Open Services menu"]');
await pg.waitForTimeout(300);
await pg.screenshot({ path: "docs/new-site-shots/header-services-dropdown.jpg", type: "jpeg", quality: 70, clip: { x: 0, y: 0, width: 720, height: 520 } });

// 3) clicking the label navigates to /services/
await pg.click(".navbar-nav .nav-link:has-text('Services') a");
await pg.waitForTimeout(800);
console.log("after clicking Services label ->", pg.url());

// 4) mobile: chevron still opens the dropdown inside the collapsed menu
const mp = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await mp.goto("http://localhost:3100/", { waitUntil: "load" });
await mp.click(".navbar-toggler");
await mp.click('button[aria-label="Open Fleet menu"]');
await mp.waitForTimeout(300);
const fleetMobileFirst = await mp.evaluate(() => [...document.querySelectorAll("li.nav-item.dropdown")[1].querySelectorAll(".dropdown-menu .dropdown-item")][0].innerText);
console.log("mobile fleet dropdown first item:", fleetMobileFirst);
await mp.screenshot({ path: "docs/new-site-shots/header-mobile-dropdown.jpg", type: "jpeg", quality: 70 });
await browser.close();
process.exit(0);
