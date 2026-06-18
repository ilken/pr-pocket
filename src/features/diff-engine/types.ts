export type LineType = "add" | "remove" | "context";

export type DiffLine = {
  type: LineType;
  content: string;
  // New-file line number (undefined for removed lines — they have no new position).
  newLineNumber: number | undefined;
  // Old-file line number (undefined for added lines).
  oldLineNumber: number | undefined;
};

export type ChangeGroupKind =
  | "function" // Lines grouped under a named function/method scope
  | "module" // Top-level changes outside any function (imports, exports, etc.)
  | "hunk"; // Fallback: one group per raw diff hunk (no semantic parsing)

export type ChangeGroup = {
  id: string;
  kind: ChangeGroupKind;
  // Human-readable label shown as the card header.
  label: string;
  // First line of the function signature (shown as subtitle for function groups).
  signature: string | undefined;
  lines: DiffLine[];
  additions: number;
  deletions: number;
};
