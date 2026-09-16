import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { site } from '../data/siteConfig';
import { useLanguage } from '../context/LanguageContext';

const tourCards=[
  {title:'Dubai City Tour',kicker:'CITY TOUR',path:'/tours/dubai-city-tour',image:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=92',text:'See Dubai’s iconic skyline, historic districts, waterfront areas and famous landmarks with a flexible guided route.',points:['Dubai landmarks','Old Dubai & souks','Flexible pickup']},
  {title:'Abu Dhabi City Tour',kicker:'CITY TOUR',path:'/tours/abu-dhabi-city-tour',image:'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1800&q=92',text:'Explore Abu Dhabi’s major cultural and city highlights with a comfortable sightseeing experience.',points:['Grand Mosque','Corniche & city views','Cultural highlights']},
  {title:'Private Tours',kicker:'PRIVATE EXPERIENCE',path:'/private-tours',image:'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1800&q=92',text:'Create a private itinerary around your schedule, preferred attractions, vehicle and group.',points:['Private vehicle','Flexible itinerary','Personalised support']},
  {title:'Desert Safari',kicker:'DESERT EXPERIENCE',path:'/desert-safari-dubai-tours',image:'https://images.unsplash.com/photo-1717031578847-6b7fd6a94724?auto=format&fit=crop&w=1800&q=92',text:'Dune bashing, camel ride, sandboarding, BBQ dinner and Bedouin Oasis entertainment in one experience.',points:['45 min dune bashing','Camel ride & sandboarding','BBQ buffet & shows']},
  {title:'Dhow Cruise',kicker:'WATER EXPERIENCE',path:'/tours/private-dhow-cruise-dubai',image:'https://images.unsplash.com/photo-1721797274530-6f5e612f45f9?auto=format&fit=crop&w=1800&q=92',text:'Enjoy Dubai waterfront views aboard a traditional dhow with private arrangements available.',points:['Waterfront views','Traditional dhow','Private arrangements']},
  {title:'Tour Guide Service',kicker:'TRAVEL SUPPORT',path:'/tour-guides',image:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=92',text:'Arrange experienced tour-guide support for sightseeing days, private tours and custom travel plans.',points:['Sightseeing support','Private tours','Custom guidance']},
  {title:'Transport Services',kicker:'TRANSPORT',path:'/transport-services',image:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1800&q=92',text:'SUV cars, private cars, vans and buses for tours, airport transfers, groups and events.',points:['SUV & private cars','Vans & buses','Group transport']},
  {title:'Parks Tickets',kicker:'TICKETS & ATTRACTIONS',path:'/parks-tickets',image:'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1800&q=92',text:'Get help arranging current tickets for theme parks, water parks and family attractions across Dubai and the UAE.',points:['Theme parks','Water parks','Family attractions']},
];

export default function ToursPage(){
  const {tx}=useLanguage();
  return <>
    <SEO title="Dubai & UAE Tours" description="Dubai city tours, Abu Dhabi city tours, private tours, desert safari, dhow cruise, tour guides, transport services and parks tickets." path="/tours" breadcrumbs={[{name:'Home',path:'/'},{name:'Tours',path:'/tours'}]}/>
    <section className="tours-hero">
      <div className="tours-hero-bg"/>
      <div className="container tours-hero-content">
        <div className="eyebrow">ZUHD TOURS • DUBAI & UAE</div>
        <h1>{tx('Choose Your Experience')}</h1>
        <p>{tx('City tours, desert adventures, private experiences, cruises, guides, transport and attraction tickets — all in one place.')}</p>
      </div>
    </section>

    <section className="section tours-directory">
      <div className="container">
        <div className="section-head tours-directory-head">
          <div><div className="eyebrow dark">{tx('OUR TOURS & SERVICES')}</div><h2>{tx('Explore Tours')}</h2></div>
          <a className="view-all" href={site.whatsapp} target="_blank" rel="noreferrer">{tx('Need a custom tour?')} →</a>
        </div>
        <div className="tours-directory-grid">
          {tourCards.map(card=><article className="directory-card" key={card.title}>
            <Link to={card.path} className="directory-image-wrap">
              <img src={card.image} alt={card.title} loading="lazy" decoding="async"/>
              <span className="directory-kicker">{tx(card.kicker)}</span>
            </Link>
            <div className="directory-body">
              <div className="directory-title-row"><h3>{tx(card.title)}</h3><span>↗</span></div>
              <p>{tx(card.text)}</p>
              <div className="directory-points">{card.points.map(p=><span key={p}>✓ {tx(p)}</span>)}</div>
              <Link className="directory-link" to={card.path}>{tx('Explore')} <span>→</span></Link>
            </div>
          </article>)}
        </div>
      </div>
    </section>
  </>;
}
