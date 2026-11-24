// Sitemap & Robots admin page — server actions inline (Phase 5, 7.3).
"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSiteConfig, saveSiteConfig, logHistory } from "@/lib/admin/store";

export async function saveRobotsAction(form: FormData): Promise<void> {
  await getSiteConfig();
  await saveSiteConfig({ robotsOverride: String(form.get("robots") || "") } as never);
  await logHistory("sitemap-robots", "/admin/sitemap", "robots.txt updated");
  revalidatePath("/robots.txt");
  redirect("/admin/sitemap?saved=1");
}

export async function saveLlmsAction(form: FormData): Promise<void> {
  await saveSiteConfig({ llmsOverride: String(form.get("llms") || "") } as never);
  await logHistory("sitemap-robots", "/admin/sitemap", "llms.txt updated");
  revalidatePath("/llms.txt");
  redirect("/admin/sitemap?saved=1");
}
