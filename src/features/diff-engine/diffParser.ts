import parseDiff from "parse-diff";
import type { DiffLine } from "./types";

export type ParsedHunk = {
  // Header context line, e.g. "@@ -10,7 +10,8 @@ function foo()"
  header: string;
  lines: DiffLine[];
  additions: number;
  deletions: number;
  // First new-file line number in this hunk (used for scope mapping).
  newStartLine: number;
};

export type ParsedFileDiff = {
  hunks: ParsedHunk[];
  isBinary: boolean;
};

export function parseFilePatch(patch: string | undefined): ParsedFileDiff {
  if (!patch) {
    return { hunks: [], isBinary: false };
  }

  // parse-diff expects a full diff header; we prepend a dummy one so it can
  // parse a bare patch string (as GitHub provides per-file).
  const fullDiff = `diff --git a/file b/file\n--- a/file\n+++ b/file\n${patch}`;
  const files = parseDiff(fullDiff);
  const file = files[0];

  if (!file) return { hunks: [], isBinary: false };

  const hunks: ParsedHunk[] = file.chunks.map((chunk) => {
    const lines: DiffLine[] = chunk.changes.map((change) => {
      if (change.type === "add") {
        return {
          type: "add" as const,
          content: change.content.slice(1), // strip leading '+'
          newLineNumber: change.ln,
          oldLineNumber: undefined,
        };
      }
      if (change.type === "del") {
        return {
          type: "remove" as const,
          content: change.content.slice(1), // strip leading '-'
          newLineNumber: undefined,
          oldLineNumber: change.ln,
        };
      }
      // normal/context
      return {
        type: "context" as const,
        content: change.content.slice(1), // strip leading ' '
        newLineNumber: change.ln2,
        oldLineNumber: change.ln1,
      };
    });

    const additions = lines.filter((l) => l.type === "add").length;
    const deletions = lines.filter((l) => l.type === "remove").length;

    return {
      header: chunk.content,
      lines,
      additions,
      deletions,
      newStartLine: chunk.newStart,
    };
  });

  return { hunks, isBinary: false };
}
