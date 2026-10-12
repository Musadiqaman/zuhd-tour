export const faqGroups = [
  { id:'safari', title:'Desert safaris', intro:'Choose the right pace for your desert day.', items:[
    ['Which desert safari should I choose?', 'Choose Morning for a shorter 4-hour outing, Evening for sunset and a BBQ dinner, or Overnight for a tented stay and breakfast. Adventure combines more activities; Family offers a gentler ride option. Quad biking, dune buggy rides and a relaxed BBQ dinner can also be booked separately.'],
    ['How much do your Dubai safaris cost?', 'Starting adult prices are AED 150 for Morning, AED 180 for Evening, AED 120 for Quad Bike, AED 350 for Dune Buggy, AED 280 for Adventure, AED 200 for BBQ Dinner, AED 190 for Family and AED 450 for Overnight. Your selected session, upgrades and pickup arrangements determine the final quote.'],
    ['Is hotel pickup included in every desert activity?', 'Central Dubai pickup and return are included in the Morning, Evening, Adventure, BBQ Dinner, Family and Overnight packages. Standalone quad bike and dune buggy sessions start at the desert base; a hotel transfer is an optional add-on. Please confirm coverage for your hotel.'],
    ['Can children join, and can the ride be gentler?', 'Tell us the children’s ages and any seating or ride requirements before booking. The Family Safari has a gentler ride option and child seats can be requested in advance. Quad bikes and buggies have separate rider and driver requirements. A gentler ride does not remove every risk; discuss any health or mobility concerns before choosing an activity.'],
    ['What should I wear and bring?', 'Bring comfortable clothing, sunglasses, sun protection and closed shoes for sand-based activities. A light extra layer is useful on cooler desert evenings. Keep personal belongings secure during rides.'],
    ['Is food included, and are vegetarian options available?', 'Evening, Adventure, Family and BBQ Dinner packages include a BBQ meal. Overnight includes dinner and breakfast; Morning includes refreshments. Vegetarian options can be requested—please share dietary requirements and allergies before confirmation.'],
  ]},
  { id:'city', title:'City tours', intro:'Landmarks, culture and time to explore.', items:[
    ['Which cities can I visit with Zuhd Tours?', 'Choose Dubai from AED 200, Abu Dhabi from AED 250, Sharjah from AED 160 or Ras Al Khaimah from AED 260 per adult. Dubai and Ras Al Khaimah tours run for about 8 hours, Abu Dhabi for about 9 hours, and Sharjah for about 5 hours.'],
    ['Are attraction entry tickets included?', 'Sightseeing stops and exterior views are different from paid admission. Tickets for attractions such as the Louvre, observation decks or optional ziplining are extra unless your booking confirmation specifically includes them. Ask for an itemised quote.'],
    ['Can I arrange a private city tour?', 'Yes. Share your group size, preferred stops and pickup point to request a private vehicle or guide. Private arrangements are quoted separately from the advertised starting group-tour prices.'],
    ['Can I change the order of stops?', 'Private itineraries can be discussed with the team. Shared tours follow their planned route, and the order of stops may change with traffic, venue access or the day’s arrangements.'],
  ]},
  { id:'transfers', title:'Transfer services', intro:'Your route, vehicle and pickup details.', items:[
    ['What transfer services do you offer?', 'Airport pickup and drop-off starts from AED 90, hotel transfers from AED 70, and private or custom transfers from AED 250. Share the complete route, date, time, passenger count and luggage details for an exact quote. Intercity and longer hire arrangements are priced for the requested journey.'],
    ['What happens if my flight is delayed?', 'Give us your flight number when requesting an airport transfer so the team can track it and coordinate pickup. Ask for the included waiting allowance and any additional waiting charges in your confirmation.'],
    ['Which vehicle should I request?', 'The reference options are a sedan for 1–3 passengers, an SUV for 1–5 and a van for 1–10. Luggage and child seats affect usable space, so include those details and let the team confirm the vehicle. Luxury options are available by enquiry.'],
    ['Can I book a return journey or a child seat?', 'Yes. Include your return date and time, and each child’s age, in your enquiry. The team will confirm the vehicle, seating arrangement and total quote for both journeys.'],
  ]},
  { id:'booking', title:'Booking & prices', intro:'Clear details before you confirm.', items:[
    ['How do I book a tour?', 'Choose your package and use its WhatsApp button, or complete the enquiry form. Your dates, group size and pickup details are added to a message for the Zuhd Tours team. The booking is confirmed only after the team replies and agrees the arrangements with you.'],
    ['Are children charged the adult starting price?', 'Displayed safari and city-tour prices are starting adult prices. Child and infant rates depend on the package and ages. Include all children’s ages when enquiring so the team can provide the correct total.'],
    ['Can you arrange a large group or several experiences?', 'Yes. Send your dates, group size and preferred experiences for a combined itinerary and group quote. Transport, guides and attraction-ticket arrangements can be discussed together.'],
  ]},
  { id:'pickup', title:'Pickup & timing', intro:'Know where to meet and when to be ready.', items:[
    ['Which areas are covered for pickup?', 'Safari pickups normally cover central Dubai. City tours use the pickup areas listed on each package page. Hotels beyond those areas, standalone quad or buggy sessions and intercity journeys need individual confirmation.'],
    ['Are itinerary times exact?', 'Times shown are an approximate guide. Your confirmed pickup depends on hotel location, traffic, season and the other arrangements for your trip. Use the time provided directly by the team for your booking.'],
  ]},
  { id:'changes', title:'Changes & cancellations', intro:'Talk to the team before your plans change.', items:[
    ['How do I cancel or reschedule?', 'Contact Zuhd Tours on WhatsApp or email with your name, tour and travel date. Ask for the cancellation deadline and any charges in writing before confirming, especially for private tours, overnight stays and paid attraction tickets.'],
    ['What if the weather affects my safari?', 'The team may adjust, postpone or cancel an activity when conditions affect the planned trip. Contact us for the options available for your booking, including any rescheduling or refund terms.'],
  ]},
  { id:'payment', title:'Payment', intro:'Confirm the quote directly with our team.', items:[
    ['Does the website take payment when I enquire?', 'No. The forms prepare a WhatsApp enquiry; they do not charge you or automatically reserve a place. The team confirms availability, the final price and payment arrangements with you.'],
    ['How can I confirm the final amount?', 'Ask for the total in AED, including your group, pickup route, paid entries and any upgrades. Keep the written confirmation so the agreed inclusions and payment terms are clear.'],
  ]},
];
export const homeFaqs = [faqGroups[0].items[0],faqGroups[0].items[2],faqGroups[1].items[0],faqGroups[2].items[0],faqGroups[3].items[0]];
export function faqSchema(items) { return {'@type':'FAQPage',mainEntity:items.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}; }
