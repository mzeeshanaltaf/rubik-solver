import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-8 text-center text-xs text-zinc-500 md:flex-row md:justify-between md:gap-6 md:text-left">
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link href="/solve" className="transition-colors hover:text-zinc-300">
            Solve a cube
          </Link>
          <Link
            href="/contact"
            className="transition-colors hover:text-zinc-300"
          >
            Contact
          </Link>
          <Link
            href="/privacy"
            className="transition-colors hover:text-zinc-300"
          >
            Privacy Policy
          </Link>
        </nav>
        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-3">
          <p>Built with Next.js, three.js, and cubejs</p>
          <span aria-hidden className="hidden text-zinc-700 md:inline">
            •
          </span>
          <p>
            Developed with 💖 by{" "}
            <a
              href="https://www.zeeshanai.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-400 transition-colors hover:text-emerald-400"
            >
              Zeeshan Altaf
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
