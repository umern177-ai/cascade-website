# City-page content strategy — avoiding Google spam penalties

Plain-English answer to: "proper content strategy is needed for the city pages to
avoid google spam and friendly SEO."

## The problem, measured (Nov 9, 2026)

Google penalizes pages where only the city name changes — "scaled content abuse." It's
exactly what hit the old site (26,600 template pages). I built a checker
(`scripts/check-city-similarity.mjs`: 5-word shingles, Jaccard) and measured our city
pages against the quality gate in the build brief (same-state pages must be **under 0.20
similarity**):

| City set | Similarity to their state neighbours |
|---|---|
| Researched cities (27 High-priority, `data/city-content.json`) | unique content — pass |
| Un-researched cities (scaffold pages) | **0.35–0.75 — FAIL the gate** |

The scaffold pages are fine as previews but are **not publishable**, by our own rule.

## The strategy (three layers)

### Layer 1 — researched content per city (the real fix, launch-blocking)
Every city that goes live has a researched **City Profile** — the exact system in the
build brief (Section 8): famous places, airports (+codes/miles), wedding venues,
nearby wineries, real pickup spots, driving notes; every fact with a source; reviewed
by the owner/SEO consultant in batches, then marked `approved`. The 27 High-priority
cities are researched (`data/city-content.json`); the remaining tiers follow in order:
**Medium (73) → Standard (556) → Traffic (54)**, state by state.
**Rule (already in the build brief): no city page is published until it passes the gate.
At launch, the gate must be 710/710 green — or those pages don't go live.**

### Layer 2 — variation pools (defends the researched pages + scaffolds)
`lib/city-variants.ts`: each section's heading and lead sentence is drawn from small
pools by a stable per-city hash (wedding H2: 5 options; leads: 4+ options; plus section
variants), so pages in the same state don't share the same skeleton. Combined with
per-city data (county, real pickup spots, nearby-city links) and no fabricated facts —
a city with no research yet simply gets fewer, honest sections.

### Layer 3 — the quality gate (enforced before launch)
`scripts/check-city-similarity.mjs` (this build's checker) plus the launch gate:
unique body ≥ 250 words, similarity < 0.25 global / **< 0.20 within the same state**,
≥ 4 verified local entities, unique titles/H1s, real hero image per city, nearby links
resolve. Anything failing is held as a draft.

## What is never done (Google-safety rules, from the owner's own SEO rules)

- No pages with only the name swapped, ever.
- No mass AI-generated text without verified facts + human review.
- No keyword stuffing (the visible keyword work is natural phrasing only).
- No invented venues/events — researched facts only, with sources; past events are
  marked as history (e.g., anything time-limited gets re-checked before publish).

## What happens next (batches)

1. Continue researched profiles state by state in priority order (Medium 73 first).
2. After each batch: run the similarity gate; the owner reviews before `approved`.
3. At launch: only gate-passing pages go live. If some Standard/Traffic cities aren't
   approved in time, they stay as state-page booking buttons (no city URL) — never
   published as thin pages.

This mirrors the original build plan (Sections 8, 12, 17.2b of the brief) with the
owner's newest content sections (famous places / airports / wedding venues / wineries)
now part of every city profile.
