// Admin API: redirect CSV export/import (consultant checklist #4).
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/admin/auth";
import { getRedirects, saveRedirects, logHistory, AdminRedirect } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  }
  const rules = await getRedirects();
  const NL = String.fromCharCode(10);
  const csv = "from,to,status,note" + NL + rules.map((r) => ['"' + r.from + '"', '"' + r.to + '"', String(r.status), '"' + (r.note ?? "") + '"'].join(",")).join(NL);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"redirects.csv\"",
    },
  });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  }
  const text = await req.text();
  const NL2 = String.fromCharCode(13, 10);
  const lines = text.split(new RegExp(NL2)).filter((l) => l.trim());
  const rules = await getRedirects();
  let added = 0;
  for (const line of lines) {
    if (/^"?from"?/i.test(line)) continue; // header
    const cols = line.match(/("([^"]*)"|[^,s]+)(,)?/g) ?? [];
    const clean = (x: string | undefined) => (x ? x.replace(/"/g, "").trim() : "");
    const from = clean(cols[0]); const to = clean(cols[1]);
    const type = (clean(cols[2]) === "302" ? 302 : clean(cols[2]) === "410" ? 410 : 301) as 301 | 302 | 410;
    const note = clean(cols[3]);
    if (!from.startsWith("/") || (!to.startsWith("/") && type !== 410) || rules.some((r) => r.from === from)) continue;
    rules.push({ id: "r" + Date.now() + "_" + added, from, to, type, status: "active", note: note || undefined } as AdminRedirect);
    added++;
  }
  await saveRedirects(rules);
  if (added) await logHistory("redirect-import", "/admin/redirects", `${added} rule${added === 1 ? "" : "s"} imported from CSV`);
  revalidatePath("/admin/redirects");
  return NextResponse.json({ ok: true, added });
}
