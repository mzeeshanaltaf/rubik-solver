/**
 * Renders a JSON-LD block. Server component — the markup is in the initial
 * HTML, so crawlers and LLMs see it without executing JavaScript.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Keys come from our own static content, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
