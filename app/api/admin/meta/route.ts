// Admin API for the meta BULK view: PATCH a single field per page.
// { path, field: title|description, value } — empty clears the override.
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/admin/auth";
import { getMetaFile, setMetaEntry, logHistory, AdminMeta } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  const j = (await req.json().catch(() => null)) as { path?: string; field?: string; value?: string } | null;
  if (!j?.path?.startsWith("/") || (j.field !== "title" && j.field !== "description")) {
    return NextResponse.json({ ok: false, error: "bad-input" }, { status: 400 });
  }
  const metaFile = await getMetaFile();
  const exists = !!metaFile[j.path];
  const entry: AdminMeta = {
    ...(exists ? metaFile[j.path] : {}),
    title: j.field === "title" ? j.value?.trim() || undefined : (metaFile[j.path]?.title ?? undefined),
    description: j.field === "description" ? j.value?.trim() || undefined : (metaFile[j.path]?.description ?? undefined),
  };
  await setMetaEntry(j.path, entry as AdminMeta);
  await logHistory("meta", j.path, `Bulk edit: ${j.field} = ${(j.value ?? "").trim().slice(0, 90)}`);
  revalidatePath(j.path);
  return NextResponse.json({ ok: true });
}
