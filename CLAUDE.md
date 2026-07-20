@AGENTS.md

# Rubik's Cube Solver

Next.js app with two routes: `/` is a server-rendered marketing/landing page,
`/solve` is the client-only interactive solver. The solver loads a randomly
scrambled 3×3×3 cube in 3D, computes a Kociemba two-phase solution (~20 moves),
and animates it move-by-move with full playback controls (play/pause, step ±,
speed), manual face turns, and re-scramble.

## Commands

```bash
npm run dev                            # dev server on :3000
npm run build                          # production build (Turbopack)
npm run lint                           # eslint
npx tsx scripts/verify-rotation.ts     # rotation-convention regression check
```

No test framework is set up; `verify-rotation.ts` is the only automated check.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 ·
three.js via @react-three/fiber + @react-three/drei · `cubejs` (cube model + solver).

## Architecture

Single source of truth is the **logical cube** — a 54-char facelet string
(Kociemba order: U R F D L B, manipulated via `cubejs`) that drives everything.

- `app/page.tsx` — landing page (server component; owns landing metadata).
  Composes `components/landing/*` sections. Never imports cubejs or three
  directly; the hero's 3D cube loads through a client island.
- `app/solve/page.tsx` — server wrapper exporting `/solve` metadata; renders
  `app/solve/solve-client.tsx`, which dynamic-imports `rubik-solver` with
  `ssr: false`.
- `components/landing/hero-cube.tsx` — landing demo cube: reuses `Cube3D` with
  its own Canvas, loops precomputed scramble/solution pairs from
  `lib/demo-solves.ts` (no solver worker, so no ~4 s init on the landing page).
  Pairs were generated once with `Cube.initSolver()` + `solve()`; regenerate the
  same way if they ever change.
- `components/rubik-solver.tsx` — root client component of `/solve`. All cube
  state (facelet string, current animation, solution moves + index, playing
  flag) lives in one `useReducer`; move commits are pure
  (`Cube.fromString(facelets).move(...).asString()`), so there is no cubejs
  instance ref and no auto-play effect — `animComplete` chains straight into
  the next solution move while playing. Solver plumbing (ready/solving/error)
  stays in separate `useState`s fed by the worker callback.
- `components/cube-3d.tsx` — renders 26 cubies (positions from `CUBIE_POSITIONS`,
  colors looked up in the sticker map). A face turn re-parents the 9 affected
  cubies under a pivot group and tweens its rotation in `useFrame`; when done it
  calls `onAnimComplete`, which dispatches `animComplete` to commit the move and
  re-derive all sticker colors. Visuals therefore can never drift from logic.
- `components/cube-canvas.tsx` — R3F `<Canvas>`, lights, OrbitControls.
- `components/{controls-panel,solution-display,manual-controls}.tsx` — UI panels.
- `lib/cube-logic.ts` — facelet-string → sticker-color map (`getStickerMap`),
  `SOLVED_FACELETS`, `STICKER_COLORS`, cubie grid positions.
- `lib/moves.ts` — `Move` type ({face, turns: 1|2|3} = CW quarter turns), notation
  parse/format, `invert`, `randomScramble`.
- `lib/solver.worker.ts` — Web Worker running `Cube.initSolver()` (takes ~4 s;
  started on mount) and `solve()`. Message types: `SolverRequest`/`SolverResponse`.
- `types/cubejs.d.ts` — hand-written typings; `cubejs` ships none.
- `app/contact/` + `app/api/contact/route.ts` + `components/contact/contact-form.tsx`
  — contact form (progressive enhancement: native POST fallback + fetch path)
  posting to an n8n webhook, honeypot field `hp_field`, per-IP rate limiting via
  `lib/rate-limit.ts` (Upstash, fails open). Env vars in `.env.local`:
  `N8N_CONTACT_WEBHOOK_URL`, `N8N_API_KEY`, `UPSTASH_REDIS_REST_URL/TOKEN`.
- `app/privacy/page.tsx` — static privacy policy. Both it and `/contact` share
  `components/landing/{site-nav,site-footer}.tsx`.
- `app/layout.tsx` — root layout (fonts, `metadataBase`, global metadata). Also
  mounts the self-hosted Umami tracker via `next/script`, gated on
  `NEXT_PUBLIC_UMAMI_WEBSITE_ID` so it renders only when configured. Umami tracks
  SPA navigations itself — mount it once here, never per-page.

Playback: `solutionIdx` = moves already applied. Step-forward animates
`solution[idx]`; step-back animates `invert(solution[idx-1])` and decrements.
Manual turns clear the stored solution (it's stale for the new state).

## Deployment

Self-hosted on a Hostinger VPS (`76.13.7.106`) running Coolify + Traefik, live at
**https://rubiksolver.zeeshanai.cloud**. Coolify project "Rubik Solver",
application uuid `ynfnrvabpztjg5vly01yuaxx`; built with nixpacks (no Dockerfile)
on Node 22, container listens on 3000. Traefik terminates TLS and auto-renews the
Let's Encrypt cert.

Pushing to `main` triggers `.github/workflows/deploy.yml`, which calls Coolify's
deploy API with retries (repo secrets `COOLIFY_API_TOKEN` — deploy-scoped — and
`COOLIFY_APP_UUID`). Coolify's own git-push webhook is deliberately *not* used:
it is fire-once with no retry. Don't enable both, or every push double-deploys.

Env vars live in Coolify, not in the repo. The split matters:

- **Build-time**: `NEXT_PUBLIC_UMAMI_SCRIPT_URL`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`,
  `NEXT_PUBLIC_SITE_URL`, `NIXPACKS_NODE_VERSION`, `NODE_ENV`.
- **Runtime**: `N8N_CONTACT_WEBHOOK_URL`, `N8N_API_KEY`,
  `UPSTASH_REDIS_REST_URL/TOKEN`.

## Conventions & gotchas

- **Rotation convention** (`cube-3d.tsx`): clockwise sign is −1 for U/R/F and +1
  for D/L/B around their world axes; primes animate as −90°, not +270°. This is
  verified against cubejs for all 18 moves by `scripts/verify-rotation.ts` — run
  it after touching `CW_SIGN`, `LAYER`, `targetAngle`, or `FACE_DEFS` in
  `lib/cube-logic.ts`.
- **SSR is disabled for the solver tree**: `app/solve/solve-client.tsx` loads
  `rubik-solver` via `next/dynamic` with `ssr: false` (WebGL + random scramble
  at init), and the landing hero cube is likewise a `ssr: false` island
  (`components/landing/hero-cube-island.tsx`). Keep it that way; don't import
  cubejs or three into server components.
- `<body>` has `suppressHydrationWarning` (browser extensions inject attributes);
  don't remove it.
- The worker is created with `new Worker(new URL("../lib/solver.worker.ts",
  import.meta.url))` — the pattern both Turbopack and webpack can bundle.
- UI state invariants: exactly one animation at a time (`anim`); all buttons that
  enqueue moves are disabled while `busy` (anim in flight or auto-playing).
  Preserve this — concurrent animations corrupt the pivot-group trick.
- npm audit noise comes from `cubejs`'s ancient dev-time transitive deps; nothing
  from them ships to the client. Don't run `npm audit fix --force`.
- **`package-lock.json` must stay Linux-resolvable.** Running `npm install` on
  Windows can prune the nested `@emnapi/*` entries under
  `@unrs/resolver-binding-wasm32-wasi` / `@tailwindcss/oxide-wasm32-wasi` (their
  parents never install on win32). The container build then dies on `npm ci` with
  `Missing: @emnapi/runtime@… from lock file` — a deploy-only failure that local
  builds never reproduce. `npm install --package-lock-only` on Windows does *not*
  fix it (it still picks the Windows-resolved version). Regenerate on Linux:
  ```bash
  docker run --rm -v /tmp/lockgen:/out node:22-alpine sh -c \
    "apk add --no-cache git >/dev/null && git clone -q --depth 1 <repo> /r && cd /r \
     && rm -f package-lock.json && npm install --package-lock-only --ignore-scripts \
     && npm ci --dry-run >/dev/null && cp package-lock.json /out/"
  ```
  Then verify `npm ci --dry-run` still passes on Windows and that the
  `@img/sharp-win32-*` entries survived. Escape hatch if it keeps regressing: set
  `NIXPACKS_INSTALL_CMD=npm install` in Coolify to bypass `npm ci` entirely.
- **`NEXT_PUBLIC_*` are inlined at build time**, so they must be marked
  build-time in Coolify — not just runtime. Set only at runtime, the client
  bundle ships `undefined` and the Umami tracker silently never loads while the
  build still goes green. Same trap makes `metadataBase` fall back to
  `localhost:3000` and emit wrong canonical/OG URLs in production.
- Folder name contains a space ("Rubik Solver") — quote paths in shell commands;
  the npm package name is `rubik-solver`.
