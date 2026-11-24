# Cascade Charter Bus — Admin Panel Upgrade Instructions

> Give this whole file to the AI coding agent. Put it in the project folder as `ADMIN_PANEL_INSTRUCTIONS.md` and say:
> "Read ADMIN_PANEL_INSTRUCTIONS.md. Start with Phase 0. Do one phase at a time and wait for my OK before the next phase."

---

## 0. The goal (read this first)

The admin panel is for our **SEO person and content writers**. They are not developers.

The main rule: **every word, image, heading, FAQ, link, meta tag and schema on the live site must be editable from the admin panel, and the change must go live without a code deploy.**

The site has about **790 pages** today and will grow toward **20,000 city pages** over time. Everything must work at that size: no hard limits, no "only 200 shown".

### Feedback from our SEO person that MUST be fixed
1. The redirect module is too basic. It needs to be much stronger (section 6).
2. "All pages" only shows 200 pages. It must show all pages (section 3).
3. There is no Quote Form submissions module. Every inquiry must be saved and shown in the admin (section 5).
4. The blog module does not work in the CMS. Writers must be able to edit existing posts and publish new ones (section 4).
5. The UI needs to look and feel better (section 10).

### Rules for the agent
- **Look at the code first.** Use the same framework, database, hosting (Vercel), styles, colors and logo that the project already uses. Do not switch stacks.
- **Do not break the live site.** Do not change any public page URL unless this file says to.
- **Work in phases** (section 12). At the start of each phase, tell me your plan: files, database changes, risks. Wait for my OK.
- **No deploy for content.** Content lives in the database. When something is saved, refresh only that page's cache (on-demand revalidation / ISR). The change should show on the live site within a few seconds.
- **Every admin page and admin API must check login.** Nothing in /admin or /api/admin can be opened without a logged-in user.
- At the end of each phase, run the test checklist for that phase and show me the results.

---

## Phase 0 — Check what exists (do this before writing any code)

Make a short report for me:
1. How pages are built today. Which content comes from the database, and which is still hard-coded in the code files?
2. A list of every hard-coded text, image or link that the admin cannot edit yet.
3. Why "All pages" stops at 200. (Most likely a fixed limit in the database query or the API.)
4. Why the blog module does not work. Show the exact error and which part fails: create, edit, save, image upload, publishing, or showing on the live site.
5. How the quote form works today. Does it only send an email through Resend? Is anything saved?
6. How redirects work today. Are they real server redirects (HTTP 301), or browser JavaScript redirects?

Do not fix anything in Phase 0. Just report.

---

## 1. Admin menu (new structure)

Use a left sidebar with grouped sections:

**OVERVIEW**
- Dashboard

**LEADS**
- Quote Inquiries (with a red badge showing the number of new, unread inquiries)

**CONTENT**
- All Pages
- Blog Posts
- Blog Categories
- Media Library
- Global Content (header, footer, phone, address, menus, reusable blocks)

**SEO**
- Meta Tags (bulk view)
- Redirects
- 404 Monitor
- Schema & Tracking
- Sitemap & Robots
- SEO Health Check

**SETTINGS**
- Users & Roles
- History Log
- Settings

---

## 2. Dashboard (/admin)

Show useful information at a glance:
- **Cards:** New inquiries (today / this week / this month), total pages, published blog posts, drafts, scheduled posts, active redirects, 404 errors this week, SEO issues found.
- **Recent quote inquiries:** last 5, with a "View all" link.
- **Top pages that bring inquiries:** the pages where most quote forms were sent this month.
- **Recent changes:** last 10 saves from the History Log (who, what, when).
- **Warnings box:** for example "12 pages are missing a meta description", "3 redirect chains found", "5 new 404 errors with traffic".
- **Quick buttons:** Add page, Write blog post, Add redirect, View inquiries.

---

## 3. All Pages (/admin/pages) — make EVERYTHING editable

### 3.1 Fix the 200-page limit
- Remove any fixed limit. Use **server-side pagination**: load 25 / 50 / 100 rows per page from the database, and keep counting the total.
- Search must look through **all** pages in the database, not only the loaded ones.
- Test it with 790 pages, and also with 20,000 fake pages, to make sure it stays fast.

### 3.2 Page list
- Columns: Page title, URL, page type, status (Published / Draft / Noindex), last edited (date + person), SEO score (green / orange / red), actions.
- **Filters:** page type (Static, Service, Fleet, State hub, City page, Blog, Other), state (for location pages), status, "missing meta description", "noindex", "edited in the last 7 days".
- Sort by title, URL, last edited, page type.
- Bulk actions: publish, unpublish, set noindex / index, export selected as CSV.
- "View live" button opens the page in a new tab.

### 3.3 Unified page editor
When you open a page, show **tabs**:

**Tab 1 — Content**
- Every part of the page as a **section** (block): hero, intro text, services list, fleet list, destinations, why choose us, testimonials, FAQs, call to action, etc.
- Each section shows its fields: heading, sub-heading, paragraphs (rich text editor), buttons (text + link), images (from the Media Library, with ALT text), lists.
- **Repeatable items:** FAQs, destination lists, feature lists and so on can be added, removed and **reordered by drag and drop**.
- Sections can be **shown / hidden**, **reordered**, **added** (from a list of allowed section types for that page template) and **removed**.
- The heading level (H1 / H2 / H3) is shown next to each heading. Only one H1 is allowed per page; warn if there are more.
- A word counter shows the total words on the page and per section.

**Tab 2 — SEO**
- SEO title (with a character counter, green between 50 and 60 characters).
- Meta description (counter, green between 140 and 160 characters).
- URL slug: when it is changed, **automatically create a 301 redirect** from the old URL to the new one, and show a message that this was done.
- Canonical URL (defaults to the page's own URL).
- Robots: index / noindex, follow / nofollow.
- OG title, OG description, OG image.
- **Google preview:** shows how the result will look in Google search.
- Focus keyword + secondary keywords (just for the SEO person's reference, plus a simple check: is the keyword in the title, H1, first paragraph and meta description?).

**Tab 3 — Schema**
- Automatic schema is turned on by default: Organization / LocalBusiness, BreadcrumbList, FAQPage (built from the FAQs on the page), Service (for service pages), Article (for blog posts).
- A field for extra custom JSON-LD for that page only, checked before saving. If the JSON is wrong, show the error and do not save.

**Tab 4 — Internal Links**
- A list of all links on this page (internal and external), with a warning on any link that goes to a 404 or redirected URL.
- "Pages that link here" (incoming links).
- Suggested pages to link to (same state, same service).

**Tab 5 — History**
- Every past version of this page, with who saved it and when.
- "Compare" shows the old and new text side by side.
- "Restore this version" button.

### 3.4 Saving, drafts and preview
- **Save Draft:** saves but does not change the live page.
- **Preview:** opens the draft version in a new tab (with a "PREVIEW" bar on top). Only logged-in admins can see it.
- **Publish:** puts it live and refreshes that page's cache right away.
- **Schedule publish:** pick a date and time.
- **Auto-save** a draft every 30 seconds while typing.
- Warn before leaving the page if there are unsaved changes.
- Ctrl+S / Cmd+S saves the draft.

### 3.5 Adding new pages
- **"Add Page"** button with a template picker: City page, State hub, Service page, Fleet page, Basic page.
- **City page template** must follow our "State and City Page Structure" document: the same sections, in the same order, with the word count targets shown next to each section.
- When a new city page is published, it is **automatically**:
  - added to its state hub page as a real link (at the top, above the other city buttons),
  - added to the sitemap,
  - given breadcrumb schema.
- **"Duplicate page"** button: copies the layout, but clears the content so we never publish duplicate text. Show a warning: "Write unique content before publishing."
- **Bulk create city pages from CSV** (for growing toward 20,000 cities): columns city, state, slug, title, meta description. They are created as **drafts only**, never published automatically.
- **Duplicate content check:** before publishing, compare the page text with other pages of the same type. If more than 60% of the text matches another page, show a warning.

### 3.6 Deleting / unpublishing a page
- Never delete without asking: **"Where should visitors go now?"**
  - Option A: 301 redirect to another page (suggest the state hub for city pages, or the parent page).
  - Option B: 410 Gone (page removed for good, nothing to replace it).
- Then create the redirect rule automatically.
- Deleted pages go to **Trash** for 30 days and can be restored.

### 3.7 Global Content (/admin/global)
Things that show on many pages are edited once here:
- Header: logo, menu links, phone number, "Get a Quote" button text.
- Footer: columns, links, address (12409 Linden Blvd, South Ozone Park, NY 11420-2013), phone, email, social links, copyright text.
- Company facts used everywhere: years in business ("5+ years"), phone, email, address. Pages use these as **variables**, so changing a fact here changes it on every page.
- Reusable blocks: Trustpilot reviews section, "Why choose us", the main call to action, etc. Edit them once and every page that uses them updates.

### 3.8 Find & Replace across the site
- Search for any text across all pages (for example "10+ years").
- Show every match with its page and section.
- Replace one at a time, or replace all after a preview.
- Everything is saved in the History Log and can be undone.

---

## 4. Blog (/admin/blog) — rebuild so it fully works

### 4.1 First, fix and move existing posts
- Find out why the blog is broken (Phase 0 report) and fix the root cause.
- If any existing blog posts live in code files (markdown, JSON or hard-coded), **import them all into the database** so they can be edited in the admin. Keep their **exact same URLs**, dates, images and meta tags.
- After the import, check that every old blog URL still opens with status 200. List any that do not.

### 4.2 Blog post list
- Columns: featured image thumbnail, title, category, author, status (Draft / Scheduled / Published), publish date, last edited, actions (edit, view, duplicate, delete).
- Search, filter by status / category / author, pagination (no limit).

### 4.3 Blog post editor
- **Title** (this becomes the H1).
- **Slug:** created automatically from the title and can be edited. If a published post's slug is changed → automatic 301 redirect from the old URL.
- **Rich text editor** with: H2, H3, H4, bold, italic, links (with an "open in new tab" option and a nofollow option), bullet and numbered lists, quotes, tables, images inside the text, YouTube embeds, a FAQ block, a call-to-action button block.
- **Images:**
  - Upload by drag and drop or from the Media Library.
  - Automatically converted to **WebP** and resized (max 1600px wide), with lazy loading.
  - **ALT text is required.** The post cannot be published if any image is missing ALT text.
- **Featured image** (required to publish) + ALT text.
- **Excerpt / short summary** (used on the blog list page and as the default meta description).
- **Categories** (pick more than one) and **tags**.
- **Author** (from the users list) with a short author bio. This is shown on the post and helps with trust (E-E-A-T).
- **Publish date** and **"last updated" date** (both shown on the post).
- **Status:** Draft / Scheduled (a future date keeps it hidden until then; publish it automatically at that time) / Published.
- **SEO tab:** same as page SEO (title, meta description, canonical, noindex, OG image, Google preview, focus keyword check).
- **Schema:** Article + BreadcrumbList automatically, plus FAQPage if the post has a FAQ block.
- **Related posts** (pick them, or fill them in automatically from the same category).
- Preview, auto-save, version history and restore (same as pages).
- **Reading time** calculated automatically.

### 4.4 Blog on the live site
- The blog list page (/blog) with pagination, category pages (/blog/category/name), and the single post page.
- New posts show up **right away** after publishing (refresh the cache for the post, /blog, and its category pages).
- Posts are added to the sitemap automatically, and removed from it when unpublished.
- RSS feed at /blog/rss.xml.

### 4.5 Blog categories (/admin/blog/categories)
- Add, edit and delete categories: name, slug, description, SEO title, meta description.
- If a category is deleted, ask which category its posts should move to, then 301-redirect the old category URL.

### 4.6 Blog test checklist
- Create a new post with 3 images in the text → publish → it appears on /blog within a few seconds.
- Edit an old post → save → the change shows live.
- Schedule a post for 10 minutes from now → it is hidden → it appears on time.
- Change a slug → the old URL gives a 301 to the new URL.
- Try to publish with an image that has no ALT text → it is blocked with a clear message.

---

## 5. Quote Inquiries (/admin/inquiries) — NEW module

### 5.1 Save every submission
- Every quote form submission is **saved to the database first**, then the email is sent through Resend (like today).
- If the email fails, the inquiry is still saved and marked "email failed". This way no lead is ever lost.
- Save: all form fields (name, email, phone, pickup/drop-off, dates, number of passengers, vehicle type, trip type, message, etc.), plus:
  - the **page URL** where the form was sent (so we know which city or service pages bring leads),
  - the referrer (where the visitor came from), and UTM source / medium / campaign if present,
  - device (mobile / desktop), date and time,
  - IP address (only for spam checks; do not show it to content writers).

### 5.2 Inquiry list
- Columns: date, name, phone, email, trip date, pickup city, vehicle type, source page, status, assigned to.
- **New inquiries are shown in bold** until opened, and the sidebar badge shows the number of new ones.
- **Status:** New → Contacted → Quote Sent → Won → Lost (with a reason) / Spam.
- Filters: status, date range, vehicle type, state, source page, assigned person.
- Search by name, email, phone or city.
- Export to CSV (all, or only the filtered ones).
- Bulk actions: change status, mark as spam, delete (Admin role only).

### 5.3 Single inquiry view
- All the details in a clean card layout.
- Buttons: click to call, click to email, copy details.
- **Notes:** the team can add internal notes with a date and the writer's name.
- Assign the inquiry to a team member.
- Activity timeline: received → opened → status changes → notes.

### 5.4 Reports
- Inquiries per day / week / month (simple chart).
- **Top source pages** (which pages bring the most inquiries). This helps decide which city pages to keep and improve.
- Inquiries by state, by vehicle type, and by traffic source (Google, direct, AI search tools, etc. — read from the referrer).
- Won / lost rate.

### 5.5 Spam protection and alerts
- Hidden honeypot field + Cloudflare Turnstile or Google reCAPTCHA v3 + a limit on how many forms one IP can send per hour.
- Email alert to the team for every new inquiry (as today), with a "View in admin" link.
- Admin can set which email addresses get the alerts.

---

## 6. Redirects (/admin/redirects) — full upgrade + strategy

### 6.1 How redirects must work (most important)
- Check redirects in **server middleware before the page loads**, and return real HTTP status codes: **301, 302, 307 or 410**. Never use JavaScript redirects in the browser.
- Only "Active" rules are used.
- Match URLs the same way every time: lowercase, ignore a trailing slash, keep the query string (?utm=...) and pass it on to the target.
- Cache the rules in memory / edge so the database is not called on every visit. Clear the cache when any rule changes.
- Never redirect /admin, /api, or files like images, CSS and JS.
- Support **wildcard / pattern rules** (for example `/old-blog/*` → `/blog/*`), but give exact rules priority over pattern rules.

### 6.2 Database fields
id, source_url (unique, starts with "/"), target_url (internal path or full https link), redirect_type (301 / 302 / 307 / 410), match_type (exact / wildcard), status (active / inactive), note, created_by, hits, last_hit_at, created_at, updated_at.

### 6.3 Safety checks (when saving and when importing)
Block, or warn about:
- Source equal to target.
- **Loops** (A → B → A).
- **Chains** (A → B → C): offer a one-click "Fix chain" so A goes straight to C.
- Duplicate source URLs.
- A target that is itself a 404 or a 410.
- A source URL that is a **live, published page** (warn: "This page exists. Redirecting will hide it.").
- Redirecting many pages to the **homepage** (warn: Google may treat these as "soft 404s". Redirect to the closest matching page instead).

### 6.4 Redirect manager screen
- Summary cards: Total rules, Active, Inactive, Total hits, 301, 302, 410.
- Search (source or target), filters for type, status, match type, and "never hit in 90 days".
- Table: checkbox, source, target, type badge, status toggle, hits, last hit, note, created (date + person), actions (edit, test, delete).
- Pagination with no limit, plus a rows-per-page choice (20 / 50 / 100).
- Bulk actions: activate, deactivate, delete, change type.
- **Add / Edit popup:** source, target, type cards (301 / 302 / 307 / 410 with a short explanation of each), status cards (Active / Inactive), note. For 410, the target field is hidden.
- **"Test a URL" tool:** type any URL and see what happens: the final status code, the target, and every step if there is a chain.

### 6.5 CSV import and export
- Export: all rules or the filtered ones.
- Import popup with a "Download Template" button. Columns: source_url, target_url, redirect_type, status, note.
- Drag and drop, CSV only, max 5MB.
- **Preview before saving:** new rules, rules that will be updated, and rows with errors (row number + reason).
- Option: "If the source already exists: skip / overwrite".
- Import in batches, so 10,000+ rows work without a timeout.

### 6.6 Automatic redirects (no manual work)
- Page or post **slug changed** → automatic 301.
- Page **deleted / unpublished** → the user must choose a 301 target or 410 (section 3.6).
- Blog **category deleted** → 301 to the new category.
- Each automatic rule gets a note like "Auto: slug changed by [name] on [date]".

### 6.7 404 Monitor (/admin/404s) — NEW
- Log every URL that returns a 404: URL, number of hits, first seen, last seen, referrer (where the broken link is).
- Sort by hits, so the most visited broken URLs are at the top.
- **"Create redirect" button** on each row (opens the Add popup with the source filled in), plus a suggested target (the closest matching page by URL words, for example the state hub for an old city URL).
- "Ignore" button for bot/junk URLs (like /wp-login.php). Ignored patterns are not logged again.
- Clean old 404 logs after 90 days.

### 6.8 Our redirect strategy for the site rebuild (load these rules before launch)
The old site had about 10,000 indexed URLs. We are keeping about 710 city pages, so many old URLs will be gone. Plan:

1. **Kept pages with the same URL** → no redirect needed.
2. **Kept pages whose URL changed** → 301 from the old URL to the new URL.
3. **Removed city pages** (cities we did not keep) → **301 to that city's state hub page** (for example `/locations/oh/old-city/` → `/locations/oh/`). The state hub still shows a button for that city that goes to the booking form, so the visitor still finds what they need.
4. **Puerto Rico and other non-US location pages** → **410 Gone**.
5. **Spam / junk / test pages with no good match** → **410 Gone**. Do **not** send them to the homepage.
6. **Old blog posts, services and fleet pages** → 301 to the matching new page. If there is no match → 301 to the closest category / hub page.
7. **Old redirects from the live site** → export them, flatten any chains so they go straight to the final new URL, then import them.

How to do it:
- Build a **"Launch redirect map" tool**: upload the old site's URL list (from the old sitemap, Google Search Console export or a crawl). The tool marks each URL as: still exists / needs 301 (with a suggested target) / suggested 410. The SEO person checks the list and imports it.
- After launch, check the 404 Monitor every day for the first 30 days and fix the top 404s.
- **Keep all 301 rules for at least 12 months.** Never delete a redirect that still gets hits.

### 6.9 Redirect test checklist
- `curl -I` on a 301 rule shows status 301 and the right Location.
- A 410 rule shows status 410.
- An inactive rule does nothing.
- The query string is passed on.
- Loops and chains are blocked or flagged.
- A 10,000-row CSV imports correctly.
- The hit count goes up after a visit.
- Changing a page slug creates a working 301.

---

## 7. SEO tools

### 7.1 Meta Tags bulk view (/admin/meta)
- A table of all pages: URL, SEO title, meta description, canonical, robots, with **inline editing** (click a cell, type, save).
- Highlight problems: missing, too long, too short, or **duplicate titles / descriptions**.
- CSV export and import of meta tags (for bulk updates by the SEO person), with a preview before saving.

### 7.2 Schema & Tracking (/admin/schema)
- Sitewide schema: Organization / LocalBusiness (name, logo, address, phone, sameAs social links, Trustpilot link), WebSite.
- Custom JSON-LD fields (checked before save).
- GA4 ID, Google Search Console verification, Microsoft Clarity ID, Google Tag Manager ID, Bing verification.
- Custom code boxes: head (top) and body (end). Admin role only.

### 7.3 Sitemap & Robots (/admin/sitemap)
- The XML sitemap is **built automatically** from published, indexable pages (no noindex, no redirected pages). Split it into sitemap index files: pages, locations, blog.
- Show the last updated time and the number of URLs in each sitemap.
- A robots.txt editor with a "reset to default" button.
- An **llms.txt editor** (a simple file that helps AI search tools understand the site).
- An "Exclude from sitemap" option on each page.

### 7.4 SEO Health Check (/admin/seo-health)
Scan all pages weekly (and on demand) and list the problems, with links to fix each one:
- Missing or duplicate title / meta description / H1.
- More than one H1.
- Images without ALT text.
- Broken internal links, and links pointing to redirected URLs.
- Pages with very little text (below the word target for that page type).
- Orphan pages (no other page links to them).
- Noindex pages that are in the sitemap.
- Canonical pointing to a different page.
- Pages with very similar content (duplicate warning).

### 7.5 Media Library (/admin/media)
- All images in one place: grid view, search, filters (unused, missing ALT).
- Upload with automatic WebP conversion + resize.
- Edit ALT text, title and file name (SEO-friendly names).
- Shows where each image is used. Warn before deleting an image that is in use.

---

## 8. Users & Roles (/admin/users)

Roles:
- **Admin:** everything.
- **SEO Manager:** everything except users, custom code and deleting inquiries.
- **Content Writer:** edit page content and blog posts, save drafts, preview. **Cannot publish** without SEO Manager / Admin approval (optional setting), and cannot touch redirects, schema, tracking or settings.
- **Sales:** only the Quote Inquiries module.

Also:
- Secure login, "forgot password" by email, and optional 2-step login (authenticator app) for Admin and SEO Manager.
- Lock the account for 15 minutes after 5 wrong passwords.
- Each user has a name, photo and short bio (used as the blog author).

---

## 9. History Log (/admin/history) — upgrade

- Record **every** save, publish, delete, redirect change, import, setting change and login.
- Show: who, what, which page, when, and **before / after** of the changed fields.
- Filters: user, page, type of change, date range.
- "Restore" button for content changes.
- Replace the 500-row cap with **12 months of history** (then archive or delete older entries).

---

## 10. UI / design upgrade

- Keep the site's brand colors and logo. Use a clean, modern admin style like the redirect manager screenshot: white cards, soft shadows, rounded corners, a clear left sidebar, a top bar with the user avatar.
- **Consistent parts everywhere:** the same table style, buttons, popups, form fields, badges and filters on every screen.
- **Toast messages** at the top right: "Saved", "Published", "Error: …".
- **Loading skeletons** instead of blank screens, and friendly **empty states** ("No inquiries yet").
- **Confirm popups** for every delete or bulk action.
- **Breadcrumbs** on every screen (Dashboard > All Pages > Ohio > Columbus).
- A **global search bar** in the top bar: search pages, posts, inquiries and redirects from anywhere.
- **Sticky save bar** at the bottom of editors (Save Draft / Preview / Publish), always visible.
- Fully **mobile-friendly**, so inquiries can be checked on a phone.
- Fast: every list page should load in under 1 second.
- Help text (small grey text) under fields that need it, for example "50–60 characters is best".

---

## 11. Technical rules (for the agent)

- **Data:** everything editable is stored in the database. Templates read from the database. No content stays hard-coded in components; move it all into the database (Phase 2).
- **Cache:** use on-demand revalidation for the exact pages affected by a save (the page, its state hub, /blog, the sitemap, etc.).
- **Security:** check login and role on every admin API. Clean all rich text HTML before saving, to block harmful scripts. Rate-limit the login and quote form. Keep secrets in environment variables.
- **Backups:** a daily database backup, and an "Export everything" button (pages, posts, redirects, inquiries as JSON/CSV).
- **Performance:** the public site must stay fast (Core Web Vitals in the green). Admin code must not load on public pages.
- **Do not change public URLs** unless a redirect is created at the same time.
- Write clear comments in the code, and a short `ADMIN_GUIDE.md` in plain English for the SEO person explaining how to use each module.

---

## 12. Build order (phases)

Do one phase at a time. Show me the plan before starting and the test results at the end.

| Phase | What | Why first |
|---|---|---|
| **0** | Check what exists and report (no code changes) | Know what is broken before fixing it |
| **1** | Fix "All Pages" 200 limit + build the **Quote Inquiries** module | Leads are money; no lead should be lost |
| **2** | Fix and rebuild the **Blog** module (+ move old posts into the database) | The SEO person needs to publish now |
| **3** | Make **all page content editable** (sections, global content, find & replace, drafts, preview, history) | The main goal: no deploys for content |
| **4** | **Redirects** upgrade + **404 Monitor** + **launch redirect map** | Must be ready before the new site goes live |
| **5** | SEO tools (meta bulk view, sitemap, robots, llms.txt, SEO health check, media library) | Makes the SEO person faster |
| **6** | Users & roles, History Log upgrade, dashboard | Control and safety for the team |
| **7** | UI polish across every screen + ADMIN_GUIDE.md | The final finish |

**Definition of done for each phase:** it works on the Vercel preview, all the tests in that phase pass, nothing on the public site broke (check 20 random pages + all the main pages), and I approved it.
