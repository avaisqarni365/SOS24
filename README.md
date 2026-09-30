# sos-abdichtung.de

Website of sos-abdichtung (SchimmelPeter® partner, Wuppertal / PLZ 42).
Next.js static export, hosted on GitHub Pages at **https://sos-abdichtung.de**.

## Requirements

- Node.js **22.6 or newer** (`node -v`)
- pnpm (`corepack enable`, or `npm install -g pnpm`)
- Git, with this repository cloned (e.g. `D:\SOS24`)

```powershell
cd D:\SOS24
pnpm install
```

## Everyday commands

| Command | What it does |
|---|---|
| `pnpm dev` | Development server with live reload at http://localhost:3000 |
| `pnpm check` | The full gate: TypeScript, production build, SEO and link checks |
| `pnpm preview` | Serves the last build exactly as it goes live: http://localhost:3000 |
| `pnpm release` | Runs `pnpm check`, then publishes (pushes `main`) |
| `pnpm release --check` | Runs the checks only, publishes nothing |

A typical round:

```powershell
git checkout main
git pull
pnpm check      # must end with "All checks passed."
pnpm preview    # look at it in the browser, Ctrl+C to stop
pnpm release    # goes live in about 1-2 minutes
```

## What `pnpm check` verifies

For every page of the build (`out/`):

- exactly one `<h1>`, a unique `<title>` of at most 60 characters, a meta description
- the page's **target keyword** in title and H1 (and a warning if it is missing from the description);
  the keywords come from `src/data/seo-pages.ts`, the homepage targets "Kellersanierung Wuppertal"
- canonical URL on `https://sos-abdichtung.de`, no `noindex`, a share image (`og:image`)
- valid JSON-LD structured data
- no broken internal links, no links to missing anchors (`/#kontakt` etc.), no missing images, every image has alt text
- `sitemap.xml` lists every page and only real pages; `robots.txt` points to it

It prints a keyword table (title / h1 / description per page) and stops with an error if anything fails,
so a broken page never goes live.

## How deploying works

`.github/workflows/deploy.yml`:

- **Pull requests**: runs `pnpm check`.
- **Push to `main`**: runs `pnpm check`, then builds and deploys to GitHub Pages.
  The custom domain (`sos-abdichtung.de`) is set under *Settings → Pages*; the workflow reads it from GitHub,
  so the same file also works for a `*.github.io/SOS24/` preview.

`pnpm release` only pushes after the local checks pass, from a clean `main`.
Progress: https://github.com/avaisqarni365/SOS24/actions

## Content

- Service and city pages (titles, keywords, text, FAQ): `src/data/seo-pages.ts`
- 3D scenes (Keller innen/außen, Garage, Wohnraum), steps and materials: `src/data/scenes3d.ts`
- Company data (phone, address, e-mail): `src/data/content-data.ts`
- `public/llms.txt` is generated from these files on every build.
