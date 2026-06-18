import type { ParsedHunk } from "./diffParser";
import type { Scope } from "./scopeMapper";
import { findInnermostScope } from "./scopeMapper";
import type { ChangeGroup, DiffLine } from "./types";

// Groups parsed hunks by the enclosing function scope.
// Each unique scope becomes one ChangeGroup; changes outside all scopes are
// merged into a single "Module" group. Multiple discontiguous hunks for the
// same function are merged into one group.
export function groupByScopes(
  hunks: ParsedHunk[],
  scopes: Scope[],
  filename: string,
): ChangeGroup[] {
  // scopeKey → accumulated lines for that scope
  const groupMap = new Map<
    string,
    { scope: Scope | null; lines: DiffLine[] }
  >();
  const groupOrder: string[] = [];

  const getOrCreate = (key: string, scope: Scope | null) => {
    if (!groupMap.has(key)) {
      groupMap.set(key, { scope, lines: [] });
      groupOrder.push(key);
    }
    return groupMap.get(key)!;
  };

  for (const hunk of hunks) {
    // Group lines within a hunk by their enclosing scope. We accumulate
    // consecutive lines for the same scope together so context lines
    // surrounding changed lines stay attached to their scope.
    let currentKey: string | null = null;
    let buffer: DiffLine[] = [];

    const flush = (nextKey: string) => {
      if (currentKey !== null && buffer.length > 0) {
        getOrCreate(currentKey, getScopeForKey(currentKey, scopes)).lines.push(
          ...buffer,
        );
        buffer = [];
      }
      currentKey = nextKey;
    };

    for (const line of hunk.lines) {
      // Use the new-file line for scope mapping (add + context); removed
      // lines have no new position but we keep them attached to the same scope
      // as the surrounding context.
      const lineNumber = line.newLineNumber;
      let scope: Scope | null = null;
      if (lineNumber !== undefined) {
        scope = findInnermostScope(scopes, lineNumber);
      }
      const key = scope ? `fn:${scope.name}:${scope.startLine}` : "module";
      if (key !== currentKey) flush(key);
      buffer.push(line);
    }
    // Flush remaining buffer.
    if (currentKey !== null && buffer.length > 0) {
      getOrCreate(currentKey, getScopeForKey(currentKey, scopes)).lines.push(
        ...buffer,
      );
    }
  }

  return groupOrder.map((key, index) => {
    const entry = groupMap.get(key)!;
    const isModule = key === "module";
    const { scope } = entry;

    const additions = entry.lines.filter((l) => l.type === "add").length;
    const deletions = entry.lines.filter((l) => l.type === "remove").length;

    const label = isModule
      ? `Module scope — ${filename.split("/").pop() ?? filename}`
      : (scope?.name ?? "function");

    const signature = isModule
      ? undefined
      : (entry.lines.find((l) => l.type === "context")?.content ??
        entry.lines[0]?.content);

    return {
      id: `${filename}:${index}:${key}`,
      kind: isModule ? ("module" as const) : ("function" as const),
      label,
      signature,
      lines: entry.lines,
      additions,
      deletions,
    };
  });
}

function getScopeForKey(key: string, scopes: Scope[]): Scope | null {
  if (key === "module") return null;
  // key format: "fn:{name}:{startLine}"
  const parts = key.split(":");
  const startLine = parseInt(parts[2] ?? "", 10);
  const name = parts[1] ?? "";
  return (
    scopes.find((s) => s.name === name && s.startLine === startLine) ?? null
  );
}

// Fallback: one ChangeGroup per raw hunk, no semantic grouping.
export function groupByHunks(
  hunks: ParsedHunk[],
  filename: string,
): ChangeGroup[] {
  return hunks.map((hunk, index) => ({
    id: `${filename}:hunk:${index}`,
    kind: "hunk" as const,
    label: hunk.header,
    signature: undefined,
    lines: hunk.lines,
    additions: hunk.additions,
    deletions: hunk.deletions,
  }));
}
