// Admin API for the Quote Inquiries module (Admin Panel Upgrade Phase 1).
// GET — filtered list (query params: status, from, to, q, page, pageSize)
// PATCH — update one inquiry: { id, status?, assignedTo?, note?, markOpened? }
// All routes are auth-checked (requireAdmin).
import { NextRequest, NextResponse } from "next/server";
import { InquiryStatus, listInquiries, requireAdmin, updateInquiry } from "@/lib/admin/leads";

export const dynamic = "force-dynamic";

const STATUSES: InquiryStatus[] = ["new", "contacted", "quote-sent", "won", "lost", "spam"];

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  }
  const p = req.nextUrl.searchParams;
  return NextResponse.json({
    ok: true,
    ...(await listInquiries({
      status: p.get("status") || undefined,
      from: p.get("from") || undefined,
      to: p.get("to") || undefined,
      q: p.get("q") || undefined,
      page: Number(p.get("page") || 1) || 1,
      pageSize: Number(p.get("pageSize") || 50) || 50,
    })),
  });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "not-authenticated" }, { status: 401 });
  }
  const j = (await req.json().catch(() => null)) as
    | { id?: string; status?: string; assignedTo?: string; note?: string; markOpened?: boolean }
    | null;
  if (!j?.id) return NextResponse.json({ ok: false, error: "no-id" }, { status: 400 });
  if (j.status && !STATUSES.includes(j.status as InquiryStatus)) {
    return NextResponse.json({ ok: false, error: "bad-status" }, { status: 400 });
  }
  await updateInquiry(j.id, {
    status: j.status as InquiryStatus | undefined,
    assignedTo: j.assignedTo,
    note: j.note,
    by: "admin",
    markOpened: j.markOpened,
  });
  return NextResponse.json({ ok: true });
}
