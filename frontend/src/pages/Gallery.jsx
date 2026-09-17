import React from 'react';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { site } from '../data/siteConfig';

const gallery=[
 {src:'/gallery/gallery-ai-desert-safari.png',title:'Desert Safari at Sunset',tag:'AI visual'},
 {src:'https://www.gulfdunestourism.com/assets/qatar-desert-safari-happy-guests-DNeJzmGf.webp',title:'Guests in the Desert',tag:'Guest experience'},
 {src:'/gallery/gallery-ai-guests.png',title:'Desert Camp Moments',tag:'AI visual'},
 {src:'https://www.gulfdunestourism.com/assets/qatar-desert-safari-guide-welcome-ZxujarL8.webp',title:'Safari Guide Experience',tag:'Guest experience'},
 {src:'https://www.gulfdunestourism.com/assets/qatar-dune-buggy-adventure-nkXM9pjb.webp',title:'Dune Buggy Adventure',tag:'Adventure'},
 {src:'/gallery/gallery-ai-dubai-desert-skyline.png',title:'Dubai Desert & Skyline',tag:'AI visual'},
 {src:'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=88',title:'Palm Jumeirah',tag:'Dubai'},
 {src:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=88',title:'Dubai Skyline',tag:'Dubai'},
];
export default function Gallery(){const {tx}=useLanguage();return <><SEO title="Gallery | Zuhd Tours" description="Explore Zuhd Tours desert safari, Dubai and guest experience gallery." path="/gallery" breadcrumbs={[{name:'Home',path:'/'},{name:'Gallery',path:'/gallery'}]}/><section className="gallery-hero"><div className="container"><span className="eyebrow">ZUHD TOURS</span><h1>{tx('Travel moments worth remembering.')}</h1><p>{tx('Browse desert adventures, Dubai scenes and guest-experience visuals.')}</p></div></section><section className="gallery-section"><div className="container"><div className="gallery-grid">{gallery.map((item,i)=><figure className={`gallery-card gallery-${i%5}`} key={item.src}><img src={item.src} alt={item.title} loading={i<3?'eager':'lazy'} onError={e=>{e.currentTarget.style.opacity='.2'}}/><figcaption><span>{tx(item.tag)}</span><strong>{tx(item.title)}</strong></figcaption></figure>)}</div></div></section><section className="gallery-cta"><div className="container gallery-cta-inner"><div><span className="eyebrow">{tx('PLAN YOUR EXPERIENCE')}</span><h2>{tx('Want to see the UAE with Zuhd Tours?')}</h2></div><a className="btn btn-primary" href={site.whatsapp} target="_blank" rel="noreferrer">{tx('Book on WhatsApp')} →</a></div></section></>}
