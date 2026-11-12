// Verify header: white labels, hover keeps dropdown open into the panel.
import { chromium } from "playwright";
const browser = await chromium.launch();
const pg = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await pg.goto("http://localhost:3100/", { waitUntil: "load" });

// color check on Services label
const labelColor = await pg.evaluate(() => {
  const a = document.querySelector(".nav-label-link");
  return getComputedStyle(a).color;
});
console.log("Services label color:", labelColor);

// hover the Fleet label, then move pointer INTO the dropdown panel and click first item
await pg.hover("span.nav-link:has-text('Fleet')");
await pg.waitForTimeout(300);
const menus = await pg.$$("li.nav-item.dropdown .dropdown-menu");
const menu = menus[1];
const box = await menu.boundingBox();
// move to just below the menu's top edge, inside the panel
await pg.mouse.move(box.x + box.width / 2, box.y + 40);
await pg.waitForTimeout(250);
const stillOpen = await pg.evaluate(() => [...document.querySelectorAll("li.nav-item.dropdown .dropdown-menu")[1].classList].includes("show"));
console.log("dropdown still open with pointer inside panel:", stillOpen);

// click the first item and confirm navigation
await pg.waitForTimeout(200);
await pg.mouse.click(box.x + box.width / 2, box.y + 40);
await pg.waitForTimeout(800);
console.log("navigated to:", pg.url());

await browser.close();
process.exit(0);
