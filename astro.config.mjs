// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Update `site` if the school ever moves domain - it drives canonical URLs,
// the sitemap, and the og:image absolute paths.
export default defineConfig({
  site: 'https://www.alwafaaschool.com',

  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    routing: {
      // Both languages keep an explicit prefix (/ar/, /en/) so neither is a
      // second-class citizen and language detection has somewhere to send people.
      prefixDefaultLocale: true,
    },
  },

  build: {
    // Emit /ar/about/index.html rather than /ar/about.html so Nginx serves
    // clean URLs with no config beyond the default.
    format: 'directory',
  },

  integrations: [
    sitemap({
      // Tell search engines the two language versions are equivalent, so the
      // right one is served to the right reader.
      i18n: {
        defaultLocale: 'ar',
        locales: { ar: 'ar-LB', en: 'en-US' },
      },
    }),
  ],
});
