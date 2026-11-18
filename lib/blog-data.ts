// Blog data: real, fact-checked guides only. Every fact in a post traceable
// to site data (lib/fleet-data.ts, lib/site-data.ts) or owner-confirmed
// decisions. No invented statistics, prices or review quotes.
import { pageMeta } from "@/lib/page-meta";

export type BlogSection = { h: string; paras?: string[]; list?: string[] };
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tag: string;
  author: string;
  readMinutes: number;
  featuredImage: string;
  imageAlt: string;
  intro: string;
  sections: BlogSection[];
  related: { href: string; label: string }[];
};

export const POSTS: BlogPost[] = [
  {
    slug: "how-to-plan-a-group-charter-bus-trip",
    title: "How to Plan a Group Charter Bus Trip: The Complete Timing Guide",
    description:
      "A step-by-step charter bus planning timeline: when to book, how to size the vehicle, route planning, the pickup plan and a pre-trip checklist.",
    date: "2026-11-18",
    tag: "Planning",
    featuredImage: "/images/blog/3.webp",
    imageAlt: "Cascade Charter Bus motorcoach parked curbside",
    author: "Cascade Dispatch Team",
    readMinutes: 7,
    intro:
      "Most group trips go wrong at the planning stage, not on the road: the quote lands after the venue deadline, the bus arrives sized to the wrong headcount, or the last pickup eats the reception. This guide lays out the order to plan a charter bus rental—what to confirm first, what can wait, and what dispatch needs from you so the quote comes back final. Every timing and figure here reflects how our own dispatch team actually prices and runs trips.",
    sections: [
      {
        h: "Start with the two numbers that decide everything: headcount and luggage",
        paras: [
          "Before any date or destination, count people and count bags. Those two numbers size the vehicle, and the vehicle drives the price. A full-size charter coach seats 52–56 passengers with 50–60 large bags stored in the under-bus bays; a minibus covers 20–32 guests; a Sprinter van handles up to 14; school buses run 28–60 seats but have no luggage bay. A limo or party bus carries 14–40 for celebration nights.",
          "If your luggage load exceeds the vehicle, the plan fails even with the right seat count. Instrument cases, coolers, sports bags and presentation materials all count. Tell dispatch the oversized items by name and the quote proposes a vehicle—or a second vehicle—that actually fits them.",
        ],
      },
      {
        h: "Book 4–8 weeks out for peak dates; small local trips move faster",
        paras: [
          "Peak season compresses availability. Weddings run May through November, spring and fall fill school field-trip season, and conference-heavy weekends tighten city availability. For those dates, four to eight weeks of lead time keeps your options open. Smaller, local trips can often be arranged with one to two weeks of notice, and same-week requests are sometimes workable—call dispatch instead of guessing.",
          "When you request the quote, send the full picture in one message: pickup address, destination, date, pickup time, headcount and luggage. Dispatch prices exactly what you send, and the quote comes back final—gratuity, tolls and taxes included—usually within about 15 minutes. A vague request gets a slower, less exact price, so the itinerary quality controls the quote quality.",
        ],
      },
      {
        h: "Build the route as a written plan, not a chat thread",
        paras: [
          "Once the vehicle is sized, the route is what dispatch turns into a schedule. Name every stop in order: the hotel block, the ceremony venue, the reception hall, the restaurant between them. For winery days, send the tasting reservations before the bus schedule—the day is sequenced around confirmed bookings, not hoped-for openings. For sports runs, the gear load rides with the roster on the same sheet.",
          "The written quote states the plan: vehicle count, loop times, pickup windows and the final drop-off. Anything that changes later—stops, times, a swapped venue—gets confirmed in writing with one message before travel day, so the driver's plan and your plan never drift apart.",
        ],
      },
      {
        h: "Plan the pickup schedule backwards from the fixed event",
        paras: [
          "Ceremonies, keynote addresses and game kickoffs are the immovable points. The pickup schedule works backwards from them: the time the group must step off the bus, minus the unload, minus the drive, minus the boarding window. Drivers arrive ahead of the pickup time, and on airport arrivals dispatch can track the flight so a late landing doesn't leave the bus.",
          "Loop plans—hotel to venue and back—are timed to the photography and event schedule rather than estimated. Federal driver-hours rules shape long days, so multi-day runs are scheduled with rest or relief options built in. This is why the quote states an exact plan instead of an open-ended wait: the driver who meets your group in the morning is the same driver who closes out the night.",
        ],
      },
      {
        h: "The pre-trip checklist that keeps the quote final",
        list: [
          "Pickup address, including which door or lot the coach should use",
          "Pickup time and date, plus the return time for round trips",
          "Destination, plus every intermediate stop in order",
          "Headcount, split by vehicle if the group is large",
          "Luggage count, with oversized items named",
          "Special requirements: accessibility needs, onboard WiFi, a requested party bus, child seats where the route requires them",
          "A day-of contact phone number for dispatch",
        ],
        paras: [
          "Send those seven things and the quote you receive is final: the vehicle, the driver's plan, one all-inclusive price. Dispatch stays reachable around the clock before and during the trip, so if a bracket shifts or a ceremony runs long, the plan moves with the day instead of breaking it.",
          "When you are ready to price your own trip, the full booking form covers every field above—or send a request and the dispatch team follows up with the questions that matter for your route.",
        ],
      },
    ],
    related: [
      { href: "/services/wedding-transportation/", label: "Wedding Shuttle Bus Rental" },
      { href: "/services/corporate-transportation/", label: "Corporate Event Transportation" },
      { href: "/fleet/charter-bus/", label: "Charter Buses" },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function blogMeta(post: BlogPost) {
  return pageMeta({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}/`,
  });
}
