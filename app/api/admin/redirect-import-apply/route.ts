// Admin API: CSV import APPLY (batched — the client sends chunks of 500 rows).
import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";
import { importChunkAction } from "@/app/admin/(protected)/redirects/redirect-actions";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  const j = (await req.json().catch(() => null)) as
    | { rows?: Array<{ row: number; source_url: string; target_url?: string; redirect_type?: string; status?: string; note?: string }>; existingMode?: "skip" | "overwrite" }
    | null;
  const rows = (j?.rows ?? []).map((r) => ({ ...r, note: r.note ?? "" }));
  const result = await importChunkAction(rows as never, j?.existingMode ?? "skip");
  return NextResponse.json(result);
}
