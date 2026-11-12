// Central site data (Phase 2). In Phase 3b these all become editable in the admin
// (brief Section 19.10); until then this module mirrors that data 1:1.
// Facts come from data/site.json + owner decisions of Nov 9, 2026.

export const SITE = {
  name: "Cascade Charter Bus",
  tagline: "Cascade Charter Bus | Premium Group Transportation",
  url: "https://cascadecharterbus.com",
  phoneDisplay: "+1 (646) 705-0816",
  phoneTel: "+16467050816",
  phoneNote: "24/7 Dispatch",
  email: "info@cascadecharterbus.com",
  address: {
    street: "12409 Linden Blvd",
    city: "South Ozone Park",
    state: "NY",
    zip: "11420",
  },
  years: "5+ years of service",
  coverage: "All 50 States Covered",
  gtmId: "GTM-5WTG8HBP",
  trustpilotProfile: "https://www.trustpilot.com/review/cascadecharterbus.com",
  social: {
    facebook: "https://www.facebook.com/people/Cascade-Charter-Bus/61583281777154",
    instagram: "https://www.instagram.com/cascadecharterbus",
    linkedin: "https://www.linkedin.com/company/cascadecharterbus",
    tiktok: "https://www.tiktok.com/@cascadecharters",
  },
} as const;

export const SERVICES = [
  { slug: "corporate-transportation", name: "Corporate Event Transportation" },
  { slug: "wedding-transportation", name: "Wedding Shuttle Bus Rental" },
  { slug: "school-transportation", name: "School & Field Trip Transportation" },
  { slug: "sports-team-transportation", name: "Sports Team Transportation" },
  { slug: "airport-transfer", name: "Group Airport Shuttle" },
  { slug: "sightseeing-tour-bus", name: "Sightseeing & Tour Bus Rental" },
  { slug: "church-religious-transportation", name: "Church & Religious Group Transportation" },
  { slug: "band-tour-bus", name: "Band Tour Bus" },
  { slug: "winery-tour-bus-rental", name: "Winery Tour Bus Rental" },
  { slug: "military-group-transportation", name: "Military Group Transportation" },
  { slug: "government-transportation", name: "Government Transportation" },
  { slug: "casino-bus-trips", name: "Casino Bus Trips" },
] as const;

export const FLEET = [
  { slug: "charter-bus", name: "Charter Bus" },
  { slug: "sleeper", name: "Sleeper / Tour Buses" },
  { slug: "minibus", name: "Minibuses" },
  { slug: "school-bus", name: "School Buses" },
  { slug: "sprinter-van", name: "Sprinter Vans" },
  { slug: "party-bus", name: "Limo & Party Buses" },
  { slug: "suv-sedan", name: "SUV & Sedans" },
] as const;

export type Testimonial = { name: string; role: string; quote: string };
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ben Brancati",
    role: "Private Group Organizer",
    quote:
      "Pardon the tardy email, but I wanted to extend a sincere thank you! Thank you for helping us coordinate and secure a bus for 8/15 from the Connecticut River Museum to Mohegan Sun. A huge thank you to Eric, our driver, who was exceedingly friendly, kind, and helpful. We had an outstanding experience with Cascade thanks to Eric and your entire planning and dispatch team.",
  },
  {
    name: "Ben",
    role: "Fraternity Event Coordinator",
    quote:
      "Absolute lifesavers! I can't express my gratitude enough to the Cascade team. We needed a bus from our fraternity to the Oak Hill Outdoor Center on the 27th. I called Cascade on the 25th, and they assured us we were covered. The best part? I called back on the 26th needing to add a whole second bus last minute, and they completely showed up and showed out for us.",
  },
  {
    name: "Katie",
    role: "Logistics Team, Disney On Ice",
    quote:
      "As a Tour Manager, I've only ever had good things to say about Cascade. They offer great, exceptionally well-maintained sleeper buses along with awesome drivers. We've been touring with them for Disney On Ice the Musical, and the absolute best part is their backend support team—always available, responsive, and ready to help.",
  },
];

// The 6 owners' Trustpilot reviews (owner-supplied Nov 9, 2026, verbatim, unedited).
// Source: https://www.trustpilot.com/review/cascadecharterbus.com
export type Review = { name: string; location: string; date: string; verified: boolean; title: string; text: string };
export const TRUSTPILOT_REVIEWS: Review[] = [
  {
    name: "Katie Devoe",
    location: "US",
    date: "Oct 30, 2026",
    verified: true,
    title: "Great Service!",
    text: "The team at Cascade is professional, accommodating, and great to work with! We look forward to traveling with them again!",
  },
  {
    name: "Raquel E",
    location: "US",
    date: "Oct 26, 2026",
    verified: true,
    title: "Everything went as planned",
    text: "Everything went as planned! Booked a bus for 35 high school kids for homecoming. They were prompt communicating and the driver arrived on time and was professional. Price was good too. No issues. Will use them again next year. Thank you!!",
  },
  {
    name: "Rachel Soloway",
    location: "US",
    date: "Oct 23, 2026",
    verified: true,
    title: "Great experience with Cascade for a school bus rental",
    text: "Great experience with Cascade for a school bus rental for transporting kids to an event! Everything from getting a quote to finalizing the details to the day of the bus rental was easy and went smoothly. Great communications and a seamless experience. I wouldn't hesitate to use Cascade again and highly recommend them.",
  },
  {
    name: "Roger Dalkin",
    location: "US",
    date: "Oct 23, 2026",
    verified: true,
    title: "Eras Bowling Tour",
    text: "Correspondence was timely and concise. Joseph, the driver, was on time and personable. The coach was clean.",
  },
  {
    name: "Angie Harris Roberts",
    location: "US",
    date: "Sep 21, 2026",
    verified: true,
    title: "Will use again!",
    text: "It was so easy to work with Cascade Charter Bus. Their communication was timely and concise and I appreciated their ability to pivot right before our event. I would definitely use them again.",
  },
  {
    name: "Tina B",
    location: "US",
    date: "Sep 14, 2026",
    verified: true,
    title: "Great experience",
    text: "The reservation process was super easy. The driver was prompt & professional, Jeff made the event a fun success!",
  },
];

export type Faq = { q: string; a: string };
// Home FAQ — the same 7 questions as live, answers tidied (direct answer first).
export const HOME_FAQS: Faq[] = [
  {
    q: "How much does a charter bus rental cost?",
    a: "The price depends on your group size, the vehicle type, trip distance, and seasonal demand. A sprinter van or school bus typically costs less than a full-size motorcoach. Contact us for a fast, free quote based on your exact itinerary.",
  },
  {
    q: "How far in advance should I book a charter bus?",
    a: "For major events like weddings or peak-season dates, we advise reserving your bus 4 to 8 weeks in advance. For smaller local trips or off-peak dates, 1 to 2 weeks notice is generally sufficient to secure your preferred vehicle.",
  },
  {
    q: "What size bus do I need for my group?",
    a: "It comes down to headcount and luggage. As a rule of thumb: sprinter vans fit 10–14 people, minibuses seat 20–30, and full-size motorcoaches comfortably fit up to 56 passengers. Our dispatch team will gladly recommend the right vehicle.",
  },
  {
    q: "Can I rent a school bus instead of a charter bus to save money?",
    a: "Yes—a school bus is usually the most economical per-seat choice. It works well for school trips, and many wedding planners choose it for guest shuttles when budget matters more than luxury amenities.",
  },
  {
    q: "What's included in a charter bus rental cost?",
    a: "Your quote covers the vehicle, a professional driver, tolls, taxes, and driver gratuity. The quote you receive is final—no hidden fuel surcharges or driver fees—so you get one clear price for the whole trip.",
  },
  {
    q: "What questions should you ask while booking a bus?",
    a: "We encourage asking: Is the quoted price fully inclusive? Are there any extra fees? How are extra services handled during the trip? Is the driver tip included? Is dispatch support available during the trip? What happens if the bus has an issue? Do the coaches have onboard restrooms?",
  },
  {
    q: "What areas do you serve?",
    a: "We run charter bus rentals nationwide across all 50 states. Tell us your pickup location and destination, and our 24/7 dispatch team will confirm availability right away.",
  },
];
