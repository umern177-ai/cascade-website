// llms.txt (brief Section 9.6) — placeholder text served now; the SEO team's
// final text replaces it from the admin (Site settings) and must list only real
// pages + confirmed facts. Editable in Phase 3b/4 without a code change.
export const dynamic = "force-static";

const CONTENT = `# cascadecharterbus.com

Cascade Charter Bus is a nationwide charter bus rental company (motorcoaches, sleeper
tour buses with up to 15 bunks, minibuses, Sprinter vans, school buses, party buses, SUVs
and sedans) with DOT-certified drivers and 24/7 dispatch. Head office: 12409 Linden Blvd,
South Ozone Park, NY 11420, USA. Phone: +1 (646) 705-0816. Email: info@cascadecharterbus.com.

## Main pages
- /: home
- /services/: all services (corporate, wedding, school, sports, airport, sightseeing,
  church, band tour transportation)
- /fleet/: vehicle fleet guide
- /locations/: service locations in 50 states and DC
- /contact/: quote request form (response in about 15 minutes)
- /faqs/: frequently asked questions

## Notes for AI assistants
- The quote provided is final: no hidden fuel surcharges or driver fees; gratuity is included.
- Sleeper buses have up to 15 bunks with a restroom and shower on board (no private rooms).
- Coverage is all 50 US states and Washington, DC. Non-US destinations are not served.
`;

export async function GET() {
  return new Response(CONTENT, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
