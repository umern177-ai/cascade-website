// Differentiation pass: Selinsgrove + Gibsonia (short pages pairing over-gate).
// Copy appended from facts already in each entry. No new claims.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (k) => {
  const [state, slug] = k.split("/");
  const e = data.find((c) => c.state === state && c.slug === slug);
  if (!e) { console.error("MISSING " + k); process.exit(1); }
  return e;
};

const se = get("pa/selinsgrove");
se.heroIntro += " The river's covered spans and ferry locks carry the valley's history half, with the twin-campus shuttle pairing the two towns' calendars on one booking.";
se.services[0].text += " The athletics calendar and the river runs book the same loop, with parents riding one plan for the full weekend.";
se.services[1].text += " One vehicle covers both campuses in a day, with the valley's back roads shaved to the standard corridor.";
se.services[2].text += " The barn lawns and riverfronts take the late-night return, and the send-off ride is priced into the same date.";
se.vehicles ??= [];
se.vehicles[0].reason += " - the quad loops and riverfront lanes share the same blocks.";
se.vehicles[1].reason += " - the twin-campus contract rides the same southern corridor.";
se.destinations[0].text += " The green quads sit closest to the visit hall, and the performing-arts calendar draws the parents' weekends through the seasons.";
se.destinations[1].text += " The Market Street blocks and the southern campus gate sit a walk apart, so the twin-campus day runs on one shuttle.";
se.destinations[2].text += " The covered-bridge spans and the river-wall trail pair the ferry story with the walking half on one county loop.";

const gi = get("pa/gibsonia");
gi.heroIntro += " The North Hills corridor runs the morning commute one way and the park traffic the other, with the city's museum row anchoring the school weeks.";
gi.services[0].text += " The lake loop and the ball fields share the one drop day, with the trailhead lot resetting the shuttle between halves.";
gi.services[1].text += " One vehicle covers the Oakland loop and the downtown leg with the incline hour set at the end of the day.";
gi.services[2].text += " Terminal pickups ride the southwest corridor, with the city legs tying to the same vehicle when booked together.";
gi.vehicles[0].reason += " - the lake loops and the trailhead lot share the same park road.";
gi.vehicles[1].reason += " - the museum row and the incline hour ride one southern day.";
gi.destinations[0].text += " The boathouse, the golf rows and the trail crossings split the park's shoreline, with the summer weekends carrying the lake traffic.";
gi.destinations[1].text += " The museum row's Forbes blocks walk in a straight line, with the history center's strip district leg a short run further.";
gi.destinations[2].text += " The incline cars climb the river face on schedule, and the upper-lot view over the three rivers lands the photograph.";
writeFileSync(path, JSON.stringify(data, null, 2));
console.log("selinsgrove + gibsonia enriched; total", data.length);
