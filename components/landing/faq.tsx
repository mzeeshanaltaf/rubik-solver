import { FAQ } from "@/lib/faq";
import { Reveal } from "./reveal";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tighter text-zinc-100 md:text-4xl">
            Questions, answered
          </h2>
        </Reveal>

        <dl className="mt-10 space-y-4">
          {FAQ.map((item, i) => (
            <Reveal key={item.q} delay={Math.min(i, 4) * 0.06}>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
                <dt className="text-base font-semibold text-zinc-100">
                  {item.q}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {item.a}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
