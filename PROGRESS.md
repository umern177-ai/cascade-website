# PROGRESS

Updated every phase. Current status at the top.

## Status now

**Phase 2 (theme match) — core templates built and building cleanly. Waiting on owner review.**
**Review servers (set up Nov 9):**
- Dev preview: http://localhost:3100
- Production preview: http://localhost:3200
- Restart dev yourself: `npm run dev` in this folder — if the port is busy, close the terminal
  it started in, or ask the agent. After a code change, restart is only needed for `npm start`. 

## Owner decisions locked (Nov 9 + Nov 9 later)

- Build inside this folder; host later (nothing deployed).
- Trustpilot widget later; 6 owner-pasted verified reviews display word-for-word
  (`lib/site-data.ts` → TRUSTPILOT_REVIEWS), plus the 3 homepage testimonials kept.
- Sleeper buses: **bunks only, 4–15 bunks, restroom + shower; no artist room.**
- Quote final ✓ · response ~15 minutes ✓ · gratuity included ✓ · wedding season May–November ✓
- Hours 24/7 · Band Tour Bus page built at launch (8th service, now in menu + footer).
- Blog: live posts have NO URLs (cards only) — owner decision still pending (QUESTIONS.md);
  for now the blog hub matches the live look, posts stay as they are.

## Built in Phase 2 (797 pages prerender, 0 lint/build errors)

- **Theme**: `app/globals.css` rebuilds the live site's custom stylesheet verbatim
  (bootstrap + theme tokens, `docs/theme-tokens.md`); Inter via next/font.
- **Header** (top ribbon, dropdowns, mobile menu, BOOK NOW) and **Footer** (all 3 fixes:
  South Ozone Park address, Sitemap → /sitemap/, fixed copyright) — same classes/markup
  as live. Bootstrap JS replaced by small React handlers (faster, same behavior).
- **Pages**: Home (all 9 live sections, confirmed-facts stats bar, 5+ years,
  3 testimonials + 6 Trustpilot reviews), Services hub + 8 service pages (incl. Band Tour
  Bus; vehicle-fit table, unified pricing facts), Fleet hub + 7 fleet pages (one data
  source `lib/fleet-data.ts`; sleeper page: 4–15 bunks + restroom/shower; real phone in
  Call Now; breadcrumbs), Locations hub (51 areas + DC), 51 state pages (two-group city
  list: 710 kept-city links + ~28.8k booking-form buttons), 710 city pages (frame;
  local content = Phase 5), About (facts fixed), Contact (exact booking form, working;
  submits to /api/quote → logs + Resend-ready; pills are real radios; honeypot+time-trap;
  prefill verified end-to-end), FAQs, blog hub, 3 legal pages (live text kept), HTML
  sitemap /sitemap/, 404 (correct title/description, noindex), 410 page at /gone/.
- **SEO infrastructure**: self-canonical + robots meta + OG on every page; Organization/
  LocalBusiness + Service + FAQPage + BreadcrumbList schema; **hierarchical sitemap
  index** (`/sitemap.xml` → 6 child files with the consultant's names; cities file holds
  exactly the 710 approved pages); robots.txt blocks /admin/ + /api/; llms.txt placeholder;
  GTM loaded non-blocking; manifest + favicons.
- **Verified end-to-end**: Ohio page = 26 kept-city buttons (pages) + 1,043 quote buttons;
  clicking "Aberdeen" → /contact/ with Pick-Up Location pre-filled ✓.
- **Side-by-side comparisons (live | new)** for every template at phone+desktop:
  `docs/compare/*.jpg` (31 images; band-tour-bus and sitemap are new pages, no live twin).

## Latest round of owner-requested changes (Nov 9, later)

- TikTok link → @cascadecharters; footer icon = filled official note glyph.
- Terms & Conditions replaced with the owner's new full text; Cancellation Policy page
  rewritten to match (deposit 50% non-refundable, balance 2 weeks prior, tiers:
  within 2 weeks 100% / 3 weeks 50% / 3wks–1month 20%, card fee 3.8%, payment methods);
  the /faqs/ cancellation answer updated to match too (no contradiction on site).
- "4–15 bunks" → "up to 15 bunks" everywhere (fleet hub/pages, services, state pages, city pages, llms.txt).
- City pages: H1 + title/meta use the primary keyword "Charter Bus Rental in {City}, {ST}"
  (brand exactly once — absolute titles).
- Visibility bugs found by an automated contrast audit (scripts/contrast-audit.mjs) all
  fixed: near-invisible headings on white sections (fleet FAQ, Explore More Fleet Options,
  Key Amenities, Explore Other Services, Our Service Coverage), amber-on-amber VIEW CITIES
  badges → amber bg + dark text, breadcrumb links forced dark (no Bootstrap blue).
- New content sections added (owner request): every fleet page gets "Real trips this
  vehicle is booked for" (3 scenario cards, per-vehicle) + "Planning tips before you book"
  (4 numbered tips); every service page gets "How your booking goes" (4-step timeline,
  per-service) + "Trips we run all the time" (4 real examples, per-service); every state
  page gets "How booking works in {State}" + "Vehicles available in {State}" (with real
  capacities) + a 2nd paragraph in the Reliable section; every city page gets "Vehicles
  for trips from {City}" + "What to tell us for a fast quote" checklist.
- Deep local research (real venues/airports/events per city) still lands in Phase 5.

## Later round of owner changes (Nov 9, evening)

- **Blogs removed entirely** (menu, footer, /blogs/ page, sitemap lists, llms.txt). The URL returns 404
  until the owner decides the blog's future (restore as real post pages or keep out).
- **City pages rebuilt with researched content (`data/city-content.json`)** — 27 high-priority cities
  researched first: famous places, airports (+codes/miles), wedding venues (from real inquiries where
  available), nearby wineries. All cities get the structured sections; research continues batch by
  batch (this is Phase 5 beginning). Facts are flagged `verified: false` pending the owner's review.
- **Wedding is priority 1** on every city page (owner: ~70% of inquiries are weddings) —
  "Wedding Shuttle Service in {City}" section right under the hero, with real venues where known.
- **"Charter bus is also called Motorcoach"** — woven into the charter page, meta title/description,
  home page cards ("Band Tours & Motorcoach Charters").
- **Fleet pages**: new "Why people book a {vehicle}" section (real reasons per vehicle, e.g. why
  people charter a motorcoach / rent a school bus).
- **Service pages**: new "Every kind of vehicle for your group, one booking" section (full fleet
  chips with capacities; mixing vehicles for big groups).
- **Industry keywords** woven naturally into visible content (charter bus rental, motorcoach,
  minibus, shuttle bus, party bus, airport shuttle) on home, fleet, services and city pages,
  plus a keyword line under city heroes. No keyword stuffing (brief Section 17.4 / Google spam rules).

- **Button/alignment polish (owner request)**: automated button audit (scripts/button-audit.mjs)
  found no vertical offsets; global CSS now centers every button's content perfectly
  (inline-flex, icons never squashed, form placeholders left-aligned like the live form).

- **Keyword chip line removed** from city heroes (owner request); hero copy kept mid-aligned.
- **City content strategy formalized in CITY_CONTENT_STRATEGY.md** (owner concern: Google
  spam safety): measured scaffold-page similarity is 0.35–0.75 (FAILS the <0.20 gate) —
  so unresearched city pages are scaffolds that must not be published; the researched
  27 pass. Variation pools (lib/city-variants.ts) vary section headings/leads per city;
  fallback pages now carry every real fact held (county, real pickup spots). Research
  continues by tier (Medium 73 next); the gate decides what publishes at launch.
  Gate checker: scripts/check-city-similarity.mjs → reports/city-similarity-{state}.csv.

## Technical-SEO "100%" pass (Nov 9, night)

- **SEO verification report** `reports/seo-verify.md`: 189 rendered-page checks, all PASS
  (canonicals self-referencing + apex https, exact robots meta, unique titles/descriptions,
  one H1, OG + Twitter tags, GTM on every page, schema, breadcrumbs incl. city/fleet,
  status codes 200/404/410).
- **GTM** implemented with the owner's snippet shape (async gtm.js GTM-5WTG8HBP + dataLayer),
  non-blocking, noscript iframe fallback, loaded once sitewide.
- **URL policy**: proxy.ts (Next 16 middleware) — uppercase URLs 301 to lowercase, removed
  city URLs and /locations/pr/ serve a real **410 Gone** page; trailing slashes 308; kept cities 200.
  www→apex 301 staged in next.config for the hosting switch.
- **Icons/manifest**: app/icon.png + app/apple-icon.png + working /manifest.json (fixed 404),
  theme color, apple-touch support.
- **Search Console**: verification meta tag support via NEXT_PUBLIC_GSC_VERIFICATION env.
- **Cookie consent** banner with Google Consent Mode defaults (denied until accepted).
- **Performance (Lighthouse, local)**: home 82–85, corporate service 90, city 88, fleet 88,
  state page (1,043 city buttons) 76–82 (variance) — hero WebP (≤200KB) + preload, server-rendered
  quote buttons (no hydration), single-element markup, content-visibility on the long list,
  native details FAQ on state pages. State page is heavy by owner requirement (all cities
  visible); re-measure on the real host where TTFB/CDN help.
- **Accessibility**: 96 (was 91); contrast-darkened small amber eyebrows, aria role fix,
  heading-order fix. Best-practices 100, SEO 100.
- Remaining checklist items are **Phase 3b CMS** features (admin-editable canonical/robots/
  schema, redirect manager, rich-text blog editor, internal linking editor) as agreed.

## Staging for the SEO consultant (Nov 10)

- Site committed to git (repo ready, 13.5 MB, 188 files).
- **Staging switch built**: with `STAGING=1`, robots.txt serves exactly
  `User-agent: * / Disallow: /` and every page sends `X-Robots-Tag: noindex, nofollow`
  (both verified locally). Normal mode unchanged (verified).
- `docs/STAGING_GUIDE.md` — plain-English setup + day-to-day + how to crawl staging.
- Waiting on owner: two one-time logins (GitHub via `! npx gh auth login`,
  Vercel via `! npx vercel login`) → then I push + deploy + verify the sandbox URL.

- **STAGING IS LIVE**: https://cascade-website-rho.vercel.app (owner-deployed via Vercel,
  GitHub auto-deploy on every push). Google blocked both ways (robots Disallow:/ + noindex
  header — verified). URL rules verified on staging: uppercase→301, removed cities→410,
  PR→410, kept cities→200. Full audit vs staging: reports/seo-verify-STAGING-vercel.md
  (189/189). Handoff note for the SEO person: crawl with "ignore robots.txt" enabled;
  canonicals point at the real domain (expected).

## 5 consultant-written city pages implemented (Nov 10)

- Owner supplied ALL-5-CITY-PAGES.md (Shelton CT, Kailua-Kona HI, Alexandria MN,
  Park City UT, Weirton WV) — fully written local content. This is now the standard
  city-page structure: hero intro → service blocks with Learn-More links → vehicle
  cards with reasons → 5 numbered destinations with amber "Bus drop-off tip" callouts +
  map-pin line → nearby cities (linked when kept) → 5 FAQs → CTA.
- Data lives in data/city-pages.json (with the file's "Check before publishing" items
  and Sources kept for owner review, NOT rendered publicly). Renderer:
  components/StructuredCityPage.tsx; loader lib/city-page-data.ts.
- Service + FAQPage + BreadcrumbList schema on each; unique titles/H1s per page.
- The remaining 683 cities follow this template as their profiles get researched.

## City-page structure round 2 (Nov 10, owner requests)

- **3-step booking block** (shared component components/BookingProcess.tsx): Call or
  Request Online → Custom Quote → Relax and Ride + a "fill the form with the correct
  itinerary" checklist — on all 5 structured city pages.
- **City map**: lazy Google Maps embed of the city + surrounding area ("{City} on the map").
- **Related cities**: 5–6 same-state nearby cards on every city page (linked when kept,
  amber card when not; Kona/Weirton render card lists without links).
- **Fleet showcase**: photos row from the fleet section, short cards (photo + name +
  capacity + local reason) clicking through to the fleet pages.
- **Service cards now carry photos**: the 6 live-site service images downloaded from the
  real site, converted to WebP (33–54 KB each) in public/images/services/ — used on the
  city-page service cards.
- **State pages**: new "Nearby States We Serve" section (4–5 linked neighbouring states,
  lib/state-neighbors.ts).

## Locations hub + state tiles + titles round (Nov 10)

- **Hubs/state pages**: locations hub redesigned (icon tiles + amber VIEW CITIES pills +
  stats chips), state-page city names in themed tiles (.city-tile) with mobile 2-col grid,
  "Nearby States We Serve" added to all state pages.
- **Titles site-wide**: "Charter Bus Rental in {City} | Cascade Charter Bus" (no state code);
  the descriptive phrase (e.g. "for Offices and Events") is now the H1 heading of the intro
  paragraph below the hero. Hero shows only eyebrow + short display text + buttons.
- **Form advice** on city pages expanded: pickup address, pickup time & date, return time
  for round trips, destination + stops between, arrival/event end time, headcount/luggage/extras.

## Breadcrumb strip sitewide (Nov 10)

- Home › Locations › Connecticut › Shelton now renders as a **full-width black strip
  directly below the header, above the hero** on every page (city, state, hub, services,
  fleet, about, contact, faqs, sitemap, legal) — amber separators, light text on dark,
  on-theme; verified full-width and above-hero on desktop AND mobile for 12 page types.

## City-page enhancement: Batch 1 DONE (Nov 10)

- **27 of 710 city pages now run the full consultant structure** (the owner's 5 +
  22 High-priority cities newly written: Angel Fire, Berlin CO? no—Berlin MD, Grand
  Junction, Hanover, Hood River, Lac Du Flambeau, New York City, Newry, North Conway,
  Astoria, Beacon, Benton Harbor, Crandon, Kalispell, Keene, Ludlow, Potsdam, Red Bank,
  Shawano, Shawnee, Taos, Whitefish). Each with researched places/venues/airports/tips,
  unique H1s and meta, Service+FAQPage+Breadcrumb schema, all reviewChecks + sources
  kept in the data file for owner approval.
- Batch 1 published to staging (git push → auto-deploy).
- **Next batches**: 22 cities per batch in priority order — 678 remaining (73 Medium →
  556 Standard → 54 Traffic). Owner reviews Batch 1 on staging before Batch 2 starts.

## City enhancement: Batch 1+2 DONE (Nov 10) — 51 of 710 pages

- **27 High-priority + 24 Medium-priority pages now run the full consultant structure.**
  Batch 2 cities: Juneau AK, Atmore AL, Roscommon MI, Moultonborough NH, Plymouth NH,
  Summit NJ, Sulphur Springs TX, Spokane WA, Mammoth Lakes CA, Westbrook CT,
  Rehoboth Beach DE, Sebastian FL, Bangor ME, Hazleton PA, Sevierville TN, Richmond VA,
  Port St. Joe FL, Savannah GA, Louisville KY, Amesbury MA, Uxbridge MA, Alpena MI,
  Boyne Falls MI, Minneapolis MN.
- Same-state similarity on researched pages: **0.001 Jaccard** (gate < 0.20) — fully unique.
- Remaining: **659 pages** (49 Medium + 556 Standard + 54 Traffic), ~28 batches of ~22.
- Priority numbers are production sequencing only (enquiry/click demand) — NOT a Google
  signal. Every page gets the same research + unique content + gates regardless of tier.

## City enhancement: Batches 1–3 DONE (Nov 10) — 73 of 710 pages

- **73 city pages now run the full consultant structure**: all 27 High + 46 Medium cities,
  each with researched places/venues/airports/tips, unique H1/title/meta, Service+FAQ+
  Breadcrumb schema, reviewChecks + sources kept for owner approval.
- Batch 3: Wabasha, Manchester NH, Wayne, Lake George, Tarrytown, Utica, Eugene,
  Klamath Falls, Franklin TN, Austin, Houston, Ogden, Fredericksburg VA, Richland,
  White Salmon, Sheboygan, Trevor, Jackson WY, Glenwood Springs, Minocqua, Gatlinburg,
  Cle Elum. All published to staging.
- Slug audit fix: Port St. Joe corrected to its real live slug (port-saint-joe).
- **Remaining: 637 pages** (27 Medium + 556 Standard + 54 Traffic).

## City enhancement: Batches 1–4 DONE (Nov 10) — 93 of 710 pages

- **93 city pages now run the full consultant structure.**
- Batch 1: 22 High-priority cities. Batch 2: 24 Medium. Batch 3: 22 Medium. Batch 4: 20 Standard.
- All have researched places/venues/airports, unique H1/title/meta, schema, reviewChecks + sources stored.
- Same-state similarity: 0.001 Jaccard on researched pairs (gate < 0.20).
- **Remaining: 617 pages** (7 Medium + 534 Standard + 54 Traffic), ~26 more batches.
- Ontario OR (Standard) needs re-entry — dropped due to syntax corruption from em dashes; revisit in next batch.
- Walterboro SC and Boyne Falls MI (Standard) also dropped due to same issue; revisit.

## City enhancement: Batches 1-5 DONE (Nov 10) - 110 of 710 pages

- 110 city pages now run the full consultant structure. Shelton CT **approved by SEO person**.
- Batch 5: Ontario OR, Walterboro SC, Granbury TX, Tappahannock VA, Wytheville VA, West Dover VT, Monroe WI, Athens AL, Evergreen CO, Englewood FL, Buford GA, Eagle ID, Carbondale IL, Florence IN, Marion IN, Saugus MA, Westford MA.
- Remaining: 600 pages. Owner: continue without waiting for SEO feedback.

## City enhancement: Batches 1-6 DONE (Nov 10) - 131 of 710 pages

- 131 city pages now run the full consultant structure. Shelton CT approved by SEO.
- Batches 1-5: 110 pages. Batch 6: 21 more (Oxford MS dropped due to data corruption, will re-add).
- Remaining: 579 pages. Owner instruction: continue without waiting for SEO feedback.

## City enhancement: Batches 1-7 DONE (Nov 10-11) - 153 of 710 pages

- 153 city pages now run the full consultant structure. Shelton CT  approved by SEO.
- Batch 7: Oxford MS, Yemassee SC, Sewanee TN, Union City TN, Wharton TX, Manchester Center VT,
  Tokeland WA, Amherst WI, Danbury WI, Reedsburg WI, Kodiak AK, Palmer AK, Talkeetna AK,
  Albertville AL, Selma AL, Cayucos CA, Emeryville CA, Granada Hills CA, Los Angeles CA,
  Mendocino CA, San Diego CA, Larkspur CO.
- Remaining: 557 pages (5 Medium + 534 Standard + 12 Traffic + 6 re-add). Continues in next session.

## Shelton CT premium page COMPLETE (Nov 11)

- **Owner-reported round 2 (same day):** the "…for Offices and Events" intro heading and
  the "Shelton Charter Bus FAQs" heading were invisible. Root cause: the site sets
  `body { color: var(--fleet-text) }` with `--fleet-text: #faf9f9` (near-white), so any
  heading without its own color inherits near-white on a white background. Fixed by
  setting a base dark color in the `.pp` scope plus explicit ink colors on those two
  headings (global CSS: `.pp { color: var(--pp-text) }`). Verified with Playwright:
  both render at rgb(15,17,21) on 390px and 1440px, size-correct, **0 console errors**.
  Screenshots: docs/new-site-shots/shelton-premium-{d,m}.jpg.
- **Also fixed the 500 on a stale CSS chunk:** Next 16's incremental route cache
  (`.next/server/route-cache`) survived an old build and served a prefetch pointing at a
  removed CSS chunk. Cleared it; re-verified clean. If you ever see chunk-500s after a
  rebuild, clear `.next/server/route-cache` (safe — it regenerates).
- **Owner request: quote buttons go to the booking form.** The three
  "Get a Free Quote"/"Request a Quote" buttons (hero, checklist card, amber CTA band)
  now link to `/contact/` with the pickup pre-filled (same prefill pattern as the
  state pages) instead of scrolling to the mini quote card. The hero mini-form is
  unchanged — it still submits to `/contact/` and pre-fills 4 fields from the URL.
- Verified after both fixes: `tsc` 0 errors, ESLint clean, build 798 pages 0 errors,
  all three quote buttons → /contact/ on desktop and mobile, 0 console errors.

- The owner-supplied premium design (shelton-ct-charter-bus.html) is now fully built
  for Shelton. CSS lives in `app/globals.css` scoped under `.pp` (no Bootstrap clashes).
- New component `components/PremiumCityPage.tsx` (plain server component; the earlier
  TypeScript problem avoided). Rendered for any structured city whose data has a
  `premium` block — currently only Shelton (`data/city-pages.json`).
- Includes the owner's five requested pieces from the HTML:
  1. **Hero with quote form** — dark hero + white quote card (pickup, destination,
     trip date, passengers) that GETs `/contact/`; the booking form now pre-fills
     Pickup, Destination, Trip Date, Passengers from the URL query
     (QuoteForm change; works without JS or storage).
  2. **Facts strip** — 65 mi to Manhattan · ~2 hrs each way · 14–60 seats · ~15 min reply
     (all confirmed facts; floats over the hero like the HTML).
  3. **Route diagram** — Shelton → NYC SVG (Merritt Parkway banned, Route 8 + I-95),
     in the "Know before you book" intro with the ✓/✗ rule list.
  4. **Destinations with sticky sidebar** — "On this page" dark index that sticks while
     the 5 destination cards (with bus drop-off tips) scroll.
  5. **FAQ accordion** — native `<details>`/`<summary>` with the amber plus/minus, plus
     a sticky "Talk to dispatch" aside. No JavaScript needed.
- Also premium-matched: services rows with photos + tag pills, fleet cards with
  capacity badges, nearby-city grid + lazy map, dark 3-step booking block with the
  itinerary checklist card, amber CTA band. Non-kept nearby cities still open the
  booking form with the pickup pre-filled (sessionStorage, same as state pages).
- Verified: `tsc` 0 errors, ESLint clean on all changed files, `next build` 798 pages
  with 0 errors, Shelton serves 200 with hero form/facts/route SVG/dest sidebar/FAQ
  details all present in the prerendered HTML, /contact/ accepts the query pre-fill,
  and the other 130 structured city pages are untouched (Westbrook check: 200).
- Schema unchanged: Service + FAQPage + BreadcrumbList on the page.

## Premium design CSS applied (Nov 11)

- Added premium CSS from the owner-supplied Shelton HTML to globals.css:
  premium sections, booking steps, checklist, CTA band with amber bg, FAQ details accordion style,
  destinations with sticky sidebar, nearby grid, footer dark style.
- StructuredCityPage.tsx updated with premium section-head, intro with left border, service cards with
  top border accent and rounded corners, fleet cards with capacity badges.
- SheltonPremiumPage.tsx was created but removed due to TypeScript complexity; premium CSS remains in globals.
- Next: apply the remaining premium design elements (hero form card, facts strip, route diagram) to
  StructuredCityPage in a follow-up pass.

## Not yet done (owner decisions / later phases)

- Phase 3 polish: PageSpeed tuning pass, animation polish (owner-approved subtle fade-up),
  blog decision, remaining 404/410 rules (Phase 6), admin dashboard (Phase 3b).
- City page local content = Phase 5 (710 City Profiles, batch reviews).

## Next

Owner reviews `docs/compare/` → approve template match (Phase 2 done) → Phase 3 polish
+ PageSpeed, then Phase 3b admin.
