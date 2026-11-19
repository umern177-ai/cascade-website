// Scan public/images/fleet/<vehicle-slug>/ and write data/fleet-photos.json
// (the photo manifest every fleet-photo spot on the site reads from).
//
// Owner workflow (no code changes needed afterwards):
//   1. Drop photos into the folder of the vehicle they belong to.
//   2. Name the cover photo main.jpg (or main.webp) — it is the photo used
//      everywhere a single image is shown (cards, city pages, service pages).
//   3. Any other files (2.jpg, 3.jpg, coach-front.webp …) appear in the
//      photo showcase on that vehicle's fleet page.
//   4. JPG/PNG/WebP all work; next/image serves them optimized.
//   5. Run `npm run fleet` (or just deploy — the manifest regenerates on build).
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "public", "images", "fleet");
const OUT = path.join(process.cwd(), "data", "fleet-photos.json");

const IMG_RE = /\.(jpe?g|png|webp|avif)$/i;
const WEIGHTS = { ".avif": 0, ".webp": 1, ".jpg": 2, ".jpeg": 2, ".png": 3 }; // prefer optimized sources

function natural(a, b) {
  return a.localeCompare(b, undefined, { numeric: true });
}

const manifest = {};
for (const dir of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const files = fs.readdirSync(path.join(ROOT, dir.name)).filter((f) => IMG_RE.test(f));
  // main first, then numeric order; within the same index prefer .webp > .jpg > .png
  files.sort((a, b) => {
    const aMain = /^(main)/i.test(a) ? 0 : 1;
    const bMain = /^(main)/i.test(b) ? 0 : 1;
    if (aMain !== bMain) return aMain - bMain;
    const cmp = natural(a, b);
    if (cmp !== 0) return cmp;
    return (WEIGHTS[a.match(IMG_RE)[0]] ?? 3) - (WEIGHTS[b.match(IMG_RE)[0]] ?? 3);
  });
  if (files.length > 0) manifest[dir.name] = files;
}

fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((n, l) => n + l.length, 0);
console.log(`fleet-photos.json: ${Object.keys(manifest).length} vehicles, ${total} photos`);
for (const [slug, files] of Object.entries(manifest)) console.log(`  ${slug}: ${files.join(", ")}`);
