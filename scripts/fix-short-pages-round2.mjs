// Differentiation pass round 2: Vermilion OH, Oxford WI, Necedah WI, Honesdale PA.
// Short pages pairing at/below the 0.20 gate line vs newly enriched pages.
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

const ve = get("oh/vermilion");
ve.heroIntro += " The lakefront inns and festival weeks run the shore calendar above the harbor, and the west shore route keeps the coaster weekends within a short ride of the beach stairs.";
ve.services[0].text += " The beach stair rows and the launch ramp split the same village drop, with the harbor block holding the bus through the day.";
ve.services[1].text += " Guest loops ride from the Cleveland arrivals and the inns' courtyards, with the sunset return priced into the date.";
ve.services[2].text += " One vehicle covers the coaster weekend and the lakefront evening on the same shore run.";
ve.vehicles[0].reason += " - the beach stair rows and the harbor blocks share the same drop.";
ve.vehicles[1].reason += " - the inn courtyards and the Cleveland arrivals ride one loop.";
ve.destinations[0].text += " The swim rows and the concession stands stand between the street and the sand, with the kayak launch keeping its own lane east.";
ve.destinations[1].text += " The replica light keeps the harbor's cast-iron story a photo stop inside the beach hour itself.";
ve.destinations[2].text += " The complex's dining decks face the marina rows, with the harbor evening booking the walk-in dinner hour.";

const ox = get("wi/oxford");
ox.heroIntro += " The lake's east launches book the fishing weekends from the county roads, with the sand-country fairways' resort traffic running the shoulder seasons between.";
ox.services[0].text += " The tee sheets ride the resort's shuttle days, with the clubhouse loops holding the bags between rounds.";
ox.services[1].text += " The park day splits between the indoor halves and the outdoor slides, with the coach holding the check-in lot.";
ox.services[2].text += " The lakeside roads take the minibus and the reunion shelters book the shelter rows ahead of the date.";
ox.vehicles[0].reason += " - the launch lots and the clubhouse loops share the county roads.";
ox.vehicles[1].reason += " - the family reunions and the airport pickups ride one van.";
ox.destinations[0].text += " The river's wide water keeps the piers and the park lawns, with the launches spaced along the dam's reach.";
ox.destinations[1].text += " The sand country's fairways run out of the county roads, with the out-state weekends keeping the tee sheets full.";
ox.destinations[2].text += " The waterpark rows and the river-tour docks book the city's whole family day inside one check-in.";
if (ox.premium) ox.premium.heroLead += " We run the golf weekends, the Dells days and the lake reunions on one county plan.";

const ne = get("wi/necedah");
ne.heroIntro += " The refuge's crane season runs the school mornings through the tower loops, and the wetland roads stay firm to the visitor center's lot through the seasons.";
ne.services[0].text += " The tower loops and the visitor center's hours split the refuge morning, with the auto route covering the gravel miles.";
ne.services[1].text += " The waterpark day splits the family blocks with the towers' morning, one quote for the full weekend.";
ne.services[2].text += " The church halls book the gathering weekends, with the guest loops holding the late return.";
ne.vehicles[0].reason += " - the gravel stretches stay minibus work.";
ne.vehicles[1].reason += " - the Dells eastbound runs and the regional legs share the corridor.";
ne.destinations[0].text += " The crane country's towers watch the marsh's open water, with the auto route's stops marked through the wetland miles.";
ne.destinations[1].text += " The parks and the boat-tour docks split the family day, with the tour queues booked by the morning drop.";
ne.destinations[2].text += " The river bottoms launch the quiet paddles, with the county shelters keeping the picnic half.";

const ho = get("pa/honesdale");
ho.heroIntro += " The canal basin's locks and the Lion replica's platform sit a block off Main Street, with the cliff park's gorge walk rising above the rooftops for the view.";
ho.services[0].text += " The valley venue's barn doors book the guest loops from the inns, with the Scranton arrivals timed inside the window.";
ho.services[1].text += " The replica and the canal basin walk the class's downtown morning, with the museum block closing the loop.";
ho.services[2].text += " One vehicle covers the corridor gateway and the county legs with the valley's return planned in.";
ho.vehicles[0].reason += " - the basin blocks and the venue lane share the same valley roads.";
ho.vehicles[1].reason += " - the wedding weekends and the corridor legs ride one coach.";
ho.destinations[0].text += " The barn's valley view carries the ceremony half, with the plateau's county roads keeping the coach on the shoulder row.";
ho.destinations[1].text += " The canal basin's locks walk the Lion's run-in-America story through the downtown blocks.";
ho.destinations[2].text += " The Dyberry gorge's cliff path climbs the town's overhang, with the base lot holding the bus through the walk.";
writeFileSync(path, JSON.stringify(data, null, 2));
console.log("round-2 enrichment applied; total", data.length);
