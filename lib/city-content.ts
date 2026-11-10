// City content (owner request: famous places, airports, wedding venues,
// nearby wineries). Research-verified in batches (brief Section 8.2 — every fact
// needs a source before launch); entries marked verified:false are from the
// seed research pass pending the owner's batch review.
import cityContentJson from "@/data/city-content.json";
import { keptCities } from "@/lib/locations";

export type Place = { name: string; note: string };
export type Airport = { code: string; name: string; miles: number };
export type CityContent = {
  places: Place[];
  airports: Airport[];
  weddingVenues: Place[];
  wineries: Place[];
  notes: string;
  verified: boolean;
};

const DATA = cityContentJson as unknown as Record<string, Omit<CityContent, "verified">>;

export function getCityContent(stateCode: string, citySlug: string): CityContent | null {
  const entry = DATA[`${stateCode}/${citySlug}`];
  if (!entry) return null;
  return { ...entry, verified: false };
}

// Fallback for cities not yet in the researched set: real facts we already hold —
// the county, pickup places seen in real inquiries, and nearby kept cities.
export function getCityFallback(stateCode: string, citySlug: string) {
  const found = keptCities(stateCode).find((c) => c.slug === citySlug);
  if (!found) return null;
  const venues = (found.pickup_places_seen || []).filter((v: string) => typeof v === "string" && v.length > 2);
  return {
    county: found.county || null,
    venues,
  };
}
