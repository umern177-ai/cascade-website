// Page content editor: FAQ sets (home, FAQs page extras, contact) and the
// headline copy of home/hubs. Empty fields fall back to the built-in copy.
import { getContent, Faq } from "@/lib/admin/store";
import { HOME_FAQS } from "@/lib/site-data";
import { saveContentAction } from "../../actions";
import { PencilRuler } from "lucide-react";

export default async function AdminContentPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const c = await getContent();

  const FaqSet = ({ prefix, title, hint, items }: { prefix: string; title: string; hint: string; items: Faq[] }) => (
    <div className="adm-panel">
      <h2>{title}</h2>
      <p className="adm-hint">{hint}</p>
      {items.map((f, i) => (
        <div key={i} className="adm-faqrow">
          <label className="adm-label">Q{i + 1}</label>
          <input className="adm-input" name={`${prefix}q${i}`} defaultValue={f.q} />
          <label className="adm-label">Answer</label>
          <textarea className="adm-input" name={`${prefix}a${i}`} rows={3} defaultValue={f.a} />
        </div>
      ))}
    </div>
  );

  const homeItems = c.homeFaqs ?? HOME_FAQS;
  const faqsExtra = c.faqsExtra ?? [];
  const contactItems = c.contactFaqs ?? (c.contactFaqs === undefined ? [] : []);

  return (
    <>
      <header className="adm-page-head">
        <div><h1>Page content</h1><p>FAQs and the headline copy of the main pages. Save re-validates the pages instantly.</p></div>
        <PencilRuler aria-hidden="true" />
      </header>
      {saved && <div className="adm-alert">Content saved — pages were re-validated.</div>}
      <form action={saveContentAction}>
        <FaqSet prefix="home" title="Home page FAQs" hint="Shown in the FAQ section of the home page (max 10)." items={homeItems.slice(0, 10)} />
        <FaqSet prefix="extra" title="FAQs page — extra questions" hint="These appear after the shared questions on /faqs/. Leave a row empty to delete it." items={faqsExtra.length ? faqsExtra : [{ q: "", a: "" }, { q: "", a: "" }]} />
        <FaqSet prefix="contact" title="Contact page FAQs" hint="The FAQ section under the booking form on /contact/. Empty rows are removed on save." items={contactItems.length ? contactItems : [{ q: "", a: "" }, { q: "", a: "" }]} />

        <div className="adm-panel">
          <h2>Home hero copy</h2>
          <label className="adm-label">Hero lead paragraph</label>
          <textarea className="adm-input" name="homeHeroLead" rows={3} defaultValue={c.homeHero?.lead ?? ""} placeholder="Built-in: “Some trips are more than just travel…”" />
          <label className="adm-label">Hero secondary paragraph</label>
          <textarea className="adm-input" name="homeHeroSub" rows={2} defaultValue={c.homeHero?.sub ?? ""} placeholder="Built-in: “From a 7-seat SUV to a full 56-seat motorcoach…”" />
        </div>

        <div className="adm-panel">
          <h2>Home heritage section</h2>
          <label className="adm-label">Heading</label>
          <input className="adm-input" name="heritageHeading" defaultValue={c.heritage?.heading ?? ""} placeholder="Built-in: Built on Punctuality, Honesty, and Hard Work" />
          <label className="adm-label">Paragraph</label>
          <textarea className="adm-input" name="heritageBody" rows={3} defaultValue={c.heritage?.body ?? ""} placeholder="Built-in: “Cascade Charter Bus started with one vehicle…”" />
        </div>

        <div className="adm-panel">
          <h2>Services hub heading</h2>
          <input className="adm-input" name="servicesHubHeading" defaultValue={c.servicesHub?.heading ?? ""} placeholder="Built-in H1 of /services/" />
          <label className="adm-label">Sub-line under the heading</label>
          <input className="adm-input" name="servicesHubSub" defaultValue={c.servicesHub?.sub ?? ""} />
          <h2 style={{ marginTop: 24 }}>Fleet hub heading</h2>
          <input className="adm-input" name="fleetHubHeading" defaultValue={c.fleetHub?.heading ?? ""} placeholder="Built-in H1 of /fleet/" />
          <label className="adm-label">Sub-line under the heading</label>
          <input className="adm-input" name="fleetHubSub" defaultValue={c.fleetHub?.sub ?? ""} />
        </div>

        <div className="adm-actionsbar">
          <button className="adm-btn adm-btn-primary" type="submit">Save all content</button>
        </div>
      </form>
    </>
  );
}
