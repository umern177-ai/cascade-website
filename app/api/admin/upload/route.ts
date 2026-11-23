// Admin API: upload an image (multipart) into public/uploads/YYYY-MM/. Used by
// the blog editor for the featured image and for images inside the content.
import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { isAuthed } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "Image is over 8 MB" }, { status: 400 });
  if (!/\.(jpe?g|png|webp|avif|gif)$/i.test(file.name)) {
    return NextResponse.json({ error: "JPG, PNG, WebP, AVIF or GIF only" }, { status: 400 });
  }
  const now = new Date();
  const folder = path.join("public", "uploads", `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
  await fs.mkdir(folder, { recursive: true });
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "image";
  await fs.writeFile(path.join(process.cwd(), folder, safeName), Buffer.from(await file.arrayBuffer()));
  const rel = "/" + folder.replace(/[\\/]+/g, "/").replace(/^public\/?/, "") + "/" + safeName;
  return NextResponse.json({ src: rel });
}
