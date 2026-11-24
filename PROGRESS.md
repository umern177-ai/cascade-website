
**Nov 19 — ADMIN DASHBOARD (brief Section 19.10) — built + verified on localhost. NOT committed / NOT deployed (owner reviews on localhost first).**
- Login: /admin/login with the shared team password (env ADMIN_PASSWORD; localhost default "cascade-admin"). Session cookie is HMAC-signed, HttpOnly, 30-day; ADMIN_COOKIE_SECURE=1 should be set on the https production domain.
- SEO GUY SECOND LIST (Nov 23): verified + closed. (1) www→apex 301 already in next.config; http→https is host-level on Vercel, production domain needs only DNS pointing at the project. (2) Canonical: VERIFIED present on every built page (static, city, service, fleet, blog) via curl of .next HTML — the consultant's finding was from the old live site; custom canonical + robots + OG are admin-editable per page. (3) 404: no canonical emitted (correct), true 404 status. (4) Home headings verified strictly sequential h1→h2→h3 by scanning the built HTML. (5) Conversion tracking: generate_lead pushed to dataLayer on successful quote submit (components/QuoteForm.tsx) plus click_phone / click_email / cta_quote_click click events sitewide (components/ConversionClicks.tsx) — map them to GA4 conversions in GTM. (6) Speed: home hero converted from CSS background to priority next/image (sized AVIF/WebP instead of 224KB fixed webp). (7) Sitemap restructured to the consultant's exact hierarchy: /sitemap.xml index → sitemap-static.xml (12) + sitemap-services.xml (13) + sitemap-fleet.xml (8) + sitemap-locations.xml (758 = 48 states + 710 cities) + sitemap-posts.xml (1); noindex/deleted excluded automatically; old file names 301-redirect (sitemap-pages→posts, locations-states/cities→locations). (8) Footer already links the HTML sitemap /sitemap/, not XML — confirmed. Sitemaps also allowed through middleware while the site is closed (crawlers must reach them).
- OWNER FEEDBACK PASS (Nov 21): fixed the Redirects page 500 (CSV-import event handler lived in a server component — moved to RedirectImport client component). Extended /admin/pages/edit so EVERY page now opens with its real content: home (hero lines, lead, facts strip, section headings), about (standards cards), contact + locations hub + every state page (hero H1/lead), legal pages (full long-form text sections) — plus the existing city/service/fleet/blog editors. Render side patched to consume these overrides (home, about, contact, hub, state pages verified live; the / h1 'Group buses, done brilliantly — Every Trip.' published from the editor rendered on the site, then restored to default). Verified field counts: home 22, about 16, contact 8, hub 8, state 10, legal 6.
- SEO CONSULTANT CHECKLIST PASS (Nov 20-21): gaps closed on top of the admin build.
  Self-referencing canonical remains the default on every page; the page editor's Meta panel now also edits CANONICAL URL, ROBOTS (index-follow / noindex-follow / noindex-nofollow / index-nofollow), OG title, OG description and OG social image per page (verified live on /faqs/: canonical + ogTitle + noindex applied, then restored). Blog editor gained SEO title, canonical, noindex checkbox, OG image, scheduled publish date (future-dated posts stay off /blog/ until the date), updated-date stamp and multi-select categories; slug changes auto-create the 301 (old→new) in the redirect manager and slugs are uniqueness-checked against posts and pages (409 on collision). Sitemap excludes noindex/deleted pages at build. New Schema & tracking admin page: sitewide JSON-LD (validated, injected into every page head), GA4 measurement ID, Microsoft Clarity ID and raw <head> code — all live without deployment. Blog editor: uploads auto-convert to WebP in the browser and the internal-link button opens a searchable picker of all 789 pages. Redirect manager has CSV export + file import (dedupes by source URL). Still true: SSG crawlability, 404s, 410s with noindex, robots.txt with sitemap ref + /admin blocked, next/font, manifest + apple icons, WebP/AVIF, lazy loading, LCP preload, cookie consent.
- ON-PAGE EDITING (owner request Nov 20): open any city/service/fleet page with ?edit=1 while logged in — pencil icons appear on every editable text block (21–25 per page); click → edit in place → "Save & publish" → the live page updates INSTANTLY (PATCH /api/admin/page-body merges the field + revalidatePath; no deployment, no rebuild). Non-edit mode = identical to the visitor view. The edit bar is click-through (pointer-events: none on the wrapper).
- FINAL STRUCTURE (after owner's mid-build feedback — WordPress-style): sidebar = Dashboard, ALL PAGES, Blog posts, Meta tags, Page content, Redirects. /admin/pages lists every page of the site (789 in catalog: core + 12 services + 7 fleet + blog + 48 states + 710 cities) search- and filter-able; Edit opens /admin/pages/edit?path=… showing that page's meta tags + its H1/intro/FAQ live copy (city/service/fleet), with save/remove — editing, updating AND deleting existing content in one screen.
  - Dashboard (/admin/): overview cards + live counts.
  - Blog posts (/admin/blog): create, edit (built-in guide too), retire, drafts, slug changes; featured image + image uploads INSIDE the content (saved to public/uploads/YYYY-MM/, inserted as <figure> at the cursor); sanitized server-side (no scripts); posts appear on /blog/, /blog/{slug}/ and sitemap-pages.xml automatically.
  - Meta tags (/admin/meta): title + description overrides for every core, service, fleet page + any path (state pages, blog). Empty = built-in tags.
  - Page content (/admin/content): three FAQ sets (home, FAQs-page extras, contact), home hero copy, heritage section, services/fleet hub headlines.
  - City pages (/admin/cities): search all 758 city + state pages; per-page title/description overrides.
  - Redirects (/admin/redirects): 301/302 rules stored in data/admin/redirects.json; applied by next.config at the next build (local: npm run build; deploy: next push). Slug changes should add their old→new rule here.
- Plumbing: lib/admin/{store,auth,slugify,sanitize}.ts; save posts via /api/admin/save-post + uploads via /api/admin/upload (cookie-checked, sanitized server-side); server actions for the rest (all guarded); sitemap children now include admin posts (ISG hourly).
- Data stores ship empty: site falls back to 100% built-in content while the admin fields are blank.
- Public chrome (header/footer/cookie banner/GTM) is hidden inside /admin (HideOnAdmin). ADMIN_ONLY=1 (.env.local, localhost only) keeps the public website CLOSED while the dashboard is tested: every open URL 307s to the admin login; logged-in admins (cb_admin_open mirror cookie) can still preview pages and use on-page editing. REMOVE the ADMIN_ONLY line from the env before going live.
- Verified end-to-end in ADMIN_ONLY mode with preview: on-page publish of city (intro + destination tip + section heading), service (H1) and fleet (use case) — saves appear for the editing admin instantly and in normal browsing.
- KNOWN LIMIT (production later): data/*.json edits don't persist across Vercel builds — wire Vercel Blob / a database for the admin store at deploy time (localhost + self-host work as-is). Verified end-to-end on the production build locally: login, wrong-password rejection, content/meta/city overrides going live, post publishing with in-content image + sitemap entry, redirect storage.


Updated every phase. Current status at the top.

## Status now

**Nov 19 — committed (097ad98) and pushed to origin/staging per owner go-ahead; production (origin/main) untouched.** Includes: fleet photo folders + auto-rotate + showcase, USA coverage map, SEO/metadata lengths, speed + Lighthouse fixes, llms.txt (owner files, fact-checked). Production flow memory: llms.txt now serves from public/ (app/llms.txt route removed — re-add a route if the admin phase needs one).
- New: `public/images/fleet/<vehicle>/` (charter-bus, sleeper, minibus, school-bus, sprinter-van, party-bus, suv-sedan). Owner dropped 26 real fleet photos; covers set as `main.jpg` (charter-bus = 3/4 front Volvo exterior, party-bus = wide pink-lit interior; school-bus/sprinter/minibus/suv kept their existing strong covers). `AVIF` accepted by the manifest scanner besides JPG/PNG/WebP.
- `components/VehiclePhoto.tsx` (client, ~60 lines): every card-sized fleet showcase (home cards, fleet hub, fleet-page "other fleet options", city page vehicle cards, service-page vehicle rows) now auto-rotates that vehicle's photos every 3s with a soft crossfade — box size unchanged; static when the folder holds one photo; respects prefers-reduced-motion. Alt text lives on the visible shot only.
- Fleet detail page "Photo showcase" rebuilt as a compact, centered grid (`pp-vshow`: ~210px tiles, 4/3 crop, 4-6 per row, 2-up on phones) per owner's "small, beautiful" request.
- `lib/fleet-photos.ts` (fleetGallery / fleetMain / fleetShots) feeds every photo spot with the legacy files as fallback, so an empty folder never renders a broken card.
- Instructions for the owner: `docs/how-to-add-fleet-photos.md`.

**Nov 19 — full polish pass (mobile/desktop, speed, SEO lengths, garbage cleanup) — in working tree, NOT yet committed.**
- Lighthouse round 2 fixes (verified from the report, not guessed):
  - React hydration error (#418) on /contact/: React 19 hoists SVG `<title>` elements into `<head>`, so the map's `<title>` tooltips broke hydration — removed; state names show as SVG text on hover + every state link carries an aria-label.
  - Heading-order flag on /contact/: the "Guaranteed pricing" side-card h3 skipped a heading level — retyped as a styled p.
  - Contrast flag: footer copyright "All rights reserved." sat at ~3:1 (text-muted + opacity-50) — restored to normal muted color.
  - Tap targets: tel:/mailto: links across the site get padded 36px hit boxes; the map's small eastern states get invisible 30px tap circles (all map taps route through them; hover still highlights shapes).
- Verified in round 1 of Lighthouse (mobile, before those fixes): SEO 100 on home/city/contact/fleet; best-practices 100 except contact (hydration error, fixed above); a11y 95–97; CLS 0 everywhere.
- FINAL Lighthouse (mobile, local build, serial runs — LCP numbers carry local-server variance; production CDN will be faster): home perf 76, city 88, contact 96, fleet 94 — accessibility 100, best-practices 100, SEO 100 on all four; CLS 0 everywhere. Final QA sweep: 0 console errors, 0 broken images, correct canonical/meta on every indexed template, tap targets ≥24px (only flags left are inherent: the 404 page's own status, and home's by-design swipeable fleet rows).
- Title/description length hygiene, verified programmatically:
  - City titles: all 710 now render ≤60 chars (55 shortened to "{City}, {ST} Charter Bus Rental…"; 2 long-named cities use "{City} Charter Bus Rental…"; app/locations/[state]/[city]/page.tsx appends ", ST" only to the old "Charter Bus Rental in …" titles). 0 duplicate rendered titles across 710.
  - City descriptions: 0 over 160; 1 sub-120 description brought to 134 with the standard trailer.
  - State pages: description trimmed to ≤160 for every state name; FAQPage schema added to match the visible FAQ accordion.
  - Fleet + service pages: 14 metaTitles trimmed; every one renders ≤60 with the " | Cascade Charter Bus" suffix (verified list in the session).
  - Blog post title + hub, FAQs, contact, services hub, fleet hub, locations hub titles all ≤60 rendered.
- Locations-count copy fixed sitewide (data holds 48 states, no DC): locations hub title/description/badges (48 states with city pages), HTML sitemap badge, llms.txt line. "All 50 states" service-coverage claims (home facts, state-page copy, UsMap legend) are unchanged and correct.
- Speed:
  - Home hero photo now actually preloaded (ReactDOM.preload in app/page.tsx — the layout comment claimed it but no preload link existed anywhere).
  - /contact/ map replaced: the click-to-load Google Maps iframe (~350 KB on click) is gone. New inline SVG USA map (components/UsMap.tsx + data/us-map.json, ~19 KB, generated from US Census public-domain boundaries by scripts/build-us-map.mjs): pin in every state, hover draws a dashed signal line from the dispatch station (South Ozone Park, NY) to that state, 48 state pins link to their locations page, NV/ND/DC pins open the quote form. Zero external requests.
  - Blog posts get twitter card via metadata (they were missing).
- Tap targets ≥24px: footer legal links, breadcrumb strip, top ribbon, sitemap page rows + chips, nav label links, inline "Trustpilot profile" link (CSS block "final QA pass" in globals.css).
- Garbage removed (all verified import-free before deletion): components/StructuredCityPage.tsx (superseded by PremiumCityPage; GenericPremiumCity kept — it is the documented fallback for admin-created cities, brief 19.6), components/MapEmbed.tsx (replaced by UsMap), lib/city-variants.ts, lib/privacy-restored.json; ~250 lines of dead CSS verified unused then removed from globals.css (premium-card/dest-card/fleet-card/booking-step/nearby-card/fleet-slider/Vanguard footer variants/etc.); dead opacity-10 classes in Header (top ribbon border corrected to border-opacity-25); duplicate Image2 import in blog hub; dead inline serviceSchema/FAQ/example constants in app/services/[slug]/page.tsx (+ unused SITE/nf404 imports; owner TODO note preserved as a comment); root reference HTML files archived to docs/design-reference/.
- PremiumCityPage intro heading no longer renders data.h1 a second time (was H1 text duplicated as an H2 right below it); city vehicle-card alts now carry city + state.
- State-page fleet/neighbor cards converted from raw <a> to <Link>.
- Verified: tsc 0 errors, build 0 errors. Owner pending items: NEXT_PUBLIC_GSC_VERIFICATION not set (Search Console meta tag not emitted) — set it as a Vercel env var; Google Rich Results Test on each template after deploy.

**SEO consultant's schema document implemented (Nov 18) — in working tree, NOT yet committed.**
- Consultant doc (owner-supplied) mapped onto the site, with confirmed-facts adjustments:
  Organization sitewide (was LocalBusiness) with @id/#logo/#organization, contactPoint,
  correct South Ozone Park HQ (doc carried the old Bronx 10462 block — replaced per brief
  Section 15); LocalBusiness (@id #localbusiness, parentOrganization, 00:00–23:59 hours,
  HQ address) added to all 710 city pages + 51 state pages (areaServed City/State as the
  doc prescribes; geo omitted — no verified coordinates in data); Service blocks now @id'd
  (#service) with provider → Organization @id on service + fleet pages (offers dropped per
  doc note — no starting prices shown); FAQPage added where it was missing (home,
  services hub, fleet hub); Article → BlogPosting on blog posts (author → Organization @id
  per consultant note — no individual author/profile URL).
- NOT implemented (flagged to owner): the doc's sitewide "Product + AggregateRating
  (4.9 / 1205)" block — self-review markup is banned by the brief (7.12/9.5) and risks a
  Google manual action; real ratings come via the official Trustpilot widget only.
  Also: doc's tiktok.com/@cascadecharterbus vs owner-confirmed @cascadecharters handle —
  kept the owner handle (SITE data) pending owner check.
- Verified: tsc 0 errors, build 804 pages 0 errors, all 793 built HTML files parse every
  JSON-LD block (0 failures), 0 pages with duplicate schema types, exactly one
  Organization block per page, breadcrumb positions all numeric.
- After deploy: run each template through Google Rich Results Test (consultant's ask).

**ALL 710 CITY PAGES DONE (Nov 17). Owner said go on Nov 18: committed and pushed to staging (origin/staging). Production (origin/main) untouched.**
- Finished in one go: OR 7, UT 5, WY 6, CO 9, MT 9, TN 7, MS 6, CA 16,
  ME 8, WV 8, IL 9, MO 8, AZ 9, VT 3, RI 4, KS 4, LA 4, OK 3, SD 1,
  AR 1, IA 1, NE 1, AL 6 (batch31.mjs, 135 entries, researched end-to-end).
- All gates PASS: similarity worst 0.199 (< 0.20), 0 console errors,
  tsc clean, build clean (802 pages), 0 artifacts in data.
- Corrections honored: Wonderland Pier closed (not listed), White's Ferry
  closed 2020 (history only), Scotland Run now private, Northstar bus
  pilot, Gateway Geyser closed 2024, Winterville museum temporarily
  closed, Fool Hollow low-water ramp alert, US-385 Deadwood construction
  detour, Robert Johnson grave disputed-burial framing, Jenkins
  Plantation renovation status, Fallbrook festival date confirm-at-booking.
- 4-round margin pass lifted all 135 pages from ~690-770 to ~860-1100
  unique 5-grams (scripts/fix-b31-margin[A-E].mjs; round E used
  fact-bound template sentences from each page's own destinations+route).
- Remaining for owner: review + publish decision, Truthpilot widget (later).

**Batch 30 done in working tree (Nov 16-17) - committed to staging Nov 18 per owner go-ahead.**
- 100 new Shelton-level cities researched end-to-end and added
  (575 of 710 structured). All gates PASS, tsc + build clean, 0 console errors.
- States completed: CT 12, MN 13, MD 13, NJ 13, SC 17, FL 16, ID 6, NM 5, KY 5.
- Research: 9 parallel state agents + 2 follow-up verification agents
  (verified facts only; corrections honored - Wonderland Pier Ocean City
  closed Oct 2024 NOT listed; White's Ferry MD closed 2020 NOT listed;
  Scotland Run golf Williamstown now fully private; Northstar rail
  MN replaced by Route-882 bus pilot - noted; Laurel Park race
  calendar flagged for 2027 Pimlico transition; Pearl Fryar garden
  continues as memorial after his 2026 passing).
- Verified logistics written into copy: Nautilus museum free + free
  parking (ID for 18+), Ravine Gardens 1.8-mi coach loop road, PEZ $5
  + $2 credit (not free), High Point free entry (winter ski trail pass
  Dec 1-Apr 1), Carlsbad Caverns timed-entry reservations required,
  Wetlands Institute Stone Harbor operating from temporary Cape May
  Court House home while rebuilding, Whippany Railway Museum winter
  closure with 2027 reopening slated.
- 3-round margin pass pushed all 100 pages from ~720-800 unique 5-grams
  to ~800-1000; cumulative gate now 0.199 worst (PASS < 0.20), 0 errors.
- Scripts: batch30.mjs (100 entries + writer footer), check-batch18.mjs
  NEW set extended with the 100 slugs, fix-b30-margin.mjs + margin2/3/4a/4b.
- Batch 29 cities: North/Central Goshen (RV capital verified; Elkhart
  County Courthouse NRHP with new 2025 building; Old Bag Factory),
  Middlebury (Das Dutchman Essenhaus 1,100-seat state's largest; Rise 'N
  Roll bakery; Pumpkinvine 17-mi trail), Warsaw (trademarked Orthopedic
  Capital - Zimmer Biomet HQ, DePuy 1895; Winona Lake Register village),
  Culver (academy on Indiana's 2nd-largest natural lake - Lake
  Maxinkuckee 1,864 acres), Huntingburg (League Stadium - A League of
  Their Own filmed here, 1894 ballpark renovated by Columbia Pictures;
  24,000 sq ft convention center; German-heritage county museum),
  Greensburg (courthouse tower tree - mulberry growing 110 ft up, Ripley's
  famous, Wi-Fi soil monitor; Register-listed 1854 courthouse); Central
  Bloomington (IU record 48,626 enrollment Fall 2025; Sample Gates; Mellencamp
  CORRECTED: born in Seymour not Bloomington - long-associated framing
  used; Kinsey Institute), West Lafayette (Purdue 54,651 Fall 2025;
  Amelia Earhart 1935 faculty with Purdue-funded Lockheed Electra;
  Ross-Ade stadium; Prophetstown park), Columbus (modern architecture
  capital: 7 NHL buildings by Saarinen father-and-son, I.M. Pei; Miller
  House & Garden tour $30 shuttle from visitors center, 4-6 weeks notice;
  Cummins corporate heritage), Shoals (honest tiny town pop. 677; Jug
  Rock - largest free-standing table rock east of the Mississippi;
  Hindostan Falls), NW Chesterton (Indiana Dunes National Park - renamed
  2019; POSTED $100 motor-coach fee; West Beach lot 655 spaces with 50
  oversized; state park's separate fee), Valparaiso (Chapel of the
  Resurrection - 5,500-pipe organ, 2,000 seats, NRHP 2021; VU founded
  1859), Granger (honest residential suburb; Notre Dame nearby),
  Lowell (Buckley Homestead living-history farm; dunes park access),
  Munster (Centennial Park on converted landfill, LEED Silver, banquet
  view hall; South Shore Line stations), Whitestown (fastest-growing 8
  consecutive years; Little League Central Region HQ; no "Anvil Park" -
  corrected to Anson Acres per official town list; Sunman (Versailles
  State Park - Indiana's 2nd-largest with $100 group day fee,
  trolling-motors-only lake; 34 miles not "down the road")).
- Research corrections honored: Mellencamp born Seymour NOT Bloomington;
  Anvil Park doesn't exist (Anson Acres per town site); Lowell "gravel
  pit lake" dropped; Sunman-Versailles drive corrected to 30-40 min via
  US-50; all airport mileages marked approximate.
- Similarity: comprehensive IN margin pass (fix-in-margin.mjs) + second
  pass (fix-in-margin2.mjs) for pages under 860 + Bloomington/West
  Lafayette framing differentiation (fix-in-pair.mjs) + Bloomington/
  Columbus enrichment (fix-in-blo-col.mjs) + Lowell/Munster lake-county
  differentiation (fix-in-lo-mu.mjs). Final: worst new-involving Jaccard
  0.199 < 0.20 PASS; all 17 IN pages 800-950+ unique words after margin;
  0 console errors; tsc + build 0 errors.
- Remaining: 235 of 710. Next by demand order: CT (12), MN (13), MD (13),
  NJ (13), SC (17), FL (16), ID (6), NM (5), KY (5), then the rest.
- Owner flow: all remaining batches build in working tree; batch everything
  ready in one push when the owner says go (never commit/deploy without
  the owner saying so in that moment).

**Batch 28 done in working tree (Nov 16) - committed to staging Nov 18 per owner go-ahead.**
- 16 new Shelton-level California cities researched end-to-end and added
  (458 of 710 structured).
- Batch 28 cities: Gold Country Sacramento (State Capitol free weekday tours
  7-day group booking, Old Sacramento 1850s district with bus day parking,
  Sutter's Fort adobe), Folsom (lake SRA's POSTED $50/$100 bus fees - a
  real coach fact; prison museum free with Walk-the-Line cash exhibit;
  historic district's 1855 Judah plan), Nevada City (National Register
  district; Nevada Theatre named correctly - not "California Theatre";
  Bridgeport covered bridge country's longest single-span with $10 lots
  + no Pleasant-Valley-Rd parking note), Jamestown (Railtown 1897
  movie railroad with free 2-lot parking and charter-train program up
  to 300; Chicken Ranch resort bus rows unposted - confirmed at booking;
  Columbia park free), Arnold (Big Trees' posted $50/$100 bus fees -
  printed; Ebbetts Pass Nov-May closure and no-large-vehicle advisory;
  honest gateway-town framing), Camino (Apple Hill 50+ growers with
  NO centralized bus policy - honest ranch-by-ranch parking plan;
  EDWA 30+ wineries; October peak); Coast Monterey (aquarium gives
  NO group discounts - printed plainly; seasonal bus-driver drop-off
  instructions and engines-off ordinance; Cannery Row garage network;
  18-mile coastal trail with north-segment closure check), Fort Bragg
  (Skunk Train charter program 20-225; glass beach no-collecting rule;
  fort name honestly framed as pre-Civil War Mexican-American-War
  naming - no Confederate heritage or renaming; NO Camp Lincoln),
  Trinidad (Sue-meg State Park's Yurok-village renaming with $8/$100
  group fees; memorial lighthouse relocated from eroding bluff; "one
  of the smallest" hedged copy for pop. 307), Cambria (Hearst Castle
  group/coach specifics marked confirm-at-booking; Moonstone boardwalk
  1.5 mi verified; Fiscalini Ranch preserve), Santa Ynez (Chumash
  Resort - bus rows unposted confirmed at booking; 70+ wineries; Solvang
  with group-tour map; Sideways country); SoCal Anaheim (Disneyland
  West street charter drop; convention center oversize double-rate
  CP lots; Honda Center 5,100 spaces; RTA park-and-ride printed),
  Northridge (CSUN 36,848 students; Soraya center Darby ave lots),
  Van Nuys (Japanese Garden groups 10+ RESERVED with weekday windows;
  airport honestly NO scheduled airline service; civic blocks), Dixon
  (May Fair; "oldest county fair" correctly marked UNVERIFIED; Cool
  Patch corn maze operator-claimed record noted; honest small-town
  framing), Fallbrook (April avocado festival confirmed; honest
  orchard-town framing; Tivoli/Pala Mesa details marked confirm-at-
  booking after Chamber 403s).
- Verification: tsc 0 errors, build 0 errors, 0 console errors; all
  16 CA pages render correctly; similarity gate PASS 0.199 overall.
- Remaining: 252 of 710. Next by demand order: IN (17), CT (12),
  MN (13), MD (13), NJ (13), SC (17), FL (16), ID (6), NM (5), KY (5),
  then the rest.
- Owner flow: all remaining batches build in working tree; batch everything
  ready in one push when the owner says go (never commit/deploy without
  the owner saying so in that moment).

**Batch 27 done in working tree (Nov 16) - committed to staging Nov 18 per owner go-ahead.**
- 14 new Shelton-level Massachusetts cities researched end-to-end and added
  (458 of 710 structured). **Massachusetts is now 100% complete (20/20).**
- States fully done: NY, PA, OH, TX, VA, GA, NC, MI, WA, NH, MA, WI
  (+ AK, HI, DE) - 12 states.
- Batch 27 cities: West Springfield (basketball hall group rates 10+ book
  a week out, free on-site lot; Armory free museum with Wed-Sun days and
  bus-accommodating lot; MGM garage bars big vehicles - drop on MGM Way
  with 947 Main St oversized lot; Six Flags parking $35/online-save),
  Great Barrington (Monument Mountain $6/car 56-space lot with winter
  unmaintained note; Tanglewood ticket-sale each spring + under-18s free
  lawn rows; Ski Butternut groups 20+ ~20% off with 72-hr res; Albany
  field is the nearest board), Greenfield (Magic Wings closed Mon-Tue,
  groups 15+ booked via form, 20+ a week lead; Green River Fest June at
  fairgrounds with parking add-ons; Poet's Seat free), Colrain (honest
  thin-attraction framing; Catamount forest informal roadside parking,
  no bus lot; Bridge of Flowers Apr-Oct with Water St bus drop + common
  parking; Colrain Central School real but consolidation under review -
  status check in booking); South Brockton (champions rows: 22.5-ft
  Marciano statue 2012 + Hagler bronze June 2024; Fuller Craft museum
  donation-based admission per own site; D.W. Field centennial park with
  10-noon gates and pedestrian-lane loop), Attleboro (Industrial museum
  free with the 1967 World Series trophy and Namath ring; Capron Zoo
  status check flagged after 2026 privatization questions; La Salette
  million-lights free with arrive-before-4:30 coach plan), Plainville
  (no Emerald Trail claim dropped - never existed; Gillette event days
  gridlock with the Patriot train sold via app only - printed as the
  coach's selling point; harness track state's only live rows),
  Blackstone (heritage park free in Uxbridge with towpath loops; bi-state
  gorge at the town edge; wedding venues borrowed from Uxbridge pages),
  Southbridge (optical city; museum Wed-Fri walk-ins with weekends by
  arrangement; OSV group rates from 12 booked 3 days ahead with
  dedicated coach parking and free driver past 30; moon-worn pilot
  glasses); East Brookline (JFK birthplace groups 5+ reserve, free 2-hr
  street parking; Olmsted NHS CLOSED through late May 2027 - stated;
  Coolidge Corner theater), Milton (Blue Hills 7,000 acres free with
  early-filling lots + alternate rows; Forbes House 8+ reservations;
  Eustis Estate weddings), Buzzards Bay (canal lift bridge 1935
  world-longest claim; 14+ car-free bikeway miles both banks; Scallop
  Fest DEAD - corrected to Cape Cod Canal Day September), Chelmsford
  (Lowell garage 6'8" clearance bars coaches - advance arrangement
  printed; arts center free lots; Freeman Lake no-pass rows), Lynnfield
  (MarketStreet peak lots tight - drop-row plan printed; Revere Beach
  first-public-1896; Breakheart free Saugus trails).
- Verification: tsc 0 errors, build 0 errors, 0 console errors; all 14
  MA pages 776-945 unique words after the comprehensive MA margin pass
  (scripts/fix-ma-margin.mjs); similarity gate PASS 0.199 overall.
- Speed/cost protocol applied this batch: 3 researchers for 14 cities,
  entries written toward ~900 words upfront, one margin pass for all 14
  pages in one shot, one build+gate cycle (vs multiple pair-fix cycles
  in earlier states).
- Remaining: 252 of 710. Next by demand order: CA (16), IN (17), CT (12),
  MN (13), MD (13), NJ (13), SC (17), FL (16), ID (6), NM (5), KY (5),
  then the rest.
- Owner flow: all remaining batches build in working tree; batch everything
  ready in one push when the owner says go (never commit/deploy without
  the owner saying so in that moment).

**Batch 26 done in working tree (Nov 16) - committed to staging Nov 18 per owner go-ahead.**
- 13 new Shelton-level New Hampshire cities researched end-to-end and added
  (444 of 710 structured). **New Hampshire is now 100% complete (21/21).**
- States fully done: NY, PA, OH, TX, VA, GA, NC, MI, WA, NH, WI (+ AK, HI, DE)
  - 11 states.
- Batch 26 cities: Central Lebanon (DHMC framed as working-hospital, no
  tours stated; AVA Gallery free rows; Montshire across the river with
  free parking), Concord (gold dome's oldest-continuous-use claim; State
  House tours FREE with 10+ pre-booked through the visitor line; planetarium
  field trips from $9 min 15; Penacook as village sidebar), Newbury (Mt.
  Sunapee beach fees + 30-day advance parking reservations; John Hay refuge
  REAL at Newbury with no own lot - parks at The Fells; crafts fair 9-day
  run), Peterborough (MacDowell grounds NOT open to public - Medal Day only,
  stated; Town House rents $130/hr with 650 seats; Mariposa weekday
  appointments); North Country Berlin (paper-city heritage; Moffett House
  free museum; Jericho beach lot limited + reserves; Northern Forest
  Heritage Park excluded as reported-closed), Gorham (mountain road
  honestly: coaches cannot drive it - base drop or guided van tour; Moose
  Brook $4 day fee; AMC Pinkham Notch staging), Whitefield (1865 Mountain
  View Grand; Cannon Tramway CLOSED Oct 2025 - stated, shuttles instead;
  Weathervane summer stock), Sunapee (harbor village framing - resort is
  physically in Newbury; accessible Kearsarge catamaran mid-May-Oct), SE
  Nashua (Gate City; 1946 Dodgers integration story; DoubleTree renamed
  from Crowne Plaza noted; Holman free parking), Exeter (Revolutionary
  capital 1775-1808 phrasing; academy founded 1781 opened 1783 - corrected
  from "class of 1781"; Kahn library; free downtown lots), Hampton
  (founding 1638/39 - NOT 1620s per official; no "boardwalk" claim used;
  Casino Ballroom 1899; beach lots 20-ft cap - oversized coach drop
  planned; bus pricing rows printed), Alton (Mount Major groups 15+ MUST
  register with Forest Society - printed; 400-car lot; Alton Bay cruise
  departures select-days with Weirs Beach as the standard daily row),
  Meredith (Mill Falls + sculpture walk 32 pieces with Wednesday docent
  tours; MS Mount Washington daily sailings at Weirs; science center rates).
- Verification: tsc 0 errors, build 0 errors, 0 console errors; all 13 NH
  pages 800-950+ unique words after the comprehensive NH margin pass
  (scripts/fix-nh-margin.mjs); similarity gate PASS 0.199 overall.
  Newbury~Sunapee pair differentiated: Sunapee's page leans harbor museum
  + cruises (the Alton Bay 1872 steamboat claim correctly NOT used for
  Sunapee), Newbury leans park beach + Fells + crafts fair. Sunapee's
  resort destination swapped for the harbor museum block (the resort is
  physically in Newbury).
- Process fix: batch26's writer footer caught missing pre-apply (checked
  with grep before running). NH margin pass handled all 13 pages in one
  shot, avoiding per-pair rebuild cycles.
- Remaining: 266 of 710. Next by demand order: MA (14), CA (16), IN (17),
  CT (12), MN (13), MD (13), NJ (13), SC (17), FL (16), ID (6), then the rest.
- Owner flow: all remaining batches build in working tree; batch everything
  ready in one push when the owner says go (never commit/deploy without
  the owner saying so in that moment).

**Batch 25 done in working tree (Nov 16) - committed to staging Nov 18 per owner go-ahead.**
- 9 new Shelton-level Michigan cities researched end-to-end and added
  (431 of 710 structured). **Michigan is now 100% complete (32/32) - the
  tenth fully-built state.**
- States fully done: NY, PA, OH, TX, VA, GA, NC, MI, WA, WI (+ AK, HI, DE).
- Batch 25 cities: North Bellaire (Antrim seat with the 1905 courthouse's
  Howard clock and 1992 $2.2M rededication; Short's Brewing free Fri/Sat
  tours; Torch Lake sandbar honestly boat-access-only with county
  cross-deputized patrol note; Shanty Creek's four villages), Maple City
  (1866 "Peg Town" crossroads; dune-climb early-window advice per NPS;
  Pierce Stocking trailer-drop rule; Nation's 10th AVA), Harris (UP resort
  crossroads; Island Resort & Casino; the June golf event correctly named
  the Epson Tour's Island Resort Championship - NOT the main LPGA; ESC
  Escanaba airport carrier status marked confirm-at-booking; Central-time
  zone quirk noted); Central/west Evart (NOT the county seat - Reed City
  is, stated; ODPC FunFest since 1974; twin riverside parks' launches),
  Gladwin (Cedar/Tobacco rivers - the brief's sugar-beet and Au Gres
  framings dropped; Smallwood Lake refilled Oct 2026, Secord refill
  April 2027 per Four Lakes Task Force; Rifle River group camp books
  phone-only to 100 riders), Coloma (Filkins Vineyards - OneRepublic
  guitarist Zach Filkins' vineyard; Silver Beach bus-pays-per-space fact
  printed); South Dowagiac (NOT the county seat - Cassopolis is, stated;
  1847 Kentucky Raid told factually: 300+ Quakers and free Blacks
  confronted the raiders, captives freed via the courthouse county,
  fallout fed the 1850 Fugitive Slave Act), Bridgman (Weko beach bugle
  tradition; beach house's hall rates; Silver Beach swap for
  differentiation), Sturgis (NOT the county seat - Centreville is;
  "cereal capital" correctly belongs to Battle Creek - omitted; Electric
  City 1911 first municipal dam story; Amish country centered on
  Centreville with cash-and-Sunday-closure market notes).
- Verification: tsc 0 errors, build 0 errors, 0 console errors; all 9 MI
  pages 792-888 unique words after margin; similarity gate PASS 0.199.
  Fix scripts kept: fix-mi-shore-pair.mjs, fix-mi-shore-pair2.mjs,
  fix-garden-city.mjs, sync-batch25.mjs. Novi (pre-existing) enriched.
- Process: batch25's writer footer missed at creation, caught before
  applying (checked tail first). A fix script once "ran" inside a bash
  line whose parse failed - nothing executed - so verification greps and
  built-HTML greps are now standard before claiming a fix applied.
- Remaining: 279 of 710. Next by demand order: NH (13), MA (14), CA (16),
  IN (17), CT (12), MN (13), MD (13), NJ (13), SC (17), FL (16), ID (6),
  then the rest.
- Owner flow: all remaining batches build in working tree; batch everything
  ready in one push when the owner says go (never commit/deploy without
  the owner saying so in that moment).

**Batch 24 done in working tree (Nov 16) - committed to staging Nov 18 per owner go-ahead.**
- 20 new Shelton-level Washington cities researched end-to-end and added
  (422 of 710 structured). **Washington is now 100% complete (26/26).**
- States fully done: NY, PA, OH, TX, VA, GA, NC, WA, WI (+ AK, HI, DE).
- Batch 24 cities: Puget Sound Port Townsend (Victorian NHL district,
  Fort Worden campus reopened Apr 1 under State Parks - Discover Pass
  required for ALL parking since March 2025; wooden-boat festival free
  shuttles; WSF vehicle reservations exist on ONLY two routes - the other
  one is Anacortes), Anacortes (San Juan gateway terminal; Deception Pass
  West Beach BARRED to buses - drop there, park at East Cranberry Lake;
  Friday Harbor correctly placed on San Juan Island), Port Orchard
  (foot ferry 10-min hop; Manchester State Park's torpedo warehouse
  reservable Apr-Oct), Kingston (Edmonds crossing; weekend boarding-pass
  rule 8-6; no reservations on this route); King County Woodinville
  (wine district 130+ tasting rooms; Chateau Ste. Michelle open with
  redevelopment speculation noted - "check hours at publish time"; HQ
  nuance ignored), Renton (Boeing plant NO tours - framing as
  view-from-outside; VMAC no tours with training-camp shuttle-pass
  logistics), North Bend (Twede's = real Double R; falls 270 ft per
  official site - not 268; rail museum accessibility booked a day ahead),
  Snoqualmie Pass (I-90 chain-carry rule for >10,000 lb GVW Nov 1-Apr 1
  printed in the page; ski group rates 15/30; honest season framing),
  Monroe (fair 228k-visitor estimate, $15/entry, transit shuttles to west
  gate; Lake Tye no-lifeguards note; Reptile Zoo CLOSED - omitted with
  successor noted), Ellensburg (rodeo since 1923; county fair since 1885);
  East Kennewick (reactor tours pre-register, B Reactor interior SUSPENDED
  2027 - stated; Red Mountain first vines 1975), Moses Lake (MWH airport
  has NO airline service - printed plainly; Gorge amphitheater policy
  marked check-before-publish), Omak (Stampede + Suicide Race phrased
  respectfully as a long-running tradition with deep tribal participation
  with animal-welfare opposition noted factually); Pass/historic
  Stevenson (Columbia Gorge Museum group tours $8 with drivers free,
  museum group rate from 10 - printed), Chehalis (depot museum group
  tours from 5 visitors at the posted rate; Johnston Ridge status marked
  check-before-trip; Carriage Museum correctly placed in Raymond),
  Davenport (honest thin; Fort Spokane + Grand Coulee dam drives ~1 hr
  not 45 min); Peninsula Forks (films NOT shot in Forks - stated;
  Hoh new 2025 day-fee + check-road-status note; beach lots now
  app-paid through the tribal program), Sequim (rain shadow ~16 in
  vs Forks 100+; spit walk 11 mi RT with cash-only fee; Port Angeles
  airport = CLM with NO scheduled flights), Hoquiam (stadium phrased
  "best-preserved/largest standing wooden grandstand" - the popular
  "oldest west of the Mississippi" claim not used; Cobain memorial real);
  Ridgefield (researched directly - refuge's auto tour explicitly
  rated for BUSES, $3/vehicle cash fee, tours capped at 20 with
  pre-visit; Discover Pass NOT valid there).
- Verification: tsc 0 errors, build 0 errors, 0 console errors; all
  20 WA pages 802-910 unique words after margin; similarity gate PASS
  0.198. Short pages got the comprehensive WA margin pass
  (scripts/fix-wa-margin.mjs); Tokeland and Ridgefield got full
  enrichment/premium blocks (Tokeland now fully Shelton-level).
- Remaining: 288 of 710. Next by demand order: MI rest (9), NH (13),
  MA (14), CA (16), IN (17), CT (12), MN (13), MD (13), NJ (13), SC (17),
  FL (16), then the rest.
- Owner flow: all remaining batches build in working tree; batch everything
  ready in one push when the owner says go (never commit/deploy without
  the owner saying so in that moment).

**Batch 23 done in working tree (Nov 16) - committed to staging Nov 18 per owner go-ahead.**
- 27 new Shelton-level North Carolina cities researched end-to-end and added
  (402 of 710 structured). **North Carolina is now 100% complete (31/31).**
- States fully done: NY, PA, OH, TX, VA, GA, NC, WI (+ AK, HI, DE) - 9 states.
- Batch 23 cities: Outer Banks Kitty Hawk (Wright memorial is Kill Devil
  Hills - said so; $10/person cashless + $100 coach fee), Corolla (horses
  are 4WD-only north of pavement - the coach stops legally and the licensed
  tours run the sand; 50-ft law and 1875 lighthouse walk-up tickets),
  Avon (pier storm damage Sept 2026 - status re-verified by phone note;
  Ocracoke ferry free through 2026, no reservations), Oriental (official
  "sailing capital" adoption; EWN is the airport code - not ECG); Charlotte
  metro Charlotte (NASCAR hall FREE designated bus row + driver rides free;
  whitewater $13/$25 oversized; CLT 53.6M passengers 2025), Davidson (2,073
  undergrads per fast facts), Kings Mountain (battlefield honestly across
  the SC line; military park free + gated lot), Salisbury (transportation
  museum FREE bus/RV parking + group rate 10; Cheerwine 1917; Lazy 5 Ranch
  wagon rides in Mooresville - stated); Triad Winston-Salem (Old Salem's
  dedicated bus entrance at S Marshall St - groups book 3 dates 30 days
  out; Krispy Kreme HQ moved to Charlotte 2017 - phrased), Clemmons
  (Tanglewood $2/car $8/van-or-bus gate; Festival of Lights runs Nov-Jan),
  High Point (Market is a trade show - not a tourist event; phrased),
  Mebane (Tanger's published bus parking + covered coach drop; Mebane the
  National Register 31-building district; Haw River trail launches lock at
  posted close); Triangle/Sandhills Raleigh (free science museum with Jones
  St bus lane + free bus parking 2 blocks; history museum CLOSED for
  renovation - routed around; Lenovo Center rename noted), Selma (1924
  union depot = free museum + working Amtrak; outlets honestly on the
  Smithfield line - "near Selma" wording; Tobacco Farm Life Museum is in
  Kenly with a 2025 repair-closure call-ahead), Lillington (fee-free Raven
  Rock; 135-step creek descent; Campbell), Raeford (turkey festival is now
  the NC Fall Festival - renamed honestly; wind-tunnel group bookings),
  Goldsboro (museum's Hazel-era letters; cliffs free but swim beach closed
  2026; B-52 mishap site stays private - the Eureka marker tells it),
  Rocky Mount (1816 mill date - corrected from 1818; brewery campus,
  tiny-house hotel); Foothills Lake Lure (Chimney Rock reopened June 2025
  - elevator works, admission includes parking; Flowering Bridge LOST in
  Helene - gardens on the banks continue with the new Rainbow crossing),
  Forest City (27 rocking chairs + giant; million-light Christmas since
  1930; GAMSA 2014), Hayesville (Lake Chatuge named correctly, not
  Hiwassee; Whiteside is near Highlands - not the AT; honest thin-town
  framing with Jackrabbit rec area), Taylorsville (Emerald Hollow Mine =
  world's only public emerald mine - dig permits at the gate); remainder
  Havelock (base has NO tours - air show is biennial with reserved passes;
  Croatan "only true coastal national forest in the East" per USFS),
  Fayetteville NC (post renamed Fort Bragg AGAIN Feb 2025 for PFC Roland
  L. Bragg - current name used; Airborne museum free admissions; CFBG
  group rate 25+ and buses welcome in parking), Mocksville (Davie County
  Museum NOT open yet - a museum-in-the-making; routed through the library
  history room; Childress Vineyards correctly in Lexington), Asheboro
  (zoo's free parking + dedicated coach lots by entrance and 15+ group
  rates; "world's largest natural-habitat zoo" as its standing billing),
  Yadkinville (Yadkin Valley = NC's first federally designated AVA, 2003
  federal register; Shelton group bookings with 50% deposit).
- Verification: tsc 0 errors, build 0 errors, 0 console errors; all 27 NC
  pages 790-878 unique words before margin; similarity gate PASS 0.198.
  Fix scripts kept: fix-nc-marion-clinton.mjs, fix-nc-margin.mjs
  (Marion + Clinton short pages enriched to premium level; ~19 NC margin
  passes). Marion and Clinton gained premium blocks (now fully
  Shelton-level). Process note: batch23's writer footer was missing
  pre-run and was caught BEFORE applying (batch21 lesson held).
- Remaining: 308 of 710. Next by demand order: WA (20), MI rest (9),
  NH (13), MA (14), CA (16), IN (17), CT (12), MN (13), MD (13), NJ (13),
  SC (17), FL (16), then the rest.
- Owner flow: all remaining batches build in working tree; batch everything
  ready in one push when the owner says go (never commit/deploy without
  the owner saying so in that moment).

**Batch 22 done in working tree (Nov 16) - committed to staging Nov 18 per owner go-ahead.**
- 24 new Shelton-level Georgia cities researched end-to-end and added
  (375 of 710 structured). **Georgia is now 100% complete (29/29).**
- States fully done: NY, PA, OH, TX, VA, GA, WI (+ AK, HI, DE).
- Batch 22 cities: Mountains Helen (Anna Ruby Falls 90-day group rule,
  tubing outpost parking), Ellijay (apple capital, Carters Lake corps,
  wilderness winter gates), Mineral Bluff (1887 depot, Blue Ridge railway
  group slots), Young Harris (Brasstown Bald $10 includes shuttle+parking,
  fairgrounds correctly at Hiawassee - not Ellijay); North metro Cumming
  (fair 175-210k visitors, Amicalola buses 30+ pay $100/day - a real
  coach fact, West Milford Farm one-wedding-a-day), Dawsonville (falls 729
  ft, racing hall rates, outlet coach rows), Gainesville (poultry capital
  by 1948 proclamation, Olympic rowing park, islands resort cashless gate
  - address correctly Buford side), Dalton (carpet capital, freight depot
  free rows + Pullman car, Prater's Mill; "Dalton's Crest" corrected to
  Crown Gardens), Calhoun (New Echota Thu-Sat only hours, Resaca free
  trails, Roland Hayes museum); I-75 Atlanta (GWCC marshaling-yard coach
  codes - WOCCBUS/zooatlbus - printed in tips, zoo off-site parking,
  CFBHOF group rate 15), Fayetteville (Trilith lot NOT tourable - stated,
  town-side routing, Starr's Mill roadside-stop framing), Milledgeville
  (mansion $10/group-rate 10+, buses park curbside on Clarke St,
  Andalusia rules, secession convention), Macon (Ocmulgee free park,
  Tubman group tours drivers free, Hay House rules), Forsyth (High Falls
  $10 pass + winter drawdown, Whistle Stop cafe street-parking only);
  South Thomasville (Rose City 2016 designation, Pebble Hill 8-person
  tour caps, TLH airport), Tifton (museum village Wed-Sat + August
  closure, ABAC), Douglas (1905 depot museum volunteer hours, war
  airfield heritage), Norman Park (honest thin village; Three Oaks
  estate venue, Reed Bingham shelters); Coastal Darien (fort blockhouse
  is a 1988 rebuild - stated honestly, Sapelo ferry pre-registration
  rules, shrimp-capital docks), Claxton (fruitcake capital - factory
  tours ended, storefront viewing only; PFA lake hall venue), Fort
  Stewart (3rd ID museum INSIDE the gate - 60-day pass pre-registration
  flagged, Midway tour-only, Fort Morris), Alamo (honest thin; Little
  Ocmulgee lodge beach, park golf course, Hamburg mill; Big Hammock WMA
  excluded as 70+ miles away), Barnesville (buggy capital 20k/yr peak,
  Indian Springs "among the nation's oldest" phrasing, no Rose Theater -
  real Ritz/Gem/Gordon names used); Cedartown (researched directly -
  Big Spring 4M gal/day, Trail of Tears certified camp, Silver Comet
  depot trailhead).
- Verification: tsc 0 errors, build 0 errors, 0 console errors across all
  affected states; all 24 GA pages 802-929 unique words; similarity gate
  PASS 0.198 (forsyth~alamo and ga-wide margin pass applied).
- Fix scripts kept: scripts/fix-ga-margin.mjs (22 entries enriched).
- Remaining: 335 of 710. Next by demand order: NC (27), WA (20),
  MI rest (9), NH (13), MA (14), CA (16), IN (17), CT (12), MN (13),
  then the rest by demand (WA/VA/NC are the biggest states left).
- Owner flow: all remaining batches build in working tree; batch everything
  ready in one push when the owner says go (per Nov 16 reminder: never
  commit/deploy without the owner saying so in that moment).

**Batch 21 done in working tree (Nov 13) - committed to staging Nov 18 per owner go-ahead.**
- 23 new Shelton-level Virginia cities researched end-to-end and added
  (351 of 710 structured). **Virginia is now 100% complete (27/27).**
- States fully done: NY, PA, OH, TX, VA, WI (+ AK, HI, DE).
- Batch 21 cities: Shenandoah Harrisonburg (JMU 22,879, Luray Caverns group
  rates, Skyline tunnel limits), Elkton (Swift Run Gap, Miller-Kite house,
  1908 incorporation - NOT 1938), Penn Laird (caverns are at Quicksburg -
  corrected; Grand Caverns "oldest operating show cave"), Swoope (Polyface
  Farm tours, birding flats); Northern/central Winchester (Loudoun mall,
  Patsy Cline house 10+ scheduling, MSV gardens), Stanardsville (county
  out of Orange 1838, park door + Montpelier estate rules), Orange
  (courthouse is the FOURTH 1859 one, not 1734; Montpelier lot rules,
  Barboursville ruins), Nellysford (Nelson 151 trail, Wintergreen venue
  rules); Tidewater Norfolk (base bus tours CLOSED 9/9/26 - harbor cruise
  routes to the fleet instead; Nauticus group rates, zoo free bus rows,
  free Chrysler), Williamsburg (official coach facts: CW visitor-center
  bus parking $25 via Route 60, Busch Gardens free England lot + driver
  rides free, Jamestown group rates 1:10 chaperones, parkway permit/height
  rules), Cape Charles (CBBT bus tolls $40 each way / school buses $1,
  oversized approval needed; refuge weekend hours - NO current ferry),
  Chesterfield (Henricus booking, Pocahontas "largest VA state park" ~8k
  acres, Dutch Gap free); Southside Danville (Caesars opened Dec 2024 -
  corrected from 2023; River District free parking; GSO is the gateway -
  DAN has no airlines), South Hill (Kerr Lake + Lake Gaston equidistant;
  cantaloupe festival belongs to Halifax - excluded), Petersburg (NB free
  entry, Crater, VSU correctly placed in Ettrick), Hopewell (City Point
  free unit, 1928 Beacon theatre), Colonial Heights (Southpark, Violet
  Bank - Lafayette); West/rural Jonesville (Cumberland Gap Middlesboro
  center, Daniel Boone station, blockhouse replica 45-50 mi), Hot Springs
  (Warm Springs Pools reopened 2022 - not "Jefferson Pools"; Ingalls Field
  is GA-only), King George (Dahlgren secure - no tours, Caledon eagles),
  Powhatan (river park, Maidens launch), Stafford (Ferry Farm verified in
  the county, Government Island quarry, Crow's Nest has NO public access
  - not promised); Moneta (SML park park-by-fee table: buses $35 - a real
  coach fact; dam center seasonal hours; Hickory Hill Vineyards excluded
  as unverified).
- Verification: tsc 0 errors, build 0 errors, 0 console errors across all
  affected states; all 23 VA pages 806-968 unique words; similarity gate PASS.
  Fix scripts kept: fix-va-pair.mjs, fix-va-pair-2.mjs, fix-va-big-city-pair.mjs
  (elkton/stanardsville differentiated; VA margin pass enriched ~19 short pages).
- Process catch: batch21.mjs initially shipped without its writer footer
  (adding the footer is now checked at copy time); pages briefly built as
  generic fallbacks until caught in render checking - fixed and re-verified.
- Remaining: 359 of 710. Next by demand order: GA (24), NC (27), WA (20),
  MI rest (9), NH (13), MA (14), CA (16), IN (17), CT (12), MN (13), then
  the rest by demand.
- Owner flow: all remaining batches build in working tree; batch everything
  ready in one push when the owner says go.

**Batch 20 done in working tree (Nov 13) - committed to staging Nov 18 per owner go-ahead.**
- 25 new Shelton-level Texas cities researched end-to-end and added
  (328 of 710 structured). **Texas is now 100% complete (30/30).**
- Five states fully done: NY, PA, OH, TX, WI (+ AK, HI, DE).
- Batch 20 cities: Hill Country Fredericksburg (Pacific War museum, Enchanted
  Rock, 290 Wine Road), Marble Falls (Longhorn Cavern, Highland Lakes,
  Blue Bonnet Cafe), Spicewood (Krause Springs, Pedernales Falls, vineyards),
  Driftwood (Salt Lick grounds, estate winery, Camp Ben McCulloch); Central/
  East Brenham (Blue Bell self-guided center, Washington-on-the-Brazos,
  antiques row), Manor (COTA, Grand Lady), Giddings (Tejas camp, Lake
  Somerville, Wendish museum), Gatesville (Spur Capital museum, Mother Neff);
  Gulf Rockport (crane refuge, Goose Island, beach park), Mont Belvieu (NGL
  hub, free ship-channel boat tour, San Jacinto), Katy (Heritage Park,
  Typhoon Texas, Peckham park), Cypress (Premium Outlets, Towne Lake
  boardwalk, Sam Houston Race Park); South Cotulla (1928 LBJ school site,
  brush-country ranch legs), Kenedy (WWII camp marker, Goliad mission,
  Helena museum), Harlingen (Iwo Jima monument, Gladys Porter Zoo, HRL),
  Mercedes (Premium Outlets, Bentsen birding HQ); West Alpine (Big Bend,
  McDonald Observatory, murals), Marfa (Chinati tours, lights viewing,
  Prada Marfa), Midland (Petroleum Museum, Bush family home, Wagner Noel),
  Plainview (Jimmy Dean museum, Wayland, Lubbock legs); Pineywoods Glen Rose
  (dino tracks, Fossil Rim), Buchanan Dam (1937 dam, Inks Lake, eagle deck,
  river cruises), Groveton (Davy Crockett forest, Lake Livingston hall),
  Spurger (Big Thicket units - village itself honestly thin), Nacogdoches
  (oldest town, Millard's Crossing, SFA gardens).
- Research corrections honored: Blue Bell is a SELF-GUIDED experience (never
  "factory tours"; production tours ended 2015); Manor's grain silos not an
  attraction (leaned COTA); Gatesville's courthouse architect dropped
  (sources conflict) and Fort Cavazos correctly placed across the county
  line; Hotel Paisano under renovation (not sold as venue); "Big Bend
  Regional" is a hospital not an airport; NPS runs no park transit - the
  charter IS the shuttle (stated on Alpine page); Jimmy Dean born at Seth
  Ward but raised in Plainview (phrased "grew up here"); Emma Long is an
  Austin park (excluded from Spicewood); Fall Creek Vineyards has no Marble
  Falls tasting room; Fossil Rim drive-through caps 26-ft hard-tops so
  coaches book guided tours; SFA enrollment stated ~10,500 per fall 2024;
  Spurger page leans on the thicket units - no invented village attractions;
  progresso border destination considered and NOT used (unverified).
- Similarity work: Wharton (short existing page) enriched fully (faqs added,
  premium block added - now fully Shelton-level); Granbury, Cypress,
  Groveton, Nacogdoches, Harlingen, Mercedes, Midland margin passes; Valley
  pair differentiated (Harlingen leans monument/zoo, Mercedes leans
  outlets/birding). **Final: worst new-involving Jaccard 0.198 < 0.20 PASS;
  all 25 TX pages 804-910 unique words; 0 console errors; tsc + build 0 errors.**
- Fix scripts kept: scripts/fix-tx-wharton.mjs, fix-pineywoods-pair.mjs,
  fix-valley-pair.mjs, fix-mercedes-pair.mjs (batch20.mjs holds the 25 entries).
- Remaining: 382 of 710. Next by demand order: VA (23), GA (24), NC (27),
  WA (20), MI rest (9), NH (13), MA (14), CA (16), IN (17), CT (12),
  MN (13), then the rest by demand.
- Owner flow: all remaining batches build in working tree; batch everything
  ready in one push when the owner says go.

**Batch 19 done in working tree (Nov 13) - committed to staging Nov 18 per owner go-ahead.**
- 18 new Shelton-level Pennsylvania cities researched end-to-end and added
  (303 of 710 structured). **Pennsylvania is now 100% complete (36/36).**
- Batch 19 cities: Denver (Ephrata Cloister,
  Middle Creek, Rock Lititz), East Greenville (Grand Theater, Green Lane,
  Perkiomen Trail), West Grove (Longwood Gardens bus lot, Mushroom Festival,
  vineyard weddings), Monaca (CCBC, banquet row, PIT), Beaver (Fort McIntosh,
  courthouse, Beaver Station), North East (grape belt wineries, Presque Isle,
  Freeport Beach), Mt. Carmel (mine tour, Knoebels, Yuengling), Broomall
  (Massey House, Independence Mall, PHL), Hatboro (1755 Union Library, Crooked
  Billet, Willow Grove), Royersford (foundry history, Valley Forge lot rules,
  Colonial Theatre), Middletown (MDT in town, M&H Milk & Honey Express,
  Hersheypark free bus parking), East Stroudsburg (ESU, Shawnee Mountain,
  Pocono Raceway), Peach Bottom (slate heritage, Lock 12, Conowingo eagles),
  Summerdale (Summerdale 1909, USAHEC free, Giant Center), Ulster (French
  Azilum, Tioga Point, Sayre station), Hawley (boat tour dike, Silk Mill,
  Lacawac), Lake Ariel (private lake flagged honestly; Lacawac, Promised
  Land), Moscow (1904 DL&W station, Steamtown excursions, trolley museum).
- Research corrections honored: Hatboro's Union Library founded 1755 (not
  1789); "Mill-Boro Park" is not real (Hatboro Memorial Park used); Willow
  Grove was a Naval Air Station, not an "aircraft plant"; PIAA HQ is
  Mechanicsburg, not Middletown; M&H train is the reservation-only Milk &
  Honey Express (reach past Indian Echo Caverns ended by 2011 flood; steam
  engine No. 91 currently out of service - runs diesel); "City of the Dead"
  nickname NOT published; Centralia excluded (Graffiti Highway buried 2020);
  "PMZ airport" near Marshalls Creek does not exist (ABE is the gateway;
  Stroudsburg-Pocono airport closed 2022); Lake Ariel lake is private
  (Grodack v. Ariel Land Owners 2019) - stated plainly on the page;
  Spinnler Point is a private colony (excluded); Mohegan Sun Arena renamed
  "Mohegan Arena" 2024; Conowingo Dam is in Maryland (said so).
- Similarity work: three pairs were differentiated during verification
  (monaca~beaver, broomall~royersford, butler~monaca - Monaca's 2nd
  destination swapped from Moraine to the Bridgewater/Rochester riverfronts)
  and a margin pass added ~100 verified-fact words to 21 pages under ~860
  unique 5-grams (scaffold floor: any two ~810-word pages pair at ~0.205).
  **Final: worst new-involving Jaccard 0.198 < 0.20 PASS; all 31 batch-18/19
  pages at 845-1000 unique words; 0 console errors; tsc + build 0 errors.**
- batch19.mjs stays synced as the reproducible source (script + fix scripts
  scripts/fix-beaver-county-pair.mjs, fix-broomall-royersford-pair.mjs,
  fix-monaca-moraine.mjs, fix-beaver-moscow-pair.mjs, fix-margin-pass.mjs).
- Remaining: 407 of 710. States done: NY, PA, OH, WI, AK, HI, DE. Next by
  demand order: TX (25), VA (23), GA (24), NC (27), WA (20), MI rest (9),
  NH (13), MA (14), CA (16), IN (17), CT (12), MN (13), then the rest.
- Owner flow: all remaining batches build in working tree; batch everything
  ready in one push when the owner says go.

**Batch 18 done in working tree (Nov 13) - committed to staging Nov 18 per owner go-ahead.**
- 13 new Shelton-level city pages researched end-to-end and added (285 of 710
  structured; the data file now matches the keep list exactly - see cleanup).
- Batch 18 cities - Wisconsin finished (4): Rice Lake (Tuscobia trail junction,
  Christie Mountain, MSP), Sheboygan Falls (two historic districts, Kohler-Andrae,
  Wade House, Whistling Straits, MKE), South Wayne (Cheese Country Trail,
  Yellowstone Lake park, Cadiz Springs), St Germain (Snowmobile Hall of Fame,
  Heart of Vilas trail, RHI airport).
- Pennsylvania started (6 of 24): Allentown (PPL Center, IronPigs ballpark,
  America On Wheels, ABE), Williamsport (Lamade Stadium LLWS parking facts,
  Hiawatha riverboat, IPT), Lewisburg (Bucknell/Weis Center, Mifflinburg Buggy
  Museum, MDT), Stroudsburg (Delaware Water Gap NRA, Sherman Theater, Mount
  Airy, NYC route), Ronks (Strasburg Rail Road, Sight & Sound, Kitchen Kettle
  Village, PHL), Butler (Moraine State Park, Butler Farm Show, Pullman Park, PIT).
- Ohio finished (3): Madison (Grand River Valley / Debonne coach packages,
  Headlands Beach, Standing Rock Farms, CLE), Middlefield (cheese co-op,
  Monday Heritage Marketplace, Swine Creek Lodge), Ottawa (1913 courthouse,
  Putnam County Fair, Fort Fest, Kalida Pioneer Days, DTW).
- Researched facts only; agents flagged and we dropped several wrong claims
  (Old Woman Creek is in Huron not Madison; D&L Airgun is a BC company not
  Middlefield; "world's oldest cheese co-op" unverified - used "founded 1956,
  farmer-owned"; Butler's "Marburger Farm Show"/"Preston Opera Block" not real -
  used Butler Farm Show; Pullman Park is school-district managed since 2025 -
  not called a BlueSox park; Lewisburg Hotel operating status uncertain - not
  featured as open; St Germain Brewing permanently closed - not featured).
- Cleanups in the same pass: removed 7 stale data entries that can never
  publish (not in the keep list => 410): mi/port-huron, oh/middlefield-oh,
  oh/ottawa-oh, pa/allentown-ohio, pa/ohiopyle-2, pa/ohiopyle-3, pa/jim-thorpe.
  Structured count now matches the keep list exactly (285).
- Verification: tsc 0 errors; next build 0 errors (all pages prerendered);
  all 13 new pages render with 0 console errors and unique word counts
  804-918 (rice-lake 891, sheboygan-falls 918, south-wayne 849, saint-germain
  877, allentown 828, williamsport 853, lewisburg 818, stroudsburg 852,
  ronks 825, butler 830, madison 845, middlefield 804, ottawa 828).
- **Similarity gate PASS**: worst new-involving same-state Jaccard 0.198
  (beachwood~madison OH) < 0.20 over all 100 structured WI/OH/PA pages.
- **Similarity differentiation pass (same run)**: 15 pre-existing short pages
  (under ~780 unique 5-grams) were enriched in this batch's clean-up - they
  crossed the 0.20 line against newly added pages - Amherst, Reedsburg,
  Danbury, Sidney, Carroll, Huron, Meadville, Lewis Center, Bradford,
  Selinsgrove, Gibsonia, Vermilion, Oxford, Necedah, Honesdale. Copy was
  appended only from facts already held in each entry (no new claims).
  Amherst/Reedsburg/Danbury/Sidney also gained explicit premium route cards
  (now fully Shelton-level). Whole-state worst existing-only pair improved
  0.276 -> 0.212 (mukwonago~pewaukee WI).
- **Operator note for the next batches:** the sitewide page scaffold shares
  ~250 5-grams on every city page, so any city page under ~780 unique
  5-grams will pair near/over the 0.20 gate - keep new pages at 800+
  unique words (current floor) and expect to deepen a few short sibling
  pages per batch (checker: scripts/check-batch18.mjs, extend per state).
- **Title bug fixed sitewide (found by Batch 18 spot-check):** the root
  layout template ("%s | Cascade Charter Bus") was doubling the brand on
  every structured city page and the About page (e.g. "…| Cascade Charter
  Bus | Cascade Charter Bus"). City metadata now sets absolute titles,
  pageMeta treats any title containing the brand as absolute, and the root
  layout's default title/description no longer carry the banned word
  "Nationwide" (default title now "Group Charter Bus Rental | Cascade
  Charter Bus"). Verified: 0 pages in the build carry the doubled brand;
  About now reads "About Cascade Charter Bus". NOTE: the footer's
  "Nationwide group transportation…" blurb is UNTOUCHED (pending owner
  decision from Nov 12).
- Remaining: 425 of 710 (WI done, OH done; PA 18 left). Next batches by
  demand order: PA rest, TX (25), VA (23), GA (24), NC (27), WA (20),
  MI rest (9), then NH (13), MA (14), CA (16), and the rest by inquiry demand.
- Owner flow: all remaining batches build in working tree; batch everything
  ready in one push when the owner says go.

**Batches 11-13 done in working tree (Nov 13) - committed to staging Nov 18 per owner go-ahead.**
- Batch 11: 13 WI cities + oxford WI slug fix + Necedah/Elk Mound/Land O' Lakes
  completion entries (210 total).
- Batch 12: 16 MI cities: Flint, Novi, Clarkston, Garden City, Adrian, Temperance,
  Cadillac, East Lansing, Glen Arbor (Sleeping Bear), Petoskey, Ludington, Onekama,
  Sault Sainte Marie (Soo Locks), Brimley, Ironwood, Port Austin (Turnip Rock).
  Brimley data normalized, Garden City duplicates removed (228).
- Batch 13: 11 OH cities: Beachwood, Logan (Hocking Hills), Port Clinton
  (Put-in-Bay ferries), Wapakoneta (Armstrong museum), Akron (Stan Hywet),
  Bellaire (Great Stone Viaduct), Cadiz (Clark Gable museum), Chillicothe
  (Tecumseh! drama), Columbus (Scioto Mile/zoo), Newark (UNESCO Earthworks),
  Vermilion (Main Street Beach). Accidental dupes removed (239 total).
- Component fixes shipped in-tree: plainText nearby lists handled (Rehoboth
  Beach DE), auto retrofit stays live.
- Remaining: 471 cities in other states. Next batches by demand order: WI rest.
- Owner flow: all remaining batches build in working tree; batch everything ready
  in one push when the owner says go.

**Batch 10 done: 15 more NY cities (194 of 710 structured, whole state of New York complete).**
- New York remaining cities researched: Olean, Penn Yan, Port Jefferson Station,
  Port Jervis, Poughkeepsie, Quogue, Roxbury, Rye, Saugerties, Schroon Lake,
  Wainscott, West Point, Woodbourne, Plattsburgh, Clymer. NY = 100% structured!
- Route cards: City -> famous anchor (Rock City, Crispin Hill, Walkway Over
  the Hudson, Playland, Peek'n Peak, Bethel Woods...). Booking block now
  carries the city name (which also cut shared shingles on every page).
- Similarity differentiation fixes: Hamptons pair, Penn Yan, Woodbourne,
  Interlaken, Wainscott, Roxbury. Worst NY Jaccard 0.190 < 0.20 PASS over
  41 structured NY cities; word counts 806-992 unique; 0 console errors.
- Remaining: 516 pages in other states. Next batches by demand order.
- Owner flow continues: "keep going" per batch.

**Retrofit DONE (Nov 13): all 179 structured city pages now render full Shelton-level premium.**
- PremiumCityPage auto-derives the Shelton extras from data each structured
  page already holds: hero lead = opening of the approved intro (remainder
  shown in the intro section, no duplication), facts strip from the routing
  distance + site-true facts, route cards chained (explicit ~ famous place ~
  structured destination ~ airport).
- Explicit premium data still wins (Shelton, Batch 8/9 pages unaffected).
- Verified: Oxford + Park City (retrofit) both show lead/facts/route with 0
  duplication and 0 console errors; NY similarity gate 0.198 PASS.
- **Numbers: 179 of 710 fully Shelton-level (with routes/cards); remaining
  531 reach full level when their research batch lands (design frame already
  live on all 710).** Tag pills stay explicit-only for now.
- Next: research batches continue (~10-16 per pass; next up: rest of NY, then
  demand-ordered states).

**Batch 9 done: 16 more NY cities researched (179 of 710 structured). Same-state gate PASS.**

## Routing cards live on every researched city page (Nov 12) + Batch 8 pushed (10 NY cities, 163/710 structured).**
- RouteDiagram generalized: every city with data gets the "City -> Destination" bus routing
  card. Chain: explicit premium.route > researched famous place/venue > top structured
  destination > researched airport. Shelton's card now data-driven (NYC, 65 mi, Route 8 + I-95,
  Merritt ban line). Park City routes to Historic Main Street, Oneonta to the Baseball Hall of
  Fame, Oxford to the Grove, etc. Generic cities without research get one when research lands.
- **Batch 8 done (10 NY cities researched end-to-end)**: Auburn, Larchmont, Lowville, Mayfield,
  Oneonta, Rock Tavern, Warwick, Windham, Boonville, Central Valley. Each: researched
  places/venues/airports (SYR, HPN, ALB, SWF, with miles/times), 3 city-specific services,
  3-4 destinations with tips, 4 FAQs, source links, route cards with verified miles/times.
- Gates: same-state Jaccard worst 0.196 (< 0.20 PASS), word counts 866-986, 0 banned words,
  0 console errors, build 802 pages 0 errors.
- Remaining: ~547 pages (0 Medium + ~534 Standard + 12 Traffic), next cities in demand order:
  Auburn done; continue with more NY Standard cities (Oneonta done; next: Cobleskill, Cornwallville,
  Eldred, Elka Park, Ellicottville, Endicott, Fallsburg, Geneva, Hunter, Interlaken, Lawrence,
  Medina, Middle Village...) then other states in demand order. Batches of ~10.
**Premium design rolled out to EVERY city page (Nov 12, owner request "start building").**
- Route dispatch: structured cities (131, data/city-pages.json) → PremiumCityPage
  (Shelton frame; premium extras appear as data provides); all other kept cities
  → NEW GenericPremiumCity: premium frame from real held data (county, pickup
  venues from real inquiries, researched places/airports/wineries, hero quote
  form GETting /contact/ with pre-fill, facts strip with site facts, wedding
  section, destinations, airport transfers, map, 5 vehicles, nearby kept
  cities, dark booking + checklist, amber CTA).
- City pages now always show the 5 standard vehicles (minibus, charter, school,
  sprinter + sleeper) even when data lists fewer — missing ones get true
  generic reasons from fleet data. Fixed a data typo (Trevor WI: "city" →
  "name" on a destination) + added a render guard for malformed entries.
- All SEO kept: self-canonicals, titles/descriptions, Service+Breadcrumb schema,
  breadcrumbs strip. FAQ blocks render where structured data provides them
  (structured cities); generic cities have no FAQ until researched (no
  invented FAQs).
- NOTE: the ~580 non-researched generic pages still share scaffold copy apart
  from intro/venues — they remain publishable only as research fills their
  profiles (city-content/city-pages), same as before; this rollout upgraded
  the DESIGN without weakening the content rules.
- Verified: tsc/eslint clean, build 802 pages 0 errors; Shelton, Park City
  (structured), Trevor (fixed data), Opp AL (generic) all render the premium
  frame with 5 vehicles, 0 console errors.
- Next: research batches continue filling city-pages.json per city — each
  researched city then also gains hero lead, facts strip, route copy, service
  tags and FAQs automatically.

**4 new service pages built and pushed to staging (Nov 12, commit 4e28398, owner-approved).**
/services/winery-tour-bus-rental/ · /services/military-group-transportation/ ·
/services/government-transportation/ · /services/casino-bus-trips/ — same template as the
existing services (data-driven), auto-wired into header dropdown, footer, services hub,
homepage tiles, sitemap-services.xml. Spec held: no prices/rates/years/ratings/banned words
(verified programmatically), FAQPage schema matches visible FAQs word-for-word, Service +
Breadcrumb schema, self-canonicals, "Last updated: November 2026" in hero, real-example boxes
only where real (casino review verbatim; military trip pending-owner confirmed Nov 12 example).
Owner confirmations applied: 10% military discount (H2 + FAQ), W-9 + operator COI paperwork.
Contextual links: sightseeing/wedding→winery, corporate→government, airport→military,
church→casino+military; each new page links 2 related services. City pages untouched.
TODOs left: agency invoicing FAQ not added (invoicing terms not confirmed).

## Shelton page human-voice rewrite pushed (Nov 12, after homepage rework)
- Rewrote the page copy so it reads like a dispatcher wrote it, not a template:
  killed the repeated "we plan the route a bus is allowed to drive" line (now
  appears exactly once), varied sentence rhythm across sections, contractions
  ("it's", "you'll..."), varied tip openers (not every card opens "The ..."),
  fixed British "centre" → "center", tightened service paragraphs and tips.
- Facts unchanged: 65 mi/~2 hrs, Merritt ban, Route 8+I-95, farm since 1848,
  Route 110, Courtyard Shelton, Hubbell Waterview Dr, Metro-North stations,
  48-h accessibility notice. Route intro paragraphs moved from the component
  into data (premium.routingIntro) so future premium cities are data-driven.
- Verified: JSON/tsc/eslint clean, build 798 pages 0 errors, renders with 0
  console errors; promise line now appears once; no "nationwide"/"centre".

## Homepage rework live on staging (Nov 12). Owner requests applied to /:
- Our Heritage compacted (2 short paragraphs, smaller type, tighter paddings).
- NEW fleet showcase after Heritage: all 7 vehicles with photos + capacity badges
  (same data source lib/fleet-data.ts), linking to fleet pages.
- Tailored Transportation replaced with 8 compact service tiles (owner photo +
  VIEW DETAILS, rounded cards) + a slim dark "Plan Your Custom Journey Today"
  CTA banner. Decision made: tiles beat the old journeys list (photos, direct
  links, less space); journeys content still covered by the service pages.
- "Serving Every Major City & Region" section REMOVED; the word "nationwide"
  removed from the home page (hero badge, hero copy, heritage, title, meta
  description). NOTE: the site-wide footer blurb still says "Nationwide group
  transportation…" — owner to confirm if that should change too.
- NEW "Plan Your Charter — Four Ways to Book a Charter Bus": One-Way Transfer,
  Round Trip, Shuttle Loop, Multi-Day Charter (icon tiles with details + best-for).
- Verified: tsc/eslint clean, build 798 pages 0 errors, sections + photos render
  desktop + mobile, 0 console errors, no "nationwide" text left on the home page.
- Commits today: 950a219 (photos), 1648276 (wedding card), f69f6f0 (footer
  underlines), 7ebb4cd (hero grid lines), + this homepage rework.

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
  each with researched places/venues/airports/tips, unique H1/title/meta, schema, reviewChecks + sources kept for owner approval.
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

## Admin history log + staging deploy (Nov 23)

- New admin page: Admin → "History log" (sidebar item added). Every admin save
  now appends a record to data/admin/history.json via logHistory() in
  lib/admin/store.ts: meta tags, meta removal, location meta, FAQs & hub copy,
  page content editor, on-page pencil edits, blog post saves/deletes, redirect
  add/remove/CSV import, schema & tracking saves. Newest first, capped at 500
  entries, write is wrapped so history can never break a save.
- Verified live on localhost:3210: on-page PATCH → entry appears on
  /admin/history ("On-page edit · / · histtest = …"); test field cleared and
  history reset after the test; home fields intact (11).
- tsc clean, next build clean (798 pages).
- Deployed: committed to main locally and pushed to origin/staging (Vercel
  branch build → staging URL). Production (main/push) NOT touched.
- Note: on localhost the "publish without deploying" flow is fully live
  (revalidatePath). On the hosted staging the file-backed store is still
  ephemeral (Vercel read-only/lambda storage) — a hosted admin save does not
  persist until the store is moved to Blob/DB (pending decision).

## Admin password changed + contact map fix (Nov 23)

- New owner-chosen admin password deployed: .env.local (localhost, escaped
  `$$` so dotenv-expansion keeps both dollars) and Vercel ADMIN_PASSWORD env
  (Preview + Production). Old password and its sessions are dead. The value
  is never committed (.env.local gitignored).
- .env gotcha recorded: plain `cascade$$7890` in .env.local resolves to
  `cascade` (dotenv-expand collapses `$$`); it must be written with a
  backslash per dollar: `cascade\$\$7890` -> literal `cascade$$7890`.
  Vercel env values are stored literally (no expansion), so the CLI value
  is typed as-is.
- Contact map glitch fixed (commit e2c1a8a, pushed to staging): the dashed
  "signal" line used to render UNDER the state fills and only peeked through
  thin gaps on hover (looked broken). It now draws on top of the states;
  tap circles still handle clicks. Also memoized the 51 polygon-area
  computations at module load so hover no longer recomputes them (stutter
  fix). Verified in a real browser via Playwright: hover shows the clean
  NY -> state dash line + state name, zero console errors, zero layout shift.

## Map hover stability pass (Nov 23, commit 5aaaa64)

- Owner still saw glitching sweeping the cursor bottom-to-top. Cause: every
  pointerenter re-rendered the whole map (51 paths + 51 tap circles + 50 pins
  repainted; pin opacities flipped as attributes) and leaving the map snapped
  the signal line back to NY.
- Fix: StatesLayer / TapLayer / PinLayer are memoized components whose props
  never change on hover, so a hover only moves the line coordinates, the
  state-name tag and the one hot pin (CSS class .us-map-pin-hot + 0.2s
  opacity fade). Line and tag always mounted, moved in place. No snap-back
  on exit (last connection kept).
- Verified in-browser: fast zig-zag sweep triggered 12 state transitions with
  zero console errors, zero layout shift, no snap-back; tsc + build clean.
  Pushed to staging (Vercel check pending at time of note).

## Admin password corrected (Nov 23/24)

- The Vercel ADMIN_PASSWORD had been stored with literal backslashes
  (`cascade\$\$7890`) because the shell printf leaked them in — owners typed
  the right password and got rejected. Replaced the value in place
  (`vercel env update`, byte-verified: exactly `cascade$$7890`, 13 chars) and
  redeployed staging (`vercel redeploy`).
- Verified end-to-end in a real browser on BOTH hosts: typing the password
  into the actual /admin/login form logs in and shows the dashboard + History
  sidebar; a wrong password still shows the error. Staging alias
  cascade-website-git-staging-umer-5179.vercel.app confirmed on the fresh
  deployment.
- Lesson for future env changes: values with $ go in via node stdout
  (fromCharCode), never shell printf/echo; secrets are unreadable later, so
  verify by behavior (real-form login test), not by listing.

## ADMIN PANEL UPGRADE — Phase 1 complete (Nov 24)

Spec: ADMIN_PANEL_INSTRUCTIONS.md. Phase 0 audit: docs/phase-0-report.md.

1. Storage layer (root-cause fix for "admin saves don't work on hosting"):
   lib/admin/store.ts now writes through to Vercel Blob when
   BLOB_READ_WRITE_TOKEN exists (secret-HMAC-prefixed paths, seed-on-first-
   touch, local mirror always kept). Without the token everything works as a
   local file store (zero behaviour change). Uploads route: Blob when
   configured, public/uploads otherwise.
   OWNER ACTION: add BLOB_READ_WRITE_TOKEN (Vercel dashboard / Blob store)
   to make admin saves durable on staging + production.
2. All Pages 200-limit FIXED: server-side pagination 25/50/100/page with
   Prev/Next + totals; search/type filters still run across ALL pages
   (searches deep tail cities like /locations/ny/clymer/ verified). Page 9
   beyond-last clamps to the last page. 789 pages counted.
3. Quote Inquiries module (NEW): quote API saves the lead FIRST (with page
   URL, referrer, UTM, honeypot, rate limit, validation), then emails;
   email failure is marked on the lead, never losing it. Admin: LEADS module
   /admin/inquiries (filters status/date/search, bold-until-opened rows, red
   sidebar badge with unread count, 25-50-100 pagination, CSV export filtered
   or all) + detail page /admin/inquiries/[id]: call/email buttons, status
   pipeline New->Contacted->Quote sent->Won/Lost/Spam, assign-to, timestamped
   internal notes, opened-at tracking, IP shown as muted spam reference only.
   Middleware fix: /api/quote stays public while the site is closed.
   Test lead rows were cleaned from leads.json + history after testing.
4. Localhost test results: 2 test quote submissions (visitor, no cookie) ->
   saved + listed immediately; PATCH status/notes verified; CSV header+rows
   verified; detail page 200; pagination verified. tsc 0 errors, build 0
   errors. NOT yet deployed — awaiting owner OK.

## ADMIN PANEL UPGRADE — Phase 2 complete (Nov 24)

1. Built-in posts MIGRATED: the code-seeded guide is now a standalone editable
   post ("seed:…") inside the durable store; the code copy is hidden. Exact
   URL/date/image kept — /blog/how-to-plan-a-group-charter-bus-trip/ = 200,
   sitemap still lists it. Import is idempotent (runs once per data file).
2. Blog list rebuilt (section 4.2): thumbnails, status chips
   (Published/Draft/Scheduled), author, categories, last-edited, search +
   status/category filters, 25/50/100 pagination, view-live link, and
   Duplicate-as-draft (action + redirect?saved/duplicated flags).
3. Editor additions (4.3): excerpt field, tags (free multi-tags),
   author picker + editable author bio (stored in blog.json authors),
   auto reading-time (server-computed when 0), and ALT-text REQUIRED to
   publish — enforced in the editor AND server-side (publish blocked with a
   clear message; drafts exempt). Scheduled posts stay hidden until date.
4. Categories (4.5): manage screen /admin/blog/categories (name/slug/desc/
   SEO title/meta desc), post counts, picker in the editor, delete requires a
   move target → posts reassigned + old /blog/category/{slug}/ 301ed.
5. Live site (4.4): /blog/category/{slug}/ pages (per-category SEO, list
   cards, revalidated on save/rename/delete), RSS at /blog/rss.xml (styled
   dual-format like sitemaps), post page: same-category RELATED posts first
   then latest, author bio box, "Updated" date. Cached category pages get
   revalidatePath on save.
Tests (checklist 4.6): ALT-less publish BLOCKED with clear message ✔;
3-image post published → on /blog + live 200 + author bio box shown ✔;
scheduled future post hidden from /blog ✔; slug change → auto 301 applied at
next build (308-permanent → new URL verified) ✔; category page renders the
post + seeded data ✔; RSS serves valid XML ✔; tsc + build clean. Test rows
cleaned after testing. NOT deployed — awaiting owner OK.

## ADMIN PANEL UPGRADE — Phases 3–7 complete (Nov 24)

Phase 3 (all content editable): Global Content facts page (header/footer/
contact/socials) with instant layout revalidation; per-page versions (last 10,
restore), Save Draft + Preview page (/admin/preview), Find & Replace across
all editable stores with history; editor gained Content/History tabs.
Phase 4 (redirects live): runtime redirect engine in proxy.ts (Next 16 node
runtime proxy; NEXT 16 deprecated middleware.ts — renamed). Rules with
type 301/302/307/410 + active/inactive apply in seconds, hits counted.
Removed-city 410s preserved. 404 monitor /admin/404s (hits, first/last seen,
ignore with escaping, create-redirect prefilled). Launch redirect map at
/admin/redirects/map (classify pasted old URLs: exists / 301+target / 410,
one-click apply). Redirect manager upgraded: summary cards, search/filters,
type select incl. 410, toggles, notes, CSV export/import (type column).
Phase 5 (SEO tools): meta bulk table with click-to-edit cells + problem
flags (missing/short/long/duplicate) + CSV export/import; sitemap & robots
page with robots.txt + llms.txt editors (live routes /robots.txt /llms.txt
read the store; public/llms.txt.bak is the seed); SEO health check with
issue counts + Fix links; media library with usage lookup + safe delete.
Phase 6 (control): users & roles (admin/seo-manager/writer/sales) stored
hashed (scrypt) in the store; login accepts email OR shared owner password;
5-fail 15-minute lockout; dashboard rebuilt with cards, recent inquiries,
recent changes + quick buttons; sidebar regrouped OVERVIEW/LEADS/CONTENT/
SEO/SETTINGS.
Phase 7 (finish): toasts on saved/deleted/added; global search page + topbar
box; sticky save bars (blogs/pages); ADMIN_GUIDE.md plain-English manual.
Test results: 19/19 admin pages 200 with the owner session; public spot
checks 200; llms+robots+sitemap-all 200; redirect engine live rule verified
(301 in seconds + inactive toggle + 410 rule); 404s logged (only true 404s;
removed cities 410 separate); tsc 0 / build 0 across all phases. NOT
deployed — awaiting owner OK.

## Deployed to staging (Nov 24, commits a19794e + e535809)

All phases live on staging. Fix commit e535809: proxy known-path set now
includes the sitemap files (/sitemap-all.xml was being 404-blocked by the
URL matcher; verified 793 URLs serve after redeploy). Staging checks: admin
login 200, sitemap index/all 200 (793 URLs), llms/robots 200, city 200,
removed city 410. Owner next step unchanged: add BLOB_READ_WRITE_TOKEN.

## URL Redirect Manager (/admin/redirect-management) — full spec build (Nov 24)

Per the owner's Redirect Manager spec (paste): sidebar "URL Redirect
Manager" under Content & SEO; old /admin/redirects 307s to the new URL.
Interactive client table (RedirectsClient): search with clear buttons,
type/status dropdowns with clear buttons, "X rules found", checkbox bulk
activate/deactivate/delete with confirms, sortable created/hits, pagination
(first/«/numbers/»/last + go-to-page + 20/50/100/page), URL truncation with
hover. Add/Edit popup with 4 type cards + Active/Inactive cards + 410-hides-
target + "Will go live immediately" footer. Delete confirm. created_at/
updated_at stored (legacy migration). CSV export with filters (fixed columns
incl hits/created_at); import popup with Download Template, drag-drop or
browse (CSV ≤5MB), server-side preview (new/update/skip + numbered errors),
skip-or-overwrite, batches of 500 (2000-row proof: 1000 imported + 1000
skipped, 0 errors, 14s). Hits-increment bug fixed (flush now increments the
real file value). Test proof at commit time: 301 live via API, 410 works,
inactive ignored, query strings passed, loop blocked, hits increment.
Staging push 102526a.
