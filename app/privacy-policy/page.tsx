import type { Metadata } from "next";
import { withOverrides } from "@/lib/admin/meta-apply";
// privacy-policy — live text kept (brief 7.11). Uses the shared legal renderer.
import LegalBody from "@/components/LegalBody";
import { pageMeta } from "@/lib/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta(await withOverrides({

  title: "Privacy Policy | Cascade Charter Bus",
  description: "How Cascade Charter Bus collects, uses and protects your personal information, data rights and communication choices.",
  path: "/privacy-policy/",
  }));
}

export default function Page() {
  return <LegalBody slug="privacy-policy" />;
}
