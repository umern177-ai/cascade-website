// Structured city pages (the SEO-consultant content structure, data/city-pages.json).
// These pages get a richer layout than the dynamic template; every fact lives in the
// data file with review checks + sources (kept for the owner's batch reviews,
// never rendered on the public page).
import cityPagesJson from "@/data/city-pages.json";

export type CityService = { title: string; text: string; href: string };
export type CityVehicle = { slug: string; reason: string };
export type CityDestination = { name: string; text: string; tip: string };
export type CityNearbyItem = { city: string; miles?: string };
export type CityPageData = {
  state: string;
  slug: string;
  city: string;
  title: string;
  metaDescription: string;
  h1: string;
  heroIntro: string;
  servicesHeading: string;
  services: CityService[];
  vehiclesHeading: string;
  vehicles: CityVehicle[];
  destinationsHeading: string;
  destinations: CityDestination[];
  mapPins: string[];
  nearby: { heading: string; items?: CityNearbyItem[]; plainText?: string };
  faqsHeading: string;
  faqs: { q: string; a: string }[];
  ctaHeading: string;
  source: string;
  reviewChecks: string[];
  sourceLinks: string[];
};

const DATA = cityPagesJson as unknown as CityPageData[];

export function getStructuredCityPage(state: string, slug: string): CityPageData | null {
  return DATA.find((p) => p.state === state && p.slug === slug) ?? null;
}

export function structuredCityPageSlugs(): { state: string; slug: string }[] {
  return DATA.map((p) => ({ state: p.state, slug: p.slug }));
}
