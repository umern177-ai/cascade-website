// Admin API: POST a rule (used by the client popup + quick toggle in the
// redirect table). Body: { id?, from, to, type, status, note, force? }.
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/admin/auth";
import { saveRedirects, getRedirects, logHistory, AdminRedirect } from "@/lib/admin/store";
import { checkRule } from "@/lib/admin/redirect-engine";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  const j = (await req.json().catch(() => null)) as
    | { id?: string; from?: string; to?: string; type?: number; status?: string; note?: string; force?: boolean }
    | null;
  if (!j?.from?.startsWith("/")) return NextResponse.json({ ok: false, error: "Source must start with /" }, { status: 400 });
  const from = j.from.replace(/\/+$/, "").toLowerCase();
  const type = (Number(j.type) || 301) as AdminRedirect["type"];
  const list = await getRedirects();
  const existing = list.find((r) => r.id === j.id) ?? list.find((r) => r.from.replace(/\/+$/, "").toLowerCase() === from);

  if (existing) {
    existing.to = type === 410 ? "" : (j.to ?? existing.to);
    existing.type = type;
    if (j.status) existing.status = j.status === "inactive" ? "inactive" : "active";
    if (j.note !== undefined) existing.note = j.note?.trim() || undefined;
    existing.updated_at = new Date().toISOString();
    await saveRedirects(list);
    await logHistory("redirect-save", existing.from, `${existing.type} → ${existing.type === 410 ? "(gone)" : existing.to} [${existing.status}]`);
    revalidatePath("/admin/redirect-management");
    return NextResponse.json({ ok: true });
  }

  const { warnings, blocked } = await checkRule(from, type === 410 ? "" : (j.to ?? ""), type);
  if (blocked.length) return NextResponse.json({ ok: false, error: blocked.join(" ") }, { status: 400 });
  if (warnings.length && !j.force) return NextResponse.json({ ok: false, warnings });

  const entry: AdminRedirect = {
    id: "r" + Date.now(),
    from,
    to: type === 410 ? "" : (j.to ?? ""),
    type,
    status: j.status === "inactive" ? "inactive" : "active",
    note: j.note?.trim() || undefined,
    hits: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    match: "exact",
  };
  list.push(entry);
  await saveRedirects(list);
  await logHistory("redirect-save", from, `${type} → ${type === 410 ? "(gone)" : entry.to} [${entry.status}]`);
  revalidatePath("/admin/redirect-management");
  return NextResponse.json({ ok: true });
}
