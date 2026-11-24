// URL Redirect Manager (/admin/redirect-management) — server wrapper that
// loads the durable rules and hands them to the interactive client surface.
// The runtime engine (proxy.ts) applies saved rules live in seconds.
import { listRules } from "@/lib/admin/redirect-engine";
import RedirectsClient, { ClientRule } from "@/components/admin/RedirectsClient";
import { ArrowRightLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RedirectManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ create?: string; to?: string }>;
}) {
  const sp = await searchParams;
  const rules = (await listRules()) as unknown as ClientRule[];

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1>URL Redirect Manager</h1>
          <p>Real HTTP 301/302/307/410 — served by the runtime proxy. Saved rules go live in seconds, no build or deploy. Matches lowercase with the query string passed through.</p>
        </div>
        <ArrowRightLeft aria-hidden="true" />
      </header>
      <RedirectsClient rules={rules} prefillFrom={sp.create} prefillTo={sp.to} />
    </>
  );
}
