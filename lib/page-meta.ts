// One helper so EVERY page ships the full metadata set: title, description,
// self-canonical, robots directives, Open Graph and Twitter tags
// (consultant checklist #2 and #7).
import type { Metadata } from "next";
import { SITE } from "@/lib/site-data";

const OG_IMAGE = `${SITE.url}/hero-bus.jpg`;

export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;      // absolute or root-relative
  index?: boolean;     // default true; false → noindex, follow
}): Metadata {
  const { title, description, path, image, index = true } = opts;
  const url = `${SITE.url}${path}`;
  const img = image && image.startsWith("http") ? image : `${SITE.url}${image ?? "/hero-bus.jpg"}`;
  const brand = " | Cascade Charter Bus";
  return {
    // absolute when the page title already carries the brand (never doubled)
    title: title.endsWith(brand) ? { absolute: title } : title,
    description,
    robots: {
      index,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: "website",
      images: [{ url: img, width: 1600, height: 900, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [img],
    },
  };
}
