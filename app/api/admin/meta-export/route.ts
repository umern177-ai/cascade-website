// Admin API: meta CSV export (path,title,description).
import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";
import { getMetaFile } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthed())) return new Response("Unauthorized", { status: 401 });
  const meta = await getMetaFile();
  const NL = String.fromCharCode(10);
  const csv =
    "path,title,description" +
    NL +
    Object.entries(meta)
      .map(([p, m]) => ["\"" + p + "\"", "\"" + (m.title ?? "").replace(/"/g, '""') + "\"", "\"" + (m.description ?? "").replace(/"/g, '""') + "\""].join(","))
      .join(NL);
  return new Response(csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=\"meta-tags.csv\"" },
  });
}
