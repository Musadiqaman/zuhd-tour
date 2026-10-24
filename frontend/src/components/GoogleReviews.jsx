import React from 'react';
import { site } from '../data/siteConfig';

const PLATFORM = 'https://elfsightcdn.com/platform.js';
const ID_PATTERN = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
let platformRequest;

function loadPlatform() {
  if (platformRequest) return platformRequest;
  platformRequest = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-zuhd-reviews]');
    if (existing?.dataset.loaded === 'true') return resolve();
    const script = existing || document.createElement('script');
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', () => {
      script.remove();
      platformRequest = null;
      reject(new Error('Reviews could not be loaded.'));
    }, { once: true });
    if (!existing) {
      script.src = PLATFORM;
      script.async = true;
      script.dataset.zuhdReviews = 'true';
      document.head.appendChild(script);
    }
  });
  return platformRequest;
}

function ReviewWidget({ appId }) {
  const host = React.useRef(null);
  const [state, setState] = React.useState('loading');
  React.useEffect(() => {
    let alive = true;
    const node = host.current;
    const check = () => {
      if (node.childElementCount && alive) setState('loaded');
    };
    const observer = new MutationObserver(check);
    observer.observe(node, { childList: true, subtree: true });
    check();
    // The official platform observes newly inserted widget containers on SPA navigation.
    loadPlatform().catch(() => { if (alive) setState('unavailable'); });
    const timer = setTimeout(() => {
      if (alive && !node.childElementCount) setState('unavailable');
    }, 15000);
    return () => { alive = false; observer.disconnect(); clearTimeout(timer); };
  }, [appId]);
  return <div className="reviews-widget-wrap">
    <div ref={host} className={`elfsight-app-${appId}`} data-elfsight-app-lazy="disabled" />
    {state === 'loading' && <p className="reviews-loading" role="status">Loading guest reviews…</p>}
    {state === 'unavailable' && <p className="reviews-loading">Reviews are available on our Google profile. Use the link below to read them.</p>}
  </div>;
}

export default function GoogleReviews() {
  const section = React.useRef(null);
  const [data, setData] = React.useState(null);
  const [nearby, setNearby] = React.useState(false);
  React.useEffect(() => {
    const controller = new AbortController();
    fetch('/api/public/reviews', { signal: controller.signal, cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(setData)
      .catch(() => {});
    return () => controller.abort();
  }, []);
  React.useEffect(() => {
    if (!section.current) return;
    if (!('IntersectionObserver' in window)) { setNearby(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { setNearby(true); observer.disconnect(); }
    }, { rootMargin: '300px' });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  if (data?.enabled === false) return null;
  const configured = data?.configured && ID_PATTERN.test(data?.appId || '');
  return <section ref={section} id="google-reviews" className="exp-section google-reviews-section" aria-labelledby="reviews-heading">
    <div className="container">
      <div className="reviews-heading-row"><div><span className="exp-eyebrow">EXPERIENCES, IN THEIR WORDS</span><h2 id="reviews-heading">Stories from our guests.</h2></div><span className="reviews-source-label">Google reviews</span></div>
      {configured && nearby && <ReviewWidget key={data.appId} appId={data.appId} />}
      {!configured && <p className="reviews-intro">Discover what guests are sharing about their adventures with Zuhd Tours.</p>}
      <div className="reviews-actions"><a className="exp-text-link" href={data?.mapsUrl || site.googleMapsUrl} target="_blank" rel="noopener noreferrer">Read reviews on Google ↗</a></div>
    </div>
  </section>;
}
