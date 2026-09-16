import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
export default function TourCard({tour}){const {tx}=useLanguage();return <article className="tour-card"><div className="tour-image"><img src={tour.image} alt={`${tx(tour.title)} in UAE`} loading="lazy" decoding="async"/>{tour.badges?.[0]&&<span>{tx(tour.badges[0])}</span>}</div><div className="tour-body"><div className="tour-meta"><span>{tx(tour.duration)}</span>{tour.rating&&<span>★ {tour.rating}</span>}</div><h3>{tx(tour.title)}</h3><p>{tx(tour.subtitle)}</p><div className="tour-foot"><strong>{tx(tour.price)}</strong><Link to={`/tours/${tour.slug}`}>{tx('View details')} <span>→</span></Link></div></div></article>}
