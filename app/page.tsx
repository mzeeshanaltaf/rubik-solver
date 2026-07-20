import type { Metadata } from "next";
import { SiteNav } from "@/components/landing/site-nav";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Stats } from "@/components/landing/stats";
import { Faq } from "@/components/landing/faq";
import { CtaFooter } from "@/components/landing/cta-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { FAQ } from "@/lib/faq";
import { SITE_URL, SITE_NAME, AUTHOR } from "@/lib/site";

export const metadata: Metadata = {
  description:
    "A 3D Rubik's Cube solver in your browser. Kociemba two-phase solutions of about twenty moves, animated move by move with full playback controls.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Rubik Solver: 3D Rubik's Cube Solver in the Browser",
    description:
      "A 3D Rubik's Cube solver in your browser. Kociemba two-phase solutions, animated move by move.",
    type: "website",
    url: "/",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  description:
    "A 3D Rubik's Cube solver that runs entirely in the browser, using the Kociemba two-phase algorithm.",
  inLanguage: "en",
  author: {
    "@type": "Person",
    name: AUTHOR.name,
    url: AUTHOR.url,
  },
  publisher: {
    "@type": "Person",
    name: AUTHOR.name,
    url: AUTHOR.url,
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function Home() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <JsonLd data={websiteSchema} />
      <JsonLd data={faqSchema} />
      <SiteNav />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Stats />
        <Faq />
        <CtaFooter />
      </main>
    </div>
  );
}
