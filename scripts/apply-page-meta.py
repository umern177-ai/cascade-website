"""One-off: route every page's metadata through lib/page-meta.ts so all pages
ship canonical + exact robots meta + Open Graph + Twitter tags."""
import re, sys

HELPER_IMPORT = 'import { pageMeta } from "@/lib/page-meta";\n'

def read(p): return open(p, encoding="utf-8").read()
def write(p, s): open(p, "w", encoding="utf-8").write(s)

def ensure_import(s):
    if "lib/page-meta" in s:
        return s
    # insert after the last import line at top
    m = list(re.finditer(r'^import [^\n]*;\n', s, re.M))
    idx = m[-1].end()
    return s[:idx] + HELPER_IMPORT + s[idx:]

# ---------- const metadata blocks ----------
CONST_BLOCKS = {
  "app/services/page.tsx": (True, "pageMeta({\n  title: \"Professional Services Tailored to Your Journey\",\n  description:\n    \"Charter bus services for corporate events, weddings, schools, sports teams, airport transfers, sightseeing tours, church groups and band tours—nationwide.\",\n  path: \"/services/\",\n})"),
  "app/fleet/page.tsx": (True, "pageMeta({\n  title: \"Charter Bus & Motorcoach Fleet | Group Vehicle Guide\",\n  description:\n    \"Explore charter buses, sleeper coaches, minibuses, Sprinter vans, school buses, party buses, SUVs and sedans for group transportation across the USA.\",\n  path: \"/fleet/\",\n})"),
  "app/locations/page.tsx": (True, "pageMeta({\n  title: \"Charter Bus Service Locations | All 50 States\",\n  description:\n    \"Our service locations: charter bus rental in 50 states and Washington DC. Browse cities and regions for local group transportation and fleet options.\",\n  path: \"/locations/\",\n})"),
  "app/about/page.tsx": (True, "pageMeta({\n  title: \"About Cascade Charter Bus\",\n  description:\n    \"About Cascade Charter Bus: nationwide group transportation with DOT-certified drivers, 24/7 dispatch, 5+ years of service and coverage in all 50 states.\",\n  path: \"/about/\",\n})"),
  "app/contact/page.tsx": (True, "pageMeta({\n  title: \"Charter Bus Booking & Free Quote Request\",\n  description:\n    \"Request a detailed itinerary quote for your group trip. Average response: 15 minutes. 24/7 dispatch, final pricing with gratuity included, U.S.-wide coverage.\",\n  path: \"/contact/\",\n})"),
  "app/faqs/page.tsx": (True, "pageMeta({\n  title: \"Frequently Asked Questions | Charter Bus Rentals\",\n  description:\n    \"Answers about booking, safety, cancellations, amenities and group travel logistics for charter bus rentals nationwide.\",\n  path: \"/faqs/\",\n})"),
  "app/sitemap/page.tsx": (True, "pageMeta({\n  title: \"HTML Sitemap\",\n  description: \"Every page on cascadecharterbus.com: services, fleet, locations and city pages.\",\n  path: \"/sitemap/\",\n})"),
  "app/privacy-policy/page.tsx": (True, "pageMeta({\n  title: \"Privacy Policy | Cascade Charter Bus\",\n  description: \"How Cascade Charter Bus collects, uses and protects your personal information, data rights and communication choices.\",\n  path: \"/privacy-policy/\",\n})"),
  "app/termsandconditions/page.tsx": (True, "pageMeta({\n  title: \"Terms & Conditions | Cascade Charter Bus\",\n  description: \"Service terms for Cascade Charter Bus bookings: rates, payment, driver regulations and governing law.\",\n  path: \"/termsandconditions/\",\n})"),
  "app/cancellation-policy/page.tsx": (True, "pageMeta({\n  title: \"Cancellation & Refund Policy | Cascade Charter Bus\",\n  description: \"Booking deposits, cancellation windows and refund terms for your charter bus reservation.\",\n  path: \"/cancellation-policy/\",\n})"),
  "app/page.tsx": (True, "pageMeta({\n  title: \"Charter Bus Rental Nationwide | Cascade Charter Bus\",\n  description:\n    \"Nationwide charter bus rental, coast to coast from New York to Los Angeles. Premium motorcoaches, shuttles, and executive group transportation with DOT-certified drivers.\",\n  path: \"/\",\n})"),
}

for path, (is_const, replacement) in CONST_BLOCKS.items():
    s = read(path)
    pat = re.compile(r'export const metadata(?:: Metadata)? = \{[\s\S]*?\n};')
    m = pat.search(s)
    if not m:
        print("NO METADATA BLOCK in", path); sys.exit(1)
    s = s[:m.start()] + "export const metadata = " + replacement + ";" + s[m.end():]
    s = ensure_import(s)
    s = s.replace('import type { Metadata } from "next";\n', "", 1) if "Metadata" not in s.split("export default")[0].replace('import type { Metadata } from "next";','') else s
    write(path, s)
    print("ok", path)

# ---------- generateMetadata returns ----------
def rewrite_return(path, subs):
    s = read(path)
    for a, b in subs:
        if a not in s:
            print("MISS in", path, "->", a[:60]); sys.exit(1)
        s = s.replace(a, b)
    s = ensure_import(s)
    write(path, s)
    print("ok", path)

rewrite_return("app/services/[slug]/page.tsx", [(
'''  return {
    title: meta.metaTitle,
    description: meta.metaDescription,
    alternates: { canonical: `/services/${slug}/` },
    openGraph: { title: meta.metaTitle, description: meta.metaDescription },
  };''',
'''  return pageMeta({
    title: meta.metaTitle,
    description: meta.metaDescription,
    path: `/services/${slug}/`,
  });''')])

rewrite_return("app/fleet/[slug]/page.tsx", [(
'''  return {
    title: v.metaTitle,
    description: v.metaDescription,
    alternates: { canonical: `/fleet/${v.slug}/` },
    openGraph: { title: v.metaTitle, description: v.metaDescription, images: [{ url: v.photo }] },
  };''',
'''  return pageMeta({
    title: v.metaTitle,
    description: v.metaDescription,
    path: `/fleet/${v.slug}/`,
    image: v.photo,
  });''')])

rewrite_return("app/locations/[state]/page.tsx", [(
'''  return {
    title: { absolute: `Charter Bus Rental in ${name}, ${state.toUpperCase()} | Cascade Charter Bus` },
    description: `Charter bus rental across ${name}. Choose your city to see local group transportation, or open the booking form with your pickup pre-filled. 24/7 dispatch nationwide.`,
    alternates: { canonical: `/locations/${state}/` },
  };''',
'''  return pageMeta({
    title: `Charter Bus Rental in ${name}, ${state.toUpperCase()} | Cascade Charter Bus`,
    description: `Charter bus rental across ${name}. Choose your city to see local group transportation, or open the booking form with your pickup pre-filled. 24/7 dispatch nationwide.`,
    path: `/locations/${state}/`,
  });''')])

rewrite_return("app/locations/[state]/[city]/page.tsx", [(
'''  return {
    // "absolute" keeps the layout template from appending the brand again
    title: { absolute: `Charter Bus Rental in ${found.city}, ${stAbbr} | Cascade Charter Bus` },
    description: `Charter bus rental in ${found.city}, ${stateName(state)} for weddings, school trips, sports travel and corporate events. DOT-certified drivers, 24/7 dispatch, final quotes.`,
    alternates: { canonical: `/locations/${state}/${city}/` },
  };''',
'''  return pageMeta({
    title: `Charter Bus Rental in ${found.city}, ${stAbbr} | Cascade Charter Bus`,
    description: `Charter bus rental in ${found.city}, ${stateName(state)} for weddings, school trips, sports travel and corporate events. DOT-certified drivers, 24/7 dispatch, final quotes.`,
    path: `/locations/${state}/${city}/`,
  });''')])

rewrite_return("app/not-found.tsx", [(
'''export const metadata = {
  title: "Page Not Found | Cascade Charter Bus",''',
'''export const metadata = pageMeta({
  title: "Page Not Found | Cascade Charter Bus",'''),
(
'''  description:
    "Sorry, the page you're looking for could not be found. It may have been moved or removed. Explore our locations or return to the homepage to find the transportation services you need.",
  robots: { index: false, follow: false },
};''',
'''  description:
    "Sorry, the page you're looking for could not be found. It may have been moved or removed. Explore our locations or return to the homepage to find the transportation services you need.",
  path: "/does-not-exist/",
  index: false,
});''')])

rewrite_return("app/gone/page.tsx", [(
'''export const metadata = {
  title: "Page Removed | Cascade Charter Bus",
  description: "This page has been removed. Get a quote or browse locations to plan your next trip.",
  robots: { index: false, follow: false },
};''',
'''export const metadata = pageMeta({
  title: "Page Removed | Cascade Charter Bus",
  description: "This page has been removed. Get a quote or browse locations to plan your next trip.",
  path: "/gone/",
  index: false,
});''')])

# ---------- layout: exact robots meta + OG defaults for home ----------
s = read("app/layout.tsx")
s = s.replace('''  robots: {
    index: true,
    follow: true,
    googleBot: { "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },''','''  robots: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },''')
s = s.replace('''  metadataBase: new URL(SITE.url),
  title: {''','''  metadataBase: new URL(SITE.url),
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "Charter Bus Rental Nationwide | Cascade Charter Bus",
    description:
      "Nationwide charter bus rental, coast to coast from New York to Los Angeles. Premium motorcoaches, shuttles, and executive group transportation with DOT-certified drivers.",
    images: [{ url: `${SITE.url}/hero-bus.jpg`, width: 1600, height: 900 }],
  },
  title: {''')
write("app/layout.tsx", s)
print("ok app/layout.tsx")
