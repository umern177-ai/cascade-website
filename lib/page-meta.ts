// One helper so EVERY page ships the full metadata set: title, description,
// self-referencing canonical, robots directives, Open Graph and Twitter tags
// (consultant checklist #2 and #7). Admin overrides (canonical / robots /
// OG fields) arrive through withOverrides and win over these defaults.
import type { Metadata } from "next";
import { SITE } from "@/lib/site-data";

const OG_IMAGE = `${SITE.url}/hero-bus.jpg`;

export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;       // absolute or root-relative
  index?: boolean;      // default true; false → noindex, follow
  canonical?: string;   // admin override (absolute URL or /path/)
  robots?: string;      // admin override (MetaRobots key)
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}): Metadata {
  const { title, description, path, image, index = true, canonical, robots, ogTitle, ogDescription, ogImage } = opts;
  const selfUrl = `${SITE.url}${path}`;
  const url = canonical ? (canonical.startsWith("http") ? canonical : `${SITE.url}${canonical}`) : selfUrl;
  const img = (ogImage ?? image)
    ? (ogImage ?? image)!.startsWith("http")
      ? (ogImage ?? image)!
      : `${SITE.url}${(ogImage ?? image)!}`
    : OG_IMAGE;
  const ogT = ogTitle?.trim() || title;
  const ogD = ogDescription?.trim() || description;
  const robotKey = robots ?? (index ? "index-follow" : "noindex-follow");
  return {
    title: title.includes("Cascade Charter Bus") ? { absolute: title } : title,
    description,
    robots: {
      index: robotKey.startsWith("index"),
      follow: robotKey.endsWith("follow"),
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
    alternates: { canonical: url },
    openGraph: {
      title: ogT,
      description: ogD,
      url: selfUrl,
      siteName: SITE.name,
      type: "website",
      images: [{ url: img, width: 1600, height: 900, alt: ogT }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogT,
      description: ogD,
      images: [img],
    },
  } as Metadata;
}
