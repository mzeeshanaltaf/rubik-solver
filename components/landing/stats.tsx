import { Reveal } from "./reveal";

const STATS = [
  {
    value: "43,252,003,274,489,856,000",
    label: "reachable positions of a 3×3×3 cube",
  },
  {
    value: "20",
    label: "God's number: the most moves any position ever needs",
  },
  {
    value: "2",
    label: "search phases in Kociemba's algorithm",
  },
];

export function Stats() {
  return (
    <section
      aria-labelledby="stats-heading"
      className="border-y border-zinc-800/80 bg-zinc-900/30"
    >
      {/* Visually hidden: keeps the band's terse design while giving the
          section a real heading in the document outline. */}
      <h2 id="stats-heading" className="sr-only">
        The numbers behind a Rubik&apos;s Cube solve
      </h2>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-[2fr_1fr_1fr] md:gap-8">
        {STATS.map((stat, i) => (
          <Reveal key={stat.value} delay={i * 0.08}>
            <div>
              <p className="wrap-break-word font-mono text-2xl font-semibold tabular-nums text-zinc-100 md:text-[1.7rem]">
                {stat.value}
              </p>
              <p className="mt-2 max-w-[32ch] text-sm leading-relaxed text-zinc-400">
                {stat.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
