// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// Production domain. Canonical links, the sitemap, and Open Graph URLs are
// all built from this value. Must be the www subdomain - that's the domain
// Vercel actually serves content on (the apex 3stoneai.com only 308-redirects
// to www). Pointing this at the apex created a canonical/redirect loop that
// got the whole site excluded from Google's index - see the GSC "Alternate
// page with proper canonical tag" report, 2026-07-28.
export default defineConfig({
  site: 'https://www.3stoneai.com',
  integrations: [
    sitemap({
      // Internal tooling (the env-gated pricing admin dashboard) must never
      // be advertised in the sitemap, whatever the build flags say. The
      // public /pricing redirect should also stay out of the sitemap.
      filter: (page) => !page.includes('/internal/') && !page.includes('/pricing'),
    }),
  ],
});
