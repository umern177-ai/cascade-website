# Cascade Charter Bus — Website Rebuild Brief (for Claude Code)

> **Who this is for:** the AI coding agent (Claude Code) that will build the new cascadecharterbus.com.
> **Version 6 — November 9, 2026.** Replaces Versions 4 and 5. Main changes:
> 1. **Same theme and same structure as the live site.** No new design. Only animations may be improved, and only where needed.
> 2. **Same stack as the live site** (Next.js), plus the admin dashboard the SEO team needs.
> 3. **710 city pages are kept** (656 enquiry pages + 54 traffic pages). **Puerto Rico is removed** — the site shows US states and DC only.
> 4. **State pages keep a button for every city, as now.** Cities with a page are at the top and open their page. All other cities stay as buttons below and open the booking form. They have no page.
> 5. The SEO consultant's **Technical SEO Roadmap** and **CMS Requirement Checklist** are built in (Sections 9, 19 and 20).
> 6. **Service and fleet pages are corrected** — a list of the wrong or conflicting facts found on the live pages is in Section 7.5b.
> 7. **Content is short, unique and written like a person** (Section 12).
> 8. **Real Trustpilot reviews** are shown on the site through Trustpilot's official widget (Section 7.12).
> 9. **"5+ years of service" everywhere** (owner, Nov 9). **Sleeper buses: 4 to 15 bunks, with restroom and shower.**
> 10. **FAQs on every page type** (Section 7.13).
> 11. **Everything is adjustable from the admin** — no text, number, menu, FAQ, city list or SEO setting is fixed in code (Section 19.10).
> 12. **Every row of the SEO consultant's Excel roadmap must be done** before launch (Section 20).
> 13. The owner supplied the **page code of six live pages**, including the booking form (`docs/live-reference/html/`). Use them to copy the theme exactly.
>
> **Files that come with this brief:** `CLAUDE.md` (project root), `docs/live-site-audit.md` (problems found on the live pages), `docs/live-reference/html/` (page code of the live home, locations hub, one city page, one service page, one fleet page and the booking form), and in `/data`:
> - `locations-keep.json` (v3) — the 48 state areas and 710 city pages to build, with enquiry counts, priority and local hints. Cities are already sorted in the order they must show on the state page.
> - `pages-to-keep.csv` — the same 710 pages as a spreadsheet.
> - `site.json` — the confirmed business facts (address, phone, GTM ID, Trustpilot link) in one place.
> - `all-cities.json` — **does not exist yet.** The agent builds it in Phase 1 by reading the live site (Section 7.7). It holds every city name shown on every live state page.

---

## 0. How to work on this project (read first)

1. Read this whole file before writing any code. Then write a short build plan in `PLAN.md` and **stop and wait for the owner to approve it.**
2. Work in phases (Section 14). At the end of every phase, stop, show what was built (run the dev server, list pages, share screenshots), and wait for approval.
3. **Never touch the live website, DNS, hosting settings, Google Search Console or any account** unless the owner explicitly says so in that moment. Build everything in a new repo / new branch and a preview deployment.
4. **Ask before anything that can't be undone** (deleting files outside the new project, pushing to `main`, deploying to production, changing redirects on the live domain).
5. If something in this brief is unclear or seems wrong, ask. Don't guess on brand facts, numbers, phone numbers, addresses or prices.
6. Never make up facts (trip counts, years in business, reviews, awards, driver numbers, prices). Use only facts in this file or facts the owner gives you. Section 15 lists the confirmed business facts.
7. **Copy the theme from the real page code.** `docs/live-reference/html/` holds the page code of six live pages (home, locations hub, a city page, a service page, a fleet page, the booking form): use their HTML structure, class names and styles. The full source code is not available, so these files and the live site are the reference.
8. **No errors.** Before showing any phase: lint, typecheck and build must pass with zero errors, no broken links, no console errors in the browser, and every page must open on phone and desktop.

---

## 1. Project summary

**Business:** Cascade Charter Bus — nationwide charter bus rental (motorcoaches, sleeper buses for band tours, minibuses, Sprinter vans, school buses, party buses, SUVs and sedans) with professional drivers and a 24/7 dispatch team.

**Why we're rebuilding:** The current site was hit by a Google update and enquiries dropped sharply. It has about **26,600 auto-generated city pages** (`/locations/{state}/{city}/`). Roughly 85–90% of the text on each is the same template with the city name swapped in, nothing local, a skipped heading order (H1 → H2 → H5), no structured data, no canonical tags, and fleet menu links pointing to the wrong anchors. Google's spam policies name this pattern as **doorway abuse** and **scaled content abuse**.

**The new plan:**
- **Keep the look.** Same theme, same page structure, same menus, same colors, logo and fonts as the live site. Visitors should not notice a redesign.
- **Keep only 710 city pages** — 656 where real customers asked for quotes and 56 that had real Google clicks before the drop. Every kept page gets **real, useful, local content** (Section 8).
- **Remove every other city page** (they return "410 Gone").
- **State pages still show every city** as a button, like now. Kept cities are at the top and open their page. Other cities open the booking form with the city already filled in (Section 7.7).
- Fix the technical SEO problems listed by the SEO consultant (Section 20).
- Add an admin dashboard so the SEO team can edit everything without a developer (Section 19).

**Goals (in priority order):**
1. Recover Google trust: no thin/duplicate pages, clean structure, correct technical SEO.
2. More quote requests: clear calls to action and the same booking form.
3. Fast and mobile-first: pass Core Web Vitals on mobile.
4. Same familiar brand look.

---

## 2. Non-negotiable rules

| # | Rule |
|---|------|
| R1 | **Keep URL paths the same** for every page that stays (trailing slash, lowercase, hyphens). Example: `/locations/ut/park-city/` stays exactly that. |
| R2 | **Same theme and structure as the live site** — same colors, logo, fonts, header, footer, menus, section order and page layouts (Sections 3, 4, 6). Do not redesign. Only animations may change, and only if needed (Section 4.3). |
| R3 | **Booking form stays the same** (Section 7.9). Same fields, same order, same options, same button text. |
| R4 | **Only the 710 cities in `locations-keep.json` get a page.** No other city page is built at launch. |
| R5 | **Every state page shows a button for every city, as now.** Kept cities first (open their page). All other cities below (open the booking form). Same method for every state (Section 7.7). |
| R6 | **No thin or swapped-name pages.** Every city page must pass the quality gate in Section 8.7 before it can be published. |
| R7 | **No AI-generated photos** of buses, drivers or customers. Use real photos (Section 3.5). Placeholder boxes are fine during development. |
| R8 | **Never publish private customer details** — no home addresses, no customer names. Business/venue names (hotels, schools, airports, wedding venues) are OK after checking they're real and spelled right. |
| R9 | **Mobile-first** and accessible (WCAG 2.2 AA). |
| R10 | **Every public page is pre-rendered** (all SEO content is in the first HTML, readable without JavaScript) and cached. It updates when content is published in the admin. Only the form endpoint and `/admin` are dynamic. |
| R11 | One H1 per page. Headings in order (H1 → H2 → H3). No skipped levels. Keep the same visual sizes as now — only the heading tags change. |
| R12 | Same phone, email and address everywhere (site, schema, footer, Google Business Profile): **12409 Linden Blvd, South Ozone Park, NY 11420** · +1 (646) 705-0816 · info@cascadecharterbus.com (Section 15). |
| R13 | **Reviews are real.** Trustpilot reviews are shown only through Trustpilot's own widget. Never type, copy, edit or invent reviews or star ratings (Section 7.12). |
| R14 | **FAQs on every page type**, unique to that page (Section 7.13). |
| R15 | **Everything is adjustable from the admin** (Section 19.10). |
| R16 | **Every row of the SEO consultant's roadmap is done before launch** (Section 20). |
| R17 | **US only:** the 50 states and DC. No Puerto Rico or other territories. |
| R18 | **One main address for the site: `https://cascadecharterbus.com`** (no www). The www and http versions 301-redirect to it. |

---

## 3. Brand and theme (taken from the live site)

### 3.1 Colors (keep these)

| Token | Hex | Where it's used now |
|---|---|---|
| `--brand-amber` (primary) | `#F5A002` | Main buttons (BOOK NOW, REQUEST A QUOTE, GET STARTED), highlights |
| `--brand-amber-light` | `#FFC107` | Accents, stars, small highlights |
| `--ink-950` (dark) | `#0F1115` | Footer background, button text on amber, dark sections |
| `--ink-900` | `#1E2126` | Secondary dark panels |
| `--slate-overlay` | `#0F172A` at 75–85% | Dark overlay on hero photo |
| `--text` | `#212529` | Body headings/text on light backgrounds |
| `--text-muted` | `rgba(33,37,41,0.75)` | Secondary text |
| `--line` | `#DEE2E6` | Borders, dividers |
| `--surface` | `#F8F9FA` | Light section backgrounds |
| `--white` | `#FFFFFF` | Page background |

Notes:
- These values were read from the live site on Nov 2. **In Phase 1, re-read the exact values from the live site's CSS** (colors, spacing, radius, shadows, font sizes) and save them in `docs/theme-tokens.md`. The live site is the source of truth for the look.
- The live site also shows Bootstrap's default blue (`#0D6EFD`) in a few places. That's a framework leftover, not a brand color — replace those with the brand colors.
- Amber on white fails contrast for small text. Use amber for buttons with dark text and for large elements, never for small text on white.

### 3.2 Typography
- **Inter**, as now (700 headings, 400 body). Do not add a second font.
- Load with `next/font` (self-hosted, `display: swap`). Do not use the old `@next/font` package. Keep the number of weights small (max 4).

### 3.3 Buttons and shapes
- Primary button: amber background `#F5A002`, dark text `#0F1115`, bold 700, letter-spacing 1px, fully rounded (pill).
- Secondary button: transparent with light border/text on dark backgrounds.
- Keep sizes, spacing and radius as on the live site.

### 3.4 Logo and icons (download from the live site into `/public/brand/`)
- Logo: `https://www.cascadecharterbus.com/logo.png` (192×192). Ask the owner for an SVG or larger version; if none exists, use the PNG and don't stretch it.
- Favicons: `/favicon.ico`, `/favicon-32x32.png`, `/favicon-16x16.png`, `/apple-touch-icon.png`.
- Also add the standard Next.js app assets: `app/icon.png`, `app/apple-icon.png`, `app/manifest.json` (correct site name, theme color `#0F1115`).
- Wordmark text: "CASCADE CHARTER BUS". Top bar text: "Cascade Charter Bus | Premium Group Transportation".

### 3.5 Photos (download into `/public/images/`, convert to WebP/AVIF)
- Hero: `https://www.cascadecharterbus.com/hero-bus.jpg`
- About: `https://www.cascadecharterbus.com/about-bus.jpg`
- Fleet: `/fleet/charter.jpg`, `/fleet/sleeper.jpg`, `/fleet/mini.jpg`, `/fleet/sprinter.jpg`, `/fleet/school.jpeg`, `/fleet/limo.jpg`, `/fleet/suv.jpg` (all under `https://www.cascadecharterbus.com`)

Use the same photos in the same places as now. Make a list of extra photos needed (`PHOTOS_NEEDED.md`: page, what the photo should show, size) — mainly vehicle interiors and one hero photo per kept city.

**The owner will supply real photos during development.** They go into `/public/images/originals/` with this naming. Write a script (`scripts/process-images`) that resizes them, converts to WebP/AVIF, removes location data (EXIF GPS), and writes to `/public/images/`. Never edit or delete the originals.

```
fleet-{vehicle}-exterior-01.jpg      e.g. fleet-sleeper-exterior-01.jpg
fleet-{vehicle}-interior-01.jpg      e.g. fleet-sleeper-interior-bunks-01.jpg
service-{service}-01.jpg             e.g. service-wedding-transportation-01.jpg
city-{state}-{city}-01.jpg           e.g. city-ut-park-city-01.jpg
team-{name-or-role}-01.jpg           e.g. team-dispatch-01.jpg
```
For city hero photos where the owner has no photo: use a properly licensed photo of a local landmark (license noted in `/content/photo-credits.json`). Never use photos with other companies' buses or logos, and never AI-generated photos.

---

## 4. Design — match the live site

**Owner decision (Nov 9):** the new site uses the **same theme and structure as www.cascadecharterbus.com today.** This replaces the "new modern design" plan from Version 4. Do not create new design directions.

### 4.1 How to match it
1. In Phase 1, take **full-page screenshots of every live page type** at 390 px (phone), 768 px (tablet) and 1440 px (desktop): home, services hub, one service page, fleet hub, one fleet page, locations hub, one state page (Ohio), one city page (Park City UT), about, contact, blogs list, one blog post, FAQs, a legal page, 404. Save in `docs/live-reference/`.
2. Record the header (top bar, menu, dropdowns, mobile menu), footer, buttons, cards, spacing and font sizes in `docs/theme-tokens.md`.
3. Build each template to match its screenshot. At the end of Phase 2, show the owner **side-by-side screenshots (live vs new)** for every page type.

### 4.2 What stays exactly the same
- Top bar (brand line, email, phone), header, menu order and dropdown items, the amber **BOOK NOW** button.
- Footer layout: brand block + social links, Quick Links, Our Services, Contact HQ, "DOT COMPLIANT" badge, legal links.
- The order and look of the sections on every page type (Section 7).
- Colors, fonts, button shapes, card styles, photo overlay style.

### 4.3 What may change (small and only where needed)
- **Animations:** the agent may improve or simplify them where it helps speed or smoothness. Keep them subtle (fade/slide on scroll, under 300 ms), never animate the main hero text or image in a way that delays it showing, and respect `prefers-reduced-motion`. List every animation change in `PLAN.md` for approval first.
- **Hidden fixes that don't change the look:** heading tags in the right order, breadcrumbs added where missing (city and fleet pages), correct menu links, faster images, accessibility fixes (contrast, focus states, labels).
- **Text fixes:** wrong facts and typos listed in Sections 7 and 15.
- **State page city list:** two groups instead of one (Section 7.7). Same button style.
- **City page content:** same page frame, but real local content instead of template text (Section 8).

---

## 5. Tech stack — same as the live site

| Area | Choice | Notes |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** — the live site already runs on Next.js | Use the latest stable version. If the owner provides the current source code, start from it. |
| Rendering | **Static pages with on-demand updates (SSG/ISR)**: pages are pre-built, and when the SEO team publishes a change in the admin, only that page is rebuilt within seconds | All SEO content must be in the first HTML response. No client-side-only content. No empty "loading" pages that Google could index. |
| Styling | **Same as the live site: Bootstrap 5 classes + small custom styles (styled-jsx) + Lucide icons.** This was confirmed from the live page code (classes like `container`, `row`, `btn btn-primary rounded-pill`, `card`, `shadow-sm`, `rounded-4`, and custom ones like `hover-lift`, `bg-primary-soft`, `x-small-bold`, `footer-link`). Reuse the same class names so the look is identical, but ship only the CSS that is used. | Bootstrap's "primary" color is set to the brand amber. |
| Images | `next/image`, WebP/AVIF, correct `sizes`, `priority` only on the hero image | |
| Fonts | `next/font` (Inter, self-hosted) | |
| Content & admin | **Payload CMS 3** inside the same Next.js app (admin at `/admin`, Section 19). This is the one addition to the current stack — it is needed for the admin dashboard the SEO consultant asked for. | MIT-licensed, self-hosted. Check the latest version and official plugins before starting. |
| Database & media | **PostgreSQL** for content; **S3-compatible storage** for images | Owner to choose providers in Phase 1. Daily backups required. |
| Form | Next.js Route Handler (`/api/quote`) with server-side validation, honeypot + time-trap spam protection, rate limit. **Email with the Resend API.** | Keys in environment variables (`RESEND_API_KEY`, `QUOTE_TO_EMAIL`, `QUOTE_FROM_EMAIL`) — never in code. Until Resend is set up, log submissions in dev mode only. |
| Scripts | Node or Python scripts in `/scripts` for content checks, redirects and reading the live site | |
| Hosting | Same host as now unless the owner says otherwise (ask) | Don't deploy to production without approval. |
| Tracking | **Google Tag Manager `GTM-5WTG8HBP`** on every page (Section 9.8) | Loaded so it doesn't slow the page. |

---

## 6. Site structure (URL map) — same as the live site

### 6.1 Pages at launch

```
/                                   Home
/services/                          All services
  /services/corporate-transportation/        Corporate Event Transportation
  /services/wedding-transportation/          Wedding Shuttle Bus Rental
  /services/school-transportation/           School & Field Trip Transportation
  /services/sports-team-transportation/      Sports Team Transportation
  /services/airport-transfer/                Group Airport Shuttle
  /services/sightseeing-tour-bus/            Sightseeing & Tour Bus Rental
  /services/church-religious-transportation/ Church & Religious Group Transportation
/fleet/                             View Entire Fleet
  /fleet/charter-bus/               Charter Bus
  /fleet/sleeper/                   Sleeper / Tour Buses
  /fleet/minibus/                   Minibuses
  /fleet/school-bus/                School Buses
  /fleet/sprinter-van/              Sprinter Vans
  /fleet/party-bus/                 Limo & Party Buses
  /fleet/suv-sedan/                 SUV & Sedans
/locations/                         Locations hub (all states)
  /locations/{state}/               State pages
    /locations/{state}/{city}/      710 city pages (only those in locations-keep.json)
/about/
/contact/                           Booking form
/blogs/  and /blogs/{slug}/         Keep existing posts (list weak ones for the owner)
/faqs/
/sitemap/                           NEW — HTML sitemap page (Section 9.6)
/privacy-policy/  /termsandconditions/  /cancellation-policy/   (keep URLs and text)
/sitemap.xml  /robots.txt  /llms.txt
```

**Header menu (same as now):** Home · Services (7 + "All Services") · Fleet (7 + "View Entire Fleet") · Locations · About · Blogs · Contact · **BOOK NOW**. Every dropdown item must link to its real page (some live links point to wrong anchors like `/fleet/#coach` — fix them).

**Footer (same as now):** brand block + social links (Facebook, Instagram, LinkedIn, TikTok — same URLs) · Quick Links (Home, Our Fleet, Service Areas, Services, About Us, Get A Quote, Blogs, FAQ's) · Our Services (7) · Contact HQ · "DOT COMPLIANT" badge · Privacy, Terms, Cancellation, Sitemap.
Three fixes in the footer:
1. Address: replace "Bronx, NY 10462" with **12409 Linden Blvd, South Ozone Park, NY 11420**.
2. The "Sitemap" link goes to the new **HTML sitemap page `/sitemap/`**, not to `/sitemap.xml`.
3. Fix any typo in the copyright line ("All rights reserved").

### 6.2 Pages that can be added later (not at launch)
Version 4 planned extra service pages: Band Tour Bus, Winery Tours, Prom / Party Bus, Military, Government. Because the structure stays the same for now, **these are not built at launch.** They can be added later from the admin dashboard. Band Tour Bus is the company's core business, so it should be the first one added — ask the owner when.

### 6.3 State areas
- **State pages with city pages (48):** the 44 states in the enquiry list plus Arkansas, Iowa, Nebraska and South Dakota (each has one traffic page).
- **Puerto Rico is removed (owner, Nov 9): US states and the District of Columbia only.** No Puerto Rico state page, no Puerto Rico city pages or buttons, not on the Locations hub, not in sitemaps. `/locations/pr/` and every URL under it returns 410. Do the same for any other non-US area found on the live site.
- The live Locations hub shows 44 areas (43 states + District of Columbia). Some kept states (for example Delaware, Arkansas, Iowa, Nebraska, South Dakota) are not on that hub today. **In Phase 1, list every state page that exists on the live site.** The new hub shows: every state page that is live today **plus** every state that has a kept city page.
- A state page with no kept city (for example District of Columbia) still exists and shows only the booking-form buttons.

---

## 7. Page specifications

For every page: unique `<title>` (50–60 characters), unique meta description (140–160 characters), one H1, self-referencing canonical, robots meta tag, Open Graph tags, breadcrumbs (except home), JSON-LD (Section 9), and a booking call to action.

**General rule: keep each page's sections in the same order and the same look as the live page.** The notes below list only what must be fixed or changed.

### 7.1 Home `/`
Same sections, same order as now:
1. **Hero** — eyebrow "Premium Nationwide Service", H1 "Group Travel, Elevated.", intro, buttons REQUEST A QUOTE + VIEW OUR FLEET.
2. **Stats bar** — same 4-item layout, but with confirmed facts only: **5+ Years of Service · All 50 States Covered · 24/7 Logistics Team · Multiple Vehicle Types**. Remove "500+ Verified Units". Remove "4.9/5 Ratings" — it has no source and does not match the real Trustpilot score. The real score is shown by the Trustpilot widget instead.
3. **Our Heritage** — "Built on Punctuality, Honesty, and Hard Work", same story and photo. Change "15+ Years of Excellence" to "5+ Years of Service".
4. **The Cascade Advantage** — "Why Choose Cascade Bus Service", same 4 cards.
5. **Testimonials** — "What Groups Say About Cascade Charter Bus", the same 3 (confirm permission to keep names, Section 15), **plus the Trustpilot review widget** directly under them (Section 7.12).
6. **Tailored Transportation** — "The Journeys We Serve Nationwide", same 6 cards + "Plan Your Custom Journey Today" with REQUEST A CUSTOM QUOTE.
7. **FAQ** — "Frequently Asked Questions", same 7 questions. Each answer starts with the direct answer in the first sentence.
8. **Locations** — "Serving Every Major City & Region in the USA" with BROWSE ALL LOCATIONS.
9. **Closing CTA** — "Your Journey Starts With One Call" with GET STARTED.

Fixes: heading tags in order; remove the wrong numbers; no other layout change.

### 7.2 Services hub `/services/` and 7.3 service pages
**Same template, better page format.** The header, footer, hero style, cards, colors and buttons stay the same. Inside that frame, each service page uses this clearer format (short sections, each one answering a real question):

1. Hero: eyebrow, H1, one-sentence promise, quote button. *(as now)*
2. **What this service is and who it's for** — 2–3 short sentences, then 3–5 real trip examples.
3. **Which vehicle fits** — a small table: group size → vehicle → why. Links to the fleet pages. *(new; the live pages recommend no vehicles)*
4. **How booking works for this service** — 3–4 steps with the real lead time.
5. **How pricing works** — the pricing factors, as now. No invented prices.
6. **Why Cascade** — only claims that are true and specific (Section 15). *(replaces "Key Highlights" and "Our Experience in Numbers")*
7. **FAQ** — 4–6 questions specific to the service. The answer starts in the first sentence.
8. Closing CTA. *(as now)*

Each service page must read clearly different from the others — not the same text with the service name swapped. Fix the errors listed in Section 7.5b. Add breadcrumbs and `Service` schema. Owner/SEO consultant reviews the text.

**Services hub:** same layout (7 cards with "View Details", "Booking Made Simple" 4 steps, FAQ). The FAQ on the hub today is the wedding FAQ — replace it with 5–6 general questions about all services. Use the same service names as the menu (the hub says "Airport Transfer Service", the menu says "Group Airport Shuttle" — use one).

### 7.4 Fleet hub `/fleet/` and 7.5 fleet pages
**Same template, better page format.** Same 7 vehicles, same look. Every fleet page uses the same clear format so the numbers are easy to find and always agree with the fleet hub:

1. Breadcrumb (Home › Fleet › {Vehicle}) — **on every fleet page** (the sleeper page has none today).
2. Hero: H1, one-sentence summary, quote button, **Call Now button with the real phone number**.
3. **Quick facts row** — capacity, luggage, restroom, WiFi/power, best for. The same 5 facts on all 7 pages.
4. **Photos** — real exterior and interior.
5. **Features & amenities** — a short list. Say "on most vehicles" or "on request" where it is not on every vehicle.
6. **Specs table** — seats, luggage, climate, technology.
7. **Best for** — services that suit this vehicle, linked to the service pages.
8. **FAQ** — 4 real questions. Answer in the first sentence.
9. Other fleet options + closing CTA. *(as now)*

All numbers come from **one data source** (the Fleet collection in the admin), so the hub, the vehicle page, the "other fleet options" cards and the service pages can never disagree again.

Current data from the live site (confirm with owner):
| Vehicle | Capacity | Amenities | Specs |
|---|---|---|---|
| Charter Bus | 52–56 passengers | Onboard restroom, high-speed WiFi, under-bus luggage storage, PA system | 50–60 large bags; dual-zone A/C; LCD monitors/DVD |
| Sleeper / Tour Bus | **4 to 15 bunks** (several bus sizes) | Sleeping bunks, front & rear lounge, **restroom and shower**, private artist room (confirm) | Personal & tour gear storage; central climate control; premium sound system |
| Minibus | 20–32 passengers | A/C, reclining seats, overhead storage, easy city parking | Overhead/seat storage; rear climate control; WiFi/USB |
| Sprinter Van | Up to 14 passengers | A/C, luggage space, comfortable reclining seats | Carry-on/rear storage; rear climate control; 12V charging |
| School Bus | 28–60 passengers | Large group capacity, safety-focused design, bench seating, PA system | No luggage bay; climate varies by vehicle |
| Limo & Party Bus | 14–40 passengers | Premium interior, LED lighting, bar area, entertainment system | Limited luggage; climate control; sound & entertainment |
| SUV & Sedan | Up to 7 passengers | Climate control, privacy glass, Bluetooth audio, comfortable seating | Up to 7 carry-ons; climate control; Bluetooth / charging |

### 7.5b Errors found on the live service and fleet pages — fix all of these
Checked on Nov 9, 2026. Full notes in `docs/live-site-audit.md`. In Phase 1 the agent checks every service and fleet page the same way and adds anything else it finds.

| Where | Problem | Fix |
|---|---|---|
| Fleet pages (Charter Bus, SUV & Sedan, likely others) | The **Call Now** button dials **+1 (800) 000-0000**, a placeholder number | Use +1 (646) 705-0816 everywhere, from Site settings |
| Sleeper page vs fleet hub | Numbers disagree: hub says "6–12 bunks", "Restroom & Shower", "Private Artist Room"; the sleeper page says "12 private bunks", "seats up to 15", "12 to 15 guests", and lists a restroom but no shower | **Owner confirmed (Nov 9): sleeper buses with 4 to 15 bunks are available; restroom and shower on board.** Use this on the hub, the sleeper page, the cards and the service pages. Seat count and artist room still to confirm |
| Sleeper page | Title is the generic site title; no breadcrumb; no FAQ; small labels are H6 | Own title and description, breadcrumb, 4 FAQs, correct headings |
| Minibus | Fleet says 20–32 passengers; wedding page says 20–30 | One figure from the Fleet collection |
| Charter bus | "52–56" on the hub, "up to 56" on the page | Use one wording |
| Charter bus page (and likely other fleet pages) | Canonical points to the `www.` address | Canonical on the main address (no www) |
| Fleet pages | Very general wording ("Professional Transportation", "Nationwide Group Travel", "applicable vehicles") with few real facts | Real numbers in the quick facts row: seats, luggage, restroom, WiFi/power (Section 7.4) |
| All pages | Bootstrap's script is loaded from an outside address (jsdelivr CDN) on every page | Host it with the site, and load only the parts used (menu, dropdown, accordion) |
| 404 page | Says "Route Not Found" with the generic title | New title and description from the SEO roadmap (Section 7.11); keep the same look and buttons |
| About page | "Every coach includes high-speed WiFi, individual power outlets" — but fleet pages say WiFi is only "on applicable vehicles" | Say what is true: available on most motorcoaches, confirm when booking |
| Service pages ("Our Experience in Numbers") | "10+ years in business", "15,000+ trips completed" | Change to "5+ years of service". Remove the trips number. Keep "50 states" |
| About page | "10+ Years", "15k+ trips", "500+ verified drivers", "4.9/5", "5,000 organizations", "preferred choice for Fortune 500 companies" | "5+ years of service". Remove the rest (no proof). Use confirmed facts only |
| Wedding page | Peak season is "May through September" in one place and "May–October" in another | Use one (confirm with owner) |
| Wedding page | Says "no fees added after booking" but also "gratuity varies by operator" | Say clearly what the quote includes and whether gratuity is included |
| Corporate page | "Punctuality guarantee" with no terms; "dedicated account manager" | Keep only if the owner confirms what the guarantee is; otherwise reword ("drivers arrive early") |
| Service pages | Social share image (`og:image`) points to `http://localhost:3000/...` — broken | Real image URL on the main address |
| Service and fleet pages | Title repeats the brand: "... \| Cascade Charter Bus \| Cascade Charter" | Brand once |
| All pages | Headings jump to H5/H6 ("Key Highlights", "Ideal For", "Key Amenities", footer titles) | Correct heading levels; footer titles are not headings |
| Footer | "All Rights Resereved" typo and a doubled © | Fix |
| Services hub | FAQ is wedding-only | General services FAQ |

### 7.6 Locations hub `/locations/`
Same as now: H1 "Our Service Locations", then one block per state with the state name and a **VIEW CITIES** button, A–Z.
Fixes:
- The line "across 44 states" must show the true number of state areas listed (Section 6.3).
- State names are H5 now — make them H2 (same visual size).
- Add the intro line and breadcrumb if missing.

### 7.7 State page `/locations/{state}/` — the two-group city list (important)

**What the owner wants:** when a visitor opens a state (example: `/locations/oh/`), they still see a button for **every city in that state, like today.** The difference is what each button does.

**Page order, top to bottom (same frame as the live state page):**
1. Breadcrumb: Home › Locations › {State}.
2. **H1: "Charter Bus Rental in {State}"** (the live H1 reads "Ohio Charter Bus in Ohio" — fix it).
3. Intro line, as now: "Select a city below to explore local group transportation services and fleet options."
4. **Group 1 — cities with their own page (at the top).**
   - Heading (H2): "Popular {State} Charter Bus Locations".
   - Shows only the cities in `locations-keep.json` for that state, in the order given in the file (highest priority and most enquiries first).
   - Each button is a normal link to the city page, e.g. `/locations/oh/columbus/`.
5. **Group 2 — all other cities in the state (below).**
   - Heading (H2): "More Cities We Serve in {State}".
   - One line under the heading: "Don't see a page for your city? Pick it below and we'll start your quote."
   - Shows **every other city that is on the live state page today**, A–Z, in the **same button style as now.**
   - **These cities have no page.** Clicking the button takes the visitor **straight to the booking form** (`/contact/`) with **Pick-Up Location already filled in** with "{City}, {ST}".
6. "Reliable Transportation Across {State}" section, as now (rewrite the text so it is specific to the state: main metro areas, airports, common trip types — true facts only).
7. Brand block + footer, as now.

**Example — Ohio:** Group 1 shows the 26 kept cities (Sidney, Beachwood, Logan, Port Clinton, Wapakoneta, Akron, Bellaire, Cadiz, Carroll, Chillicothe, Cincinnati, Columbus, Huron, Kimbolton, Lewis Center, Madison, Middlefield, Milford, Newark, North Canton, Ottawa, Sugar Grove, Vermilion, West Portsmouth, Zanesville, Portsmouth). Group 2 shows the other ~800 Ohio cities that are on the live page (Aberdeen, Ada, Adamsville, …) as booking-form buttons.

**How to build Group 2 (technical rules):**
- **Where the city names come from:** in Phase 1, before anything else changes, read every live state page (and the live sitemap) and save every city name per state in `data/all-cities.json` (`{ "oh": [ { "city": "Aberdeen", "slug": "aberdeen" }, … ] }`). This must be done while the old site is still live. Group 2 = all cities in that file **minus** the kept cities.
- **The button does not link to a city URL.** The old address `/locations/oh/aberdeen/` no longer exists (it returns 410, Section 10). Group 2 buttons must never point to it.
- **All Group 2 buttons use the same address: `/contact/`.** Do not create a different address per city (no `/contact/?city=aberdeen`). Thousands of different form addresses would look like thousands of duplicate pages to Google. Instead, each button carries the city in a data attribute:
  ```html
  <a href="/contact/" class="city-btn" data-pickup="Aberdeen, OH" rel="nofollow">Aberdeen</a>
  ```
  A small script saves `data-pickup` (and the state page it came from) in `sessionStorage` on click. The booking form reads it and fills **Pick-Up Location**. If JavaScript is off, the visitor still lands on the booking form.
- The lead email should say which state page and city button the visitor came from.
- The city names are in the page HTML (so the page still says which towns are served), but the list must load fast: plain HTML list, no images, no heavy scripts. For very long lists, an A–Z jump row is allowed if it keeps the same look.
- Small visual cue so visitors know the difference: Group 1 buttons can show a small arrow (→); Group 2 buttons a small "quote" icon. Same shape, size and colors as today's buttons. Show both options to the owner in Phase 4.
- **Promotion:** when a new city page is published later in the admin, that city automatically moves from Group 2 to Group 1 (Section 19.6).
- Same method for **every** state. A state with no kept cities shows only Group 2.

Data: Group 1 from `locations-keep.json` → `states[].cities[]`; Group 2 from `all-cities.json`.

### 7.8 City page `/locations/{state}/{city}/` (710 pages)
Same page frame as the live city page (header, hero style, sections style, footer). The **content** is built from that city's **City Profile** (Section 8). Always present:
- Breadcrumb: Home › Locations › {State} › {City} (missing on live city pages — add).
- H1 with the city name in correct capital letters (the live template prints lower case like "alexandria, MN" — fix) and "charter bus" in it. Not the exact same formula on every page.
- Local hero photo of that city/landmark (or the owner's bus there) with a short local line.
- Booking call to action with pickup pre-filled with the city.
- Nearby cities: 3–6 links to other **kept** cities in the same state, closest first.

Everything between is chosen from the section library in Section 8.3.

### 7.9 Contact `/contact/` — booking form (keep exactly)
**The exact code of the live form is in `docs/live-reference/html/contact-booking-form.html`. Rebuild the form from it: same fields, same order, same labels, same placeholders, same layout, same look.**

Page layout, as now: dark hero (H1 "Professional **Charter Booking**", line "Complete the form below for a detailed itinerary quote. Average response: 15 minutes.") → white form card on the left (8 columns) overlapping the hero, two cards on the right (4 columns) → "Our Service Coverage" with a map → footer.

**Form fields, exactly as in the live code:**

| # | Label | Type | Placeholder | Required | Width on desktop |
|---|---|---|---|---|---|
| 1 | TRIP TYPE | 3 pill buttons: One Way · Round Trip · Multi-Day ("One Way" selected at start) | — | yes | full |
| 2 | FULL NAME | text | — | yes | 1/3 |
| 3 | EMAIL | email | — | yes | 1/3 |
| 4 | PHONE NUMBER | tel | — | yes | 1/3 |
| 5 | PICK-UP LOCATION (map-pin icon) | text | "Address, Airport, or Hotel" | yes | 2/3 |
| 6 | PICK-UP TIME (clock icon) | time | — | yes | 1/3 |
| 7 | DESTINATION / DROP-OFF ADDRESS (map-pin icon) | text | "Drop-off Address or Venue" | yes | full |
| 8 | INITIAL DROP-OFF TIME (clock icon) | time | — | yes | 1/2 |
| 9 | INTERMEDIATE STOPS (IF ANY) | text (one line) | "e.g. Stop at rest area, via 5th Ave..." | no | full |
| 10 | TRIP DATE (calendar icon) | date | — | yes | 1/2 |
| 11 | PASSENGER COUNT (people icon) | number | "Total count" | yes | 1/2 |
| 12 | SERVICE CATEGORY | 5 pill buttons: Corporate · Wedding · Sports · Tour · Event ("Corporate" selected at start) | — | yes | full |
| 13 | ADDITIONAL DETAILS (LUGGAGE, SPECIAL NEEDS) | text area, 3 rows | "Tell us about special requirements..." | no | full |

Button: **REQUEST BOOKING QUOTE** with the send icon, full width, amber pill.

Right-hand cards, as now: **Quick Contact** (phone with "24/7 Dispatch", email with "Direct Support") and the dark **Guaranteed Pricing** card ("The quote you receive is final. No hidden fuel surcharges or driver fees." — owner to confirm this is still true).

**Hidden fixes on this page (look stays the same):**
- Own title and meta description (today it has the generic site title), canonical, breadcrumb schema.
- The pill buttons must work for keyboard and screen-reader users (real radio inputs styled as pills) and send their value with the form.
- Every label is linked to its field. Clear error text under a field when something is missing. Trip Date cannot be in the past. Passenger Count minimum 1.
- **Pick-Up Location is filled in automatically** when the visitor comes from a city button or a city page (Section 7.7). The visitor can change it.
- The hero's dotted background uses a blue (`#0047AB`) that is not a brand color — use the brand amber at the same low strength.
- The map is a Google Map of New York. Keep the section, but load the map only when it scrolls into view (it is heavy), and give the frame a title for accessibility.
- "Quick Contact" is an H5 and the phone/email are H6 — fix the heading tags, same look.
- Spam protection that visitors don't see (honeypot + time check + rate limit). No CAPTCHA unless spam becomes a problem.

**Sending:** the form sends the lead **by email through Resend**: (1) the full lead to the company inbox, with the page the visitor came from, the city button clicked (if any) and UTM parameters; (2) a short "we got your request" email to the customer. Show a clear success message in the same card. Every lead is also saved in the admin (Quote requests). **Track the submit as a conversion event** (Section 9.8).

### 7.10 About `/about/`
Same layout. Confirmed facts only (Section 15). No invented team members.

### 7.11 404 page and others
- **404 page:** title **"Page Not Found | Cascade Charter Bus"**; meta description **"Sorry, the page you're looking for could not be found. It may have been moved or removed. Explore our locations or return to the homepage to find the transportation services you need."** Links to home, services, fleet, locations, contact. Must return a real 404 status code and `noindex`.
- **410 page:** removed city URLs show a short friendly page ("This page has been removed — get a quote or browse locations") with a real **410** status code.
- **HTML sitemap `/sitemap/`:** Section 9.6.
- Legal pages, FAQs, blogs: keep text, same look, fix headings.

### 7.12 Trustpilot reviews
Cascade has a claimed Trustpilot profile: `https://www.trustpilot.com/review/cascadecharterbus.com` (on Nov 9, 2026: 7 reviews, all 5-star and marked verified, TrustScore 4.2).

**How to show them — use Trustpilot's official "TrustBox" widget.** The owner logs in to Trustpilot Business, picks a TrustBox, and gives the agent the embed code. The widget pulls the real reviews live, shows the Trustpilot logo, and links back to the profile, so visitors and Google can check they are real.

- **Where:** homepage (under the testimonials), contact page (next to the form), service pages and fleet pages (small strip above the closing CTA), city pages (small strip). A small Trustpilot line in the footer is optional.
- **Do not copy and paste review text into the site by hand**, and do not rewrite, shorten or "improve" reviews. Trustpilot's rules require reviews to be shown through its own tools, and hand-copied reviews can't be verified. If the free plan doesn't include a widget that shows review text, use the free widget (score + link) and ask the owner whether to upgrade.
- **Never show a rating that isn't the real one.** The widget shows the true TrustScore. Do not write "4.9/5" or any other number in text.
- **No star-rating schema** (`AggregateRating`/`Review`) for these reviews on our own pages — Google does not accept a business marking up reviews about itself, and it can lead to a manual action.
- **Speed:** load the widget only when it scrolls into view, reserve its height so the page doesn't jump, and load its script after the page is ready. It must not lower the PageSpeed score below the target.
- **Looks:** choose the light or dark widget style that fits the section background; no other design change.
- **Getting more reviews (owner/SEO):** after each finished trip, send the customer a Trustpilot review invitation. More real reviews raise the score — a few reviews give a lower TrustScore even when all are 5-star.
- The three testimonials already on the homepage stay (with permission).

### 7.13 FAQs on every page type
Every main page type has its own FAQ section, in the same accordion style the live site uses. The live sleeper page has none — add it.

| Page | FAQs |
|---|---|
| Home | 7 (the current ones, tidied) |
| Services hub | 5–6 general questions about services (not the wedding ones) |
| Each service page | 4–6, specific to that service |
| Fleet hub | 4–5 (which vehicle for which group, luggage, WiFi, accessibility) |
| Each fleet page (all 7, including Sleeper) | 4, specific to that vehicle |
| Locations hub | 3–4 (areas served, cities without a page, how to book) |
| Each state page | 3–5, specific to the state |
| Each city page | 2–4, specific to the city |
| Contact | 3–4 (reply time, what the quote includes, deposit/cancellation) |
| `/faqs/` | The full list, grouped by topic (booking, pricing, vehicles, safety, band tours, cancellations) |

Rules:
- The answer starts in the first sentence. Answers are short (2–4 sentences) and true (Section 15).
- **No copy-paste FAQs.** The same question and answer must not repeat across pages with only the city, service or vehicle name changed. (The live city pages do this: "How far in advance should I reserve a charter bus in {city}?")
- Answers are in the page HTML (readable without JavaScript), with `FAQPage` schema, once per page.
- Every FAQ is added, edited, reordered or removed in the admin.
- Sleeper FAQ ideas: "How many bunks does a sleeper bus have?" (4 to 15, depending on the bus) · "Is there a shower and restroom on board?" (yes) · "Can the bus pull a trailer for gear?" · "How do driver hours work on overnight runs?" — owner confirms the last two answers.

---

## 8. Location pages — every kept city gets real local content

### 8.1 Why this matters
Google's spam policy calls out pages "targeted at specific regions or cities that funnel users to one page" (doorway abuse) and "many pages generated for the primary purpose of manipulating search rankings" (scaled content abuse). The old site had ~26,600 such pages. Cutting to 710 only helps if each kept page is **genuinely useful, local and different** — in its words, its facts and its photos. The page frame and theme are the same on every city page; the content is not.

**The swap test:** if you can replace the city name with another city and the page still makes sense, the page fails.

### 8.2 The City Profile (one data file per city — the source of truth)
Before any city page is written, its City Profile must be filled in. The profile lives in the **Cities collection of the admin dashboard** (Section 19); the shape below is the data model (it can also be imported/exported as JSON). The page is generated from the profile plus hand-written copy. Fields:

```jsonc
{
  "city": "Park City", "state": "UT", "slug": "park-city", "county": "Summit County",
  "archetype": "mountain-resort",            // see 8.4 — decides which sections lead and what photos to use
  "tagline": "Ski-town shuttles, mountain weddings, airport runs from SLC",
  "coordinates": [40.646, -111.498],
  "airports": [ { "name": "Salt Lake City International Airport", "code": "SLC", "approx_miles": 35, "source": "url" } ],
  "main_routes": [ "I-80", "UT-224" ],          // verify each
  "landmarks": [ { "name": "Historic Main Street", "type": "district", "source": "url" } ],
  "venues": [ { "name": "Sheraton Park City", "type": "hotel", "from_inquiries": true } ],
  "seasonality": [ "Ski season Dec–Apr: heaviest airport and resort demand" ],
  "events": [ { "name": "...", "month": "...", "source": "url", "status": "current" } ],
  "trip_ideas": [ "SLC airport to resort for ski groups", "Wedding guest loops between hotels and mountain venues" ],
  "driving_notes": [ "Winter mountain driving — chains/traction rules may apply on canyon roads" ],
  "services_focus": [ "airport-transfer", "wedding-transportation", "corporate-transportation" ],
  "fleet_focus": [ "charter-bus", "minibus", "sprinter-van" ],
  "nearby": [ "ogden", "kamas", "draper" ],
  "hero_image": "city-ut-park-city-01.jpg", "hero_credit": "...",
  "faq": [ { "q": "...", "a": "..." } ],
  "sources": [ "every fact above must have a source URL here" ],
  "status": "draft"                          // draft → reviewed → approved
}
```

Rules for the profile:
- Every fact (airport distance, venue, event, route) needs a source URL in `sources`. If it can't be verified, leave it out.
- Check events are **still current**. Example: the Sundance Film Festival was held in Park City for decades but is moving to Boulder, Colorado from 2027 — a Park City page that still sells "Sundance shuttles" would be wrong. Mark past events as history only.
- Use `pickup_places_seen` from `locations-keep.json` as `venues` (`from_inquiries: true`) after checking each is real and spelled correctly.
- Never include private homes, customer names or exact customer addresses.

### 8.3 Section library (pick 5–8 per city, in an order that suits the city)
| Section | Use when the city has… |
|---|---|
| **Airport run** — airport(s), approx. distance/time, luggage tips, flight-tracking pickup | A major airport within ~90 miles |
| **Resort & ski shuttles** — resort names, gear storage, winter driving | Ski/mountain resorts |
| **Wedding guest transport** — local venues, hotel loops, timing | Wedding venues / destination-wedding town |
| **Event & festival shuttles** — current annual events, stadiums, arenas | Big recurring events, stadiums |
| **Campus & school trips** — universities/school districts, field-trip spots | College town / large school district |
| **Corporate & conference** — convention centres, business districts, HQs | Business/convention city |
| **Tour & band routing** — music venues, amphitheatres, routing to nearby tour stops | Notable concert venues / tour stops |
| **Base & government transport** — military bases, government centres | Military base / state capital |
| **Waterfront, ferry & cruise** — ports, ferry terminals, beach towns | Coastal / lake / island access |
| **Winery, brewery & distillery days** | Wine/brewery region |
| **Casino & resort trips** | Casinos / resorts |
| **Local driving notes** — terrain, season, parking for large coaches | Always useful where real |
| **Popular day trips from {City}** — 3–5 real nearby destinations with rough distances | Most cities |
| **Vehicles that fit here** — linked fleet cards with why they suit local trips | Always |
| **Local FAQ** (2–4 real questions) | Always |

### 8.4 City archetypes (decide which sections lead — the theme does not change)
Each city gets one archetype. It decides the **section order, which photos to use and the wording** — not the design. Colors, fonts and layout stay the same on every page.

| Archetype | Example cities from the data | Lead sections |
|---|---|---|
| `mountain-resort` | Park City UT, Vail CO, Big Sky MT, Mammoth Lakes CA, Jackson WY, Gatlinburg TN | Airport run → Resort shuttles → Weddings |
| `coastal-lake` | Kitty Hawk NC, Rehoboth Beach DE, Lake George NY, Ocean City NJ, Kailua-Kona HI | Waterfront/ferry → Weddings → Day trips |
| `big-city` | New York NY, Houston TX, Minneapolis MN, Atlanta GA, Philadelphia PA | Corporate → Airport → Events |
| `college-town` | Hanover NH, West Lafayette IN, Bloomington IN, Oxford MS, Clemson SC | Campus trips → Sports teams → Events |
| `small-town-gateway` | Ludlow VT, Crandon WI, Opp AL, Spring Green WI | Day trips → Weddings → Church/school groups |
| `military-government` | Fort Stewart GA, Port Royal SC (Parris Island), Kodiak AK, Columbus MS | Base transport → Ceremonies/graduations → Airport |
| `wine-resort-casino` | Fredericksburg TX, Taos NM, Lake Geneva WI, Shawnee OK | Winery/casino days → Weddings → Corporate retreats |

Assign archetypes in a reviewable file `content/locations/archetypes.csv` (city, state, archetype, reason), get the owner's approval, then import into the CMS. Within the same archetype, vary section order and H2 wording so pages in the same state don't read alike.

### 8.5 Worked example — Park City, UT (`/locations/ut/park-city/`)
This is the standard every city page must meet. Facts marked ✔ were checked on Nov 2, 2026; re-check all before publishing.

- **Inquiries:** 7 — the most of any city in the data. Priority "High" in the keep list — build it first. Tier A page (400–600 words).
- **Archetype:** `mountain-resort`.
- **H1:** "Park City Charter Bus & Ski Shuttle Rental"
- **Hero:** winter shot of the owner's coach on a mountain road or Historic Main Street (licensed landmark photo if no own photo). Tagline: "SLC airport runs, resort shuttles and mountain weddings — one dispatch team."
- **Airport run:** Salt Lake City International Airport (SLC) is about 35 miles from Park City ✔ (Cvent destination guide). Cover group arrival timing, ski/snowboard bag space (motorcoach under-bus bays), and return trips.
- **Resort shuttles:** Park City Mountain and Deer Valley Resort ✔ (Visit Park City). Mention lodge-to-lift and hotel-to-resort runs; Canyons Village side of Park City Mountain (verify naming).
- **Weddings:** Both resorts offer wedding packages and the area has mountain and lodge venues ✔ (Visit Park City). Venue named in our own inquiries: **Sheraton Park City**. Write about guest loops between hotels, ceremony and reception, and winter timing.
- **Downtown & events:** Historic Main Street is walkable with a free trolley ✔ — good for groups dropped at Main Street for dinner. Sundance Film Festival: moving to Boulder, CO from 2027 ✔ — mention only as history, don't sell festival shuttles.
- **Driving notes:** winter mountain driving, coach parking at resorts and Main Street (verify local rules before stating specifics).
- **Vehicles that fit:** Motorcoach (large ski/corporate groups, luggage bays), MiniBus (wedding loops), Sprinter (small groups, resort roads).
- **Day trips from Park City:** Ogden, Draper and Kamas (kept pages — link them); Salt Lake City can be mentioned but has no page.
- **Local FAQ ideas:** "How long is the drive from SLC airport to Park City by bus?" · "Can the bus carry skis and snowboards?" · "Do you run shuttles between Deer Valley and Park City Mountain hotels?"
- **Never write:** generic lines like "Park City is a vibrant city with something for everyone".

### 8.6 How the content is produced
- **Build order = the Priority column in the keep list:** High (27 pages) → Medium (73) → Standard (556) → Traffic (54). Inside each priority, work state by state so the owner can review one state batch at a time.
- For each batch: (1) build the City Profiles, (2) owner/SEO consultant reviews archetypes and profiles, (3) write pages, (4) review pages, (5) mark `approved`.
- **Traffic pages** (no enquiry, kept for Google clicks) have no `pickup_places_seen` and no county in the data — research them fully.
- The SEO consultant will give the content structure for location pages. Where his structure and this section differ, follow his structure and tell the owner.
- AI-assisted drafting is allowed, but every page must be built from its verified profile, follow the writing rules in Section 12, and be **read and edited by a person** before it is approved.
- **Keep pages short.** Tier A (2+ enquiries or big metro): 400–600 words. Tier B (1 enquiry or traffic page): 250–400 words. Every sentence must carry a local fact or a useful answer. A short page full of real facts beats a long page of filler.
- Project drafts already exist for Shelton CT, Weirton WV, Kailua-Kona HI, Alexandria MN and Baltimore MD — ask the owner for them and reuse where they fit.

### 8.7 Automated quality gate (build fails if any published page fails)
`scripts/check-locations.(ts|py)` checks every published city page:
- The city is in `data/locations-keep.json` (or was added later through the admin).
- Has an approved profile with sources for every fact; `status: approved`.
- Unique body word count ≥ 250 (Tier A ≥ 400) and not more than 700, not counting nav, footer, form and shared blocks.
- Similarity to every other city page (5-word shingles, Jaccard) **< 0.25**; within the same state **< 0.20**.
- ≥ 4 verified local entities (airport, landmark, venue, route, event) — not counting the city/state name.
- Its own hero image (no two city pages share the same hero).
- Title, meta description and H1 unique across the site.
- 3–6 nearby-city links that resolve to kept pages.
- Output: `reports/location-quality.csv` with a pass/fail reason per page.

---

## 9. Technical SEO checklist

### 9.1 One main address
- Main address: **`https://cascadecharterbus.com`** (https, no www).
- `http://`, `http://www.` and `https://www.` all **301-redirect in one step** to the same path on the main address. No redirect chains.
- Lowercase URLs and a trailing slash on every page; other forms 301 to the right one.

### 9.2 Canonical tags
Every indexable page has a self-referencing canonical with the full address:
```html
<link rel="canonical" href="https://cascadecharterbus.com/current-page-url/" />
```
Created automatically for every page. The SEO team can override it per page in the admin. URL parameters (UTM tags and so on) never change the canonical.

### 9.3 Robots meta tag
On every indexable page:
```html
<meta name="robots" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"/>
```
Pages set to "noindex" in the admin output `noindex, follow` and are left out of the sitemap. The 404 page, 410 page, `/admin` and form "thank you" states are `noindex`.

### 9.4 Titles, descriptions, headings
- Title: `{Primary keyword} | Cascade Charter Bus` — brand only once (live city pages repeat it twice). Unique on every page.
- Unique meta description on every page.
- **Heading structure fixed on the whole site**: one H1, then H2, then H3, in order. The SEO consultant reviews the heading outline of each template in Phase 2.
- No `meta keywords` tag.

### 9.5 Structured data (JSON-LD)
- **The SEO consultant will provide the schema document.** Build the schema system so his markup can be pasted in from the admin: a site-wide schema box and a per-page schema box, valid JSON-LD only, **no duplicate schema** (if a page has custom schema of a type, the automatic one of that type is switched off).
- Automatic defaults until his document arrives: site-wide `Organization` / `LocalBusiness` (name, logo, url, phone, email, address, opening hours, `sameAs`); `Service` on service, state and city pages (`areaServed` = US / the state / the city); `BreadcrumbList` on every page with breadcrumbs; `FAQPage` on FAQ blocks; `Article` on blog posts.
- Do **not** add `AggregateRating`/`Review` markup unless the reviews are real and shown on the page.

### 9.6 Sitemaps, robots.txt, llms.txt
- **Hierarchical XML sitemap:** `/sitemap.xml` is an index with child sitemaps. Default structure (replace with the SEO consultant's structure when he sends it): `sitemap-pages.xml`, `sitemap-services.xml`, `sitemap-fleet.xml`, `sitemap-locations-states.xml`, `sitemap-locations-cities.xml` (the 710 approved city pages only), `sitemap-blogs.xml`. Real `lastmod` dates. Updates automatically. Noindex pages and deleted pages are left out automatically. (The live sitemap is one 4 MB file with 26,583 city URLs.)
- **HTML sitemap page `/sitemap/`:** a normal page in the site theme listing main pages, services, fleet, states, and the kept cities grouped by state. The footer "Sitemap" link points here (not to the XML file).
- **robots.txt:** allow all; block `/admin/`, `/api/` and any private routes; include the sitemap address. Real security for the admin comes from login, not from robots.txt.
- **llms.txt:** the SEO/marketing team will supply the text. Serve it at `/llms.txt` and make it editable in the admin (Site settings). It must list only pages that exist on the new site and use the confirmed facts (Section 15).

### 9.7 Breadcrumbs
Visible breadcrumbs + `BreadcrumbList` schema on every page except home. **City pages and fleet pages do not have them today — add them.** Example: Home › Locations › Ohio › Columbus.

### 9.8 Tracking
- **Google Tag Manager container `GTM-5WTG8HBP` on every page.** Use Google's standard GTM install (script in `<head>` + `<noscript>` iframe after `<body>`), loaded with `next/script` so it doesn't block the page. *Note for the agent: the snippet written in the roadmap sheet mixes the GTM address with gtag code; use the standard GTM snippet with this ID and confirm with the SEO consultant.*
- GA4, Microsoft Clarity and other tags are added inside GTM by the SEO consultant, not in code.
- **Conversion events** pushed to the data layer: quote form submit (with page type and service category), phone click, email click, BOOK NOW / quote button clicks, city-button click on state pages (with city name).
- Google Search Console verification: support a verification meta tag / file set from the admin.
- **Cookie consent** banner with Google Consent Mode, in the site theme.
- The admin has a controlled "tracking scripts" box (Owner role only) so tags can be added without changing code.

### 9.9 Other
- **Internal links:** home → locations → states → kept cities; services ↔ fleet; city → nearby kept cities + state; every page → contact. No orphan pages. No links to removed city URLs anywhere.
- **Images:** descriptive `alt`, width/height set, lazy load below the fold, hero image prioritized.
- Open Graph / Twitter tags with a title, description and image per page.
- **Same name, address and phone** on the site, in schema and on the Google Business Profile.
- Correct status codes everywhere: 200, 301, 404, 410. No "soft 404" pages.

---

## 10. Removing old pages and redirects

All rules live in one place (`next.config` redirects + `middleware.ts` for the location rules), generated by `scripts/build-redirects`, and editable later in the admin Redirects manager.

| Old URL | New behaviour | Why |
|---|---|---|
| `/locations/{state}/{city}/` **in** `locations-keep.json` and approved | **200** — new page | Kept (710) |
| `/locations/{state}/{city}/` in the keep list but not approved on launch day | Should not happen (all 710 must be approved before launch). Safety net only: temporary 302 to its state page until approved | These URLs are already indexed |
| `/locations/{state}/{city}/` **not** in the keep list | **410 Gone** | SEO consultant's instruction. Removes ~25,900 thin pages cleanly. On the state page the city still appears as a booking-form button (Section 7.7), but the old address itself is gone. |
| State pages `/locations/{state}/` | **200** — all US state pages and DC stay (Section 6.3) | Same structure as now |
| `/locations/pr/` and everything under it (Puerto Rico) | **410 Gone** | Owner: US states only |
| `http://`, `www.` versions of any URL | 301 → `https://cascadecharterbus.com/...` | One main address |
| Old menu anchor links (`/services/#weddings`, `/fleet/#coach`, etc.) | Replaced by real links in the menu | Wrong anchors today |
| Any other old URL | Every old URL must end as 200, 301 or 410 — produce `reports/url-map.csv` for owner review | No accidental 404s |

Notes:
- **Exception list:** if the owner or SEO consultant finds a removed city URL with real backlinks in Search Console, it can be given a 301 to its state page instead of 410. Keep this list short — mass redirects of unrelated towns are treated by Google as soft 404s.
- The removed city URLs must not appear in any sitemap, menu, internal link or schema.

---

## 11. Performance, accessibility and quality budgets

- Core Web Vitals (mobile): **LCP < 2.5 s, INP < 200 ms, CLS < 0.1**.
- Lighthouse / PageSpeed mobile: **Performance must be above 80 on every template (SEO consultant's minimum); aim for 90+.** Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100. Test Home, a service page, a fleet page, the Ohio state page (long city list) and a city page.
- Hero image ≤ 200 KB (WebP/AVIF), preloaded; all other images lazy.
- As little JavaScript as possible: server components by default; client code only for the menu, form, city-button script and consent banner. Third-party scripts load after the page.
- Caching and CDN in front of all pages and images. No render-blocking resources.
- Works from 360 px to 1920 px wide. Tap targets ≥ 44 px (important for the city buttons). Visible focus states. Form labels and clear error messages.
- Test in Chrome, Safari (iOS), Firefox, Edge.

---

## 12. Content rules — short, unique, written like a person

**The honest picture:** Google does not punish text only because AI helped write it. It punishes pages that are mass-produced, say nothing new and look the same as each other — which is what happened to this site. So the goal is not to "hide" AI. The goal is text that is true, specific and checked by a person. Text like that is safe whoever typed it.

**Rules for every page (services, fleet, states, cities, blogs):**
1. **Short.** Say it once. No intro paragraph that repeats the heading. Paragraphs of 2–3 sentences. Service and fleet pages: about 400–700 words. City pages: Section 8.6.
2. **Answer first.** Under every H2/H3, the first 1–2 sentences give the direct answer. Details after. (This is also what ChatGPT, Google AI Overviews and Perplexity quote.)
3. **Specific, not general.** Every paragraph needs at least one real fact: a number, a place name, a vehicle, a time, a rule. "A 56-seat motorcoach holds about 50–60 large bags under the floor" — not "our spacious buses offer ample storage".
4. **Sound like a dispatcher talking to a customer.** Plain US English. "You" and "your". Active voice. Short and long sentences mixed. Contractions are fine ("we'll", "don't").
5. **Use what only Cascade knows.** Real jobs, real pickup places, real problems solved (for example: a farm venue where a 45-ft coach could not turn, so two minibuses ran loops). Use these only with the owner's approval and never with customer names unless permission is given.
6. **Unique.** No sentence or paragraph may be reused across pages with only the city, service or vehicle name changed. The quality gate (Section 8.7) checks city pages; run the same similarity check on the 7 service pages and 7 fleet pages (must be under 0.25).
7. **True.** Only facts from Section 15, the Fleet data, or a verified source. No invented numbers, awards, guarantees or reviews.
8. **A person reads every page before it goes live** — the owner, marketing lead or SEO consultant — and changes anything that sounds wrong or generic. Pages are marked `approved` only after that.

**Words and habits to avoid (they make text sound machine-written and say nothing):**
- "Elevate", "seamless", "unlock", "unparalleled", "tailored to your needs", "look no further", "whether you're… or…", "in today's fast-paced world", "nestled", "vibrant", "bustling", "something for everyone", "gold standard", "white glove", "top-notch", "world-class", "embark", "journey" (for a bus trip), "rest assured", "when it comes to".
- Opening lines that only restate the title. Closing lines that only summarize.
- Lists of three adjectives ("safe, reliable and comfortable"). Rows of em dashes. Every section built the same way.
- Claims with no proof: "best", "#1", "most trusted", "luxury" for a standard coach.

**Existing live lines to rewrite:** "The gold standard in nationwide group transportation", "White Glove Service", "Seamless Guest Experience", "Late-Model Luxury", "The Athlete's Choice" — replace with plain, specific lines (the brand line "Group Travel, Elevated." in the hero stays; it is the brand's tagline).

**Bylines:** blog posts show a real author (the owner's marketing lead — name to be given) and a real updated date.

---

## 13. Repository layout (suggested)

```
/app
  page.tsx                                 home
  /services/page.tsx, /services/[slug]/page.tsx
  /fleet/page.tsx, /fleet/[slug]/page.tsx
  /locations/page.tsx, /locations/[state]/page.tsx, /locations/[state]/[city]/page.tsx
  /about, /contact, /faqs, /blogs, /sitemap (HTML sitemap), legal pages
  /api/quote/route.ts
  sitemap index + child sitemaps, robots.ts, llms.txt route, not-found.tsx
  icon.png, apple-icon.png, manifest.json
/app/(payload)/admin/...                   Payload admin dashboard (Section 19)
/components   (TopBar, Header, Footer, QuoteForm, Breadcrumbs, CityButtons, Faq, Cta, JsonLd, ConsentBanner...)
/collections  (Pages, Services, Fleet, States, Cities, Posts, Categories, Testimonials, Media, Redirects, QuoteRequests, OffPage, Users)
/globals      (SiteSettings, Header, Footer)
/blocks       (page-builder blocks that match the current theme)
/seed         (import scripts: locations-keep.json, all-cities.json, current site content)
/data         locations-keep.json, pages-to-keep.csv, all-cities.json, site.json
/docs         live-reference/ (screenshots of the live site), theme-tokens.md, ADMIN_GUIDE.md
/public       brand/, images/
/scripts      crawl-live-site, build-redirects, check-locations, process-images
/reports      generated QA reports
PLAN.md  PHOTOS_NEEDED.md  QUESTIONS.md  PROGRESS.md
```

---

## 14. Phased plan (stop for approval after each phase)

| Phase | What | Done when |
|---|---|---|
| 1. Setup & capture the live site | New repo, Next.js + TypeScript. **Read-only capture of the live site:** screenshots of every page type (Section 4.1), theme values, logo/photos, all text of the main pages, **every city name on every state page → `data/all-cities.json`**, full URL list → `reports/url-map.csv`. Write `PLAN.md`, `QUESTIONS.md`, `PHOTOS_NEEDED.md`. | Owner approves plan and answers questions |
| 2. Theme match | Header, footer, buttons, cards and every page template rebuilt to match the live site. List of proposed animation changes. Heading outline per template for the SEO consultant. | Owner approves the side-by-side screenshots (live vs new) |
| 3. Core pages | Home, About, Contact (working form through Resend in test mode), Services hub + 7 service pages, Fleet hub + 7 fleet pages, FAQs, blogs, legal, 404, HTML sitemap | Pages match the live look, Section 7.5b errors all fixed, Trustpilot widget in place, PageSpeed above 80 |
| 3b. Admin dashboard | Payload CMS, roles, collections, SEO fields, schema boxes, redirects, tracking settings, import of content and data files, publish → page refresh (Section 19) | SEO manager can log in, edit a page, add a test city page and see it on preview within a minute |
| 4. Locations framework | Locations hub, all state pages with the **two-group city list** (Section 7.7), booking-form pre-fill from city buttons, city page template, nearby-city logic, quality-gate script, sitemaps | Ohio and New York state pages approved; button → form pre-fill works on phone and desktop |
| 5. Location content (all 710) | City Profiles + pages for all 710 kept cities, in priority order (High → Medium → Standard → Traffic); owner/SEO consultant reviews each batch | All 710 approved and passing the gate — required before launch |
| 6. Redirects & SEO checks | 410/301 rules, www/http redirects, canonicals, robots meta, schema validation, GTM and conversion events, llms.txt, broken-link check, full crawl of the preview site | Zero broken links; every old URL accounted for; Section 20 checklist all "Done" |
| 7. Launch (owner-approved only) | Deploy, switch domain, submit sitemap index in Search Console, monitor 404s/410s and Core Web Vitals | Owner gives go-ahead |
| 8. After launch | Weekly checks for 8–12 weeks (Section 17.5). Then: new city pages and the extra service pages (Section 6.2) added from the admin under the rules in Section 17.2b | Ongoing |

Expect recovery to take **months**, not days. Google reassesses sites over time, often around later core updates.

---

## 15. Confirmed business facts and open questions

**Confirmed by the owner — use these everywhere:**
| Item | Use this |
|---|---|
| Business address (footer, contact page, schema, Google Business Profile) | **12409 Linden Blvd, South Ozone Park, NY 11420** |
| Phone / email | +1 (646) 705-0816 (24/7 dispatch) · info@cascadecharterbus.com |
| Years in business | **5+ years of service** (never "10+" or "15+") |
| Fleet size | "**Multiple vehicles**" — no fleet-size number |
| Sleeper buses | **4 to 15 bunks**, restroom and shower on board |
| Coverage | "**Stations across every state**" / "All 50 states" — no "500+" numbers |
| Main site address | `https://cascadecharterbus.com` (no www) |
| Tag Manager | `GTM-5WTG8HBP` |
| Booking form delivery | Email via **Resend API** |
| Photos | Owner supplies real photos during development |
| Design | Same theme and structure as the live site (Nov 9 decision) |
| Trustpilot | `https://www.trustpilot.com/review/cascadecharterbus.com` — shown through the official widget only |

Remove everywhere: "10+ years", "4.9/5", "Fortune 500", the placeholder phone +1 (800) 000-0000, "15+ years", "500+ verified units", "500+ verified drivers", "15,000+ trips", "5,000+ organizations", the Bronx 10462 address, the South Richmond Hill 11419 address.

**Still to ask the owner (agent: put these in `QUESTIONS.md` in Phase 1):**
1. The full source code of the current site is **not available** (owner, Nov 9). Work from the six page-code files in `docs/live-reference/html/` and from the live site. If more page code is needed (for example the sleeper page, a state page, the about page), ask the owner to save it the same way.
2. Hosting: which host is the site on now, and does it stay there?
3. **Trustpilot:** please log in to Trustpilot Business and send the TrustBox embed code (Section 7.12). Which plan is the account on?
3b. **Sleeper bus:** bunks (4–15) and restroom/shower are confirmed. Still needed: how many seats, and is there a private artist room / queen bed on every bus or only some?
3c. Is there a real "punctuality guarantee"? If yes, what are its terms?
3d. Is gratuity included in quotes? Which months are peak wedding season for you?
4. Permission to keep the 3 testimonials with names (including the Disney On Ice one).
5. USDOT and MC numbers to show next to the "DOT COMPLIANT" badge — whose numbers are they (Cascade's or partner operators')?
6. Keep all blog posts? (Agent will list thin ones.)
7. Is "average response time 15 minutes" and "the quote is final, no hidden fees" still true?
8. City buttons: OK to show a small icon so visitors can tell "has a page" from "opens the quote form"? (Section 7.7)
9. When should the Band Tour Bus service page be added? (Section 6.2)
10. Opening hours to show in schema and on the Google Business Profile (24/7?).

**Waiting on the SEO consultant:**
- Schema markup document (Section 9.5)
- Hierarchical sitemap structure (Section 9.6)
- Content structure for location pages and other pages (Section 8.6)
- Final `llms.txt` text (Section 9.6)
- GTM snippet confirmation and list of conversion events (Section 9.8)

---

## 16. Reference: data summary

- **710 city pages kept in 48 state areas** = 656 enquiry pages + 54 traffic pages. (The spreadsheet lists 712; the 2 Puerto Rico pages, Rincon and Arecibo, were removed by the owner.) Source: `Cascade_Pages_To_Keep (1).xlsx` (tabs: Summary, 4. By State, 1. Keep – Enquiry pages, 2. Keep – Traffic pages).
- **Enquiry pages (656):** cities where customers sent quote requests (745 enquiries). Priority: **High 27** (3+ enquiries, or 2+ with clicks before the drop — build first), **Medium 73**, **Standard 556**.
- **Traffic pages (54):** no enquiry, but 3+ Google clicks in May–Aug 2026 (before the spam update). Examples: Kings Mountain NC, Rhinelander WI, Ellensburg WA, Cumberland WI, Greenwood MS.
- Four states have only a traffic page: Arkansas (Benton), Iowa (Muscatine), Nebraska (Sidney), South Dakota (Deadwood).
- Top states by pages kept: NY 56, WI 46, PA 36, MI 32, NC 31, TX 30, GA 29, VA 27, OH 26, WA 26.
- Top enquiry cities: Park City UT (7), Kailua-Kona HI (4), Shelton CT (4), then Alexandria MN, North Conway NH, Grand Junction CO, Newry ME, Hood River OR, Weirton WV, Hanover NH, New York City (3 each).
- About 19,000–25,900 other city pages are removed (410).
- Slugs on the live site use full spellings: `saint-petersburg`, `mount-kisco`, `east-saint-louis`, `saint-joseph`, `mount-carmel`, `mount-juliet`, `port-saint-joe`, `saint-germain`, `saint-croix-falls`, `sault-sainte-marie`. The JSON uses the live slugs. Display names need correct capitals (e.g. "McMinnville", not "Mcminnville").
- The spreadsheet's Summary tab mentions a "3. Core pages" list (5 pages: home, service and other non-location pages with clicks). That tab is not in the file — all main pages are kept anyway (Section 6.1).

---

## 17. Growth and Google-safety strategy

### 17.1 The principles
1. **Fewer, better pages.** Every page must help a real customer plan a real trip.
2. **Proof of real experience.** Real photos, real venues we pick up at, real testimonials, real business details.
3. **One set of facts everywhere.** Same address, phone, years, fleet description on the site, Google Business Profile, directories and social profiles.
4. **Grow steadily after launch.** The 710 existing city URLs are refreshed together at launch; any new cities after that are added at a controlled weekly pace.
5. **Measure, then improve.** Pages that don't perform get improved first, removed last.

### 17.2 Launch: everything at once
**Owner decision:** launch the whole new site in one go — all main pages plus **all 710 kept city pages**.

Why this is safe:
- These 710 URLs **already exist and are already indexed** on an old domain. At launch they are the same addresses with much better content.
- The site looks the same to visitors, so there is no "new site" shock — only better pages and far fewer thin ones.
- At the same moment, ~25,900 thin city pages go away (410), which removes the main problem.
- Cities without a page are still listed on their state page as booking-form buttons, so visitors from any town can still ask for a quote.

What must be true before launch day:
| Check | Required |
|---|---|
| All 710 city pages | `approved` and passing the quality gate (Section 8.7) |
| State pages, 7 services, 7 fleet, home, about, contact | Complete and approved |
| Redirect/410 map | Every old URL accounted for (Section 10) |
| SEO consultant's roadmap | Every "DEV" item done (Section 20) |
| Speed & SEO checks | PageSpeed above 80; schema valid; no broken links |
| Baseline saved | Search Console clicks, impressions, indexed pages, and monthly quote requests exported before launch |

After launch:
- Submit the new sitemap index in Search Console the same day.
- Watch the "Pages" (indexing) report weekly: removed pages should drop out over a few weeks; the 710 should stay indexed.
- Expect ups and downs for 4–8 weeks while Google recrawls. Don't make big changes during that time unless something is broken.

### 17.2b Long-term plan: adding more city pages (owner's goal)
The owner's goal is to grow from 710 toward **every US city we cover**, step by step from the admin. The old domain's age does not protect against Google's spam rules — the same domain was hit for having too many swapped-name pages. So growth must follow these rules (the admin enforces them, Section 19.6):

1. **Same quality bar for every new city** — verified City Profile, its own photo, unique local content, passing the quality gate.
2. **Add cities in order of real demand:** (a) cities whose **booking-form button** on a state page brings enquiries — the button click data shows exactly which cities deserve a page next; (b) big metro areas and airports; (c) event/wedding/ski/tour destinations; (d) smaller towns last.
3. **Pace limit** in the admin (default **max 100 new location pages per week**, owner can change it). Start about 6–8 weeks after launch.
4. **Health check before each new batch:** at least 80% of published city pages are indexed, and city pages as a group are gaining impressions. If not, pause and improve existing pages first.
5. When a city gets a page, it moves from the button list to the top list on its state page automatically.
6. Realistic expectation: a few hundred high-quality pages a year is a strong pace.

### 17.3 Growth engines (what actually brings new business)
1. **Become the go-to brand for band tour buses** (our core business). Build a band-tour section around `/fleet/sleeper/` (and a `/services/band-tour-bus/` page when it is added, Section 6.2): guides tour managers search for (how sleeper bus tours work, bunk layouts, driver hours and relief drivers, trailer and gear, how to plan routing between shows, what a tour bus quote includes). Add tour case studies **only with client permission**. This is where we can be the real expert, which Google rewards.
2. **Google Business Profile** at the South Ozone Park address: correct category, services, photos of real buses, posts monthly. Ask every happy customer for a Google review (simple follow-up email after each trip, via Resend). Reply to every review.
3. **Real reviews on the site:** show real Google reviews/testimonials (with permission). Only add review schema for reviews actually shown on the page.
4. **Earn real links and mentions (never buy them):** get listed as a transport vendor with wedding venues, hotels and ski resorts we already serve (`pickup_places_seen` in the data is a ready list), event planners, school districts, chambers of commerce, and bus industry associations/directories. Offer tour managers and planners a useful planning checklist they'd link to.
5. **Seasonal content calendar (2–4 helpful posts a month):** ski season (Nov–Mar), prom season (Mar–May), wedding season (May–Oct), school trips (Sep–Nov, Mar–May), touring season. Each post links to the relevant service and city pages.
6. **AI search (ChatGPT, Google AI Overviews):** clear factual answers on service and city pages (FAQ blocks, specs tables, consistent business facts). These get quoted by AI tools.
7. **Turn visitors into quotes:** short quote form on every page, click-to-call on mobile, fast replies (keep the 15-minute promise), and track which pages bring quotes (page URL + UTM sent with every lead).

### 17.4 Never do (these are what get sites hit in Google updates)
- Mass-publish location pages, or pages where only the city name changes.
- Auto-generate pages or blog posts with AI and publish without real facts and human review.
- Buy links, join link networks, or swap links in bulk.
- Fake reviews, fake testimonials, fake numbers, AI-generated "photos" of the fleet.
- Keyword stuffing, hidden text, or one page per tiny keyword variation ("bus rental", "coach rental", "charter rental" for the same city).
- Change URLs again after launch without a strong reason.
- Panic-delete good pages after an update.

### 17.5 Monitoring and what to do when Google updates
- **Weekly (first 3 months after launch, then monthly):** Google Search Console — pages indexed vs. submitted, crawl errors, top queries, clicks per page type (service / fleet / state / city); quote form submissions by page.
- **Monthly:** list the 20 weakest pages (impressions but no clicks, or not indexed) and improve them (better local facts, photos, FAQs) before publishing more.
- **When a Google update is announced:** wait until it finishes rolling out (about 2 weeks) before judging. Compare before/after by page type. Check the Manual Actions report. If one group of pages dropped, improve that group; don't change the whole site.
- **Set the baseline before launch** (current clicks, impressions, monthly quote requests) so growth can be measured honestly. Recovery and growth usually take **3–6+ months**.

### 17.6 What success looks like (measure against the pre-launch baseline)
- 90%+ of submitted pages indexed.
- Monthly quote requests back above the pre-drop level, then growing.
- City pages ranking for "{city} charter bus / bus rental" in the states with the most inquiries.
- Band tour pages ranking for tour-bus searches nationally.
- Growing number of Google reviews and real backlinks from venues and planners.

---

## 18. Instructions for running the agent (for the owner)

### 18.1 One-time setup
1. Create an empty project folder, e.g. `cascade-website`, and open it in VS Code.
2. Put these files in it:
   ```
   cascade-website/
     CLAUDE.md                     ← Claude Code reads this automatically every session
     CASCADE_REBUILD_BRIEF.md      ← the full specification (this file)
     data/locations-keep.json
     data/pages-to-keep.csv
     docs/live-reference/html/     ← page code of six live pages (already in the zip)
     docs/live-site-audit.md
     data/site.json
     public/images/originals/      ← add your real photos here any time (naming: Section 3.5)
   ```
   `CLAUDE.md` can be three lines: "Read CASCADE_REBUILD_BRIEF.md before any work. Follow Section 0. Explain everything in simple English and ask before any action outside this folder."
3. Open the VS Code terminal and start Claude Code with `claude`.
4. Paste the prompts below **one phase at a time**. Don't start the next phase until you've approved the current one.

### 18.2 Prompts to paste (one per phase)

**Phase 1 — Setup & capture the live site**
```
Read CLAUDE.md and CASCADE_REBUILD_BRIEF.md fully. Then do Phase 1 only (Section 14):
set up the Next.js + TypeScript project. Capture the live site read-only (do not change it):
screenshots of every page type at phone, tablet and desktop size (Section 4.1), the theme
values into docs/theme-tokens.md, the logo, favicons and photos (Section 3.4-3.5), and the
text of the main pages. Read every live state page and the live sitemap and save every city
name per state in data/all-cities.json (Section 7.7). Save the full list of live URLs in
reports/url-map.csv. Write PLAN.md, QUESTIONS.md and PHOTOS_NEEDED.md. Do not deploy
anything. When done, stop and give me a plain-English summary and your questions.
```

**Phase 2 — Theme match**
```
Phase 2 only. Rebuild the header, footer, buttons, cards and every page template so they
look the same as the live site (Section 4). Do not redesign anything. Fix only the hidden
things: heading order, breadcrumbs, menu links. List any animation changes you suggest and
wait for my OK before making them. Show me side-by-side screenshots (live vs new) for every
page type on phone and desktop, and the heading outline of each template. Stop for approval.
```

**Phase 3 — Core pages**
```
Phase 3 only. Build Home, About, Contact (with the exact booking form from Section 7.9,
sending through Resend in test mode), the Services hub + 7 service pages, the Fleet hub +
7 fleet pages, FAQs, blogs, legal pages, the 404 page and the HTML sitemap page, following
Sections 6, 7 and 9. Keep the live theme. Use the page formats in Sections 7.2 and 7.4, fix
every error in Section 7.5b, write the text by the rules in Section 12, and add the
Trustpilot widget (Section 7.12). Use only the confirmed facts in Section 15.
Run lint, typecheck, build and PageSpeed checks. Stop and show me the results.
```

**Phase 3b — Admin dashboard**
```
Phase 3b only. Install Payload CMS inside this Next.js app and build the admin dashboard
from Section 19, including the extra requirements in Section 19.9. Import the existing
pages, data/locations-keep.json and data/all-cities.json as drafts. Write
docs/ADMIN_GUIDE.md in plain English. Stop and show me how the SEO manager edits a page,
edits meta tags and schema, adds a redirect, and adds a test city page.
```

**Phase 4 — Locations framework**
```
Phase 4 only. Build the Locations hub and every state page with the two-group city list
from Section 7.7: cities from data/locations-keep.json on top as links to their pages, all
other cities from data/all-cities.json below as buttons that open /contact/ with the
Pick-Up Location pre-filled. Same method for every state. Build the city page system
(Section 7.8 and Section 8), nearby-cities logic, the quality-gate script (Section 8.7) and
the sitemaps (Section 9.6). Create content/locations/archetypes.csv with a suggested
archetype for every kept city. Show me the Ohio and New York state pages on phone and
desktop and prove the button-to-form pre-fill works. Do not write city page text yet. Stop.
```

**Phase 5 — Location content (all 710 cities)**
```
Phase 5 only. All 710 cities in data/locations-keep.json must be finished before launch.
Work in priority order: High, then Medium, then Standard, then Traffic, state by state
inside each priority. For each city: research and fill its City Profile in the admin with
verified facts and source URLs, then write the page following the Park City example in
Section 8.5. Use pickup_places_seen only after checking each name is real. Never publish
private addresses or customer names. Run the quality gate. When one batch is done, stop
and give me the list of pages and the quality report. Mark pages approved only after I say so.
```

**Phase 6 — Redirects & SEO checks**
```
Phase 6 only. Build the 410 and redirect rules from Section 10 and the www/http redirects
from Section 9.1. Check canonicals, robots meta tags, schema, GTM and conversion events,
llms.txt, robots.txt and the sitemaps. Run a broken-link check and a full crawl of the
preview site. Produce reports/url-map.csv showing what every old URL now does, and fill in
the Section 20 checklist with Done / Not done for every row. Stop and show me the reports.
```

**Phase 7 — Launch (only when I say "go live")**
```
Prepare the launch checklist from Sections 14 and 17.2. Do not deploy or change DNS until I
type "go live" in this session. After launch, list exactly what I need to do in Google Search
Console (submit the sitemap index, check coverage) in plain English.
```

**After launch — new city pages (start 6–8 weeks after launch)**
```
Suggest the next batch of new city pages in the order from Section 17.2b: cities whose
booking-form buttons brought enquiries first, then big metros/airports, then event/wedding/
ski/tour towns. Check the health rules first and tell me if we should pause. Build their
City Profiles and pages as drafts in the admin, run the quality gate, and stop for my
review. Respect the weekly pace limit.
```

### 18.3 Useful commands while working
- "Summarize where we are" → the agent reads PROGRESS.md and tells you.
- "Show me the page for {city}" → it runs the site locally and gives you the link/screenshots.
- "Explain that in simple English" → any time something is unclear.
- If the agent wants to do something you didn't ask for, say **"stop — ask me first."**

---

## 19. Admin dashboard (CMS) for the SEO team

The SEO specialist and content team must be able to manage **everything** on the site without a developer: page content, meta tags, keywords, schema, internal links, redirects, tracking, and **new pages — especially new location pages**. This section also covers the SEO consultant's "CMS Requirement Checklist" (Section 19.9).

### 19.1 Platform
- **Payload CMS 3**, running inside the same Next.js project, at `https://cascadecharterbus.com/admin`.
- Use Payload's official plugins where they fit (verify current versions): SEO fields, redirects, nested docs (state → city), form submissions, search. Build custom fields for anything missing.
- The admin area must be `noindex`, blocked in `robots.txt`, protected by login, and never linked from the public site.

### 19.2 Users and roles
| Role | Can do |
|---|---|
| **Owner / Admin** | Everything, including users, settings, pace limit, deleting content |
| **SEO Manager** | Edit all pages and SEO fields, schema, internal links, redirects, sitemap settings; create new location pages; publish pages that pass the quality gate |
| **Content Writer** | Create and edit drafts; cannot publish or change redirects/schema |
| **Viewer** | Read-only, sees reports |
Security: strong passwords, **two-factor login (2FA)**, login rate limiting, automatic logout, and an **activity log** (who changed what, when) on every collection.

### 19.3 What can be managed (collections)
| Collection | What the team can edit |
|---|---|
| **Pages** (Home, About, Contact, Services hub, Fleet hub, Locations hub, FAQ, legal, any new page) | Page builder with approved blocks (Section 19.4), hero, text, images, FAQs, CTAs |
| **Services** (7 at launch, can add more) | All content, recommended vehicles, FAQs, related services, photos |
| **Fleet** (7 at launch, can add more) | Capacity, amenities, specs table, gallery, FAQs |
| **States** | Intro, metros, airports, FAQs; the **top list** (cities with pages) and its order; the **"other cities" button list** (add, rename or remove a city name) — Section 7.7 |
| **Cities / Locations** | Everything in the City Profile (Section 8.2): facts + source links, archetype, hero photo, section order (drag and drop from the section library, Section 8.3), local copy, FAQs, nearby cities, status |
| **Blog posts & categories** | Full editor, author, date, related services/cities |
| **Testimonials / Reviews** | Real reviews with name (if permission), source, date, linked service/city |
| **Media library** | Upload photos (auto-resize to AVIF/WebP, alt text required, GPS data removed), credit/licence field |
| **Redirects** | Add/edit 301, 302, 307, 308 and 410 rules; bulk import/export CSV; warning if a redirect points to a missing page or creates a loop |
| **Quote requests** | View form submissions (also emailed via Resend), mark status (new / quoted / booked / lost), export CSV |
| **Off-page SEO tracker** | Lists to track work done off the site: backlinks earned, directory/citation listings (name, URL, NAP checked), Google Business Profile posts, review requests sent, outreach to venues/planners |
| **Site settings** | Business facts (address, phone, email, years, socials, USDOT/MC) used everywhere from one place; header and footer menus; default SEO and Organization schema; analytics IDs; pace limit for new location pages |

### 19.4 Page editing (for non-developers)
- Block-based editor using only **pre-designed blocks** that match the current site theme (hero, text, image + text, fleet cards, service list, city list, FAQ, testimonial, CTA, comparison table, map, gallery). The team can add, remove and reorder blocks but can't break the design.
- **Drafts, version history and restore**, autosave, side-by-side comparison of versions.
- **Live preview** of the page on desktop and mobile before publishing.
- **Scheduled publishing** (publish on a date/time).
- On publish, the page updates on the live site within about a minute (on-demand rebuild of just that page, plus the sitemap and any pages that link to it).

### 19.5 SEO tools on every page/document
- **Meta title** and **meta description** with live character counters and a Google search-result preview.
- **URL slug** editor — changing a published slug automatically offers to create a 301 redirect from the old URL.
- **Canonical URL** override, **robots** setting (index/noindex, follow/nofollow), include/exclude from sitemap, sitemap priority.
- **Focus keyword + secondary keywords** (used for the on-page checklist below; never shown or stuffed on the page).
- **Open Graph / social** title, description and image.
- **Schema (JSON-LD):** automatic schema per page type (Section 9), plus a **custom schema editor** to add or override JSON-LD, with JSON validation and a "Test in Google Rich Results" link. Block review/rating schema unless the reviews are shown on the page.
- **Internal links:** choose related pages from a search box (not typed URLs), "nearby cities" and "related services" pickers, and an **internal links report** showing which pages link to this one (and orphan pages with no links in).
- **On-page checklist** shown while editing: title/description length, one H1, heading order, focus keyword in title/H1/first paragraph (naturally), alt text on all images, word count, number of internal links, duplicate-title warning.
- **Breadcrumb label** override.

### 19.6 Adding a new location page (the most important workflow)
1. SEO Manager clicks **"New city"**, picks the state, types the city — the slug is created automatically (`/locations/{state}/{city}/`) and checked for duplicates.
2. Fills the **City Profile** (airports, landmarks, venues, events, driving notes, sources), picks the archetype, uploads the hero photo, arranges sections from the library, writes the local copy and FAQs. Optional: an "AI draft" button may suggest a first draft **from the verified profile only**, which must be edited by a person before it can be submitted.
3. Clicks **"Run quality check"** — the same gate as Section 8.7 (unique content, similarity to other city pages, local facts with sources, own photo, unique title/H1, nearby links). Failing items are listed in plain English.
4. Only pages that pass can be published, and only by SEO Manager or Owner.
5. The **weekly pace limit** (Section 17.2b, for cities beyond the original 710) is enforced: when it's reached, new pages wait in a "Ready to publish" queue and publish automatically next week (or the Owner can override).
6. On publish: page goes live, sitemap updates, **the city moves from the "other cities" buttons to the top list on its state page** (real link instead of a booking-form button), nearby city pages update their links, and any old 410/302 rule for that URL is removed automatically.
7. **Bulk import:** CSV/JSON import creates **drafts only** (never published), so large batches still go through the quality gate one by one.

### 19.7 SEO dashboard (home screen of the admin)
- Counts: published / draft / waiting pages by type; pages failing the quality check; orphan pages; pages missing meta or alt text; duplicate titles.
- Location expansion status: cities published this week vs. pace limit, health check status (Section 17.2b).
- Latest quote requests by page and service.
- Optional (Phase 8+): connect Google Search Console API to show clicks, impressions and indexing per page inside the dashboard.

### 19.8 Technical requirements for the admin
- Content stored in PostgreSQL with **daily automatic backups** (keep 30 days) and a one-click export.
- The public site stays fast: admin code is never loaded on public pages.
- All admin changes are logged; deleting a published page asks what to do with its URL (301 to another page or 410).
- Write a short **Admin Guide** (`docs/ADMIN_GUIDE.md`, plain English with screenshots) covering: editing a page, adding a city, SEO fields, schema, redirects, and publishing.

### 19.9 Extra requirements from the SEO consultant's CMS checklist
*(His checklist was written from a template that mentions a "Cleaning Services website" in two places — read those as "Cascade Charter Bus". All 17 points apply.)*

| Checklist point | What to build |
|---|---|
| 1. Rendering & crawlability | Pre-rendered pages (SSG/ISR), all SEO content in the first HTML, no empty loading states indexed, real 404 and 410 pages, correct status codes (Rule R10, Section 10) |
| 2. Metadata & canonical | Self-referencing canonical on every page + custom canonical field; unique title and description; fields for title, description, canonical, robots, Open Graph title/description, social image; `noindex, follow` option; URL parameters never create duplicates (Section 9.2–9.4) |
| 3. Sitemap & robots | Dynamic XML sitemap (main, service, location, blog pages), noindex and deleted pages left out automatically, robots.txt with sitemap address, `/admin/` and `/api/` blocked (Section 9.6) |
| 4. Redirect manager | 301 plus 302, 307, 308 and 410; no chains or loops (warn before saving); CSV import/export; when a slug changes, offer a 301 automatically |
| 5. Article publishing | Blog editor with: H1, URL slug, **modern rich-text editor (Notion-like: type "/" for blocks)**, featured image, editable ALT text on upload, image title/caption, social image, SEO title, meta description, canonical, publish date, updated date, author, **categories (multi-select)**, draft/published, scheduled publishing, noindex option |
| 6. Internal linking | Easy internal links inside the editor (search for a page, not typed URLs) between services, locations, blog posts and other pages; "related content" pickers |
| 7. SEO settings for all pages | The same SEO fields on: homepage, service pages, location pages (state and city), blog posts, static pages and **blog category pages** |
| 8. Schema | Site-wide schema box + per-page schema box, valid JSON-LD only, no duplicate output, editable without a code change. Types: Organization, LocalBusiness, Service, FAQPage, BreadcrumbList, Article (Section 9.5) |
| 9. Breadcrumbs | Visible breadcrumbs + breadcrumb schema, correct hierarchy, label can be changed per page. Example: Home › Services › Wedding Shuttle Bus Rental |
| 10. Images | Next.js image optimization; **uploads in PNG/JPG or any other format are automatically converted to WebP** (AVIF where supported); responsive sizes; ALT text required; **upload size limit** (reject or shrink very large files); lazy load below the fold; hero image prioritized |
| 11. Core Web Vitals | Section 11 |
| 12. Fonts | `next/font` (not `@next/font`), `display: swap`, few families and weights (Section 3.2) |
| 13. Favicons & app assets | `app/icon.png`, `app/apple-icon.png`, `app/manifest.json`, site name, theme color, Apple touch icon (Section 3.4) |
| 14. URLs & slugs | Clean lowercase URLs with trailing slash, editable slugs, automatic check that a slug is unique, no IDs or parameters in URLs, automatic redirect when a slug changes |
| 15. Local SEO | Service pages, state and city pages; one name/address/phone from Site settings; **opening hours** field; **service-area** management (the state/city lists); Google Map embed block where needed (lazy-loaded); LocalBusiness schema; support for more than one business location if added later |
| 16. Reusable content modules | Blocks the team can place on any page: FAQ (with FAQ schema), testimonials/reviews, CTA, service area (city buttons), related services, related articles, image gallery / before-after images |
| 17. Tracking & integrations | GTM (`GTM-5WTG8HBP`), GA4, Search Console verification field, Microsoft Clarity or other tools via GTM, conversion events, cookie consent, controlled "tracking scripts" box (Section 9.8) |

### 19.10 Everything is adjustable (owner's rule)
Nothing the SEO team may want to change is fixed in the code. From the admin, without a developer, they can change:
- All text, headings, images, buttons and FAQs on every page; section order on every page.
- Business facts used site-wide from one place: years of service ("5+"), address, phone, email, opening hours, social links, sleeper bunk range, fleet numbers.
- Header and footer menus, top bar text, footer text.
- Titles, descriptions, canonicals, robots settings, social images, schema — per page and site-wide.
- State pages: the top list (cities with pages) and the button list (cities without pages) — add, remove, rename, reorder; the headings and the helper line above each list.
- Where a city button goes (default `/contact/`), and the text pre-filled in the form.
- Redirects and 410 rules; sitemap inclusion; `robots.txt` extra lines; `llms.txt`.
- Tracking: GTM ID, verification codes, consent banner text.
- Trustpilot widget code and where it shows.
- Booking form: the email address leads go to, the confirmation email text, the success message. (The form fields themselves stay as they are — Rule R3 — unless the owner asks.)
- Animations: one on/off switch for scroll animations.
Each setting has a short plain-English help note beside it.

---

## 20. SEO consultant's Technical SEO Roadmap — every item and where it is covered

From `Technical_SEO_Implementation_Roadmap.xlsx` (one tab, 18 items). **Every row is required. The site does not launch until every "Dev" row is Done and checked** — the agent proves each one with a test or screenshot in `reports/seo-roadmap-check.md` and fills the last column in Phase 6. Rows owned by SEO/Marketing are listed so nothing is forgotten; the agent prepares whatever the site must provide for them.

| # | Issue found on the live site | Fix | Who | Section | Status |
|---|---|---|---|---|---|
| 1 | Site opens on www and non-www, https and http | Main address `https://cascadecharterbus.com`; everything else 301 to it | Dev | 9.1 | To do |
| 2 | Every page is missing a canonical tag | Self-referencing canonical on every page, automatic | Dev | 9.2 | To do |
| 3 | `meta name="robots"` tag is missing | Add `index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1` to all indexable pages | Dev | 9.3 | To do |
| 4 | 404 page has no proper title/description | Title "Page Not Found \| Cascade Charter Bus" + the given description | Dev | 7.11 | To do |
| 5 | No schema markup | Built-in schema; document from SEO consultant | Dev | 9.5 | To do |
| 6 | Heading structure is not in order on the whole site | Fix headings on every page with the SEO consultant | Dev | R11, 9.4 | To do |
| 7 | GTM not attached | Add container `GTM-5WTG8HBP` to every page | Dev | 9.8 | To do |
| 8 | No conversion tracking | Track key events in Analytics | SEO | 9.8 (events sent by the site) | To do |
| 9 | Speed not optimized | LCP and speed fixed; score above 80 | Dev | 11 | To do |
| 10 | No breadcrumbs on city and fleet pages | Add breadcrumbs to every city and fleet page | Dev | 9.7 | To do |
| 11 | CMS requirements | Follow the CMS Requirement Checklist | Dev | 19, 19.9 | To do |
| 12 | Remove other pages | 410 on all pages not in the keep list; keep and rebuild the listed pages | Dev | 10, 16 | To do |
| 13 | Location pages have template content with only the city name changed | New structure and local content for location pages and other pages | SEO + Dev | 8 | To do |
| 14 | No Google Business Profile | Create it with the owner (South Ozone Park address) | SEO | 17.3 | To do |
| 15 | No hierarchical sitemap | Sitemap index with child sitemaps; structure from SEO consultant | Dev | 9.6 | To do |
| 16 | llms.txt not optimized | Put the SEO team's llms.txt in the site root | Marketing + Dev | 9.6 | To do |
| 17 | XML sitemap is linked in the footer | Create an HTML sitemap page and link that in the footer instead | Dev | 6.1, 9.6 | To do |
| 18 | *(Owner's addition, Nov 9)* State pages must keep a button for every city | Kept cities on top (links to pages); all other cities as booking-form buttons | Dev | 7.7 | To do |
| 19 | *(Owner's addition)* Service and fleet pages have wrong or conflicting facts | Clearer page format; one data source; fix the list of errors | Dev + Owner | 7.2–7.5b | To do |
| 20 | *(Owner's addition)* Show Trustpilot reviews | Official Trustpilot widget on key pages | Dev + Owner | 7.12 | To do |
| 21 | *(Owner's addition)* Content must be unique, short and human | Writing rules + human review + similarity check | SEO + Dev | 8, 12 | To do |
