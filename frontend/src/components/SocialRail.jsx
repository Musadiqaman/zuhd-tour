import React from 'react';
export const socialPlatforms = [['facebook', 'Facebook', ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.com']], ['instagram', 'Instagram', ['instagram.com', 'www.instagram.com']], ['youtube', 'YouTube', ['youtube.com', 'www.youtube.com', 'youtu.be']], ['tiktok', 'TikTok', ['tiktok.com', 'www.tiktok.com']], ['x', 'X', ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com']], ['linkedin', 'LinkedIn', ['linkedin.com', 'www.linkedin.com']]];
export function validSocialUrl(value, hosts) {
  try {
    const u = new URL(value);
    return u.protocol === 'https:' && hosts.includes(u.hostname) && !u.username && !u.password && !u.port && u.pathname !== '/' ? u.href : '';
  } catch {
    return '';
  }
}
export function SocialIcon({
  name
}) {
  const paths = {
    facebook: <path d="M14 22v-9h3l.5-4H14V7c0-1 .4-2 2-2h2V1.4A24 24 0 0 0 15 1c-3 0-5 1.8-5 5v3H7v4h3v9Z" />,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.2" /></>,
    youtube: <><path d="M22 7s-.2-2-2-2.3C18 4.3 12 4.3 12 4.3s-6 0-8 .4C2.2 5 2 7 2 7s-.5 2.3-.5 5 .5 5 .5 5 .2 2 2 2.3c2 .4 8 .4 8 .4s6 0 8-.4c1.8-.3 2-2.3 2-2.3s.5-2.3.5-5S22 7 22 7Z" /><path d="m10 8 6 4-6 4Z" fill="var(--social-icon-cutout,#092b40)" /></>,
    tiktok: <path d="M15 2h3c.2 2.7 1.7 4.5 4 4.8v3.1a8 8 0 0 1-4-1.2v7.2A6.1 6.1 0 1 1 12 9.8v3.3a2.9 2.9 0 1 0 3 2.9Z" />,
    x: <path d="M18.5 2H22l-7.7 8.8L23 22h-6.8l-5.3-7L4.8 22H1.3l8-9.2L1 2h7l4.8 6.4ZM17.4 20h1.9L6.9 4H4.8Z" />,
    linkedin: <><rect x="2" y="8" width="4" height="14" /><circle cx="4" cy="3.5" r="2.3" /><path d="M9 8h4v2c1-1.5 2.5-2.3 4.2-2.3 4 0 4.8 2.6 4.8 6V22h-4v-7.4c0-1.8 0-3.8-2.4-3.8S13 12.5 13 14.5V22H9Z" /></>
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">{paths[name]}</svg>;
}
export default function SocialRail() {
  const [links, setLinks] = React.useState({}),
    [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const controller = new AbortController();
    fetch('/api/public/site', {
      signal: controller.signal,
      cache: 'no-store'
    }).then(r => r.ok ? r.json() : null).then(r => setLinks(r?.socialLinks || {})).catch(() => {});
    return () => controller.abort();
  }, []);
  const active = socialPlatforms.map(([key, label, hosts]) => ({
    key,
    label,
    url: validSocialUrl(links[key], hosts)
  })).filter(p => p.url);
  if (!active.length) return null;
  return <aside className={`social-rail ${open ? 'is-open' : ''}`} aria-label="Follow Zuhd Tours"><nav id="social-profiles" aria-label="Social profiles">{active.map(p => <a key={p.key} href={p.url} aria-label={`Zuhd Tours on ${p.label}`} title={p.label} target="_blank" rel="noopener noreferrer"><SocialIcon name={p.key} /></a>)}</nav><button className="social-rail-toggle" aria-expanded={open} aria-controls="social-profiles" aria-label={open ? 'Close social links' : 'Open social links'} onClick={() => setOpen(v => !v)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{open ? <path d="m6 6 12 12M6 18 18 6" /> : <><circle cx="6" cy="12" r="3" /><circle cx="18" cy="5" r="3" /><circle cx="18" cy="19" r="3" /><path d="m9 10 6-3M9 14l6 3" /></>}</svg></button></aside>;
}
