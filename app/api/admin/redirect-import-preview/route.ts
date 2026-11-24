// Admin API: CSV import PREVIEW (section 8) — classifies rows without saving.
import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";
import { previewImportAction } from "@/app/admin/(protected)/redirects/redirect-actions";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  const j = (await req.json().catch(() => null)) as
    | { rows?: Array<{ row: number; source_url: string; target_url?: string; redirect_type?: string; status?: string; note?: string }>; existingMode?: "skip" | "overwrite" }
    | null;
  const rows = (j?.rows ?? []).map((r) => ({ ...r, note: r.note ?? "" }));
  const result = await previewImportAction(rows as never, j?.existingMode ?? "skip");
  return NextResponse.json(result);
}
