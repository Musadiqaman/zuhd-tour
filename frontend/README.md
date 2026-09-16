# Zuhd Tours — Final Homepage Reference Build

This is the final React/Vite implementation of the Zuhd Tours homepage direction: premium navy/gold styling, responsive navigation, Tours/Destinations mega menus, local image assets, mobile navigation, floating contact controls, destination strip, popular tours, packages, testimonials, travel guides, FAQ and a complete responsive footer.

## Local image assets
All website images used by the homepage are stored under `public/assets/images/` and referenced with local `/assets/images/...` paths. Replace these demo/reference assets with properly licensed production photography before launch.

## Run
```bash
npm install
npm run dev
npm run build
npm run preview
```

## Main folders
```text
src/
├── components/
├── data/
├── pages/
└── styles/
public/
└── assets/
    └── images/
```

## Important production steps
- Replace placeholder phone/WhatsApp/email/domain values in `src/data/siteConfig.js`.
- Replace demo images with licensed high-resolution Dubai photography.
- Configure real language translations rather than the UI-only language menu.
- Connect the booking form to the client's preferred booking/CRM/email service.
- Verify the final domain, sitemap, robots.txt, Search Console and structured data before launch.

## Code-level SEO included
- Route-specific titles, meta descriptions and canonicals
- Robots directives and production sitemap
- Open Graph + Twitter metadata
- TravelAgency organization structured data
- BreadcrumbList structured data on internal pages
- Service structured data on tour detail pages
- Article structured data on blog posts
- FAQPage structured data on the homepage
- Descriptive image alt text and lazy loading for non-hero images
- Hero image preload for the main visual
- 404 noindex handling
- Web manifest and locale metadata

Google Search Console, Business Profile verification, sitemap submission and URL Inspection are external setup steps that must be done after the real domain is live. Google recommends validating structured data and using URL Inspection before requesting recrawls.


### Client-provided services added
- Dubai City Tour
- Abu Dhabi City Tour
- Private Tours
- Desert Safari
- Dhow Cruise
- Tour Guide Service
- Transport Services (SUV cars, private cars, vans and buses)
- Parks Tickets

### Client contact details added
- License Address: Office No. 41-105, Sheikh Ahmed Bin Rashid Bin Saeed Al Maktoum, Bur Dubai – Al Raffa.
- Email: Info@zuhdtours.com
- Mobile: +971 50 375 3481
- Mobile: +971 55 448 7319


Important: the client supplied email is on `zuhdtours.com`, but a public website/domain was not supplied in the message. The project keeps its existing demo domain setting until the client confirms the production website domain. Replace `site.domain` before launch so canonical URLs, sitemap URLs and structured data use the real domain.

## Client content integration
The tour catalogue and selected factual tour details were refreshed from the client's public website, Zuhd Tours (https://zuhdtours.com/), including the featured Desert Safari, Abu Dhabi City Tour, Dubai City Tour and Global Village listings. Client-supplied contact/license details are used in the project configuration. Marketing claims, reviews and old contact details visible on the public site were not copied as verified facts when they conflicted with the client's latest supplied details.

## Final UI / Language pass
- Desktop dropdowns use hover with viewport-centered, fixed panels to prevent edge clipping.
- Mobile navigation is a contained drawer with tap-to-expand submenus.
- Book Now is compact and vertically centered rather than stretching to the header height.
- Images use fixed responsive aspect-ratio boxes and `object-fit: cover` to prevent width/overflow problems.
- Language selector is intentionally limited to English and Arabic until additional languages have complete content translations. Both languages translate the site's visible navigation, service/tour content, FAQs, guides, booking UI and footer; Arabic also switches the document to RTL.
