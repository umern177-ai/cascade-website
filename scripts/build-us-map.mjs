// Build /contact/ coverage-map data: data/us-map.json
// Source: PublicaMundi us-states.json (US Census cartographic boundaries,
// public domain). CONUS via Albers equal-area conic (standard USA params);
// Alaska/Hawaii normalized into standard bottom-left insets; tiny islands
// dropped; HQ dispatch point (South Ozone Park, NY) included.
import fs from "node:fs";

// Usage: node scripts/build-us-map.mjs [us-states.json]
// Download the source once (US Census cartographic boundaries, public domain):
//   curl -sL -o us-states.json https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json
const SRC = process.argv[2] || "us-states.json";
const OUT = "data/us-map.json";
// leftover generated files from an earlier attempt — removed at the end
const STALE = [
  "app/us-map-paths.json",
  "app/us-map-centroids.json",
];

const d2r = Math.PI / 180;
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

function albers(lon, lat, n = 0.5 * (Math.sin(29.5 * d2r) + Math.sin(45.5 * d2r))) {
  const C = Math.cos(29.5 * d2r) ** 2 + 2 * n * Math.sin(29.5 * d2r);
  const rho = Math.sqrt(C - 2 * n * Math.sin(lat * d2r)) / n;
  const theta = n * (lon * d2r - (-96 * d2r));
  return [rho * Math.sin(theta), C / (2 * n) - rho * Math.cos(theta)];
}

const geo = JSON.parse(fs.readFileSync(SRC, "utf8"));
const skip = new Set(["Puerto Rico", "Guam", "American Samoa", "Virgin Islands", "Northern Mariana Islands"]);

const CODE = {
  Alabama: "al", Alaska: "ak", Arizona: "az", Arkansas: "ar", California: "ca", Colorado: "co",
  Connecticut: "ct", Delaware: "de", "District of Columbia": "dc", Florida: "fl", Georgia: "ga",
  Hawaii: "hi", Idaho: "id", Illinois: "il", Indiana: "in", Iowa: "ia", Kansas: "ks",
  Kentucky: "ky", Louisiana: "la", Maine: "me", Maryland: "md", Massachusetts: "ma",
  Michigan: "mi", Minnesota: "mn", Mississippi: "ms", Missouri: "mo", Montana: "mt",
  Nebraska: "ne", Nevada: "nv", "New Hampshire": "nh", "New Jersey": "nj", "New Mexico": "nm",
  "New York": "ny", "North Carolina": "nc", "North Dakota": "nd", Ohio: "oh", Oklahoma: "ok",
  Oregon: "or", Pennsylvania: "pa", "Rhode Island": "ri", "South Carolina": "sc",
  "South Dakota": "sd", Tennessee: "tn", Texas: "tx", Utah: "ut", Vermont: "vt",
  Virginia: "va", Washington: "wa", "West Virginia": "wv", Wisconsin: "wi", Wyoming: "wy",
};

function ringsOf(geom) {
  return geom.type === "Polygon" ? geom.coordinates : geom.coordinates.map((p) => p[0]);
}
function ringArea(r) {
  let a = 0;
  for (let i = 1; i < r.length; i++) a += (r[i - 1][0] * r[i][1] - r[i][0] * r[i - 1][1]);
  return Math.abs(a / 2);
}
function fitBoxShared(rings, box) {
  // one shared lon/lat bbox for every ring (so Alaska's islands don't each
  // stretch across the whole inset box)
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const r of rings) {
    for (const [lon, lat] of r) {
      if (lon < x0) x0 = lon; if (lon > x1) x1 = lon;
      if (lat < y0) y0 = lat; if (lat > y1) y1 = lat;
    }
  }
  return rings.map((r) =>
    r.map(([lon, lat]) => [
      box[0][0] + ((lon - x0) / (x1 - x0)) * (box[1][0] - box[0][0]),
      box[0][1] + ((y1 - lat) / (y1 - y0)) * (box[1][1] - box[0][1]),
    ])
  );
}

const perState = [];
for (const f of geo.features) {
  const name = f.properties.name;
  if (skip.has(name) || !CODE[name]) continue;
  const rings = ringsOf(f.geometry).filter((r) => ringArea(r) > 0.02 || name === "District of Columbia");
  let pts;
  if (name === "Alaska") pts = fitBoxShared(rings, [[14, 398], [300, 588]]);
  else if (name === "Hawaii") pts = fitBoxShared(rings, [[318, 480], [478, 552]]);
  else pts = rings.map((r) => r.map(([lon, lat]) => albers(lon, lat)));
  perState.push({ name, rings: pts.filter((r) => r.length > (name === "District of Columbia" ? 0 : 3)) });
  if (name !== "Alaska" && name !== "Hawaii") {
    for (const [x, y] of pts.flat()) {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
}

// reserve the bottom band (~150px) + top for AK/HI, then map CONUS into the rest
const W = 975, H = 610;
const pad = { t: 10, r: 10, b: 148, l: 10 };
const cw = maxX - minX, ch = maxY - minY;
const fx = (x) => pad.l + ((x - minX) / cw) * (W - pad.l - pad.r);
const fy = (y) => pad.t + ((maxY - y) / ch) * (H - pad.t - pad.b);

function emitStd(ring) {
  const step = ring.length > 220 ? 5 : ring.length > 80 ? 3 : 2;
  const pts = [];
  for (let i = 0; i < ring.length; i += step) pts.push(ring[i]);
  return "M" + pts.map(([x, y]) => (Math.round(fx(x) * 5) / 5) + " " + (Math.round(fy(y) * 5) / 5)).join("L") + "Z";
}
function emitInset(ring) {
  const step = ring.length > 160 ? 3 : 2;
  const out = [];
  for (let i = 0; i < ring.length; i += step) out.push(ring[i][0].toFixed(1) + " " + ring[i][1].toFixed(1));
  return "M" + out.join("L") + "Z";
}

const statesOut = {};
for (const { name, rings } of perState) {
  const isInset = name === "Alaska" || name === "Hawaii";
  const d = (isInset ? rings.filter((r) => r.length > 12) : rings).map(isInset ? emitInset : emitStd).join("");
  if (!d) continue;
  const big = rings.reduce((a, b) => (b.length > a.length ? b : a));
  let cx = 0, cy = 0;
  for (const [x, y] of big) { cx += x; cy += y; }
  cx /= big.length; cy /= big.length;
  let best = big[0], bd = Infinity;
  for (const [x, y] of big) {
    const dd = (x - cx) ** 2 + (y - cy) ** 2;
    if (dd < bd) { bd = dd; best = [x, y]; }
  }
  const pin = isInset
    ? [Math.round(best[0] * 5) / 5, Math.round(best[1] * 5) / 5]
    : [Math.round(fx(best[0]) * 5) / 5, Math.round(fy(best[1]) * 5) / 5];
  statesOut[CODE[name]] = { n: name, d, p: pin };
}

// HQ: South Ozone Park, NY — dispatch station
const hq = albers(-73.83, 40.685);
const out = { hq: { n: "South Ozone Park, NY", p: [Math.round(fx(hq[0]) * 5) / 5, Math.round(fy(hq[1]) * 5) / 5] }, width: W, height: H, states: statesOut };

fs.writeFileSync(OUT, JSON.stringify(out));
STALE.forEach((p) => fs.existsSync(p) && fs.unlinkSync(p));
console.log("states:", Object.keys(statesOut).length, "file KB:", Math.round(fs.statSync(OUT).size / 1024));
for (const c of ["ny", "nv", "nd", "dc", "tx", "ca", "mi", "ak", "hi", "me", "ri"]) {
  const s = statesOut[c];
  console.log(c, s ? s.p : "MISSING", s ? "pathLen " + s.d.length : "");
}
console.log("HQ", out.hq.p);
