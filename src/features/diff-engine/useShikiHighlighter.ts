import { useEffect, useState } from "react";
import type { Highlighter } from "shiki";

// Lazily loaded shiki highlighter — only created once per session.
// We bundle a minimal set of languages to keep the initial parse fast.
let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = import("shiki").then(({ createHighlighter }) =>
      createHighlighter({
        themes: ["github-dark-dimmed"],
        langs: [
          "typescript",
          "tsx",
          "javascript",
          "jsx",
          "json",
          "css",
          "html",
          "markdown",
          "yaml",
          "bash",
        ],
      }),
    );
  }
  return highlighterPromise;
}

export function useShikiHighlighter(): Highlighter | null {
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);

  useEffect(() => {
    let cancelled = false;
    getHighlighter()
      .then((h) => {
        if (!cancelled) setHighlighter(h);
      })
      .catch(() => {
        /* fall back to plain text */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return highlighter;
}
