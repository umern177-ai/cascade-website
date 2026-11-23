// Admin API: save the sitewide SEO config (custom JSON-LD + head code + IDs).
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/admin/auth";
import { getSiteConfig, saveSiteConfig, logHistory, SiteConfig } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, config: await getSiteConfig() });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as Partial<SiteConfig> | null;
  if (body?.customSchema && body.customSchema.trim()) {
    try { JSON.parse(body.customSchema); } catch {
      return NextResponse.json({ ok: false, error: "Schema is not valid JSON-LD — fix the JSON before saving." }, { status: 400 });
    }
  }
  await saveSiteConfig({
    customSchema: body?.customSchema?.trim() || undefined,
    headHtml: body?.headHtml?.trim() || undefined,
    gaMeasurementId: body?.gaMeasurementId?.trim() || undefined,
    clarityId: body?.clarityId?.trim() || undefined,
  });
  revalidatePath("/", "layout");
  await logHistory(
    "config",
    "/admin/schema",
    ["customSchema", "headHtml", "gaMeasurementId", "clarityId"].filter((k) => body && (body as Record<string, unknown>)[k] !== undefined).join(", ") || "empty save",
  );
  return NextResponse.json({ ok: true });
}
