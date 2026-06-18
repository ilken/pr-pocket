// Public API for the semantic diff engine.
//
// Given a PR file's patch string and (optionally) the head file content,
// returns an ordered list of ChangeGroups for the review UI to display
// one at a time.

import { parseFilePatch } from "./diffParser";
import { extractScopes } from "./scopeMapper";
import { groupByHunks, groupByScopes } from "./changeGrouper";
import { getParserForExtension } from "./treeSitterLoader";
import type { ChangeGroup } from "./types";

function fileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

export async function groupFileChanges(
  filename: string,
  patch: string | undefined,
  headContent: string | null,
): Promise<ChangeGroup[]> {
  const { hunks, isBinary } = parseFilePatch(patch);
  if (isBinary || hunks.length === 0) return [];

  const ext = fileExtension(filename);

  // Try semantic grouping for supported extensions with available head content.
  if (headContent !== null) {
    const parser = await getParserForExtension(ext).catch(() => null);
    if (parser) {
      try {
        const tree = parser.parse(headContent);
        if (!tree) throw new Error("parse returned null");
        const scopes = extractScopes(tree.rootNode);
        const groups = groupByScopes(hunks, scopes, filename);
        // If grouping produced at least one meaningful group, use it.
        if (groups.length > 0) return groups;
      } catch {
        // Parsing failed (e.g. syntax error in the file) — fall through to hunk fallback.
      }
    }
  }

  // Fallback: one group per raw hunk.
  return groupByHunks(hunks, filename);
}
