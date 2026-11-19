# How to add / replace fleet photos

Drop your photos into the folder for the vehicle, then deploy (or in dev, restart `npm run dev`). **No code changes are ever needed** — the site reads the photo list from the folders by itself at build time (`scripts/fleet-manifest.mjs` → `data/fleet-photos.json`).

| Vehicle | Folder |
|---|---|
| Charter bus / motorcoach | `public/images/fleet/charter-bus/` |
| Sleeper bus (band tours) | `public/images/fleet/sleeper/` |
| Minibus | `public/images/fleet/minibus/` |
| School bus | `public/images/fleet/school-bus/` |
| Sprinter van | `public/images/fleet/sprinter-van/` |
| Party bus & limo | `public/images/fleet/party-bus/` |
| SUV & sedan | `public/images/fleet/suv-sedan/` |

## Rules

1. **Cover photo** — name it `main.jpg` (or `main.webp`). That one photo is used
   wherever a single image is shown: fleet cards, fleet pages, city-page vehicle
   cards, home page, services pages, social-share image for the fleet page.
2. **Extra photos** — any other name works (`2.jpg`, `10.jpg`, `party-dance-floor.png`).
   They show up in the **"Photo showcase"** section on that vehicle's fleet page,
   in number order, with `main.jpg` always first.
3. Formats: **JPG, PNG, WebP, or AVIF** — any size up to ~4000px wide. The site
   optimizes and serves them as AVIF/WebP automatically; you don't need to
   compress them (just don't send 20 MB phone RAWs).
4. `landscape` orientation works best — the photos are cropped to wide boxes.
5. After adding photos, the showcase appears the next time the site is built/deployed.
   In development, run `npm run fleet` once if you want it instantly.

## What each photo is used for

- **1 photo in a folder** → it is the cover everywhere that vehicle appears.
- **2+ photos** → the cover stays the "main" image everywhere; the rest power
  the photo showcase grid on the /fleet/&lt;vehicle&gt;/ page.

## Source-of-truth note

The old single files (`public/images/fleet/charter.jpg`, `mini.jpg`, …) are kept
as fallbacks only. New photos go in the per-vehicle folders above and the site
switches over automatically as soon as a `main.jpg` exists in a folder.
