import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cascade Charter Bus",
    short_name: "Cascade",
    description: "Nationwide charter bus rental with professional drivers and 24/7 dispatch.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0F1115",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
