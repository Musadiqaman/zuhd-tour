import React from 'react';
import { Routes, Route, Link, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api, setCsrf } from './api';
import { AIcon, Message } from './ui';
import Dashboard from './Dashboard';
import Posts from './Posts';
import PostEditor from './PostEditor';
import Media from './Media';
import Settings from './Settings';
import Reviews from './Reviews';
import './admin.css';
const Auth = React.createContext(null);
export const useAdmin = () => React.useContext(Auth);
export default function AdminApp() {
  const [state, setState] = React.useState({
    loading: true,
    admin: null,
    initialized: true,
    setupEnabled: false,
    error: ''
  });
  React.useEffect(() => {
    document.body.classList.add('cms-active');
    let active = true;
    (async () => {
      try {
        const r = await api('auth/me');
        if (active) {
          setCsrf(r.csrfToken);
          setState({
            loading: false,
            admin: r.admin,
            initialized: true,
            error: ''
          });
        }
      } catch (e) {
        try {
          const r = await api('auth/status');
          if (active) setState({
            ...r,
            loading: false,
            admin: null,
            error: ''
          });
        } catch (err) {
          if (active) setState(s => ({
            ...s,
            loading: false,
            error: err.message
          }));
        }
      }
    })();
    return () => {
      active = false;
      document.body.classList.remove('cms-active');
    };
  }, []);
  function signedIn(r) {
    setCsrf(r.csrfToken);
    setState({
      loading: false,
      admin: r.admin,
      initialized: true,
      error: ''
    });
  }
  async function signOut() {
    await api('auth/logout', {
      method: 'POST'
    });
    setCsrf('');
    setState(s => ({
      ...s,
      admin: null
    }));
  }
  return <Auth.Provider value={{
    ...state,
    signedIn,
    signOut
  }}><div className="cms" dir="ltr" lang="en"><Helmet><title>Zuhd Tours — Content Studio</title><meta name="robots" content="noindex,nofollow" /></Helmet>{state.loading ? <div className="cms-loading"><img src="/images/brand/zuhd-tours-logo-clear.webp" alt="Zuhd Tours" /><span>Opening Content Studio…</span></div> : state.admin ? <AdminShell /> : <SignIn />}</div></Auth.Provider>;
}
function SignIn() {
  const auth = useAdmin(),
    setup = !auth.initialized,
    navigate = useNavigate(),
    location = useLocation(),
    [error, setError] = React.useState(''),
    [busy, setBusy] = React.useState(false),
    [show, setShow] = React.useState(false);
  async function submit(e) {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget));
    if (setup && values.password !== values.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      auth.signedIn(await api('auth/' + (setup ? 'setup' : 'login'), {
        method: 'POST',
        body: values
      }));
      navigate('/admin', {
        replace: true
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  if (setup && location.pathname !== '/admin/setup' && !auth.error) return <Navigate to="/admin/setup" replace />;
  if (!setup && location.pathname === '/admin/setup') return <Navigate to="/admin/login" replace />;
  return <div className="cms-auth"><div className="cms-auth-story"><Link to="/" className="cms-auth-logo"><img src="/images/brand/zuhd-tours-logo-clear.webp" alt="Zuhd Tours" /></Link><div><span className="cms-eyebrow">ZUHD TOURS · CONTENT STUDIO</span><h1>Every great trip<br />starts with a story.</h1><p>Share your knowledge. Inspire the next adventure.</p></div><Link to="/">← Back to the website</Link></div><main className="cms-auth-main"><div className="cms-auth-card"><span className="cms-eyebrow">YOUR PUBLISHING SPACE</span><h2>{setup ? 'Set up your studio' : 'Welcome back.'}</h2><p>{setup ? 'Create your private administrator account.' : 'Sign in to manage your guides, images and website content.'}</p><Message error={error || auth.error} />{setup && !auth.setupEnabled && <Message error="Ask your website administrator to enable the private setup code before creating your account." />}<form onSubmit={submit}>{setup && <label>Your name<input name="name" autoComplete="name" maxLength="80" required placeholder="Your name" /></label>}<label>Email address<input name="email" type="email" autoComplete="username" required placeholder="you@example.com" /></label><label>Password<div className="cms-password-field"><input name="password" type={show ? 'text' : 'password'} minLength={setup ? 12 : 1} maxLength="128" required autoComplete={setup ? 'new-password' : 'current-password'} placeholder={setup ? 'At least 12 characters' : 'Enter your password'} /><button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'}><AIcon name="eye" /></button></div></label>{setup && <><label>Confirm password<input name="confirm" type="password" autoComplete="new-password" minLength="12" maxLength="128" required /></label><label>Private setup code<input name="setupToken" type="password" autoComplete="off" required /><small>Use the setup code supplied by your website administrator.</small></label></>}<button className="cms-btn cms-btn-primary cms-btn-block" disabled={busy || Boolean(auth.error) || setup && !auth.setupEnabled}>{busy ? 'Please wait…' : setup ? 'Create administrator account' : 'Sign in'}<AIcon name="arrow" /></button></form><p className="cms-auth-help">Need access? Contact your website administrator.</p><div className="cms-auth-footer">Zuhd Tours · Dubai, United Arab Emirates</div></div></main></div>;
}
function AdminShell() {
  const {
      admin,
      signOut
    } = useAdmin(),
    [open, setOpen] = React.useState(false),
    [error, setError] = React.useState(''),
    location = useLocation();
  React.useEffect(() => setOpen(false), [location.pathname]);
  React.useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const fn = e => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', fn);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener('keydown', fn);
    };
  }, [open]);
  const links = [['/admin', 'grid', 'Overview'], ['/admin/posts', 'file', 'Blog posts'], ['/admin/media', 'image', 'Media library'], ['/admin/reviews', 'link', 'Google reviews'], ['/admin/settings', 'settings', 'Settings']];
  return <div className="cms-shell">{open && <button className="cms-sidebar-backdrop" aria-label="Close menu" onClick={() => setOpen(false)} />}<aside className={`cms-sidebar ${open ? 'is-open' : ''}`}><Link to="/admin" className="cms-sidebar-brand"><img src="/images/brand/zuhd-tours-logo-clear.webp" alt="Zuhd Tours" /><span>Content Studio<small>ZUHD TOURS</small></span></Link><span className="cms-nav-label">WORKSPACE</span><nav aria-label="Admin navigation">{links.map(([to, icon, label]) => <NavLink key={to} to={to} end={to === '/admin'}><AIcon name={icon} />{label}</NavLink>)}</nav><div className="cms-sidebar-bottom"><a href="/" target="_blank" rel="noreferrer">View website <span>↗</span></a><div className="cms-admin-profile"><span className="cms-avatar">{admin.name.slice(0, 1).toUpperCase()}</span><div><strong>{admin.name}</strong><small>Administrator</small></div><button className="cms-icon-btn" onClick={() => signOut().catch(e => setError(e.message))} aria-label="Sign out"><AIcon name="logout" /></button></div></div></aside><div className="cms-workspace"><header className="cms-topbar"><div><button className="cms-icon-btn cms-mobile-toggle" onClick={() => setOpen(s => !s)} aria-label={open ? 'Close admin navigation' : 'Open admin navigation'} aria-expanded={open}><AIcon name={open ? 'close' : 'menu'} /></button><span>Workspace <b>/</b> {location.pathname.includes('/reviews') ? 'Google reviews' : location.pathname.includes('/settings') ? 'Settings' : location.pathname.includes('/media') ? 'Media' : location.pathname.includes('/posts') ? 'Blog posts' : 'Overview'}</span></div><a href="/" target="_blank" rel="noreferrer">Visit website ↗</a></header><main className="cms-main"><Message error={error} /><Routes><Route path="/admin" element={<Dashboard />} /><Route path="/admin/posts" element={<Posts />} /><Route path="/admin/posts/:id" element={<PostEditor />} /><Route path="/admin/media" element={<Media />} /><Route path="/admin/reviews" element={<Reviews />} /><Route path="/admin/settings" element={<Settings />} /><Route path="*" element={<Navigate to="/admin" replace />} /></Routes></main></div></div>;
}
