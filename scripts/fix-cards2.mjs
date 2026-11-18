// Fix remaining misalignments: on-board checklist card (fleet) + pricing right
// card (service pages) must not use the 2-col .pp-checklist-card grid.
import { readFileSync, writeFileSync } from "node:fs";

// 1. Fleet on-board card -> .pp-list-card
let f = readFileSync("components/PremiumFleetPage.tsx", "utf8");
f = f.replace('<div className="pp-checklist-card">\n            <ul className="pp-checklist" style={{ width: "100%" }}>', '<div className="pp-list-card">\n            <ul className="pp-checklist" style={{ width: "100%" }}>');
writeFileSync("components/PremiumFleetPage.tsx", f);

// 2. Service pricing right card -> .pp-final-card (full width in its column)
let s = readFileSync("components/PremiumServicePage.tsx", "utf8");
s = s.replace('<div className="pp-checklist-card d-flex flex-column justify-content-center" style={{ width: "100%", border: "2px solid rgba(245,160,2,0.55)" }}>', '<div className="pp-final-card" style={{ width: "100%", maxWidth: "none", margin: 0 }}>');
writeFileSync("components/PremiumServicePage.tsx", s);

// 3. Hub final-quote card already replaced. Add the .pp-list-card CSS.
const css = readFileSync("app/globals.css", "utf8");
if (!css.includes(".pp-list-card")) {
  const add = css + `
/* ===== list-card: bordered container for checklists (fleet on-board) ===== */
.pp-list-card { background: var(--pp-white); border: 1px solid var(--pp-line); border-radius: 24px;
  padding: 2rem 2.4rem; max-width: 1020px; margin: 0 auto; }
`;
  writeFileSync("app/globals.css", add);
  console.log("css .pp-list-card added");
}
console.log("done");
