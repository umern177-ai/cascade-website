import { permanentRedirect } from "next/navigation";

// /admin/redirects now lives at /admin/redirect-management (URL Redirect Manager).
export default function LegacyRedirectsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = spResolve(searchParams);
  permanentRedirect("/admin/redirect-management" + (sp ? "?" + sp : ""));
}

async function spResolve(searchParams: Promise<Record<string, string | string[] | undefined>>): Promise<string> {
  try {
    const sp = await searchParams;
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) if (v) params.set(k, Array.isArray(v) ? v[0] : v);
    return params.toString();
  } catch {
    return "";
  }
}
