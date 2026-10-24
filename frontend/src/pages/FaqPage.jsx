import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { faqGroups, faqSchema } from '../data/faqData';
import { imagery } from '../data/experienceCatalog';
import { PageIntro, FaqList, BookingCta, Icon } from '../components/ExperienceUI';
export default function FaqPage() {
  const [query, setQuery] = React.useState('');
  const filtered = faqGroups.map(g => ({
    ...g,
    items: g.items.filter(pair => pair.join(' ').toLowerCase().includes(query.trim().toLowerCase()))
  })).filter(g => g.items.length);
  return <div className="experience-page"><SEO title="FAQs: Dubai Safaris, City Tours & Transfers | Zuhd Tours" description="Find answers about Dubai safari prices, hotel pickup, city tours, private transfers, children, booking enquiries and payment arrangements with Zuhd Tours." path="/faqs" image={imagery.desert} breadcrumbs={[{
      name: 'Home',
      path: '/'
    }, {
      name: 'FAQs',
      path: '/faqs'
    }]} schema={[faqSchema(faqGroups.flatMap(g => g.items))]} /><PageIntro eyebrow="GOOD QUESTIONS. CLEAR ANSWERS." title="Frequently asked questions." description="Everything you need to start planning your desert safari, city tour or transfer. If your question is more specific, our team is a message away." breadcrumbs={[["FAQs"]]} /><section className="exp-section exp-sand"><div className="container"><div className="exp-faq-search"><label htmlFor="faq-search">What would you like to know?</label><div><input id="faq-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try pickup, children, prices or transfer…" autoComplete="off" />{query && <button type="button" onClick={() => setQuery('')}>Clear</button>}</div></div><div className="exp-faq-layout"><aside className="exp-faq-topics"><span className="exp-eyebrow">BROWSE BY TOPIC</span>{faqGroups.map(g => <a href={`#faq-${g.id}`} key={g.id} onClick={() => setQuery('')}>{g.title}<Icon /></a>)}<Link className="exp-faq-help" to="/contact">Need a hand?<br /><strong>Contact our team ↗</strong></Link></aside><div><p className="exp-faq-result" role="status">{query ? `${filtered.reduce((n, g) => n + g.items.length, 0)} answers matching “${query}”` : ''}</p>{filtered.map(g => <section className="exp-faq-group" id={`faq-${g.id}`} key={g.id}><h2>{g.title}</h2><p>{g.intro}</p><FaqList items={g.items} /></section>)}{!filtered.length && <div className="exp-empty"><h2>No matching questions yet.</h2><p>Try a shorter phrase, browse the topics or send your question to our team.</p><button type="button" className="exp-btn exp-btn-navy" onClick={() => setQuery('')}>Show all questions</button></div>}</div></div></div></section><BookingCta title="Still have a question? Let’s talk." /></div>;
}
