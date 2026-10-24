import { articleOutline, readingMinutes, journalDate } from '../utils/journal';
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { site } from '../data/siteConfig';
import { usePageData, usePublicData } from '../context/PageDataContext';
import { legacyPosts } from '../data/legacyBlogContent';
import { BookingCta } from '../components/ExperienceUI';
export default function BlogPost() {
  const {
      slug
    } = useParams(),
    ssr = usePageData(),
    legacy = legacyPosts.find(p => p.slug === slug);
  const initial = ssr.post?.slug === slug ? {
    post: ssr.post
  } : ssr.notFound ? null : legacy ? {
    post: legacy
  } : null;
  const {
    data,
    loading,
    error
  } = usePublicData(`/api/public/posts/${encodeURIComponent(slug)}`, initial);
  const post = data?.post;
  if (!post) {
    const missing = ssr.notFound || error === 404;
    return <><SEO title={missing ? 'Guide Not Found' : 'Travel Guide'} description="Explore travel guides from Zuhd Tours." noindex path={`/blog/${slug}`} /><div className="journal-empty container"><h1>{missing ? 'Guide not found' : loading ? 'Loading your guide…' : 'This guide is temporarily unavailable'}</h1><p>{missing ? 'This guide may have moved or is no longer published.' : 'Please try again shortly.'}</p><Link className="exp-btn exp-btn-navy" to="/blog">Back to travel guides</Link></div></>;
  }
  const outline = articleOutline(post.html || '');
  const path = `/blog/${post.slug}`,
    image = post.image?.startsWith('/') ? site.domain + post.image : post.image;
  const schema = {
    '@type': 'BlogPosting',
    '@id': `${site.domain}${path}#article`,
    headline: post.title,
    description: post.excerpt,
    mainEntityOfPage: `${site.domain}${path}`,
    author: {
      '@type': post.author === 'Zuhd Tours Team' ? 'Organization' : 'Person',
      name: post.author || site.name
    },
    publisher: {
      '@id': `${site.domain}/#organization`
    },
    ...(image ? {
      image: [image]
    } : {}),
    ...(post.publishedAt ? {
      datePublished: post.publishedAt
    } : {}),
    ...(post.updatedAt ? {
      dateModified: post.updatedAt
    } : {})
  };
  return <div className="experience-page journal-post-page"><SEO title={post.seoTitle || post.title} description={post.seoDescription || post.excerpt} path={path} image={post.image || site.defaultImage} type="article" breadcrumbs={[{
      name: 'Home',
      path: '/'
    }, {
      name: 'Travel Guides',
      path: '/blog'
    }, {
      name: post.title,
      path
    }]} schema={[schema]} /><article className="journal-article"><div className="container journal-back"><Link to="/blog">← All travel guides</Link></div><div className="journal-article-head container"><nav className="journal-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/blog">Travel guides</Link><span>/</span><span>{post.category}</span></nav><span className="exp-eyebrow">{post.category}</span><h1>{post.title}</h1><p className="journal-lead">{post.excerpt}</p><div className="journal-byline"><span className="journal-author-mark" aria-hidden="true">ZT</span><span>By {post.author || 'Zuhd Tours Team'}</span>{(post.updatedAt || post.publishedAt) && <time dateTime={post.updatedAt || post.publishedAt}>{post.updatedAt ? 'Updated ' : 'Published '}{journalDate(post.updatedAt || post.publishedAt)}</time>}<span>{readingMinutes(post)} min read</span></div></div>{post.image && <div className="container"><img className="journal-cover" src={post.image} alt={post.imageAlt || post.title} width="1280" height="700" fetchpriority="high" /></div>}{outline.headings.length > 0 && <details className="journal-mobile-contents container"><summary>In this guide</summary><nav aria-label="Article contents">{outline.headings.map(h => <a key={h.id} href={`#${h.id}`}>{h.title}</a>)}</nav></details>}<div className="journal-reading-layout container"><div className="journal-body" dangerouslySetInnerHTML={{
          __html: outline.content
        }} /><aside className="journal-aside">{outline.headings.length > 0 && <nav className="journal-contents" aria-label="Article contents"><h2>In this guide</h2>{outline.headings.map(h => <a key={h.id} className={h.level === 3 ? 'is-subheading' : ''} href={`#${h.id}`}>{h.title}</a>)}</nav>}<div className="journal-aside-cta"><span className="exp-eyebrow">MAKE IT YOUR OWN</span><h2>Ready to explore Dubai?</h2><p>Turn your travel ideas into a day to remember.</p><Link className="exp-btn exp-btn-navy" to="/desert-safari-dubai-tours">Explore our safaris</Link><Link className="exp-text-link" to="/dubai-city-tours">Browse city tours →</Link></div></aside></div></article><BookingCta /></div>;
}
