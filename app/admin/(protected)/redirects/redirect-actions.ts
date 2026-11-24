"use server";

// Redirect import engine (preview + batched apply) — used by the
// redirect-import-preview / redirect-import-apply admin APIs and by the
// launch-map tool. Loops/chains are caught here; rules apply live via proxy.
import { revalidatePath } from "next/cache";
import { requireAuth } from "../../get-auth";
import { AdminRedirect, getRedirects, saveRedirects, logHistory } from "@/lib/admin/store";
import { checkRule, normalizeFrom, saveRule } from "@/lib/admin/redirect-engine";

export type ImportItem = {
  source_url: string;
  target_url?: string;
  redirect_type?: number | string;
  status?: string;
  note?: string;
  created_at?: string;
  row: number; // 1-based file row for error reporting
};

// Preview pass (section 8): classifies rows without saving.
export async function previewImportAction(rows: ImportItem[], existingMode: "skip" | "overwrite"): Promise<{ newCount: number; updateCount: number; skipCount: number; errors: Array<{ row: number; reason: string }> }> {
  await requireAuth();
  const list = await getRedirects();
  const bySource = new Set(list.map((r) => r.from.replace(/\/+$/, "").toLowerCase()));
  let newCount = 0;
  let updateCount = 0;
  let skipCount = 0;
  const errors: Array<{ row: number; reason: string }> = [];
  for (const r of rows) {
    const from = normalizeFrom(r.source_url);
    if (!from) {
      errors.push({ row: r.row, reason: "Source does not start with /" });
      continue;
    }
    const type = (Number(r.redirect_type) || 301) as number;
    if (bySource.has(from.replace(/\/+$/, "").toLowerCase())) {
      if (existingMode === "skip") {
        skipCount++;
      } else {
        updateCount++;
      }
    } else {
      newCount++;
    }
    if (type !== 410) {
      const to = (r.target_url ?? "").trim();
      if (!to.startsWith("/") && !to.startsWith("http")) {
        errors.push({ row: r.row, reason: `Empty or invalid target for ${type}` });
      }
    }
  }
  return { newCount, updateCount, skipCount, errors: errors.slice(0, 200) };
}

// Apply pass — rows arrive in batches (client sends 500 at a time). Safety
// checks run on every row; loop/chain rows are skipped with a clear reason.
export async function importChunkAction(
  rows: ImportItem[],
  existingMode: "skip" | "overwrite",
): Promise<{ imported: number; updated: number; skipped: number; errors: Array<{ row: number; reason: string }> }> {
  await requireAuth();
  const list = await getRedirects();
  let imported = 0;
  let updated = 0;
  let skipped = 0;
  const errors: Array<{ row: number; reason: string }> = [];

  for (const r of rows) {
    const from = normalizeFrom(r.source_url);
    if (!from) {
      errors.push({ row: r.row, reason: "Source does not start with /" });
      continue;
    }
    const type = (Number(r.redirect_type) || 301) as AdminRedirect["type"];
    const to = (r.target_url ?? "").trim();
    const idx = list.findIndex((x) => x.from.replace(/\/+$/, "").toLowerCase() === from.replace(/\/+$/, "").toLowerCase());

    if (idx >= 0 && existingMode === "skip") {
      skipped++;
      continue;
    }

    const { blocked, warnings } = await checkRule(from, type === 410 ? "" : to, type);
    if (blocked.length) {
      errors.push({ row: r.row, reason: blocked.join(" ") });
      continue;
    }
    if (warnings.length) {
      errors.push({ row: r.row, reason: warnings.join(" ") + " — skipped (edit the rule manually to override)" });
      continue;
    }

    const existing = idx >= 0 ? list[idx] : undefined;
    const entry: AdminRedirect = {
      id: existing?.id ?? "ri" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      from,
      to: type === 410 ? "" : to,
      type,
      status: (r.status ?? "active").trim().toLowerCase() === "inactive" ? "inactive" : "active",
      note: r.note?.trim() || (existing?.note ?? "CSV import"),
      hits: existing?.hits ?? 0,
      last_hit: existing?.last_hit,
      created_at: existing?.created_at ?? r.created_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
      match: existing?.match ?? "exact",
    };
    if (existing) {
      list[idx] = entry;
      updated++;
    } else {
      list.push(entry);
      imported++;
    }
  }

  await saveRedirects(list);
  await logHistory("redirect-import", "/admin/redirect-management", `CSV import: ${imported} new, ${updated} updated, ${skipped} skipped`);
  revalidatePath("/admin/redirect-management");
  return { imported, updated, skipped, errors: errors.slice(-100) };
}
