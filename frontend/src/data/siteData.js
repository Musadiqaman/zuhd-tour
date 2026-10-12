import { safaris, cityTours, imagery } from "./experienceCatalog.js";
import { homeFaqs } from "./faqData.js";
const additionalTours = [
  {slug:'global-village-dubai',category:'Tickets & Attractions',title:'Global Village Dubai',subtitle:'Admission and optional transfer arrangements for Dubai’s seasonal multicultural attraction.',duration:'1 day',price:'AED 75',rating:'',badges:['Featured'],image:'/assets/ai/ai-global-village.jpg',highlights:['Global Village admission','Cultural pavilions','Live entertainment','Shopping & dining','Optional transfers']},
  {slug:'private-desert-safari-dubai',category:'Private Tours',title:'Private Desert Safari',subtitle:'A private desert experience with flexible vehicle, timing and itinerary options.',duration:'Flexible',price:'Enquire',rating:'',badges:['Private'],image:imagery.desert,highlights:['Private vehicle options','Flexible pickup','Custom itinerary','Private group experience']},
  {slug:'private-city-tour-dubai',category:'Private Tours',title:'Private Dubai City Tour',subtitle:'A private Dubai sightseeing day tailored to your group and preferred landmarks.',duration:'Flexible',price:'Enquire',rating:'',badges:['Private'],image:imagery.city,highlights:['Private transport','Flexible itinerary','Dubai landmarks','Dedicated tour support']},
  {slug:'private-dhow-cruise-dubai',category:'Dhow Cruise',title:'Dhow Cruise Dubai',subtitle:'Traditional dhow cruising with sightseeing and private arrangements available.',duration:'Flexible',price:'Enquire',rating:'',badges:['Cruise'],image:imagery.city,highlights:['Dhow cruise','Dubai waterfront views','Private arrangements','Dining options on request']},
  {slug:'half-day-desert-safari-dubai',category:'Desert Safari',title:'Half-Day Desert Safari',subtitle:'A flexible half-day desert option for travellers who want a shorter adventure.',duration:'Half day',price:'Enquire',rating:'',badges:['Safari'],image:imagery.desert,highlights:['Desert drive','Adventure activities','Transport options','Flexible scheduling']},
  {slug:'full-day-desert-safari-dubai',category:'Desert Safari',title:'Full Day Desert Experience',subtitle:'A full-day desert itinerary that can be tailored to your group.',duration:'Full day',price:'Enquire',rating:'',badges:['Safari'],image:imagery.desert,highlights:['Full-day itinerary','Private options','Desert activities','Transport arrangements']},
  {slug:'dubai-night-city-tour',category:'City Tours',title:'Dubai Night City Tour',subtitle:'See Dubai’s skyline and waterfront districts after dark.',duration:'Flexible',price:'Enquire',rating:'',badges:['City Tour'],image:imagery.city,highlights:['Dubai skyline','Night sightseeing','Private transport options','Custom stops']},
  {slug:'half-day-city-tour-dubai',category:'City Tours',title:'Half Day Dubai City Tour',subtitle:'A compact Dubai sightseeing itinerary for travellers with limited time.',duration:'4–5 hours',price:'Enquire',rating:'',badges:['City Tour'],image:imagery.city,highlights:['Old Dubai','Modern landmarks','Flexible pickup','Short itinerary']},
  {slug:'old-dubai-heritage-tour',category:'City Tours',title:'Old Dubai Heritage Tour',subtitle:'Explore Al Fahidi, Dubai Creek and the traditional souks.',duration:'Flexible',price:'Enquire',rating:'',badges:['Heritage'],image:imagery.city,highlights:['Al Fahidi','Dubai Creek','Gold Souk','Spice Souk']},
  {slug:'dubai-marina-tour',category:'City Tours',title:'Dubai Marina & Palm Tour',subtitle:'A modern Dubai route covering waterfront districts and Palm Jumeirah.',duration:'Flexible',price:'Enquire',rating:'',badges:['City Tour'],image:imagery.city,highlights:['Dubai Marina','Palm Jumeirah','Atlantis photo stop','Waterfront views']},
  {slug:'dubai-kayaking-adventure',category:'Other Experiences',title:'Dubai Kayaking Adventure',subtitle:'Water-based adventure arrangements for travellers looking for an active Dubai experience.',duration:'Flexible',price:'Enquire',rating:'',badges:['Adventure'],image:imagery.city,highlights:['Water activity','Equipment arrangements','Flexible timing','Booking support']},
];

export const landmarks = [
  ["The Dubai Creek","Creek-side heritage, abra rides and skyline views."],
  ["Old Dubai souks","Historic lanes, souks, cafés and local culture."],
  ["Dubai Museum / Al Fahidi","Historic Al Fahidi architecture, museums and heritage."],
  ["Al Seef","Waterfront dining, heritage architecture and relaxed walks."],
  ["Palm Jumeirah","Luxury marina island with shops, restaurants and waterfront views."],
  ["Downtown Dubai","Dubai skyline, towers and city-centre attractions."],
  ["Jumeirah","Beachfront district with cafés, villas and coastal views."]
];

export const combos = [
  {title:'Dubai & Desert Combo',days:'Flexible',price:'Custom',old:'',save:'',items:['Dubai City Tour','Desert Safari','Transport options','Custom pickup and timing']},
  {title:'Private UAE Explorer',days:'Flexible',price:'Custom',old:'',save:'',items:['Private Dubai sightseeing','Abu Dhabi City Tour','Private transport','Tour guide service']},
  {title:'Dubai Attractions & Tickets',days:'Flexible',price:'Custom',old:'',save:'',items:['Parks tickets','Global Village options','Dhow Cruise','Transport arrangements']}
];

export const posts = [
  {slug:"dubai-desert-safari-complete-guide",category:"Desert Safari",title:"Desert Safari Dubai: The Complete Guide",excerpt:"What to expect, what to wear and how to choose a desert safari.",image:imagery.desert},
  {slug:"dubai-desert-safari-activities",category:"Adventure",title:"Top 10 Desert Safari Activities in Dubai",excerpt:"Dune bashing, camel riding, sandboarding and more.",image:imagery.desert},
  {slug:"old-dubai-souks-guide",category:"City Tours",title:"Old Dubai souks: Complete Visitor's Guide",excerpt:"A practical guide to Dubai's famous traditional market.",image:cityTours[0].image},
  {slug:"overnight-desert-camping-dubai",category:"Camping",title:"Overnight Desert Camping in Dubai",excerpt:"Everything you need to know about sleeping under the stars.",image:safaris[7].image},
  {slug:"best-time-to-visit-dubai",category:"Travel Tips",title:"Best Time to Visit Dubai",excerpt:"Weather, seasons and the best time for tours.",image:cityTours[0].image},
  {slug:"palm-jumeirah-guide",category:"City Tours",title:"Palm Jumeirah Dubai: Luxury Guide",excerpt:"Marinas, restaurants, shopping and waterfront walks.",image:cityTours[0].image},
  {slug:"dubai-desert-conservation-guide",category:"Nature",title:"Dubai Desert Conservation Guide",excerpt:"How to experience Dubai’s desert responsibly and comfortably.",image:imagery.desert}
];

const previousFaqs = [
  ["What is the best time of year to go on a desert safari?","The cooler months are generally the most comfortable. Your exact ideal time depends on whether you prefer morning, sunset or overnight experiences."],
  ["Is dune bashing safe for children and first-time visitors?","Tours use trained drivers and maintained 4x4 vehicles. Tell the operator about children, pregnancy, mobility or other needs before booking."],
  ["What should I wear and bring on a desert safari?","Wear comfortable light clothing, closed shoes, sunglasses and sun protection. Bring a camera and a light layer for cooler evenings."],
  ["Do you offer hotel pickup for desert safari and city tours?","Private tours include pickup and drop-off. Shared tours may use a designated meeting point or offer pickup for an additional charge."],
  ["How long does a city tour take and what does it cover?","City tours range from a few hours to a full day and can include Old Dubai souks, Dubai Creek, museums, Palm Jumeirah and Downtown Dubai."],
  ["Can I book a desert safari and a city tour together?","Yes. Combo packages are available and custom combinations can also be requested."]
];
export const tours = [...safaris, ...cityTours, ...additionalTours];
export const faqs = homeFaqs;
