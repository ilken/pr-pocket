import { describe, expect, it } from "vitest";
import { parseFilePatch } from "../diffParser";

const SAMPLE_PATCH = `@@ -1,5 +1,7 @@
 export function greet(name: string) {
-  return 'hello'
+  const message = \`hello, \${name}\`
+  console.log(message)
+  return message
 }

 export function goodbye() {`;

describe("parseFilePatch", () => {
  it("returns empty hunks for undefined patch", () => {
    const result = parseFilePatch(undefined);
    expect(result.hunks).toHaveLength(0);
    expect(result.isBinary).toBe(false);
  });

  it("parses a basic patch into hunks and lines", () => {
    const result = parseFilePatch(SAMPLE_PATCH);
    expect(result.hunks).toHaveLength(1);
    const hunk = result.hunks[0]!;
    expect(hunk.additions).toBe(3);
    expect(hunk.deletions).toBe(1);
    expect(hunk.newStartLine).toBe(1);
  });

  it("strips leading +/- from line content", () => {
    const result = parseFilePatch(SAMPLE_PATCH);
    const addLine = result.hunks[0]!.lines.find((l) => l.type === "add")!;
    expect(addLine.content).not.toMatch(/^\+/);
    const removeLine = result.hunks[0]!.lines.find((l) => l.type === "remove")!;
    expect(removeLine.content).not.toMatch(/^-/);
  });

  it("assigns new line numbers to added lines", () => {
    const result = parseFilePatch(SAMPLE_PATCH);
    const addLines = result.hunks[0]!.lines.filter((l) => l.type === "add");
    for (const line of addLines) {
      expect(line.newLineNumber).toBeDefined();
      expect(line.oldLineNumber).toBeUndefined();
    }
  });

  it("assigns old line numbers to removed lines", () => {
    const result = parseFilePatch(SAMPLE_PATCH);
    const removeLines = result.hunks[0]!.lines.filter(
      (l) => l.type === "remove",
    );
    for (const line of removeLines) {
      expect(line.oldLineNumber).toBeDefined();
      expect(line.newLineNumber).toBeUndefined();
    }
  });
});
