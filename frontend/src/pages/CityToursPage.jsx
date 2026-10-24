import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { PageIntro, SectionHeading, ExperienceCard, FaqList, BookingCta, Icon } from '../components/ExperienceUI';
import { cityTours, imagery, listSchema } from '../data/experienceCatalog';
import { faqGroups, faqSchema } from '../data/faqData';
export default function CityToursPage() {
  const faqs = faqGroups[1].items;
  return <div className="experience-page"><SEO title="UAE City Tours: Dubai, Abu Dhabi, Sharjah & RAK" description="Explore four emirates with Zuhd Tours. Dubai from AED 200, Abu Dhabi AED 250, Sharjah AED 160 and Ras Al Khaimah AED 260. Compare guided city tours." path="/dubai-city-tours" image={imagery.city} breadcrumbs={[{
      name: 'Home',
      path: '/'
    }, {
      name: 'City Tours',
      path: '/dubai-city-tours'
    }]} schema={[listSchema(cityTours), faqSchema(faqs)]} /><PageIntro eyebrow="BEYOND THE POSTCARD" title="Discover the UAE, city by city." description="Skylines and souks. Mosques and mountain roads. Guided journeys through Dubai, Abu Dhabi, Sharjah and Ras Al Khaimah." image={imagery.city} breadcrumbs={[["City Tours"]]}><a className="exp-btn exp-btn-gold" href="#city-tours">Choose your city <Icon /></a></PageIntro><section className="exp-section exp-sand" id="city-tours"><div className="container"><SectionHeading eyebrow="FOUR EMIRATES TO EXPLORE" title="Where would you like to go?" description="Compare the starting adult price and duration, then explore each route’s landmarks and pickup information." /><div className="exp-grid exp-grid-four">{cityTours.map(t => <ExperienceCard key={t.slug} tour={t} />)}</div><p className="exp-price-note">Private tours and paid attraction tickets are quoted separately. Confirm your pickup location and exact inclusions before booking.</p></div></section><section className="exp-section"><div className="container exp-city-benefits">{[['01', 'Make time for the details', 'Discover cultural districts, architectural landmarks and the everyday character of each city.'], ['02', 'A route that fits your day', 'Choose a half-day in Sharjah or spend a full day exploring Dubai, Abu Dhabi or Ras Al Khaimah.'], ['03', 'Want a private experience?', 'Tell us your group size and preferred stops. We can quote a private vehicle and customised route.']].map(([n, t, d]) => <article key={n}><span>{n}</span><h2>{t}</h2><p>{d}</p></article>)}</div></section><section className="exp-section exp-sand"><div className="container exp-faq-split"><div><span className="exp-eyebrow">PLAN YOUR DAY</span><h2>A little clarity before you explore.</h2><Link className="exp-text-link" to="/faqs">View all FAQs <Icon /></Link></div><FaqList items={faqs} /></div></section><BookingCta title="Your next city is waiting." /></div>;
}
