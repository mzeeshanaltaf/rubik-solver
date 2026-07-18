import { DEMO_SOLVES } from "@/lib/demo-solves";
import { Reveal } from "./reveal";

const STEPS = [
  {
    lead: "Reduce the cube.",
    body: "Phase one searches for a short sequence that brings every edge and corner orientation into a restricted subgroup.",
  },
  {
    lead: "Finish inside it.",
    body: "Phase two solves the rest using only half turns and U or D quarter turns, where the remaining search space is tiny.",
  },
  {
    lead: "Stay near optimal.",
    body: "Chained together, both phases land around twenty moves, close to God's number, without exhaustive search.",
  },
];

export function HowItWorks() {
  const trace = DEMO_SOLVES[0];
  const moveCount = trace.solution.split(/\s+/).length;

  return (
    <section id="how-it-works" className="scroll-mt-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-24 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tighter text-zinc-100 md:text-4xl">
              Two phases, one short path
            </h2>
          </Reveal>
          <ol className="mt-8 space-y-6">
            {STEPS.map((step, i) => (
              <Reveal key={step.lead} delay={i * 0.08}>
                <li className="flex gap-4">
                  <span className="mt-0.5 font-mono text-sm text-emerald-400">
                    {i + 1}
                  </span>
                  <p className="text-base leading-relaxed text-zinc-400">
                    <span className="font-semibold text-zinc-200">
                      {step.lead}
                    </span>{" "}
                    {step.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={0.12} className="self-center">
          <figure className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 font-mono text-sm leading-relaxed">
            <figcaption className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              A real solve from this app
            </figcaption>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs text-zinc-500">scramble</dt>
                <dd className="mt-1 break-words text-zinc-300">
                  {trace.scramble}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">solution</dt>
                <dd className="mt-1 break-words text-emerald-400">
                  {trace.solution}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">length</dt>
                <dd className="mt-1 text-zinc-300">{moveCount} moves</dd>
              </div>
            </dl>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
