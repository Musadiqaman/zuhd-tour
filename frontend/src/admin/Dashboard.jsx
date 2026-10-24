import React from 'react';
import { Link } from 'react-router-dom';
import { api } from './api';
import { useAdmin } from './AdminApp';
import { AIcon, PageTitle, Status, Message, Empty, date } from './ui';
export default function Dashboard() {
  const {
      admin
    } = useAdmin(),
    [data, setData] = React.useState(null),
    [error, setError] = React.useState('');
  React.useEffect(() => {
    api('admin/dashboard').then(setData).catch(e => setError(e.message));
  }, []);
  return <><PageTitle eyebrow="YOUR CONTENT, AT A GLANCE" title={`Hello, ${admin.name.split(' ')[0]}.`} description="Write a blog post, add its photos, preview it, then publish."><Link className="cms-btn cms-btn-primary" to="/admin/posts/new"><AIcon name="plus" />New blog post</Link></PageTitle><Message error={error} /><div className="cms-stat-grid">{[['published', 'Published guides', 'file'], ['draft', 'Drafts in progress', 'edit'], ['archived', 'Archived posts', 'clock'], ['media', 'Library images', 'image']].map(([key, label, icon]) => <Link className="cms-stat-card" key={key} to={key === 'media' ? '/admin/media' : `/admin/posts?status=${key}`}><div><span>{label}</span><AIcon name={icon} /></div><strong>{data ? data.counts[key] : '—'}</strong><small>{key === 'published' ? 'Live on your website' : key === 'draft' ? 'Ready for your next edit' : key === 'archived' ? 'Stored safely, not public' : 'Ready to bring stories to life'}</small></Link>)}</div><div className="cms-dashboard-grid"><section className="cms-panel"><div className="cms-panel-heading"><h2>Recently edited</h2><Link to="/admin/posts">View all →</Link></div>{!data ? <div className="cms-panel-padding">Loading your posts…</div> : data.recent.length ? <div className="cms-recent-posts">{data.recent.map(p => <Link key={p._id} to={`/admin/posts/${p._id}`}><span className="cms-recent-image">{p.image ? <img src={p.image} alt="" /> : <AIcon name="file" />}</span><span className="cms-recent-copy"><strong>{p.title}</strong><small>{p.category} · {date(p.updatedAt)}</small></span><Status value={p.status} /></Link>)}</div> : <Empty title="Your next story starts here" text="Create a travel guide and share something helpful with your guests."><Link className="cms-btn cms-btn-primary" to="/admin/posts/new">Write a guide</Link></Empty>}</section><div className="cms-dashboard-side"><section className="cms-inspiration"><span className="cms-eyebrow">MAKE SOMETHING USEFUL</span><h2>Help your guests<br />picture the journey.</h2><p>Answer a real travel question, add useful photos and link to the relevant safari or tour.</p><Link className="cms-btn cms-btn-light" to="/admin/posts/new">Start writing <AIcon name="arrow" /></Link></section><Link className="cms-shortcut" to="/admin/reviews"><span className="cms-shortcut-icon">G</span><span><strong>Connect Google reviews</strong><small>Manage your business profile connection</small></span><AIcon name="arrow" /></Link></div></div></>;
}
