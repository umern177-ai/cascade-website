// Quote Inquiries store (Admin Panel Upgrade Phase 1). Every quote form
// submission is saved BEFORE the email is attempted, so a failed email can
// still be contacted from the admin. Storage goes through lib/admin/store
// (data/admin/leads.json + Vercel Blob when configured) — durable on hosting.
import "server-only";
import { readFile, writeFile, logHistory } from "@/lib/admin/store";
import { isAuthed } from "@/lib/admin/auth";

export type InquiryStatus = "new" | "contacted" | "quote-sent" | "won" | "lost" | "spam";

export type InquiryNote = { at: string; by: string; text: string };

export type Inquiry = {
  id: string;
  receivedAt: string;
  status: InquiryStatus;
  openedAt?: string;
  emailSent?: boolean;
  emailFailed?: string; // error reason when the email step failed
  assignedTo?: string;
  notes: InquiryNote[];
  // submission fields
  fullName: string;
  email: string;
  phone: string;
  tripType: string;
  tripDate: string;
  passengers: number;
  pickupLocation: string;
  pickupTime: string;
  dropoff: string;
  dropoffTime: string;
  stops?: string;
  category?: string;
  details?: string;
  // tracking
  pageUrl?: string;
  referrer?: string;
  utm?: Record<string, string>;
  ip?: string; // internal only — never rendered for non-admin roles
};

const FILE = "leads.json";
const MAX_LEADS = 10_000; // rolling window; exports exist for long-term archives

const EMPTY: Inquiry[] = [];

async function load(): Promise<Inquiry[]> {
  return readFile<Inquiry[]>(FILE, EMPTY);
}

async function save(list: Inquiry[]): Promise<void> {
  await writeFile(FILE, list.slice(0, MAX_LEADS));
}

export async function addInquiry(lead: Omit<Inquiry, "id" | "status" | "notes">): Promise<string> {
  const list = await load();
  const id = "q" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  list.unshift({ ...lead, id, status: "new" as const, notes: [] });
  await save(list);
  return id;
}

export async function markEmailFailure(id: string, error: string): Promise<void> {
  const list = await load();
  const lead = list.find((l) => l.id === id);
  if (lead) {
    lead.emailFailed = error.slice(0, 200);
    await save(list);
  }
}

export async function markEmailSent(id: string): Promise<void> {
  const list = await load();
  const lead = list.find((l) => l.id === id);
  if (lead) {
    lead.emailSent = true;
    await save(list);
  }
}

// Admin list with the shared filters (API + page + CSV export all use this).
export async function listInquiries(opts: {
  status?: string;
  from?: string; // YYYY-MM-DD (inclusive)
  to?: string;
  q?: string; // name / email / phone / city
  page?: number; // 1-based
  pageSize?: number;
}): Promise<{ rows: Inquiry[]; total: number; unread: number }> {
  const all = await load();
  const q = (opts.q || "").toLowerCase().trim();
  const filtered = all.filter((l) => {
    if (opts.status && l.status !== opts.status) return false;
    const day = l.receivedAt.slice(0, 10);
    if (opts.from && day < opts.from) return false;
    if (opts.to && day > opts.to) return false;
    if (q) {
      const hay = `${l.fullName} ${l.email} ${l.phone} ${l.pickupLocation} ${l.dropoff}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const pageSize = Math.min(Math.max(opts.pageSize || 50, 10), 200);
  const page = Math.max(opts.page || 1, 1);
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
  // unread = only "new" and older than a moment (just-arrived still counts)
  const unread = all.filter((l) => l.status === "new").length;
  return { rows, total: filtered.length, unread };
}

export async function unreadCount(): Promise<number> {
  return (await load()).filter((l) => l.status === "new").length;
}

export async function getInquiry(id: string): Promise<Inquiry | undefined> {
  return (await load()).find((l) => l.id === id);
}

// mark-opened without changing status (detail view call)
export async function markInquiryOpened(id: string): Promise<void> {
  await updateInquiry(id, { markOpened: true });
}

export async function updateInquiry(
  id: string,
  patch: { status?: InquiryStatus; assignedTo?: string; note?: string; by?: string; markOpened?: boolean },
): Promise<void> {
  const list = await load();
  const lead = list.find((l) => l.id === id);
  if (!lead) return;
  if (patch.status) lead.status = patch.status;
  if (patch.assignedTo !== undefined) lead.assignedTo = patch.assignedTo || undefined;
  if (patch.note && patch.note.trim()) {
    lead.notes = [...lead.notes, { at: new Date().toISOString(), by: patch.by || "admin", text: patch.note.trim() }];
  }
  if (patch.markOpened && !lead.openedAt) lead.openedAt = new Date().toISOString();
  await save(list);
  await logHistory("inquiry", "/admin/inquiries", `Lead ${id} — status ${lead.status}, ${lead.fullName}`);
}

// CSV export (filtered the same way as the list view)
export async function exportInquiriesCsv(opts: Parameters<typeof listInquiries>[0]): Promise<string> {
  const { rows } = await listInquiries({ ...opts, page: 1, pageSize: MAX_LEADS });
  const NL = String.fromCharCode(10);
  const head = "id,received,status,name,email,phone,trip_type,trip_date,passengers,pickup,pickup_time,dropoff,dropoff_time,stops,category,details,page_url,referrer,email_sent,email_failed";
  const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((l) =>
    [l.id, l.receivedAt.slice(0, 16).replace("T", " "), l.status, l.fullName, l.email, l.phone, l.tripType, l.tripDate, l.passengers, l.pickupLocation, l.pickupTime, l.dropoff, l.dropoffTime, l.stops, l.category, l.details, l.pageUrl, l.referrer, l.emailSent ? "yes" : "no", l.emailFailed ?? ""]
      .map(cell)
      .join(",")
  );
  return [head, ...lines].join(NL);
}

// Guard shared by API routes (defense in depth — actions.ts re-checks too).
export async function requireAdmin(): Promise<boolean> {
  return isAuthed();
}
