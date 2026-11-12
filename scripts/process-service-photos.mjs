// Process owner-supplied service photos: resize, convert to WebP, strip EXIF
// (incl. GPS), write to public/images/services/. Originals are never edited.
// Usage: node scripts/process-service-photos.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve(import.meta.dirname, "..", "servicespictures");
const OUT = path.resolve(import.meta.dirname, "..", "public", "images", "services");

// owner filename -> published filename (same names as the current cards so
// all city pages update automatically; new names for gallery photos)
const MAP = {
  "corporate.jpg": "corp.webp",
  "corporate2.jpg": "corp2.webp",
  "corporate3.jpg": "corp3.webp",
  "Wedding.jpg": "wed.webp",
  "Wedding2.jpg": "wed2.webp",
  "Wedding3.jpg": "wed3.webp",
  "school-trips.jpg": "school.webp",
  "school-trips2.jpg": "school2.webp",
  "sports-teams.jpg": "sport.webp",
  "airport.jpg": "airport.webp",
  "Sightseeing.jpg": "multi.webp",
  "church-groups.jpg": "church.webp",
  "winery.jpg": "winery.webp",
  "winery2.jpg": "winery2.webp",
  "winery3.jpg": "winery3.webp",
  "military.jpg": "military.webp",
  "government.jpg": "government.webp",
  // excluded on purpose: school-trips3.jpg (other operator's branding on the bus)
};

fs.mkdirSync(OUT, { recursive: true });
for (const [src, dest] of Object.entries(MAP)) {
  const inPath = path.join(SRC, src);
  if (!fs.existsSync(inPath)) {
    console.log("MISSING:", src);
    continue;
  }
  await sharp(inPath)
    .rotate() // honor EXIF orientation, then metadata is dropped
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(path.join(OUT, dest)); // sharp strips EXIF/GPS by default
  const kb = Math.round(fs.statSync(path.join(OUT, dest)).size / 1024);
  console.log(`${src} -> ${dest} (${kb} KB)`);
}
