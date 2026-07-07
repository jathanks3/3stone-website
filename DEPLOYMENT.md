# Deployment Checklist

The 3Stone AI website is a static Astro site. No backend, no database, no server-side secrets — it deploys like any static site.

## 1. Pre-deploy

- [ ] `npm run build` completes with zero errors
- [ ] `npm run preview` and click through all 5 pages
- [ ] Confirm `astro.config.mjs`'s `site` value matches the real production domain (`https://3stoneai.com`)
- [ ] Confirm no real secrets are committed (this project has none by design, but check `git status` before pushing regardless)

## 2. Git / GitHub

- [ ] Repo initialized, initial commit made, pushed to GitHub (same process as `bet-ai`)

## 3. Hosting — Vercel

**Deploying via the Vercel dashboard:**

1. In Vercel: **Add New... → Project → Import Git Repository**, select this repo.
2. Vercel auto-detects the **Astro** framework preset:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. No environment variables are required.
4. Click **Deploy**.

## 4. Connecting the custom domain (3stoneai.com)

1. In the Vercel project: **Settings → Domains → Add**, enter `3stoneai.com` (and `www.3stoneai.com` if you want the `www` version to work too).
2. Vercel shows the DNS records to add at your domain registrar:
   - For the apex domain (`3stoneai.com`): an **A record** pointing to Vercel's IP (`76.76.21.21`) — Vercel's dashboard always shows the current correct value, use what it displays, not this document.
   - For `www.3stoneai.com`: a **CNAME record** pointing to `cname.vercel-dns.com`.
3. Add those records in your registrar's DNS settings.
4. Wait for DNS propagation (usually minutes, can take up to ~24 hours). Vercel automatically issues an SSL certificate once it verifies the domain.
5. Decide which is canonical — `3stoneai.com` or `www.3stoneai.com` — and set the other to redirect to it (Vercel's domain settings have a toggle for this).

## 5. Post-deploy smoke test

- [ ] Load `https://3stoneai.com` — confirm it resolves and HTTPS is active (padlock, no certificate warning)
- [ ] Click through all 5 pages
- [ ] Confirm the contact form's mailto action opens a mail client with the correct address
- [ ] Load on a phone / responsive dev tools to confirm mobile layout and the mobile nav menu work
- [ ] Check `https://3stoneai.com/sitemap-index.xml` and `https://3stoneai.com/robots.txt` both load

## 6. After external services are set up

These aren't launch blockers, but update them as soon as each service exists (all defined once in `src/config/brand.ts`):

- [ ] Google Workspace (or similar) live for `hello@3stoneai.com` — confirm mail is actually received
- [ ] LinkedIn Company Page created — update `brand.linkedinUrl`
- [ ] Calendly (or similar) set up — update `brand.discoveryCallUrl` for direct booking
- [ ] Real screenshot of BetAI to replace the CSS mockup on the Portfolio page
- [ ] Final designed logo to replace `public/logo-mark.svg` / `public/favicon.svg`
