// Global Content (/admin/global) — Admin Panel Upgrade Phase 3 (3.7): edit the
// facts used across the site (header, footer, contact, schema copy) once,
// from here. Saved facts revalidate the layout instantly (localhost) and go
// live on hosting through the durable store.
import { getSiteConfig } from "@/lib/admin/store";
import { GLOBAL_FIELDS } from "@/lib/admin/global";
import saveGlobalFactsAction from "./actions";
import { Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminGlobal({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const cfg = await getSiteConfig();
  const g = cfg.global ?? {};

  return (
    <>
      <header className="adm-page-head">
        <div><h1>Global content</h1><p>Facts used on many pages — edit once, they update everywhere (header, footer, contact, schema copy).</p></div>
        <Building2 aria-hidden="true" />
      </header>
      {saved && <div className="adm-alert">Saved — header/footer and contact details refreshed.</div>}

      <div className="adm-panel">
        <form action={saveGlobalFactsAction} className="adm-form">
          <div className="adm-grid2">
            {GLOBAL_FIELDS.map((f) => (
              <div key={f.key}>
                <label className="adm-label" htmlFor={"g:" + f.key}>{f.label}{f.hint && <span className="adm-hint-inline"> · {f.hint}</span>}</label>
                <input className="adm-input" id={"g:" + f.key} name={"g:" + f.key} defaultValue={(g as Record<string, string>)[f.key] ?? ""} />
              </div>
            ))}
          </div>
          <p className="adm-hint">Leave a field empty to fall back to the built-in default.</p>
          <button className="adm-btn adm-btn-primary" type="submit">Save global facts</button>
        </form>
      </div>
    </>
  );
}
