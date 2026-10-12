import React from 'react';
import { Link } from 'react-router-dom';
import { enquiryLink, tourPath } from '../data/experienceCatalog';
import { useLanguage } from '../context/LanguageContext';

export function Icon({name='arrow',...props}) {
  const paths={arrow:<path d="M4 12h16m-6-6 6 6-6 6"/>,clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,pin:<><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,sun:<><circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/></>,moon:<path d="M20 14A8.5 8.5 0 0 1 10 4a9 9 0 1 0 10 10Z"/>,check:<path d="m5 12 4 4L19 6"/>,car:<><path d="m5 7 2-4h10l2 4 2 3v8H3v-8l2-3Zm0 0h14M6 18v3m12-3v3M6 12h2m8 0h2"/></>,chat:<><path d="M21 11a9 9 0 0 1-9 9c-2 0-3-.5-4-1l-6 2 2-6a9 9 0 1 1 17-4Z"/><path d="M8 11h8"/></>};
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]||paths.arrow}</svg>;
}
export function SectionHeading({eyebrow,title,description,link,linkText='View all experiences'}) {
  const {tx}=useLanguage();
  return <div className="exp-heading"><div><span className="exp-eyebrow">{tx(eyebrow)}</span><h2>{tx(title)}</h2>{description&&<p>{tx(description)}</p>}</div>{link&&<Link className="exp-text-link" to={link}>{tx(linkText)} <Icon/></Link>}</div>;
}
export function ExperienceCard({tour,compact=false}) {
  const {tx}=useLanguage();
  return <article className={`exp-card ${compact?'exp-card-compact':''}`}>
    <Link to={tourPath(tour)} className="exp-card-image" aria-label={`Explore ${tour.title}`}><img src={tour.image} alt={`${tour.title} — ${tour.location||'United Arab Emirates'}`} width="720" height="480" loading="lazy" decoding="async"/>{tour.badge&&<span className="exp-badge">{tx(tour.badge)}</span>}<span className="exp-image-arrow"><Icon/></span></Link>
    <div className="exp-card-body"><span className="exp-card-category">{tx(tour.category)}</span><h3><Link to={tourPath(tour)}>{tx(tour.title)}</Link></h3><p>{tx(tour.description||tour.subtitle)}</p><div className="exp-card-meta"><Icon name="clock"/>{tx(tour.duration)}</div><div className="exp-card-foot"><div>{tour.amount?<><small>{tx('From')}</small><strong>AED {tour.amount}</strong><span>{tx(tour.priceUnit||'starting fare')}</span></>:<strong>{tx(tour.price||'Request a quote')}</strong>}</div><Link className="exp-card-link" to={tourPath(tour)}>{tx('View details')} <Icon/></Link></div></div>
  </article>;
}
export function FaqList({items}) {const {tx}=useLanguage();return <div className="exp-faq-list">{items.map(([q,a])=><details key={q}><summary>{tx(q)}<span aria-hidden="true">+</span></summary><p>{tx(a)}</p></details>)}</div>;}
export function PageIntro({eyebrow,title,description,image,children,breadcrumbs=[]}) {
  const {tx}=useLanguage();return <section className="exp-page-intro">{image&&<img className="exp-intro-image" src={image} alt="" fetchpriority="high"/>}<div className="container exp-intro-copy"><nav className="exp-breadcrumbs" aria-label="Breadcrumb"><Link to="/">{tx('Home')}</Link>{breadcrumbs.map(([label,path])=><React.Fragment key={label}><span>/</span>{path?<Link to={path}>{tx(label)}</Link>:<span aria-current="page">{tx(label)}</span>}</React.Fragment>)}</nav><span className="exp-eyebrow">{tx(eyebrow)}</span><h1>{tx(title)}</h1><p>{tx(description)}</p>{children}</div></section>;
}
export function BookingCta({tour,title='Let’s plan your next great day.'}) {return <section className="exp-cta"><div className="container exp-cta-inner"><div><span className="exp-eyebrow">A LITTLE PLANNING. A LOT TO REMEMBER.</span><h2>{title}</h2><p>Send your date, group size and pickup point. We’ll help with the details.</p></div><a className="exp-btn exp-btn-gold" href={enquiryLink(tour||{title:'a Dubai experience'})} target="_blank" rel="noreferrer">Talk to Zuhd Tours <Icon name="chat"/></a></div></section>;}
