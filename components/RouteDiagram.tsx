// RouteDiagram — the "City -> Destination" routing card from the Shelton
// premium page, generalized. Parametric SVG: dark panel, two endpoints, the
// driving route, an approximate distance/time chip, optional via-roads and an
// optional red banned-route line (e.g. the Merritt Parkway).
// Layout fixes (owner review Nov 17):
// - "via ..." sits on its own line under the distance chip (no collision).
// - Long endpoint names WRAP to two lines instead of shrinking to unreadable
//   text or overflowing the panel edges.
// - Destination label now sits above its circle, clear of chip and route line.
// - Airport-style rows: an optional miles/time chip, optional via line.
import type { CityRoute } from "@/lib/city-page-data";

function etaText(miles: number): string {
  if (miles <= 30) return "~40 min";
  if (miles <= 60) return "~1 hr";
  if (miles <= 90) return "~1.5 hrs";
  if (miles <= 150) return "~2 hrs";
  if (miles <= 220) return "~2.5 hrs";
  return "~3+ hrs";
}

// Wrap long names into up to two balanced lines (keeps words intact).
function wrapLabel(str: string, maxChars = 16): string[] {
  if (str.length <= maxChars) return [str];
  const words = str.split(" ");
  if (words.length < 2) return [str.slice(0, 15), str.slice(15)];
  let best = words.slice(0, 1).concat([words.slice(1).join(" ")]);
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const l1 = words.slice(0, i).join(" ");
    const l2 = words.slice(i).join(" ");
    const diff = Math.abs(l1.length - l2.length);
    if (diff < bestDiff) { bestDiff = diff; best = [l1, l2]; }
  }
  return best;
}

function LabelPair({ lines, x, y, anchor = "start", fontSize = 16, dy = 20 }: { lines: string[]; x: number; y: number; anchor?: "start" | "end"; fontSize?: number; dy?: number }) {
  return (
    <>
      {lines.map((line, i) => (
        <text key={i} x={x} y={y + i * dy} fill={i === 0 ? "#fff" : "#A9B0C2"} fontSize={fontSize} fontWeight="800" textAnchor={anchor}>
          {line}
        </text>
      ))}
    </>
  );
}

export default function RouteDiagram({ from, route }: { from: string; route: CityRoute }) {
  const miles = route.miles ?? "";
  const time = route.time ?? "";
  const fromX = 424, fromY = 92, toX = 104, toY = 250;
  const chipText = [miles, time].filter(Boolean).join(" · ");
  const fromLines = wrapLabel(from, 14); // e.g. "White Sulphur Springs" -> 2 lines
  const toLines = wrapLabel(route.to, 15); // e.g. "Essex Steam Train & Riverboat" -> 2 lines
  return (
    <figure className="pp-route-card">
      <figcaption>{`${from} → ${route.to}`}<span>Bus routing</span></figcaption>
      <svg viewBox="0 0 560 380" role="img" aria-label={`Bus routing map from ${from} to ${route.to}`}>
        <title>{`Bus route from ${from} to ${route.to}`}</title>
        <desc>{`Diagram showing the driving route from ${from} to ${route.to}${chipText ? `, ${chipText}` : ""} by bus.`}</desc>
        <rect width="560" height="380" fill="#121A2E" />
        {/* route */}
        <path d={`M ${fromX} ${fromY} C ${fromX + 8} ${fromY + 70} ${fromX - 90} ${toY - 40} ${toX} ${toY}`} fill="none" stroke="#F5A002" strokeWidth="6" strokeLinecap="round" />
        {/* optional banned route (dashed red) */}
        {route.banned && (
          <>
            <path d={`M ${fromX} ${fromY - 6} C ${fromX - 90} ${fromY - 50} ${fromX - 190} ${toY - 90} ${toX + 16} ${toY - 14}`} fill="none" stroke="#D64545" strokeWidth="4" strokeDasharray="9 8" opacity="0.9" />
            <g transform="translate(258 118)">
              <circle r="16" fill="#D64545" />
              <path d="M-6 -6 6 6M6 -6 -6 6" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            </g>
            <text x="196" y="172" fill="#F08A8A" fontSize="12.5" fontWeight="700">{route.banned.label}</text>
          </>
        )}
        {/* from endpoint — name anchored right of the circle, extending right */}
        <g>
          <circle cx={fromX} cy={fromY} r="13" fill="#F5A002" />
          <circle cx={fromX} cy={fromY} r="5" fill="#0F1115" />
          <LabelPair lines={fromLines} x={fromX + 22} y={fromY - 2} anchor="start" fontSize={16} dy={20} />
          <text x={fromX + 22} y={fromY + 16 + (fromLines.length > 1 ? 20 : 0)} fill="#A9B0C2" fontSize="11.5" fontWeight="600" textAnchor="start">Pickup</text>
        </g>
        {/* to endpoint — wrapped name in the clear upper-left zone, left-aligned */}
        <g>
          <circle cx={toX} cy={toY} r="13" fill="#fff" />
          <circle cx={toX} cy={toY} r="5" fill="#0F1115" />
          <LabelPair
            lines={toLines}
            x={16}
            y={toY - toLines.length * 20 - (toLines.length > 1 ? 28 : 6)}
            anchor="start"
            fontSize={16}
            dy={20}
          />
          {route.toNote && toLines.length === 1 && (
            <text x={16} y={toY - 18} fill="#A9B0C2" fontSize="11.5" fontWeight="600" textAnchor="start">{route.toNote}</text>
          )}
        </g>
        {/* distance chip */}
        {(miles || time) && (
          <rect x="180" y="292" width="200" height="42" rx="21" fill="#1E2A47" stroke="rgba(255,255,255,0.18)" />
        )}
        {(miles || time) && (
          <text x="280" y="318" fill="#fff" fontSize="14" fontWeight="800" textAnchor="middle">{chipText}</text>
        )}
        {/* via line: its own row under the chip, clear of destination labels */}
        {route.via && (
          <text x="280" y="356" fill="#A9B0C2" fontSize="12" fontWeight="600" textAnchor="middle">{`via ${route.via}`}</text>
        )}
      </svg>
      <div className="pp-legend">
        <span><i style={{ background: "#F5A002" }} />Driving route</span>
        {route.banned && <span><i style={{ background: "repeating-linear-gradient(90deg,#D64545 0 6px,transparent 6px 10px)" }} />{route.banned.road} — buses not permitted</span>}
      </div>
    </figure>
  );
}

export { etaText };
