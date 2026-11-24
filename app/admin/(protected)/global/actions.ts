"use server";

// Global facts save (Admin Panel Upgrade Phase 3, 3.7): writes the override,
// logs it and revalidates the layout so header/footer update instantly.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { saveSiteConfig, logHistory, GlobalFacts } from "@/lib/admin/store";

const FIELD_KEYS = [
  "phoneDisplay", "phoneTel", "phoneNote", "email", "quoteLabel", "street", "city",
  "state", "zip", "years", "coverage", "facebook", "instagram", "linkedin", "tiktok",
] as const;

export default async function saveGlobalFactsAction(form: FormData): Promise<void> {
  const g: GlobalFacts = {};
  for (const key of FIELD_KEYS) {
    const v = String(form.get("g:" + key) || "").trim();
    if (v) g[key] = v;
  }
  await saveSiteConfig({ global: g } as never);
  await logHistory("global", "/admin/global", "Saved site facts " + (Object.keys(g).join(", ") || "(all empty)"));
  revalidatePath("/", "layout");
  redirect("/admin/global?saved=1");
}
