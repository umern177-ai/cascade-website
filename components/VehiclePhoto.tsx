"use client";

// Auto-rotating fleet photo: cycles through all photos of a vehicle
// (data/fleet-photos.json → lib/fleet-photos.fleetGallery) every ~3 seconds
// with a soft crossfade. Used in every card-sized fleet showcase (home, fleet
// hub, city pages, service pages) — the box size never changes, only the shot.
// One photo (or reduced-motion) → renders as a static image, no timer.
import { useEffect, useState } from "react";
import Image from "next/image";

export default function VehiclePhoto({
  photos,
  alt,
  sizes,
  intrinsic,
  fill = false,
  style,
  priority = false,
}: {
  photos: string[];         // ordered; photos[0] is the cover
  alt: string;              // alt for the currently visible shot
  sizes?: string;           // next/image sizes for responsive selection
  intrinsic?: { width: number; height: number };
  fill?: boolean;           // when the parent supplies the box (city/fleet cards)
  style?: React.CSSProperties;
  priority?: boolean;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (photos.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % photos.length), 3000);
    return () => clearInterval(t);
  }, [photos.length]);

  if (photos.length === 0) return null;
  if (!fill && !intrinsic) return null;

  const dims = {
    width: fill ? undefined : intrinsic!.width,
    height: fill ? undefined : intrinsic!.height,
  };

  return (
    <span
      className="pp-autoshot"
      style={
        fill
          ? { position: "absolute", inset: 0, display: "block" }
          : { ...style, position: "relative", display: "block", overflow: "hidden" }
      }
    >
      {photos.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === idx ? alt : ""}
          {...(fill ? { fill: true } : dims)}
          sizes={sizes}
          style={
            fill
              ? {
                  ...style,
                  zIndex: i === idx ? 1 : 0,
                  opacity: i === idx ? 1 : 0,
                  transition: "opacity 0.6s ease",
                }
              : {
                  // non-fill: the CALLER's style sizes the wrapper (one tile);
                  // every photo in the cycle is pinned inside it as an overlay,
                  // so the box never grows to N stacked images.
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: i === idx ? 1 : 0,
                  opacity: i === idx ? 1 : 0,
                  transition: "opacity 0.6s ease",
                }
          }
          priority={priority && i === 0}
          aria-hidden={i !== idx}
        />
      ))}
    </span>
  );
}
