import { SITE_URL } from "@/lib/site";
import { FAQ } from "@/lib/faq";

/**
 * llms.txt — a plain-text map of the site for AI crawlers and assistants.
 * Built from SITE_URL and the shared FAQ so it cannot drift from the pages.
 * See https://llmstxt.org for the convention.
 */
// Content is fully static (no request-time APIs), so prerender it at build.
export const dynamic = "force-static";

export function GET() {
  const body = `# Rubik Solver

> A free 3D Rubik's Cube solver that runs entirely in the browser. It scrambles a standard 3x3x3 cube, solves it with the Kociemba two-phase algorithm in about twenty moves, and animates every turn with full playback controls. No account, no server round-trip, no cube data leaves the user's device.

## Pages

- [Home](${SITE_URL}/): What the solver does, how the two-phase algorithm works, and a real worked example of a scramble and its solution.
- [Solver](${SITE_URL}/solve): The interactive 3D solver itself, plus cube-notation reference and usage instructions. The cube is rendered client-side with WebGL; the surrounding reference text is server-rendered.
- [Contact](${SITE_URL}/contact): Feedback, bug reports, and feature requests.
- [Privacy](${SITE_URL}/privacy): Data handling. The solver runs locally; analytics are self-hosted and cookieless.

## Key facts

- Solving method: Kociemba's two-phase algorithm. Phase one reduces the cube into a restricted subgroup; phase two finishes it inside that smaller search space.
- Typical solution length: about 20 moves.
- God's number is 20: every one of the 43,252,003,274,489,856,000 reachable positions of a 3x3x3 cube is solvable in 20 moves or fewer (half-turn metric).
- Notation: U, R, F, D, L, B are the up, right, front, down, left and back faces. A bare letter is a quarter turn clockwise, an apostrophe (R') is counterclockwise, and a 2 (U2) is a half turn.
- The solver runs in a Web Worker in the browser. Cube state is never transmitted to a server.
- Cost: free, no account required.
- Limitation: you cannot yet input the state of your own physical cube. The app scrambles for you, and manual face turns let you reach a specific position.

## FAQ

${FAQ.map((item) => `### ${item.q}\n\n${item.a}`).join("\n\n")}

## Tech

Next.js (App Router), React, TypeScript, Tailwind CSS, three.js via @react-three/fiber, and the cubejs library for the cube model and solver.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
