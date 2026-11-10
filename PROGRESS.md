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

## Not yet done (owner decisions / later phases)

- Phase 3 polish: PageSpeed tuning pass, animation polish (owner-approved subtle fade-up),
  blog decision, remaining 404/410 rules (Phase 6), admin dashboard (Phase 3b).
- City page local content = Phase 5 (710 City Profiles, batch reviews).

## Next

Owner reviews `docs/compare/` → approve template match (Phase 2 done) → Phase 3 polish
+ PageSpeed, then Phase 3b admin.
