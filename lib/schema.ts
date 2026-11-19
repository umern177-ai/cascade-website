// Schema markup per the SEO consultant's document (Nov 18, 2026), with
// confirmed business facts (brief Section 15) substituted where the document
// carried old live-site placeholders:
//   - HQ address is 12409 Linden Blvd, South Ozone Park, NY 11420
//     (the document's Bronx 10462 block was the old address, removed sitewide
//     per brief Section 15 / rule R12).
//   - The document's "Product + AggregateRating (4.9 / 1205)" block is NOT
//     implemented: brief Section 7.12 / 9.5 forbid self-review markup and
//     unverified ratings (real Trustpilot score comes through the official
//     widget only). Flagged to the owner separately.
// One Organization block sitewide; everything links to it via "@id".
import { SITE } from "@/lib/site-data";

export const ORG_ID = `${SITE.url}/#organization`;
export const LOGO_URL = `${SITE.url}/logo.png`;
export const ORG_IMAGE = `${SITE.url}/images/fleet/charter.jpg`;

// 1. Organization — sitewide, one block (global layout).
export const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE.name,
  url: `${SITE.url}/`,
  logo: {
    "@type": "ImageObject",
    "@id": `${SITE.url}/#logo`,
    url: LOGO_URL,
    caption: "Cascade Charter Bus Logo",
  },
  image: ORG_IMAGE,
  description:
    "Cascade Charter Bus is a charter bus rental company serving all 50 US states with motorcoaches, minibuses, school buses, sprinter vans, party buses and executive group transportation for corporate events, weddings, school trips, sports teams, airport transfers, tours and church groups.",
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.state,
    postalCode: SITE.address.zip,
    addressCountry: "US",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-646-705-0816",
    contactType: "customer service",
    email: SITE.email,
    areaServed: "US",
    availableLanguage: ["en"],
  },
  areaServed: { "@type": "Country", name: "United States" },
  sameAs: Object.values(SITE.social),
};

// Reference form of the provider/publisher/author (consultant note: point
// every block at the Organization through its @id).
export const orgRef = { "@id": ORG_ID };

// 2. LocalBusiness — every location page (state and city). HQ address is used
// as the street address (consultant note); the location itself is carried in
// areaServed. Geo coordinates are omitted — the city data holds no verified
// coordinates yet.
export function localBusinessSchema(opts: {
  path: string; // e.g. "/locations/ct/shelton/"
  locationName: string; // e.g. "Shelton, CT" or state name
  description: string;
  areaServedType: "City" | "State";
  areaServedName: string;
}) {
  const url = `${SITE.url}${opts.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}#localbusiness`,
    name: `${SITE.name} - ${opts.locationName}`,
    url,
    description: opts.description,
    image: ORG_IMAGE,
    logo: LOGO_URL,
    telephone: "+1-646-705-0816",
    email: SITE.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.zip,
      addressCountry: "US",
    },
    areaServed: { "@type": opts.areaServedType, name: opts.areaServedName },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    parentOrganization: { "@id": ORG_ID },
  };
}

// 3. Service — service pages and fleet pages. No "offers": no starting price
// is shown on any page (consultant note: remove offers in that case).
export function serviceSchema(opts: { path: string; name: string; description: string; image?: string; areaServed?: object }) {
  const url = `${SITE.url}${opts.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: opts.name,
    description: opts.description,
    url,
    ...(opts.image ? { image: opts.image } : {}),
    provider: { "@id": ORG_ID },
    areaServed: opts.areaServed ?? { "@type": "Country", name: "United States" },
  };
}
