# STAGING GUIDE — your preview site for the SEO consultant (plain English)

## What you get

A stable URL (like `cascade-staging.vercel.app`) where the SEO person can analyze the
whole site any time. **Every time we update the site, the staging URL updates itself
within about 2 minutes** — no action needed from you or them.

The real domain `cascadecharterbus.com` stays completely untouched until launch day.

## Google protection (what the SEO person asked for)

On the staging URL:

- `robots.txt` says `User-agent: * / Disallow: /` (exactly what they asked for)
- every page also sends a `X-Robots-Tag: noindex, nofollow` header — a second lock,
  so the staging URL can never end up in Google's results even by accident

The real site (when it goes live later) serves the normal robots.txt with our
sitemap — the switch happens with one environment setting, not a code change.

## Setting it up — one time, ~10 minutes

You do two logins; I do the rest. When I ask, run these in this chat
(type the whole line with the leading `!`):

1. `! npx gh auth login` → follow the prompts to log in to GitHub (create a free
   account first at github.com/signup if you don't have one).
2. `! npx vercel login` → follow the prompts to log in to Vercel (create a free
   account first at vercel.com/signup — use "Continue with GitHub" to link them).

Then tell me "accounts done" — I will:

- create the GitHub repository and push the site code
- deploy to Vercel with the staging flag set
- verify robots.txt + headers + run the full 189-point SEO check against the sandbox
- send you the staging URL to forward to the SEO person

(Prefer doing the clicks yourself? vercel.com/new → "Import Git Repository" → pick the
repo → Environment Variables → add `STAGING` = `1` → Deploy. Either way works.)

## How your SEO person should crawl it

`Disallow: /` also stops their own crawler. In Screaming Frog: Config → robots.txt →
tick "Ignore robots.txt". They'll crawl everything; the noindex header still keeps
Google out. Standard practice for every staging site.

## How updates work day-to-day

You approve a change here → I commit and push → Vercel rebuilds → their URL shows the
new version in ~2 minutes. The Vercel dashboard keeps a history of every deployment.

## Moving to the real site later

On launch day: remove the `STAGING` environment variable and attach the domain
`cascadecharterbus.com` in the Vercel project — the same site becomes the production
site, and robots.txt flips to the normal policy automatically. The staging URL keeps
working as a preview until you close it.
