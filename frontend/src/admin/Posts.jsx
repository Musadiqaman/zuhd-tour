import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from './api';
import { AIcon, PageTitle, Message, Status, Pagination, Empty, date } from './ui';
export default function Posts() {
  const [params, setParams] = useSearchParams(),
    status = params.get('status') || 'all',
    [q, setQ] = React.useState(''),
    [search, setSearch] = React.useState(''),
    [page, setPage] = React.useState(1),
    [data, setData] = React.useState(null),
    [error, setError] = React.useState(''),
    [busy, setBusy] = React.useState(false),
    [revision, setRevision] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => {
      setSearch(q);
      setPage(1);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);
  React.useEffect(() => {
    let active = true;
    setError('');
    setBusy(true);
    api(`admin/posts?page=${page}&q=${encodeURIComponent(search)}&status=${status}`).then(r => {
      if (active) setData(r);
    }).catch(e => {
      if (active) setError(e.message);
    }).finally(() => {
      if (active) setBusy(false);
    });
    return () => {
      active = false;
    };
  }, [page, search, status, revision]);
  async function change(p, next) {
    if (!window.confirm(next === 'delete' ? `Permanently delete “${p.title}”?` : `${next === 'archived' ? 'Archive' : 'Unpublish'} “${p.title}”? It will no longer be public.`)) return;
    try {
      setError('');
      await api('admin/posts/' + p._id + (next === 'delete' ? '' : '/status'), {
        method: next === 'delete' ? 'DELETE' : 'PATCH',
        body: {
          version: p.version,
          status: next
        }
      });
      setRevision(v => v + 1);
    } catch (e) {
      setError(e.message);
    }
  }
  return <><PageTitle eyebrow="YOUR JOURNAL" title="Blog posts" description="Create, refine and publish your travel guides."><Link to="/admin/posts/new" className="cms-btn cms-btn-primary"><AIcon name="plus" />New blog post</Link></PageTitle><Message error={error} /><section className="cms-panel"><div className="cms-list-toolbar"><div className="cms-tabs" role="group" aria-label="Filter posts">{['all', 'published', 'draft', 'archived'].map(s => <button key={s} className={status === s ? 'is-active' : ''} onClick={() => {
            setParams(s === 'all' ? {} : {
              status: s
            });
            setPage(1);
          }}>{s === 'all' ? 'All posts' : s[0].toUpperCase() + s.slice(1)}</button>)}</div><label className="cms-search"><AIcon name="search" /><input type="search" aria-label="Search blog posts" placeholder="Search posts…" value={q} onChange={e => setQ(e.target.value)} /></label></div>{busy && !data ? <div className="cms-panel-padding" role="status">Loading posts…</div> : data?.items?.length ? <><div className={`cms-post-table ${busy ? 'is-loading' : ''}`}><div className="cms-table-head"><span>POST</span><span>STATUS</span><span>LAST UPDATED</span><span>ACTIONS</span></div>{data.items.map(p => <div className="cms-post-row" key={p._id}><Link to={`/admin/posts/${p._id}`} className="cms-post-title">{p.image ? <img src={p.image} alt="" /> : <span className="cms-post-placeholder"><AIcon name="file" /></span>}<span><strong>{p.title}</strong><small>{p.category}</small></span></Link><Status value={p.status} /><span className="cms-post-date">{date(p.updatedAt)}</span><div className="cms-row-actions"><Link className="cms-icon-btn" to={`/admin/posts/${p._id}`} aria-label={`Edit ${p.title}`}><AIcon name="edit" /></Link>{p.status === 'published' && <a className="cms-icon-btn" href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" aria-label={`View ${p.title}`}><AIcon name="eye" /></a>}{p.status !== 'archived' ? <button className="cms-small-action" onClick={() => change(p, 'archived')}>Archive</button> : <button className="cms-icon-btn cms-danger" onClick={() => change(p, 'delete')} aria-label={`Delete ${p.title}`}><AIcon name="trash" /></button>}</div></div>)}</div><div className="cms-list-footer"><span>{data.total} {data.total === 1 ? 'post' : 'posts'}</span><Pagination page={page} pages={data.pages} onChange={setPage} /></div></> : <Empty title={search ? 'No matching posts' : 'No posts here yet'} text={search ? 'Try a different search or change the status filter.' : 'Start with a useful guide your guests will enjoy.'}><Link to="/admin/posts/new" className="cms-btn cms-btn-primary">Create a post</Link></Empty>}</section></>;
}
