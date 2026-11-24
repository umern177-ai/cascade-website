// Admin API for page DRAFTS (section 3.4): POST stores a private draft copy
// that does not touch the live page; DELETE clears it (publish does this too).
// GET returns a draft for the editor "draft saved" badge.
import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";
import { getPageDrafts, savePageDraft, deletePageDraft } from "@/lib/admin/store";
import { logHistory } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  const j = (await req.json().catch(() => null)) as { path?: string; fields?: Record<string, string>; faqs?: { q: string; a: string }[] } | null;
  if (!j?.path?.startsWith("/")) return NextResponse.json({ ok: false, error: "bad-path" }, { status: 400 });
  await savePageDraft(j.path, { fields: j.fields ?? {}, faqs: j.faqs ?? [] });
  await logHistory("page-draft", j.path, "Draft saved (live page untouched)");
  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  const path = req.nextUrl.searchParams.get("path") || "";
  const drafts = await getPageDrafts();
  return NextResponse.json({ ok: true, draft: drafts[path] ?? null });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  const path = req.nextUrl.searchParams.get("path") || "";
  await deletePageDraft(path);
  return NextResponse.json({ ok: true });
}
