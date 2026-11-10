# PHOTOS_NEEDED — photos to request from the owner

The owner supplies real photos during development (never AI-generated). Drop them in
`public/images/originals/` with the names below; a processing script resizes, converts to
WebP/AVIF, strips GPS data and writes them to `public/images/`. Originals are never edited.

## For launch-must-have templates

| File | Where | What it should show |
|---|---|---|
| `fleet-charter-bus-exterior-01` | Home, fleet pages | The coach (outside), clean, daylight |
| `fleet-charter-bus-interior-01` | /fleet/charter-bus/ | Seats/inside |
| `fleet-sleeper-exterior-01` | /fleet/sleeper/ | Tour/sleeper coach outside |
| `fleet-sleeper-interior-bunks-01` | /fleet/sleeper/ | **Bunks + restroom/shower area (4–15 bunks, no rooms — owner confirmed)** |
| `fleet-minibus-exterior-01` / `-interior-01` | /fleet/minibus/ | Minibus outside and inside |
| `fleet-sprinter-exterior-01` / `-interior-01` | /fleet/sprinter-van/ | Sprinter van outside and inside |
| `fleet-school-exterior-01` | /fleet/school-bus/ and school service page | School bus |
| `fleet-party-exterior-01` / `-interior-01` | /fleet/party-bus/ | Limo/party bus |
| `fleet-suv-exterior-01` | /fleet/suv-sedan/ | SUV/sedan |
| `service-corporate-01` | Corporate service page | Bus/coach at an office or conference trip |
| `service-wedding-01` | Wedding service page | Guest shuttle at a venue (no identifiable private guests) |
| `service-school-01` | School service page | Group/students near coach (permission needed for faces) |
| `service-sports-01` | Sports service page | Bus at a stadium/team arrival |
| `service-airport-01` | Airport service page | Coach at an airport terminal curb |
| `service-sightseeing-01` | Sightseeing page | Tour coach on a scenic road |
| `service-church-01` | Church service page | Group/retreat trip |
| `service-band-tour-01` | Band tour service page | Sleeper coach loaded for a tour |
| `team-dispatch-01` | About page | Dispatch/office team (optional) |

## City hero photos (later phases)

Priority cities first: the 27 High-priority cities need `city-{state}-{city}-01.jpg`
(the owner's coach there if available). Owner has none for most cities → for each one we
either use an owner photo or a **properly licensed photo of a local landmark**, with the
licence recorded in `content/photo-credits.json`. Never: photos with other companies' buses
or logos visible, AI-generated images, images showing private people without permission.

Total at launch: ~170 (7 fleet vehicles exterior+interior, 8 service photos, city heroes for
the 710 in batches — launch minimum covers High + Medium priority, others follow).

## Already downloaded from the live site (kept as fallback)

In `capture/images/`: `logo.png`, favicons, `hero-bus.jpg`, `about-bus.jpg`,
`fleet/charter|sleeper|mini|sprinter|school|limo|suv`. Same as the live site uses today.
