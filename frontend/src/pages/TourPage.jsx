import { galleryAltText } from '../data/galleryAltText';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { PageIntro, SectionHeading, ExperienceCard, FaqList, Icon } from '../components/ExperienceUI';
import EnquiryForm from '../components/EnquiryForm';
import { tours } from '../data/siteData';
import { safaris, cityTours, tourPath, enquiryLink, serviceSchema } from '../data/experienceCatalog';
export default function TourPage({
  slug: fixedSlug
}) {
  const {
    slug: routeSlug
  } = useParams();
  const tour = tours.find(t => t.slug === (fixedSlug || routeSlug));
  if (!tour) return <><SEO title="Tour Not Found" description="The requested tour could not be found. Explore Zuhd Tours for Dubai and UAE experiences." path={`/tours/${fixedSlug || routeSlug}`} noindex /><div className="not-found"><div><h1>Tour not found</h1><Link to="/tours">Explore all experiences →</Link></div></div></>;
  const path = tourPath(tour),
    isSafari = tour.category === 'Desert Safari',
    categoryPath = isSafari ? '/desert-safari-dubai-tours' : tour.category === 'City Tours' ? '/dubai-city-tours' : '/services';
  const related = (isSafari ? safaris : cityTours).filter(t => t.slug !== tour.slug).slice(0, 3);
  const faqs = [['How do I confirm my booking?', `Send your preferred date, number of guests and pickup point using the enquiry form or WhatsApp button. Our team will confirm ${tour.title} availability, the final price and the arrangements.`], ['What should I know about pickup?', tour.pickup || 'Share your hotel or meeting point before booking so the team can quote and confirm the transport arrangements.'], ['Are the displayed times and prices final?', 'Prices are starting rates and itinerary timings are approximate. Group size, upgrades, location and the selected date can affect the quote. Follow the written booking details provided by the team.']];
  return <div className="experience-page"><SEO title={tour.seoTitle || tour.title} description={tour.seoDescription || `${tour.subtitle} Enquire with Zuhd Tours about dates, pickup and your personalised quote.`} path={path} image={tour.image} breadcrumbs={[{
      name: 'Home',
      path: '/'
    }, {
      name: tour.category,
      path: categoryPath
    }, {
      name: tour.title,
      path
    }]} schema={[serviceSchema(tour)]} /><PageIntro eyebrow={`${tour.category.toUpperCase()} · ${(tour.location || 'UAE').toUpperCase()}`} title={tour.title} description={tour.description || tour.subtitle} image={tour.image} breadcrumbs={[[tour.category, categoryPath], [tour.title]]}><div className="exp-package-chips"><span><Icon name="clock" />{tour.duration}</span>{tour.amount && <span>From AED {tour.amount} / adult</span>}</div></PageIntro>
  <section className="exp-section"><div className="container exp-detail-layout"><div className="exp-detail-main"><span className="exp-eyebrow">THE EXPERIENCE</span><h2>{isSafari ? 'Your time in the desert.' : 'A day worth discovering.'}</h2><p className="exp-detail-lead">{tour.description || tour.subtitle}</p><ul className="exp-highlight-grid">{tour.highlights?.map(h => <li key={h}><Icon name="check" />{h}</li>)}</ul>
  {tour.gallery?.length > 0 && <div className="exp-detail-gallery">{tour.gallery.map((src, i) => <a href={src} target="_blank" rel="noreferrer" key={`${src}-${i}`} aria-label={`Open ${tour.title} image ${i + 1}`}><img src={src} alt={galleryAltText[src] || `${tour.title} experience, view ${i + 1}`} width="640" height="440" loading="lazy" /></a>)}</div>}
  {tour.itinerary?.length > 0 && <div className="exp-detail-block"><span className="exp-eyebrow">HOW YOUR DAY UNFOLDS</span><h2>Your itinerary</h2><p>Use this as a guide. Your final pickup and activity timings are confirmed before travel.</p><ol className="exp-timeline">{tour.itinerary.map(([time, title, text]) => <li key={title}><span className="exp-timeline-time">{time}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol></div>}
  {(tour.included || tour.excluded) && <div className="exp-inclusions"><div><h2>What’s included</h2><ul>{tour.included?.map(t => <li key={t}><Icon name="check" />{t}</li>)}</ul></div><div><h2>Not included</h2><ul>{tour.excluded?.map(t => <li key={t}><span aria-hidden="true">−</span>{t}</li>)}</ul></div></div>}
  <div className="exp-pickup-note"><Icon name="pin" /><div><h2>Pickup & useful details</h2><p>{tour.pickup || 'Contact us with your location to arrange the meeting point.'}</p>{tour.availability && <p><strong>Schedule:</strong> {tour.availability}.</p>}{tour.note && <p>{tour.note}</p>}</div></div><div className="exp-detail-block"><h2>Before you book</h2><FaqList items={faqs} /></div></div>
  <aside className="exp-booking-sidebar"><span className="exp-eyebrow">MAKE IT YOUR NEXT EXPERIENCE</span><h2>{tour.title}</h2><div className="exp-sidebar-price">{tour.amount ? <><small>From</small><strong>AED {tour.amount}</strong><span>/ adult</span></> : <strong>{tour.price || 'Request a quote'}</strong>}</div><dl><div><dt>Duration</dt><dd>{tour.duration}</dd></div><div><dt>Destination</dt><dd>{tour.location || 'Dubai, UAE'}</dd></div><div><dt>Booking</dt><dd>Confirm with our team</dd></div></dl><a className="exp-btn exp-btn-gold" href={enquiryLink(tour)} target="_blank" rel="noreferrer">Enquire on WhatsApp <Icon name="chat" /></a><a className="exp-btn exp-btn-outline" href="#tour-enquiry">Plan your visit <Icon /></a><p>Tell us your date and group size. Child rates, upgrades and the exact total are confirmed before booking.</p></aside></div></section>
  <section className="exp-section exp-sand" id="tour-enquiry"><div className="container exp-enquiry-grid"><div><span className="exp-eyebrow">LET’S PLAN YOUR VISIT</span><h2>Make room for<br />something memorable.</h2><p>Send your details for {tour.title}. The team will help you confirm your date, pickup and final quote.</p></div><EnquiryForm key={tour.slug} defaultTour={tour.title} id="tour-enquiry-form" /></div></section><section className="exp-section"><div className="container"><SectionHeading eyebrow="KEEP EXPLORING" title="More experiences to discover." /><div className="exp-grid exp-grid-three">{related.map(t => <ExperienceCard key={t.slug} tour={t} />)}</div></div></section></div>;
}
