// Server action: apply Find & Replace (Admin Panel Upgrade 3.8).
// Case-insensitive replace across the stores the finder reads. The count +
// every touched store land in the History log; touched pages are revalidated.
"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "../../get-auth";
import { getPageBodyFile, getSiteConfig, saveSiteConfig, logHistory, GlobalFacts } from "@/lib/admin/store";

export default async function applyReplaceAction(form: FormData): Promise<void> {
  await requireAuth();
  const q = String(form.get("q") || "").trim();
  const withText = String(form.get("with") || "");
  if (!q) redirect("/admin/find-replace");
  const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  let changed = 0;
  const touchedPages: string[] = [];

  // 1) page content + FAQs
  const bodies = await getPageBodyFile();
  for (const [p, body] of Object.entries(bodies)) {
    let touched = false;
    for (const [k, v] of Object.entries(body.fields ?? {})) {
      if (v.toLowerCase().includes(q.toLowerCase())) {
        const patchParams = new URLSearchParams();
        void patchParams;
        const mergedFields = { ...(body.fields ?? {}), [k]: v.replace(rx, withText) };
        await (await import("@/lib/admin/store")).setPageBodyEntry(p, { fields: mergedFields, faqs: body.faqs, sitemapExclude: false });
        touched = true;
        changed++;
      }
    }
    if (touched) { touchedPages.push(p); revalidatePath(p); }
  }

  // 2) global facts
  const cfg = await getSiteConfig();
  if (cfg.global) {
    const nextG: GlobalFacts = { ...cfg.global } as GlobalFacts;
    let gTouched = false;
    for (const [k, v] of Object.entries(nextG)) {
      if (typeof v === "string" && v.toLowerCase().includes(q.toLowerCase())) {
        (nextG as unknown as Record<string, string>)[k] = v.replace(rx, withText);
        gTouched = true;
        changed++;
      }
    }
    if (gTouched) {
      await saveSiteConfig({ global: nextG });
      revalidatePath("/", "layout");
    }
  }

  await logHistory("find-replace", "/admin/find-replace", `Find "${q}" → "${withText}": ${changed} replacement(s) in ${touchedPages.length} page(s)`);
  redirect(`/admin/find-replace?q=${encodeURIComponent(q)}&done=1&replaced=${changed}`);
}
