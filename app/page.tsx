import type { Metadata } from "next";
import { SiteNav } from "@/components/landing/site-nav";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Stats } from "@/components/landing/stats";
import { CtaFooter } from "@/components/landing/cta-footer";

export const metadata: Metadata = {
  description:
    "A 3D Rubik's Cube solver in your browser. Kociemba two-phase solutions of about twenty moves, animated move by move with full playback controls.",
  openGraph: {
    title: "Rubik Solver",
    description:
      "A 3D Rubik's Cube solver in your browser. Kociemba two-phase solutions, animated move by move.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Home() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <SiteNav />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Stats />
        <CtaFooter />
      </main>
    </div>
  );
}
