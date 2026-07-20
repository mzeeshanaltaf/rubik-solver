import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/landing/site-nav";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Rubik Solver handles your data: the solver runs locally in your browser, the contact form is the only thing we collect, and analytics are cookieless.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy · Rubik Solver",
    description:
      "What Rubik Solver collects, what it doesn't, and why. The solver itself runs entirely in your browser.",
    type: "article",
    url: "/privacy",
  },
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-400">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-zinc-950 text-zinc-100">
      <SiteNav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-14 sm:py-20">
        <h1 className="text-3xl font-bold tracking-tighter">Privacy Policy</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Last updated: July 18, 2026
        </p>

        <p className="mt-6 text-sm leading-relaxed text-zinc-400">
          Rubik Solver is a free, browser-based Rubik&apos;s Cube solver. We
          built it to solve cubes, not to collect data — this page explains the
          little data handling that does happen.
        </p>

        <Section title="The solver runs entirely in your browser">
          <p>
            Scrambles, cube states, and solutions are computed locally on your
            device using the Kociemba two-phase algorithm. Your cube state is
            never sent to our servers, and we don&apos;t require an account to
            use any part of the site.
          </p>
        </Section>

        <Section title="What we collect through the contact form">
          <p>
            If you use the{" "}
            <Link
              href="/contact"
              className="text-emerald-400 transition-colors hover:text-emerald-300"
            >
              contact form
            </Link>
            , we receive the name, email address, and message you submit. We use
            this information only to read and respond to your message, and we
            don&apos;t share it with anyone else or use it for marketing.
          </p>
          <p>
            To protect the form from abuse, submissions are rate-limited by IP
            address. The IP address is used solely for this throttling and is
            retained only briefly for that purpose.
          </p>
        </Section>

        <Section title="Cookies and analytics">
          <p>
            The site does not set tracking cookies and does not run advertising
            or cross-site tracking of any kind.
          </p>
          <p>
            We do measure basic, aggregate traffic — page views, referrer, and
            general country — using Umami, a cookieless analytics tool we host
            ourselves on our own infrastructure. No data is handed to a
            third-party advertising network, nothing is used to build a profile
            of you, and no individual visitor is identified.
          </p>
        </Section>

        <Section title="Hosting">
          <p>
            Like virtually every website, our hosting infrastructure may keep
            standard server logs (such as IP address, user agent, and requested
            pages) for security and operational purposes. These logs are not
            used to identify or profile you.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If we ever change how the site handles data, we will update this
            page and the date above.
          </p>
        </Section>

        <Section title="Questions">
          <p>
            Anything unclear, or a concern about your data? Reach out through
            the{" "}
            <Link
              href="/contact"
              className="text-emerald-400 transition-colors hover:text-emerald-300"
            >
              contact page
            </Link>
            .
          </p>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}
