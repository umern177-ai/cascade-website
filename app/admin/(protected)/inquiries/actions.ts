"use server";

// Quote inquiry actions (Admin Panel Upgrade Phase 1, section 5.3/5.4).
import { redirect } from "next/navigation";
import { InquiryStatus, requireAdmin, updateInquiry } from "@/lib/admin/leads";

const STATUSES: InquiryStatus[] = ["new", "contacted", "quote-sent", "won", "lost", "spam"];

export async function updateInquiryAction(form: FormData): Promise<void> {
  await requireAdmin();
  const status = String(form.get("status") || "");
  if (!isValidStatus(status)) {
    // unknown status — do nothing
    redirect("/admin/inquiries");
  }
  const id = String(form.get("id") || "");
  if (!id) redirect("/admin/inquiries");
  await updateInquiry(id, {
    status: status as InquiryStatus,
    assignedTo: String(form.get("assignedTo") || "").trim(),
    note: String(form.get("note") || "").trim() || undefined,
    by: "admin",
  });
  redirect("/admin/inquiries/" + id + "?saved=1");
}

function isValidStatus(s: string): s is InquiryStatus {
  return (STATUSES as string[]).includes(s);
}
