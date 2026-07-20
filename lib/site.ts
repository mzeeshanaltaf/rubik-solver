/**
 * Single source of truth for the site's public origin.
 *
 * The production domain is the *fallback* (not localhost) on purpose: this
 * value is inlined at build time, so if `NEXT_PUBLIC_SITE_URL` is ever missing
 * from the Coolify build environment, metadata degrades to correct-in-
 * production rather than emitting localhost URLs into canonicals and OG tags.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://rubiksolver.zeeshanai.cloud";

export const SITE_NAME = "Rubik Solver";

export const AUTHOR = {
  name: "Zeeshan Altaf",
  url: "https://www.zeeshanai.cloud",
} as const;
