// Re-export the service FAQs as a helper for the admin editors (the record
// lives with the service template because it is rendered there).
import "server-only";
import { SERVICE_FAQS } from "@/app/services/[slug]/page";

export function getServiceFaqs(slug: string): { q: string; a: string }[] {
  return SERVICE_FAQS[slug] ?? [];
}
