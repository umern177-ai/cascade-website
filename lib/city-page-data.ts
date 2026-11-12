// Structured city pages (the SEO-consultant content structure, data/city-pages.json).
// These pages get a richer layout than the dynamic template; every fact lives in the
// data file with review checks + sources (kept for the owner's batch reviews,
// never rendered on the public page).
import cityPagesJson from "@/data/city-pages.json";

export type CityService = { title: string; text: string; href: string };
export type CityVehicle = { slug: string; reason: string };
export type CityDestination = { name: string; text: string; tip: string; meta?: string };
export type CityNearbyItem = { city: string; miles?: string };
// Premium design extras (owner-supplied Shelton premium HTML). Present only on
// cities marked premium; everything else falls back to the structured layout.
export type CityPremium = {
  heroLead?: string;
  facts?: { dt: string; dd: string; unit?: string }[];
  rules?: { kind: "no" | "yes"; title: string; text: string }[];
  tags?: string[][];
  routing?: boolean;
  routingIntro?: string[]; // paragraphs under the intro H2 when routing is on
  alsoCovered?: string;
};
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
  premium?: CityPremium;
};

const DATA = cityPagesJson as unknown as CityPageData[];

export function getStructuredCityPage(state: string, slug: string): CityPageData | null {
  return DATA.find((p) => p.state === state && p.slug === slug) ?? null;
}

export function structuredCityPageSlugs(): { state: string; slug: string }[] {
  return DATA.map((p) => ({ state: p.state, slug: p.slug }));
}
