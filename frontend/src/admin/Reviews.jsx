import React from 'react';
import { api } from './api';
import { PageTitle, Message } from './ui';

export default function Reviews() {
  const [settings, setSettings] = React.useState(null);
  const [connection, setConnection] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  async function refresh() {
    setBusy(true); setError('');
    try {
      const [s, c] = await Promise.all([api('admin/settings'), api('admin/reviews')]);
      setSettings(s.settings); setConnection(c);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  React.useEffect(() => { refresh(); }, []);
  async function save(event) {
    event.preventDefault(); setBusy(true); setError(''); setSuccess('');
    try {
      const result = await api('admin/settings', { method: 'PUT', body: {
        googleMapsUrl: settings.googleMapsUrl, reviewsEnabled: settings.reviewsEnabled
      }});
      setSettings(result.settings);
      setSuccess(settings.reviewsEnabled ? 'Homepage review section is visible.' : 'Homepage review section is hidden.');
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  return <>
    <PageTitle eyebrow="GUEST FEEDBACK" title="Google reviews" description="Connect one Elfsight widget. New Google reviews then sync through that widget." />
    <Message error={error} success={success} />
    <div className="cms-reviews-layout">
      <section className="cms-panel cms-panel-padding">
        <div className="cms-settings-heading"><div><h2>One widget. One App ID.</h2><p>No Google Cloud API key or Place ID is needed here.</p></div><span className={`cms-connection-badge ${connection?.configured ? 'is-ready' : ''}`}>{connection?.configured ? 'App ID configured' : 'App ID needed'}</span></div>
        <div className="cms-setup-step"><span>1</span><div><h3>Create your Google Reviews widget</h3><p>In Elfsight, choose Google Reviews and connect the Zuhd Tours Google Maps link. Select a grid or carousel layout, with the rating and review buttons visible.</p><a className="cms-small-action" href="https://dash.elfsight.com/" target="_blank" rel="noopener noreferrer">Open Elfsight ↗</a></div></div>
        <div className="cms-setup-step"><span>2</span><div><h3>Publish and copy the App ID</h3><p>Click Publish → Install. From the embed code, copy only the ID after <code>elfsight-app-</code>.</p><p>Paste it into <code>ELFSIGHT_APP_ID</code> in <code>backend/.env</code>, then restart the backend. On hosted servers, set it in the backend’s environment settings and redeploy.</p></div></div>
        <div className="cms-setup-step"><span>3</span><div><h3>Check the website</h3><p>{connection?.message || 'Checking configuration…'}</p><div className="cms-review-buttons"><button className="cms-btn cms-btn-secondary" onClick={refresh} disabled={busy}>Recheck App ID</button><a className="cms-btn cms-btn-primary" href="/#google-reviews" target="_blank" rel="noopener noreferrer">Open homepage preview ↗</a></div></div></div>
      </section>
      <aside className="cms-panel cms-panel-padding cms-review-help"><span className="cms-eyebrow">AUTOMATIC UPDATES</span><h2>Your Google profile stays the source.</h2><p>Customers post reviews on Google. Elfsight checks that profile and updates the website widget automatically.</p><p>New reviews can take up to 72 hours to appear because Elfsight uses a cache. Check the widget’s source, filters and monthly view allowance if reviews are missing.</p><p>Review data is not stored in your MongoDB database.</p><a className="cms-small-action" href="https://help.elfsight.com/article/168-why-my-reviews-are-not-being-updated" target="_blank" rel="noopener noreferrer">How review updates work ↗</a><small>App ID configured means the identifier is present. The widget must also be published and active in your Elfsight account.</small></aside>
    </div>
    <section className="cms-panel cms-panel-padding cms-review-visibility">
      <h2>Homepage display</h2>
      {!settings ? <p>Loading settings…</p> : <form onSubmit={save}>
        <label className="cms-field">Your verified Google Maps link<input type="url" required value={settings.googleMapsUrl} onChange={e => setSettings(s => ({ ...s, googleMapsUrl: e.target.value }))} /></label>
        <label className="cms-switch-row"><span><strong>Show the review section</strong><small>The Google Maps link remains available if the widget cannot load.</small></span><input type="checkbox" checked={settings.reviewsEnabled} onChange={e => setSettings(s => ({ ...s, reviewsEnabled: e.target.checked }))} /></label>
        <button className="cms-btn cms-btn-primary" disabled={busy}>Save display settings</button>
      </form>}
    </section>
  </>;
}
