// Schema & tracking — sitewide settings the SEO team controls:
//   - sitewide JSON-LD (validated on save; injected into every page's <head>)
//   - GA4 / Microsoft Clarity measurement IDs
//   - arbitrary <head> code (e.g. verification tags) without touching code
// Per-page JSON-LD lives in the page editor ("Page schema" panel).
import { getSiteConfig } from "@/lib/admin/store";
import SchemaForm from "@/components/SchemaForm";

export default async function AdminSchemaPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const config = await getSiteConfig();
  return (
    <>
      <header className="adm-page-head">
        <div><h1>Schema &amp; tracking</h1><p>Sitewide structured data and tracking integrations — updates go live without a deployment.</p></div>
      </header>
      {saved && <div className="adm-alert">Saved — sitewide schema/code is live on every page.</div>}
      <SchemaForm
        initial={{
          customSchema: config.customSchema ?? "",
          headHtml: config.headHtml ?? "",
          gaMeasurementId: config.gaMeasurementId ?? "",
          clarityId: config.clarityId ?? "",
        }}
      />
      <div className="adm-panel">
        <h2>Already implemented in the code</h2>
        <ul className="adm-list">
          <li>Organization (sitewide) — <code>lib/schema.ts</code>, linked by @id from every other block.</li>
          <li>LocalBusiness on every city and state page; Service on service/fleet pages.</li>
          <li>FAQPage wherever an FAQ section renders; BlogPosting on every article.</li>
          <li>BreadcrumbList — <code>components/Breadcrumbs.tsx</code>, visible + structured.</li>
          <li>No duplicate types: the builder reuses existing blocks by @id.</li>
          <li>Page-level overrides live in the <strong>All pages → Edit</strong> screen ("Page schema" panel) — no deployment needed.</li>
        </ul>
      </div>
    </>
  );
}
