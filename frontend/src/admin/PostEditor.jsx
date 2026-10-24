import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { api } from './api';
import { AIcon, Message, Status, ImageUpload, MediaPicker, date } from './ui';
import { site } from '../data/siteConfig';
import { safaris, cityTours } from '../data/experienceCatalog';
const blank = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'Travel Tips',
  tags: [],
  image: '',
  imageAlt: '',
  author: 'Zuhd Tours Team',
  seoTitle: '',
  seoDescription: '',
  status: 'draft',
  version: 1
};
const slugify = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100);
export default function PostEditor() {
  const {
      id
    } = useParams(),
    navigate = useNavigate(),
    [post, setPost] = React.useState({
      ...blank
    }),
    [loading, setLoading] = React.useState(id !== 'new'),
    [busy, setBusy] = React.useState(false),
    [dirty, setDirty] = React.useState(false),
    [error, setError] = React.useState(''),
    [success, setSuccess] = React.useState(''),
    [preview, setPreview] = React.useState(false),
    [picker, setPicker] = React.useState(false),
    [slugTouched, setSlugTouched] = React.useState(false);
  const editor = React.useRef(),
    savedId = React.useRef(null);
  const locked = Boolean(post.publishedAt || post.seedKey);
  React.useEffect(() => {
    let active = true;
    if (id === 'new') {
      setPost({
        ...blank
      });
      setLoading(false);
      setDirty(false);
      setSlugTouched(false);
      api('admin/settings').then(r => {
        if (active) setPost(p => ({
          ...p,
          author: r.settings.defaultAuthor
        }));
      }).catch(() => {});
      return () => {
        active = false;
      };
    }
    if (savedId.current === id) return;
    setLoading(true);
    api('admin/posts/' + id).then(r => {
      if (active) {
        setPost(r.post);
        setDirty(false);
        setError('');
      }
    }).catch(e => {
      if (active) setError(e.message);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);
  React.useEffect(() => {
    if (!dirty) return;
    const unload = e => {
      e.preventDefault();
      e.returnValue = '';
    };
    const navigateAway = e => {
      const a = e.target.closest('a');
      if (a && a.target !== '_blank' && a.pathname !== window.location.pathname && a.origin === window.location.origin && !window.confirm('You have unsaved changes. Leave this guide?')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('beforeunload', unload);
    document.addEventListener('click', navigateAway, true);
    return () => {
      window.removeEventListener('beforeunload', unload);
      document.removeEventListener('click', navigateAway, true);
    };
  }, [dirty]);
  function change(name, value) {
    setPost(p => ({
      ...p,
      [name]: value,
      ...(name === 'title' && id === 'new' && !slugTouched ? {
        slug: slugify(value)
      } : {})
    }));
    setDirty(true);
    setSuccess('');
  }
  async function save(status) {
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const result = await api('admin/posts' + (id === 'new' ? '' : '/' + id), {
        method: id === 'new' ? 'POST' : 'PUT',
        body: {
          ...post,
          status
        }
      });
      savedId.current = String(result.post._id);
      setPost(result.post);
      setDirty(false);
      setSuccess(status === 'published' ? 'Published. Your guide is live on the website.' : status === 'draft' ? 'Draft saved. It is only visible in your studio.' : 'Changes saved.');
      if (id === 'new') navigate('/admin/posts/' + result.post._id, {
        replace: true
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  function insert(before, after = '', placeholder = 'text') {
    const el = editor.current,
      start = el?.selectionStart ?? post.content.length,
      end = el?.selectionEnd ?? start,
      selected = post.content.slice(start, end) || placeholder;
    change('content', post.content.slice(0, start) + before + selected + after + post.content.slice(end));
    requestAnimationFrame(() => {
      editor.current?.focus();
      editor.current?.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }
  function chooseImage(image) {
    change('image', image.url);
    change('imageAlt', image.alt || '');
  }
  if (loading) return <div className="cms-panel cms-panel-padding">Loading your guide…</div>;
  if (error && !post.title && id !== 'new') return <Message error={error} />;
  const words = post.content.trim().split(/\s+/).filter(Boolean).length,
    html = DOMPurify.sanitize(marked.parse(post.content || ''));
  return <div className="cms-editor"><div className="cms-editor-heading"><div><Link to="/admin/posts" className="cms-back">← Blog posts</Link><h1>{id === 'new' ? 'Create a blog post' : 'Edit your blog post'}</h1><div className="cms-editor-state"><Status value={post.status} /><span>{dirty ? 'Unsaved changes' : post.updatedAt ? 'Saved ' + date(post.updatedAt) : 'Start with a title and make it yours.'}</span></div></div><div className="cms-editor-actions">{post.status === 'published' ? <><a className="cms-btn cms-btn-secondary" href={`/blog/${post.slug}`} target="_blank" rel="noreferrer"><AIcon name="eye" />View live</a><button className="cms-btn cms-btn-primary" disabled={busy} onClick={() => save('published')}>{busy ? 'Saving…' : 'Save changes'}</button></> : <><button className="cms-btn cms-btn-secondary" disabled={busy} onClick={() => save('draft')}>{busy ? 'Saving…' : 'Save draft'}</button><button className="cms-btn cms-btn-primary" disabled={busy} onClick={() => save('published')}><AIcon name="check" />Publish</button></>}</div></div><Message error={error} success={success} /><ol className="cms-editor-steps" aria-label="Publishing steps"><li><b>1</b> Add a title and summary</li><li><b>2</b> Write and add photos</li><li><b>3</b> Preview, then publish</li></ol><div className="cms-editor-grid"><div className="cms-editor-main"><section className="cms-panel cms-panel-padding"><label className="cms-field">Post title<input className="cms-title-input" aria-label="Post title" value={post.title} onChange={e => change('title', e.target.value)} placeholder="Give your next adventure a title…" maxLength="180" /></label><label className="cms-field">Page URL<div className="cms-slug-field"><span>/blog/</span><input aria-label="Page URL slug" value={post.slug} readOnly={locked} onChange={e => {
                setSlugTouched(true);
                change('slug', slugify(e.target.value));
              }} placeholder="your-travel-guide" maxLength="100" /></div><small>{locked ? 'This published URL stays fixed so existing links keep working.' : 'A short, descriptive URL for your guide.'}</small></label><label className="cms-field">Short summary<textarea aria-label="Short summary" rows="3" value={post.excerpt} onChange={e => change('excerpt', e.target.value)} maxLength="500" placeholder="Tell readers what they will learn…" /><small>Used on the blog listing and as the default search description.</small></label></section><section className="cms-panel cms-writing-panel"><div className="cms-writing-heading"><h2>Article content</h2><div className="cms-segmented"><button className={!preview ? 'is-active' : ''} onClick={() => setPreview(false)}>Write</button><button className={preview ? 'is-active' : ''} onClick={() => setPreview(true)}><AIcon name="eye" />Preview</button></div></div>{!preview ? <><div className="cms-editor-toolbar" role="toolbar" aria-label="Article formatting"><button onClick={() => insert('**', '**')} aria-label="Bold selected text"><b>B</b></button><button onClick={() => insert('*', '*')} aria-label="Italic selected text"><i>I</i></button><button onClick={() => insert('\n\n## ', '\n\n', 'Your heading')} aria-label="Insert heading">H2</button><button onClick={() => insert('\n- ', '\n', 'List item')} aria-label="Insert bullet list">☷</button><button onClick={() => insert('[', '](https://example.com)', 'link text')} aria-label="Insert link"><AIcon name="link" /></button><button onClick={() => insert('\n\n> ', '\n\n', 'Your quote')} aria-label="Insert quote">❝</button><label className="cms-inline-image-button" aria-label="Insert uploaded image"><AIcon name="image" /><input type="file" accept="image/jpeg,image/png,image/webp" onChange={async e => {
                  const file = e.target.files[0];
                  e.target.value = '';
                  if (!file) return;
                  if (file.size > 4 * 1024 * 1024) {
                    setError('Choose an image smaller than 4 MB.');
                    return;
                  }
                  try {
                    const body = new FormData();
                    body.append('image', file);
                    const r = await api('admin/media', {
                      method: 'POST',
                      body
                    });
                    insert('\n\n![', `](${r.image.url})\n\n`, 'Describe this image');
                  } catch (err) {
                    setError(err.message);
                  }
                }} /></label></div><textarea ref={editor} className="cms-body-editor" aria-label="Article content" value={post.content} onChange={e => change('content', e.target.value)} placeholder="Start your story here…&#10;&#10;Use the toolbar for headings, lists and links. Switch to Preview to see how your article will look." spellCheck /></> : <div className="cms-article-preview journal-body">{post.content ? <div dangerouslySetInnerHTML={{
              __html: html
            }} /> : <p>Your article preview will appear here as you write.</p>}</div>}<div className="cms-editor-footnote"><span>{words.toLocaleString()} words · about {Math.max(1, Math.ceil(words / 200))} min read</span><span>Use H2 for headings, B for bold and Preview to check the layout.</span></div></section><section className="cms-panel cms-panel-padding"><div className="cms-panel-heading cms-panel-heading-inline"><div><span className="cms-eyebrow">HELP READERS FIND YOUR GUIDE</span><h2>Search appearance</h2></div><AIcon name="search" /></div><div className="cms-search-preview"><small>{site.domain}/blog/{post.slug || 'your-travel-guide'}</small><strong>{post.seoTitle || post.title || 'Your article title'} | Zuhd Tours</strong><p>{post.seoDescription || post.excerpt || 'Add a clear summary of what readers can expect from your guide.'}</p></div><p className="cms-field-help">A preview only. Search engines may choose different text.</p><label className="cms-field">SEO title<input value={post.seoTitle} onChange={e => change('seoTitle', e.target.value)} maxLength="100" placeholder={post.title || 'Uses your post title when empty'} /><small>{post.seoTitle.length} characters</small></label><label className="cms-field">Meta description<textarea rows="3" value={post.seoDescription} onChange={e => change('seoDescription', e.target.value)} maxLength="220" placeholder={post.excerpt || 'Uses your summary when empty'} /><small>{post.seoDescription.length} characters</small></label></section></div><aside className="cms-editor-side"><section className="cms-panel cms-panel-padding"><h2>Cover image</h2>{post.image ? <div className="cms-cover-preview"><img src={post.image} alt={post.imageAlt || 'Cover preview'} /><button className="cms-icon-btn" onClick={() => {
              change('image', '');
              change('imageAlt', '');
            }} aria-label="Remove cover image"><AIcon name="close" /></button></div> : null}<ImageUpload onUploaded={chooseImage} label={post.image ? 'Replace image' : 'Add a cover image'} /><button className="cms-btn cms-btn-secondary cms-btn-block" onClick={() => setPicker(true)}><AIcon name="image" />Choose from library</button><label className="cms-field">Image description (alt text)<input value={post.imageAlt} onChange={e => change('imageAlt', e.target.value)} maxLength="200" placeholder="Describe what is in the photo" /><small>Helps readers using screen readers and search engines.</small></label></section><section className="cms-panel cms-panel-padding"><h2>Post details</h2><label className="cms-field">Category<input value={post.category} onChange={e => change('category', e.target.value)} maxLength="60" list="cms-categories" /><datalist id="cms-categories">{['Desert Safari', 'Adventure', 'City Tours', 'Camping', 'Travel Tips', 'Nature', 'Transfers'].map(c => <option key={c} value={c} />)}</datalist></label><label className="cms-field">Author<input value={post.author} onChange={e => change('author', e.target.value)} maxLength="100" /></label><label className="cms-field">Topics<input value={(post.tags || []).join(', ')} onChange={e => change('tags', e.target.value.split(',').slice(0, 8).map(s => s.trimStart()))} placeholder="Dubai, safari, family" /><small>Separate topics with commas (up to 8).</small></label></section><section className="cms-panel cms-panel-padding"><h2>Connect the journey</h2><p className="cms-field-help">Add a relevant tour link where it helps your reader.</p><label className="cms-field">Insert a tour link<select value="" onChange={e => {
              const tour = [...safaris, ...cityTours].find(t => t.path === e.target.value);
              if (tour) {
                setPreview(false);
                change('content', post.content + `\n\n[${tour.title}](${tour.path})\n`);
              }
            }}><option value="">Choose an experience…</option>{[...safaris, ...cityTours].map(t => <option key={t.slug} value={t.path}>{t.title}</option>)}</select></label></section>{post.status === 'published' && <section className="cms-panel cms-panel-padding"><h2>Publishing</h2><p className="cms-field-help">Unpublishing removes this article from the website and sitemap.</p><button className="cms-btn cms-btn-secondary cms-btn-block" disabled={busy} onClick={() => {
            if (window.confirm('Unpublish this guide? It will become a private draft.')) save('draft');
          }}>Unpublish to draft</button></section>}</aside></div>{picker && <MediaPicker onChoose={chooseImage} onClose={() => setPicker(false)} />}</div>;
}
