// CSV export of quote inquiries (optional filters, same as the list view).
import { exportInquiriesCsv, requireAdmin } from "@/lib/admin/leads";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return new Response("Unauthorized", { status: 401 });
  }
  const p = req.nextUrl.searchParams;
  const csv = await exportInquiriesCsv({
    status: p.get("status") || undefined,
    from: p.get("from") || undefined,
    to: p.get("to") || undefined,
    q: p.get("q") || undefined,
  });
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="quote-inquiries.csv"',
    },
  });
}
