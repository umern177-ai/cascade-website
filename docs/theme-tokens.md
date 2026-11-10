# Theme tokens — read from the live site (Nov 9, 2026)

Source: the live CSS. The live site ships exactly **3 stylesheets**:
1. `05qmwjqau64bz.css` — Inter font (self-hosted woff2, weights 100–900, `font-display: swap`).
2. `04za3hu5nilvo.css` — Bootstrap 5 (230 KB). **`--bs-primary` is still Bootstrap's default blue `#0d6efd`** (framework leftover; the blue never shows because the custom stylesheet below overrides the places that matter — but a few un-overridden spots can leak).
3. `0wohcls7s4-gg.css` — the **site's custom global stylesheet** (~2 KB). This is the actual theme. Contents confirmed verbatim below.

The theme = Bootstrap 5 + this small custom layer. Reuse the same class names.

## Colors (from the custom stylesheet's `:root`)

| Token | Value | Notes |
|---|---|---|
| `--fleet-orange` (brand primary) | `#F5A002` | Used as `.text-primary`, `.btn-primary`, footer border, navbar border |
| `--fleet-black` | `#0F1115` | Navbar bg, footer bg, button text |
| `--fleet-dark-gray` | `#1E2126` | Secondary dark |
| `--fleet-text` | `#FAF9F9` | Default body text color (light, for dark sections) |
| `--fleet-shadow` | `#F5A00233` | Amber shadow (brand at 20% opacity) |
| Bootstrap default blue | `#0d6efd` | **Remove at rebuild** — set `--bs-primary` to the amber so no spot can leak |

Mapping to brief Section 3.1: brand amber `#F5A002` = `--fleet-orange`; ink-950 `#0F1115` = `--fleet-black`; ink-900 `#1E2126` = `--fleet-dark-gray`; `--fleet-text #FAF9F9` is the light text on dark surfaces. The brief's `--text #212529`, `--line #DEE2E6`, `--surface #F8F9FA` etc. come from Bootstrap's own variables.

Note: the custom sheet sets `h2, h5, h6 { color: #F5A002 }` globally (amber headings) — headings get their visual color from Bootstrap's explicit `text-dark`/`text-white` utility classes in the markup. Keep exactly this behavior.

## Typography
- **Inter** via Next.js font loader (the live site already self-hosts Inter woff2 subsets, weights 100–900).
- Body: Bootstrap defaults (16 px). Headings bold via `fw-bold` utilities.
- Uppercase label style: `.tracking-wide` = `letter-spacing: 1.5px; text-transform: uppercase`.

## Buttons (verified, from the custom stylesheet)
- `.btn-primary` = amber `#F5A002` bg, **dark text `#0F1115`**, `font-weight: 800`, `letter-spacing: 1px`, `padding: .8rem 1.8rem`, no border.
- Hover: lifts `translateY(-2px)` + amber shadow `0 5px 15px #F5A00233`, **bg turns white** (with dark text still).
- Shape: markup always adds `rounded-pill` (pill) and often `px-4 py-3`, `fw-bold`.

## Navbar / header
- `.navbar` = `--fleet-black` bg (forced), blur backdrop `blur(10px)`, **amber 3px bottom border**, `transition: all .3s`.
- `.nav-link` = white, `font-weight: 600`; hover → amber.
- Markup: `navbar navbar-expand-lg navbar-dark bg-dark sticky-top py-2 shadow-lg border-bottom border-primary`; header wrapper `header.jsx-… shadow-lg` with a `top-ribbon` line above (`.d-none d-…` on smaller screens).

## Footer
- `.footer-modern`, `border-top: 4px solid #F5A002`, `padding-top: 5rem; padding-bottom: 2rem`, bg `--fleet-black`, white text.
- Links/icons: amber, hover = pad-left nudge + `#d4d4d4` color.
- Footer H3/H6 (brand + column titles): uppercase, `letter-spacing: 2px`, `font-weight: 800`, white. *(At rebuild: column titles must not be real H2–H6 headings for outline reasons — style same, tag different.)*
- `.footer-logo-outline` = amber 2px border box around the wordmark. `.footer-divider` = `1px solid #ffffff1a`.
- Mobile (<768 px): `padding-top: 3rem`.

## Cards and sections
- Cards in markup: `card h-100 border-0 shadow-sm rounded-4 hover-lift transition-all` + `card-body p-4`.
- `.hover-lift` = on hover `translateY(-8px)` + `0 1rem 3rem #00000026` shadow. Motion is pure CSS; no animation library.
- `.bg-primary-soft` = amber-tinted icon chip behind section icons (`p-2 rounded-3 text-primary` inside). *(Definition lives in component-scoped CSS; rebuilt to match visually — amber at low opacity.)*
- `.x-small`, `.x-small-bold` = tiny upper meta text used around cards. *(Same — rebuild to match.)*
- Section rhythm on the home page (verified order): full-height dark hero (`vh-100 d-flex align-items-center text-white`) → stats bar (`py-4 bg-white shadow-sm … rounded-4` overlapping hero via `mt-n4`) → alternating `py-5` white and `py-5 bg-light` sections → dark CTA (`py-5 bg-dark text-white text-center`) → dark footer.
- Hero photo: dark overlay (`position-relative` + overlay), photo preloaded.

## Forms (booking form)
- `.form-control:focus` = amber border + amber focus ring `0 0 0 .25rem #F5A00240`.
- Pill toggles (trip type / service category): rendered as buttons on the live site — rebuild as real radio inputs styled as pills (accessibility fix, same look).

## Icons
- **Lucide** SVGs inline (`lucide lucide-…` classes, `stroke="currentColor"`). The custom sheet forces `svg[stroke=currentColor] { stroke: var(--fleet-orange) }` — icons render amber unless markup sets another color (e.g. `text-muted`).

## Fixes to apply while rebuilding (look unchanged)
- Set `--bs-primary` (and `--bs-link-color` where relevant) to the amber so the default blue `#0d6efd` can never leak.
- Bootstrap currently loads from the jsdelivr CDN — self-host.
- Footer titles are H2/H3/H5/H6 elements — keep the look, change the tags.
- Host Inter the same way (`next/font`, weights 400/500/700/800 max — trim subsets).
