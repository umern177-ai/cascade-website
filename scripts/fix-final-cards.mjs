// Replace all ad-hoc final-quote cards (.pp-checklist-card with icon+h3+p)
// with the properly-aligned .pp-final-card across fleet, service and hub pages.
import { readFileSync, writeFileSync } from "node:fs";
const files = ["components/PremiumFleetPage.tsx", "components/PremiumServicePage.tsx", "app/services/page.tsx", "app/fleet/[slug]/page.tsx"];
for (const file of files) {
  let s = readFileSync(file, "utf8");
  let n = 0;
  // pattern 1: pp-checklist-card wrappers containing a Quote icon
  s = s.replace(/<div className="pp-checklist-card[^"]*">\s*\n(\s*)<Quote([\s\S]*?)\/>/g, (m, ind, tail) => {
    n++;
    return `<div className="pp-final-card">\n${ind}<Quote${tail}/>`;
  });
  writeFileSync(file, s);
  console.log(file, "replaced", n);
}
