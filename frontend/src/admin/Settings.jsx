import React from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { api, setCsrf } from './api';
import { useAdmin } from './AdminApp';
import { AIcon, PageTitle, Message } from './ui';
import { socialPlatforms, SocialIcon } from '../components/SocialRail';
export default function Settings() {
  const [params, setParams] = useSearchParams(),
    tab = params.get('tab') || 'general';
  if (tab === 'reviews') return <Navigate to="/admin/reviews" replace />;
  return <><PageTitle eyebrow="MAKE THE STUDIO YOURS" title="Settings" description="Manage publishing, social profiles and your password." /><div className="cms-settings-layout"><nav className="cms-settings-nav" aria-label="Settings sections">{[['general', 'file', 'Publishing'], ['social', 'link', 'Social profiles'], ['security', 'settings', 'Password & security']].map(([key, icon, label]) => <button key={key} className={tab === key ? 'is-active' : ''} onClick={() => setParams({
          tab: key
        })}><AIcon name={icon} />{label}</button>)}</nav><div>{tab === 'security' ? <Security /> : <Preferences key={tab} social={tab === 'social'} />}</div></div></>;
}
function Preferences({
  social
}) {
  const [settings, setSettings] = React.useState(null),
    [busy, setBusy] = React.useState(false),
    [error, setError] = React.useState(''),
    [success, setSuccess] = React.useState('');
  React.useEffect(() => {
    api('admin/settings').then(r => setSettings(r.settings)).catch(e => setError(e.message));
  }, []);
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const r = await api('admin/settings', {
        method: 'PUT',
        body: social ? {
          socialLinks: settings.socialLinks
        } : {
          defaultAuthor: settings.defaultAuthor
        }
      });
      setSettings(r.settings);
      setSuccess(social ? 'Social profiles saved. Open or refresh the website to see your links.' : 'Publishing preferences saved.');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return <section className="cms-panel cms-panel-padding"><Message error={error} success={success} />{!settings ? <p>Loading settings…</p> : <form onSubmit={save}><div className="cms-settings-heading"><div><h2>{social ? 'Your social profiles' : 'Publishing preferences'}</h2><p>{social ? 'Add your official profile URLs. Saved profiles appear as icons on the left of your website.' : 'Choose the author name used for new blog posts.'}</p></div></div>{social ? <><div className="cms-social-note">Leave any field empty to hide that icon. On phones and tablets, visitors can open the links using the social button.</div>{socialPlatforms.map(([key, label]) => <label className="cms-field cms-social-field" key={key}><span><SocialIcon name={key} />{label}</span><input type="url" value={settings.socialLinks?.[key] || ''} placeholder={`https://${key === 'x' ? 'x' : key}.com/your-profile`} maxLength="500" onChange={e => {
            setSuccess('');
            setSettings(s => ({
              ...s,
              socialLinks: {
                ...s.socialLinks,
                [key]: e.target.value
              }
            }));
          }} /></label>)}</> : <><label className="cms-field">Default author name<input required maxLength="100" value={settings.defaultAuthor} onChange={e => setSettings(s => ({
            ...s,
            defaultAuthor: e.target.value
          }))} /></label><div className="cms-publishing-note"><h3>From draft to live guide</h3><p>Open Blog posts → New blog post. Add the title, summary, article and cover. Use Preview, then Publish.</p><p>Publishing creates the article page, search metadata and sitemap entry automatically. Drafts stay private.</p></div></>}<div className="cms-settings-actions"><button className="cms-btn cms-btn-primary" disabled={busy}>{busy ? 'Saving…' : social ? 'Save social profiles' : 'Save preferences'}</button></div></form>}</section>;
}
function Security() {
  const {
      admin
    } = useAdmin(),
    [busy, setBusy] = React.useState(false),
    [error, setError] = React.useState(''),
    [success, setSuccess] = React.useState('');
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget,
      body = Object.fromEntries(new FormData(form));
    if (body.newPassword !== body.confirm) {
      setError('The new passwords do not match.');
      return;
    }
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const r = await api('auth/password', {
        method: 'POST',
        body
      });
      setCsrf(r.csrfToken);
      setSuccess(r.message);
      form.reset();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return <section className="cms-panel cms-panel-padding"><div className="cms-settings-heading"><div><h2>Password & security</h2><p>Signed in as <strong>{admin.email}</strong>.</p></div></div><Message error={error} success={success} /><form onSubmit={submit}><label className="cms-field">Current password<input type="password" name="currentPassword" required autoComplete="current-password" maxLength="128" /></label><label className="cms-field">New password<input type="password" name="newPassword" required minLength="12" maxLength="128" autoComplete="new-password" /><small>Use at least 12 characters. A memorable, unique passphrase works well.</small></label><label className="cms-field">Confirm new password<input type="password" name="confirm" required minLength="12" maxLength="128" autoComplete="new-password" /></label><p className="cms-field-help">Changing your password signs out other active sessions.</p><div className="cms-settings-actions"><button className="cms-btn cms-btn-primary" disabled={busy}>{busy ? 'Updating…' : 'Update password'}</button></div></form></section>;
}
