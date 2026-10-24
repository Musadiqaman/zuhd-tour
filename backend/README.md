# Zuhd Tours — backend (v2.2)

Bhai, ZIP mein sirf **frontend** aur **backend** hain. Dono folders ko saath rakhein. Backend ke andar `src` folder nahi hai.

## Purane version se update

Is ZIP ko **naye folder** mein extract karein; purane root files merge na karein. Apni existing Atlas URI aur zaroori hosting settings new ENV mein transfer karein. Same database use karne par existing admin, blogs aur media preserve rehte hain. Agar admin pehle se bana hua hai to `/admin/login` use karein aur SETUP_TOKEN blank rakhein.

## Pehli dafa local setup

Node.js 22.12+ aur MongoDB Atlas connection chahiye.

Terminal ko `backend` folder mein khol kar:

```bash
npm ci
npm run install:frontend
npm run setup
```

`backend/.env` kholein. `MONGODB_URI` mein apni Atlas URI daalein (database naam `zuhd_tours`). URI mein database password ko URL-encode karein. Atlas mein database user aur apne server/IP ka network access set karein. Password ya URI GitHub par upload na karein.

Ab isi backend terminal mein:

```bash
npm run dev:all
```

Website: http://localhost:5173
First admin: http://localhost:5173/admin/setup
Admin login: http://localhost:5173/admin/login

`/admin/setup` par `.env` ka **SETUP_TOKEN**, apna naam, email aur kam az kam 12 characters ka password daalein. Yeh sirf pehla admin banata hai. Pehla account banne ke baad route dobara account nahi banane deta. `SETUP_TOKEN` ki value blank kar dein aur backend restart karein. Password baad mein **Admin → Settings → Password & security** se change hota hai.

## ENV — sirf 5 entries

| Variable | Kya karna hai |
| --- | --- |
| `NODE_ENV` | Local par `development`; hosting par `production`. |
| `MONGODB_URI` | Atlas ki private connection string. |
| `PUBLIC_SITE_URL` | Canonical website URL: `https://www.zuhdtours.com`. |
| `SETUP_TOKEN` | `npm run setup` khud random code banata hai; sirf pehli signup ke liye. |
| `ELFSIGHT_APP_ID` | Reviews widget ki public App ID; reviews setup tak blank reh sakti hai. |

**JWT_SECRET ki zarurat nahi.** Login secure HttpOnly session cookies aur MongoDB sessions se hota hai. Password scrypt hash mein save hota hai. `APP_SECRET`, `GOOGLE_PLACES_API_KEY` aur `GOOGLE_PLACE_ID` ab use nahi hote; purani ENV se hata sakte hain. Elfsight App ID public identifier hai, admin password/secret nahi.

Agar purani `.env` maujood hai, `npm run setup` usay overwrite nahi karega. Upar wali list ke mutabiq manually update karein; existing Atlas URI aur production proxy credentials preserve karein. Existing admins, blogs aur photos database mein rehte hain. Purane Google API credentials ab read/use nahi hote.

## Google reviews — simple Elfsight setup

1. https://dash.elfsight.com par **Google Reviews** widget create karein.
2. Source mein apna Maps share link use karein: https://maps.app.goo.gl/xFMfxpXM7EULLtuJ6
3. Grid ya carousel layout, rating, review count aur read/write buttons choose karein. Website theme ke liye cream background, dark navy text aur gold accent rakh sakte hain. Widget mein business ki apni reviews ke liye rating schema off rakhein; star snippets ki guarantee nahi hai.
4. **Publish → Install**. Code mein `elfsight-app-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` hoga. Sirf ID wala hissa copy karein, poora script nahi.
5. `backend/.env` mein `ELFSIGHT_APP_ID=your-widget-id` set karein aur backend restart karein. Hosting par backend environment settings mein yehi variable set karke redeploy karein. Frontend rebuild ki zarurat nahi.
6. **Admin → Google reviews → Recheck App ID → Open homepage preview**.

App ID configured ka matlab sirf format/config sahi hai; widget Elfsight par publish aur active bhi hona chahiye. Agar reviews phir bhi nahi aate, Elfsight source, filters, device/domain rules aur monthly view allowance check karein. App ID diya nahi gaya tha, isliye delivery mein real business widget connect nahi hua. Website tab tak verified Google profile ka link dikhati hai; koi rating/review banaya nahi gaya.

Customer Google par review post karega; Elfsight usay automatically sync karega. **Instant nahi: provider ke current docs ke mutabiq 72-hour cache ho sakta hai.** Reviews aur unki images Atlas mein store nahi hote. Elfsight account/plan limits apply.

Official setup: https://help.elfsight.com/article/1100-how-to-embed-google-reviews-on-a-website
Update timing: https://help.elfsight.com/article/168-why-my-reviews-are-not-being-updated

## Social icons

**Admin → Settings → Social profiles** mein asli Facebook, Instagram, TikTok, YouTube, X, LinkedIn profile URLs save karein. Sirf filled valid links show hote hain. Desktop par left vertical panel; phones par expandable social button. Koi social profile URL invent nahi kiya gaya.

## Blogs aur image storage

**Blog posts → New blog post**: title, summary, article, cover image, alt text; Preview ke baad Publish. Heading buttons use karein. Article ka table of contents headings se banta hai. Publish hone par blog page aur sitemap entry automatically update hote hain. Drafts public nahi.

Uploads automatically WebP mein convert hote hain: 1440 px maximum dimension, usual target 220 KiB, hard maximum 450 KiB. Original image save nahi hoti; duplicate upload existing file reuse karta hai. File input limit 4 MiB. Media library mein total image storage dikhai deta hai. Static tour photos frontend mein hain, Atlas mein nahi. Atlas ki storage mein images ke ilawa posts, indexes aur sessions bhi space lete hain, isliye 500 MB ko sirf photos ke liye poora allocate na karein.

## Folder structure

- `config/` — `db.js`, environment config
- `controllers/` — auth, posts, media, reviews, settings, public endpoints
- `middlewares/` — auth, CSRF/origin, upload, rate limit, errors
- `models/` — MongoDB models
- `routes/` — auth, admin, public API
- `services/` — blog seed, compression, widget configuration
- `utils/` — validation, passwords, sessions, sanitization
- `scripts/` — local setup, dev launcher, password reset
- `test/` — security, uploads and HTTP integration checks
- `app.js` — Express app
- `server.js` — database connection and server startup

## Production

See `../frontend/DEPLOY.md` for Vercel + backend hosting. The two extra private proxy variables are only needed for that split deployment.

To build and serve both from this backend:

```bash
npm run build
npm start
```

Set production environment and configure HTTPS on your host first. `npm run build` builds the sibling frontend, including server-rendered blogs. `PORT` can be supplied automatically by the host; default 4000. Production listens on `0.0.0.0`, development on `127.0.0.1`.

Optional hosting controls, only if your setup needs them: `HOST`, `PORT`, `ALLOWED_ORIGINS` (comma-separated trusted website URLs), `TRUST_PROXY=1` (only with exactly one trusted reverse proxy). Never set trust-proxy blindly. If your site domain changes, also change frontend siteConfig and rebuild.

## Checks and recovery

```bash
npm test
npm run build
npm run test:integration
```

Integration checks use a temporary MongoDB, not your Atlas database. Their first run may download a test MongoDB binary.

For an existing admin password recovery, see `npm run reset-password -- --help` / `scripts/reset-password.mjs`. Use only from the trusted backend terminal. No public reset/backdoor route is included.
