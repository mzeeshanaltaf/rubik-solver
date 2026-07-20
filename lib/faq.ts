/**
 * Single source for the landing-page FAQ. The visible section and the FAQPage
 * JSON-LD both read this array, so the markup can never drift from the copy.
 */
export const FAQ = [
  {
    q: "Is this Rubik's Cube solver free?",
    a: "Yes. There is no account, no paywall, and no usage limit. Open the solver and use it.",
  },
  {
    q: "Does my cube data get sent to a server?",
    a: "No. The solver runs in a Web Worker in your browser. Scrambles, cube states, and solutions are computed on your own device, so nothing about your cube leaves it.",
  },
  {
    q: "What is the Kociemba two-phase algorithm?",
    a: "It solves a cube in two stages. Phase one finds a short sequence that brings the cube into a restricted subgroup where every remaining position can be reached with half turns plus U and D quarter turns. Phase two finishes inside that much smaller search space. Splitting the problem this way finds a near-optimal solution in milliseconds instead of searching the whole cube at once.",
  },
  {
    q: "How many moves does a solution take?",
    a: "Usually around twenty. That is close to God's number without the cost of an exhaustive optimal search.",
  },
  {
    q: "What is God's number?",
    a: "Twenty. It is the proven maximum: every one of the 43,252,003,274,489,856,000 reachable positions of a 3x3x3 cube can be solved in twenty moves or fewer, in the half-turn metric.",
  },
  {
    q: "What do the letters in the solution mean?",
    a: "They are standard cube notation. U, R, F, D, L and B are the up, right, front, down, left and back faces. A plain letter is a quarter turn clockwise, an apostrophe means counterclockwise, and a 2 means a half turn. So R' is the right face turned counterclockwise and U2 is the up face turned twice.",
  },
  {
    q: "Can it solve any scramble?",
    a: "Any position reachable by turning a standard 3x3x3 cube, yes. Physically impossible states, such as a single flipped edge or a cube with mismatched stickers, cannot be solved and are not reachable through the app.",
  },
  {
    q: "Can I enter the state of my own physical cube?",
    a: "Not yet. The app scrambles a cube for you, and manual mode lets you turn any face yourself to reach a specific position. Solving from a scanned or hand-entered state is not currently supported.",
  },
] as const;
