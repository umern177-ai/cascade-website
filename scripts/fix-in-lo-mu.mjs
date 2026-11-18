// IN: Lowell~Munster margin - both Lake County but very different towns.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const get = (s) => data.find((c) => c.state === "in" && c.slug === s);
const lo = get("lowell"), mu = get("munster");

// LOWELL - lean into the farm-homestead and Cedar Creek identity
lo.heroIntro += " The town's 1834 founding line and the Melvin Halsted mill story keep the Cedar creek's water rights inside the town's heritage-downtown story, with the Nassau park's amphitheater rebuild rows bringing the town's 2026-27 event calendar into the county's largest festival reach.";
lo.premium.heroLead += ", with the Nassau amphitheater's 2026-27 rebuild bringing the town's festival calendar into reach";
lo.destinations[0].text += " The homestead's 3606 Belshaw road barnyard carries the county-parks reservation row with the visitor center's Hendricks street drive.";
lo.destinations[1].text += " The dunes' Dunewood campground's rows and the Douglas center's Environmental education wing sit inside the national park's three-entry reach.";
lo.destinations[2].text += " The water park's wave pool and the lazy-river tube rows keep the Crown Point block's family afternoon inside the county's big-ticket calendar.";
lo.faqs[0].a += " The visitor center's Hendricks street parking rows keep the free entry inside the county-park booking.";

// MUNSTER - lean into the LEED heritage, Community Hospital, and rail
mu.heroIntro += " The Wilbur Wright Room's centennial heritage block and the Calumet avenue retail corridor keep the town's story inside the Chicago-metro's northwest Indiana lines.";
mu.premium.heroLead += ", with the Community Hospital's medical corridor keeping the town's healthcare reach inside the Lake county lines";
mu.destinations[0].tip += " The View's banquet hall's 210-seat line and the salon event rows book through the golf course's posted plan.";
mu.destinations[1].text += " The park's three-entry beach lines and the West-lot's oversized-vehicle rows frame the dunes' class-plan fees.";
mu.destinations[2].text += " The two stations' Munster-Ridge and Munster-Dyer stops serve the commuter corridor's downtown hours.";

writeFileSync(path, JSON.stringify(data, null, 2));
console.log("lowell + munster differentiated");
