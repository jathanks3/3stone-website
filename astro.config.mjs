// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// Production domain. Canonical links, the sitemap, and Open Graph URLs are
// all built from this value.
export default defineConfig({
  site: 'https://3stoneai.com',
  integrations: [
    sitemap({
      // Internal tooling (the env-gated pricing admin dashboard) must never
      // be advertised in the sitemap, whatever the build flags say.
      filter: (page) => !page.includes('/internal/'),
    }),
  ],
});
