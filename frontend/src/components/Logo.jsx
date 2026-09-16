import { Link } from 'react-router-dom';
import { site } from '../data/siteConfig';

export default function Logo({ onClick }) {
  return <Link to="/" className="logo" onClick={onClick} aria-label={site.name}>
    <svg className="logo-art" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M8 47c11-4 16-12 20-28 2 12 7 20 15 26 5-6 8-13 9-21 4 8 4 16 1 23H8Z" fill="currentColor" opacity=".96"/>
      <path d="M18 45c8-6 15-8 24-5 7 2 11 6 15 7-13 5-27 5-39-2Z" fill="currentColor" opacity=".55"/>
      <path d="M30 40V13h5v27m-10 0V22h5v18m10 0V19h5v21" stroke="currentColor" strokeWidth="2.7" fill="none" strokeLinecap="round"/>
      <path d="M12 50h42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="48" cy="14" r="4" fill="currentColor"/>
    </svg>
    <span className="logo-copy"><strong>{site.shortName}</strong><small>TOURS</small></span>
  </Link>;
}
