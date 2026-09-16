import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { site } from '../data/siteConfig';
import { languages, useLanguage } from '../context/LanguageContext';

/*
  Simplified navigation inspired by the clean structure of Gulf Dunes Tourism:
  no nested mega menus; all tour categories are presented on the dedicated Tours page.
*/
export default function Header(){
  const [mobile,setMobile]=React.useState(false);
  const [lang,setLang]=React.useState(false);
  const location=useLocation();
  const navRef=React.useRef(null);
  const menuRef=React.useRef(null);
  const {language,setLanguage,nav,languageLabel}=useLanguage();

  const close=React.useCallback(()=>{
    setMobile(false);
    setLang(false);
  },[]);

  React.useEffect(()=>{ close(); },[location.pathname, close]);
  React.useEffect(()=>{
    document.body.style.overflow=mobile?'hidden':'';
    if(mobile && menuRef.current) menuRef.current.scrollTop=0;
    return()=>{document.body.style.overflow=''};
  },[mobile]);
  React.useEffect(()=>{
    const onKey=e=>{if(e.key==='Escape') close();};
    document.addEventListener('keydown',onKey);
    return()=>document.removeEventListener('keydown',onKey);
  },[close]);
  React.useEffect(()=>{
    const onClick=e=>{
      if(navRef.current && !navRef.current.contains(e.target)) setLang(false);
    };
    document.addEventListener('mousedown',onClick);
    return()=>document.removeEventListener('mousedown',onClick);
  },[]);

  const links=[
    ['home','/',nav.home],
    ['desert','/desert-safari-dubai-tours',nav.desert],
    ['city','/dubai-city-tours',nav.city],
    ['combo','/combo-tours-dubai',nav.combo],
    ['airport','/dubai-airport-transfer',nav.airport],
    ['blog','/blog',nav.blog],
    ['about','/about',nav.about],
    ['contact','/contact',nav.contact],
  ];

  return <header className="header" ref={navRef}>
    <div className="container nav">
      <Logo onClick={close}/>
      <button className={`menu-btn ${mobile?'active':''}`} onClick={()=>setMobile(v=>!v)} aria-label="Toggle navigation" aria-expanded={mobile}>
        <span/><span/><span/>
      </button>

      <nav ref={menuRef} className={`nav-links ${mobile?'open':''}`} aria-label="Primary navigation">
        {links.map(([key,path,label])=><Link
          key={key}
          to={path}
          onClick={close}
          className={(key==='home' ? location.pathname==='/' : location.pathname===path || (key==='desert' && location.pathname.startsWith('/tours/desert-safari'))) ? 'active' : ''}
        >{label}</Link>)}

        <div className={`nav-language ${lang?'is-open':''}`}>
          <button className="language-main" onClick={()=>setLang(v=>!v)} aria-expanded={lang} aria-haspopup="menu">
            {language === 'ar' ? 'اللغة' : 'Language'} <span>⌄</span>
          </button>
          <div className="language-menu main-language-menu" role="menu">
            {languages.map(item=><button
              type="button"
              role="menuitem"
              key={item.code}
              className={item.code===language?'selected':''}
              onClick={()=>{setLanguage(item.code);setLang(false)}}
            >
              <span>{item.label}</span>{item.code===language&&<b>✓</b>}
            </button>)}
          </div>
        </div>

        <a className="nav-book" href={site.whatsapp} target="_blank" rel="noreferrer" onClick={close}>
          {nav.book} <span>→</span>
        </a>
      </nav>
    </div>
  </header>;
}
