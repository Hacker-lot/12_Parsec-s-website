# 12_PARSEC STUDIO

Personal portfolio for **12_Parsec** — a one-man studio. Raw brutalism, 80s
terminal, and a Kessel Run's worth of negative film.

## Stack

- **React 18 + Vite 5**
- **GSAP** — entrance + focus animations
- **three.js** — hyperspace starfield background
- **React Router** — `/` (home), `/work` (project storm), `/about` (who am I)

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Deploy (Vercel)

Push to `main`; Vercel builds with `npm run build` and publishes `dist/`.
`vercel.json` provides the React Router SPA fallback and immutable asset caching.
The production domains are `io12parsec.com` and `www.io12parsec.com`.
## Editing content

- **Photos** — drop images into `src/assets/images/` (`.jpg`); they're swept into
  the storm automatically (`src/lib/stormImages.js`).
- **Projects** — `src/data/projects.js` (title, tags, links, description).
- **About** — `src/pages/About.jsx` (bio, specs table, skills).
- **Theme** — `src/styles/global.css` (colors are CSS variables at the top).
