import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/useAuth";
import { fetchFileContent } from "@/lib/github/githubApi";

// Fetches raw file content at a specific commit ref.
// Used by the diff engine to supply head content for semantic parsing.
export function useFileContent(
  owner: string,
  repo: string,
  path: string,
  ref: string,
) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["github", "file-content", owner, repo, path, ref],
    queryFn: () => fetchFileContent(owner, repo, path, ref),
    enabled: isAuthenticated && Boolean(ref),
    // Content at a specific SHA is immutable — keep it cached for the session.
    staleTime: Infinity,
    gcTime: 30 * 60_000,
  });
}
