// Admin API: the page catalog for the internal-link picker in the blog editor
// (consultant checklist #6: link services, locations, blog posts easily).
import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";
import { pageCatalog, CatalogType } from "@/lib/admin/page-catalog";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  }
  const type = req.nextUrl.searchParams.get("type") as CatalogType | null;
  const catalog = await pageCatalog();
  const list = (type ? catalog.filter((c) => c.type === type) : catalog).map((c) => ({ path: c.path, title: c.title, type: c.type }));
  return NextResponse.json({ ok: true, catalog: list });
}
