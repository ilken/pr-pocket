import type { ChangeGroup } from "@/features/diff-engine/types";
import type { Highlighter } from "shiki";

type DiffCardProps = {
  group: ChangeGroup;
  filename: string;
  highlighter: Highlighter | null;
};

function getLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    json: "json",
    css: "css",
    html: "html",
    md: "markdown",
    yaml: "yaml",
    yml: "yaml",
    sh: "bash",
  };
  return map[ext] ?? "text";
}

type LineProps = {
  type: "add" | "remove" | "context";
  content: string;
  highlightedHtml: string | null;
};

function DiffLine({ type, content, highlightedHtml }: LineProps) {
  const bg =
    type === "add"
      ? "rgba(74,222,128,0.06)"
      : type === "remove"
        ? "rgba(248,113,113,0.06)"
        : "transparent";

  const prefix = type === "add" ? "+" : type === "remove" ? "−" : " ";
  const prefixColor =
    type === "add"
      ? "rgba(74,222,128,0.8)"
      : type === "remove"
        ? "rgba(248,113,113,0.7)"
        : "rgba(255,255,255,0.15)";

  return (
    <div
      className="flex min-h-[1.6rem] items-start gap-2 px-3"
      style={{ background: bg }}
    >
      <span
        className="w-3 shrink-0 select-none pt-0.5 font-mono text-xs"
        style={{ color: prefixColor }}
        aria-hidden
      >
        {prefix}
      </span>
      {highlightedHtml ? (
        <span
          className="min-w-0 flex-1 overflow-x-auto whitespace-pre font-mono text-xs leading-6"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <span className="min-w-0 flex-1 overflow-x-auto whitespace-pre font-mono text-xs leading-6 text-white/75">
          {content}
        </span>
      )}
    </div>
  );
}

function highlightLines(
  lines: ChangeGroup["lines"],
  filename: string,
  highlighter: Highlighter,
): string[] {
  // Build a code block from all lines so shiki tokenises them consistently.
  const code = lines.map((l) => l.content).join("\n");
  const lang = getLanguage(filename);
  try {
    const html = highlighter.codeToHtml(code, {
      lang,
      theme: "github-dark-dimmed",
    });
    // Extract inner <span> lines from the shiki output (each <span class="line">…</span>).
    const lineMatches = [
      ...html.matchAll(/<span class="line">(.*?)<\/span>/gs),
    ];
    return lineMatches.map((m) => m[1] ?? "");
  } catch {
    return lines.map(() => null as unknown as string);
  }
}

export function DiffCard({ group, filename, highlighter }: DiffCardProps) {
  const highlightedLines = highlighter
    ? highlightLines(group.lines, filename, highlighter)
    : null;

  const isFunctionGroup = group.kind === "function";

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border-subtle)",
        // Violet top-line for semantic function groups, gives visual hierarchy
        boxShadow: isFunctionGroup
          ? "inset 0 1px 0 0 var(--accent-border)"
          : "none",
      }}
    >
      {/* Card header */}
      <div
        className="flex items-start gap-3 px-4 py-3"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2">
            {isFunctionGroup ? (
              <span
                className="rounded px-1.5 py-0.5 font-mono text-[10px] font-medium"
                style={{
                  background: "var(--accent-dim)",
                  color: "var(--accent)",
                  border: "1px solid var(--accent-border)",
                }}
              >
                fn
              </span>
            ) : null}
            <p className="truncate font-mono text-xs font-semibold text-white/85">
              {group.label}
            </p>
          </div>
          {group.signature ? (
            <p className="truncate font-mono text-[11px] text-white/35">
              {group.signature.trim()}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2 font-mono text-xs">
          {group.additions > 0 ? (
            <span className="text-green-400">+{group.additions}</span>
          ) : null}
          {group.deletions > 0 ? (
            <span className="text-red-400">-{group.deletions}</span>
          ) : null}
        </div>
      </div>

      {/* Diff lines */}
      <div className="overflow-x-auto py-1">
        {group.lines.map((line, i) => (
          <DiffLine
            key={i}
            type={line.type}
            content={line.content}
            highlightedHtml={highlightedLines?.[i] ?? null}
          />
        ))}
      </div>
    </div>
  );
}
