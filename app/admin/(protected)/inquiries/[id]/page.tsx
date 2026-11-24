// Single inquiry view — Admin Panel Upgrade Phase 1 (section 5.3).
// Clean card layout, click-to-call / click-to-email, internal notes with
// timestamps, assignment, status pipeline. IP is shown only as muted meta
// (spam-check reference). Opening the inquiry marks it opened (bold clears).
import { notFound } from "next/navigation";
import Link from "next/link";
import { getInquiry, markInquiryOpened } from "@/lib/admin/leads";
import { updateInquiryAction } from "../actions";
import { STATUS_LABEL } from "../page";
import { ArrowLeft, Phone, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true });

export default async function InquiryDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const lead = await getInquiry(id);
  if (!lead) notFound();
  if (lead.status === "new" && !lead.openedAt) {
    await markInquiryOpened(id);
  }

  const Row = ({ k, children }: { k: string; children: React.ReactNode }) => (
    <div className="row" style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: "1px solid #eee" }}>
      <span style={{ width: 130, flexShrink: 0, color: "#6a7180", fontSize: 13 }}>{k}</span>
      <span style={{ fontWeight: 600 }}>{children}</span>
    </div>
  );

  return (
    <>
      <header className="adm-page-head">
        <div>
          <Link href="/admin/inquiries" className="adm-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><ArrowLeft size={14} aria-hidden="true" /> All inquiries</Link>
          <h1 style={{ marginTop: 6 }}>{lead.fullName} {lead.status === "new" && <span className="adm-badge-new">new</span>}</h1>
          <p>Received {fmt(lead.receivedAt)}</p>
        </div>
        <div className="adm-inline">
          <a className="adm-btn" href={`tel:${lead.phone}`}><Phone size={13} style={{ display: "inline", verticalAlign: -2 }} /> Call</a>
          <a className="adm-btn" href={`mailto:${lead.email}?subject=Your Cascade Charter Bus quote`}><Mail size={13} style={{ display: "inline", verticalAlign: -2 }} /> Email</a>
        </div>
      </header>

      {saved && <div className="adm-alert">Saved.</div>}

      <div className="adm-panel">
        <h2>Trip details</h2>
        <Row k="Trip type">{lead.tripType || "—"}</Row>
        <Row k="Category">{lead.category || "—"}</Row>
        <Row k="Trip date">{lead.tripDate}</Row>
        <Row k="Passengers">{lead.passengers}</Row>
        <Row k="Pick-up">{lead.pickupLocation} — {lead.pickupTime}</Row>
        <Row k="Drop-off">{lead.dropoff} — {lead.dropoffTime}</Row>
        <Row k="Stops">{lead.stops || "—"}</Row>
        <Row k="Details">{lead.details || "—"}</Row>
        <Row k="Email">{lead.email}{lead.emailFailed && <span className="adm-badge-new" style={{ marginLeft: 8 }} title={lead.emailFailed}>email failed — still saved</span>}</Row>
        <Row k="Phone">{lead.phone}</Row>
        <Row k="Came from">
          {lead.pageUrl ? <Link className="adm-link" href={lead.pageUrl} target="_blank">{lead.pageUrl}</Link> : "—"}
        </Row>
        {lead.referrer && <Row k="Referrer">{lead.referrer}</Row>}
        {lead.utm && Object.keys(lead.utm).length > 0 && (
          <Row k="UTM"><code style={{ fontSize: 11 }}>{JSON.stringify(lead.utm)}</code></Row>
        )}
        {lead.ip && <Row k="IP (spam ref)"><span className="adm-muted">{lead.ip}</span></Row>}
      </div>

      <div className="adm-panel">
        <h2>Work the lead</h2>
        <form action={updateInquiryAction} className="adm-form">
          <input type="hidden" name="id" value={lead.id} />
          <div className="adm-grid3">
            <div>
              <label className="adm-label">Status</label>
              <select className="adm-input" name="status" defaultValue={lead.status}>
                {Object.entries(STATUS_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="adm-label">Assigned to</label>
              <input className="adm-input" name="assignedTo" defaultValue={lead.assignedTo ?? ""} placeholder="Team member name" />
            </div>
            <div>
              <label className="adm-label">Add note (saved with date)</label>
              <input className="adm-input" name="note" placeholder="Called the customer…" />
            </div>
          </div>
          <button className="adm-btn adm-btn-primary" type="submit" style={{ marginTop: 12 }}>Save lead</button>
        </form>
      </div>

      <div className="adm-panel">
        <h2>Notes &amp; activity</h2>
        {lead.openedAt && <p className="adm-hint">Opened: {fmt(lead.openedAt)}</p>}
        {lead.notes.length === 0 ? (
          <p className="adm-hint">No notes yet — add the first update above.</p>
        ) : (
          <ul className="list-unstyled vstack gap-2 mb-0">
            {[...lead.notes].reverse().map((n, i) => (
              <li key={i}>
                <b>{fmt(n.at)}</b> · {n.by}
                <div>{n.text}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
