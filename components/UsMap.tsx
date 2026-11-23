"use client";

// Coverage map on /contact/: the whole USA drawn as inline SVG with a pin in
// every state. Hovering a state draws a dashed "signal" line from our dispatch
// station (South Ozone Park, NY) to that state's pin.
//
// Data: data/us-map.json — generated once from US Census cartographic
// boundaries (public domain) by scripts; ~19 KB, zero external requests,
// which is why it replaced the click-to-load Google Maps embed (owner request
// Nov 19: remove the Ozone Park caption, show the whole country with pins).
//
// Facts kept true: 48 states have their own city-page hub (links to
// /locations/{state}/); Nevada, North Dakota and DC have no page — their pins
// open the quote form instead, because every state is bookable by phone/form.
//
// STABILITY (owner: "glitchy when the cursor sweeps bottom-to-top", Nov 23):
// moving quickly across state borders used to re-render the WHOLE map on every
// pointerenter — all 51 state paths, 51 tap circles and 50 pin dots repainted,
// and leaving the map snapped the line back to New York. Now every heavy layer
// (state shapes, tap circles, pins) is a memoized component that never
// re-renders on hover; a hover updates only the dashed line, the state-name
// tag and the one hot pin (styled by CSS class, with a small opacity fade).
// The map keeps the last connection when the cursor leaves — no snap-back.
import { memo, useState } from "react";
import mapData from "@/data/us-map.json";

const NO_PAGE_STATES = new Set(["nv", "nd", "dc"]);

type UsStates = Record<string, { n: string; d: string; p: [number, number] }>;

// approximate polygon area from a compact "M x y L x y … Z" path (shoelace over
// each subpath). Stacks the invisible tap circles: smaller states sit on top so
// overlapping circles resolve to the nearer state.
function pathArea(d: string): number {
  let total = 0;
  for (const sub of d.split("M")) {
    const nums = sub.match(/-?\d+(?:\.\d+)?/g);
    if (!nums || nums.length < 6) continue;
    const pts: [number, number][] = [];
    for (let i = 0; i + 1 < nums.length; i += 2) pts.push([Number(nums[i]), Number(nums[i + 1])]);
    let a = 0;
    for (let i = 1; i < pts.length; i++) a += pts[i - 1][0] * pts[i][1] - pts[i][0] * pts[i - 1][1];
    total += Math.abs(a / 2);
  }
  return total;
}

const DATA = mapData as unknown as {
  hq: { n: string; p: [number, number] };
  width: number;
  height: number;
  states: UsStates;
};

// computed ONCE at module load — recomputing 51 polygon areas on every
// pointerenter re-render made hover stutter
const TAP_ORDER = Object.entries(DATA.states)
  .map(([code, s]) => ({ code, s, area: pathArea(s.d) }))
  .sort((a, b) => b.area - a.area);

// ---- memoized static layers: identical props on every hover = zero re-render

const StatesLayer = memo(function StatesLayer({ states, onHover }: { states: UsStates; onHover: (code: string) => void }) {
  return (
    <g className="us-map-states">
      {/* No <title> tooltips here: React 19 hoists <title> elements into
          <head>, which breaks hydration. The state name shows as SVG text
          on hover, and each tap-circle link carries an aria-label. */}
      {Object.entries(states).map(([code, s]) => (
        <path
          key={code}
          d={s.d}
          onPointerEnter={() => onHover(code)}
          style={{ cursor: NO_PAGE_STATES.has(code) ? "default" : "pointer" }}
        />
      ))}
    </g>
  );
});

const TapLayer = memo(function TapLayer({ onHover }: { onHover: (code: string) => void }) {
  return (
    <>
      {/* Invisible tap circles around each pin: ALL clicks and taps route
          through these (keyboard-accessible), because tiny eastern shapes
          (RI, DE, CT, DC…) can't be tapped as paths and the whole SVG scales
          down on phones. r=34 ≈ 25px on a 390px-wide phone. Circles are
          stacked smallest-state-last, so a tap inside two overlapping
          circles picks the smaller (more likely intended) state. Hover
          still highlights the state shape itself. */}
      {TAP_ORDER.map(({ code, s }) => (
        <a
          key={"hit-" + code}
          href={NO_PAGE_STATES.has(code) ? "/contact/" : `/locations/${code}/`}
          data-source={`map:${code}`}
          onPointerEnter={() => onHover(code)}
          aria-label={`${s.n} charter bus rental ${NO_PAGE_STATES.has(code) ? "— get a quote" : "locations"}`}
        >
          <circle cx={s.p[0]} cy={s.p[1]} r="34" fill="transparent" stroke="none" />
        </a>
      ))}
    </>
  );
});

const PinLayer = memo(function PinLayer({ active }: { active: string }) {
  return (
    <>
      {/* signal pin in every state — active one brightened by CSS class */}
      {Object.entries(DATA.states).map(([code, s]) => (
        <circle
          key={"pin-" + code}
          className={"us-map-pin" + (active === code ? " us-map-pin-hot" : "")}
          cx={s.p[0]}
          cy={s.p[1]}
          r={NO_PAGE_STATES.has(code) ? 3.5 : 4.5}
          fill="#f5a002"
          stroke="#0f1115"
          strokeWidth="1.5"
          aria-hidden="true"
          pointerEvents="none"
        />
      ))}
    </>
  );
});

export default function UsMap() {
  const [active, setActive] = useState("ny");
  const { hq, width, height, states } = DATA;
  const target = states[active] ?? states.ny;

  return (
    <figure className="us-map" style={{ margin: 0 }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="us-map-svg w-100 h-auto"
        role="img"
        aria-label={`Map of the United States with a pin in every state, connected to the Cascade Charter Bus dispatch station in ${hq.n}`}
      >
        <defs>
          <radialGradient id="usmap-hq-halo" r="50%">
            <stop offset="0%" stopColor="#f5a002" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#f5a002" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="us-map-states" aria-hidden="false">
          <StatesLayer states={states} onHover={setActive} />
        </g>

        {/* dashed "signal" line: dispatch station -> hovered state. Drawn ON
            TOP of the state fills (below the pin dots) — it used to sit under
            the states and only leaked through thin gaps, which read as a
            rendering glitch (owner, Nov 23). Always mounted: moving the hover
            updates coords in place instead of mounting/unmounting, so nothing
            flashes while the cursor sweeps. Not interactive. */}
        <g aria-hidden="true" style={{ pointerEvents: "none" }}>
          <line
            x1={hq.p[0]}
            y1={hq.p[1]}
            x2={target.p[0]}
            y2={target.p[1]}
            stroke="#f5a002"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 7"
            opacity="0.8"
          />
        </g>

        <TapLayer onHover={setActive} />

        {/* HQ station marker */}
        <g aria-hidden="true">
          <circle cx={hq.p[0]} cy={hq.p[1]} r="26" fill="url(#usmap-hq-halo)" className="us-map-halo" />
          <circle cx={hq.p[0]} cy={hq.p[1]} r="7" fill="#fff" stroke="#f5a002" strokeWidth="3" />
        </g>

        <PinLayer active={active} />

        {/* active state name tag (always mounted, moves in place) */}
        <text
          x={Math.min(target.p[0] + 12, width - 130)}
          y={Math.max(target.p[1] - 12, 18)}
          fontSize="15"
          fontWeight="700"
          fill="#fff"
          className="us-map-tag"
          aria-hidden="true"
        >
          {target.n}
        </text>
      </svg>

      <figcaption className="mt-3 d-flex flex-wrap justify-content-center gap-3 small" style={{ color: "#5a6272" }}>
        <span>
          <span aria-hidden="true" style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#f5a002", marginRight: 6 }} />
          A pin in every state — dispatching to all 50 states + DC
        </span>
        <span>
          <span aria-hidden="true" style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", border: "3px solid #f5a002", background: "#fff", marginRight: 6 }} />
          Dispatch station: {hq.n}
        </span>
        <span>Hover a state — click to open its charter bus locations</span>
      </figcaption>
    </figure>
  );
}
