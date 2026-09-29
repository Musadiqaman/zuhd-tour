import { tours, posts } from './siteData.js';

// Only observed old URLs with equivalent replacement content belong here.
export const redirects = {
  '/home': '/',
  '/contact_us': '/contact',
  '/tour-packages': '/tours',
  '/articles': '/blog',
  '/booking/desert-safari': '/desert-safari-dubai-tours',
  '/booking/abu-dhabi-city-tour': '/abu-dhabi-city-tours',
  '/booking/dubai-city-tour': '/tours/dubai-city-tour',
  '/booking/global-village-dubai': '/global-village-dubai',
  '/tours/abu-dhabi-city-tour': '/abu-dhabi-city-tours',
  '/tours/global-village-dubai': '/global-village-dubai',
  '/tours/desert-safari-dubai': '/desert-safari-dubai-tours',
};
export const pageRoutes = [
  '/', '/tours', '/services', '/desert-safari-dubai-tours', '/dubai-city-tours',
  '/abu-dhabi-city-tours', '/global-village-dubai', '/private-tours', '/tour-guides',
  '/transport-services', '/parks-tickets', '/combo-tours-dubai', '/dubai-airport-transfer',
  '/dubai-top-city-tour-landmarks', '/gallery', '/about', '/contact', '/blog',
  ...tours.map(t => `/tours/${t.slug}`).filter(path => !redirects[path]),
  ...posts.map(p => `/blog/${p.slug}`),
];
