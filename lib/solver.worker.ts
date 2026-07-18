import Cube from "cubejs";

export type SolverRequest =
  | { type: "init" }
  | { type: "solve"; facelets: string };

export type SolverResponse =
  | { type: "ready" }
  | { type: "solution"; alg: string }
  | { type: "error"; message: string };

const ctx = self as unknown as {
  postMessage: (msg: SolverResponse) => void;
  onmessage: ((e: MessageEvent<SolverRequest>) => void) | null;
};

let initialized = false;

ctx.onmessage = (e: MessageEvent<SolverRequest>) => {
  const msg = e.data;
  try {
    if (msg.type === "init") {
      if (!initialized) {
        Cube.initSolver();
        initialized = true;
      }
      ctx.postMessage({ type: "ready" });
    } else if (msg.type === "solve") {
      if (!initialized) {
        Cube.initSolver();
        initialized = true;
      }
      const cube = Cube.fromString(msg.facelets);
      const alg = cube.isSolved() ? "" : cube.solve();
      ctx.postMessage({ type: "solution", alg });
    }
  } catch (err) {
    ctx.postMessage({
      type: "error",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};
