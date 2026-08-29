import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

// News posts are plain Markdown files on disk, one per article, per language.
// A CMS (Phase 04) writes into these folders; nothing else needs to change.
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    // Written as YYYY-MM-DD in the file; coerced to a Date for sorting.
    date: z.coerce.date(),
    summary: z.string(),
    // Optional cover image, relative to /public
    image: z.string().optional(),
    // Hide a post without deleting it.
    draft: z.boolean().default(false),
  }),
});

export const collections = { news };
