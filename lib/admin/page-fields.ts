// THE field map for the WordPress-style page editor: for a given path this
// module enumerates EVERY text field the page actually renders, prefilled
// with its existing value. Field keys are consumed by the live page
// components (PremiumCityPage / PremiumServicePage / PremiumFleetPage) as
// overrides over the built-in copy — see the `f(key)` helpers there.
import "server-only";
import type { PageBody } from "@/lib/admin/store";

export type FieldDef = { key: string; label: string; kind: "input" | "textarea"; value: string };
export type FieldGroup = { heading: string; fields: FieldDef[] };
export type PageFieldsSpec = { groups: FieldGroup[]; faqs: Faq[] };
export type Faq = { q: string; a: string };

const text = (key: string, label: string, value: string, kind: "input" | "textarea" = "input"): FieldDef => ({
  key,
  label,
  kind,
  value: value ?? "",
});
const texta = (key: string, label: string, value: string, kind: "input" | "textarea" = "textarea"): FieldDef => text(key, label, value, kind);


/* ---------------- city page (710 pages) ---------------- */
/* data: CityPageData — hero, facts?, services[], vehicles[] heading+reasons,
   destinations[] (name/text/tip), faqs, ctaHeading, section headings. */
export function cityFields(
  data: {
    servicesHeading: string;
    services: { title: string; text: string }[];
    vehiclesHeading: string;
    destinationsHeading: string;
    destinations: { name: string; text: string; tip: string }[];
    faqsHeading: string;
    faqs: { q: string; a: string }[];
    ctaHeading: string;
    heroIntro: string;
    h1View: string;
  },
  existing?: PageBody
): PageFieldsSpec {
  const f = existing?.fields ?? {};
  const g = (heading: string, fields: FieldDef[]): FieldGroup => ({ heading, fields });
  return {
    groups: [
      g("Hero", [
        text("h1", "Hero H1", f.h1 ?? data.h1View),
        text("intro", "Hero intro paragraph (lead)", f.intro ?? data.heroIntro, "textarea"),
      ]),
      g("Services section", [
        text("servicesHeading", "Section heading", f.servicesHeading ?? data.servicesHeading),
        ...data.services.map((sv, i) =>
          text(`svc${i}Text`, `${sv.title} — text`, f[`svc${i}Text`] ?? sv.text, "textarea")
        ),
      ]),
      g("Fleet section", [text("vehiclesHeading", "Section heading", f.vehiclesHeading ?? data.vehiclesHeading)]),
      g("Destinations section", [
        text("destinationsHeading", "Section heading", f.destinationsHeading ?? data.destinationsHeading),
        ...data.destinations
          .slice(0, 8)
          .flatMap((d, i) => [
            text(`dest${i}Text`, `${d.name} — text`, f[`dest${i}Text`] ?? d.text, "textarea"),
            text(`dest${i}Tip`, `${d.name} — driver tip`, f[`dest${i}Tip`] ?? d.tip, "textarea"),
          ]),
      ]),
      g("FAQ section", [text("faqsHeading", "Section heading", f.faqsHeading ?? data.faqsHeading)]),
      g("Footer CTA", [text("ctaHeading", "CTA heading", f.ctaHeading ?? data.ctaHeading)]),
    ],
    faqs: existing?.faqs ?? data.faqs,
  };
}

/* ---------------- service page (12 pages) ---------------- */
/* data: SERVICE_META + FAQ list. Rendered copy: eyebrow, h1, intro, faqs. */
export function serviceFields(
  data: { h1: string; intro: string; eyebrow: string },
  faqs: { q: string; a: string }[],
  existing?: PageBody
): PageFieldsSpec {
  const f = existing?.fields ?? {};
  return {
    groups: [
      {
        heading: "Hero",
        fields: [
          text("eyebrow", "Eyebrow line", f.eyebrow ?? data.eyebrow),
          text("h1", "Page H1", f.h1 ?? data.h1),
          text("intro", "Intro paragraphs", f.intro ?? data.intro, "textarea"),
        ],
      },
    ],
    faqs: existing?.faqs ?? faqs,
  };
}

/* ---------------- fleet page (7 pages) ---------------- */
/* data: vehicle record from lib/fleet-data. Rendered copy: h1+em, tagline
   (section h2), intro paragraph, use cases (3× title+text — plus the built-in
   3), planning tips (4), features list, why-choose lines. */
export function fleetFields(
  data: {
    tagline: string;
    intro: string;
    features: string[];
    whyChoose: string[];
    useCases: { title: string; text: string }[];
    planningTips: string[];
  },
  existing?: PageBody
): PageFieldsSpec {
  const f = existing?.fields ?? {};
  return {
    groups: [
      {
        heading: "What this vehicle is",
        fields: [
          text("tagline", "Section heading (under the eyebrow)", f.tagline ?? data.tagline),
          text("intro", "Intro paragraph", f.intro ?? data.intro, "textarea"),
        ],
      },
      {
        heading: "On-board features",
        fields: data.features.map((feat, i) => text(`feat${i}`, `Feature ${i + 1}`, f[`feat${i}`] ?? feat)),
      },
      {
        heading: "Real trips (use cases)",
        fields: data.useCases.flatMap((u, i) => [
          text(`useCase${i}Title`, `Use case ${i + 1} — title`, f[`useCase${i}Title`] ?? u.title),
          text(`useCase${i}Text`, `Use case ${i + 1} — text`, f[`useCase${i}Text`] ?? u.text, "textarea"),
        ]),
      },
      {
        heading: "Why groups choose it",
        fields: data.whyChoose.map((w, i) => text(`why${i}`, `Reason ${i + 1}`, f[`why${i}`] ?? w, "textarea")),
      },
      {
        heading: "Planning tips",
        fields: data.planningTips.map((t, i) => text(`tip${i}`, `Tip ${i + 1}`, f[`tip${i}`] ?? t, "textarea")),
      },
    ],
    faqs: existing?.faqs ?? [],
  };
}
/* ---------------- about page ---------------- */
export function aboutFields(
  data: { h1: string; lead: string; standards: { title: string; text: string }[]; facts: { dt: string; dd: string }[] },
  existing?: PageBody
): PageFieldsSpec {
  const f = existing?.fields ?? {};
  return {
    groups: [
      { heading: "Intro", fields: [text("h1", "Page H1", f.h1 ?? data.h1), text("intro", "Lead", f.intro ?? data.lead, "textarea")] },
      { heading: "What sets us apart", fields: data.standards.flatMap((s, i) => [
        text("standards" + i + "Title", s.title + " — title", f["standards" + i + "Title"] ?? s.title),
        text("standards" + i + "Text", s.title + " — text", f["standards" + i + "Text"] ?? s.text, "textarea"),
      ]) },
      { heading: "Facts strip", fields: data.facts.map((x, i) => text("fact" + i, "Fact " + (i + 1), f["fact" + i] ?? x.dt + " = " + x.dd)) },
    ],
    faqs: existing?.faqs ?? [],
  };
}

/* ---------------- contact page ---------------- */
export function contactFields(
  data: { h1: string; lead: string },
  existing?: PageBody
): PageFieldsSpec {
  const f = existing?.fields ?? {};
  return {
    groups: [
      { heading: "Hero", fields: [
        text("h1", "Page H1", f.h1 ?? data.h1),
        text("intro", "Lead", f.intro ?? data.lead, "textarea"),
      ]},
    ],
    faqs: existing?.faqs ?? [],
  };
}

/* ---------------- locations hub ---------------- */
export function locationsHubFields(
  data: { h1: string; lead: string },
  existing?: PageBody
): PageFieldsSpec {
  const f = existing?.fields ?? {};
  return {
    groups: [
      { heading: "Hero", fields: [
        text("h1", "Page H1", f.h1 ?? data.h1),
        text("intro", "Lead", f.intro ?? data.lead, "textarea"),
      ]},
    ],
    faqs: existing?.faqs ?? [],
  };
}

/* ---------------- state page ---------------- */
export function stateFields(
  data: { h1: string; lead: string; reliableParas: string[] },
  existing?: PageBody
): PageFieldsSpec {
  const f = existing?.fields ?? {};
  return {
    groups: [
      { heading: "Hero", fields: [
        text("h1", "Page H1", f.h1 ?? data.h1),
        text("intro", "Lead", f.intro ?? data.lead, "textarea"),
      ]},
      { heading: "Reliable transportation section", fields: data.reliableParas.map((t, i) => text("para" + i, "Paragraph " + (i + 1), f["para" + i] ?? t, "textarea")) },
    ],
    faqs: existing?.faqs ?? [],
  };
}

/* ---------------- legal pages ---------------- */
export function legalFields(
  data: { sections: { heading: string; paras: string[] }[] },
  existing?: PageBody
): PageFieldsSpec {
  const groups: FieldGroup[] = [
    { heading: "Long-form content", fields: data.sections.map((sec, i) => {
      const NL = String.fromCharCode(10);
      return text("sec" + i, "Section " + (i + 1) + ": " + sec.heading, sec.paras.join(NL + NL), "textarea");
    }) },
  ];
  const f = existing?.fields ?? {};
  return {
    groups: groups.map((g) => ({ heading: g.heading, fields: g.fields.map((fd) => ({ key: fd.key, label: fd.label, kind: "textarea" as const, value: f[fd.key] ?? fd.value })) })),
    faqs: [],
  };
}

/* ---------------- home page ---------------- */
export function homeFields(
  data: { h1A: string; h1B: string; lead: string; sub: string; fleetH: string; fleetSub: string; servicesH: string; servicesSub: string; tripsH: string; stepsH: string; ctaH: string; ctaP: string; factLabels: string[]; factValues: string[] },
  existing?: PageBody
): PageFieldsSpec {
  const f = existing?.fields ?? {};
  return {
    groups: [
      { heading: "Hero", fields: [
        text("h1", "Hero H1 — line 1 (plain)", f.h1 ?? data.h1A),
        text("h1line2", "Hero H1 — line 2 (gold)", f.h1line2 ?? data.h1B),
        text("intro", "Hero lead", f.intro ?? data.lead, "textarea"),
        text("sub", "Hero small paragraph", f.sub ?? data.sub, "textarea"),
      ]},
      { heading: "Facts strip", fields: data.factLabels.map((l, i) => text("fact" + i, "Fact " + (i + 1) + " (value = label)", f["fact" + i] ?? (data.factValues[i] + "=" + l))) },
      { heading: "Fleet showcase", fields: [text("fleetH", "Heading", f.fleetH ?? data.fleetH), text("fleetSub", "Sub-line", f.fleetSub ?? data.fleetSub, "textarea")] },
      { heading: "Services showcase", fields: [text("servicesH", "Heading", f.servicesH ?? data.servicesH), text("servicesSub", "Sub-line", f.servicesSub ?? data.servicesSub, "textarea")] },
      { heading: "Four ways to book", fields: [text("tripsH", "Heading", f.tripsH ?? data.tripsH)] },
      { heading: "How to book in 4 steps", fields: [text("stepsH", "Heading", f.stepsH ?? data.stepsH)] },
      { heading: "Footer CTA", fields: [text("ctaH", "CTA heading", f.ctaH ?? data.ctaH), text("ctaP", "CTA line", f.ctaP ?? data.ctaP, "textarea")] },
    ],
    faqs: existing?.faqs ?? [],
  };
}

/* ---------------- about page ---------------- */
/* ---------------- contact page ---------------- */
/* ---------------- locations hub ---------------- */
/* ---------------- state page ---------------- */
/* ---------------- legal pages ---------------- */
