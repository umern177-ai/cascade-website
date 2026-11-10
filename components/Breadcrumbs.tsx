// Visible breadcrumbs + BreadcrumbList schema (brief Section 9.7).
// Live city and fleet pages lack them — added on every page except home.
import Link from "next/link";

export type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `https://cascadecharterbus.com${c.href}` } : {}),
    })),
  };
  return (
    <nav aria-label="breadcrumb" className="small">
      <ol className="breadcrumb mb-0 align-items-center">
        {items.map((c, i) => (
          <li key={i} className={`breadcrumb-item d-flex align-items-center gap-2 ${i === items.length - 1 ? "active" : ""}`}>
            {i > 0 && <span className="text-primary" aria-hidden="true">›</span>}
            {c.href ? (
              <Link href={c.href} className="text-decoration-none text-dark">{c.label}</Link>
            ) : (
              <span>{c.label}</span>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </nav>
  );
}
