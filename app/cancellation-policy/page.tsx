// cancellation-policy — live text kept (brief 7.11). Uses the shared legal renderer.
import LegalBody from "@/components/LegalBody";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "Cancellation & Refund Policy | Cascade Charter Bus",
  description: "Booking deposits, cancellation windows and refund terms for your charter bus reservation.",
  path: "/cancellation-policy/",
});

export default function Page() {
  return <LegalBody slug="cancellation-policy" />;
}
