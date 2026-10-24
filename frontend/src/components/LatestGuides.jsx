import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, SectionHeading } from './ExperienceUI';
import { legacyPosts } from '../data/legacyBlogContent';
import { usePublicData } from '../context/PageDataContext';
import { imagery } from '../data/experienceCatalog';
const fallback = {
  items: [legacyPosts[0], legacyPosts[3], legacyPosts[2]]
};
export default function LatestGuides() {
  const {
    data
  } = usePublicData('/api/public/posts?limit=3', fallback);
  if (!data?.items?.length) return null;
  return <section className="exp-section"><div className="container"><SectionHeading eyebrow="A LITTLE INSPIRATION" title="Make more of your time in Dubai." link="/blog" linkText="Read our travel guides" /><div className="exp-grid exp-grid-three">{data.items.map(p => <article className="exp-guide" key={p.slug}><Link to={`/blog/${p.slug}`}><img src={p.image || imagery.desert} alt={p.imageAlt || p.title} width="720" height="440" loading="lazy" /><span className="exp-card-category">{p.category}</span><h3>{p.title}</h3><span className="exp-text-link">Read the guide <Icon /></span></Link></article>)}</div></div></section>;
}
