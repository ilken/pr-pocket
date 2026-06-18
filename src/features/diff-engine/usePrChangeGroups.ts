import { useQueries } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/useAuth";
import { fetchFileContent } from "@/lib/github/githubApi";
import type { PrFile } from "@/types/github.types";
import { groupFileChanges } from "./diffEngine";
import type { ChangeGroup } from "./types";

// Extensions we attempt to semantically parse.
const SEMANTIC_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

function needsContent(file: PrFile): boolean {
  const ext = `.${file.filename.split(".").pop()?.toLowerCase() ?? ""}`;
  return SEMANTIC_EXTS.has(ext) && Boolean(file.patch);
}

export type FileContentState = {
  file: PrFile;
  content: string | null;
  isLoading: boolean;
  error: unknown;
};

// Fetches head file contents for TS/JS files in parallel so the review UI
// can compute change groups when both patch and content are ready.
export function usePrFileContents(
  owner: string,
  repo: string,
  files: PrFile[],
  headSha: string,
): FileContentState[] {
  const { isAuthenticated } = useAuth();

  const queries = useQueries({
    queries: files.map((file) => ({
      queryKey: ["github", "file-content", owner, repo, file.filename, headSha],
      queryFn: () => fetchFileContent(owner, repo, file.filename, headSha),
      enabled: isAuthenticated && Boolean(headSha) && needsContent(file),
      staleTime: Infinity,
      gcTime: 30 * 60_000,
    })),
  });

  return files.map((file, index) => {
    const q = queries[index]!;
    return {
      file,
      content: q.data ?? null,
      isLoading: needsContent(file) ? q.isLoading : false,
      error: q.error,
    };
  });
}

// Imperative: given a file + its head content, compute change groups.
// Called from the review UI once content is available.
export async function computeChangeGroups(
  file: PrFile,
  headContent: string | null,
): Promise<ChangeGroup[]> {
  return groupFileChanges(file.filename, file.patch, headContent);
}
