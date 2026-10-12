import media from './referenceMedia.js';
import { site } from './siteConfig.js';

// Prices and package facts checked against the client-supplied reference on 11 October 2026.
// A starting price is an enquiry price, not a live inventory or payment confirmation.
export const imagery = {
  desert: media['/'].images[0].src,
  city: media['/'].images[1].src,
  transfer: media['/'].images[2].src,
  hotel: media['/transfers/'].images[2].src,
};

function safari(id, slug, details) {
  const source = `/desert-safari/${id}`;
  return {
    id, slug, path: `/tours/${slug}`, category: 'Desert Safari', location: 'Dubai',
    image: media[source].hero, gallery: media[source].gallery,
    source, priceUnit: 'per adult', ...details,
    price: `From AED ${details.amount}`, subtitle: details.description,
  };
}

export const safaris = [
  safari('morning-safari', 'morning-desert-safari-dubai', {
    title: 'Morning Desert Safari', amount: 150, duration: '4 hours', timeOfDay: 'Morning', badge: 'Early escape',
    description: 'Start early for golden dunes, a 4×4 adventure, camel photos and sandboarding, with the afternoon free to explore Dubai.',
    seoTitle: 'Morning Desert Safari Dubai from AED 150',
    seoDescription: 'Book a 4-hour morning desert safari in Dubai from AED 150 per adult. Enjoy 4×4 dune bashing, camel photos, sandboarding and central Dubai hotel pickup.',
    highlights: ['4×4 dune drive', 'Camel photo stop', 'Sandboarding', 'Morning light'],
    included: ['Central Dubai hotel pickup and return', '4×4 dune bashing', 'Camel photo stop', 'Sandboarding session', 'Bottled water and juice'],
    excluded: ['Personal spending and gratuities', 'Pickup beyond central Dubai unless arranged'],
    pickup: 'Central Dubai hotels, approximately 6:30–7:00 AM.', availability: 'Daily, weather permitting',
    itinerary: [['6:30 AM','Hotel pickup','Meet your driver for the journey into the desert.'],['7:15 AM','Into the dunes','Arrive at the safari area for the morning drive.'],['7:30 AM','Dune adventure','Around 30–40 minutes of 4×4 dune bashing.'],['8:15 AM','Photos & sandboarding','A camel photo stop and time on the sandboard.'],['9:00 AM','Refreshment break','Water, juice and a pause before the return trip.'],['10:30 AM','Back to your hotel','Return to Dubai with the rest of the day ahead.']],
  }),
  safari('evening-safari', 'evening-desert-safari-dubai', {
    title: 'Evening Desert Safari', amount: 180, duration: '6 hours', timeOfDay: 'Evening', badge: 'Sunset & supper',
    description: 'Follow the sunset through the dunes, then settle into a desert camp for henna, live entertainment and a BBQ buffet.',
    seoTitle: 'Evening Desert Safari Dubai & BBQ from AED 180',
    seoDescription: 'Enjoy an evening desert safari in Dubai from AED 180 per adult. Sunset dune bashing, BBQ dinner, live shows and hotel pickup in one 6-hour experience.',
    highlights: ['Sunset dune bashing', 'BBQ buffet dinner', 'Live camp entertainment', 'Henna painting'],
    included: ['Central Dubai hotel pickup and return', 'Sunset dune drive', 'BBQ dinner buffet', 'Live camp entertainment', 'Henna painting', 'Water and soft drinks'],
    excluded: ['Quad biking upgrade', 'Alcoholic drinks', 'Gratuities'],
    pickup: 'Central Dubai hotels, approximately 3:00–3:30 PM.', availability: 'Daily, subject to confirmation',
    itinerary: [['3:00 PM','Hotel pickup','Travel to the desert in an air-conditioned 4×4.'],['4:00 PM','Sunset dune drive','Around 45 minutes across the desert dunes.'],['5:00 PM','Arrive at camp','Enjoy the changing light and photo stops.'],['5:30 PM','Camp activities','Explore the camel, falcon-photo and henna activities.'],['7:00 PM','Dinner & performances','BBQ buffet with scheduled camp shows.'],['9:00 PM','Return to Dubai','Your driver takes you back to your hotel.']],
  }),
  safari('quad-bike', 'quad-bike-desert-tour-dubai', {
    title: 'Quad Bike Desert Tour', amount: 120, duration: '30–60 minutes riding', timeOfDay: 'Adventure', badge: 'Ride the dunes',
    description: 'Take the handlebars for a guided desert trail on an automatic quad bike, with a safety briefing and riding equipment.',
    seoTitle: 'Quad Biking Dubai Desert Tour from AED 120',
    seoDescription: 'Explore Dubai desert trails on a quad bike from AED 120. Choose a 30–60 minute ride with safety gear and a marshal. Hotel transfer is an optional add-on.',
    highlights: ['Automatic quad bikes', 'Single or double-seat options', 'Marshalled desert trail', 'Safety briefing and gear'],
    included: ['Quad bike hire for the selected session', 'Helmet and riding safety equipment', 'Marshal-guided trail', 'Pre-ride briefing'],
    excluded: ['Hotel transfer, available as an add-on', 'Extended riding time and any fuel surcharge', 'Optional GoPro footage'],
    pickup: 'Meet at the desert base, or request a hotel transfer add-on.', availability: 'Daily during daylight hours',
    note: 'Share each rider’s age and experience before booking so the team can confirm a suitable bike and session.',
    itinerary: [['Arrival','Meet at the base','Arrive independently or with a pre-arranged transfer.'],['Briefing','Get ready to ride','Meet the marshal and fit your safety gear.'],['30–60 min','Desert trail','Ride the marked route for your selected session.'],['Finish','Photo stop & return','Time for photos before returning to the base.']],
  }),
  safari('dune-buggy', 'dune-buggy-dubai', {
    title: 'Dune Buggy Desert Tour', amount: 350, duration: '1–2 hours riding', timeOfDay: 'Adventure', badge: 'Off-road adventure',
    description: 'Join an instructor-led buggy convoy through the desert, with 1000cc and 1300cc vehicle options and equipment included.',
    seoTitle: 'Dune Buggy Dubai Desert Tour from AED 350',
    seoDescription: 'Book a guided dune buggy tour in Dubai from AED 350. Choose a 1–2 hour desert ride with safety equipment. Hotel transfers and GoPro rental are optional.',
    highlights: ['1000cc / 1300cc options', 'Instructor-led convoy', 'Desert dune terrain', 'Optional GoPro rental'],
    included: ['Buggy hire for the selected session', 'Helmet, goggles and gloves', 'Instructor-led convoy', 'Bottled water'],
    excluded: ['Hotel transfer, available as an add-on', 'GoPro rental', 'Extended-session fuel surcharge'],
    pickup: 'Meet at the buggy base, or add a hotel transfer when enquiring.', availability: 'Daily during daylight hours',
    note: 'Driver age and vehicle suitability are checked before confirmation. Tell us who will drive and who will travel as a passenger.',
    itinerary: [['Arrival','Desert base','Check in for your selected vehicle and session.'],['Briefing','Equipment & instruction','Fit your gear and meet the convoy instructor.'],['1–2 hours','Guided dune ride','Follow the convoy along the planned desert route.'],['Return','Water & photos','Finish back at the base with time to unwind.']],
  }),
  safari('adventure', 'adventure-desert-safari-dubai', {
    title: 'Adventure Desert Safari', amount: 280, duration: '7 hours', timeOfDay: 'Adventure', badge: 'Full-day adventure',
    description: 'Pack more into your desert day with dune bashing, sandboarding, quad biking and a camel trek, followed by dinner at camp.',
    seoTitle: 'Adventure Desert Safari Dubai from AED 280',
    seoDescription: 'Choose a 7-hour Dubai adventure safari from AED 280 per adult: dune bashing, sandboarding, a 20-minute quad ride, camel trekking, BBQ dinner and shows.',
    highlights: ['4 desert activities', '20-minute quad session', 'Camel trekking', 'BBQ dinner and shows'],
    included: ['Central Dubai hotel pickup and return', 'Dune bashing and sandboarding', '20-minute quad bike session', 'Camel trekking', 'BBQ dinner and camp shows'],
    excluded: ['Extra quad biking time', 'Alcoholic drinks', 'Gratuities'],
    pickup: 'Central Dubai hotels, approximately 2:30 PM.', availability: 'Daily, subject to confirmation',
    itinerary: [['2:30 PM','Hotel pickup','Start your afternoon desert journey.'],['3:15 PM','Dune bashing','Around 45 minutes in the 4×4.'],['4:00 PM','Sandboarding','Try the slopes on a sandboard.'],['4:45 PM','Quad biking','Your included 20-minute quad session.'],['5:30 PM','Camel trek','A slower-paced desert moment before dinner.'],['6:30 PM','BBQ & entertainment','Dinner and shows before the return around 9:00 PM.']],
  }),
  safari('bbq-dinner', 'desert-bbq-dinner-dubai', {
    title: 'Desert BBQ Dinner Safari', amount: 200, duration: 'About 5 hours', timeOfDay: 'Evening', badge: 'A relaxed evening',
    description: 'Spend an easy evening at a desert camp with a BBQ buffet, a shisha lounge, Tanoura entertainment and a stargazing area.',
    seoTitle: 'Desert BBQ Dinner Dubai from AED 200',
    seoDescription: 'Relax at a Dubai desert BBQ dinner from AED 200 per adult. Enjoy a buffet, Tanoura show and hotel pickup. Dune bashing is available as an optional add-on.',
    highlights: ['BBQ buffet', 'Tanoura performance', 'Shisha lounge', 'Stargazing area'],
    included: ['Central Dubai hotel pickup and return', 'BBQ buffet', 'Shisha lounge access', 'Tanoura performance', 'Stargazing area access'],
    excluded: ['Dune bashing, available as an add-on', 'Alcoholic drinks', 'Gratuities'],
    pickup: 'Central Dubai hotels, approximately 4:00 PM.', availability: 'Daily, subject to confirmation',
    itinerary: [['4:00 PM','Hotel pickup','Travel directly to the desert camp.'],['5:00 PM','Settle into camp','Find your seat and enjoy the desert setting.'],['6:00 PM','Sunset at camp','Relax before dinner and explore the lounge.'],['7:00 PM','BBQ buffet','Enjoy the evening buffet.'],['8:00 PM','Tanoura show','Watch the scheduled camp performance.'],['9:00 PM','Hotel drop-off','Return to Dubai after dinner.']],
  }),
  safari('family-safari', 'family-desert-safari-dubai', {
    title: 'Family Desert Safari', amount: 190, duration: '6 hours', timeOfDay: 'Family', badge: 'Time together',
    description: 'A family-focused desert afternoon with a gentler ride option, children’s camp activities and a BBQ dinner together.',
    seoTitle: 'Family Desert Safari Dubai from AED 190',
    seoDescription: 'Plan a family desert safari in Dubai from AED 190 per adult. Gentle-ride options, children’s activities, BBQ dinner and child seats requested in advance.',
    highlights: ['Gentler ride option', 'Children’s activity corner', 'Family BBQ dinner', 'Child seats on request'],
    included: ['Central Dubai hotel pickup and return', 'Gentler dune-drive option', 'Children’s camp activities', 'Family BBQ dinner', 'Child seats arranged in advance at no extra charge'],
    excluded: ['Quad biking upgrade', 'Alcoholic drinks', 'Gratuities'],
    pickup: 'Central Dubai hotels, approximately 3:00 PM.', availability: 'Daily, subject to confirmation',
    note: 'Tell us the children’s ages and any ride or seating requirements before confirming your booking.',
    itinerary: [['3:00 PM','Family pickup','Meet your driver with requested seats arranged.'],['4:00 PM','Gentler dune drive','A smoother-paced option for your group.'],['5:00 PM','Desert camp','Arrive and explore the camp.'],['5:30 PM','Children’s activities','Visit the family activity area.'],['7:00 PM','BBQ dinner','Enjoy dinner together.'],['9:00 PM','Back to the hotel','Return transfer for the whole family.']],
  }),
  safari('overnight-safari', 'overnight-desert-safari-dubai', {
    title: 'Overnight Desert Safari', amount: 450, duration: 'About 18 hours', timeOfDay: 'Overnight', badge: 'Under the stars',
    description: 'Stay beyond sunset for a tented desert night, a bonfire and stargazing, then wake to the dunes and breakfast.',
    seoTitle: 'Overnight Desert Safari Dubai from AED 450',
    seoDescription: 'Stay overnight in the Dubai desert from AED 450 per adult. Tented camp, BBQ dinner, bonfire, stargazing, sunrise and breakfast with hotel transfers.',
    highlights: ['Tented overnight stay', 'BBQ dinner and breakfast', 'Bonfire and stargazing', 'Sunrise in the desert'],
    included: ['Central Dubai hotel pickup and return', 'Tented overnight accommodation', 'BBQ dinner and breakfast', 'Bonfire and stargazing session', 'Sunrise viewing'],
    excluded: ['Private tent upgrade', 'Alcoholic drinks', 'Gratuities'],
    pickup: 'Pickup around 3:30 PM; return around 9:00 AM the following day.', availability: 'Thursday–Saturday, or on request',
    note: 'Ask about shared versus private tents and the cancellation terms for your overnight booking.',
    itinerary: [['3:30 PM','Hotel pickup','Begin your overnight desert escape.'],['4:30 PM','Dunes & camp','Enjoy the evening drive before settling in.'],['7:00 PM','Dinner & shows','BBQ buffet and camp entertainment.'],['9:30 PM','Bonfire & stars','Relax by the fire and enjoy the night sky.'],['Overnight','Tented stay','Sleep at camp in your booked tent option.'],['6:00 AM','Sunrise & breakfast','A final desert morning before the return around 9:00 AM.']],
  }),
];

function city(id, slug, details) {
  const source = `/city-tours/${id}`;
  return { id, slug, category: 'City Tours', path: id === 'abu-dhabi' ? '/abu-dhabi-city-tours' : `/tours/${slug}`,
    source, image: media[source].hero, gallery: media[source].gallery,
    priceUnit: 'per adult', timeOfDay: 'City Tours', availability: 'Confirm your preferred date',
    ...details, price: `From AED ${details.amount}`, subtitle: details.description,
    included: ['Guided sightseeing on the selected route', 'Hotel pickup and return within the agreed coverage area', 'Tour transport'],
    excluded: ['Paid attraction tickets unless expressly included in your confirmation', 'Personal spending and gratuities'],
    note: 'Photo stops and exterior visits do not include observation-deck or museum admission. Ask for an itemised quote for any paid attractions or private arrangements.',
  };
}
export const cityTours = [
  city('dubai','dubai-city-tour',{
    title:'Dubai City Tour', location:'Dubai', amount:200, duration:'8 hours · full day', badge:'Old meets new',
    description:'Discover Dubai from the Creek and traditional souks to Downtown’s towers, Jumeirah and the city’s modern landmarks.',
    seoTitle:'Dubai City Tour from AED 200 | Full-Day Sightseeing',
    seoDescription:'Explore Dubai on an 8-hour city tour from AED 200 per adult. Visit the Creek, souks, Dubai Mall and landmark photo stops with guided hotel pickup.',
    highlights:['Burj Khalifa photo stop','Dubai Mall and fountain area','Jumeirah Mosque exterior','Dubai Frame area','Dubai Creek abra ride','Gold and Spice Souks'],
    pickup:'Dubai hotels; confirm your exact location when enquiring.',
  }),
  city('abu-dhabi','abu-dhabi-city-tour',{
    title:'Abu Dhabi City Tour', location:'Abu Dhabi', amount:250, duration:'9 hours · full day', badge:'Culture & coastline',
    description:'Explore the UAE capital’s mosque, waterfront and cultural landmarks on a guided day from Dubai or Abu Dhabi.',
    seoTitle:'Abu Dhabi City Tour from AED 250 | Zuhd Tours',
    seoDescription:'Book an Abu Dhabi city tour from AED 250 per adult. Grand Mosque, Corniche and cultural landmarks with Dubai or Abu Dhabi pickup; paid entries optional.',
    highlights:['Sheikh Zayed Grand Mosque','Louvre Abu Dhabi, optional paid entry','Emirates Palace exterior','Corniche waterfront','Qasr Al Watan area'],
    pickup:'Hotels in Dubai or Abu Dhabi; agree your pickup point with the team.',
  }),
  city('sharjah','sharjah-city-tour',{
    title:'Sharjah City Tour', location:'Sharjah', amount:160, duration:'5 hours · half day', badge:'Art & heritage',
    description:'Spend half a day exploring Sharjah’s cultural districts, traditional markets and waterfront sights.',
    seoTitle:'Sharjah City Tour from AED 160 | Half-Day Tour',
    seoDescription:'Explore Sharjah from AED 160 per adult on a 5-hour tour. Al Noor Mosque, heritage areas, Blue Souk and Al Majaz Waterfront with Dubai or Sharjah pickup.',
    highlights:['Al Noor Mosque','Heritage and Arts Areas','Blue Souk / Central Market','Al Majaz Waterfront'],
    pickup:'Hotels in Dubai or Sharjah; confirm your hotel before booking.',
  }),
  city('ras-al-khaimah','ras-al-khaimah-city-tour',{
    title:'Ras Al Khaimah Tour', location:'Ras Al Khaimah', amount:260, duration:'8 hours · full day', badge:'Mountains & sea',
    description:'Leave the city behind for Jebel Jais mountain roads, Ras Al Khaimah’s heritage and the Al Marjan coastline.',
    seoTitle:'Ras Al Khaimah City Tour from AED 260 | Jebel Jais',
    seoDescription:'Discover Ras Al Khaimah from AED 260 per adult. An 8-hour tour with Jebel Jais, heritage and coastline stops; pickup from Dubai or RAK and optional ziplining.',
    highlights:['Jebel Jais mountain drive','Jais Sky Tour ziplining, optional add-on','RAK National Museum area','Al Marjan Island coastline'],
    pickup:'Hotels in Dubai or Ras Al Khaimah; final pickup agreed before travel.',
  }),
];

export const transferServices = [
  {id:'airport',title:'Airport Pickup & Drop-off',amount:90,image:imagery.transfer,description:'A coordinated arrival or departure, with flight tracking and a driver meeting you at the agreed location.',highlights:['Flight tracking','Meet & greet with a name board','Waiting time included; confirm the allowance']},
  {id:'hotel',title:'Hotel Pickup & Drop-off',amount:70,image:imagery.hotel,description:'Travel directly between your hotel and a Dubai destination with a fare agreed before your journey.',highlights:['Hotel lobby pickup','Fixed quote for your route','Pickup times available around the clock']},
  {id:'private',title:'Private & City Transfer',amount:250,image:imagery.transfer,description:'Plan a custom route with your own driver, including multiple stops, city-to-city travel or a longer hire.',highlights:['Custom and intercity routes by quote','Hourly or full-day hire options','Dedicated vehicle and driver']},
];

export function whatsappLink(message) { return `${site.whatsapp}?text=${encodeURIComponent(message)}`; }
export function enquiryLink(tour) { return whatsappLink(`Hello Zuhd Tours, I would like to enquire about ${tour.title}${tour.amount ? ` (from AED ${tour.amount}${tour.priceUnit ? ` ${tour.priceUnit}` : ''})` : ''}. Please confirm availability, the final price and pickup details.`); }
export function tourPath(tour) { return tour.path || (tour.slug === 'global-village-dubai' ? '/global-village-dubai' : `/tours/${tour.slug}`); }
export function serviceSchema(tour) {
  const path = tourPath(tour);
  return {'@type':'Service',name:tour.title,description:tour.description || tour.subtitle,url:`${site.domain}${path}`,image:tour.image.startsWith('/') ? `${site.domain}${tour.image}` : tour.image,provider:{'@id':`${site.domain}/#organization`},areaServed:{'@type':'Place',name:tour.location || 'United Arab Emirates'},...(tour.amount ? {offers:{'@type':'Offer',url:`${site.domain}${path}`,priceCurrency:'AED',price:tour.amount,name:`Starting price${tour.priceUnit ? ` ${tour.priceUnit}` : ''}`}} : {})};
}
export function listSchema(items) { return {'@type':'ItemList',itemListElement:items.map((t,i)=>({'@type':'ListItem',position:i+1,name:t.title,url:`${site.domain}${tourPath(t)}`}))}; }
