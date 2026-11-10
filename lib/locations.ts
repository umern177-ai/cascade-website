// Location data helpers (brief Section 7.7):
// - Group 1: kept cities (data/locations-keep.json), in the file's display order.
// - Group 2: every other city on the live state page (data/all-cities.json), A–Z.
// Group 2 buttons link to /contact/ with the city in a data-pickup attribute —
// they never get a per-city URL (removed URLs return 410, brief Section 10).
import keepJson from "@/data/locations-keep.json";
import allCitiesJson from "@/data/all-cities.json";

type KeepCity = { city: string; slug: string; path: string; inquiries: number; tier: string; priority: string; county?: string | null; pickup_places_seen?: string[] };
type KeepState = { state_code: string; state_name: string; path: string; total_inquiries: number; cities: KeepCity[]; kept_pages: number };

const US_STATE_NAMES: Record<string, string> = {
  al: "Alabama", ak: "Alaska", az: "Arizona", ar: "Arkansas", ca: "California", co: "Colorado",
  ct: "Connecticut", de: "Delaware", dc: "District of Columbia", fl: "Florida", ga: "Georgia",
  hi: "Hawaii", id: "Idaho", il: "Illinois", in: "Indiana", ia: "Iowa", ks: "Kansas", ky: "Kentucky",
  la: "Louisiana", me: "Maine", md: "Maryland", ma: "Massachusetts", mi: "Michigan", mn: "Minnesota",
  ms: "Mississippi", mo: "Missouri", mt: "Montana", ne: "Nebraska", nv: "Nevada", nh: "New Hampshire",
  nj: "New Jersey", nm: "New Mexico", ny: "New York", nc: "North Carolina", nd: "North Dakota",
  oh: "Ohio", ok: "Oklahoma", or: "Oregon", pa: "Pennsylvania", ri: "Rhode Island", sc: "South Carolina",
  sd: "South Dakota", tn: "Tennessee", tx: "Texas", ut: "Utah", vt: "Vermont", va: "Virginia",
  wa: "Washington", wv: "West Virginia", wi: "Wisconsin", wy: "Wyoming",
};

const keepData = keepJson as unknown as { states: KeepState[] };
const allCities = allCitiesJson as unknown as Record<string, { city: string; slug: string }[]>;

export function states(): KeepState[] {
  return keepData.states;
}

export function stateCodes(): string[] {
  return states().map((s) => s.state_code);
}

export function stateName(code: string): string {
  return US_STATE_NAMES[code] ?? code.toUpperCase();
}

export function keptCities(stateCode: string): KeepCity[] {
  return states().find((s) => s.state_code === stateCode)?.cities ?? [];
}

export function otherCities(stateCode: string): { city: string; slug: string }[] {
  const keepSlugs = new Set(keptCities(stateCode).map((c) => c.slug));
  const list = allCities[stateCode] ?? [];
  return list.filter((c) => !keepSlugs.has(c.slug)).sort((a, b) => a.city.localeCompare(b.city, "en"));
}

// Nearby kept-city suggestions for a city page (brief 7.8): same state first.
export function nearbyKept(stateCode: string, slug: string, max = 4): { city: string; slug: string; path: string }[] {
  const list = keptCities(stateCode).filter((c) => c.slug !== slug);
  return list.slice(0, max).map((c) => ({ city: c.city, slug: c.slug, path: c.path }));
}

export function isKept(stateCode: string, slug: string): boolean {
  return keptCities(stateCode).some((c) => c.slug === slug);
}

export type { KeepCity };
