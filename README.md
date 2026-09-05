# Alwafaa Lebanese School — Website

مدرسة الوفاء اللبناني · Est. 2000

Bilingual (Arabic / English) static website built with **Astro**.
Builds to plain HTML — no Node, PHP or database runs on the server.

---

## Quick start

```bash
npm install      # once
npm run dev      # local preview at http://localhost:4321
npm run build    # writes the deployable site to dist/
npm run preview  # serve dist/ locally, exactly as the server will
npm run check    # typecheck (should report 0 errors)
```

## Project layout

```
public/               Served as-is at the site root
  logo.png            School crest
  favicon*.png        Tab icons
  apple-touch-icon.png
  robots.txt

src/
  styles/
    tokens.css        ← EVERY colour, font and spacing value. Start here.
    global.css        Base elements + shared classes (.wrap, .btn, .rule)
  i18n/
    ui.ts             ← ALL navigation and UI text, both languages
    utils.ts          Language helpers (t(), path building, switcher)
  components/
    Header.astro      Nav, language switcher, mobile menu
    Footer.astro      Site map, contact, copyright
    Hero.astro        Homepage crest banner
  layouts/
    BaseLayout.astro  <head>, SEO tags, language detection, page shell
  pages/
    index.astro       Root — redirects to the reader's language
    ar/               Arabic pages (RTL)
    en/               English pages (LTR)
```

## How to make common changes

**Change a colour or font** → `src/styles/tokens.css`. One value, changes everywhere.
Components never hardcode a hex value.

**Rename a menu item** → `src/i18n/ui.ts`. Appears in the header and footer automatically.

**Add a page** → create `src/pages/ar/thing.astro` *and* `src/pages/en/thing.astro`,
then add one entry to `navItems` in `src/i18n/ui.ts`. It appears in the nav,
the footer and the sitemap with no further work.

## Bilingual behaviour

- Both languages are prefixed: `/ar/…` and `/en/…`. Neither is second-class.
- Visiting `/` redirects once, based on the browser's language, then remembers
  the choice in `localStorage`. **Deep links are never redirected** — a page
  shared in English stays English.
- The language switcher keeps the reader on the same page, not the homepage.
- Layout uses CSS logical properties, so RTL and LTR share one set of rules.

## Deployment (DigitalOcean droplet)

The droplet already serves the coming-soon page over Nginx + HTTPS.

```bash
npm run build                      # produces dist/
rsync -av --delete dist/ user@droplet:/var/www/alwafaa/
```

Point the Nginx root at that directory. Because the build uses
`format: 'directory'`, clean URLs work with no extra Nginx config.

**Keep the old coming-soon page** (`../alwafaa-website/`) as an instant rollback
until the new site is confirmed working.

## Publishing news (for school staff)

Staff write news posts at **https://www.alwafaaschool.com/admin/** — a normal
editor in the browser, no code. Saving writes a Markdown file into
`src/content/news/` and the site rebuilds.

Arabic and English posts are separate collections, so a post can exist in one
language only. Tick **Draft** to keep a post off the live site.

### Before the CMS works

Set the repository in `public/admin/config.yml`:

```yaml
backend:
  repo: OWNER/REPO   # ← the school's GitHub repository
```

The CMS commits to GitHub, so the site must live in a Git repository and the
droplet must rebuild on push (a webhook, a cron `git pull && npm run build`,
or a small deploy hook — decided in Phase 05).

## Adding news without the CMS

Drop a Markdown file into `src/content/news/ar/` or `src/content/news/en/`:

```markdown
---
title: عنوان الخبر
date: 2026-09-01
summary: سطر أو سطران يظهران في لائحة الأخبار.
draft: false
---

نص الخبر هنا.
```

The filename becomes the URL. The listing page, the homepage's latest-three,
and the sitemap all pick it up automatically.

## Status

**Phases 01–04 built.**

| Page | Arabic | English |
|---|---|---|
| Home | done | done |
| About | done | done |
| Academics | done | done |
| Admissions | done | done |
| Contact | done | done |
| News (list + posts) | done | done |
| Gallery | awaiting photos | awaiting photos |

20 pages build clean; `npm run check` reports 0 errors, 0 warnings, 0 hints.

### Contact details

Real numbers live in `src/i18n/contact.ts` — one place, used by the footer,
the contact page and every call-to-action band:

- `07 511 144` — dials `+961 7 511 144`
- `03 897 216` — dials `+961 3 897 216`

Phone links carry `dir="ltr"` so the digits stay in dialling order inside
Arabic right-to-left text.

### Still needed before launch

- **Street address** — footer and contact page currently say only "Lebanon"
- **Office hours** — a plausible guess, flagged on the contact page
- **Photographs** — the gallery is empty and shows a placeholder notice
- **Admissions policy** — the documents, steps and dates on the admissions
  page are INVENTED. A parent could arrive with the wrong paperwork. This is
  the single most important page for the school to correct.
- **All page copy** — DRAFT throughout. Every factual claim (founding story,
  cycles offered, languages taught, curriculum) needs confirmation. Each page
  file carries a `DRAFT COPY` comment in its frontmatter.
- **GitHub repository** — set `backend.repo` in `public/admin/config.yml`

### Remaining work (Phase 05)

- Compress `logo.png` (461 KB, the bulk of the page weight)
- Test on real phones over a slow connection
- Deploy path onto the droplet, and a rebuild-on-push hook
- Keep the old coming-soon page as an instant rollback
