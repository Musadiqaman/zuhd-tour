import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { site } from '../data/siteConfig';
import { useLanguage } from '../context/LanguageContext';

const cityServices = [
  {title:'Dubai City Tour', kicker:'CITY TOUR', path:'/tours/dubai-city-tour', image:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=92', text:'Explore Dubai’s iconic landmarks, historic districts, souks, Creek, Downtown and waterfront areas.', points:['Dubai landmarks','Old Dubai & souks','Flexible sightseeing']},
  {title:'Abu Dhabi City Tour', kicker:'CITY TOUR', path:'/tours/abu-dhabi-city-tour', image:'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1800&q=92', text:'Discover Abu Dhabi with a comfortable city sightseeing experience covering major cultural and landmark stops.', points:['Grand Mosque','Corniche & city views','Cultural highlights']},
  {title:'Private Tours', kicker:'PRIVATE EXPERIENCE', path:'/private-tours', image:'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1800&q=92', text:'Plan a private sightseeing experience around your own schedule, attractions, vehicle and group.', points:['Private vehicle','Flexible itinerary','Personalised support']},
  {title:'Dhow Cruise', kicker:'WATER EXPERIENCE', path:'/tours/private-dhow-cruise-dubai', image:'https://images.unsplash.com/photo-1721797274530-6f5e612f45f9?auto=format&fit=crop&w=1800&q=92', text:'Enjoy Dubai waterfront views aboard a traditional dhow with comfortable and private arrangements available.', points:['Waterfront views','Traditional dhow','Private arrangements']},
  {title:'Tour Guide Service', kicker:'TRAVEL SUPPORT', path:'/tour-guides', image:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=92', text:'Arrange tour-guide support for city sightseeing, private tours and custom UAE travel plans.', points:['Sightseeing support','Private tours','Custom guidance']},
  {title:'Transport Services', kicker:'TRANSPORT', path:'/transport-services', image:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1800&q=92', text:'SUV cars, private cars, vans and buses for city tours, airport transfers, groups and events.', points:['SUV & private cars','Vans & buses','Group transport']},
  {title:'Parks Tickets', kicker:'TICKETS & ATTRACTIONS', path:'/parks-tickets', image:'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1800&q=92', text:'Arrange tickets for theme parks, water parks and family attractions across Dubai and the UAE.', points:['Theme parks','Water parks','Family attractions']},
];

export default function CityToursPage(){
  const {tx}=useLanguage();
  return <>
    <SEO title="Dubai City Tours & Services" description="Dubai city tours, Abu Dhabi city tours, private tours, dhow cruise, tour guides, transport services and parks tickets." path="/dubai-city-tours" breadcrumbs={[{name:'Home',path:'/'},{name:'City Tours',path:'/dubai-city-tours'}]}/>

    <section className="city-directory-hero">
      <div className="container city-directory-hero-inner">
        <div className="city-directory-copy">
          <div className="eyebrow">{tx('CITY TOURS')}</div>
          <h1>{tx('Dubai City Tours')}</h1>
          <p>{tx('Explore Dubai, Abu Dhabi and the UAE with city sightseeing, private experiences, cruises, professional guides, transport and attraction tickets.')}</p>
          <div className="city-directory-actions">
            <a className="btn btn-gold" href="#city-tour-list">{tx('Explore City Tours')} <span>→</span></a>
            <a className="btn btn-outline-light" href={site.whatsapp} target="_blank" rel="noreferrer">{tx('Plan Your Tour')}</a>
          </div>
        </div>
        <div className="city-directory-hero-card">
          <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=92" alt="Dubai city tours" />
          <div><strong>{tx('Dubai & UAE Experiences')}</strong><span>{tx('City tours • private services • travel support')}</span></div>
        </div>
      </div>
    </section>

    <section className="city-directory-list" id="city-tour-list">
      <div className="container">
        <div className="section-head tours-directory-head">
          <div><div className="eyebrow dark">{tx('CITY EXPERIENCES')}</div><h2>{tx('Explore City Tours')}</h2></div>
          <a className="view-all" href={site.whatsapp} target="_blank" rel="noreferrer">{tx('Need a custom tour?')} →</a>
        </div>
        <div className="tours-directory-grid">
          {cityServices.map(card=><article className="directory-card" key={card.title}>
            <Link to={card.path} className="directory-image-wrap">
              <img src={card.image} alt={card.title} loading="lazy" decoding="async" />
              <span className="directory-kicker">{tx(card.kicker)}</span>
            </Link>
            <div className="directory-body">
              <div className="directory-title-row"><h3>{tx(card.title)}</h3><span>↗</span></div>
              <p>{tx(card.text)}</p>
              <div className="directory-points">{card.points.map(point=><span key={point}>✓ {tx(point)}</span>)}</div>
              <Link className="directory-link" to={card.path}>{tx('Explore')} <span>→</span></Link>
            </div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="city-directory-features">
      <div className="container">
        <div className="city-feature-grid">
          <div><span>01</span><h3>{tx('Flexible pickup')}</h3><p>{tx('Discuss pickup, timing and vehicle arrangements for your group.')}</p></div>
          <div><span>02</span><h3>{tx('Local sightseeing')}</h3><p>{tx('Choose city landmarks, heritage areas, waterfront districts and cultural stops.')}</p></div>
          <div><span>03</span><h3>{tx('Complete travel support')}</h3><p>{tx('Guides, private tours, transport, dhow cruises and attraction tickets in one place.')}</p></div>
        </div>
      </div>
    </section>
  </>;
}
