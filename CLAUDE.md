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

Playback: `solutionIdx` = moves already applied. Step-forward animates
`solution[idx]`; step-back animates `invert(solution[idx-1])` and decrements.
Manual turns clear the stored solution (it's stale for the new state).

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
- Folder name contains a space ("Rubik Solver") — quote paths in shell commands;
  the npm package name is `rubik-solver`.
