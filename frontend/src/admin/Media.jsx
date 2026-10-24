import React from 'react';
import { api } from './api';
import { AIcon, PageTitle, Message, ImageUpload, Pagination, Empty, date } from './ui';
export default function Media() {
  const [data, setData] = React.useState(null),
    [page, setPage] = React.useState(1),
    [revision, setRevision] = React.useState(0),
    [error, setError] = React.useState(''),
    [success, setSuccess] = React.useState('');
  React.useEffect(() => {
    api('admin/media?page=' + page).then(setData).catch(e => setError(e.message));
  }, [page, revision]);
  async function remove(m) {
    if (!window.confirm(`Delete “${m.name}” from your image library?`)) return;
    try {
      await api('admin/media/' + m._id, {
        method: 'DELETE'
      });
      setRevision(v => v + 1);
      setError('');
      setSuccess('Image deleted.');
    } catch (e) {
      setError(e.message);
    }
  }
  return <><PageTitle eyebrow="YOUR VISUAL LIBRARY" title="Images that tell a story" description="Upload once. Use in your covers and articles whenever you need." /><Message error={error} success={success} />{data?.storage && <section className="cms-storage-summary"><div><span>Blog images stored</span><strong>{(data.storage.bytes / 1024 / 1024).toFixed(2)} MB</strong><small>{data.storage.count} images · image data only</small></div><div><span>Space saved by compression</span><strong>{data.storage.originalBytes ? Math.max(0, Math.round((1 - data.storage.bytes / data.storage.originalBytes) * 100)) : 0}%</strong><small>Original uploads are not stored</small></div><div><span>Smart uploads</span><strong>WebP</strong><small>Usually under 220 KB · 450 KB maximum</small></div><p>Your Atlas usage also includes posts, indexes and other data. Check Atlas for the total database size.</p></section>}<section className="cms-media-upload-panel"><ImageUpload label="Drop an image here, or choose a file" onUploaded={image => {
        setPage(1);
        setRevision(v => v + 1);
        setSuccess(image.reused ? 'Existing image reused — no extra storage used.' : 'Image uploaded and optimized.');
        setError('');
      }} /></section>{!data ? <p>Loading your images…</p> : !data.items.length ? <section className="cms-panel"><Empty title="A fresh canvas" text="Upload your first image to bring your next travel guide to life." /></section> : <><div className="cms-media-grid cms-media-page-grid">{data.items.map(m => <article className="cms-media-card" key={m._id}><a href={m.url} target="_blank" rel="noreferrer"><img src={m.url} alt={m.alt || m.name} loading="lazy" /></a><div><strong title={m.name}>{m.name}</strong><span>{m.width} × {m.height} · {Math.round(m.size / 1024)} KB</span><small>{date(m.createdAt)}</small><div className="cms-media-actions"><button className="cms-small-action" onClick={async () => {
                try {
                  await navigator.clipboard.writeText(m.url);
                  setSuccess('Image path copied.');
                  setError('');
                } catch {
                  setSuccess('Image path: ' + m.url);
                }
              }}>Copy image path</button><button className="cms-icon-btn cms-danger" onClick={() => remove(m)} aria-label={`Delete ${m.name}`}><AIcon name="trash" /></button></div></div></article>)}</div><Pagination page={page} pages={data.pages} onChange={setPage} /></>}</>;
}
