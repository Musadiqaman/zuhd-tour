# Hosting: Vercel frontend + Node backend

Use this only if the frontend stays on Vercel. For one Node server serving both apps, follow the backend README.

## Node backend host

Keep both folders in the repository/deployment. The backend needs the frontend SSR build to serve live blogs and media correctly.

Repository-root commands:

```bash
npm --prefix backend ci --omit=dev
npm --prefix frontend ci
npm --prefix frontend run build
npm --prefix backend start
```

Set the 5 environment variables described in `backend/README.md`, using `NODE_ENV=production` and your real Atlas URI. In addition generate one private proxy token:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Set this as **PROXY_SECRET** on the backend and the same value on Vercel. Your backend host must expose an HTTPS origin, for example `https://api.your-domain.com`. Keep this proxy secret separate from SETUP_TOKEN.

## Vercel

Project Root Directory: **frontend**
Build Command: **npm run build**
Output Directory: **dist**

Add only these two server environment variables:

| Variable | Value |
| --- | --- |
| `BACKEND_ORIGIN` | Your real hosted backend HTTPS origin, without a trailing slash. |
| `PROXY_SECRET` | Exactly the same private token as the backend. |

Never add the `VITE_` prefix. Neither value belongs in the browser bundle. Elfsight ID belongs on the backend only; public widget configuration comes from its API.

Redeploy Vercel after changing its environment. The included `vercel.json` proxies `/api`, `/media`, `/blog`, `/blog/:slug` and `/sitemap.xml` to the backend. Other public pages remain prerendered on Vercel.

First admin route: `https://www.zuhdtours.com/admin/setup`. Use backend SETUP_TOKEN, create the account, then blank that token and restart the backend. Existing accounts must sign in through `/admin/login`.

## Deployment checks

1. `/api/health` works through the public domain.
2. `/admin/setup` can create only the first admin, then `/admin/login` works.
3. Publish a guide and confirm its public `/blog/slug` page and sitemap entry.
4. Upload an image and confirm `/media/...webp` opens.
5. Admin → Google reviews reports the Elfsight ID; the published widget displays on the homepage. No real App ID was supplied with this revision.
6. Confirm canonical site URL remains `https://www.zuhdtours.com` and redirects still work.
