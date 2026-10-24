import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { Icon, BookingCta } from '../components/ExperienceUI';
import { usePageData, usePublicData } from '../context/PageDataContext';
import { legacyPosts } from '../data/legacyBlogContent';
import { imagery } from '../data/experienceCatalog';
import { journalDate } from '../utils/journal';

function GuideMeta({ post }) {
  return <div className="journal-card-meta"><span>{post.category || 'Travel guide'}</span>{post.publishedAt ? <time dateTime={post.publishedAt}>{journalDate(post.publishedAt)}</time> : <span>By {post.author || 'Zuhd Tours Team'}</span>}</div>;
}

export default function Blog() {
  const [params] = useSearchParams();
  const page = Math.max(1, Number.parseInt(params.get('page')) || 1);
  const ssr = usePageData();
  const initial = ssr.blog?.page === page ? ssr.blog : page === 1 ? { items: legacyPosts, total: legacyPosts.length, page: 1, pages: 1 } : null;
  const { data, loading } = usePublicData(`/api/public/posts?page=${page}&limit=12`, initial);
  const featured = page === 1 ? data?.items[0] : null;
  const stories = featured ? data.items.slice(1) : data?.items || [];
  return <div className="experience-page blog-page">
    <SEO title={page > 1 ? `Dubai Travel Guides — Page ${page}` : 'Dubai Travel Guides & Desert Safari Tips'} description="Practical Dubai travel guides, desert safari tips and ideas for exploring the UAE with Zuhd Tours." path={page > 1 ? `/blog?page=${page}` : '/blog'} breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Travel Guides', path: '/blog' }]} />
    <header className="journal-masthead"><div className="container">
      <nav className="journal-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span aria-current="page">Travel guides</span></nav>
      <div className="journal-masthead-row"><div><span className="exp-eyebrow">THE ZUHD JOURNAL</span><h1>A little insight.<br /><em>A better adventure.</em></h1></div><p>From your first desert sunset to the streets beyond the skyline. Ideas and practical advice for a memorable trip to the UAE.</p></div>
    </div></header>
    <section className="journal-stories exp-section"><div className="container">
      {loading && !data ? <p role="status">Loading travel guides…</p> : !data ? <div className="journal-empty"><h2>Our guides will be back shortly.</h2><p>Please try again in a moment.</p></div> : data.items.length ? <>
        {featured && <article className="journal-feature"><Link to={`/blog/${featured.slug}`} className="journal-feature-photo" aria-label={`Read ${featured.title}`}><img src={featured.image || imagery.desert} alt={featured.imageAlt || featured.title} width="1000" height="700" fetchpriority="high" /></Link><div className="journal-feature-copy"><span className="journal-feature-kicker">START EXPLORING</span><GuideMeta post={featured} /><h2><Link to={`/blog/${featured.slug}`}>{featured.title}</Link></h2><p>{featured.excerpt}</p><Link to={`/blog/${featured.slug}`} className="exp-text-link">Read the story <Icon /></Link></div></article>}
        {stories.length > 0 && <><div className="journal-topline"><h2>{featured ? 'More from the journal' : 'Travel guides'}</h2><span>{data.total} articles to explore</span></div><div className="journal-grid">{stories.map(post => <article className="journal-card" key={post.slug}><Link to={`/blog/${post.slug}`} className="journal-photo" aria-label={`Read ${post.title}`}><img src={post.image || imagery.desert} alt={post.imageAlt || post.title} width="720" height="440" loading="lazy" decoding="async" /></Link><div><GuideMeta post={post} /><h2><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt}</p><Link className="exp-text-link" to={`/blog/${post.slug}`}>Read the guide <Icon /></Link></div></article>)}</div></>}
      </> : <div className="journal-empty"><h2>More stories are on the way.</h2><p>Explore our tours while we prepare the next guide.</p><Link className="exp-btn exp-btn-navy" to="/tours">Explore experiences</Link></div>}
      {data?.pages > 1 && <nav className="journal-pagination" aria-label="Blog pages">{page > 1 ? <Link className="exp-btn exp-btn-outline" to={page === 2 ? '/blog' : `/blog?page=${page - 1}`}>← Previous</Link> : <span className="journal-page-disabled" aria-disabled="true">← Previous</span>}<span>Page {page} of {data.pages}</span>{page < data.pages ? <Link className="exp-btn exp-btn-outline" to={`/blog?page=${page + 1}`}>Next →</Link> : <span className="journal-page-disabled" aria-disabled="true">Next →</span>}</nav>}
    </div></section><BookingCta title="Found your next adventure?" />
  </div>;
}
