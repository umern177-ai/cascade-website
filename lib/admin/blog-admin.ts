// Admin blog list view helper (Admin Panel Upgrade Phase 2): one filtered,
// paginated view over every editable post (seed imports + admin posts +
// base overrides), with status computed locally (published / draft /
// scheduled) and per-status counts.
import "server-only";
import { getBlogFile, getBasePosts } from "@/lib/admin/store";
import { AdminPost } from "@/lib/admin/store";

export type AdminPostRow = AdminPost & {
  status: "published" | "draft" | "scheduled";
  postStatus: "published" | "draft" | "scheduled";
};

export function computePostStatus(p: AdminPost): AdminPostRow["postStatus"] {
  if (p.draft) return "draft";
  if (p.publishAt && p.publishAt > new Date().toISOString()) return "scheduled";
  return "published";
}

export async function adminPostsView(opts: {
  q?: string;
  status?: string;
  cat?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ rows: AdminPostRow[]; total: number; counts: { published: number; draft: number; scheduled: number }; page: number; pages: number; pageSize: number }> {
  const [file, base] = await Promise.all([getBlogFile(), getBasePosts()]);
  const rows: AdminPostRow[] = [];

  for (const b of base) {
    const o = file.posts.find((p) => p.id === "base:" + b.slug);
    if (file.deletedBaseSlugs?.includes(b.slug) && !o) continue;
    rows.push(asRow(o ?? ({ ...b, id: "base:" + b.slug } as AdminPost)));
  }
  for (const p of file.posts) {
    if (p.id.startsWith("base:")) continue;
    rows.push(asRow(p));
  }

  const q = (opts.q || "").toLowerCase().trim();
  const filtered = rows.filter((r) => {
    if (opts.status && r.postStatus !== opts.status) return false;
    if (opts.cat && !(r.categories ?? [r.tag]).includes(opts.cat)) return false;
    if (q && !(`${r.title} ${r.slug}`.toLowerCase().includes(q))) return false;
    return true;
  });
  filtered.sort((a, b) => (a.date < b.date ? 1 : -1));

  const counts = {
    published: rows.filter((r) => r.postStatus === "published").length,
    draft: rows.filter((r) => r.postStatus === "draft").length,
    scheduled: rows.filter((r) => r.postStatus === "scheduled").length,
  };
  const pageSize = [25, 50, 100].includes(Number(opts.pageSize)) ? Number(opts.pageSize) : 25;
  const pages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const page = Math.min(Math.max(opts.page || 1, 1), pages);
  return {
    rows: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length,
    counts,
    page,
    pages,
    pageSize,
  };
}

function asRow(p: AdminPost): AdminPostRow {
  return { ...p, postStatus: computePostStatus(p) } as AdminPostRow;
}

export function postStatusBadge(p: AdminPost): string {
  const s = computePostStatus(p);
  if (s === "draft") return "DRAFT";
  if (s === "scheduled") return "SCHEDULED";
  return "PUBLISHED";
}
