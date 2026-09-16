import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import BookingSection from '../components/BookingSection';
import { tours } from '../data/siteData';
import { site } from '../data/siteConfig';
import { useLanguage } from '../context/LanguageContext';

const desertSafariDetails = {
  description:
    'Scintillating dune bashing with BBQ dinner at the only authentic Bedouin Oasis camp in Ras Al Khaimah.',
  highlights: [
    '45 min of Desert Dune Bashing by 4×4 Vehicle',
    'BBQ dinner at a Bedouin Oasis camp',
    'Pick-up & drop-off within Ras Al Khaimah',
    'Short camel ride',
    'Sand boarding',
    'Evening snacks',
    'Water, tea & coffee counter',
    'Belly dance and fire dance entertainment',
    'Henna painting',
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
  maxGuests: '50',
  minAge: '12+',
  bookingNote:
    'Vegetarian option is available. Share your travel date, group size and pickup location with Zuhd Tours so the team can confirm availability and booking details.',
};

export default function TourPage({ slug: fixedSlug }) {
  const { slug: routeSlug } = useParams();
  const { tx } = useLanguage();
  const slug = fixedSlug || routeSlug;
  const tour = tours.find((t) => t.slug === slug);

  if (!tour) {
    return (
      <div className="not-found">
        <div>
          <h1>404</h1>
          <p>{tx('Tour not found.')}</p>
          <Link className="btn btn-primary" to="/">{tx('Back home')}</Link>
        </div>
      </div>
    );
  }

  const isDesertSafari = tour.slug === 'desert-safari-dubai';
  const safari = isDesertSafari ? desertSafariDetails : null;
  const path = `/tours/${tour.slug}`;
  const locationText = tour.title.toLowerCase().includes('abu dhabi') ? 'Abu Dhabi, UAE' : 'Dubai, UAE';
  const title = tx(tour.title);
  const description = safari?.description || `${tx(tour.subtitle)} ${title} in ${locationText}. Contact Zuhd Tours for availability, transport and booking details.`;
  const categoryPath = tour.category === 'Desert Safari' ? '/desert-safari-dubai-tours' : tour.category === 'City Tours' ? '/dubai-city-tours' : '/services';

  const schema = {
    '@type': 'Service',
    '@id': `${site.domain}${path}#service`,
    name: title,
    serviceType: tx(tour.category),
    description,
    url: `${site.domain}${path}`,
    image: tour.image,
    provider: { '@id': `${site.domain}/#organization` },
    areaServed: { '@type': 'City', name: isDesertSafari ? 'Ras Al Khaimah' : locationText.replace(', UAE', '') },
  };

  if (tour.price && /^AED\s*\d/.test(tour.price)) {
    schema.offers = {
      '@type': 'Offer',
      priceCurrency: 'AED',
      price: String(tour.price).replace(/[^0-9.]/g, ''),
      url: `${site.domain}${path}`,
      availability: 'https://schema.org/InStock',
    };
  }

  return (
    <>
      <SEO
        title={tour.title}
        description={description}
        path={path}
        image={tour.image}
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: tour.category, path: categoryPath }, { name: tour.title, path }]}
        schema={[schema]}
      />

      <section className="detail">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">{tx('Home')}</Link> / <Link to={categoryPath}>{tx(tour.category)}</Link> / {title}
          </div>

          <div className="detail-grid">
            <img src={tour.image} alt={`${title} in ${locationText}`} loading="eager" />
            <div>
              <div className="eyebrow">{tx(tour.category)}</div>
              <h1>{title}</h1>
              <p className="detail-sub">{tx(tour.subtitle)}</p>
              <div className="detail-stats">
                <span>⏱ {tx(tour.duration)}</span>
                {tour.rating && <span>★ {tour.rating}</span>}
                <strong>{tx(tour.price)}</strong>
              </div>
              <a className="btn btn-primary" href={site.whatsapp}>{tx('Enquire on WhatsApp')}</a>
            </div>
          </div>

          {isDesertSafari ? (
            <div className="detail-copy safari-detail">
              <div className="safari-intro">
                <span className="eyebrow">Desert Safari Dubai</span>
                <h2>Desert Safari Experience</h2>
                <p>{safari.description}</p>
              </div>

              <div className="safari-info-grid">
                <div><span>From</span><strong>AED 129.00</strong></div>
                <div><span>Duration</span><strong>1 day</strong></div>
                <div><span>Tour type</span><strong>Desert Safari</strong></div>
                <div><span>Rating</span><strong>4.2 / 5</strong></div>
              </div>

              <h2>Highlights</h2>
              <div className="included-grid">
                {safari.highlights.map((item) => <span key={item}>✓ {item}</span>)}
              </div>

              <div className="safari-two-col">
                <div>
                  <h2>What's Included</h2>
                  <div className="included-grid">
                    {safari.included.map((item) => <span key={item}>✓ {item}</span>)}
                  </div>
                </div>
                <div>
                  <h2>Not Included</h2>
                  <div className="included-grid safari-excluded">
                    {safari.excluded.map((item) => <span key={item}>× {item}</span>)}
                  </div>
                </div>
              </div>

              <div className="safari-info-panel">
                <div><strong>Max Guests</strong><span>{safari.maxGuests}</span></div>
                <div><strong>Min Age</strong><span>{safari.minAge}</span></div>
                <div><strong>Tour Location</strong><span>Ras Al Khaimah</span></div>
                <div><strong>Vegetarian Option</strong><span>Available</span></div>
              </div>

              <h2>Booking Information</h2>
              <p>{safari.bookingNote}</p>
              <a className="btn btn-primary" href={site.whatsapp}>Book / Enquire on WhatsApp →</a>
            </div>
          ) : (
            <div className="detail-copy">
              <h2>{tx('About this experience')}</h2>
              <p>{tx(tour.subtitle)} {tx('This experience is arranged with practical booking support, transport options and an itinerary that can be discussed with the Zuhd Tours team.')}</p>
              <h2>{tx('Highlights')}</h2>
              <div className="included-grid">{(tour.highlights || []).map((item) => <span key={item}>✓ {tx(item)}</span>)}</div>
              <h2>{tx('Plan your trip')}</h2>
              <p>{tx('Tell us your travel date, group size, pickup location and preferred language. Our team can confirm the current availability, inclusions and price before you book.')}</p>
            </div>
          )}
        </div>
      </section>
      <BookingSection />
    </>
  );
}
