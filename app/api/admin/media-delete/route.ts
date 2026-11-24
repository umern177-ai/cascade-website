// Admin API: delete an unused upload (Phase 5 media library).
import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { isAuthed } from "@/lib/admin/auth";
import { deleteUpload } from "@/lib/admin/media-lib";
import { logHistory } from "@/lib/admin/store";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAuthed())) return new Response("Unauthorized", { status: 401 });
  const src = req.nextUrl.searchParams.get("src") ?? "";
  const usage = await usedSomewhere(src);
  if (usage) {
    redirect("/admin/media");
  }
  const ok = await deleteUpload(src);
  if (ok) await logHistory("media-delete", "/admin/media", "Deleted unused image " + src);
  redirect("/admin/media" + (ok ? "?deleted=1" : ""));
}

async function usedSomewhere(src: string): Promise<boolean> {
  try {
    const blog = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/admin/blog.json"), "utf8")) as { posts?: Array<{ image?: string; contentHtml?: string }> };
    for (const p of blog.posts ?? []) {
      if (p.image === src) return true;
      if ((p.contentHtml ?? "").includes(src)) return true;
    }
  } catch { /* no blog */ }
  return false;
}
