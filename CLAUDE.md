# Cascade Charter Bus website — rules for Claude Code

Read `CASCADE_REBUILD_BRIEF.md` fully before any work. It is the full specification. Follow its Section 0.

## Always
- Explain everything to the owner in **simple, plain English**. No jargon.
- **Ask before doing anything outside this project folder** and before anything that can't be undone (deploying, pushing to main, DNS, touching the live site or any account).
- Work **one phase at a time** (brief Section 14). Stop at the end of each phase, show the result, wait for approval.
- Keep `PROGRESS.md` up to date: what is done, what is next, open questions.

## The things that matter most
1. **Same theme and structure as the live site** (www.cascadecharterbus.com). Do not redesign. Only animations may change, and only after the owner agrees.
2. **Only the 710 cities in `data/locations-keep.json` get a city page.** Every other old city URL returns 410.
3. **State pages show a button for every city.** Kept cities on top (link to their page). All other cities below (button opens `/contact/` with Pick-Up Location pre-filled, no page, no per-city URL). Brief Section 7.7.
4. **True facts only.** Use `data/site.json` and brief Section 15. Never invent numbers, reviews, guarantees or prices. Fix every error in brief Section 7.5b.
5. **Content is short, unique and human** (brief Section 12). A person approves every page before it is published.
6. **Every row of the SEO consultant's roadmap must be done before launch** (brief Section 20), and **everything must be adjustable from the admin** (brief Section 19.10).
7. **No errors:** lint, typecheck and build pass with zero errors, no broken links, no browser console errors, before you show any phase.

## Never
- Never change the live site, hosting, DNS or Google accounts without the owner saying so in that moment.
- Never publish customer names or private addresses.
- Never copy, edit or invent reviews. Trustpilot reviews appear only through the official Trustpilot widget.
- Never use AI-generated photos of buses, drivers or customers.
- Never show Puerto Rico or any non-US area. US states and DC only.
- Never write "10+ years" or "15+ years". It is "5+ years of service".
- Never build a city page that is not in the keep list (new ones come later through the admin, brief Section 19.6).

## Files
- `CASCADE_REBUILD_BRIEF.md` — full specification
- `data/locations-keep.json` — the 710 city pages (sorted in display order per state)
- `data/pages-to-keep.csv` — same list as a table
- `data/site.json` — confirmed business facts
- `data/all-cities.json` — you create this in Phase 1 from the live state pages
- `docs/live-site-audit.md` — problems found on the live pages
- `docs/live-reference/html/` — page code of six live pages (home, locations hub, a city page, a service page, a fleet page, the booking form). Copy the theme and the booking form from these. The full source code is not available.
