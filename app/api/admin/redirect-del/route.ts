// Admin API: delete one rule by id (client popup delete button).
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/admin/auth";
import { getRedirects, saveRedirects, logHistory } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  const j = (await req.json().catch(() => null)) as { id?: string } | null;
  if (!j?.id) return NextResponse.json({ ok: false, error: "no-id" }, { status: 400 });
  const list = await getRedirects();
  const removed = list.find((r) => r.id === j.id);
  await saveRedirects(list.filter((r) => r.id !== j.id));
  if (removed) await logHistory("redirect-delete", removed.from, "Deleted rule");
  revalidatePath("/admin/redirect-management");
  return NextResponse.json({ ok: true });
}
