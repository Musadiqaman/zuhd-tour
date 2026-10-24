import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { site } from '../data/siteConfig';
export default function LegalPage({
  kind
}) {
  const privacy = kind === 'privacy',
    title = privacy ? 'Privacy policy' : 'Website terms of use',
    path = privacy ? '/privacy-policy' : '/terms-of-use';
  return <div className="experience-page"><SEO title={title} description={privacy ? 'How Zuhd Tours handles website enquiries, essential cookies and Google Maps reviews.' : 'Terms for using the Zuhd Tours website, travel information and Google Maps content.'} path={path} /><article className="container legal-page"><span className="exp-eyebrow">ZUHD TOURS</span><h1>{title}</h1>{privacy ? <>
    <h2>Enquiries and booking information</h2><p>When you contact us by phone, email or WhatsApp, we receive the information you choose to share, such as your name, contact details and travel requirements. We use it to respond to your enquiry and arrange the services you request. Please contact us if you would like to ask about or correct information you have shared.</p>
    <h2>Website and account data</h2><p>The website uses essential session cookies for administrator sign-in and stores the selected language in your browser. Administrative accounts, blog content and uploaded media are stored in our website database. Our hosting providers process technical request information to operate and protect the website.</p>
    <h2>Google Maps reviews</h2><p>When enabled, the reviews section loads an Elfsight widget that displays public Google reviews, including reviewers’ public names, profile images and review text. Loading the widget sends technical information such as your IP address and browser details to Elfsight and its service providers. Review text is not stored in our website database. See the <a href="https://elfsight.com/privacy-policy/" target="_blank" rel="noreferrer">Elfsight Privacy Policy</a>. Profile images may load directly from Google. Links to read or write reviews open Google’s services. See the <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google Privacy Policy</a> for Google’s handling of information.</p>
    <h2>External services</h2><p>WhatsApp, Google Maps and other external links are operated by their respective providers. Their privacy policies apply when you visit or use those services. Website fonts may be loaded from Google Fonts.</p>
    <h2>Contact</h2><p>For questions about information you have shared with Zuhd Tours, email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
  </> : <>
    <h2>Using this website</h2><p>This website provides information about Zuhd Tours experiences and a way to contact our team. Please use it lawfully and do not attempt to gain access to administrative accounts or interfere with the service.</p>
    <h2>Travel information and bookings</h2><p>Displayed prices, itineraries and availability may change. Confirm the current price, inclusions, pickup details, suitability and applicable booking and cancellation terms with our team before making a booking or payment. Sending an enquiry does not itself confirm a reservation.</p>
    <h2>Google Maps content</h2><p>Google Maps reviews belong to their respective authors and are displayed with attribution. Reviews express the authors’ experiences. Google Maps features are subject to the <a href="https://www.google.com/intl/en/help/terms_maps/" target="_blank" rel="noreferrer">Google Maps/Google Earth Additional Terms of Service</a> and the <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Google Terms of Service</a>.</p>
    <h2>External links and content</h2><p>External websites have their own terms. Please contact us if you believe content on this website needs correction or if you have a question about permission to reuse our materials.</p>
    <h2>Contact our team</h2><p>Email <a href={`mailto:${site.email}`}>{site.email}</a> or visit our <Link to="/contact">contact page</Link> for assistance.</p>
  </>}<p><Link to={privacy ? '/terms-of-use' : '/privacy-policy'}>{privacy ? 'Website terms of use' : 'Privacy policy'} →</Link></p></article></div>;
}
