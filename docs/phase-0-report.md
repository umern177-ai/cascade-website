# Phase 0 — What exists today (audit report, Nov 24)

> No code was changed. This answers the six questions in ADMIN_PANEL_INSTRUCTIONS.md
> section "Phase 0", against the actual source code.

## 1. How pages are built today

Framework: Next.js 16 App Router + React 19, static/ISR rendering, hosted on Vercel.
Rendering layers, from "hard" to "soft":

| Layer | Source | Admin-editable today? |
|---|---|---|
| Site facts (phone, email, address, GTM id…) | `data/site.json` → `SITE` object | No (file edit = code change/deploy) |
| Services (12) + Fleet (7) | `lib/site-data.ts` — hard-coded arrays | No |
| Locations (48 states, 710 kept cities) | `data/locations-keep.json` + `data/kept-slugs.json` | No |
| City page structured content | `data/city-pages.json` → `PremiumCityPage` | No (bulk content) |
| City page admin fields (H1, intro, FAQs) | `lib/admin/page-fields.ts` city fields + `data/admin/page-content.json` | Yes |
| Blog: 3 code-seeded guides | `lib/blog-data.ts` | Override-only (edit via admin) |
| Blog: admin posts | `data/admin/blog.json` | Yes |
| Meta tags (per page) | `data/admin/meta.json`, `data/admin/city-meta.json` | Yes |
| Sitewide schema / head code / GA4 / Clarity | `data/admin/site-config.json` | Yes |
| Redirects | `data/admin/redirects.json` (merged by `next.config.ts`) | Yes (but needs rebuild to apply) |
| Home/hub copy + FAQs | `data/admin/site-content.json` + `page-content.json` | Yes |
| History log | `data/admin/history.json` | Yes (read-only view) |

Instant-publish plumbing already exists: saves call `revalidatePath()` on the
exact affected paths (`app/admin/actions.ts`, API routes), so on the localhost
production server an edit is live within seconds. Legal pages (privacy, terms,
cancellation) are static components — body copy not editable.

## 2. Hard-coded things the admin cannot edit yet

1. **Header/footer** — logo, nav links, menu structure, "Get a Quote" label, copyright (components use `SITE.*`).
2. **Company facts** used everywhere — phone, email, address, "5+ years" (all through `SITE`).
3. **Service page copy** — section headings/intros for the 12 services (defaults in code; fields exist only for a subset).
4. **Fleet page copy** — same pattern for the 7 vehicles + the vehicle/pressence images (`data/fleet-photos.json`).
5. **City page bulk content** — the premium sections come from `data/city-pages.json` (generated research content); only H1/intro/FAQs are admin-editable.
6. **State hub copy** — heading/intro defaults in code.
7. **Legal pages** (privacy, terms, cancellation) — body text in components.
8. **Blog hub page** copy; there are **no category pages** yet.
9. **404 page** copy.
10. **Fleet/service photos** — no Media Library; images referenced by manifest files.
11. **Reusable blocks** (why-choose-us, CTA bands, Trustpilot section) — not yet centralized.

## 3. Why "All pages" stops at 200

`app/admin/(protected)/pages/page.tsx` line 71: `rows.slice(0, 200)` is a **UI-only
cap**, followed by the hint "Showing the first 200 of N". The catalog itself
already builds **every** page (core + services + fleet + blog + 48 states + 710
cities = 786+) on each load, and **search/filters run before the cap**, so
searching works across all pages — only the table display truncates. Fix =
real pagination (server-side or at least paginated rendering), no data change needed.

## 4. Why the blog module "does not work"

Root cause is the **storage, not the blog code**:
- On **localhost**, everything works (verified in testing): create, edit, save, slug
  uniqueness (409 on collision), auto-301 on slug change, schedule `publishAt`,
  draft/publish, image upload to `public/uploads/…` with WebP conversion, deletion hidden.
- On **Vercel hosting** (where the SEO person tested), the store writes to files under
  `data/admin/…` and `public/uploads/…`. Serverless file systems are **read-only**, so:
  - saving a post / publishing / creating → write throws (EROFS), silently caught → **change not persisted**,
  - image upload → fails,
  - even a "successful" write would be per-instance ephemeral (gone on the next cold start).
- No database exists yet; nothing is persisted on the host. This single root cause also
  breaks meta saves, redirects, schema edits — every admin save on the host.
- Required fix: move the admin store to Vercel Blob or a DB before the blog (and
  everything else) works for the writers on a hosted URL. (Planned: Phase 2 does the
  import into the durable store.)

## 5. How the quote form works today

`POST /api/quote/` (`app/api/quote/route.ts`):
1. Rate limit (5/min/IP, in-memory), honeypot field check, server-side validation of all required fields, past-date check.
2. Builds a lead object **including referrer + UTM params** — good news for section 5.
3. **Appends to `.lead-queue/leads.jsonl`** (dev-only artifact; on Vercel the write
   fails silently in a try/catch — so on the host, **nothing is saved**).
4. Emails via **Resend only if** `RESEND_API_KEY` + `QUOTE_TO_EMAIL` are set.
5. **No database, no admin module, no lead is ever shown anywhere.** Every inquiry
   lives only in the email (when configured) or in the void.
→ New Quote Inquiries module must persist before emailing (Phase 1).

## 6. How redirects work today

- Admin-managed rules (`data/admin/redirects.json`) are **real HTTP redirects** — merged
  into `next.config.ts` `redirects()` at **build time** (301/302 at the CDN, query
  strings preserved by Next). No JavaScript redirects anywhere.
- **Catch:** because they're build-time, an admin-added rule does **not** take effect on
  the host until the next deploy. There is no on-demand redirect application.
- Middleware adds policy redirects before the app runs: lowercase 301s; **410 Gone +
  `noindex`** for removed city URLs and Puerto Rico (from `data/kept-slugs.json`,
  baked at build; all 44 sampled legacy city URLs + PR verified 410 in testing).
- Missing vs the upgrade spec: 302/307/410 in the admin (410 exists only via data),
  wildcard rules, active/inactive toggle, hit counting, loop/chain detection, test tool,
  404 monitor, on-demand apply.

## Summary of blockers mapped to the plan

| Spec area | Blocker found |
|---|---|
| All pages (3) | UI cap at 200 rows (display only) |
| Blog (4) + all admin saves | File store is not durable on hosting — needs Blob/DB |
| Inquiries (5) | Nothing persisted; Resend-only; no module |
| Redirects (6) | Build-time application; no runtime redirect engine, no 404 monitor |
| Global content (3.7) / sections (3.3) | Copy in code (`lib/site-data.ts`, components) — needs the DB-move (Phase 3) |
