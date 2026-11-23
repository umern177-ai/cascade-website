import "server-only";
import { getContent } from "@/lib/admin/store";

// Merged home-page copy: admin override > built-in default.
export async function getSiteContent() {
  const c = await getContent();
  return {
    homeHeroLead: c.homeHero?.lead ?? "",
    homeHeroSub: c.homeHero?.sub ?? "",
  };
}

export async function getFaqs(): Promise<{ q: string; a: string }[]> {
  const c = await getContent();
  return c.homeFaqs ?? [];
}
