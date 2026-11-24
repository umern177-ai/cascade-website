// Admin API: import meta tags from CSV (path,title,description). Applies with
// overwrites; returns counts. Revalidates every touched path.
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/admin/auth";
import { getMetaFile, setMetaEntry, logHistory, AdminMeta } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  const text = await req.text();
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  let applied = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i === 0 && /"?path"?/i.test(line)) continue; // header
    const cols = line.match(/("([^"]*)"|[^,]+)(,)?/g) ?? [];
    const clean = (x: string | undefined) => (x ? x.replace(/"/g, "").trim() : "");
    const path = clean(cols[0]);
    const title = clean(cols[1]);
    const description = clean(cols[2]);
    if (!path.startsWith("/")) continue;
    const metaFile = await getMetaFile();
    const entry: AdminMeta = {
      ...(metaFile[path] ?? {}),
      title: title || undefined,
      description: description || undefined,
    };
    await setMetaEntry(path, entry);
    revalidatePath(path);
    applied++;
  }
  await logHistory("meta-import", "/admin/meta", `CSV import: ${applied} page(s) updated`);
  return NextResponse.json({ ok: true, applied });
}
