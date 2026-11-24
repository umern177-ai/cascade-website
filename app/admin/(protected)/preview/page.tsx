// /admin/preview?path=/x/ — draft PREVIEW (section 3.4): shows the stored
// draft copy next to the live copy for logged-in admins, with a PREVIEW bar.
// The real live page is never touched until "Save & publish".
import Link from "next/link";
import { getPageDrafts } from "@/lib/admin/store";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPreview({ searchParams }: { searchParams: Promise<{ path?: string }> }) {
  const { path } = await searchParams;
  if (!path?.startsWith("/")) notFound();
  const drafts = await getPageDrafts();
  const draft = drafts[path];
  if (!draft) notFound();
  const fields = Object.entries(draft.fields ?? {}).filter(([, v]) => v);
  const faqs = (draft.faqs ?? []).filter((f) => f.q || f.a);

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1>Draft preview — {path}</h1>
          <p>This is how the page content would look after you publish it. The live page is untouched.</p>
        </div>
        <Link className="adm-btn" href={path} target="_blank">Open the live page ↗</Link>
      </header>

      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#e23b3b", color: "#fff", padding: "8px 16px", borderRadius: 10, fontWeight: 800, letterSpacing: 1, marginBottom: 14 }}>
        PREVIEW — saved draft only (not visible to visitors)
      </div>

      <div className="adm-panel">
        <h2>Fields ({fields.length})</h2>
        <table className="adm-table">
          <thead><tr><th>Field</th><th>Value</th></tr></thead>
          <tbody>
            {fields.map(([k, v]) => (
              <tr key={k}>
                <td><code style={{ fontSize: 12 }}>{k}</code></td>
                <td>{v.length > 280 ? v.slice(0, 280) + "…" : v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {faqs.length > 0 && (
        <div className="adm-panel">
          <h2>FAQs ({faqs.length})</h2>
          {faqs.map((f, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}>
              <b>{f.q}</b>
              <p className="mb-0" style={{ color: "#4a5060", fontSize: 14 }}>{f.a}</p>
            </div>
          ))}
        </div>
      )}

      <div className="adm-panel">
        <h2>Publish this draft</h2>
        <p className="adm-hint">Open the page editor and press "Save &amp; publish" — the draft clears automatically when published.</p>
        <Link className="adm-btn adm-btn-primary" href={`/admin/pages/edit?path=${encodeURIComponent(path)}`}>Open editor to publish</Link>
      </div>
    </>
  );
}
