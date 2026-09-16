# Zuhd Tours — Vercel Deployment

## Deploy with Vercel

1. Extract this ZIP.
2. Push the project folder to GitHub (recommended), or import the folder into Vercel.
3. In Vercel, choose **Other / Vite** if it asks for a framework.
4. Use these settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Deploy.

`vercel.json` is included so React Router URLs such as `/desert-safari-dubai-tours`, `/dubai-city-tours`, `/about`, `/contact`, and `/blog/...` continue to work after refresh/direct navigation.

## Local check

```bash
npm install
npm run build
npm run preview
```

No database or server-side setup is required for this frontend.
