// Fleet detail page template — matches the live fleet page structure with the
// fixes from brief 7.4: breadcrumb on every page, quick facts from ONE data
// source, real phone number in Call Now, exact capacity wording, 4 FAQs.
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Users, Quote, Phone, Check, ChevronRight, Star, MapPin, Briefcase, Wifi, ShieldCheck,
} from "lucide-react";
import FaqAccordion from "@/components/Faq";
import Breadcrumbs from "@/components/Breadcrumbs";
import { VEHICLES, getVehicle } from "@/lib/fleet-data";
import { SITE } from "@/lib/site-data";
import { pageMeta } from "@/lib/page-meta";

export function generateStaticParams() {
  return VEHICLES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const v = getVehicle(slug);
  if (!v) return {};
  return pageMeta({
    title: v.metaTitle,
    description: v.metaDescription,
    path: `/fleet/${v.slug}/`,
    image: v.photo,
  });
}

export default async function FleetDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = getVehicle(slug);
  if (!v) notFound();
  const others = VEHICLES.filter((o) => o.slug !== v.slug);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${v.cardName} Rental`,
    provider: { "@type": "LocalBusiness", name: SITE.name, telephone: SITE.phoneDisplay, url: SITE.url },
    areaServed: { "@type": "Country", name: "United States" },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: v.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="bg-white min-vh-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Fleet", href: "/fleet/" }, { label: v.cardName }]}
        />

      {/* Hero */}
      <section className="py-5 bg-dark text-white">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <p className="text-brand-dark fw-bold text-uppercase tracking-widest mb-2">Cascade Fleet</p>
              <h1 className="display-4 fw-bold mb-3">{v.cardName}</h1>
              <p className="opacity-90 mb-2 d-flex align-items-center gap-2">
                <Users size={18} className="text-primary" aria-hidden="true" /> {v.passengers}
              </p>
              <p className="opacity-75 mb-4">{v.intro}</p>
              <div className="d-flex flex-wrap gap-3">
                <Link className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm" href="/contact/">
                  <Quote size={16} className="me-2" aria-hidden="true" /> Request a Quote
                </Link>
                <a className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2" href={`tel:${SITE.phoneTel}`}>
                  <Phone size={16} aria-hidden="true" /> {SITE.phoneDisplay}
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="rounded-4 overflow-hidden shadow-lg border">
                <Image src={v.photo} alt={`${v.cardName} - Cascade Charter Bus`} width={900} height={560} priority style={{ objectFit: "cover", width: "100%" }} sizes="(max-width: 992px) 100vw, 50vw" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transportation section */}
      <section className="py-5">
        <div className="container py-4">
          <h2 className="display-6 fw-bold mb-4 text-dark">{v.cardName} Transportation</h2>
          <div className="row g-3">
            {v.features.map((f) => (
              <div className="col-md-6" key={f}>
                <div className="p-3 bg-light border rounded-3 d-flex align-items-center gap-3">
                  <Check size={18} className="text-primary flex-shrink-0" aria-hidden="true" />
                  <span className="text-dark small fw-medium">{f}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ideal For */}
      <section className="py-5 pt-0">
        <div className="container">
          <div className="p-4 bg-dark text-white rounded-4">
            <p className="fw-bold small text-uppercase mb-3">Ideal For</p>
            <div className="d-flex flex-wrap gap-2">
              {v.bestFor.map((b) => (
                <Link key={b.href} href={b.href} className="btn btn-outline-light rounded-pill px-4 py-2 small fw-semibold">
                  {b.label} <ChevronRight size={14} className="ms-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why people choose this vehicle */}
      <section className="py-5">
        <div className="container py-4">
          <h2 className="display-6 fw-bold text-dark mb-4">Why people book a {v.ctaName}</h2>
          {/* charter bus rental / motorcoach / shuttle keywords woven into visible copy */}
          <div className="row g-3">
            {v.whyChoose.map((w) => (
              <div className="col-md-6" key={w}>
                <div className="p-3 bg-white border rounded-3 d-flex align-items-start gap-3 h-100">
                  <span className="text-primary mt-1 fw-bold">✓</span>
                  <span className="text-muted small">{w}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real trips this vehicle is booked for */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <h2 className="display-6 fw-bold mb-1 text-dark">Real trips this vehicle is booked for</h2>
          <p className="text-muted mb-4" style={{ maxWidth: 720 }}>
            A look at how our customers actually use this vehicle, so you can match it to your own trip.
          </p>
          <div className="row g-4">
            {v.useCases.map((u) => (
              <div className="col-md-4" key={u.title}>
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                  <h3 className="h6 fw-bold text-dark mb-2">{u.title}</h3>
                  <p className="text-muted small mb-0">{u.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planning tips */}
      <section className="py-5">
        <div className="container py-4">
          <div className="row g-5 align-items-start">
            <div className="col-lg-5">
              <h2 className="display-6 fw-bold text-dark mb-3">Planning tips before you book</h2>
              <p className="text-muted">
                Four answers settle most of the details. Give them to the dispatch team and the
                quote comes back final, with the right vehicle already chosen.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link className="btn btn-primary rounded-pill px-4 py-2 fw-bold" href="/contact/">GET A QUOTE</Link>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="vstack gap-3">
                {v.planningTips.map((tip, i) => (
                  <div className="d-flex align-items-start gap-3" key={i}>
                    <span className="badge bg-primary rounded-circle mt-1 flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: 28, height: 28, fontSize: "0.85rem" }}>{i + 1}</span>
                    <p className="text-muted mb-0">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold text-dark">Frequently Asked Questions About {v.cardName}</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <FaqAccordion faqs={v.faqs} idPrefix={`fleet-${v.slug}`} />
            </div>
          </div>
        </div>
      </section>

      {/* Other fleet options */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <h2 className="display-6 fw-bold mb-4 text-center text-dark">Explore More Fleet Options</h2>
          <div className="row g-4">
            {others.map((o) => (
              <div className="col-lg-4 col-md-6" key={o.slug}>
                <Link href={`/fleet/${o.slug}/`} className="text-decoration-none">
                  <div className="card border-0 shadow-sm rounded-4 hover-lift h-100 overflow-hidden">
                    <Image src={o.photo} alt={`${o.cardName} - Cascade Charter Bus`} width={600} height={340} style={{ objectFit: "cover", width: "100%" }} sizes="(max-width: 768px) 100vw, 30vw" />
                    <div className="card-body p-4">
                      <h3 className="h5 fw-bold text-dark mb-1">{o.cardName}</h3>
                      <p className="x-small-bold text-muted mb-2">{o.passengers}</p>
                      <p className="text-muted small mb-0">{o.tagline}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 bg-dark text-white text-center">
        <div className="container py-4">
          <h2 className="display-6 fw-bold mb-3">{`Need a ${v.ctaName}?`}</h2>
          <p className="text-white-50 mb-4">Tell us your headcount, luggage and route for a fast, transparent quote.</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link className="btn btn-primary rounded-pill px-5 py-3 fw-bold btn-lg" href="/contact/">GET A FREE QUOTE</Link>
            <a className="btn btn-outline-light rounded-pill px-5 py-3 fw-bold btn-lg" href={`tel:${SITE.phoneTel}`}>CALL {SITE.phoneDisplay}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
