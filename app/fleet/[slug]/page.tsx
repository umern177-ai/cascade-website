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

  // Rolled out Nov 17 (owner approved the charter-bus demo): every fleet page
  // uses the premium pp-* component. Each vehicle gets its own photo, spec
  // chips, amenities, tips and FAQs from fleet-data.ts. Owner will supply
  // per-vehicle photos later; fleet-data photos render until then.
  const PremiumFleetPage = (await import("@/components/PremiumFleetPage")).default;
  const h1Copy: Record<string, { h1: string; em: string }> = {
    "charter-bus": { h1: "Charter Bus Rental for ", em: "Large Groups" },
    "school-bus": { h1: "School Bus Rental for ", em: "Budget Group Runs" },
    "minibus": { h1: "Minibus Rental for ", em: "Mid-Size Groups" },
    "sprinter-van": { h1: "Sprinter Van Rental for ", em: "Small Groups & Crews" },
    "suv-sedan": { h1: "SUV & Sedan Service for ", em: "Small Parties" },
    "party-bus": { h1: "Limo & Party Bus Rental for ", em: "Celebrations" },
    "sleeper": { h1: "Sleeper Bus Rental for ", em: "Overnight Touring" },
    
  };
  const copy = h1Copy[slug] || { h1: `${v.cardName} Rental for `, em: "Groups" };
  return (
    <PremiumFleetPage
      v={v}
      others={others}
      h1={copy.h1}
      em={copy.em}
    />
  );
}