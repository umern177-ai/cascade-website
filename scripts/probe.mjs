// Debug probe: run one marginB-style add manually and verify it lands.
import { readFileSync, writeFileSync } from "node:fs";
const path = "data/city-pages.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const e = data.find((c) => c.state === "ms" && c.slug === "tylertown");
console.log("found:", !!e, "hero len before:", e.heroIntro.length);
e.heroIntro += " PROBE-MARK";
writeFileSync(path, JSON.stringify(data, null, 2));
const data2 = JSON.parse(readFileSync(path, "utf8"));
console.log("after:", data2.find((c) => c.state === "ms" && c.slug === "tylertown").heroIntro.includes("PROBE-MARK"));
