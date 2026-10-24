import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { site } from '../data/siteConfig';
import { useLanguage } from '../context/LanguageContext';
export default function Header() {
  const [open, setOpen] = React.useState(false),
    location = useLocation(),
    toggle = React.useRef(null),
    menu = React.useRef(null),
    currentLocation = React.useRef(location.pathname + location.hash);
  currentLocation.current = location.pathname + location.hash;
  const {
    nav,
    language,
    setLanguage
  } = useLanguage();
  React.useEffect(() => setOpen(false), [location.pathname, location.hash]);
  React.useEffect(() => {
    if (!open) return;
    const body = document.body,
      y = window.scrollY,
      openedAt = currentLocation.current;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow
    };
    Object.assign(body.style, {
      position: 'fixed',
      top: `-${y}px`,
      width: '100%',
      overflow: 'hidden'
    });
    body.dataset.menuOpen = 'true';
    const onKey = e => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === 'Tab') {
        const focusable = [toggle.current, ...menu.current.querySelectorAll('a,button,select')].filter(x => x && x.getClientRects().length);
        const first = focusable[0],
          last = focusable.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const mq = window.matchMedia('(min-width: 1100px)');
    const onResize = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener('change', onResize);
    return () => {
      Object.assign(body.style, previous);
      delete body.dataset.menuOpen;
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onResize);
      window.scrollTo({
        top: currentLocation.current === openedAt ? y : 0,
        behavior: 'instant'
      });
    };
  }, [open]);
  const links = [['/', nav.home], ['/desert-safari-dubai-tours', nav.desert], ['/dubai-city-tours', nav.city], ['/transfers', language === 'ar' ? 'خدمات النقل' : 'Transfer'], ['/faqs', language === 'ar' ? 'الأسئلة الشائعة' : 'FAQs'], ['/blog', nav.blog], ['/gallery', language === 'ar' ? 'المعرض' : 'Gallery'], ['/about', nav.about], ['/contact', nav.contact]];
  function active(path) {
    const p = location.pathname;
    if (path === '/') return p === '/';
    if (path === '/desert-safari-dubai-tours') return p === path || /\/tours\/(.*safari|quad-bike|dune-buggy|desert-bbq)/.test(p);
    if (path === '/dubai-city-tours') return p === path || p === '/abu-dhabi-city-tours' || /\/tours\/(dubai-city|sharjah-city|ras-al-khaimah-city)/.test(p);
    return p.startsWith(path);
  }
  return <><a className="exp-skip-link" href="#main-content">Skip to content</a><header className="exp-header"><div className="container exp-nav"><Logo /><button ref={toggle} type="button" className={`exp-menu-toggle ${open ? 'is-open' : ''}`} onClick={() => setOpen(x => !x)} aria-controls="main-navigation" aria-expanded={open} aria-label={open ? 'Close navigation' : 'Open navigation'}><span /><span /><span /></button><nav ref={menu} id="main-navigation" aria-label="Primary navigation" className={`exp-nav-links ${open ? 'is-open' : ''}`}>{links.map(([path, label]) => <Link key={path} to={path} onClick={() => setOpen(false)} className={active(path) ? 'is-active' : ''} aria-current={active(path) ? 'page' : undefined}>{label}</Link>)}<select className="exp-language" aria-label="Website language" value={language} onChange={e => setLanguage(e.target.value)}><option value="en">EN</option><option value="ar">العربية</option></select><a className="exp-nav-book" href={site.whatsapp} target="_blank" rel="noreferrer">{nav.book}<span>↗</span></a></nav></div></header></>;
}
