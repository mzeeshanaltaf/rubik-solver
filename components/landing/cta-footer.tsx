import Link from "next/link";
import { Reveal } from "./reveal";
import { SiteFooter } from "./site-footer";

export function CtaFooter() {
  return (
    <>
      <section>
        <div className="mx-auto max-w-6xl px-6 py-28 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tighter text-zinc-100 md:text-4xl">
              Your scramble is waiting.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/solve"
              className="mt-8 inline-block rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 active:translate-y-px"
            >
              Solve a cube
            </Link>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
