# 3Stone AI Website

The public marketing site for 3Stone AI — custom software that solves real business problems, showcasing BetAI as the company's first portfolio product.

## Pages

- **Home** — hero, the problem we solve, services preview, how we work, featured project (BetAI), why 3Stone AI, client stories (placeholder), final CTA
- **Services** — all 9 services offered
- **Portfolio** — BetAI case study, plus "coming soon" slots for future products
- **About** — founder story, mission, values
- **Contact** — a mailto-based contact form (no backend yet — see "Known placeholders" below) plus direct email/LinkedIn

## Tech stack

- **Astro** — static-site generation, so every page is real, separate, crawlable HTML (unlike a single-page app, this is good for SEO)
- **TypeScript**
- **Plain CSS** with a design-token theme (`src/styles/theme.css`) — the same dark-theme approach as [BetAI](https://github.com/jathanks3/bet-ai), with its own bronze/gold accent color instead of BetAI's teal, so the two feel related but distinct
- **`@astrojs/sitemap`** — auto-generates `sitemap.xml` for search engines

No backend, no database, no forms that submit anywhere except the visitor's own email client. This is a static site by design at this stage.

## Getting started

**Prerequisites:** Node.js 22.12+ (required by Astro 7), npm 10+.

```bash
npm install
npm run dev       # start the dev server (http://localhost:4321)
npm run build     # produce a production build in dist/
npm run preview   # serve the production build locally
```

## Brand system — designed to be swapped

Nothing brand-specific is hardcoded into pages:

- **`src/config/brand.ts`** — company name, tagline, contact details, services list. Edit this file to change copy anywhere it's reused.
- **`public/logo-mark.svg`** — the logo mark, inlined at build time by `src/components/BrandMark.astro` so its color follows CSS. Replace this one file (and update `public/favicon.svg` to match) when the final logo is ready.
- **`src/styles/theme.css`** — colors, type, spacing tokens.

## Production status

**Live domain:** `3stoneai.com` (configured as `site` in `astro.config.mjs`, and connected via Vercel — see `DEPLOYMENT.md`).

**Resolved for launch:**
- Contact email domain matches the real production domain (`hello@3stoneai.com`)
- Site URL, canonical links, sitemap, and Open Graph tags all point at `3stoneai.com`
- `robots.txt` added, pointing search engines at the sitemap

**Still placeholder — blocked on an external service that doesn't exist yet, not on code:**
- `brand.contactEmail` (`hello@3stoneai.com`) — the domain is real, but the inbox needs Google Workspace (or similar) set up before it can receive mail
- `brand.linkedinUrl` — placeholder URL; no LinkedIn Company Page created yet
- `brand.discoveryCallUrl` — currently points at `/contact`; swap for a real Calendly (or similar) link once one exists, to allow direct booking instead of a contact form
- The logo mark (`public/logo-mark.svg`, `public/favicon.svg`) is a placeholder evolution of the 3Stone Capital mark, not a final designed logo
- The BetAI preview on the Portfolio page is a CSS mockup, not a real screenshot — swap in an actual screenshot of the live app when convenient

All four are defined once in `src/config/brand.ts` (or the two SVG files) — updating them there updates every page that uses them.

## Deployment

See `DEPLOYMENT.md` for the full checklist, including connecting the `3stoneai.com` custom domain.
