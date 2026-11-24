// /llms.txt — served live (Admin Panel Upgrade Phase 5, 7.3): reads the admin
// override from the store and falls back to the seed shipped in the repo.
// The middleware matcher ignores llms.txt, so this stays public even while
// the site is closed for review.
import { getSiteConfig } from "@/lib/admin/store";
import fs from "node:fs";
import path from "node:path";

export const revalidate = 3600;

export async function GET() {
  const cfg = await getSiteConfig();
  let body = cfg.llmsOverride ?? "";
  if (!body) {
    try {
      body = fs.readFileSync(path.join(process.cwd(), "public", "llms.txt.bak"), "utf8");
    } catch {
      body = "Cascade Charter Bus — group transportation across the United States.";
    }
  }
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=3600" },
  });
}
