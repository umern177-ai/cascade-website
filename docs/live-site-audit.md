# Live site audit notes (www.cascadecharterbus.com, read on Nov 9, 2026)

These notes come from reading the live pages. They are a starting point. In Phase 1 the agent reads every page itself and adds to this file.
Pages read: home, /locations/, /locations/oh/, /services/, wedding and corporate service pages, /fleet/, charter bus, sleeper and SUV & sedan fleet pages, /about/, /contact/.
Not read yet: the other 5 service pages, 4 fleet pages, city pages, blogs, FAQs, legal pages.

## Header (same on all pages)
- Top bar: "Cascade Charter Bus | Premium Group Transportation", email, phone +1 (646) 705-0816.
- Menu: Home · Services (Corporate Event Transportation, Wedding Shuttle Bus Rental, School & Field Trip Transportation, Sports Team Transportation, Group Airport Shuttle, Sightseeing & Tour Bus Rental, Church & Religious Group Transportation, All Services) · Fleet (Charter Bus, Sleeper / Tour Buses, Minibuses, School Buses, Sprinter Vans, Limo & Party Buses, SUV & Sedans, View Entire Fleet) · Locations · About · Blogs · Contact · BOOK NOW.

## Footer (same on all pages)
- Brand block + Facebook, Instagram, LinkedIn, TikTok.
- Quick Links: Home, Our Fleet, Service Areas, Services, About Us, Get A Quote, Blogs, FAQ's.
- Our Services: the 7 services.
- Contact HQ: "Bronx NY, 10462" (WRONG — use South Ozone Park), phone, email.
- "DOT COMPLIANT — Safety-first infrastructure for every group ride."
- Privacy, Terms, Cancellation, Sitemap (links to /sitemap.xml — change to /sitemap/).
- Typo "Resereved", doubled ©. Footer titles are H6 headings (should not be headings).

## Home
Sections in order: Hero ("Premium Nationwide Service" / "Group Travel, Elevated." / REQUEST A QUOTE, VIEW OUR FLEET) → stats bar (4.9/5 Ratings, 500+ Verified Units, All 50 States Covered, 24/7 Logistics Team) → Our Heritage ("Built on Punctuality, Honesty, and Hard Work", 15+ Years of Excellence) → The Cascade Advantage ("Why Choose Cascade Bus Service": A Fleet You Can Trust, Professional Drivers, On-Time Arrivals, Executive Logistics) → Testimonials ("What Groups Say About Cascade Charter Bus": Ben Brancati; Ben, fraternity event coordinator; Katie, Disney On Ice logistics) → Tailored Transportation ("The Journeys We Serve Nationwide": 6 cards + "Plan Your Custom Journey Today", REQUEST A CUSTOM QUOTE) → FAQ (7 questions) → "Serving Every Major City & Region in the USA" (BROWSE ALL LOCATIONS) → "Your Journey Starts With One Call" (GET STARTED).
Problems: 4.9/5, 500+ and 15+ years are not confirmed facts.

## Locations hub
- H1 "Our Service Locations"; subheading "Charter Bus Rental | Explore our premium charter bus network across 44 states."
- One block per state: state name (H5) + "VIEW CITIES" button. A–Z. No search, no map.
- 44 areas listed = 43 states + District of Columbia. Not listed: AR, DE, IA, NE, NV, ND, SD, PR. (DE, AR, IA, NE, SD, PR have kept city pages — check if their state pages exist live.)

## State page (Ohio)
- Breadcrumb shows only "Home › Locations".
- H1 text: "Ohio Charter Bus in Ohio" (wrong wording).
- "Select a city below to explore local group transportation services and fleet options."
- One long A–Z list of roughly 800–900 city links (Aberdeen, Ada, Adamsville, Addyston, Adelphi, Adena, Akron, Albany, …). No grouping.
- "Reliable Transportation Across Ohio" section, then the brand block.

## Services hub
- H1 "Professional Services Tailored to Your Journey"; 7 cards with taglines ("Seamless Guest Experience", "Professional Group Logistics", "Certified Safety", "The Athlete's Choice", "Punctual Arrivals", "Extended Journeys", "Respectful & Reliable") and "View Details".
- "Booking Made Simple": Request → Review → Confirm → Ride (step titles are H5).
- FAQ is the wedding FAQ (6 wedding questions) — wrong for a hub.
- Card name "Airport Transfer Service" vs menu "Group Airport Shuttle".

## Service page pattern (wedding, corporate)
Eyebrow → H1 → H2 intro → "Key Highlights" (H5) → "Why Trust Cascade Charter Bus" (H3) → "Our Experience in Numbers" (H6: 10+ years, 15,000+ trips, 50 states) → "How Pricing Works" (H3) → FAQ → "Ready to Book Your …?" CTA.
Problems:
- "15,000+ trips" not confirmed.
- No vehicle recommendations, no capacities on the corporate page.
- Wedding: peak season "May through September" vs "May–October"; "no fees added after booking" vs "gratuity varies by operator".
- Corporate: "Punctuality guarantee" with no terms.
- og:image / twitter:image point to http://localhost:3000.
- Title repeats brand ("… | Cascade Charter Bus | Cascade Charter").
- H1s are missing commas ("for Your Guests Wedding Party & Bachelorette Crew", "for Conferences Retreats & Employee Transportation").
- Shared blocks ("Why Trust", numbers, highlights, CTA) read almost the same across service pages.

## Fleet hub
- H1 "Charter Bus & Group Transportation Fleet"; 7 vehicles each with capacity, 4 "Key Amenities" (H6), luggage, climate, technology and a "VIEW …" button.
- Data: Charter 52–56 / 50–60 large bags / dual-zone A/C / LCD-DVD · Sleeper 6–12 bunks / restroom & shower / private artist room · Mini 20–32 · Sprinter up to 14 · School 28–60 / no luggage bay · Limo & Party 14–40 · SUV & Sedan up to 7 / up to 7 carry-ons.

## Fleet page pattern (charter bus, SUV & sedan)
Breadcrumb → H1 → capacity/service/area → "Request a Quote" + "Call Now" → "{Vehicle} Transportation" → "Features & Amenities" → card with "Ideal For" (H5) → 4 FAQs → "Explore More Fleet Options" → "Need a …?" CTA.
Problems:
- "Call Now" dials +1 (800) 000-0000 (placeholder).
- Charter: "up to 56" here vs "52–56" on the hub.

## Sleeper page (different layout from other fleet pages)
- Generic site title, no breadcrumb, no FAQ.
- "12 to 15 guests", "12 private bunks", "seating for up to 15", queen bed in rear lounge, restroom, kitchen/refrigerator, front and rear TVs, WiFi. No shower listed.
- Conflicts with the hub ("6–12 bunks", "Restroom & Shower", "Private Artist Room") and with the "other fleet options" cards ("sleeps 6–12, seats up to 15").
- Small labels are H6.

## About
- Stats: 15k+ trips, 500+ verified drivers, 50 states, 4.9/5, 10+ years; "over 5,000 organizations"; "preferred choice for Fortune 500 companies". Only "10+ years" and "50 states" are confirmed.
- "Every coach includes high-speed WiFi, individual power outlets, and climate control as standard" — conflicts with fleet pages.
- "Dedicated account manager is assigned to every trip", "real-time tracking" — confirm with owner.
- No USDOT/MC numbers shown.

## Contact
- H1 "Professional Charter Booking"; 13 fields exactly as in brief Section 7.9; button "REQUEST BOOKING QUOTE".
- Sidebar: Quick Contact (phone "24/7 Dispatch", email "Direct Support"), "Guaranteed Pricing" (quote is final, no hidden fuel surcharges or driver fees), "Our Service Coverage" (H2).

## Site-wide technical problems (from the SEO consultant's roadmap)
No canonical tags · no robots meta tag · no schema · headings out of order · www and non-www both open · no GTM · no breadcrumbs on city and fleet pages · slow LCP · one 4 MB sitemap · XML sitemap linked in the footer · weak 404 page · llms.txt not optimized.

## Trustpilot
Profile: https://www.trustpilot.com/review/cascadecharterbus.com — claimed Sept 2026; 7 reviews (Sept–Oct 2026), all 5-star and verified; TrustScore 4.2. Topics: school event bookings, a tour trip, group and event transport; praise for communication, punctuality, drivers and clean coaches.

## Owner decisions on Nov 9 (after this audit)
- "5+ years of service" everywhere (replaces 10+ and 15+).
- Sleeper buses: 4 to 15 bunks available; restroom and shower on board.
- Puerto Rico removed. US states and DC only.
- FAQs on every page type.

## What the page code shows (docs/live-reference/html/)
Files: `home.html`, `locations-hub.html`, `city-acton-mt.html` (an example of the old city template; Acton MT itself is not a kept page), `service-corporate-transportation.html`.
- Built with Next.js (Turbopack build), Bootstrap 5 class names, styled-jsx for custom styles, Lucide icons, Inter loaded through next/font.
- Custom classes to reuse: `hover-lift`, `bg-primary-soft`, `x-small`, `x-small-bold`, `footer-link`; buttons are `btn btn-primary rounded-pill`; cards are `card border-0 shadow-sm rounded-4`.
- No animation library is loaded. Motion is CSS only (for example `hover-lift`).
- Every page has `<meta name="keywords" content="charter bus,bus rental,Cascade transport,luxury coach">` — remove it.
- Home, locations hub and city page have no canonical tag and no schema. The corporate service page has both, so the setup is inconsistent.
- Home page: stat labels are H6, "15+" is an H3, testimonial names are H3. The footer logo text is an H3 ("CASCADE Charter BUS").
- Locations hub: title is the generic site title; state names are H5.
- Old city template (Acton MT): title "Charter Bus Rental in acton, MT | Cascade Charter Bus | Cascade Charter" (lower-case city, brand twice). Sections: "Group Charter Logistics in acton, Montana" → "Key Landmarks & Coordinates" → "Top Destination near Acton, Yellowstone County" → "Recommended Vehicles for acton Groups" (Mid-Size Executive Minibus, Passenger Sprinter Van, 56-Passenger Luxury Motorcoach) → 4 FAQs with the city name dropped in → "Ready to Travel from acton?". Hero photos are loaded from Unsplash, not real local photos. This is the template text that must be replaced by real local content (brief Section 8). Keep the page frame, replace the content.

## Added later on Nov 9: two more page-code files
- `contact-booking-form.html` — the booking form. All fields, placeholders and required marks are listed in brief Section 7.9. Notes: generic page title; no canonical; pill buttons are plain buttons (not real form inputs); hero dot pattern uses blue #0047AB; Google Map of New York in "Our Service Coverage"; the 404 text inside the code says "Route Not Found".
- `fleet-charter-bus.html` — the charter bus page. Canonical points to the www address. Sections: breadcrumb → H1 "Charter Buses" → capacity/service/service area → "Charter Buses Transportation" → "Features & Amenities" → card with "Ideal For" → 4 FAQs → "Explore More Fleet Options" (6 cards, H5) → "Need a Charter Bus?".
- Site-wide: Bootstrap 5.3.0 script loaded from the jsdelivr CDN; manifest at /site.webmanifest; social links: Facebook /people/Cascade-Charter-Bus/61583281777154, Instagram @cascadecharterbus, LinkedIn /company/cascadecharterbus, TikTok @cascadecharterbus.
- The owner cannot provide the full source code. Work from these six files and the live site.
