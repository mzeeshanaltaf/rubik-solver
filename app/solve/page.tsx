import type { Metadata } from "next";
import Link from "next/link";
import SolveClient from "./solve-client";
import { SiteFooter } from "@/components/landing/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL, SITE_NAME, AUTHOR } from "@/lib/site";

export const metadata: Metadata = {
  // `absolute` skips the "%s · Rubik Solver" template — the brand is already
  // in this title, and the suffix pushed it past the ~60-char SERP limit.
  title: { absolute: "Rubik's Cube Solver — Scramble and Solve in 3D" },
  description:
    "Free online Rubik's Cube solver. Scramble a 3D cube, get a Kociemba two-phase solution of about twenty moves, and step through every turn at your own speed.",
  alternates: { canonical: "/solve" },
  openGraph: {
    title: "Rubik's Cube Solver — Scramble and Solve in 3D",
    description:
      "Scramble, solve, and step through every move of a Kociemba two-phase solution in 3D.",
    type: "website",
    url: "/solve",
  },
};

const NOTATION = [
  { face: "U", name: "Up", note: "the top face" },
  { face: "R", name: "Right", note: "the right-hand face" },
  { face: "F", name: "Front", note: "the face toward you" },
  { face: "D", name: "Down", note: "the bottom face" },
  { face: "L", name: "Left", note: "the left-hand face" },
  { face: "B", name: "Back", note: "the face away from you" },
];

const STEPS = [
  "The cube loads already scrambled. Press Scramble at any time for a new random position.",
  "Press Solve. The solver runs in a background worker and returns a solution of roughly twenty moves.",
  "Playback starts automatically. Pause, step forward or back one move, or change the speed as it runs.",
  "Use the manual face buttons to turn any face yourself. Doing so clears the current solution, since it no longer applies.",
];

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${SITE_URL}/solve#app`,
  name: "Rubik Solver",
  url: `${SITE_URL}/solve`,
  applicationCategory: "GameApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a browser with WebGL and Web Worker support.",
  description:
    "A 3D Rubik's Cube solver that runs entirely in the browser. Scrambles a cube, computes a Kociemba two-phase solution of about twenty moves, and animates each move with full playback controls.",
  featureList: [
    "3D cube rendered with WebGL",
    "Kociemba two-phase solutions of about twenty moves",
    "Move-by-move playback with pause, step and speed control",
    "Manual face turns",
    "Runs offline in the browser, no cube data sent to a server",
  ],
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: SITE_NAME,
      item: `${SITE_URL}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Solve",
      item: `${SITE_URL}/solve`,
    },
  ],
};

export default function SolvePage() {
  return (
    <div className="bg-zinc-950 text-zinc-100">
      <JsonLd data={appSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* The interactive solver owns the first viewport (h-dvh). */}
      <SolveClient />

      {/* Server-rendered reference content below the app. This is the only
          indexable copy on the route — the solver itself is client-only. */}
      <article className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">
          Rubik&apos;s Cube solver
        </h1>
        <p className="mt-5 text-base leading-relaxed text-zinc-400">
          This is a free 3D Rubik&apos;s Cube solver that runs entirely in your
          browser. It scrambles a standard 3×3×3 cube, solves it with the
          Kociemba two-phase algorithm in about twenty moves, and animates every
          turn so you can follow the solution one move at a time. Nothing about
          your cube is sent to a server.
        </p>

        <h2 className="mt-12 text-2xl font-bold tracking-tight">
          How to use the solver
        </h2>
        <ol className="mt-6 space-y-4">
          {STEPS.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="mt-0.5 font-mono text-sm text-emerald-400">
                {i + 1}
              </span>
              <p className="text-base leading-relaxed text-zinc-400">{step}</p>
            </li>
          ))}
        </ol>

        <h2 className="mt-12 text-2xl font-bold tracking-tight">
          Reading the solution: cube notation
        </h2>
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          Solutions are written in standard Singmaster notation. Each letter is
          one face of the cube, seen from the outside:
        </p>
        <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {NOTATION.map((n) => (
            <div
              key={n.face}
              className="flex items-baseline gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3"
            >
              <dt className="font-mono text-base font-semibold text-emerald-400">
                {n.face}
              </dt>
              <dd className="text-sm text-zinc-400">
                <span className="text-zinc-200">{n.name}</span> — {n.note}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-base leading-relaxed text-zinc-400">
          A letter on its own is a quarter turn clockwise. An apostrophe means
          counterclockwise, so <span className="font-mono text-zinc-200">R&apos;</span>{" "}
          is the right face turned counterclockwise. A{" "}
          <span className="font-mono text-zinc-200">2</span> means a half turn,
          so <span className="font-mono text-zinc-200">U2</span> is the up face
          turned twice. Clockwise is always judged while looking directly at
          that face.
        </p>

        <h2 className="mt-12 text-2xl font-bold tracking-tight">
          Why solutions are about twenty moves
        </h2>
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          A 3×3×3 cube has 43,252,003,274,489,856,000 reachable positions, and
          every one of them can be solved in at most twenty moves — a result
          known as God&apos;s number. Searching for that provably shortest
          solution is expensive, so this solver uses Kociemba&apos;s two-phase
          method instead: phase one moves the cube into a restricted subgroup,
          and phase two finishes it inside that much smaller space. The result
          lands near twenty moves in milliseconds.{" "}
          <Link
            href="/#how-it-works"
            className="text-emerald-400 underline underline-offset-4 hover:text-emerald-300"
          >
            More on how the algorithm works
          </Link>
          .
        </p>
      </article>

      <SiteFooter />
    </div>
  );
}
