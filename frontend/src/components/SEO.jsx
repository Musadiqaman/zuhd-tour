import React from 'react';
import { Helmet } from 'react-helmet-async';
import { site } from '../data/siteConfig';
import { useLanguage } from '../context/LanguageContext';

const abs = (value) => {
  if (!value) return undefined;
  return value.startsWith('http') ? value : `${site.domain}${value}`;
};

function baseSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${site.domain}/#organization`,
    name: site.name,
    url: site.domain,
    logo: abs('/favicon.svg'),
    image: abs(site.defaultImage),
    telephone: site.phone,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.licenseAddress,
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      addressCountry: 'AE'
    },
    areaServed: [
      { '@type': 'City', name: 'Dubai' },
      { '@type': 'City', name: 'Abu Dhabi' }
    ]
  };
}

export default function SEO({
  title,
  description,
  path = '/',
  image = site.defaultImage,
  type = 'website',
  noindex = false,
  breadcrumbs = [],
  schema = []
}) {
  const {tx}=useLanguage();
  const localizedTitle=tx(title);
  const localizedDescription=tx(description);
  const fullTitle = localizedTitle.includes(site.name) ? localizedTitle : `${localizedTitle} | ${site.name}`;
  const canonical = `${site.domain}${path}`;
  const imageUrl = abs(image);

  const graph = [baseSchema(), ...schema];
  if (breadcrumbs.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        ...(item.path ? { item: `${site.domain}${item.path}` } : {})
      }))
    });
  }

  return <Helmet>
    <title>{fullTitle}</title>
    <meta name="description" content={localizedDescription} />
    <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'} />
    <link rel="canonical" href={canonical} />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={localizedDescription} />
    <meta property="og:type" content={type} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={imageUrl} />
    <meta property="og:image:alt" content={fullTitle} />
    <meta property="og:site_name" content={site.name} />
    <meta property="og:locale" content="en_AE" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={fullTitle} />
    <meta name="twitter:description" content={localizedDescription} />
    <meta name="twitter:image" content={imageUrl} />
    <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
  </Helmet>;
}
