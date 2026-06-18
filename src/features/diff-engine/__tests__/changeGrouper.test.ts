import { describe, expect, it } from "vitest";
import { groupByHunks } from "../changeGrouper";
import type { ParsedHunk } from "../diffParser";

const makeHunk = (overrides: Partial<ParsedHunk> = {}): ParsedHunk => ({
  header: "@@ -1,3 +1,4 @@",
  lines: [
    {
      type: "context",
      content: "const x = 1",
      newLineNumber: 1,
      oldLineNumber: 1,
    },
    {
      type: "add",
      content: "const y = 2",
      newLineNumber: 2,
      oldLineNumber: undefined,
    },
  ],
  additions: 1,
  deletions: 0,
  newStartLine: 1,
  ...overrides,
});

describe("groupByHunks", () => {
  it("produces one group per hunk", () => {
    const hunks = [
      makeHunk(),
      makeHunk({ header: "@@ -5,3 +6,3 @@", newStartLine: 6 }),
    ];
    const groups = groupByHunks(hunks, "src/foo.ts");
    expect(groups).toHaveLength(2);
    expect(groups[0]!.kind).toBe("hunk");
    expect(groups[1]!.kind).toBe("hunk");
  });

  it("uses the hunk header as the label", () => {
    const groups = groupByHunks([makeHunk()], "src/foo.ts");
    expect(groups[0]!.label).toBe("@@ -1,3 +1,4 @@");
  });

  it("generates stable unique IDs that include the filename", () => {
    const groups = groupByHunks([makeHunk(), makeHunk()], "src/foo.ts");
    expect(groups[0]!.id).toContain("src/foo.ts");
    expect(groups[0]!.id).not.toBe(groups[1]!.id);
  });

  it("counts additions and deletions correctly", () => {
    const hunk = makeHunk({
      lines: [
        {
          type: "add",
          content: "+1",
          newLineNumber: 1,
          oldLineNumber: undefined,
        },
        {
          type: "add",
          content: "+2",
          newLineNumber: 2,
          oldLineNumber: undefined,
        },
        {
          type: "remove",
          content: "-1",
          newLineNumber: undefined,
          oldLineNumber: 1,
        },
      ],
      additions: 2,
      deletions: 1,
    });
    const groups = groupByHunks([hunk], "src/foo.ts");
    expect(groups[0]!.additions).toBe(2);
    expect(groups[0]!.deletions).toBe(1);
  });

  it("returns empty array for no hunks", () => {
    expect(groupByHunks([], "src/foo.ts")).toHaveLength(0);
  });
});
