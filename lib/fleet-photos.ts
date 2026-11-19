// One read path for every fleet photo on the site (brief "adjustable from the
// admin" spirit — the owner drops photos into public/images/fleet/<slug>/ and
// scripts/fleet-manifest.mjs turns the folder list into data/fleet-photos.json
// on every build; no code change is ever needed to swap photos).
//
// - fleetGallery(slug): every photo in that vehicle's folder, cover first.
//   Consumed by the photo showcase on the fleet detail pages.
// - fleetMain(slug, legacy): the single cover photo, with the original
//   /images/fleet/*.jpg file as fallback if the manifest doesn't list the
//   vehicle yet (keeps every card, city page and service page rendering).
import photosJson from "@/data/fleet-photos.json";

const MANIFEST = photosJson as Record<string, string[]>;

export function fleetGallery(slug: string): string[] {
  return (MANIFEST[slug] ?? []).map((f) => `/images/fleet/${slug}/${f}`);
}

export function fleetMain(slug: string, legacy: string): string {
  return fleetGallery(slug)[0] ?? legacy;
}

// All shots of a vehicle for the auto-rotating card (VehiclePhoto): the
// manifest list, or at minimum the legacy single photo so the card never
// renders empty.
export function fleetShots(slug: string, legacy: string): string[] {
  const g = fleetGallery(slug);
  return g.length > 0 ? g : [legacy];
}
