import React from 'react';
import { Link } from 'react-router-dom';
import { api } from './api';
export function AIcon({
  name = 'grid',
  ...props
}) {
  const icons = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    file: <><path d="M14 3H5v18h14V8Z" /><path d="M14 3v5h5M8 12h8M8 16h6" /></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="2" /><path d="m3 17 6-6 4 4 3-3 5 5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m9 3 1-1h4l1 3 3 1 3 2-1 3v3l1 3-3 2-3 1-1 2h-4l-1-3-3-1-3-2 1-3v-3L3 7l3-2Z" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    logout: <><path d="M9 3H4v18h5M14 7l5 5-5 5M8 12h11" /></>,
    search: <><circle cx="10.5" cy="10.5" r="7" /><path d="m16 16 5 5" /></>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    edit: <><path d="m4 16 12-12 4 4L8 20H4Z" /><path d="m13 7 4 4" /></>,
    trash: <><path d="M3 6h18M8 6V3h8v3M6 6l1 15h10l1-15M10 10v7m4-7v7" /></>,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    link: <><path d="m10 13 4-4M8 16l-2 2a4 4 0 0 1-6-6l4-4m12 0 2-2a4 4 0 0 1 6 6l-4 4" /></>,
    upload: <><path d="M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6" /></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{icons[name] || icons.grid}</svg>;
}
export function Message({
  error,
  success
}) {
  return error ? <div className="cms-message cms-message-error" role="alert">{error}</div> : success ? <div className="cms-message cms-message-success" role="status"><AIcon name="check" />{success}</div> : null;
}
export function Status({
  value
}) {
  return <span className={`cms-status cms-status-${value}`}>{value}</span>;
}
export function PageTitle({
  eyebrow,
  title,
  description,
  children
}) {
  return <div className="cms-page-title"><div>{eyebrow && <span className="cms-eyebrow">{eyebrow}</span>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{children}</div>;
}
export function Pagination({
  page,
  pages,
  onChange
}) {
  if (pages <= 1) return null;
  return <nav className="cms-pagination" aria-label="Pagination"><button className="cms-btn cms-btn-secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>← Previous</button><span>Page {page} of {pages}</span><button className="cms-btn cms-btn-secondary" disabled={page >= pages} onClick={() => onChange(page + 1)}>Next →</button></nav>;
}
export function Empty({
  title,
  text,
  children
}) {
  return <div className="cms-empty"><span className="cms-empty-icon"><AIcon name="file" /></span><h2>{title}</h2><p>{text}</p>{children}</div>;
}
export const date = value => value ? new Date(value).toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
}) : '—';
export function ImageUpload({
  onUploaded,
  label = 'Upload image',
  children
}) {
  const [busy, setBusy] = React.useState(false),
    [error, setError] = React.useState(''),
    [success, setSuccess] = React.useState('');
  async function upload(file) {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setError('Choose an image smaller than 4 MB.');
      return;
    }
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const body = new FormData();
      body.append('image', file);
      const r = await api('admin/media', {
        method: 'POST',
        body
      });
      onUploaded(r.image);
      setSuccess(`${r.image.reused ? 'Reused existing image' : 'Optimized to WebP'} · ${Math.ceil(r.image.size / 1024)} KB`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return <div className="cms-upload-wrap"><label className={`cms-upload ${busy ? 'is-busy' : ''}`} onDragOver={e => e.preventDefault()} onDrop={e => {
      e.preventDefault();
      if (!busy) upload(e.dataTransfer.files[0]);
    }}><input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e => {
        upload(e.target.files?.[0]);
        e.target.value = '';
      }} /><AIcon name="upload" /><strong>{busy ? 'Uploading…' : label}</strong><span>JPG, PNG or WebP · up to 4 MB</span>{children}</label><small className="cms-upload-policy">Automatically resized and compressed. Originals are not stored.</small><Message error={error} success={success} /></div>;
}
export function MediaPicker({
  onChoose,
  onClose
}) {
  const dialog = React.useRef(),
    [data, setData] = React.useState(null),
    [page, setPage] = React.useState(1),
    [error, setError] = React.useState('');
  React.useEffect(() => {
    dialog.current.showModal();
    return () => dialog.current?.close();
  }, []);
  React.useEffect(() => {
    api('admin/media?page=' + page).then(setData).catch(e => setError(e.message));
  }, [page]);
  return <dialog ref={dialog} className="cms-media-dialog" onCancel={onClose} aria-labelledby="media-dialog-title"><div className="cms-dialog-heading"><h2 id="media-dialog-title">Choose an image</h2><button className="cms-icon-btn" onClick={onClose} aria-label="Close image library"><AIcon name="close" /></button></div><Message error={error} />{!data ? <p>Loading your images…</p> : !data.items.length ? <Empty title="Your library is empty" text="Upload a cover image from the editor to get started." /> : <div className="cms-media-grid">{data.items.map(m => <button key={m._id} className="cms-media-choice" onClick={() => {
        onChoose(m);
        onClose();
      }}><img src={m.url} alt={m.alt || m.name} /><span>{m.name}</span></button>)}</div>}<Pagination page={page} pages={data?.pages || 1} onChange={setPage} /></dialog>;
}
