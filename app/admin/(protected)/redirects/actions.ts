"use server";

// Redirect manager server actions (Admin Panel Upgrade Phase 4): save with
// type + active flag, toggle active/inactive, delete. Rules apply LIVE via
// proxy.ts (node runtime) — no build/deploy needed.
import { redirect } from "next/navigation";
import { requireAuth } from "../../get-auth";
import { getRedirects, saveRedirects, logHistory, AdminRedirect } from "@/lib/admin/store";
import { checkRule, deleteRule, normalizeFrom, saveRule, toggleRule } from "@/lib/admin/redirect-engine";

export async function saveRuleAction(form: FormData): Promise<void> {
  await requireAuth();
  const from = String(form.get("from") || "").trim();
  const to = String(form.get("to") || "").trim();
  const type = (Number(form.get("type") || 301) || 301) as 301 | 302 | 307 | 410;
  if (!from.startsWith("/") || (!to.startsWith("/") && !to.startsWith("http") && type !== 410)) redirect("/admin/redirects?e=badsave");
  const { blocked } = await checkRule(from, to, type);
  if (blocked.length) redirect("/admin/redirects?e=" + encodeURIComponent(blocked.join(" ")));
  await saveRule({ id: "r" + Date.now(), from, to, type, status: "active", note: String(form.get("note") || "").trim() || undefined });
  await logHistory("redirect-add", from, `${type} → ${to}`);
  redirect("/admin/redirects?saved=1");
}

export async function toggleRuleAction(form: FormData): Promise<void> {
  await requireAuth();
  const from = String(form.get("from") || "");
  if (from) await toggleRule(from);
  await logHistory("redirect-toggle", from, "Status toggled");
  redirect("/admin/redirects?saved=toggle");
}

export async function deleteRuleAction(form: FormData): Promise<void> {
  await requireAuth();
  const from = String(form.get("from") || "");
  if (from) await deleteRule(from);
  await logHistory("redirect-delete", from, "Deleted rule");
  redirect("/admin/redirects?deleted=1");
}

// Keep the legacy addRedirect name alive for compatibility (not used).
export async function addRedirectActionLegacy(): Promise<void> {
  redirect("/admin/redirects");
}
