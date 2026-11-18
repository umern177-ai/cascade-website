// About/Contact hero fix: their hero content sits directly in .pp-hero with
// no bottom padding, so the facts strip's negative margin-top (-44px) lands
// ON TOP of the trust chips. Give solo heros their own bottom room.
import { readFileSync, writeFileSync } from "node:fs";

const css = readFileSync("app/globals.css", "utf8");
if (!css.includes(".pp-hero-solo")) {
  writeFileSync("app/globals.css", css + `
/* solo heros (about, contact): content without a form grid still needs the
   facts strip's -44px pull-up to land in empty hero space */
.pp-hero-solo { padding: 3.2rem 0 6.4rem; max-width: 780px; }
`);
  console.log(".pp-hero-solo css added");
}
// wrap the hero content of both pages
for (const [file, marker] of [
  ["app/about/page.tsx", '<div style={{ maxWidth: 780 }}>\n            <p className="pp-eyebrow">About Cascade Charter Bus</p>'],
  ["app/contact/page.tsx", '<div style={{ maxWidth: 780 }}>\n            <p className="pp-eyebrow">Booking &amp; free quote</p>'],
]) {
  let s = readFileSync(file, "utf8");
  if (s.includes(marker) && !s.includes("pp-hero-solo")) {
    s = s.replace('<div style={{ maxWidth: 780 }}>', '<div className="pp-hero-solo">');
    writeFileSync(file, s);
    console.log(file, "hero wrapped");
  } else {
    console.log(file, "no change (marker gone or already wrapped)");
  }
}
