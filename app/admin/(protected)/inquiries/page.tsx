// Quote Inquiries (/admin/inquiries) — Admin Panel Upgrade Phase 1, section 5.
// Every quote form submission is saved here before email. New rows are bold
// until opened. Filters: status / date range / search; paginated, no cap.
// CSV export for all or the filtered rows. Detail view (edit page) handles
// status, notes and assignment.
import Link from "next/link";
import { listInquiries, Inquiry } from "@/lib/admin/leads";
import { Inbox, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export const STATUS_LABEL: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  "quote-sent": "Quote sent",
  won: "Won",
  lost: "Lost",
  spam: "Spam",
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true });

export default async function AdminInquiries({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; from?: string; to?: string; q?: string; page?: string; pageSize?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page || 1) || 1, 1);
  const pageSize = Number(sp.pageSize || 50) || 50;
  const { rows, total, unread } = await listInquiries({
    status: sp.status || undefined,
    from: sp.from || undefined,
    to: sp.to || undefined,
    q: sp.q || undefined,
    page,
    pageSize,
  });
  const pages = Math.max(Math.ceil(total / pageSize), 1);
  const link = (over: Record<string, string | number>) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries({ status: sp.status, from: sp.from, to: sp.to, q: sp.q, page: sp.page, pageSize: sp.pageSize, ...over })) {
      if (v) params.set(k, String(v));
    }
    return "/admin/inquiries?" + params.toString();
  };

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1>
            Quote inquiries {unread > 0 && <span className="adm-badge-new">{unread} new</span>}
          </h1>
          <p>Every quote form submission, saved before email. Newest first.</p>
        </div>
        <Inbox aria-hidden="true" />
      </header>

      <div className="adm-panel">
        <form className="adm-form" action="/admin/inquiries" method="get" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <label className="adm-label">Search name / email / phone / city</label>
            <input className="adm-input" style={{ width: 260 }} name="q" defaultValue={sp.q ?? ""} />
          </div>
          <div>
            <label className="adm-label">Status</label>
            <select className="adm-input" name="status" defaultValue={sp.status ?? ""}>
              <option value="">All</option>
              {Object.entries(STATUS_LABEL).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="adm-label">From</label>
            <input className="adm-input" type="date" name="from" defaultValue={sp.from ?? ""} />
          </div>
          <div>
            <label className="adm-label">To</label>
            <input className="adm-input" type="date" name="to" defaultValue={sp.to ?? ""} />
          </div>
          <button className="adm-btn" type="submit">Apply filters</button>
          <Link className="adm-btn" href="/admin/inquiries">Clear</Link>
          <Link className="adm-btn" href={`/api/admin/inquiries/export?${new URLSearchParams({ status: sp.status ?? "", from: sp.from ?? "", to: sp.to ?? "", q: sp.q ?? "" }).toString()}`}>Export CSV</Link>
        </form>
      </div>

      <div className="adm-panel">
        {total === 0 ? (
          <p className="adm-hint">No inquiries match. (Test: send a quote form on the site, it appears here immediately.)</p>
        ) : (
          <>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Received</th><th>Name</th><th>Phone</th><th>Email</th><th>Trip date</th>
                  <th>Pick-up</th><th>Vehicle / trip</th><th>From page</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((l: Inquiry) => (
                  <tr key={l.id} style={l.status === "new" ? { fontWeight: 700 } : undefined}>
                    <td className="adm-muted" style={{ whiteSpace: "nowrap" }}>{fmt(l.receivedAt)}</td>
                    <td><Link className="adm-link" href={`/admin/inquiries/${l.id}`}>{l.fullName}</Link></td>
                    <td><a className="adm-link" href={`tel:${l.phone}`}>{l.phone}</a></td>
                    <td><a className="adm-link" href={`mailto:${l.email}`}>{l.email}</a></td>
                    <td className="adm-muted">{l.tripDate}</td>
                    <td className="adm-muted">{l.pickupLocation} → {l.dropoff}</td>
                    <td className="adm-muted">{l.category || l.tripType || "—"}{l.passengers ? ` · ${l.passengers} px` : ""}</td>
                    <td className="adm-muted" style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {l.pageUrl || l.referrer ? (
                        <Link className="adm-link" href={l.pageUrl || l.referrer!} target="_blank" title={l.pageUrl || l.referrer}>
                          {(() => { try { return new URL(l.pageUrl || l.referrer!).pathname; } catch { return l.referrer || "—"; } })()}
                        </Link>
                      ) : "—"}
                    </td>
                    <td>{l.emailFailed && <span className="adm-badge-new" style={{ marginRight: 6 }} title={l.emailFailed}>email failed</span>}{STATUS_LABEL[l.status] ?? l.status}</td>
                    <td className="adm-row-actions">
                      <Link className="adm-btn" href={`/admin/inquiries/${l.id}`}>Open</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* pagination — no cap on total */}
            <div className="adm-inline" style={{ marginTop: 14, alignItems: "center" }}>
              <span className="adm-hint">{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}</span>
              <Link className={"adm-btn" + (page <= 1 ? "" : "")} style={{ opacity: page <= 1 ? 0.4 : 1 }} href={link({ page: Math.max(page - 1, 1) })} aria-disabled={page <= 1}>← Prev</Link>
              <span className="adm-hint">Page {page} / {pages}</span>
              <Link className="adm-btn" style={{ opacity: page >= pages ? 0.4 : 1 }} href={link({ page: Math.min(page + 1, pages) })} aria-disabled={page >= pages}>Next →</Link>
              {[25, 50, 100].map((n) => (
                <Link key={n} className={"adm-btn" + (pageSize === n ? " adm-btn-primary" : "")} href={link({ page: 1, pageSize: n })}>{n} / page</Link>
              ))}
            </div>
          </>
        )}
      </div>
      <p className="adm-hint"><Plus size={12} aria-hidden="true" /> New inquiries were never stored before Phase 1 — this module starts empty and fills from the live forms.</p>
    </>
  );
}
