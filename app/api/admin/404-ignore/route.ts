// Admin API: POST to ignore one or more paths in the 404 monitor. Body: plain
// text lines (one pattern per line, saved verbatim for future matching).
import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { isAuthed } from "@/lib/admin/auth";
import { logHistory } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

const FILE = "data/admin/404-ignores.json";

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  const text = await req.text();
  const patterns = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")); // escape user input, literal match
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    const existing = JSON.parse(fs.readFileSync(FILE, "utf8")) as string[];
    await fs.promises.writeFile(FILE, JSON.stringify([...existing, ...patterns], null, 2) + "\n");
  } catch {
    await fs.promises.writeFile(FILE, JSON.stringify(patterns, null, 2) + "\n");
  }
  await logHistory("404-ignore", "/admin/404s", `Ignored: ${patterns.join(", ")}`);
  return NextResponse.json({ ok: true, count: patterns.length });
}
