// Admin API: save the FULL field set of a page (WordPress-style editor).
// JSON { path, fields: {…}, faqs: [{q,a}] } — auth-checked, sanitized notes
// not needed (plain text fields) but lengths are trimmed; every empty field
// means "keep the built-in copy".
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/admin/auth";
import { setPageBodyEntry, logHistory } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

// PATCH merges ONE field into the page's saved copy (used by on-page editing):
// { path, key, value } — an empty value clears the override for that key.
export async function PATCH(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  }
  const j = (await req.json().catch(() => null)) as
    | { path?: string; key?: string; value?: string }
    | null;
  if (!j?.path?.startsWith("/") || !j.key) {
    return NextResponse.json({ ok: false, error: "bad-input" }, { status: 400 });
  }
  const { getPageBody, setPageBodyEntry } = await import("@/lib/admin/store");
  const existing = (await getPageBody(j.path)) ?? {};
  await setPageBodyEntry(j.path, {
    fields: { ...(existing.fields ?? {}), [j.key]: j.value ?? "" },
    faqs: existing.faqs ?? [],
  });
  revalidatePath(j.path);
  revalidatePath("/", "layout");
  await logHistory("page-field", j.path, `${j.key} = ${j.value?.trim() ? j.value.trim().slice(0, 120) : "(cleared)"}`);
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as {
    path?: string;
    fields?: Record<string, string>;
    faqs?: { q: string; a: string }[];
  } | null;
  if (!body?.path?.startsWith("/")) {
    return NextResponse.json({ ok: false, error: "bad-path" }, { status: 400 });
  }
  const faqs = (body.faqs ?? []).filter((f) => f.q?.trim() || f.a?.trim());
  await setPageBodyEntry(body.path, { fields: body.fields ?? {}, faqs });
  const edited = Object.values(body.fields ?? {}).filter((v) => v && v.trim()).length;
  await logHistory("page", body.path, `${edited} field${edited === 1 ? "" : "s"} + ${faqs.length} FAQ${faqs.length === 1 ? "" : "s"} saved`);
  revalidatePath(body.path);
  revalidatePath("/sitemap-pages.xml");
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
