# Rubik's Cube Solver

**Live: [rubiksolver.zeeshanai.cloud](https://rubiksolver.zeeshanai.cloud)**

Interactive 3D Rubik's Cube solver built with Next.js. The landing page shows a live demo cube looping through real solves; the solver page loads a randomly scrambled cube, computes a near-optimal solution (Kociemba two-phase, ~20 moves), and animates it move-by-move in 3D.

## Routes

- `/` — server-rendered landing page with an animated 3D hero cube
- `/solve` — the interactive solver (client-only)
- `/contact` — contact form (n8n webhook, honeypot + per-IP rate limiting)
- `/privacy` — privacy policy

## Features

- 3D cube rendered with react-three-fiber — drag to orbit, scroll to zoom
- **Solve**: Kociemba two-phase solver (`cubejs`) running in a Web Worker
- Full playback controls: play/pause, step forward/back, speed slider
- Solution shown in standard notation with the current move highlighted
- **New Scramble** button and manual face turns (U D L R F B and primes)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. On `/solve`, the solver takes a few seconds to initialize its pruning tables on first load (the Solve button shows "Preparing solver…" until ready).

Environment variables go in `.env.local` — all are optional for running the app locally:

```bash
# Contact form
N8N_CONTACT_WEBHOOK_URL=   # n8n webhook that receives submissions
N8N_API_KEY=               # sent as x-api-key header
UPSTASH_REDIS_REST_URL=    # per-IP rate limiting (fails open if unset)
UPSTASH_REDIS_REST_TOKEN=

# Analytics + metadata (NEXT_PUBLIC_* are inlined at build time)
NEXT_PUBLIC_UMAMI_SCRIPT_URL=   # e.g. https://<umami-host>/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=   # site UUID from the Umami dashboard
NEXT_PUBLIC_SITE_URL=           # canonical origin for metadataBase / OG tags
```

The Umami tracker only renders when `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is set, so analytics stay off by default in local dev.

## How it works

The single source of truth is a 54-character facelet string (Kociemba order) manipulated via `cubejs`; the 3D view is always re-derived from it, so visuals can never drift from the logical cube.

- `lib/cube-logic.ts` — maps the facelet string to sticker colors on 26 cubie meshes
- `components/cube-3d.tsx` — face turns animate by rotating the 9 affected cubies under a pivot group; on completion the move is committed to the logical cube and colors re-derive from its facelet string
- `lib/solver.worker.ts` — solver init + solve off the main thread
- `components/landing/hero-cube.tsx` — landing demo cube reusing the same renderer with precomputed scramble/solution pairs (no solver init cost on the landing page)
- `scripts/verify-rotation.ts` — checks the visual rotation convention matches cubejs for all 18 moves (`npx tsx scripts/verify-rotation.ts`)

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · three.js / @react-three/fiber / drei · cubejs

## Deployment

Self-hosted on a Hostinger VPS running [Coolify](https://coolify.io), built with nixpacks on Node 22 and served behind Traefik with an auto-renewing Let's Encrypt certificate. Page-view analytics come from a self-hosted [Umami](https://umami.is) instance (cookieless, no consent banner required).

Pushing to `main` triggers `.github/workflows/deploy.yml`, which calls Coolify's deploy API with retries. It needs two repo secrets: `COOLIFY_API_TOKEN` (deploy-scoped) and `COOLIFY_APP_UUID`.

> **Note:** `package-lock.json` must be generated on Linux. npm on Windows prunes transitive `@emnapi/*` deps that the container build's `npm ci` requires, which breaks deploys without ever failing a local build — see CLAUDE.md for the regeneration command.

## Developer

Developed with 💖 by [Zeeshan Altaf](https://www.zeeshanai.cloud)
