import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { SiteNav } from "@/components/landing/site-nav";
import { SiteFooter } from "@/components/landing/site-footer";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact & Feedback",
  description:
    "Share feedback on Rubik Solver, report a bug, or suggest a feature.",
};

// Short error codes set by the API route's redirect (?error=...) mapped to
// human-readable copy. Keep keys in sync with the route handler's fail() calls.
const ERROR_MESSAGES: Record<string, string> = {
  fields: "Please fill in all fields.",
  email: "Please enter a valid email address.",
  length: "Message must be 5000 characters or fewer.",
  rate: "Too many submissions. Please try again later.",
  server: "Service is temporarily unavailable. Please try again later.",
  parse: "Invalid submission. Please try again.",
};

type Props = {
  searchParams: Promise<{ sent?: string; error?: string }>;
};

export default async function ContactPage({ searchParams }: Props) {
  const { sent, error } = await searchParams;
  const initialError = error
    ? (ERROR_MESSAGES[error] ?? "Something went wrong. Please try again.")
    : undefined;

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-950 text-zinc-100">
      <SiteNav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-14 sm:py-20">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-zinc-900 ring-1 ring-zinc-800">
            <Mail className="size-5 text-emerald-400" />
          </span>
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">
              Contact &amp; Feedback
            </h1>
            <p className="mt-2 max-w-lg text-base leading-relaxed text-zinc-400">
              Found a bug, have an idea, or just want to say hi? Send a message
              — we read everything.
            </p>
          </div>
        </div>

        <div className="relative mt-10 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
          <ContactForm initialSuccess={!!sent} initialError={initialError} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
