# Cascade Admin — Plain-English Guide (for the SEO team)

Everything below needs no developer. All edits go live in seconds — no build, no deploy.

## Log in
Go to `/admin/`, type your email + password, click Log in. (5 wrong passwords locks the screen for 15 minutes.)

## LEADS — Quote inquiries
- The sidebar shows a red badge with the number of **new** inquiries.
- Click **Open** on any inquiry to see everything (trip details, the page it came from). Click **Call** or **Email** right from there.
- Change the **status** (New → Contacted → Quote sent → Won/Lost/Spam), **add notes** (saved with your timestamp), **assign to** a teammate.
- **Export CSV** downloads all or the filtered rows.
- The visitor's quote form keeps working even if the email service fails — nothing is lost.

## CONTENT — All pages
- Every page of the site (780+) is listed with **25/50/100 per page** pagination and search across everything.
- Open a page: tabs **Content** (every field the page renders + FAQs), **SEO** (title, description, canonical, robots, OG), **Schema**, plus **History** (the last 10 saves — click **Restore** to roll back).
- **Save & publish** = live immediately. **Save draft** = private; **Preview draft** opens a preview page no visitor can see.
- The red badge chip under a field (H1) marks the one heading that is the page's H1 — only one per page.

## CONTENT — Blog
- **New post**: title → the URL slug auto-completes; rich content with images (auto WebP, **ALT text required to publish**), categories (managed ones + free-typed), tags, excerpt, author + bio, schedule a future date.
- Slug changes create the 301 automatically. Duplicate = draft copy with a fresh name.
- **Categories** manage `/blog/category/{slug}/` pages with their own SEO title/description.

## CONTENT — Global content
Facts used across the site: phone, email, address, socials. Edit once → header/footer/contact update everywhere. Leave a field empty to fall back to the default.

## CONTENT — Media library
Every uploaded image, with "Used by" lookups so you never delete one that a post still uses.

## SEO — Meta tags
Bulk table of every page. Click a cell to edit; green = in the recommended range. Red flags mark missing/too long/too short/**duplicate** titles and descriptions. CSV export/import for bulk work.

## SEO — Redirects
- Anything you add is **live right away** (real HTTP 301/302/307/410, never JavaScript).
- Toggle any rule **Active/Inactive**. The **Test a URL** flow: just open the old URL and watch it redirect.
- **404 monitor**: the most-hit 404s with one-click redirect creation and an Ignore button for junk.
- **Launch redirect map**: paste all the old site's URLs, the tool marks still-exists / 301 (target suggested) / 410, and applies the accepted list in one click.

## SEO — Sitemap & robots
- All XML files listed and linked; robots.txt and llms.txt editors (reset by clearing the box — the default policy comes back).

## SEO — SEO health check
Missing/duplicate/short/long titles & descriptions, noindex-on-location warnings, with a **Fix** button into the editor.

## Settings — Users & roles
- Add teammates with roles: **Admin** (everything), **SEO manager** (all except users), **Writer** (edit only), **Sales** (inquiries only).
- Reset a password with a **Reset** form (6+ characters). Each user has an author bio used by their posts.
- **History log**: every save, publish, redirect change, import, user change — newest first (12 months).

## Safety
- Login throttles: 5 wrong passwords → 15-minute lockout per email.
- Rich text is sanitized: scripts and handlers are stripped.
- Every admin screen and API re-checks the session — the public site stays read-only to admins.
