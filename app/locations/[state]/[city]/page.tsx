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
    return {
      title: structured.title,
      description: structured.metaDescription,
      alternates: { canonical: `https://cascadecharterbus.com/locations/${state}/${city}/` },
      openGraph: {
        title: structured.title,
        description: structured.metaDescription,
        url: `https://cascadecharterbus.com/locations/${state}/${city}/`,
      },
    };
  }
  const found = keptCities(state).find((c) => c.slug === city);
  if (!found) return {};
  return {
    title: `Charter Bus Rental in ${found.city} | Cascade Charter Bus`,
    description: `Charter bus rental in ${found.city}, ${stateName(state)} for weddings, school trips, sports travel and corporate events. DOT-certified drivers, 24/7 dispatch, final quotes.`,
    alternates: { canonical: `https://cascadecharterbus.com/locations/${state}/${city}/` },
  };
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
