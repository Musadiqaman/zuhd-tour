import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import BookingSection from '../components/BookingSection';
import { site } from '../data/siteConfig';

const safari = {
  title: 'Desert Safari',
  price: 'AED 129.00',
  duration: '1 day',
  rating: '4.2 / 5',
  reviews: '3 verified reviews',
  location: 'Ras Al Khaimah, UAE',
  maxGuests: '50',
  minAge: '12+',
  description:
    'Scintillating dune bashing with BBQ dinner at the only authentic Bedouin Oasis camp in Ras Al Khaimah.',
  highlights: [
    '45 min of desert dune bashing by 4×4 vehicle',
    'BBQ dinner at a Bedouin Oasis camp',
    'Pick-up & drop-off within Ras Al Khaimah',
    'Vegetarian option available',
  ],
  included: [
    'Pick & drop off within Ras Al Khaimah',
    '45 min desert dune bashing by 4×4 vehicle',
    'Short camel ride',
    'Sand boarding',
    'Evening snacks',
    'Water, tea & coffee counter',
    'Belly dance and fire dance shows',
    'BBQ based buffet dinner',
    'Henna painting',
    'Drop off',
  ],
  excluded: [
    'Souvenirs and photos (available to purchase)',
    'Alcoholic drinks (available to purchase)',
    'Quad Bike Tour (can be booked onsite)',
  ],
  scores: [
    ['Quality', '3.67 / 5'],
    ['Location', '4.67 / 5'],
    ['Amenities', '4.67 / 5'],
    ['Services', '4.67 / 5'],
    ['Price', '3.33 / 5'],
  ],
};

const heroImage =
  'https://images.unsplash.com/photo-1717031578847-6b7fd6a94724?auto=format&fit=crop&w=2000&q=92';

export default function DesertSafariPage() {
  const path = '/desert-safari-dubai-tours';
  const description =
    'Desert Safari with 45-minute dune bashing, camel ride, sandboarding, BBQ buffet dinner and Bedouin Oasis entertainment in Ras Al Khaimah.';

  const schema = {
    '@type': 'Service',
    '@id': `${site.domain}${path}#service`,
    name: safari.title,
    serviceType: 'Desert Safari',
    description,
    url: `${site.domain}${path}`,
    image: heroImage,
    provider: { '@id': `${site.domain}/#organization` },
    areaServed: { '@type': 'City', name: 'Ras Al Khaimah' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'AED',
      price: '129.00',
      url: `${site.domain}${path}`,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <SEO
        title="Desert Safari Dubai Tours"
        description={description}
        path={path}
        image={heroImage}
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Desert Safari', path }]}
        schema={[schema]}
      />

      <section className="safari-page-hero">
        <div className="safari-page-hero-bg" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="safari-page-hero-overlay" />
        <div className="container safari-page-hero-content">
          <div className="breadcrumbs safari-breadcrumbs">
            <Link to="/">Home</Link> / Desert Safari
          </div>
          <span className="eyebrow">DESERT SAFARI • RAS AL KHAIMAH</span>
          <h1>Desert Safari</h1>
          <p>{safari.description}</p>
          <div className="safari-hero-actions">
            <a className="btn btn-primary" href={site.whatsapp} target="_blank" rel="noreferrer">Book / Enquire on WhatsApp →</a>
            <span className="safari-price">From <strong>{safari.price}</strong></span>
          </div>
        </div>
      </section>

      <section className="section safari-page-section">
        <div className="container">
          <div className="safari-overview-grid">
            <div className="safari-main-card">
              <div className="eyebrow dark">DESERT SAFARI</div>
              <h2>Desert Safari Experience</h2>
              <p className="safari-lead">{safari.description}</p>

              <div className="safari-stat-grid">
                <div><span>From</span><strong>{safari.price}</strong></div>
                <div><span>Duration</span><strong>{safari.duration}</strong></div>
                <div><span>Tour Type</span><strong>Desert Safari</strong></div>
                <div><span>Rating</span><strong>★ {safari.rating}</strong><small>{safari.reviews}</small></div>
              </div>

              <h3>Highlights</h3>
              <div className="safari-feature-grid">
                {safari.highlights.map((item) => <div key={item}>✓ {item}</div>)}
              </div>
            </div>

            <aside className="safari-side-card">
              <span className="eyebrow dark">TOUR INFORMATION</span>
              <div className="safari-side-row"><span>Tour location</span><strong>{safari.location}</strong></div>
              <div className="safari-side-row"><span>Max guests</span><strong>{safari.maxGuests}</strong></div>
              <div className="safari-side-row"><span>Minimum age</span><strong>{safari.minAge}</strong></div>
              <div className="safari-side-row"><span>Vegetarian option</span><strong>Available</strong></div>
              <a className="btn btn-primary safari-side-btn" href={site.whatsapp} target="_blank" rel="noreferrer">Check Availability</a>
            </aside>
          </div>

          <div className="safari-content-grid">
            <div>
              <div className="safari-content-card">
                <h2>What's Included</h2>
                <div className="safari-list included-list">
                  {safari.included.map((item) => <div key={item}><span>✓</span>{item}</div>)}
                </div>
              </div>

              <div className="safari-content-card">
                <h2>Not Included</h2>
                <div className="safari-list excluded-list">
                  {safari.excluded.map((item) => <div key={item}><span>×</span>{item}</div>)}
                </div>
              </div>

              <div className="safari-content-card safari-booking-card">
                <div>
                  <span className="eyebrow dark">PLAN YOUR VISIT</span>
                  <h2>Ready for the desert?</h2>
                  <p>Share your travel date, group size and pickup location with Zuhd Tours to confirm availability and booking details.</p>
                </div>
                <a className="btn btn-primary" href={site.whatsapp} target="_blank" rel="noreferrer">Book Safari →</a>
              </div>
            </div>

            <aside className="safari-review-card">
              <span className="eyebrow dark">REVIEW SCORES</span>
              <div className="safari-review-total"><strong>4.2</strong><span>/ 5</span><small>{safari.reviews}</small></div>
              {safari.scores.map(([label, score]) => (
                <div className="score-row" key={label}><span>{label}</span><strong>{score}</strong></div>
              ))}
            </aside>
          </div>
        </div>
      </section>

      <BookingSection />
    </>
  );
}
