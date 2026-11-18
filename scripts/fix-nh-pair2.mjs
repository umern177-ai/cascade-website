// NH pair fix 2: Newbury + Sunapee. Pure scaffold-floor case (no genuine
// content overlap) - both pages short. Add unique words from entry facts.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (s) => data.find((c) => c.state === "nh" && c.slug === s);
const nu = get("newbury"), su = get("sunapee");

nu.heroIntro += " The resort's season lift windows post weekdays at nine through four with the weekend eights at the summit rows, and the harbor-side circle keeps the beach-and-launch line inside a walker's loop.";
nu.services[0].text += " The resort's summer chairlift rides book late June through Labor Day midweeks with the September weekends beyond, one calendar for the seasons' halves.";
nu.destinations[0].text += " The campground rows and the launch-and-trailer fee schedule ride the same passport line as the beach hours.";
nu.destinations[2].text += " The fair's nine-day run prices the maker booths through the mountain's own event line, with the September weekends the biggest draw.";
nu.premium.heroLead += ", with the harbor circle's beach-and-launch line a walker's loop from the slopes";

su.heroIntro += " The harbor museum's steamboat-era model rows and the livery's waterfront display keep the lake's cruise history at the dock line, with the islands' sandy south reaches marking the cruise route's turning points.";
su.services[0].text += " The catamaran's ADA-accessible boarding rows and the forty-five-dollar adult fares cover the two-hour narrated island loop.";
su.destinations[0].text += " The six islands' cruise-route lines and the small public beach row keep the harbor half inside the walking loop.";
su.destinations[2].text += " The seventy-foot accessible catamaran's boarding rows pair the narrated hours with the harbor's picnic line.";
su.premium.heroLead += ", narrated past the lake's six islands on the season's two-hour loops";

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("newbury + sunapee margin applied");
