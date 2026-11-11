// Structured city page: PREMIUM design with handcrafted feel.
// Photo hero with gradient overlay, amber accent lines, numbered destination
// cards, step-connected booking flow, rich fleet showcase, nearby-city grid.
import Link from "next/link";
import Image from "next/image";
import { Phone, ArrowRight, Check } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqAccordion from "@/components/Faq";
import BookingProcess from "@/components/BookingProcess";
import { VEHICLES } from "@/lib/fleet-data";
import { keptCities, isKept, stateName } from "@/lib/locations";
import { SITE } from "@/lib/site-data";
import type { CityPageData } from "@/lib/city-page-data";

const SERVICE_IMAGES: Record<string, string> = {
  "corporate-transportation": "/images/services/corp.webp",
  "wedding-transportation": "/images/services/wed.webp",
  "school-transportation": "/images/services/school.webp",
  "sports-team-transportation": "/images/services/sport.webp",
  "airport-transfer": "/images/services/airport.webp",
  "sightseeing-tour-bus": "/images/services/multi.webp",
  "church-religious-transportation": "/images/services/school.webp",
  "band-tour-bus": "/images/fleet/sleeper.jpg",
};

export default function StructuredCityPage({ data, state }: { data: CityPageData; state: string }) {
  const name = data.city;
  const stName = stateName(state);
  const stAbbr = state.toUpperCase();
  const pickup = `${name}, ${stAbbr}`;

  const serviceSchema = { "@context": "https://schema.org", "@type": "Service", name: `Charter Bus Rental in ${name}`, areaServed: { "@type": "City", name, containedInPlace: { "@type": "State", name: stName } }, provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url, telephone: SITE.phoneDisplay } };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: data.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  const vehicles = data.vehicles.map((v) => ({ ...v, meta: VEHICLES.find((x) => x.slug === v.slug) })).filter((v) => v.meta);
  const nearbyItems = (data.nearby.items || []).map((n) => {
    const kept = keptCities(state).find((c) => c.city.toLowerCase() === n.city.toLowerCase()) || keptCities(state).find((c) => c.city.startsWith(n.city));
    return { ...n, path: kept && isKept(state, kept.slug) ? `/locations/${state}/${kept.slug}/` : null };
  });

  return (
    <main className="bg-white min-vh-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Breadcrumbs items={[{label:'Home',href:'/'},{label:'Locations',href:'/locations/'},{label:stName,href:`/locations/${state}/`},{label:name}]} />

      <section className="city-hero-premium">
        <Image src="/hero-bus.webp" alt="" className="hero-photo" width={1600} height={600} priority sizes="100vw" style={{position:'absolute',inset:0,objectFit:'cover',width:'100%',height:'100%'}} />
        <div className="hero-accent" aria-hidden="true" />
        <div className="hero-content">
          <span className="hero-eyebrow" style={{color:'var(--fleet-orange)',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.15em',fontSize:'0.82rem',marginBottom:'1rem',display:'inline-flex',alignItems:'center',gap:'0.75rem'}}>
            <span style={{display:'inline-block',width:'2.5rem',height:'2px',background:'var(--fleet-orange)'}} aria-hidden="true"></span>
            Charter Bus Rental
          </span>
          <h1 className="hero-title" style={{fontSize:'clamp(2rem,5.5vw,3.5rem)',fontWeight:800,color:'#fff',marginBottom:'1.25rem',lineHeight:1.12,maxWidth:720}}>
            {`Charter Bus Rental in ${name}, ${stAbbr}`}
          </h1>
          <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',marginTop:'1.75rem'}}>
            <a href="/contact/" className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm" data-pickup={pickup} data-source={`city:${state}:${data.slug}`} rel="nofollow">GET A QUOTE</a>
            <a className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold" href={`tel:${SITE.phoneTel}`}><Phone size={16} aria-hidden="true" style={{marginRight:'8px'}} /> {SITE.phoneDisplay}</a>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="container" style={{maxWidth:880}}>
          <div className="intro-premium">
            <h2 className="fw-bold mb-2" style={{fontSize:'1.35rem',color:'var(--fleet-black)'}}>{data.h1}</h2>
            <p className="mb-0" style={{color:'#555'}}>{data.heroIntro}</p>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container py-2">
          <div className="section-head-premium" style={{textAlign:'center',marginBottom:'2rem'}}>
            <span className="eyebrow" style={{color:'#8a5c00',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',fontSize:'0.78rem',display:'inline-block',marginBottom:'0.5rem'}}>What We Do</span>
            <h2 className="fw-bold" style={{fontSize:'clamp(1.5rem,3.5vw,2rem)',color:'var(--fleet-black)'}}>{data.servicesHeading}</h2>
            <div style={{width:'48px',height:'3px',background:'var(--fleet-orange)',margin:'0.75rem auto 0',borderRadius:'2px'}} />
          </div>
          <div className="vstack gap-4">
            {data.services.map((sv) => {
              const slug = sv.href.replace('/services/','').replace('/','');
              const img = SERVICE_IMAGES[slug];
              return (
                <div key={sv.title} style={{
                  display:'flex', flexDirection:'row', alignItems:'stretch',
                  borderRadius:'1rem', overflow:'hidden',
                  boxShadow:'0 2px 10px rgba(0,0,0,0.07)', background:'#fff',
                  minHeight:'260px',
                }}>
                  {img && (
                    <div style={{
                      flex:'0 0 38%',
                      position:'relative',
                      overflow:'hidden',
                      minWidth:'220px'
                    }}>
                      <Image src={img} alt={sv.title + ' - Cascade Charter Bus'}
                        fill={true}
                        sizes='(max-width:768px) 100vw, 38vw'
                        style={{objectFit:'contain', width:'100%', height:'100%'}}
                      />
                    </div>
                  )}
                  <div style={{
                    flex:'1 1 62%',
                    padding:'1.5rem 2rem',
                    display:'flex', flexDirection:'column', justifyContent:'center'
                  }}>
                    <h3 style={{fontSize:'1.05rem',fontWeight:700,color:'var(--fleet-black)',marginBottom:'0.6rem'}}>{sv.title}</h3>
                    <p style={{fontSize:'0.9rem',color:'#5a5a5a',lineHeight:1.7,marginBottom:'0.75rem'}}>{sv.text}</p>
                    <Link href={sv.href} style={{color:'var(--fleet-orange)',fontWeight:700,fontSize:'0.85rem',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:'0.35rem'}}>
                      Learn More <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-2">
          <div className="section-head-premium" style={{textAlign:'center',marginBottom:'2rem'}}>
            <span className="eyebrow" style={{color:'#8a5c00',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',fontSize:'0.78rem',display:'inline-block',marginBottom:'0.5rem'}}>Our Fleet</span>
            <h2 className="fw-bold" style={{fontSize:'clamp(1.5rem,3.5vw,2rem)',color:'var(--fleet-black)'}}>{data.vehiclesHeading}</h2>
            <div style={{width:'48px',height:'3px',background:'var(--fleet-orange)',margin:'0.75rem auto 0',borderRadius:'2px'}} />
          </div>
          <div className="row g-3 fleet-slider-m">
            {vehicles.map((v) => (
              <div className="col-lg-3 col-md-4 col-6" key={v.slug}>
                <a href={`/fleet/${v.slug}/`} style={{textDecoration:'none',display:'flex',flexDirection:'column',height:'100%',borderRadius:'0.875rem',overflow:'hidden',background:'#fff',boxShadow:'0 2px 8px rgba(0,0,0,0.06)',transition:'transform 0.3s,box-shadow 0.3s'}} className="hover-lift">
                  <Image src={v.meta!.photo} alt={v.meta!.cardName} width={420} height={240} style={{width:'100%',height:'160px',objectFit:'cover',transition:'transform 0.4s'}} sizes="(max-width:768px) 76vw, 25vw" />
                  <div style={{padding:'0.875rem 1rem 1rem',flexGrow:1,display:'flex',flexDirection:'column'}}>
                    <h3 style={{fontWeight:700,color:'var(--fleet-black)',marginBottom:'0.25rem',fontSize:'1rem'}}>{v.meta!.cardName}</h3>
                    <span className="badge rounded-pill px-2 py-1" style={{fontSize:'0.7rem',fontWeight:700,color:'var(--fleet-black)',background:'var(--fleet-orange)',alignSelf:'flex-start',marginBottom:'0.5rem'}}>{v.meta!.passengers}</span>
                    <p style={{fontSize:'0.8rem',color:'#666',margin:0}}>{v.reason}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container py-2">
          <div className="section-head-premium" style={{textAlign:'center',marginBottom:'1.5rem'}}>
            <span className="eyebrow" style={{color:'#8a5c00',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',fontSize:'0.78rem',display:'inline-block',marginBottom:'0.5rem'}}>Places We Go</span>
            <h2 className="fw-bold" style={{fontSize:'clamp(1.5rem,3.5vw,2rem)',color:'var(--fleet-black)'}}>{data.destinationsHeading}</h2>
            <div style={{width:'48px',height:'3px',background:'var(--fleet-orange)',margin:'0.75rem auto 0',borderRadius:'2px'}} />
          </div>
          <p style={{fontSize:'0.8rem',color:'#888',textAlign:'center',marginBottom:'1.5rem'}}>Places on this page: {data.mapPins.join(' · ')}</p>
          <div className="row g-4">
            {data.destinations.map((d, i) => (
              <div className={data.destinations.length <= 3 ? 'col-12' : 'col-md-6'} key={d.name}>
                <div style={{border:'1px solid rgba(245,160,2,0.15)',borderRadius:'0.75rem',background:'#fff',boxShadow:'0 2px 6px rgba(0,0,0,0.05)',padding:'1.25rem 1.5rem',height:'100%',position:'relative'}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:'0.75rem'}}>
                    <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:'2rem',height:'2rem',borderRadius:'0.5rem',background:'var(--fleet-orange)',color:'var(--fleet-black)',fontWeight:800,fontSize:'0.9rem',flexShrink:0}}>{i+1}</span>
                    <div style={{width:'100%'}}>
                      <h3 style={{fontSize:'1rem',fontWeight:700,color:'var(--fleet-black)',marginBottom:'0.4rem'}}>{d.name}</h3>
                      <p style={{fontSize:'0.88rem',color:'#5a5a5a',lineHeight:1.65,marginBottom:'0.75rem',borderLeft:'3px solid var(--fleet-orange)',paddingLeft:'0.75rem'}}>{d.tip}</p>
                    </div>
                  </div>
                  <div style={{borderLeft:'3px solid rgba(245,160,2,0.2)',padding:'0.5rem 0.75rem',background:'rgba(245,160,2,0.05)',borderRadius:'0 0.5rem 0.5rem 0',fontSize:'0.82rem',lineHeight:1.5,marginTop:'0.5rem'}}>
                    <strong style={{color:'var(--fleet-black)'}}>Bus drop-off tip: </strong>
                    <span style={{color:'#5a5a5a'}}>{d.tip}</span>
                  </div>
                </div>
              </div>
          ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-2">
          <div className="section-head-premium" style={{textAlign:'center',marginBottom:'1.5rem'}}>
            <span className="eyebrow" style={{color:'#8a5c00',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',fontSize:'0.78rem',display:'inline-block',marginBottom:'0.5rem'}}>Location</span>
            <h2 className="fw-bold" style={{fontSize:'clamp(1.5rem,3.5vw,2rem)',color:'var(--fleet-black)'}}>{name} on the Map</h2>
            <div style={{width:'48px',height:'3px',background:'var(--fleet-orange)',margin:'0.75rem auto 0',borderRadius:'2px'}} />
          </div>
          <div style={{borderRadius:'0.875rem',overflow:'hidden',border:'1px solid rgba(245,160,2,0.15)',height:'400px',boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
            <iframe title={`Map of ${name}, ${stName}`} src={`https://www.google.com/maps?q=${encodeURIComponent(name+', '+stAbbr)}&z=10&output=embed`} width="100%" height="100%" style={{border:0}} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container py-2">
          <div className="section-head-premium" style={{textAlign:'center',marginBottom:'2rem'}}>
            <span className="eyebrow" style={{color:'#8a5c00',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',fontSize:'0.78rem',display:'inline-block',marginBottom:'0.5rem'}}>Simple Process</span>
            <h2 className="fw-bold" style={{fontSize:'clamp(1.5rem,3.5vw,2rem)',color:'var(--fleet-black)'}}>How Booking Works</h2>
            <div style={{width:'48px',height:'3px',background:'var(--fleet-orange)',margin:'0.75rem auto 0',borderRadius:'2px'}} />
          </div>
          <div className="row g-4 justify-content-center mb-3">
            {[
              {t:"Call or Request Online",d:`Send the form below or call ${SITE.phoneDisplay}. Reply in 15 min.`},
              {t:"Custom Quote",d:"Itinerary-specific. One final price: gratuity, tolls, taxes included."},
              {t:"Relax and Ride",d:"Driver arrives early. Dispatch stays reachable for the whole trip."}
            ].map((s,i)=>(
              <div className="col-md-4" key={s.t}>
                <div style={{textAlign:'center',padding:'0 1rem'}}>
                  <div style={{width:'3.5rem',height:'3.5rem',borderRadius:'50%',background:'var(--fleet-orange)',color:'var(--fleet-black)',fontWeight:800,fontSize:'1.1rem',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 0.75rem',boxShadow:'0 4px 10px rgba(245,160,2,0.25)'}}>{i+1}</div>
                  <h3 style={{fontWeight:700,color:'var(--fleet-black)',fontSize:'1rem',marginBottom:'0.5rem'}}>{s.t}</h3>
                  <p style={{fontSize:'0.85rem',color:'#5a5a5a',lineHeight:1.55}}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div style={{padding:'1.25rem',borderRadius:'0.875rem',background:'rgba(245,160,2,0.04)',border:"1px solid rgba(245,160,2,0.18)"}}>
                <p style={{fontWeight:700,color:'var(--fleet-black)',fontSize:'0.95rem',marginBottom:'0.75rem'}}>Fill the form with the correct itinerary and your quote comes back final</p>
                <div className="row g-1">
                  {["Pickup address: hotel, venue, office, or home","Pickup time and date (and the return time for round trips)","Destination, plus every stop in between","Arrival or event end time","Headcount, luggage and extras: gear, children, accessibility"].map((t)=>(
                    <div className="col-md-6" key={t.slice(0,30)}>
                      <p className="small mb-0 d-flex align-items-start gap-2" style={{color:'#555'}}><Check size={14} style={{color:'var(--fleet-orange)',marginTop:'3px',flexShrink:0}} aria-hidden="true" /><span>{t}</span></p>
                    </div>
                  ))}
                </div>
                <div style={{textAlign:'center',marginTop:'1rem'}}>
                  <a href="/contact/" className="btn btn-primary rounded-pill px-4 py-2 fw-bold" data-pickup={pickup} data-source="booking-process" rel="nofollow">REQUEST A QUOTE</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-2">
          <div className="section-head-premium" style={{textAlign:'center',marginBottom:'1.5rem'}}>
            <span className="eyebrow" style={{color:'#8a5c00',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',fontSize:'0.78rem',display:'inline-block',marginBottom:'0.5rem'}}>Nearby</span>
            <h2 className="fw-bold" style={{fontSize:'clamp(1.5rem,3.5vw,2rem)',color:'var(--fleet-black)'}}>{data.nearby.heading}</h2>
            <div style={{width:'48px',height:'3px',background:'var(--fleet-orange)',margin:'0.75rem auto 0',borderRadius:'2px'}} />
          </div>
          <div className="row g-3">
            {data.nearby.plainText ? (
              <p className="text-muted mb-0" style={{maxWidth:760}}>{data.nearby.plainText}</p>
            ) : nearbyItems.map((n)=>(
              <div className="col-md-4 col-6" key={n.city}>
                {n.path ? (
                  <Link href={n.path} style={{textDecoration:'none',display:'flex',alignItems:'center',justifyContent:'space-between',border:'1px solid rgba(245,160,2,0.15)',borderRadius:'0.75rem',padding:'1rem 1.25rem',background:'#fff',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                    <span style={{fontWeight:700,color:'var(--fleet-black)',fontSize:'0.92rem'}}>{n.city}</span>
                    <span style={{color:'var(--fleet-orange)',fontWeight:600}} aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <span style={{display:'flex',alignItems:'center',justifyContent:'space-between',border:'1px solid rgba(245,160,2,0.1)',borderRadius:'0.75rem',padding:'1rem 1.25rem',background:'rgba(245,160,2,0.04)'}}>
                    <span style={{fontWeight:700,fontSize:'0.92rem',color:'#444'}}>{n.city}</span>
                    {n.miles && <span className="text-muted" style={{fontSize:'0.78rem'}}>{n.miles}</span>}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container py-2">
          <div className="section-head-premium" style={{textAlign:'center',marginBottom:'1.5rem'}}>
            <span className="eyebrow" style={{color:'#8a5c00',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',fontSize:'0.78rem',display:'inline-block',marginBottom:'0.5rem'}}>FAQ</span>
            <h2 className="fw-bold" style={{fontSize:'clamp(1.5rem,3.5vw,2rem)',color:'var(--fleet-black)'}}>{data.faqsHeading}</h2>
            <div style={{width:'48px',height:'3px',background:'var(--fleet-orange)',margin:'0.75rem auto 0',borderRadius:'2px'}} />
          </div>
          <div className="row justify-content-center"><div className="col-lg-9"><FaqAccordion faqs={data.faqs} idPrefix={`city-${state}-${data.slug}`} /></div></div>
        </div>
      </section>

      <section style={{background:'var(--fleet-black)'}}>
        <div className="container text-center py-5">
          <h2 className="display-6 fw-bold mb-2" style={{color:'#fff'}}>{`Ready to Book Your ${name} Charter Bus?`}</h2>
          <p style={{fontSize:'0.95rem',color:'#ccc',marginBottom:'1.5rem'}}>Fast, final quote. Gratuity, tolls and taxes included. Dispatch answers around the clock.</p>
          <div style={{display:'flex',justifyContent:'center',gap:'1rem',flexWrap:'wrap'}}>
            <a href="/contact/" className="btn btn-primary rounded-pill px-5 py-3 fw-bold btn-lg" data-pickup={pickup} data-source={`city-cta:${state}:${data.slug}`} rel="nofollow">GET A FREE QUOTE</a>
            <a className="btn btn-outline-light rounded-pill px-5 py-3 fw-bold btn-lg" href={`tel:${SITE.phoneTel}`}>CALL {SITE.phoneDisplay}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
