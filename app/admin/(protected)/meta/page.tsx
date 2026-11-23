// Meta tags editor: title + meta description for EVERY page — core, services,
// fleet, blog, plus the full city/state browser (710 + 48). Values here
// override the defaults; clearing both removes the override (the page falls
// back to its built-in tags).
import { getMetaFile, AdminMeta, MetaFile } from "@/lib/admin/store";
import { SERVICES, FLEET } from "@/lib/site-data";
import { saveMetaAction, removeMetaAction } from "../../actions";
import { Tags } from "lucide-react";

const STATIC_PAGES: { path: string; label: string }[] = [
  { path: "/", label: "Home" },
  { path: "/about/", label: "About" },
  { path: "/contact/", label: "Contact" },
  { path: "/faqs/", label: "FAQs" },
  { path: "/blog/", label: "Blog hub" },
  { path: "/services/", label: "Services hub" },
  { path: "/fleet/", label: "Fleet hub" },
  { path: "/locations/", label: "Locations hub" },
  { path: "/privacy-policy/", label: "Privacy policy" },
  { path: "/termsandconditions/", label: "Terms & conditions" },
  { path: "/cancellation-policy/", label: "Cancellation policy" },
];

function MetaRow({ path: p, label, value }: { path: string; label: string; value?: AdminMeta }) {
  return (
    <details className="adm-acc" open={!!value}>
      <summary>
        <span>{label}</span>
        <code>{p}</code>
        {value && <span className="adm-chip adm-chip-ok">custom</span>}
      </summary>
      <form action={saveMetaAction} className="adm-form">
        <input type="hidden" name="path" value={p} />
        <label className="adm-label">Title <span className="adm-hint-inline">{(value?.title || "").length}/60 · brand is added automatically unless included</span></label>
        <input className="adm-input" name="title" defaultValue={value?.title || ""} maxLength={120} placeholder="Leave empty to keep the built-in title" />
        <label className="adm-label">Meta description <span className="adm-hint-inline">{(value?.description || "").length}/160 (120–160 ideal)</span></label>
        <textarea className="adm-input" name="description" rows={2} defaultValue={value?.description || ""} maxLength={320} placeholder="Leave empty to keep the built-in description" />
        <div className="adm-inline">
          <button className="adm-btn adm-btn-primary" type="submit">Save</button>
          {value && (
            <button className="adm-btn adm-danger-btn" type="submit" formAction={removeMetaAction}>Remove override</button>
          )}
          <a className="adm-btn" href={p} target="_blank" rel="noreferrer">Open page</a>
        </div>
      </form>
    </details>
  );
}

export default async function AdminMetaPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const file: MetaFile = await getMetaFile();

  return (
    <>
      <header className="adm-page-head">
        <div><h1>Meta tags</h1><p>Every page: core, services, fleet, blog and all city/state pages. Empty fields keep the built-in tags.</p></div>
        <Tags aria-hidden="true" />
      </header>
      {saved && <div className="adm-alert">Saved meta for <code>{saved}</code>.</div>}

      <div className="adm-panel">
        <h2>Core pages</h2>
        {STATIC_PAGES.map((s) => <MetaRow key={s.path} path={s.path} label={s.label} value={file[s.path]} />)}
      </div>

      <div className="adm-panel">
        <h2>Service pages</h2>
        {SERVICES.map((s) => {
          const p = `/services/${s.slug}/`;
          return <MetaRow key={p} path={p} label={s.name} value={file[p]} />;
        })}
      </div>

      <div className="adm-panel">
        <h2>Fleet pages</h2>
        {FLEET.map((s) => {
          const p = `/fleet/${s.slug}/`;
          return <MetaRow key={p} path={p} label={s.name} value={file[p]} />;
        })}
      </div>

      <div className="adm-panel">
        <h2>Any other URL (blog posts, …)</h2>
        <p className="adm-hint">Blog meta normally comes from the post itself. For a custom search-only title/description type the path here.</p>
        <form action={saveMetaAction} className="adm-form">
          <label className="adm-label">Path (must start with /)</label>
          <input className="adm-input" name="path" required placeholder="/blog/my-post/" pattern="/.*" />
          <label className="adm-label">Title</label>
          <input className="adm-input" name="title" maxLength={120} />
          <label className="adm-label">Description</label>
          <textarea className="adm-input" name="description" rows={2} maxLength={320} />
          <button className="adm-btn adm-btn-primary" type="submit">Save override</button>
        </form>
      </div>
    </>
  );
}
