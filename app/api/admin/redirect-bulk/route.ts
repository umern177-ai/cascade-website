// Admin API: bulk activate/deactivate/delete selected rules.
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/admin/auth";
import { getRedirects, saveRedirects, logHistory } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  const j = (await req.json().catch(() => null)) as { ids?: string[]; action?: string } | null;
  const ids = new Set(j?.ids ?? []);
  const action = j?.action;
  if (!ids.size || !["activate", "deactivate", "delete"].includes(action ?? "")) {
    return NextResponse.json({ ok: false, error: "bad-input" }, { status: 400 });
  }
  const list = await getRedirects();
  const next: typeof list = [];
  let changed = 0;
  for (const r of list) {
    if (!ids.has(r.id)) {
      next.push(r);
      continue;
    }
    changed++;
    if (action === "delete") continue; // dropped
    next.push(r);
    r.status = action === "activate" ? "active" : "inactive";
    r.updated_at = new Date().toISOString();
  }
  await saveRedirects(next);
  await logHistory("redirect-bulk", "/admin/redirect-management", `${action} — ${changed} rule(s)`);
  revalidatePath("/admin/redirect-management");
  return NextResponse.json({ ok: true, changed });
}
