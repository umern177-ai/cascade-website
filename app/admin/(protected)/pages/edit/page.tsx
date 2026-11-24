// Unified page editor — the screen behind "Edit" on ALL PAGES. Shows every
// content field the page renders (WordPress-style), prefilled from the
// built-in copy or the saved rewrite, plus meta tags.
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageCatalog } from "@/lib/admin/page-catalog";
import { getPageBody, getMetaFile, getPageDrafts, type Faq, type PageBody } from "@/lib/admin/store";
import {
  cityFields, serviceFields, fleetFields, homeFields, aboutFields, contactFields,
  locationsHubFields, stateFields, legalFields,
} from "@/lib/admin/page-fields";
import { getSiteContent } from "@/lib/admin/page-content";
import { getStructuredCityPage } from "@/lib/city-page-data";
import { SERVICE_META } from "@/lib/fleet-data";
import { getVehicle } from "@/lib/fleet-data";
import { saveMetaAction, removeMetaAction } from "../../../actions";
import PageBodyEditor from "@/components/admin/PageBodyEditor";

type Props = { searchParams: Promise<{ path?: string; saved?: string }> };

type EditorSpec = { groups: ReturnType<typeof cityFields>["groups"]; faqs: Faq[] } | null;

function pageType(path: string): "service" | "fleet" | "blog" | "state" | "city" | "core" {
  if (/^\/locations\/[a-z]{2}\/.+\/$/.test(path)) return "city";
  if (/^\/locations\/[a-z]{2}\/$/.test(path)) return "state";
  if (path.startsWith("/services/")) return "service";
  if (path.startsWith("/fleet/")) return "fleet";
  if (path.startsWith("/blog/")) return "blog";
  return "core";
}

export default async function PageEditor({ searchParams }: Props) {
  const { path: pathParam, saved } = await searchParams;
  const path = pathParam || "";
  if (!path.startsWith("/")) notFound();

  const entry = (await pageCatalog()).find((e) => e.path === path);
  if (!entry) notFound();

  const content = await (await import("@/lib/admin/page-content")).getSiteContent();

  const [metaFile, body, drafts] = await Promise.all([getMetaFile(), getPageBody(path), getPageDrafts()]);
  const versions = body?.versions ?? [];
  const hasDraft = !!drafts[path];
  const type = pageType(path);

  // ---- build the full field spec for body-capable pages ----
  const spec = await specBuilder();
  const bodyForEditor = body;

  async function specBuilder(): Promise<ReturnType<typeof cityFields> | ReturnType<typeof serviceFields> | ReturnType<typeof fleetFields> | ReturnType<typeof homeFields> | ReturnType<typeof aboutFields> | ReturnType<typeof contactFields> | ReturnType<typeof locationsHubFields> | ReturnType<typeof stateFields> | ReturnType<typeof legalFields> | null> {
    if (type === "city") {
      const m = path.match(new RegExp("^/locations/([a-z]{2})/(.+?)/$"));
      if (!m) return null;
      const structured = getStructuredCityPage(m[1], m[2]);
      if (structured) {
        const stAbbr = m[1].toUpperCase();
        const h1View = structured.title.startsWith("Charter Bus Rental in ")
          ? `Charter Bus Rental in ${structured.city}, ${stAbbr}`
          : structured.city + " Charter Bus Rental";
        return cityFields(
          {
            servicesHeading: structured.servicesHeading,
            services: structured.services.map((s) => ({ title: s.title, text: s.text })),
            vehiclesHeading: structured.vehiclesHeading,
            destinationsHeading: structured.destinationsHeading,
            destinations: structured.destinations.map((d) => ({ name: d.name, text: d.text, tip: d.tip })),
            faqsHeading: structured.faqsHeading,
            faqs: structured.faqs,
            ctaHeading: structured.ctaHeading,
            heroIntro: structured.heroIntro,
            h1View,
          },
          body
        );
      }
      return null;
    }
    if (type === "service") {
      const slug = path.replace(new RegExp("^/services/"), "").replace(new RegExp("/$"), "");
      const meta = SERVICE_META[slug];
      const faq = (await import("@/app/admin/get-service-faqs")).getServiceFaqs(slug);
      return meta ? serviceFields({ h1: meta.h1, intro: meta.intro, eyebrow: meta.eyebrow }, faq as Faq[], body) : null;
    }
    if (type === "fleet") {
      const slug = path.replace(new RegExp("^/fleet/"), "").replace(new RegExp("/$"), "");
      const v = getVehicle(slug);
      return v ? fleetFields(
        {
          tagline: v.tagline,
          intro: v.intro,
          features: v.features,
          whyChoose: v.whyChoose,
          useCases: v.useCases,
          planningTips: v.planningTips,
        },
        body
      ) : null;
    }
    if (type === "core" && path === "/") {
      return homeFields({
        h1A: "Charter Bus Travel,",
        h1B: "Elevated.",
        lead: content.homeHeroLead ?? "Some trips are more than just travel.",
        sub: content.homeHeroSub ?? "From a 7-seat SUV to a full 56-seat motorcoach.",
        fleetH: "A Vehicle for Every Group and Every Trip",
        fleetSub: "Pick by headcount and trip length — or tell us both and we’ll match the vehicle for you.",
        servicesH: "Charter Bus Services",
        servicesSub: "Eight services, one booking team—matched vehicle and driver for every kind of trip.",
        tripsH: "Four Ways to Book a Charter Bus",
        stepsH: "How to Book a Charter Bus in 4 Steps",
        ctaH: "Ready to Book Your Charter Bus?",
        ctaP: "Fast, final quote. Gratuity, tolls and taxes included. Dispatch answers around the clock.",
        factLabels: ["Quote reply time", "Gratuity, tolls & taxes", "Dispatch support", "States covered"],
      factValues: ["15min", "Included", "24/7", "50"],
      }, body);
    }
    if (type === "core" && path === "/about/") {
      return aboutFields({
        h1: "About Cascade Charter Bus",
        lead: "",
        standards: [
          { title: "Safety-First Culture", text: "Our DOT-compliant safety protocols include rigorous multi-point inspections and electronic logging." },
          { title: "Well-Equipped Coaches", text: "High-speed WiFi, power outlets, and climate control are available on most motorcoaches—we confirm the amenities for your vehicle when you book." },
          { title: "Local Expertise", text: "We employ drivers with deep knowledge of local routes to navigate city traffic efficiently." },
          { title: "24/7 Support", text: "Dispatch is reachable around the clock, before and during your trip." },
        ],
        facts: [],
      }, body);
    }
    if (type === "core" && path === "/contact/") {
      return contactFields({
        h1: "Book Your Group Transportation",
        lead: "Complete the form below for a detailed itinerary quote. Average response time: about 15 minutes, any hour of the day.",
      }, body);
    }
    if (type === "core" && path === "/locations/") {
      return locationsHubFields({
        h1: "Our Service Locations",
        lead: "Charter bus rental city pages across 48 states.",
      }, body);
    }
    if (type === "state") {
      const nm = stateNameOf(path) || "";
      return stateFields({
        h1: "Charter Bus Rental in " + nm,
        lead: "Select a city below to explore local group transportation services and fleet options.",
        reliableParas: [
          "Cascade Charter Bus runs group transportation in " + nm + " and all 50 states: coach tours, sports travel, wedding shuttles, airport transfers and school trips.",
          "Trips in " + nm + " usually need one of two things: a schedule that holds, or a load that fits. We plan both: pickup times built backwards from your arrival, and a vehicle matched to your headcount and luggage.",
        ],
      }, body);
    }
    if (path === "/privacy-policy/" || path === "/termsandconditions/" || path === "/cancellation-policy/") {
      return legalFields({ sections: legalSectionsFor(path) }, body);
    }
    return null;
  }

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1>{`Edit: ${entry.title}`}</h1>
          <p><code>{path}</code> · type: {type}</p>
        </div>
        <div className="adm-inline">
          <Link className="adm-btn" href="/admin/pages">← All pages</Link>
          <a className="adm-btn" href={path} target="_blank" rel="noreferrer">Open page</a>
        </div>
      </header>

      {/* ===== meta tags (every page) ===== */}
      <div className="adm-panel">
        <h2>Meta tags</h2>
        <form action={saveMetaAction} className="adm-form">
          <input type="hidden" name="path" value={path} />
          <label className="adm-label">SEO title <span className="adm-hint-inline">{(metaFile[path]?.title || "").length}/60 · brand is added unless included</span></label>
          <input className="adm-input" name="title" defaultValue={metaFile[path]?.title || ""} maxLength={120} placeholder="Leave empty to keep the built-in title" />
          <label className="adm-label">Meta description <span className="adm-hint-inline">{(metaFile[path]?.description || "").length}/160 (120–160 ideal)</span></label>
          <textarea className="adm-input" name="description" rows={2} defaultValue={metaFile[path]?.description || ""} maxLength={320} placeholder="Leave empty to keep the built-in description" />
          <label className="adm-label">Canonical URL <span className="adm-hint-inline">empty = self-referencing {path}</span></label>
          <input className="adm-input" name="canonical" defaultValue={metaFile[path]?.canonical || ""} placeholder="Leave empty for the default canonical" />
          <label className="adm-label">Robots</label>
          <select className="adm-input" name="robots" defaultValue={metaFile[path]?.robots || "index-follow"}>
            <option value="index-follow">index, follow (default)</option>
            <option value="noindex-follow">noindex, follow</option>
            <option value="noindex-nofollow">noindex, nofollow</option>
            <option value="index-nofollow">index, nofollow</option>
          </select>
          <label className="adm-label">Open Graph title (social sharing)</label>
          <input className="adm-input" name="ogTitle" defaultValue={metaFile[path]?.ogTitle || ""} maxLength={120} placeholder="Leave empty to use the SEO title" />
          <label className="adm-label">Open Graph description</label>
          <textarea className="adm-input" name="ogDescription" rows={2} defaultValue={metaFile[path]?.ogDescription || ""} maxLength={320} placeholder="Leave empty to use the meta description" />
          <label className="adm-label">Social sharing image (Open Graph)</label>
          <input className="adm-input" name="ogImage" defaultValue={metaFile[path]?.ogImage || ""} placeholder="/uploads/… or absolute URL — leave empty for the page default" />
          <div className="adm-inline">
            <button className="adm-btn adm-btn-primary" type="submit">Save meta</button>
            {metaFile[path] && <button className="adm-btn adm-danger-btn" type="submit" formAction={removeMetaAction}>Remove meta override</button>}
          </div>
        </form>
      </div>

      {/* ===== every content field (city / service / fleet) ===== */}
      {spec ? (
        <PageBodyEditor path={path} groups={spec.groups} faqs={spec.faqs} saved={!!saved} versions={versions} hasDraft={hasDraft} />
      ) : (
        <div className="adm-panel">
          <h2>Page body</h2>
          {type === "blog" ? (
            <p className="adm-hint">
              Blog posts (including images inside the text) are edited in the{" "}
              <Link className="adm-link" href="/admin/blog">Blog editor</Link>.
            </p>
          ) : (
            <p className="adm-hint">
              This page&apos;s sections are edited in <Link className="adm-link" href="/admin/content">Site content</Link> (home / hubs / FAQ covers).
            </p>
          )}
        </div>
      )}
    </>
  );
}

function stateNameOf(path: string): string {
  const m = path.match(new RegExp("^/locations/([a-z]{2})/$"));
  if (!m) return "";
  const NAMES: Record<string, string> = { al: "Alabama", ak: "Alaska", az: "Arizona", ar: "Arkansas", ca: "California", co: "Colorado", ct: "Connecticut", de: "Delaware", fl: "Florida", ga: "Georgia", hi: "Hawaii", id: "Idaho", il: "Illinois", in_: "Indiana", ia: "Iowa", ks: "Kansas", ky: "Kentucky", la: "Louisiana", me: "Maine", md: "Maryland", ma: "Massachusetts", mi: "Michigan", mn: "Minnesota", ms: "Mississippi", mo: "Missouri", mt: "Montana", ne: "Nebraska", nv: "Nevada", nh: "New Hampshire", nj: "New Jersey", nm: "New Mexico", ny: "New York", nc: "North Carolina", nd: "North Dakota", oh: "Ohio", ok: "Oklahoma", or: "Oregon", pa: "Pennsylvania", ri: "Rhode Island", sc: "South Carolina", sd: "South Dakota", tn: "Tennessee", tx: "Texas", ut: "Utah", vt: "Vermont", va: "Virginia", wa: "Washington", wv: "West Virginia", wi: "Wisconsin", wy: "Wyoming" };
  return NAMES[m[1]] ?? "";
}

function legalSectionsFor(path: string): { heading: string; paras: string[] }[] {
  void path;
  return [];
}
