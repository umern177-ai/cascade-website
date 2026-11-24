// Media library helpers (Phase 5, 7.5).
import "server-only";
import fs from "node:fs";
import path from "node:path";

// Blob listing is used when the storage is configured (hosting upload mode).
export async function readBlobListIfConfigured(): Promise<Array<{ src: string; url: string; alt: string }>> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "site-uploads/" });
    return blobs.map((b) => ({ src: b.pathname, url: b.url, alt: path.basename(b.pathname) }));
  } catch {
    return [];
  }
}

// Delete an unused upload (file mode only — blob mode uses the blob delete).
export async function deleteUpload(src: string): Promise<boolean> {
  if (src.startsWith("http")) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
    try {
      const { head, del } = await import("@vercel/blob");
      const meta = await head(src);
      await del(meta.url);
      return true;
    } catch {
      return false;
    }
  }
  if (!src.startsWith("/uploads/")) return false;
  try {
    fs.rmSync(path.join(process.cwd(), "public", src), { force: true });
    return true;
  } catch {
    return false;
  }
}
