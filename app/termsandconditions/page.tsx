import type { Metadata } from "next";
import { withOverrides } from "@/lib/admin/meta-apply";
// termsandconditions — live text kept (brief 7.11). Uses the shared legal renderer.
import LegalBody from "@/components/LegalBody";
import { pageMeta } from "@/lib/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta(await withOverrides({

  title: "Terms & Conditions | Cascade Charter Bus",
  description: "Service terms for Cascade Charter Bus bookings: rates, payment, driver regulations and governing law.",
  path: "/termsandconditions/",
  }));
}

export default function Page() {
  return <LegalBody slug="termsandconditions" />;
}
