import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsentBanner from "@/components/ConsentBanner";
import PickupPrefill from "@/components/PickupPrefill";
import { SITE } from "@/lib/site-data";
import { orgSchema } from "@/lib/schema";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Group Charter Bus Rental | Cascade Charter Bus",
    template: "%s | Cascade Charter Bus",
  },
  description:
    "Charter bus rental across the United States, coast to coast from New York to Los Angeles. Premium motorcoaches, shuttles, and executive group transportation with DOT-certified drivers.",
  robots: {
    index: true,
    follow: true,
    googleBot: { "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: "./" },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  verification:
    process.env.NEXT_PUBLIC_GSC_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
      : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F1115",
};

// Site-wide schema: the SEO consultant's Organization block (lib/schema.ts).
// Location pages add their LocalBusiness; service/fleet pages add Service —
// no schema type is ever emitted twice on a page.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Organization schema — sitewide, one block, in the head (consultant doc).
            Note: the home page preload-preloads its CSS-background hero through
            ReactDOM.preload in app/page.tsx (city pages use next/image priority). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
      </head>
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
        <ConsentBanner />
        <PickupPrefill />

        {/* Google Tag Manager — owner-supplied snippet, loaded non-blocking */}
        <Script id="gtm" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
(function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id=${SITE.gtmId}';document.head.appendChild(s);})();`}
        </Script>
        <noscript>
          <iframe src={`https://www.googletagmanager.com/ns.html?id=${SITE.gtmId}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
        </noscript>
      </body>
    </html>
  );
}
