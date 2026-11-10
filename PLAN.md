# PLAN — Cascade Charter Bus website rebuild

Written before Phase 1, per CASCADE_REBUILD_BRIEF.md Section 0. Plain English, no jargon.

## What we are building

A new Next.js website for Cascade Charter Bus that:

- Looks and works **exactly like the live site** (www.cascadecharterbus.com) — same colors, fonts, header, footer, menus, booking form, section order. Visitors should not notice a redesign.
- Keeps only the **710 city pages** in `data/locations-keep.json`, each with real local content. Every other old city page returns "410 Gone".
- State pages keep a button for **every** city: kept cities on top (link to their page), all other cities below (open the booking form with the city pre-filled).
- Fixes every technical SEO problem on the SEO consultant's roadmap (Section 20) before launch.
- Adds an **admin dashboard** (Payload CMS) so the SEO team can edit everything — text, menus, FAQs, redirects, SEO fields, and add new city pages — without a developer.
- Uses only **confirmed facts** (Section 15 / `data/site.json`). No invented numbers, reviews or prices.

## Tech stack (same as the live site, plus the admin)

- **Next.js (App Router) + TypeScript**, static pages so Google sees all content in the first HTML.
- **Bootstrap 5 classes + small custom CSS + Lucide icons** — the same class names the live site uses, copied from the six page files in `docs/live-reference/html/`.
- **Inter font** loaded the modern way (`next/font`), self-hosted.
- **Payload CMS 3** inside the same app, at `/admin`, backed by **PostgreSQL**.
- Quote form → Next.js API route → **email via Resend** (test mode until the owner sets up Resend).
- GTM `GTM-5WTG8HBP`, hierarchical sitemaps, self-referencing canonicals everywhere.

This machine is ready: Node 26, npm 11, Python 3.12, git all installed.

## Where the project lives (owner to confirm)

I suggest building **inside this folder** `C:\Users\pc\Desktop\Cascade\cascade-website-files` — the Next.js app becomes the project root, next to the existing `data/`, `docs/` and brief files. Nothing outside this folder will be touched. (Alternative: a new folder `cascade-website` and copy the files in — your choice, say the word.)

## Phases (stop for approval after each, per brief Section 14)

| Phase | What I do | You approve |
|---|---|---|
| **1. Setup & capture live site** | Set up the Next.js project; take read-only screenshots of every live page type (phone/tablet/desktop) into `docs/live-reference/`; record exact theme values into `docs/theme-tokens.md`; download logo, favicons, photos; read every live state page + sitemap → `data/all-cities.json` (all city names per state, must happen while the old site is live); full URL list → `reports/url-map.csv`; write `QUESTIONS.md` + `PHOTOS_NEEDED.md`. | Plan + answers to my questions |
| **2. Theme match** | Rebuild header, footer, buttons, cards and every page template to match the live site exactly. Only hidden fixes (heading order, breadcrumbs, menu links). | Side-by-side screenshots, live vs new |
| **3. Core pages** | Home, About, Contact (exact booking form, working in test mode), Services hub + 7 service pages, Fleet hub + 7 fleet pages, FAQs, blogs, legal, 404, HTML sitemap. Fix every error in brief 7.5b. Trustpilot widget (once you send the embed code). Lint/typecheck/build/LinkSpeed clean. | Pages match the live look |
| **3b. Admin dashboard** | Payload CMS: all collections, SEO fields, schema boxes, redirects, quote requests, import of data files, quality gate built in, plain-English admin guide. | You (or SEO manager) edit a page end-to-end |
| **4. Locations framework** | Locations hub, all state pages with the two-group city list, city-button → booking-form pre-fill, city page template, nearby-city logic, quality-gate script, sitemaps, suggested archetypes file. | Ohio + New York state pages, pre-fill proof |
| **5. Location content** | City Profiles + pages for all 710 cities, priority order (27 High → 73 Medium → 556 Standard → 54 Traffic), state by state, quality gate passing, **you approve each batch**. | All 710 approved |
| **6. Redirects & SEO checks** | 410/301 rules, www/http redirects, canonical check, GTM + conversion events, llms.txt robots/sitemaps, broken-link check, full crawl, Section 20 checklist filled in. | Zero broken links, checklist all Done |
| **7. Launch** | Only when you type "go live". | Go-ahead |
| **8. After launch** | Weekly checks 8–12 weeks; then new city pages at a controlled pace (max 100/week) from the admin. | Ongoing |

## Animation changes I propose (brief 4.3 — nothing until you agree)

Keep the live site's `hover-lift` card effect and simple amber-button hovers as-is. Optionally add a very subtle fade-up on scroll for cards/sections (under 300 ms, disabled for people who prefer reduced motion, and one on/off switch in the admin). Nothing animated blocks the hero text or hero photo from appearing. I will not add anything flashier than that. **Tell me yes/no when you approve Phase 1.**

## What I need from you soon (not blocking Phase 1)

1. Confirm: build inside this folder? (my suggestion)
2. Trustpilot Business login → copy the **TrustBox embed code** from your dashboard and paste it to me; also tell me which plan the account is on.
3. Hosting: where is the site hosted now, and does it stay there?
4. Sleeper bus: seat count, and is the private artist room on every bus or only some?
5. Is the "quote is final, no hidden fees" line still true? "Response time 15 minutes"? Any real punctuality guarantee?
6. Wedding peak season: May–September or May–October? Is gratuity included in quotes?
7. Permission to keep the 3 homepage testimonials (with names, incl. Disney On Ice)?
8. Opening hours for the schema / Google Business Profile (24/7?).
9. When should the Band Tour Bus service page be added?
10. Search results / sitemaps: your SEO consultant should send — schema document, sitemap structure, location-page content structure, final llms.txt, GTM confirmation.

Full list will also live in `QUESTIONS.md`. Nothing above blocks Phase 1 except #1.

## The 4 rules I will never break

- Never touch the live site, DNS, hosting or any account without you saying so in that moment.
- Never invent facts — only confirmed facts from the brief and from you.
- Never publish private customer details; reviews only via the official Trustpilot widget.
- US states and DC only — no Puerto Rico anywhere.
