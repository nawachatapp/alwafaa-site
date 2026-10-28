# Alwafaa website and deployment

## Project

This is the published Alwafaa Lebanese School website, in Arabic and English.
Repository: `nawachatapp/alwafaa-site`, default branch `main`.
The local source is `/Users/nawa/Desktop/nawa/alwafaa-site`.

It is an Astro static site. Use `npm ci`, `npm run check`, and `npm run build`;
only the generated `dist/` belongs on the web server. The lockfile currently
pins Astro 7.2.9 and records Node >=22.12.0. No Node service or database is
needed on the droplet. `node_modules/`, `.astro/`, and `dist/` are ignored.

The canonical site is `https://www.alwafaaschool.com`; keep `site` in
`astro.config.mjs` and the sitemap URL in `public/robots.txt` consistent.
Both languages have explicit `/ar/` and `/en/` routes. The web portal is a
separate service linked at `https://alwafaa.nawaapp.com/`.

## Hosting

- Existing DigitalOcean droplet: `46.101.110.129`.
- This website's web root: `/var/www/alwafaa`.
- Nginx configuration: `/etc/nginx/sites-available/alwafaaschool.com`, enabled
  through `/etc/nginx/sites-enabled/alwafaaschool.com`.
- Domains: `alwafaaschool.com` and `www.alwafaaschool.com`, with HTTPS.
- Other website roots on this droplet belong to other projects; do not modify
  them or reuse another site's deployment credentials.

The parent `../DEPLOY-RUNBOOK.md` points to the shared automation handover.
The older coming-soon directory is not the live site's source. On 2026-10-28, public `/`,
`/en/`, and `/ar/` responses matched this checkout's existing `dist/` exactly;
the full Astro site was already live. Local HEAD and remote `main` both pointed
to `19eb0daf818356ea11aaccc3eb15a16c3c2d3bd8`. A new check and build both passed.

## Automatic deployment rollout

On 2026-10-28 the user authorized automatic deployment for this site and the
other three sites on the droplet. The intended workflow is:

`push to main -> GitHub-hosted check/build -> protected SSH deployment of dist/`

The workflow belongs in `.github/workflows/`, uses a dedicated per-site
identity, and targets only `/var/www/alwafaa`. Repository secrets are
`DEPLOY_SSH_KEY` and `DEPLOY_KNOWN_HOSTS`; repository variables are
`DEPLOY_HOST` and `DEPLOY_USER`. Private keys must never appear in source,
logs, or public output. Deployment documentation and source files do not
belong in `dist/` or on the public site.

At this document's creation, activation and a real GitHub workflow run still
required confirmation by the deployment operator. Do not claim push-to-deploy
is working solely because a workflow file exists; check the latest Actions
run and the receiver's deployed revision. Content-only deployment does not
require changing Nginx or DNS. Preserve certificate-validation files and any
server-only paths configured in the receiver.

## Content notes

The README and page frontmatter mark copy that the school still needs to
review; automating deployment does not verify those claims. `public/admin/`
still has `repo: OWNER/REPO` and an unverified authentication relay. Its news
editor needs separate authentication/repository configuration. Do not claim
the editor is functional just because public website deployment works.
