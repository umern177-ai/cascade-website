// Global site facts — Admin Panel Upgrade Phase 3 (section 3.7).
// data/admin/global.json holds ADMIN-editable overrides of the core facts
// (header, footer, contact, schema copy). The defaults come from the code
// SITE object so the site is never broken by an empty store; a publish
// revalidates the layout so header/footer update instantly.
import "server-only";
import { SITE } from "@/lib/site-data";
import { getSiteConfig, saveSiteConfig, logHistory, GlobalFacts } from "@/lib/admin/store";
import { revalidatePath } from "next/cache";


// Merged view: admin overrides first, code defaults behind.
export async function getSiteData(): Promise<typeof SITE> {
  const cfg = await getSiteConfig();
  const g = cfg.global ?? {};
  return {
    ...SITE,
    ...g,
    address: {
      street: g.street || SITE.address.street,
      city: g.city || SITE.address.city,
      state: g.state || SITE.address.state,
      zip: g.zip || SITE.address.zip,
    },
    social: {
      facebook: (g.facebook as unknown as string) || SITE.social.facebook,
      instagram: (g.instagram as unknown as string) || SITE.social.instagram,
      linkedin: (g.linkedin as unknown as string) || SITE.social.linkedin,
      tiktok: (g.tiktok as unknown as string) || SITE.social.tiktok,
    },
    quoteLabel: (g.quoteLabel as unknown as string) || "Get a Free Quote",
  } as unknown as typeof SITE;
}

// The form fields the Global Content page shows.
export const GLOBAL_FIELDS: { key: keyof GlobalFacts; label: string; hint?: string }[] = [
  { key: "phoneDisplay", label: "Phone (display)" },
  { key: "phoneTel", label: "Phone (tel link)", hint: "Numbers only, starts with +1" },
  { key: "phoneNote", label: "Phone note" },
  { key: "email", label: "Email" },
  { key: "quoteLabel", label: "Get-a-Quote button text" },
  { key: "street", label: "Address street" },
  { key: "city", label: "Address city" },
  { key: "state", label: "Address state" },
  { key: "zip", label: "Address ZIP" },
  { key: "years", label: "Years in business line", hint: "e.g. 5+ years of service" },
  { key: "coverage", label: "Coverage line" },
  { key: "facebook", label: "Facebook URL" },
  { key: "instagram", label: "Instagram URL" },
  { key: "linkedin", label: "LinkedIn URL" },
  { key: "tiktok", label: "TikTok URL" },
];
