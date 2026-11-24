// Server action: apply launch-map rules chosen by the SEO person (Phase 4).
"use server";
import { redirect } from "next/navigation";
import { requireAuth } from "../../../get-auth";
import { getRedirects, saveRedirects, logHistory, type AdminRedirect } from "@/lib/admin/store";
import { normalizeFrom } from "@/lib/admin/redirect-engine";

export default async function applyMapAction(form: FormData): Promise<void> {
  await requireAuth();
  const payload = String(form.get("payload") || "");
  if (!payload) redirect("/admin/redirects/map");
  try {
    const chosen = JSON.parse(payload) as Array<{ from: string; to?: string; type?: number }>;
    const list = await getRedirects();
    let added = 0;
    for (const c of chosen) {
      const from = normalizeFrom(c.from);
      if (!from || list.some((r) => r.from.toLowerCase() === from.toLowerCase())) continue;
      list.push({
        id: "rm" + Date.now() + "_" + added,
        from,
        to: c.to ?? "",
        type: (c.type ?? 301) as AdminRedirect["type"],
        status: "active",
        note: "Launch redirect map",
      });
      added++;
    }
    await saveRedirects(list);
    await logHistory("redirect-import", "/admin/redirects/map", `Launch map: ${added} rule(s) applied`);
  } catch {
    redirect("/admin/redirects/map?e=parse");
  }
  redirect("/admin/redirects/map?saved=1");
}
