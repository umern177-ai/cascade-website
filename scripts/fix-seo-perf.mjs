// SEO + performance code fixes from the Nov 18 audits (findings 2,4,5,6,7,8,10 + perf 1,2,7).
import { readFileSync, writeFileSync } from "node:fs";
const w = (f, fn) => { const s = readFileSync(f, "utf8"); const r = fn(s); if (r !== s) { writeFileSync(f, r); console.log("fixed", f); } else console.log("no-op", f); };

// (7) fleet charter-bus meta description 181→short
w("lib/fleet-data.ts", (s) => s
  .replace(
    'metaDescription:\n      "Charter bus and motorcoach rental for 52–56 passengers: onboard restroom, WiFi, 50–60 bag luggage bays. Nationwide charter bus rental service with DOT-certified drivers. Free quote.",',
    'metaDescription:\n      "Charter bus and motorcoach rental for 52–56 passengers: onboard restroom, WiFi, 50–60 bag bays, DOT-certified drivers. Free final quote.",'
  )
  .replace(
    'metaTitle: "Band Tour Bus Rental | Sleeper Coaches With Bunks & Shower",',
    'metaTitle: "Band Tour Bus Rental | Sleeper Coaches With Bunks",'
  ));

// (6) locations hub: match the 48 built state pages + DC body truth
w("app/locations/page.tsx", (s) => s
  .replace(
    'title: "Charter Bus Service Locations | All 50 States",',
    'title: "Charter Bus Service Locations | 48 States + DC",'
  )
  .replace(
    '"Our service locations: charter bus rental in 50 states and Washington DC. Browse cities and regions for local group transportation and fleet options.",',
    '"Our service locations: charter bus rental across 48 states plus Washington DC. Browse cities and regions for local group transportation and fleet options.",'
  ));

// (perf 1) remove the global hero preload (219 KB on every page)
w("app/layout.tsx", (s) => s.replace(
  /\s*<link rel="preload" as="image" href="\/hero-bus\.webp" \/>/,
  ""
));

// (perf 2 + 7) next.config: cache raw public/ assets + 1y optimized-image TTL
w("next.config.ts", (s) => {
  if (s.includes("minimumCacheTTL")) return s;
  const ttl = s.replace(/images:\s*{/, "images: {\n    minimumCacheTTL: 31536000,");
  if (ttl !== s) return ttl;
  return s;
});
