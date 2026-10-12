import React from 'react';
import { safaris, cityTours, transferServices, whatsappLink } from '../data/experienceCatalog';
import { Icon } from './ExperienceUI';

export function buildEnquiryMessage(fields, {transfer=false,defaultTour=''}={}) {
  const labels=transfer?{name:'Name',phone:'Phone',email:'Email',service:'Transfer',date:'Travel date',time:'Pickup time',guests:'Passengers',pickup:'Pickup',dropoff:'Drop-off',flight:'Flight number',vehicle:'Vehicle',luggage:'Luggage',message:'Special requests'}:{name:'Name',phone:'Phone',email:'Email',service:'Experience',date:'Travel date',guests:'Guests',children:'Children and ages',pickup:'Pickup',message:'Message'};
  const lines=[`Hello Zuhd Tours, I would like to request ${transfer?'a transfer':'a tour'}.`];
  for(const [key,label]of Object.entries(labels)){const value=String(fields[key]|| (key==='service'?defaultTour:'')).trim();if(value)lines.push(`${label}: ${value}`);}
  lines.push('Please confirm availability, the final price, inclusions and booking terms.');
  return lines.join('\n');
}
export default function EnquiryForm({transfer=false,defaultTour='',id='enquiry-form'}) {
  const [link,setLink]=React.useState('');
  const selected=transfer?transferServices.map(x=>x.title):[...safaris,...cityTours].map(x=>x.title);
  if(defaultTour&&!selected.includes(defaultTour))selected.unshift(defaultTour);
  const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const [minDate,setMinDate]=React.useState('');React.useEffect(()=>setMinDate(today()),[]);
  function submit(e){e.preventDefault();const fields=Object.fromEntries(new FormData(e.currentTarget));const url=whatsappLink(buildEnquiryMessage(fields,{transfer,defaultTour}));setLink(url);window.open(url,'_blank','noopener,noreferrer');}
  return <form id={id} className="exp-form" onSubmit={submit}>
    <label>Full name<input name="name" autoComplete="name" required placeholder="Your name" maxLength="120"/></label>
    <label>Phone / WhatsApp<input name="phone" type="tel" autoComplete="tel" required placeholder="Include country code" maxLength="40"/></label>
    <label>Email <span>(optional)</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com"/></label>
    <label>{transfer?'Transfer type':'Your experience'}<select name="service" defaultValue={defaultTour} required><option value="" disabled>Choose an option</option>{selected.map(title=><option key={title} value={title}>{title}</option>)}{!transfer&&<option>Other / custom itinerary</option>}</select></label>
    <label>Travel date<input name="date" type="date" required min={minDate}/></label>
    {transfer&&<label>Pickup time<input name="time" type="time" required/></label>}
    <label>{transfer?'Passengers':'Number of guests'}<input name="guests" type="number" min="1" max="999" required defaultValue="2"/></label>
    {!transfer&&<label>Children & ages <span>(optional)</span><input name="children" placeholder="e.g. 2 children, ages 5 and 9" maxLength="120"/></label>}
    <label>Pickup location<input name="pickup" placeholder="Hotel, airport or address" required maxLength="250"/></label>
    {transfer&&<><label>Drop-off location<input name="dropoff" placeholder="Hotel, airport or destination" required maxLength="250"/></label><label>Flight number <span>(if applicable)</span><input name="flight" placeholder="e.g. EK 202" maxLength="40"/></label><label>Vehicle preference<select name="vehicle" defaultValue="Please advise"><option>Please advise</option><option>Sedan — 1–3 passengers</option><option>SUV — 1–5 passengers</option><option>Van — 1–10 passengers</option><option>Luxury vehicle — on request</option></select></label><label>Luggage<select name="luggage" defaultValue="1–2 bags"><option>1–2 bags</option><option>3–4 bags</option><option>5+ bags</option><option>No checked luggage</option></select></label></>}
    <label className="exp-form-wide">{transfer?'Special requests':'Anything else?'} <span>(optional)</span><textarea name="message" rows="3" maxLength="1500" placeholder={transfer?'Return trip, child seats, extra stops…':'Preferred pickup, dietary needs or a private tour…'}/></label>
    <div className="exp-form-wide exp-form-footer"><button type="submit" className="exp-btn exp-btn-navy">Continue on WhatsApp <Icon name="chat"/></button><p>We’ll prepare your message. You review and send it in WhatsApp. This is an enquiry; no payment or booking is made here.</p></div>
    {link&&<p className="exp-form-wide exp-form-status" role="status">Your message is ready. If WhatsApp did not open, <a href={link} target="_blank" rel="noreferrer">open your enquiry here</a>.</p>}
  </form>;
}
