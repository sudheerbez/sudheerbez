# Cinematic 3D Portfolio — Sudheer Bezawada

Award-style personal site: huge typography, a persistent WebGL stage, and scroll-driven cinema.

## Stack

- Vite + React + TypeScript
- Three.js / React Three Fiber
- GSAP ScrollTrigger
- Lenis smooth scroll

## Local

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

GitHub Pages deploys from `main` via `.github/workflows/pages.yml`. Enable **Settings → Pages → GitHub Actions** after merge. Netlify can publish `dist` with the included `netlify.toml`.
