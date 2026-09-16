import React from 'react';
import { tours } from '../data/siteData'; import TourCard from './TourCard';
export default function TourGrid({category,limit=99}){return <div className="tour-grid">{tours.filter(t=>!category||t.category===category).slice(0,limit).map(t=><TourCard key={t.slug} tour={t}/>)}</div>}
