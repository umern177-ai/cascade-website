// City page template (brief Sections 7.8 + 8) — premium frame for EVERY city
// (owner request Nov 12: same format/structure/design as Shelton CT):
// - cities with structured content (data/city-pages.json) -> PremiumCityPage
//   (premium extras render where the data provides them)
// - all other kept cities -> GenericPremiumCity (premium frame from the real
//   data we hold: county, pickup venues, researched places/airports/venues,
//   5 vehicles, nearby kept cities). Facts stay real; nothing invented.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import PremiumCityPage from "@/components/PremiumCityPage";
import GenericPremiumCity from "@/components/GenericPremiumCity";
import { keptCities, isKept, stateName, nearbyKept, states } from "@/lib/locations";
import { getStructuredCityPage } from "@/lib/city-page-data";
import { getCityContent, getCityFallback } from "@/lib/city-content";
import { pageMeta } from "@/lib/page-meta";

type Props = { params: Promise<{ state: string; city: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  // Only kept cities have pages (Rule R4): 710 pages.
  return states().flatMap((s) => s.cities.map((c) => ({ state: s.state_code, city: c.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city } = await params;
  const structured = getStructuredCityPage(state, city);
  if (structured) {
    // SEO fix (Nov 18 audit + Nov 19 length pass): (a) append the state abbr to
    // the template titles ("Charter Bus Rental in <City>") so same-named cities
    // in different states don't share identical <title> strings — e.g. Columbus
    // OH vs Columbus MS vs Columbus IN. Shortened data titles (variant
    // "{City}, {ST} Charter Bus Rental…" / "{City} Charter Bus Rental…") already
    // carry their differentiation and are used as-is. (b) route everything
    // through pageMeta so every city page carries og:image / og:type /
    // og:site_name and twitter tags.
    const stAbbr = state.toUpperCase();
    const needsAbbr = structured.title.startsWith("Charter Bus Rental in ") && !structured.title.includes(`, ${stAbbr}`);
    const title = needsAbbr
      ? structured.title.replace(" | Cascade Charter Bus", `, ${stAbbr} | Cascade Charter Bus`)
      : structured.title;
    return pageMeta({
      title, // pageMeta's includes-brand guard makes it absolute
      description: structured.metaDescription,
      path: `/locations/${state}/${city}/`,
    });
  }
  const found = keptCities(state).find((c) => c.slug === city);
  if (!found) return {};
  return pageMeta({
    title: `Charter Bus Rental in ${found.city}, ${state.toUpperCase()} | Cascade Charter Bus`,
    description: `Charter bus rental in ${found.city}, ${stateName(state)} for weddings, school trips, sports travel and corporate events. DOT-certified drivers, 24/7 dispatch, final quotes.`,
    path: `/locations/${state}/${city}/`,
  });
}

export default async function CityPage({ params }: Props) {
  const { state, city } = await params;
  const found = isKept(state, city) ? keptCities(state).find((c) => c.slug === city) : undefined;
  if (!found) notFound();

  const structured = getStructuredCityPage(state, city);
  if (structured) {
    return <PremiumCityPage data={structured} state={state} />;
  }

  // Generic premium page from the real data we hold for this city.
  const nearby = nearbyKept(state, city, 8);
  const content = getCityContent(state, city);
  const fb = getCityFallback(state, city);

  return (
    <main className="bg-white min-vh-100">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Locations", href: "/locations/" }, { label: stateName(state), href: `/locations/${state}/` }, { label: found.city }]} />
      <GenericPremiumCity
        name={found.city}
        citySlug={city}
        state={state}
        stName={stateName(state)}
        county={fb?.county ?? null}
        venues={fb?.venues ?? []}
        weddingVenues={(content?.weddingVenues ?? []).map((v) => ({ name: v.name, note: v.note || "Checked for group access" }))}
        weddingIntro={null}
        places={content?.places ?? []}
        airports={content?.airports ?? []}
        wineries={content?.wineries ?? []}
        nearby={nearby.map((n) => ({ city: n.city, slug: n.slug, path: n.path }))}
      />
    </main>
  );
}
