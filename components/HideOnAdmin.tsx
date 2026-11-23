"use client";

// Hides blocks of the public chrome (header, footer, cookie banner, GTM
// helpers) inside the admin dashboard, where they are just noise — and GTM
// fires would distort analytics.
import { usePathname } from "next/navigation";

export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const p = usePathname();
  if (p.startsWith("/admin")) return null;
  return <>{children}</>;
}
